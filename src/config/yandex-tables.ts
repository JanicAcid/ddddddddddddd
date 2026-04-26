// ============================================================================
// Яндекс Таблицы -- конфигурация CRM для приёма заявок с сайта
// ============================================================================
//
// ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
//
// 1. Создайте файл tellur.xlsx на Яндекс Диске в папке /CRM/ или корне
// 2. Первая строка файла — заголовки (создаются автоматически при первом запросе)
// 3. Получите OAuth-токен Яндекса:
//    a) Перейдите на https://oauth.yandex.ru/
//    b) Создайте новое приложение
//    c) Выберите права: "Яндекс.Диск REST API" (disk:read, disk:write)
//    d) Получите токен (для продакшена лучше использовать refresh-токен)
// 4. Установите переменные окружения (для локальной разработки):
//    YANDEX_OAUTH_TOKEN=ваш_токен
//    YANDEX_DISK_FILE_PATH=/CRM/tellur.xlsx
// 5. Для продакшена (статический сайт на Beget) используйте Яндекс Функции
//    как прокси (см. yandex-tables-service.ts)
//
// ВАЖНО: OAuth-токен НЕ должен попадать в клиентский код!
// Для статического сайта используйте один из подходов:
//   A) Яндекс Функции (рекомендуется) — см. документацию в yandex-tables-service.ts
//   B) PHP-прокси на хостинге Beget (уже есть api-proxy/api/index.php)
//
// ============================================================================

// ----------------------------------------------------------------------------
// Столбцы таблицы tellur.xlsx
// ----------------------------------------------------------------------------

/** Определение столбцов таблицы CRM */
export const TABLE_COLUMNS = [
  { key: 'number', label: '№', type: 'auto' as const, description: 'Автоматический номер' },
  { key: 'datetime', label: 'Дата и время', type: 'datetime' as const, description: 'Дата и время поступления заявки' },
  { key: 'orderType', label: 'Тип заявки', type: 'select' as const, description: 'Тип заявки' },
  { key: 'status', label: 'Статус', type: 'select' as const, description: 'Текущий статус обработки' },
  { key: 'clientName', label: 'Имя клиента', type: 'text' as const, description: 'Имя клиента' },
  { key: 'phone', label: 'Телефон', type: 'text' as const, description: 'Номер телефона клиента' },
  { key: 'email', label: 'Email', type: 'text' as const, description: 'Электронная почта' },
  { key: 'inn', label: 'ИНН', type: 'text' as const, description: 'ИНН компании/ИП' },
  { key: 'company', label: 'Компания/ИП', type: 'text' as const, description: 'Наименование компании' },
  { key: 'kktModel', label: 'Касса', type: 'text' as const, description: 'Модель ККТ' },
  { key: 'kktBrand', label: 'Бренд кассы', type: 'select' as const, description: 'Производитель ККТ' },
  { key: 'kktCondition', label: 'Состояние кассы', type: 'select' as const, description: 'Новая/Б/у/Текущая' },
  { key: 'services', label: 'Услуги', type: 'text' as const, description: 'Список выбранных услуг' },
  { key: 'total', label: 'Сумма, руб.', type: 'number' as const, description: 'Итоговая сумма' },
  { key: 'comment', label: 'Комментарий клиента', type: 'text' as const, description: 'Комментарий клиента' },
  { key: 'source', label: 'Источник', type: 'select' as const, description: 'Откуда пришла заявка' },
  { key: 'manager', label: 'Менеджер', type: 'text' as const, description: 'Назначенный менеджер' },
  { key: 'managerNote', label: 'Примечание менеджера', type: 'text' as const, description: 'Заметки менеджера' },
] as const

// ----------------------------------------------------------------------------
// Справочники (значения для select-полей)
// ----------------------------------------------------------------------------

/** Типы заявок */
export const ORDER_TYPES = [
  'Заказ-наряд',
  'Консультация',
  'Диагностика',
  'Подбор кассы',
] as const

/** Статусы заявок */
export const ORDER_STATUSES = [
  'Новая',
  'В работе',
  'Завершена',
  'Отменена',
] as const

/** Бренды касс */
export const KKT_BRANDS = [
  'Меркурий',
  'Атол',
  'Сигма',
  'Эвотор',
  'Штрих-М',
  'Пионер',
  'AQSI',
  'Другой',
] as const

