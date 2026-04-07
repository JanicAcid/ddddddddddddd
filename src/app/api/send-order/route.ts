import { Resend } from 'resend'

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

/**
 * Resend-аккаунт в тестовом режиме: отправка возможна только на
 * email владельца аккаунта (janicacid@gmail.com).
 * Когда домен будет верифицирован в Resend, можно будет отправлять
 * на любой адрес — для этого задайте RESEND_ORDER_EMAIL.
 */
const FALLBACK_TO = 'janicacid@gmail.com'
const TELLUR_EMAIL = 'push@tellur.spb.ru'

// ============================================================================
// TELEGRAM — отправка дубликата заказа в чат
// ============================================================================

async function sendToTelegram(subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.warn('Telegram not configured: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')
    return { ok: false, error: 'Telegram not configured' }
  }

  try {
    // Вырезаем текст из HTML — берём содержимое body
    const textMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    const rawHtml = textMatch ? textMatch[1] : html

    // Простая конвертация HTML → Telegram-совместимый текст
    let text = rawHtml
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/tr>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<h[1-6][^>]*>/gi, '🔑 ')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<th[^>]*>/gi, '')
      .replace(/<td[^>]*>/gi, ' | ')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<strong[^>]*>/gi, '*')
      .replace(/<\/strong>/gi, '*')
      .replace(/<b[^>]*>/gi, '*')
      .replace(/<\/b>/gi, '*')
      .replace(/<em[^>]*>/gi, '_')
      .replace(/<\/em>/gi, '_')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
      .replace(/<[^>]+>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    // Ограничение длины сообщения Telegram (4096 символов)
    const MAX_LEN = 4096
    if (text.length > MAX_LEN) {
      text = text.slice(0, MAX_LEN - 50) + '\n\n... (сообщение обрезано)'
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `📋 *${subject}*\n\n${text}`,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      })
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Telegram API error:', err)
      return { ok: false, error: err }
    }

    return { ok: true }
  } catch (err) {
    console.error('Telegram send error:', err)
    return { ok: false, error: String(err) }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, html, replyTo } = body

    if (!subject || !html) {
      return Response.json({ error: 'Missing required fields: subject, html' }, { status: 400 })
    }

    // Отправляем в Telegram (фоновая задача, не блокирует ответ)
    sendToTelegram(subject, html).catch(err => console.error('Telegram background send error:', err))

    // Отправляем email через Resend (если настроен)
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured — email not sent, only Telegram')
      return Response.json({
        success: true,
        telegramSent: true,
        emailSent: false,
        message: 'Telegram отправлен, email не настроен (нет RESEND_API_KEY)'
      })
    }

    const resend = getResend()

    // В тестовом режиме Resend позволяет отправлять только на email владельца аккаунта.
    // Если домен верифицирован и задан RESEND_ORDER_EMAIL — отправляем туда.
    // Иначе — на FALLBACK_TO (email владельца Resend-аккаунта).
    const recipient = process.env.RESEND_ORDER_EMAIL || FALLBACK_TO

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Теллур-Интех <onboarding@resend.dev>',
      to: [recipient],
      subject,
      html,
      replyTo: replyTo || undefined,
    })

    const sentToFallback = !process.env.RESEND_ORDER_EMAIL

    if (error) {
      console.error('Resend error:', error)
      return Response.json({ error: error.message, telegramSent: true }, { status: 500 })
    }

    return Response.json({
      success: true,
      messageId: data?.id,
      sentTo: recipient,
      sentToFallback,
      telegramSent: true
    })
  } catch (err) {
    console.error('Send order error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
