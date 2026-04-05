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
 * на любой адрес — для этого задайте RESEND_FROM_EMAIL и RESEND_ORDER_EMAIL.
 */
const FALLBACK_TO = 'janicacid@gmail.com'
const TELLUR_EMAIL = 'push@tellur.spb.ru'

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }
    const resend = getResend()
    const body = await request.json()
    const { to, subject, html, replyTo } = body

    if (!subject || !html) {
      return Response.json({ error: 'Missing required fields: subject, html' }, { status: 400 })
    }

    // В тестовом режиме Resend позволяет отправлять только на email владельца аккаунта.
    // Если домен верифицирован и задан RESEND_ORDER_EMAIL — отправляем туда.
    // Иначе — на FALLBACK_TO (email владельца Resend-аккаунта).
    const recipient = process.env.RESEND_ORDER_EMAIL || FALLBACK_TO

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Теллур-Интех <onboarding@resend.dev>',
      to: [recipient],
      cc: [TELLUR_EMAIL],
      subject,
      html,
      replyTo: replyTo || undefined,
    })

    if (error) {
      console.error('Resend error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, messageId: data?.id })
  } catch (err) {
    console.error('Send order error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
