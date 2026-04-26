// ============================================================================
// КОНФИГУРАЦИЯ АДМИН-КАБИНЕТА
// ============================================================================
// Бэкенд — Google Apps Script (разворачивается как Web App)
// Инструкция: /google-apps-script-instructions.md
// ============================================================================

// URL Google Apps Script Web App — вставить после развёртывания
export const APPS_SCRIPT_URL = ''

// ID Google Таблицы (из URL: docs.google.com/spreadsheets/d/ID/edit)
export const GOOGLE_SHEET_ID = ''

// Фallback: если Apps Script не настроен — показываем инструкции
export function isAppsScriptConfigured(): boolean {
  return APPS_SCRIPT_URL.length > 10
}
