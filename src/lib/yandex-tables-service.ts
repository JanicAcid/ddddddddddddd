// ============================================================================
// Яндекс Таблицы -- клиентский сервис для отправки заявок в CRM
// ============================================================================
//
// АРХИТЕКТУРА ДЛЯ СТАТИЧЕСКОГО САЙТА:
//
// Поскольку kassa-cto.ru -- это статический экспорт (output: 'export'),
// у нас нет серверного API. Все запросы к Яндекс API идут через прокси:
//
//   Браузер --POST /api/crm.php--> PHP-прокси (Beget) --> Яндекс Диск / Яндекс Функции
//   Браузер <--JSON response------  (Beget хостинг) <--- Яндекс Диск / Яндекс Функции
//
// АЛЬТЕРНАТИВНЫЙ ВАРИАНТ -- Яндекс Функции (Serverless):
//
//   Браузер --POST yandexcloud.net--> Яндекс Функция (Node.js/Python) --> Яндекс Таблицы
//   Браузер <--JSON response-------- (Yandex Cloud)  <--- Яндекс Таблицы
//
// НАСТРОЙКА ПРОКСИ:
//
// Вариант A -- PHP-прокси (api-proxy/api/crm.php):
//   1. Создайте файл api/crm.php на хостинге Beget
//   2. Файл получает POST-запрос с JSON-данными заявки
//   3. Файл читает tellur.xlsx с Яндекс Диска (через OAuth-токен)
//   4. Добавляет новую строку и загружает обратно
//   5. Возвращает JSON { success: true } или { success: false, error: "..." }
//
// Вариант B -- Яндекс Функции:
//   1. Создайте функцию в Яндекс Cloud Functions
//   2. Используйте SDK Яндекс Таблиц для добавления строки
//   3. Установите JWT-авторизацию для функции
//   4. URL функции укажите в NEXT_PUBLIC_CRM_PROXY_URL
//
// ВАЖНО: OAuth-токен Яндекса НЕ должен быть доступен в клиентском коде!
// Он хранится только на стороне прокси (PHP-файл или Яндекс Функция).
//
// ============================================================================

import {
  type OrderData,
  CRM_PROXY_URL,
  isCrmConfigured,
  orderToRowValues,
  getColumnHeaders,
  TABLE_COLUMNS,
  ORDER_TYPES,
  ORDER_STATUSES,
  ORDER_SOURCES,
} from '@/config/yandex-tables'

// Реэкспорт типа TableRow (он определён в конфиге)
export type { TableRow } from '@/config/yandex-tables'
import type { TableRow } from '@/config/yandex-tables'

// ============================================================================
// Типы ответов
// ============================================================================

export interface CrmSendResult {
  success: boolean
  error?: string
}

export interface CrmFetchResult {
  success: boolean
  rows?: TableRow[]
  totalRows?: number
  error?: string
}

// ============================================================================
// Основная функция — отправить заявку в CRM
// ============================================================================

/**
 * Отправить данные заявки в Яндекс Таблицу CRM.
 * 
 * Использует прокси-сервер для записи данных.
 * Если CRM не настроена — возвращает ошибку с подсказкой.
 * 
 * @param order - Данные заявки
 * @returns Результат операции
 */
export async function sendOrderToYandexTable(order: OrderData): Promise<CrmSendResult> {
  // Проверяем, настроена ли CRM
  if (!isCrmConfigured()) {
    console.warn('[CRM] Яндекс Таблицы не настроены. Задайте NEXT_PUBLIC_CRM_PROXY_URL.')
    return {
      success: false,
      error: 'CRM не настроена. Обратитесь к администратору сайта.',
    }
  }

  try {
    // Формируем строку для отправки
    const rowValues = orderToRowValues(order, 0) // Нумерация на стороне прокси

    // Отправляем запрос к прокси
    const response = await fetch(`${CRM_PROXY_URL}/crm/append`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headers: getColumnHeaders(),
        values: rowValues,
        orderType: order.orderType,
        source: order.source,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Неизвестная ошибка сервера')
      console.error('[CRM] Ошибка сервера:', response.status, errorText)
      return {
        success: false,
        error: `Ошибка сервера: ${response.status}`,
      }
    }

    const result = await response.json()

    if (result.success) {
      console.log('[CRM] Заявка успешно отправлена:', order.orderType, order.clientName)
      return { success: true }
    } else {
      console.error('[CRM] Ошибка от прокси:', result.error)
      return {
        success: false,
        error: result.error || 'Ошибка при отправке в CRM',
      }
    }
  } catch (err) {
    console.error('[CRM] Сетевая ошибка:', err)
    return {
      success: false,
      error: 'Не удалось подключиться к CRM. Проверьте интернет-соединение.',
    }
  }
}

