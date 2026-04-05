import { NextRequest } from 'next/server'
import { TELEGRAM_BOT_TOKEN, OPERATOR_CHAT_ID } from '@/config/chat'

interface TelegramMessage {
  message_id: number
  from?: {
    id: number
    is_bot: boolean
    first_name?: string
    last_name?: string
    username?: string
  }
  reply_to_message?: {
    message_id: number
  }
  text?: string
  date: number
}

interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
}

interface PollMessage {
  text: string
  from: string
  timestamp: number
}

export async function GET(request: NextRequest) {
  try {
    if (!OPERATOR_CHAT_ID) {
      return Response.json(
        { error: 'Чат временно недоступен. Оператор не настроен.' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const msgIdsStr = searchParams.get('msgIds') || ''
    const msgIds = msgIdsStr
      .split(',')
      .filter(Boolean)
      .map((id) => parseInt(id, 10))

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset}&timeout=0&allowed_updates=%5B%22message%22%5D`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()

    if (!data.ok) {
      console.error('Telegram getUpdates error:', data)
      return Response.json(
        { error: 'Failed to get updates' },
        { status: 500 }
      )
    }

    const updates: TelegramUpdate[] = data.result || []
    const messages: PollMessage[] = []
    let newOffset = offset

    for (const update of updates) {
      newOffset = update.update_id + 1

      if (!update.message) continue
      const msg = update.message

      // Skip bot messages
      if (msg.from?.is_bot) continue

      // Only accept messages from the operator
      if (msg.from?.id !== parseInt(OPERATOR_CHAT_ID, 10)) continue

      // Must be a reply to one of our sent messages
      if (!msg.reply_to_message) continue
      if (!msgIds.includes(msg.reply_to_message.message_id)) continue

      if (!msg.text) continue

      const senderName =
        msg.from?.first_name || msg.from?.username || 'Оператор'

      messages.push({
        text: msg.text,
        from: senderName,
        timestamp: msg.date * 1000,
      })
    }

    return Response.json({
      messages,
      offset: updates.length > 0 ? newOffset : offset,
    })
  } catch (err) {
    console.error('Chat poll error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
