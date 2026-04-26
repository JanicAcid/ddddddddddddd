// ============================================================================
// КОНФИГУРАЦИЯ АДМИН-КАБИНЕТА
// ВНИМАНИЕ: на статическом хостинге (Beget) админка НЕ работает — нет бэкенда.
// Эти данные используются ТОЛЬКО при серверном деплое (Vercel / Node.js).
// ============================================================================

/** Логин менеджера */
export const ADMIN_LOGIN = process.env.ADMIN_LOGIN || ''

/** Пароль менеджера */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

/** Секрет для подписи JWT-токена сессии */
export const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || ''

/** Время жизни сессии в секундах (по умолчанию 30 дней) */
export const ADMIN_SESSION_TTL = 30 * 24 * 60 * 60

/** Имя куки сессии */
export const ADMIN_COOKIE_NAME = 'tellur_admin_session'

/** Админка отключена на статическом хостинге */
export const ADMIN_ENABLED = typeof window === 'undefined'
  ? !!(process.env.ADMIN_LOGIN && process.env.ADMIN_PASSWORD)
  : false