// ============================================================================
// Функция чтения данных из CRM (для дашборда)
// ============================================================================

/**
 * Получить последние заявки из CRM.
 * 
 * Используется на странице /crm для отображения недавних заявок.
 * 
 * @param limit - Максимальное количество строк (по умолчанию 50)
 * @returns Результат операции с массивом строк
 */
export async function fetchCrmOrders(limit: number = 50): Promise<CrmFetchResult> {
  if (!isCrmConfigured()) {
    return {
      success: false,
      error: 'CRM не настроена. Задайте NEXT_PUBLIC_CRM_PROXY_URL.',
    }
  }

  try {
    const response = await fetch(`${CRM_PROXY_URL}/crm/read?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Ошибка сервера: ${response.status}`,
      }
    }

    const result = await response.json()

    if (result.success) {
      return {
        success: true,
        rows: result.rows || [],
        totalRows: result.totalRows || 0,
      }
    } else {
      return {
        success: false,
        error: result.error || 'Ошибка при чтении данных',
      }
    }
  } catch (err) {
    console.error('[CRM] Сетевая ошибка при чтении:', err)
    return {
      success: false,
      error: 'Не удалось подключиться к CRM.',
    }
  }
}

// ============================================================================
// Вспомогательные функции
// ============================================================================

/**
 * Создать данные заявки из калькулятора (DoneScreen).
 */
export function createCalculatorOrder(params: {
  clientName: string
  clientPhone: string
  clientEmail: string
  clientInn: string
  kktModel: string
  kktBrand?: string
  kktCondition: string
  services: string
  total: number
  comment?: string
  isConsultation?: boolean
}): OrderData {
  return {
    orderType: params.isConsultation ? 'Консультация' : 'Заказ-наряд',
    clientName: params.clientName,
    phone: params.clientPhone,
    email: params.clientEmail,
    inn: params.clientInn,
    kktModel: params.kktModel,
    kktBrand: params.kktBrand,
    kktCondition: params.kktCondition,
    services: params.services,
    total: params.total,
    comment: params.comment,
    source: 'Калькулятор',
  }
}

/**
 * Создать данные заявки из диагностики.
 */
export function createDiagnosticOrder(params: {
  clientName: string
  clientPhone: string
  kktModel?: string
  kktBrand?: string
  scores: { title: string; score: number; maxScore: number; status: string }[]
}): OrderData {
  const summary = params.scores.map(s => {
    const emoji = s.status === 'green' ? '✅' : s.status === 'yellow' ? '⚠️' : '❌'
    return `${emoji} ${s.title} ${s.score}/${s.maxScore}`
  }).join('\n')

  return {
    orderType: 'Диагностика',
    clientName: params.clientName,
    phone: params.clientPhone,
    kktModel: params.kktModel,
    kktBrand: params.kktBrand,
    services: summary,
    comment: `Результат диагностики: ${params.scores.filter(s => s.status === 'green').length}/5 слоёв в порядке`,
    source: 'Диагностика',
  }
}

/**
 * Создать данные заявки из подбора кассы (KassaConsultWidget).
 */
export function createKassaConsultOrder(params: {
  clientName: string
  clientPhone: string
  bizType: string
  kassaFormat: string
  budget: string
  recommendations: string
}): OrderData {
  return {
    orderType: 'Подбор кассы',
    clientName: params.clientName,
    phone: params.clientPhone,
    kktCondition: 'Новая',
    services: `Бизнес: ${params.bizType}, Формат: ${params.kassaFormat}, Бюджет: ${params.budget}`,
    comment: params.recommendations,
    source: 'Подбор кассы',
  }
}

// ============================================================================
// Моковые данные для дашборда (используются когда CRM не подключена)
// ============================================================================

