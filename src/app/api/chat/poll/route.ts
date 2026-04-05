import { NextRequest } from 'next/server'
import { TELEGRAM_BOT_TOKEN, OPERATOR_CHAT_ID } from '@/config/telegram'

interface PhotoSize {
  file_id: string
  file_size?: number
  width: number
  height: number
}

interface Document {
  file_id: string
  file_name?: string
  mime_type?: string
  file_size?: number
}

interface VoiceAudio {
  file_id: string
  duration: number
  mime_type?: string
  file_size?: number
}

interface Video {
  file_id: string
  duration: number
  mime_type?: string
  file_size?: number
  width?: number
  height?: number
  file_name?: string
  thumbnail?: { file_id: string }
}

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
  caption?: string
  date: number
  photo?: PhotoSize[]
  document?: Document
  voice?: VoiceAudio
  audio?: VoiceAudio
  video?: Video
  video_note?: Video
}

interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
}

interface PollMessage {
  type: 'text' | 'photo' | 'file' | 'voice' | 'video' | 'video_note'
  text?: string
  from: string
  timestamp: number
  fileId?: string
  fileName?: string
  mimeType?: string
  duration?: number
  fileSize?: number
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

      // Must have at least text or a file
      if (!msg.text && !msg.photo && !msg.document && !msg.voice && !msg.audio && !msg.video && !msg.video_note) continue

      const senderName =
        msg.from?.first_name || msg.from?.username || 'Оператор'

      let pollMsg: PollMessage | null = null

      if (msg.photo && msg.photo.length > 0) {
        // Use the largest photo (last element)
        const largest = msg.photo[msg.photo.length - 1]
        pollMsg = {
          type: 'photo',
          text: msg.caption || undefined,
          from: senderName,
          timestamp: msg.date * 1000,
          fileId: largest.file_id,
          fileSize: largest.file_size,
        }
      } else if (msg.video) {
        pollMsg = {
          type: 'video',
          text: msg.caption || undefined,
          from: senderName,
          timestamp: msg.date * 1000,
          fileId: msg.video.file_id,
          fileName: msg.video.file_name,
          mimeType: msg.video.mime_type,
          duration: msg.video.duration,
          fileSize: msg.video.file_size,
        }
      } else if (msg.video_note) {
        pollMsg = {
          type: 'video_note',
          text: msg.caption || undefined,
          from: senderName,
          timestamp: msg.date * 1000,
          fileId: msg.video_note.file_id,
          mimeType: msg.video_note.mime_type,
          duration: msg.video_note.duration,
          fileSize: msg.video_note.file_size,
        }
      } else if (msg.document) {
        pollMsg = {
          type: 'file',
          text: msg.caption || undefined,
          from: senderName,
          timestamp: msg.date * 1000,
          fileId: msg.document.file_id,
          fileName: msg.document.file_name,
          mimeType: msg.document.mime_type,
          fileSize: msg.document.file_size,
        }
      } else if (msg.voice) {
        pollMsg = {
          type: 'voice',
          from: senderName,
          timestamp: msg.date * 1000,
          fileId: msg.voice.file_id,
          mimeType: msg.voice.mime_type,
          duration: msg.voice.duration,
          fileSize: msg.voice.file_size,
        }
      } else if (msg.audio) {
        pollMsg = {
          type: 'voice',
          from: senderName,
          timestamp: msg.date * 1000,
          fileId: msg.audio.file_id,
          mimeType: msg.audio.mime_type,
          duration: msg.audio.duration,
          fileSize: msg.audio.file_size,
        }
      } else if (msg.text) {
        pollMsg = {
          type: 'text',
          text: msg.text,
          from: senderName,
          timestamp: msg.date * 1000,
        }
      }

      if (pollMsg) {
        messages.push(pollMsg)
      }
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
