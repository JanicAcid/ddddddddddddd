// ============================================================================
// Google Sheets — конфигурация для логирования заказов
//
// Для подключения:
// 1. Создайте Google Cloud проект: https://console.cloud.google.com
// 2. Включите Google Sheets API
// 3. Создайте сервисный аккаунт и скачайте JSON-ключ
// 4. Создайте Google Таблицу и поделитесь ей с email сервисного аккаунта
// 5. Укажите SPREADSHEET_ID и GOOGLE_SERVICE_ACCOUNT_KEY ниже
// ============================================================================

/** ID Google Таблицы (из URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit) */
export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || ''

/** JSON-ключ сервисного аккаунта Google Cloud */
export const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
  : null

/** Email для получения заказов как fallback */
export const ORDER_EMAIL = process.env.ORDER_EMAIL || 'push@tellur.spb.ru'

/** Проверка, настроено ли Google Sheets */
export function isGoogleSheetsConfigured(): boolean {
  return !!(SPREADSHEET_ID && GOOGLE_SERVICE_ACCOUNT_KEY)
}
