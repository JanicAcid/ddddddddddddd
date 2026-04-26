// ============================================================================
// КОНФИГУРАЦИЯ АДМИН-КАБИНЕТА
// ============================================================================
// Бэкенд — PHP-прокси на Beget хостинге (api/index.php)
// Прокси работает с Google Sheets API через сервисный аккаунт.
// ============================================================================

// URL PHP-прокси на хостинге Beget (без trailing slash)
// Пример: 'https://kassa-cto.ru/api' или '/api'
export const API_PROXY_URL = process.env.NEXT_PUBLIC_API_PROXY_URL || '/api'

// Для совместимости: admin использует тот же прокси
export const APPS_SCRIPT_URL = API_PROXY_URL

// ID Google Таблицы (для справки, реальный ID в config.php на сервере)
export const GOOGLE_SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || ''

// Проверяем, настроен ли бэкенд
export function isAppsScriptConfigured(): boolean {
  // На продакшене — проверяем, что URL задан
  if (typeof window !== 'undefined') {
    // На Beget хостинге прокси всегда доступен по /api
    // Если мы не на Beget (локальная разработка), проверяем переменную
    return API_PROXY_URL.length > 0
  }
  return true // Серверный рендеринг — всегда OK
}