/** Моковые данные для демонстрации дашборда */
export const MOCK_ORDERS: TableRow[] = [
  {
    number: 1,
    datetime: '15.01.2025 14:30',
    orderType: 'Заказ-наряд',
    status: 'В работе',
    clientName: 'Иванов Иван',
    phone: '+7 (999) 123-45-67',
    email: 'ivanov@example.ru',
    inn: '7810123456',
    company: 'ИП Иванов',
    kktModel: 'Атол Sigma 7Ф',
    kktBrand: 'Атол',
    kktCondition: 'Новая',
    services: 'Подключение маркировки, Регистрация ККТ',
    total: '12 500',
    comment: 'Магазин одежды, нужен сканер 2D',
    source: 'Калькулятор',
    manager: 'Петров А.',
    managerNote: 'Звонок назначен на 16.01',
  },
  {
    number: 2,
    datetime: '14.01.2025 11:20',
    orderType: 'Консультация',
    status: 'Новая',
    clientName: 'Петрова Мария',
    phone: '+7 (921) 555-33-22',
    email: '',
    inn: '',
    company: '',
    kktModel: 'Меркурий 115Ф',
    kktBrand: 'Меркурий',
    kktCondition: 'Текущая (рабочая)',
    services: '',
    total: '',
    comment: 'Не пробиваются маркированные чеки',
    source: 'Калькулятор',
    manager: '',
    managerNote: '',
  },
  {
    number: 3,
    datetime: '13.01.2025 09:15',
    orderType: 'Диагностика',
    status: 'Завершена',
    clientName: 'Сидоров Алексей',
    phone: '+7 (911) 222-11-00',
    email: 'sidorov@shop.ru',
    inn: '7801012345',
    company: 'ООО "Товары"',
    kktModel: 'Эвотор 5',
    kktBrand: 'Эвотор',
    kktCondition: 'Текущая (рабочая)',
    services: '✅ Оборудование 6/8\n⚠️ Онлайн-сервисы 4/10\n❌ Документооборот 1/6',
    total: '',
    comment: 'Нужна настройка ЭДО',
    source: 'Диагностика',
    manager: 'Петров А.',
    managerNote: 'Оказана помощь, ЭДО настроено',
  },
  {
    number: 4,
    datetime: '12.01.2025 16:45',
    orderType: 'Подбор кассы',
    status: 'Новая',
    clientName: 'Козлова Анна',
    phone: '+7 (903) 444-55-66',
    email: '',
    inn: '',
    company: '',
    kktModel: '',
    kktBrand: '',
    kktCondition: 'Новая',
    services: 'Бизнес: shop, Формат: smart, Бюджет: mid',
    total: '',
    comment: 'Рекомендуем: Атол Sigma 7Ф (от 32 000 ₽)',
    source: 'Подбор кассы',
    manager: '',
    managerNote: '',
  },
  {
    number: 5,
    datetime: '12.01.2025 10:00',
    orderType: 'Заказ-наряд',
    status: 'Завершена',
    clientName: 'ООО "Аптека Здоровье"',
    phone: '+7 (812) 111-22-33',
    email: 'info@apteka-z.ru',
    inn: '7801012345',
    company: 'ООО "Аптека Здоровье"',
    kktModel: 'Атол Sigma 8Ф',
    kktBrand: 'Атол',
    kktCondition: 'Новая',
    services: 'Подключение маркировки, Регистрация ККТ, Подключение ОФД',
    total: '18 000',
    comment: 'Аптека, маркировка лекарств',
    source: 'Звонок',
    manager: 'Смирнова Е.',
    managerNote: 'Выполнено, клиент доволен',
  },
]

// ============================================================================
// Утилиты для дашборда
// ============================================================================

/** Статистика по типам заявок */
export function getOrdersByType(rows: TableRow[]): Record<string, number> {
  const stats: Record<string, number> = {}
  for (const row of rows) {
    stats[row.orderType] = (stats[row.orderType] || 0) + 1
  }
  return stats
}

/** Статистика по статусам */
export function getOrdersByStatus(rows: TableRow[]): Record<string, number> {
  const stats: Record<string, number> = {}
  for (const row of rows) {
    stats[row.status] = (stats[row.status] || 0) + 1
  }
  return stats
}

/** Цвета для статусов */
export function getStatusColor(status: string): { bg: string; text: string; dot: string } {
  switch (status) {
    case 'Новая':     return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' }
    case 'В работе':  return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' }
    case 'Завершена': return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' }
    case 'Отменена':  return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' }
    default:          return { bg: 'bg-slate-50', text: 'text-slate-700', dot: 'bg-slate-500' }
  }
}

// Реэкспорт типов и конфигурации для удобного импорта
export {
  isCrmConfigured,
  TABLE_COLUMNS,
  ORDER_TYPES,
  ORDER_STATUSES,
  ORDER_SOURCES,
  getColumnHeaders,
  orderToRowValues,
} from '@/config/yandex-tables'
