// ============================================================================
// Google Sheets — конфигурация для логирования заказов
// ============================================================================

import { createSign } from 'node:crypto'

export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || ''
export const SA_CLIENT_EMAIL = process.env.GOOGLE_SA_EMAIL || ''
export const SA_PRIVATE_KEY = (process.env.GOOGLE_SA_PRIVATE_KEY || '')
  .replace(/\\n/g, '\n')

export const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  ? (() => { try { return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY) } catch { return null } })()
  : null

export const ORDER_EMAIL = process.env.ORDER_EMAIL || 'push@tellur.spb.ru'

export function isGoogleSheetsConfigured(): boolean {
  if (SPREADSHEET_ID && SA_CLIENT_EMAIL && SA_PRIVATE_KEY) return true
  if (SPREADSHEET_ID && GOOGLE_SERVICE_ACCOUNT_KEY) return true
  return false
}

export function getClientEmail(): string {
  return SA_CLIENT_EMAIL || GOOGLE_SERVICE_ACCOUNT_KEY?.client_email || ''
}

export function getPrivateKey(): string {
  return SA_PRIVATE_KEY || GOOGLE_SERVICE_ACCOUNT_KEY?.private_key || ''
}

/** Создать JWT для Google OAuth2 (Node.js crypto) */
export function createGoogleJWT(): string {
  const now = Math.floor(Date.now() / 1000)

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: getClientEmail(),
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url')

  const unsigned = `${header}.${payload}`
  const sign = createSign('RSA-SHA256')
  sign.update(unsigned)
  const signature = sign.sign(getPrivateKey(), 'base64url')

  return `${unsigned}.${signature}`
}
