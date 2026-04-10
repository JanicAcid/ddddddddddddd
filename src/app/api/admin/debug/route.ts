// ============================================================================
// API: Диагностика Google Sheets подключения + данных
// GET /api/admin/debug
// ЗАЩИЩЁН — требует авторизации администратора
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { isGoogleSheetsConfigured, SPREADSHEET_ID, getClientEmail, getPrivateKey, createGoogleJWT } from '@/config/google-sheets'
import { ADMIN_COOKIE_NAME, ADMIN_JWT_SECRET } from '@/config/admin'

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!token) return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(ADMIN_JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const sigBytes = Buffer.from(parts[2], 'base64url')
    const unsigned = `${parts[0]}.${parts[1]}`
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(unsigned))
    if (!valid) return false
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const key = getPrivateKey()
  const email = getClientEmail()

  const debug: Record<string, unknown> = {
    configured: isGoogleSheetsConfigured(),
    spreadsheetId: SPREADSHEET_ID || '(пусто)',
    email: email || '(пусто)',
    keyLength: key.length,
    keyHasBegin: key.includes('-----BEGIN PRIVATE KEY-----'),
    keyHasEnd: key.includes('-----END PRIVATE KEY-----'),
    keyHasLiteralN: key.includes('\\n'),
    keyHasNewline: key.includes('\n'),
    keyLines: key.split('\n').length,
    envVars: {
      GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID ? 'YES' : 'NO',
      GOOGLE_SA_EMAIL: process.env.GOOGLE_SA_EMAIL ? 'YES' : 'NO',
      GOOGLE_SA_PRIVATE_KEY: process.env.GOOGLE_SA_PRIVATE_KEY ? 'YES' : 'NO',
      GOOGLE_SERVICE_ACCOUNT_KEY: process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 'YES (remove this)' : 'NO',
    }
  }

  // Если настроено — читаем первые 3 строки таблицы для диагностики
  if (isGoogleSheetsConfigured()) {
    try {
      const jwt = createGoogleJWT()
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
      })
      const tok = await res.json()
      if (tok.access_token) {
        const sheetsRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Лист1!1:5`,
          { headers: { Authorization: `Bearer ${tok.access_token}` } }
        )
        if (sheetsRes.ok) {
          const sheetsData = await sheetsRes.json()
          debug.sheetData = {
            headers: sheetsData.values?.[0] || [],
            totalRows: sheetsData.values?.length || 0,
            firstRows: (sheetsData.values || []).slice(1).map((row: string[], i: number) => ({
              row: i + 2,
              cols: row.length,
              col0_date: row[0] || '(empty)',
              col1_orderNum: row[1] || '(empty)',
              col2_client: row[2] || '(empty)',
              col3_phone: row[3] || '(empty)',
              col4_email: row[4] || '(empty)',
              col5_kkm: row[5] || '(empty)',
              col8_total: row[8] || '(empty)',
              col10_status: row[10] || '(empty)',
              col12_hasHtml: row[12] ? `YES (${row[12].length} chars)` : '(empty)',
            }))
          }
        }
      }
    } catch (err) {
      debug.sheetReadError = String(err)
    }
  }

  return NextResponse.json(debug)
}
