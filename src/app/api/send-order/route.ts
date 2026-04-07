// ============================================================================
// ОТПРАВКА ЗАКАЗА — Telegram: только HTML-файл заказ-наряда
// ============================================================================

import { TELEGRAM_BOT_TOKEN, OPERATOR_CHAT_ID } from '@/config/telegram'

const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

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
      `📋 ${subject}`,
      `--${boundary}`,
      `Content-Disposition: form-data; name="document"; filename="${filename}"`,
      'Content-Type: text/html; charset=utf-8',
      '',
      html,
      `--${boundary}--`,
    ].join('\r\n')

    const res = await fetch(`${API}/sendDocument`, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body: fileBody,
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Telegram sendDocument error:', err)
      return Response.json({ error: err }, { status: 500 })
    }

    return Response.json({ success: true, sentTo: 'telegram' })
  } catch (err) {
    console.error('Send order error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
