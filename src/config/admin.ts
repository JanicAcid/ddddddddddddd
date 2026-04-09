// ============================================================================
// КОНФИГУРАЦИЯ АДМИН-КАБИНЕТА
// ============================================================================

/** Логин менеджера */
export const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'manager'

/** Пароль менеджера */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tellur2025'

/** Секрет для подписи JWT-токена сессии */
export const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'tellur-admin-secret-2025'

/** Время жизни сессии в секундах (по умолчанию 24 часа) */
export const ADMIN_SESSION_TTL = 24 * 60 * 60

/** Имя куки сессии */
export const ADMIN_COOKIE_NAME = 'tellur_admin_session'
