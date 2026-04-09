// ============================================================================
// API: логирование заказа в Google Sheets
// POST /api/log-order
// ============================================================================

import { isGoogleSheetsConfigured, SPREADSHEET_ID, getClientEmail, getPrivateKey } from '@/config/google-sheets'

interface LogOrderBody {
  orderNum: string
  clientName: string
  phone: string
  email?: string
  kkmType: string
  kkmCondition: string
  services: string[]
  total: number
  isConsultation?: boolean
  comment?: string
}

export async function POST(request: Request) {
  try {
    const body: LogOrderBody = await request.json()

    if (!body.orderNum || !body.clientName || !body.phone) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
    const row = [
      timestamp,
      body.orderNum,
      body.clientName,
      body.phone,
      body.email || '',
      body.kkmType || '',
      body.kkmCondition || '',
      body.isConsultation ? 'Консультация' : (body.services || []).join(', '),
      body.total || 0,
      body.comment || '',
    ]

    if (isGoogleSheetsConfigured()) {
      try {
        const accessToken = await getAccessToken()
        await appendRow(accessToken, row)
        return Response.json({ success: true, loggedTo: 'google-sheets' })
      } catch (err) {
        console.error('Google Sheets logging failed, saving locally:', err)
        console.log('ORDER_LOG:', JSON.stringify(row))
        return Response.json({ success: true, loggedTo: 'fallback-log' })
      }
    }

    console.log('ORDER_LOG:', JSON.stringify(row))
    return Response.json({ success: true, loggedTo: 'log', message: 'Google Sheets not configured' })
  } catch (err) {
    console.error('Log order error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

// ============================================================================
// JWT helpers
// ============================================================================

function base64url(data: string): string {
  return Buffer.from(data).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function createJWT(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: getClientEmail(),
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }

  const headerB64 = base64url(JSON.stringify(header))
  const payloadB64 = base64url(JSON.stringify(payload))
  const unsigned = `${headerB64}.${payloadB64}`

  const privateKey = getPrivateKey()
  const pemContents = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '')
  const binaryDer = Buffer.from(pemContents, 'base64')
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )

  const sign = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(unsigned))
  const signature = base64url(String.fromCharCode(...new Uint8Array(sign)))
  return `${unsigned}.${signature}`
}

async function getAccessToken(): Promise<string> {
  const jwt = await createJWT()
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })
  const data = await res.json()
  return data.access_token
}

async function appendRow(accessToken: string, values: unknown[]): Promise<void> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Лист1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [values] }),
    }
  )
  if (!res.ok) throw new Error(`Sheets API error: ${await res.text()}`)
}
