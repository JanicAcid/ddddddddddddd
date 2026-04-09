// ============================================================================
// API: Диагностика Google Sheets подключения
// GET /api/admin/debug
// ============================================================================

import { NextResponse } from 'next/server'
import { isGoogleSheetsConfigured, SPREADSHEET_ID, getClientEmail, getPrivateKey } from '@/config/google-sheets'

export async function GET() {
  const key = getPrivateKey()
  const email = getClientEmail()

  const debug = {
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

  return NextResponse.json(debug)
}
