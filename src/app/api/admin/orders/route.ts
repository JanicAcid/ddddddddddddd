// ============================================================================
// API: Заказы — чтение и обновление из Google Sheets
// GET    /api/admin/orders       — получить все заказы
// PATCH  /api/admin/orders       — обновить статус/комментарий заказа
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_JWT_SECRET, ADMIN_COOKIE_NAME } from '@/config/admin'
import { verifyJWT } from '@/lib/jwt'
import { isGoogleSheetsConfigured, SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_KEY } from '@/config/google-sheets'

// ============================================================================
// Проверка авторизации
// ============================================================================
async function checkAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!token) return false
  const payload = await verifyJWT(token, ADMIN_JWT_SECRET)
  return !!payload
}

// ============================================================================
// GET — Получить все заказы
// ============================================================================
export async function GET(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json({ error: 'Google Sheets не настроена. Задайте переменные окружения GOOGLE_SHEETS_ID и GOOGLE_SERVICE_ACCOUNT_KEY в Vercel.' }, { status: 503 })
  }

  try {
    const jwt = await createJWT()
    const accessToken = await getAccessToken(jwt)

    // Получаем все данные из Лист1
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Лист1`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Sheets API error: ${err}`)
    }

    const data = await res.json()
    const rows = data.values || []

    if (rows.length === 0) {
      return NextResponse.json({ orders: [], total: 0 })
    }

    // Первая строка — заголовки
    const headers = rows[0]
    const orders = rows.slice(1).map((row: string[], idx: number) => {
      const order: Record<string, string> = { _row: String(idx + 2) } // +2: 1-based + header
      headers.forEach((h: string, i: number) => {
        order[h] = row[i] || ''
      })
      return order
    })

    // Сортировка по дате (первая колонка) — новые сверху
    orders.reverse()

    return NextResponse.json({ orders, total: orders.length, headers })
  } catch (err) {
    console.error('Admin get orders error:', err)
    return NextResponse.json({ error: 'Ошибка получения заказов' }, { status: 500 })
  }
}

// ============================================================================
// PATCH — Обновить статус заказа
// Body: { rowIndex, status, managerComment }
// ============================================================================
export async function PATCH(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json({ error: 'Google Sheets не настроена' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { rowIndex, updates } = body // rowIndex — номер строки в таблице (1-based, с учётом заголовка)

    if (!rowIndex || !updates) {
      return NextResponse.json({ error: 'Missing rowIndex or updates' }, { status: 400 })
    }

    const jwt = await createJWT()
    const accessToken = await getAccessToken(jwt)

    // Сначала читаем текущую строку, чтобы обновить только нужные колонки
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Лист1!${rowIndex}:${rowIndex}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Sheets API read error: ${err}`)
    }

    const data = await res.json()
    const headersRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Лист1!1:1`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    const headersData = await headersRes.json()
    const headers = headersData.values?.[0] || []
    const currentRow = data.values?.[0] || []

    // Применяем обновления
    for (const [key, value] of Object.entries(updates)) {
      const colIndex = headers.indexOf(key)
      if (colIndex >= 0) {
        while (currentRow.length <= colIndex) currentRow.push('')
        currentRow[colIndex] = value as string
      }
    }

    // Пишем обновлённую строку
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Лист1!${rowIndex}:${rowIndex}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [currentRow] }),
      }
    )

    if (!updateRes.ok) {
      const err = await updateRes.text()
      throw new Error(`Sheets API update error: ${err}`)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Admin update order error:', err)
    return NextResponse.json({ error: 'Ошибка обновления заказа' }, { status: 500 })
  }
}

// ============================================================================
// JWT и Google Sheets API helpers (дублируем из log-order для независимости)
// ============================================================================

function base64url(data: string): string {
  return Buffer.from(data).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function createJWT(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: GOOGLE_SERVICE_ACCOUNT_KEY!.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }

  const headerB64 = base64url(JSON.stringify(header))
  const payloadB64 = base64url(JSON.stringify(payload))
  const unsigned = `${headerB64}.${payloadB64}`

  const sign = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    await importKey(),
    new TextEncoder().encode(unsigned)
  )
  const signature = base64url(String.fromCharCode(...new Uint8Array(sign)))
  return `${unsigned}.${signature}`
}

async function importKey(): Promise<CryptoKey> {
  const pem = GOOGLE_SERVICE_ACCOUNT_KEY!.private_key
  const pemContents = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '')
  const binaryDer = Buffer.from(pemContents, 'base64')
  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )
}

async function getAccessToken(jwt: string): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })
  const data = await res.json()
  return data.access_token
}
