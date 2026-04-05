import { NextRequest } from 'next/server'
import { TELEGRAM_BOT_TOKEN, OPERATOR_CHAT_ID } from '@/config/telegram'

interface SendBody {
  sessionId: string
  message: string
  name?: string
}

export async function POST(request: NextRequest) {
  try {
    if (!OPERATOR_CHAT_ID) {
      return Response.json(
        { error: 'Чат временно недоступен. Оператор не настроен.' },
        { status: 503 }
      )
    }

    const body: SendBody = await request.json()
    const { sessionId, message, name } = body

    if (!sessionId || !message) {
      return Response.json(
        { error: 'Missing required fields: sessionId, message' },
        { status: 400 }
      )
    }

    const sessionTag = sessionId.slice(0, 8).toUpperCase()
    const nameStr = name ? ` ${name}` : ''
    const text = `👤 [${sessionTag}]${nameStr}:\n${message}`

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: OPERATOR_CHAT_ID,
        text,
      }),
    })

    const data = await res.json()

    if (!data.ok) {
      console.error('Telegram sendMessage error:', data)
      return Response.json(
        { error: 'Failed to send message to operator' },
        { status: 500 }
      )
    }

    return Response.json({
      ok: true,
      botMessageId: data.result.message_id,
    })
  } catch (err) {
    console.error('Chat send error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
