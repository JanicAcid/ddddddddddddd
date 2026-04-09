// ============================================================================
// Google Sheets — конфигурация для логирования заказов
// ============================================================================

/** ID Google Таблицы */
export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || ''

/** Email сервисного аккаунта */
export const SA_CLIENT_EMAIL = process.env.GOOGLE_SA_EMAIL || ''

/** Приватный ключ сервисного аккаунта (PEM) */
export const SA_PRIVATE_KEY = (process.env.GOOGLE_SA_PRIVATE_KEY || '')
  .replace(/\\n/g, '\n')

/** Legacy JSON-ключ (если используется старый формат) */
export const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  ? (() => { try { return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY) } catch { return null } })()
  : null

/** Email для получения заказов как fallback */
export const ORDER_EMAIL = process.env.ORDER_EMAIL || 'push@tellur.spb.ru'

/** Проверка, настроено ли Google Sheets */
export function isGoogleSheetsConfigured(): boolean {
  if (SPREADSHEET_ID && SA_CLIENT_EMAIL && SA_PRIVATE_KEY) return true
  if (SPREADSHEET_ID && GOOGLE_SERVICE_ACCOUNT_KEY) return true
  return false
}

/** Получить client_email (из нового или legacy формата) */
export function getClientEmail(): string {
  return SA_CLIENT_EMAIL || GOOGLE_SERVICE_ACCOUNT_KEY?.client_email || ''
}

/** Получить private_key (из нового или legacy формата) */
export function getPrivateKey(): string {
  return SA_PRIVATE_KEY || GOOGLE_SERVICE_ACCOUNT_KEY?.private_key || ''
}
