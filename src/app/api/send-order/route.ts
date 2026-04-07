// ============================================================================
// ОТПРАВКА ЗАКАЗА — Telegram: текстовое резюме + HTML-файл заказ-наряда
// ============================================================================

import { TELEGRAM_BOT_TOKEN, OPERATOR_CHAT_ID } from '@/config/telegram'

const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

/**
 * Отправляет короткое текстовое сообщение + HTML-файл как документ
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subject, html } = body

    if (!subject || !html) {
      return Response.json({ error: 'Missing required fields: subject, html' }, { status: 400 })
    }

    if (!TELEGRAM_BOT_TOKEN || !OPERATOR_CHAT_ID) {
      console.warn('Telegram not configured')
      return Response.json({ error: 'Telegram not configured' }, { status: 500 })
    }

    // ---- 1. Извлекаем краткий текст из HTML для превью ----
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    const raw = bodyMatch ? bodyMatch[1] : html

    let summary = raw
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/tr>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<h[1-6][^>]*>/gi, '')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<th[^>]*>/gi, '')
      .replace(/<td[^>]*>/gi, ' | ')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n')
      .trim()

    // Берём первые 2000 символов для превью
    if (summary.length > 2000) {
      summary = summary.slice(0, 2000) + '\n\n📄 Полный заказ-наряд во вложенном файле'
    }

    // ---- 2. Отправляем текстовое сообщение (без parse_mode — чистый текст) ----
    const msgRes = await fetch(`${API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: OPERATOR_CHAT_ID,
        text: `📋 ${subject}\n\n${summary}`,
        disable_web_page_preview: true,
      })
    })

    if (!msgRes.ok) {
      const err = await msgRes.text()
      console.error('Telegram sendMessage error:', err)
      return Response.json({ error: `Telegram message failed: ${err}` }, { status: 500 })
    }

    // ---- 3. Отправляем HTML-файл как документ ----
    const boundary = 'order_boundary_' + Date.now()
    const filename = `заказ-наряд-${Date.now().toString().slice(-6)}.html`

    const fileBody = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="chat_id"`,
      '',
      OPERATOR_CHAT_ID,
      `--${boundary}`,
      `Content-Disposition: form-data; name="caption"`,
      '',
      `📎 ${subject}`,
      `--${boundary}`,
      `Content-Disposition: form-data; name="document"; filename="${filename}"`,
      'Content-Type: text/html; charset=utf-8',
      '',
      html,
      `--${boundary}--`,
    ].join('\r\n')

    const docRes = await fetch(`${API}/sendDocument`, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body: fileBody,
    })

    if (!docRes.ok) {
      const err = await docRes.text()
      console.error('Telegram sendDocument error:', err)
      // Текст отправлен — это уже успех, файл не критичен
      return Response.json({ success: true, sentTo: 'telegram', documentSent: false, docError: err })
    }

    return Response.json({ success: true, sentTo: 'telegram', documentSent: true })
  } catch (err) {
    console.error('Send order error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
