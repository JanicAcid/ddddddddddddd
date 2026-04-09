// ============================================================================
// API: Заказы — чтение и обновление из Google Sheets
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_JWT_SECRET, ADMIN_COOKIE_NAME } from '@/config/admin'
import { verifyJWT } from '@/lib/jwt'
import { isGoogleSheetsConfigured, SPREADSHEET_ID, getClientEmail, createGoogleJWT } from '@/config/google-sheets'

async function checkAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!token) return false
  const payload = await verifyJWT(token, ADMIN_JWT_SECRET)
  return !!payload
}

async function getAccessToken(): Promise<string> {
  const jwt = createGoogleJWT()
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

export async function GET(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json({ error: 'Google Sheets не настроена.' }, { status: 503 })
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
      throw new Error(`Нет доступа к таблице: ${msg}. Поделитесь с ${getClientEmail()}`)
    }

    const metaData = await metaRes.json()
    const sheetNames = (metaData.sheets || []).map((s: { properties: { title: string } }) => s.properties.title)
    let sheetName = sheetNames.find((n: string) => n === 'Лист1')
      || sheetNames.find((n: string) => n === 'Sheet1')
      || sheetNames[0]
    if (!sheetName) throw new Error('Нет листов в таблице')

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
