import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN || ''
  const chatId = process.env.OPERATOR_CHAT_ID || ''

  return NextResponse.json({
    token_set: token.length > 0,
    token_prefix: token ? token.slice(0, 8) + '...' : 'EMPTY',
    chat_id_set: chatId.length > 0,
    chat_id_value: chatId || 'EMPTY',
    node_env: process.env.NODE_ENV,
  })
}
