'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Database, ExternalLink, RefreshCw, BarChart3,
  Clock, AlertTriangle, CheckCircle2, XCircle,
  Phone, User, FileText, Store, Search, Filter,
} from 'lucide-react'
import {
  isCrmConfigured,
  fetchCrmOrders,
  MOCK_ORDERS,
  type TableRow,
  getOrdersByType,
  getOrdersByStatus,
  getStatusColor,
} from '@/lib/yandex-tables-service'

// ============================================================================
// Компонент — Страница CRM-дашборда
// ============================================================================

export default function CrmDashboardPage() {
  const [orders, setOrders] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const crmConfigured = isCrmConfigured()

  // Загрузка данных
  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    setError('')

    if (crmConfigured) {
      try {
        const result = await fetchCrmOrders(100)
        if (result.success && result.rows) {
          setOrders(result.rows)
        } else {
          setError(result.error || 'Не удалось загрузить данные')
          // Подменяем моковыми данными для демонстрации
          setOrders(MOCK_ORDERS)
        }
      } catch {
        setError('Ошибка подключения к CRM')
        setOrders(MOCK_ORDERS)
      }
    } else {
      // CRM не настроена — показываем моковые данные
      setOrders(MOCK_ORDERS)
    }

    setLoading(false)
  }

  // Фильтрация
  const filteredOrders = useMemo(() => {
    let result = [...orders]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(order =>
        order.clientName.toLowerCase().includes(q) ||
        order.phone.includes(q) ||
        order.kktModel.toLowerCase().includes(q) ||
        order.company.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      result = result.filter(o => o.orderType === typeFilter)
    }

    return result
  }, [orders, searchQuery, statusFilter, typeFilter])

  // Статистика
  const statsByType = useMemo(() => getOrdersByType(orders), [orders])
  const statsByStatus = useMemo(() => getOrdersByStatus(orders), [orders])
  const totalRevenue = useMemo(() => {
    return orders
      .reduce((sum, o) => {
        const num = typeof o.total === 'string' ? parseInt(o.total.replace(/\s/g, ''), 10) : o.total
        return sum + (isNaN(num) ? 0 : num)
      }, 0)
  }, [orders])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1e3a5f]">CRM — Заявки</h1>
              <p className="text-xs text-slate-400">
                {crmConfigured ? 'Данные из Яндекс Таблиц' : 'Демо-режим (CRM не подключена)'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadOrders}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#1e3a5f] bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
            <a
              href="https://disk.yandex.ru/d/tellur.xlsx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#1e3a5f] rounded-xl hover:bg-[#2a5080] transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Открыть таблицу
            </a>
          </div>
        </div>

        {!crmConfigured && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">CRM в демонстрационном режиме</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Для подключения реальных данных задайте переменную окружения <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">NEXT_PUBLIC_CRM_PROXY_URL</code> и настройте прокси-сервер. Подробная инструкция — в файле <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">src/config/yandex-tables.ts</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Всего заявок */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-400">Всего заявок</span>
            </div>
            <span className="text-2xl font-bold text-[#1e3a5f]">{orders.length}</span>
          </div>

          {/* В работе */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-slate-400">В работе</span>
            </div>
            <span className="text-2xl font-bold text-amber-600">{statsByStatus['В работе'] || 0}</span>
          </div>

          {/* Завершены */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-slate-400">Завершены</span>
            </div>
            <span className="text-2xl font-bold text-emerald-600">{statsByStatus['Завершена'] || 0}</span>
          </div>

          {/* Выручка */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-[#e8a817]" />
              <span className="text-xs font-medium text-slate-400">Сумма, руб.</span>
            </div>
            <span className="text-2xl font-bold text-[#1e3a5f]">{totalRevenue.toLocaleString('ru-RU')}</span>
          </div>
        </div>

        {/* Распределение по типам */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#1e3a5f] mb-3 flex items-center gap-2">
              <Store className="w-4 h-4" /> По типу заявки
            </h3>
            <div className="space-y-2">
              {Object.entries(statsByType).map(([type, count]) => {
                const typeColors: Record<string, string> = {
                  'Заказ-наряд': 'bg-[#1e3a5f]',
                  'Консультация': 'bg-blue-500',
                  'Диагностика': 'bg-purple-500',
                  'Подбор кассы': 'bg-[#e8a817]',
                }
                const barColor = typeColors[type] || 'bg-slate-400'
                const maxCount = Math.max(...Object.values(statsByType), 1)
                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-600 w-24 shrink-0 truncate">{type}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all`}
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-6 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#1e3a5f] mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" /> По статусу
            </h3>
            <div className="space-y-2">
              {['Новая', 'В работе', 'Завершена', 'Отменена'].map(status => {
                const count = statsByStatus[status] || 0
                const color = getStatusColor(status)
                const maxCount = Math.max(...Object.values(statsByStatus), 1)
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${color.dot}`} />
                    <span className="text-xs font-medium text-slate-600 w-20 shrink-0">{status}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color.dot} rounded-full transition-all`}
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-6 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени, телефону, модели кассы..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 bg-white focus:outline-none focus:border-[#1e3a5f] transition-all"
              >
                <option value="all">Все статусы</option>
                <option value="Новая">Новая</option>
                <option value="В работе">В работе</option>
                <option value="Завершена">Завершена</option>
                <option value="Отменена">Отменена</option>
              </select>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 bg-white focus:outline-none focus:border-[#1e3a5f] transition-all"
              >
                <option value="all">Все типы</option>
                <option value="Заказ-наряд">Заказ-наряд</option>
                <option value="Консультация">Консультация</option>
                <option value="Диагностика">Диагностика</option>
                <option value="Подбор кассы">Подбор кассы</option>
              </select>
            </div>
          </div>
        </div>

        {/* Таблица заявок */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Мобильная карточная версия */}
          <div className="sm:hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-400">Загрузка...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">Заявки не найдены</div>
            ) : (
              filteredOrders.map((order) => {
                const sc = getStatusColor(order.status)
                return (
                  <div key={order.number} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">№{order.number} · {order.datetime}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-bold text-[#1e3a5f]">{order.clientName}</span>
                      <span className="text-xs text-slate-400 ml-2">{order.orderType}</span>
                    </div>
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{order.phone}</p>
                      {order.kktModel && <p>{order.kktModel}</p>}
                      {order.total && <p className="font-semibold text-[#1e3a5f]">{order.total} руб.</p>}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Десктопная версия */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">№</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Дата</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Тип</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Статус</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Клиент</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Касса</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Сумма</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Источник</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Менеджер</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Загрузка данных...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                      <p className="text-sm text-amber-600">{error}</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                      Заявки не найдены
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const sc = getStatusColor(order.status)
                    return (
                      <tr key={order.number} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{order.number}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{order.datetime}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                            {order.orderType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-700">{order.clientName}</div>
                          <div className="text-xs text-slate-400">{order.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs max-w-[140px] truncate">{order.kktModel || '—'}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-700 whitespace-nowrap">
                          {order.total ? `${order.total} ₽` : '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{order.source}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{order.manager || '—'}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Подвал таблицы */}
          {filteredOrders.length > 0 && (
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Показано: {filteredOrders.length} из {orders.length}
              </span>
              <span className="text-xs text-slate-400">
                Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}
              </span>
            </div>
          )}
        </div>

        {/* Инструкция */}
        <div className="mt-8 p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
          <h2 className="text-sm font-bold text-[#1e3a5f] mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" /> Подключение реальных данных
          </h2>
          <div className="text-xs text-slate-600 leading-relaxed space-y-2">
            <p>
              Для подключения реальных данных из Яндекс Таблиц выполните следующие шаги:
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>Создайте файл <code className="bg-slate-100 px-1 rounded font-mono">tellur.xlsx</code> на Яндекс Диске</li>
              <li>Настройте PHP-прокси или Яндекс Функцию (см. <code className="bg-slate-100 px-1 rounded font-mono">src/config/yandex-tables.ts</code>)</li>
              <li>Укажите URL прокси в переменной <code className="bg-slate-100 px-1 rounded font-mono">NEXT_PUBLIC_CRM_PROXY_URL</code></li>
              <li>Пересоберите и задеплойте сайт</li>
            </ol>
            <p className="text-slate-400">
              Пока CRM не подключена, дашборд показывает демонстрационные данные для оценки интерфейса.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
