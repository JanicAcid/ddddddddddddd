import { NextRequest } from 'next/server'
import { TELEGRAM_BOT_TOKEN, OPERATOR_CHAT_ID } from '@/config/telegram'

export const runtime = 'nodejs'

interface SendBody {
  sessionId: string
  message: string
  name?: string
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const AUDIO_TYPES = ['audio/ogg', 'audio/webm', 'audio/mpeg', 'audio/wav']

function isImageMime(mime: string): boolean {
  return IMAGE_TYPES.includes(mime)
}

function isAudioMime(mime: string): boolean {
  return AUDIO_TYPES.includes(mime)
}

export async function POST(request: NextRequest) {
  try {
    if (!OPERATOR_CHAT_ID) {
      return Response.json(
        { error: 'Чат временно недоступен. Оператор не настроен.' },
        { status: 503 }
      )
    }

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      return handleMultipart(request)
    }

    return handleJson(request)
  } catch (err) {
    console.error('Chat send error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleJson(request: NextRequest) {
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
}

async function handleMultipart(request: NextRequest) {
  const formData = await request.formData()

  const sessionId = formData.get('sessionId') as string | null
  const name = formData.get('name') as string | null
  const message = formData.get('message') as string | null
  const file = formData.get('file') as File | null

  if (!sessionId) {
    return Response.json(
      { error: 'Missing required field: sessionId' },
      { status: 400 }
    )
  }

  if (!file && !message) {
    return Response.json(
      { error: 'Missing file or message' },
      { status: 400 }
    )
  }

  const sessionTag = sessionId.slice(0, 8).toUpperCase()
  const nameStr = name ? ` ${name}` : ''
  const textPrefix = `👤 [${sessionTag}]${nameStr}:`
  const caption = message ? `${textPrefix}\n${message}` : textPrefix

  // If no file, just send text
  if (!file) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: OPERATOR_CHAT_ID,
        text: caption,
      }),
    })
    const data = await res.json()
    if (!data.ok) {
      console.error('Telegram sendMessage error:', data)
      return Response.json({ error: 'Failed to send message' }, { status: 500 })
    }
    return Response.json({ ok: true, botMessageId: data.result.message_id })
  }

  // Determine endpoint and field name based on MIME type
  const mimeType = file.type || 'application/octet-stream'
  let endpoint: string
  let fileFieldName: string

  if (isImageMime(mimeType)) {
    endpoint = 'sendPhoto'
    fileFieldName = 'photo'
  } else if (isAudioMime(mimeType)) {
    endpoint = 'sendVoice'
    fileFieldName = 'voice'
  } else {
    endpoint = 'sendDocument'
    fileFieldName = 'document'
  }

  // Build Telegram FormData
  const tgFormData = new FormData()
  tgFormData.append('chat_id', OPERATOR_CHAT_ID)

  // Для совместимости с Node.js runtime на Vercel — пересоздаём Blob
  const arrayBuffer = await file.arrayBuffer()
  const fileBlob = new Blob([arrayBuffer], { type: mimeType })
  tgFormData.append(fileFieldName, fileBlob, file.name)

  // Add caption (only sendPhoto and sendDocument support captions)
  if (message && (endpoint === 'sendPhoto' || endpoint === 'sendDocument')) {
    tgFormData.append('caption', caption)
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${endpoint}`
  const res = await fetch(url, {
    method: 'POST',
    body: tgFormData,
  })

  const data = await res.json()

  if (!data.ok) {
    console.error(`Telegram ${endpoint} error:`, data)
    return Response.json(
      { error: `Failed to send ${endpoint}` },
      { status: 500 }
    )
  }

  return Response.json({
    ok: true,
    botMessageId: data.result.message_id,
  })
}
