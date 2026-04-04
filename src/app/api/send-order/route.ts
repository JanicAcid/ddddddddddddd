import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_6J2WHQqS_BffXxSJGh84W3fcbE5q8PCLF')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, cc, subject, html, replyTo } = body

    if (!to || !subject || !html) {
      return Response.json({ error: 'Missing required fields: to, subject, html' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Теллур-Интех <onboarding@resend.dev>',
      to: [to],
      cc: cc ? [cc] : undefined,
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
