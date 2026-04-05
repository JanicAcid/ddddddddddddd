import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }
    const body = await request.json()
    const { to, subject, html, replyTo } = body

    if (!to || !subject || !html) {
      return Response.json({ error: 'Missing required fields: to, subject, html' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Теллур-Интех <onboarding@resend.dev>',
      to: [to],
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
