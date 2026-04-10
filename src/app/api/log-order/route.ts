// ============================================================================
// API: логирование заказа в Google Sheets
// POST /api/log-order
// ============================================================================

import { isGoogleSheetsConfigured, SPREADSHEET_ID, createGoogleJWT } from '@/config/google-sheets'

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
  orderHtml?: string
}

export async function POST(request: Request) {
  try {
    const body: LogOrderBody = await request.json()
    if (!body.orderNum || !body.clientName) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }
    // Телефон — обязателен для логирования, но не блокируем запись если пропущен
    if (!body.phone) {
      console.warn('LOG_ORDER: phone is empty, orderNum:', body.orderNum, 'client:', body.clientName)
    }

    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
    const status = body.isConsultation ? 'консультация' : 'новый'
    // Телефон: экранируем ' для Sheets — без этого Google воспринимает +7 как формулу → #ERROR!
    const safePhone = body.phone ? `'${body.phone}` : ''
    const safeEmail = body.email ? `'${body.email}` : ''
    const row = [
      timestamp, body.orderNum, body.clientName, safePhone,
      safeEmail, body.kkmType || '', body.kkmCondition || '',
      body.isConsultation ? 'Консультация' : (body.services || []).join(', '),
      body.total || 0, body.comment || '',
      status, '',
      body.orderHtml || '',
    ]

    if (isGoogleSheetsConfigured()) {
      try {
        const jwt = createGoogleJWT()
        const res = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
        })
        const tok = await res.json()
        if (!tok.access_token) throw new Error('Token error')

        // Проверяем заголовки таблицы — добавляем отсутствующие колонки
        const REQUIRED_HEADERS = [
          'Дата/время', 'Заказ №', 'Клиент', 'Телефон', 'Email',
          'ККМ', 'Состояние', 'Услуги', 'Сумма', 'Комментарий',
          'Статус', 'Комментарий менеджера', 'Файл заказа',
        ]
        try {
          const headerRes = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Лист1!1:1`,
            { headers: { Authorization: `Bearer ${tok.access_token}` } }
          )
          const headerData = await headerRes.json()
          const existingHeaders = headerData.values?.[0] || []
          // Исправляем заголовки: заполняем пустые и добавляем недостающие
          if (existingHeaders.length < REQUIRED_HEADERS.length) {
            const fixedHeaders = [...existingHeaders]
            while (fixedHeaders.length < REQUIRED_HEADERS.length) {
              fixedHeaders.push(REQUIRED_HEADERS[fixedHeaders.length])
            }
            await fetch(
              `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Лист1!1:1?valueInputOption=USER_ENTERED`,
              {
                method: 'PUT',
                headers: { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ values: [fixedHeaders] }),
              }
            )
          }
        } catch (headerErr) {
          console.warn('Header check failed (non-critical):', headerErr)
        }

        const appendRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Лист1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [row] }),
          }
        )
        if (!appendRes.ok) throw new Error(`Sheets API error: ${await appendRes.text()}`)
        return Response.json({ success: true, loggedTo: 'google-sheets' })
      } catch (err) {
        console.error('Google Sheets logging failed:', err)
        console.log('ORDER_LOG:', JSON.stringify(row))
        return Response.json({ success: true, loggedTo: 'fallback-log' })
      }
    }

    console.log('ORDER_LOG:', JSON.stringify(row))
    return Response.json({ success: true, loggedTo: 'log' })
  } catch (err) {
    console.error('Log order error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
