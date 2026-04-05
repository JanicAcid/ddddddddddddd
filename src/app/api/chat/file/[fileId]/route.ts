import { NextRequest } from 'next/server'
import { TELEGRAM_BOT_TOKEN, OPERATOR_CHAT_ID } from '@/config/telegram'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    if (!OPERATOR_CHAT_ID) {
      return Response.json(
        { error: 'File access not available' },
        { status: 503 }
      )
    }

    const { fileId } = await params

    if (!fileId) {
      return Response.json(
        { error: 'Missing file ID' },
        { status: 400 }
      )
    }

    // Get file path from Telegram
    const getFileUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${encodeURIComponent(fileId)}`
    const fileRes = await fetch(getFileUrl, { cache: 'no-store' })
    const fileData = await fileRes.json()

    if (!fileData.ok || !fileData.result?.file_path) {
      console.error('Telegram getFile error:', fileData)
      return Response.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    const filePath = fileData.result.file_path
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`

    // Redirect to the Telegram file URL
    return Response.redirect(fileUrl, 302)
  } catch (err) {
    console.error('Chat file proxy error:', err)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