/** Состояния кассы */
export const KKT_CONDITIONS = [
  'Новая',
  'Б/у',
  'Текущая (рабочая)',
] as const

/** Источники заявок */
export const ORDER_SOURCES = [
  'Калькулятор',
  'Диагностика',
  'Подбор кассы',
  'Звонок',
] as const

// ----------------------------------------------------------------------------
// Типы данных
// ----------------------------------------------------------------------------

/** Тип столбца */
export type ColumnType = typeof TABLE_COLUMNS[number]['type']

/** Ключ столбца */
export type ColumnKey = typeof TABLE_COLUMNS[number]['key']

/** Данные заявки для отправки в CRM */
export interface OrderData {
  /** Тип заявки (ORDER_TYPES) */
  orderType: typeof ORDER_TYPES[number]
  /** Имя клиента */
  clientName: string
  /** Телефон */
  phone: string
  /** Email */
  email?: string
  /** ИНН */
  inn?: string
  /** Компания/ИП */
  company?: string
  /** Модель кассы */
  kktModel?: string
  /** Бренд кассы */
  kktBrand?: string
  /** Состояние кассы */
  kktCondition?: string
  /** Список услуг (через запятую) */
  services?: string
  /** Итоговая сумма */
  total?: number
  /** Комментарий клиента */
  comment?: string
  /** Источник заявки */
  source: typeof ORDER_SOURCES[number]
}

/** Строка таблицы (полная, включая служебные поля) */
export interface TableRow {
  number: number
  datetime: string
  orderType: string
  status: string
  clientName: string
  phone: string
  email: string
  inn: string
  company: string
  kktModel: string
  kktBrand: string
  kktCondition: string
  services: string
  total: number | string
  comment: string
  source: string
  manager: string
  managerNote: string
}

// ----------------------------------------------------------------------------
// Конфигурация API
// ----------------------------------------------------------------------------

/** URL Яндекс Диск REST API */
export const YANDEX_DISK_API_BASE = 'https://cloud-api.yandex.net/v1/disk'

/**
 * URL прокси-сервера для записи в CRM.
 * 
 * Для продакшена (Beget хостинг):
 * - PHP-прокси: '/api' (рекомендуется — уже настроен)
 * - Укажите полный URL если хостинг на другом домене: 'https://kassa-cto.ru/api'
 * 
 * Если не настроен — CRM-функционал будет недоступна (кнопки скрываются).
 */
export const CRM_PROXY_URL = process.env.NEXT_PUBLIC_CRM_PROXY_URL || process.env.NEXT_PUBLIC_API_PROXY_URL || '/api'

/**
 * Проверить, настроена ли интеграция с CRM.
 * В продакшене: проверяет наличие URL прокси.
 */
export function isCrmConfigured(): boolean {
  return !!CRM_PROXY_URL
}

/**
 * Получить заголовки столбцов для CSV/таблицы.
 * Возвращает массив с заголовками на русском языке.
 */
export function getColumnHeaders(): string[] {
  return TABLE_COLUMNS.map(col => col.label)
}

/**
 * Преобразовать OrderData в массив значений для строки таблицы.
 * Автоматически подставляет дату/время и номер строки.
 */
export function orderToRowValues(
  order: OrderData,
  rowNum: number,
): string[] {
  const now = new Date()
  const datetime = now.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return [
    String(rowNum),                              // №
    datetime,                                     // Дата и время
    order.orderType,                              // Тип заявки
    'Новая',                                      // Статус (по умолчанию)
    order.clientName || '',                       // Имя клиента
    order.phone || '',                            // Телефон
    order.email || '',                            // Email
    order.inn || '',                              // ИНН
    order.company || '',                          // Компания/ИП
    order.kktModel || '',                         // Касса
    order.kktBrand || '',                         // Бренд кассы
    order.kktCondition || '',                     // Состояние кассы
    order.services || '',                         // Услуги
    order.total != null ? String(order.total) : '', // Сумма
    order.comment || '',                          // Комментарий
    order.source,                                 // Источник
    '',                                           // Менеджер (пустой)
    '',                                           // Примечание менеджера (пустое)
  ]
}
