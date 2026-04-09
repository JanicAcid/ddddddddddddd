// ============================================================================
// API: Заказы — чтение и обновление из Google Sheets
// GET    /api/admin/orders       — получить все заказы
// PATCH  /api/admin/orders       — обновить статус/комментарий заказа
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_JWT_SECRET, ADMIN_COOKIE_NAME } from '@/config/admin'
import { verifyJWT } from '@/lib/jwt'
import { isGoogleSheetsConfigured, SPREADSHEET_ID, getClientEmail, getPrivateKey } from '@/config/google-sheets'

async function checkAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!token) return false
  const payload = await verifyJWT(token, ADMIN_JWT_SECRET)
  return !!payload
}

export async function GET(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json({ error: 'Google Sheets не настроена. Задайте GOOGLE_SHEETS_ID и GOOGLE_SA_EMAIL / GOOGLE_SA_PRIVATE_KEY в Vercel.' }, { status: 503 })
  }

  try {
    const accessToken = await getAccessToken()

    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!metaRes.ok) {
      const err = await metaRes.json()
      const msg = err?.error?.message || JSON.stringify(err)
      if (msg.includes('403') || msg.includes('Permission')) {
        throw new Error(`Нет доступа к таблице. Поделитесь таблицей с ${getClientEmail()} (Редактор)`)
      }
      throw new Error(`Ошибка доступа: ${msg}`)
    }

    const metaData = await metaRes.json()
    const sheetNames = (metaData.sheets || []).map((s: { properties: { title: string } }) => s.properties.title)

    let sheetName = sheetNames.find((n: string) => n === 'Лист1')
      || sheetNames.find((n: string) => n === 'Sheet1')
      || sheetNames[0]

    if (!sheetName) throw new Error('В таблице нет ни одного листа')

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!res.ok) throw new Error(`Sheets API error: ${await res.text()}`)

    const data = await res.json()
    const rows = data.values || []

    if (rows.length === 0) {
      return NextResponse.json({ orders: [], total: 0, sheetName })
    }

    const headers = rows[0]
    const orders = rows.slice(1).map((row: string[], idx: number) => {
      const order: Record<string, string> = { _row: String(idx + 2) }
      headers.forEach((h: string, i: number) => { order[h] = row[i] || '' })
      return order
    })
    orders.reverse()

    return NextResponse.json({ orders, total: orders.length, headers, sheetName })
  } catch (err) {
    console.error('Admin get orders error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json({ error: 'Google Sheets не настроена' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { rowIndex, updates } = body
    if (!rowIndex || !updates) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

    const accessToken = await getAccessToken()

    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const metaData = await metaRes.json()
    const sheetNames = (metaData.sheets || []).map((s: { properties: { title: string } }) => s.properties.title)
    const sheetName = sheetNames.find((n: string) => n === 'Лист1') || sheetNames.find((n: string) => n === 'Sheet1') || sheetNames[0]

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName!)}!${rowIndex}:${rowIndex}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const data = await res.json()

    const headersRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName!)}!1:1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const headersData = await headersRes.json()
    const headers = headersData.values?.[0] || []
    const currentRow = data.values?.[0] || []

    for (const [key, value] of Object.entries(updates)) {
      const colIndex = headers.indexOf(key)
      if (colIndex >= 0) {
        while (currentRow.length <= colIndex) currentRow.push('')
        currentRow[colIndex] = value as string
      }
    }

    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName!)}!${rowIndex}:${rowIndex}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [currentRow] }),
      }
    )

    if (!updateRes.ok) throw new Error(`Sheets API update error: ${await updateRes.text()}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Admin update order error:', err)
    return NextResponse.json({ error: 'Ошибка обновления заказа' }, { status: 500 })
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
  if (!data.access_token) {
    throw new Error(`Ошибка токена: ${data.error_description || data.error || JSON.stringify(data)}`)
  }
  return data.access_token
}
