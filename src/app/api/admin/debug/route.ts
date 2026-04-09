// ============================================================================
// API: Диагностика Google Sheets подключения + данных
// GET /api/admin/debug
// ============================================================================

import { NextResponse } from 'next/server'
import { isGoogleSheetsConfigured, SPREADSHEET_ID, getClientEmail, getPrivateKey, createGoogleJWT } from '@/config/google-sheets'

export async function GET() {
  const key = getPrivateKey()
  const email = getClientEmail()

  const debug: Record<string, unknown> = {
    configured: isGoogleSheetsConfigured(),
    spreadsheetId: SPREADSHEET_ID || '(пусто)',
    email: email || '(пусто)',
    keyLength: key.length,
    keyFirst20: key.slice(0, 20),
    keyLast20: key.slice(-20),
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
