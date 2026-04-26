'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  LogOut, RefreshCw, Search, ChevronDown, ChevronUp,
  Filter, X, Loader2, AlertTriangle, Building2, ArrowLeft,
  Phone, Mail, ClipboardList, Download, FileText,
  CheckCircle2, Clock, Ban, MessageSquare, Printer
} from 'lucide-react'
import { APPS_SCRIPT_URL, isAppsScriptConfigured } from '@/config/admin'

interface Order {
  _row: string
  [key: string]: string
}

interface DashboardData {
  orders: Order[]
  total: number
  headers: string[]
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  'новый': { label: 'Новый', color: 'text-blue-700', bg: 'bg-blue-100' },
  'в работе': { label: 'В работе', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  'ждёт звонка': { label: 'Ждёт звонка', color: 'text-purple-700', bg: 'bg-purple-100' },
  'выполнен': { label: 'Выполнен', color: 'text-green-700', bg: 'bg-green-100' },
  'отменён': { label: 'Отменён', color: 'text-red-700', bg: 'bg-red-100' },
  'консультация': { label: 'Консультация', color: 'text-indigo-700', bg: 'bg-indigo-100' },
}

function getStatusBadge(status: string) {
  const s = STATUS_MAP[status.toLowerCase()]
  if (!s) return { label: status, color: 'text-slate-700', bg: 'bg-slate-100' }
  return s
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [updateLoading, setUpdateLoading] = useState<string | null>(null)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const getToken = () => localStorage.getItem('admin_token') || ''

  const fetchOrders = useCallback(async () => {
    if (!isAppsScriptConfigured()) {
      setError('GOOGLE_APPS_SCRIPT_NOT_CONFIGURED')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const token = getToken()
      if (!token) { window.location.href = '/admin/login'; return }
      const res = await fetch(`${APPS_SCRIPT_URL}?action=getOrders&token=${encodeURIComponent(token)}`)
      const d = await res.json()
      if (!res.ok || d.error) {
        if (d.error?.includes('auth') || d.error?.includes('session') || res.status === 401) {
          localStorage.removeItem('admin_token')
          window.location.href = '/admin/login'
          return
        }
        throw new Error(d.error || 'Ошибка')
      }
      setData(d)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleLogout = async () => {
    setLogoutLoading(true)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_token_time')
    window.location.href = '/admin/login'
  }

  const handleStatusChange = async (rowIndex: string, newStatus: string) => {
    if (!data) return
    setUpdateLoading(rowIndex)
    try {
      const token = getToken()
      const res = await fetch(`${APPS_SCRIPT_URL}?action=updateOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          rowIndex,
          updates: { Статус: newStatus },
        }),
      })
      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            orders: prev.orders.map((o) =>
              o._row === rowIndex ? { ...o, Статус: newStatus } : o
            ),
          }
        })
      }
    } catch {
      // silent
    } finally {
      setUpdateLoading(null)
    }
  }

  const handleCommentUpdate = async (rowIndex: string, comment: string) => {
    setUpdateLoading(rowIndex)
    try {
      const token = getToken()
      const res = await fetch(`${APPS_SCRIPT_URL}?action=updateOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          rowIndex,
          updates: { 'Комментарий менеджера': comment },
        }),
      })
      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            orders: prev.orders.map((o) =>
              o._row === rowIndex ? { ...o, 'Комментарий менеджера': comment } : o
            ),
          }
        })
      }
    } catch {
      // silent
    } finally {
      setUpdateLoading(null)
    }
  }

  // Фильтрация
  const filteredOrders = (data?.orders || []).filter((o) => {
    if (statusFilter && (o['Статус'] || '').toLowerCase() !== statusFilter.toLowerCase()) return false
    if (search) {
      const q = search.toLowerCase()
      const searchable = [o['Клиент'] || o['_col2'], o['Телефон'] || o['_col3'], o['Email'] || o['_col4'], o['Заказ №'] || o['_col1'], o['ККМ'] || o['_col5'], o['Услуги'] || o['_col7'], o['Комментарий'] || o['_col9']].filter(Boolean).join(' ').toLowerCase()
      if (!searchable.includes(q)) return false
    }
    return true
  })

  // Статистика
  const stats = {
    total: (data?.orders || []).length,
    newCount: (data?.orders || []).filter((o) => (o['Статус'] || '').toLowerCase() === 'новый').length,
    inProgress: (data?.orders || []).filter((o) => (o['Статус'] || '').toLowerCase() === 'в работе').length,
    waitingCall: (data?.orders || []).filter((o) => (o['Статус'] || '').toLowerCase() === 'ждёт звонка').length,
  }

  const displayHeaders = data?.headers || [
    'Дата/время', 'Заказ №', 'Клиент', 'Телефон', 'Email',
    'ККМ', 'Состояние', 'Услуги', 'Сумма', 'Комментарий'
  ]

  const getStatusFromOrder = (o: Order) => o['Статус'] || ''

  const handlePrintOrder = (order: Order) => {
    const orderNum = order['Заказ №'] || ''
    const isDiag = orderNum.startsWith('ДИАГ-')

    // Для диагностических заказов — восстанавливаем из данных, а не из сохранённого HTML
    // (Google Sheets искажает HTML-содержимое, поэтому сохранённый orderHtml не читается)
    if (isDiag) {
      const phone = (order['Телефон'] || order['_col3'] || '').replace(/^['#]/, '')
      const clientName = order['Клиент'] || ''
      const timestamp = order['Дата/время'] || ''
      const status = order['Статус'] || ''
      const kkm = order['ККМ'] || ''
      const services = order['Услуги'] || ''
      const clientComment = order['Комментарий'] || ''
      const managerComment = order['Комментарий менеджера'] || ''

      // Разбираем сводку из комментария (формат: "Результат: ✅ Оборудование | ⚠️ Фискальные данные | ...")
      const summaryMatch = clientComment.match(/Результат:\s*(.+)/)
      const summaryParts = summaryMatch ? summaryMatch[1].split('|').map((s: string) => s.trim()) : []
      // Разбираем кассу из комментария (формат: "Касса: АТОЛ АТОЛ 30Ф")
      const kkmMatch = clientComment.match(/Касса:\s*(.+)/)
      const diagKkm = kkmMatch ? kkmMatch[1].trim() : (kkm || '—')

      // Цвета и метки статусов
      const statusStyles: Record<string, { color: string; bg: string; label: string }> = {
        '✅': { color: '#16a34a', bg: '#f0fdf4', label: 'В порядке' },
        '⚠️': { color: '#d97706', bg: '#fffbeb', label: 'Нужно проверить' },
        '❌': { color: '#dc2626', bg: '#fef2f2', label: 'Есть проблемы' },
      }

      const layersHtml = summaryParts.map((part: string) => {
        const emoji = part.charAt(0)
        const name = part.slice(2).trim()
        const st = statusStyles[emoji] || statusStyles['⚠️']
        return `<tr>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1e3a5f;">${name}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;">
            <span style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;color:${st.color};background:${st.bg};">${st.label}</span>
          </td>
        </tr>`
      }).join('')

      const hasProblems = summaryParts.some((p: string) => p.startsWith('⚠️') || p.startsWith('❌'))

      const printHtml = `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><title>Диагностика ${orderNum}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:13px;color:#222;padding:30px;max-width:650px;margin:0 auto}
h1{font-size:18px;margin-bottom:4px}.sub{color:#666;font-size:12px;margin-bottom:20px}
table{width:100%;border-collapse:collapse;margin-bottom:16px}th,td{border:1px solid #ddd;padding:8px 10px;text-align:left;font-size:13px}
th{background:#f5f5f5;font-weight:600;width:140px}.st{font-weight:700;font-size:14px;margin:18px 0 8px;padding-bottom:4px;border-bottom:2px solid #1e3a5f}
.cb{background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 14px;margin-top:10px;font-size:12px}.cb strong{display:block;margin-bottom:4px}
.kkt-row{background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:8px 14px;margin-bottom:16px;font-size:12px;color:#0369a1}
.sig{display:flex;justify-content:space-between;margin-top:40px}.sig div{width:200px;text-align:center}.sig .l{border-top:1px solid #333;margin-bottom:4px;padding-top:30px}
.ft{margin-top:30px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#999}@media print{body{padding:15px}}</style>
</head><body><h1>Диагностика маркировки ${orderNum}</h1><p class="sub">${timestamp}${status ? ' &middot; Статус: ' + status : ''}</p>
<div class="st">Клиент</div><table><tr><th>Имя</th><td>${clientName}</td></tr>${phone ? `<tr><th>Телефон</th><td>${phone}</td></tr>` : ''}</table>
<div class="kkt-row"><strong>Касса клиента:</strong> ${diagKkm}</div>
<div class="st">Результат проверки</div><table>
<thead><tr style="background:#f8fafc;"><th style="padding:6px 10px;text-align:left;border-bottom:2px solid #e2e8f0;font-size:11px;text-transform:uppercase;color:#64748b;">Слой</th><th style="padding:6px 10px;text-align:left;border-bottom:2px solid #e2e8f0;font-size:11px;text-transform:uppercase;color:#64748b;">Статус</th></tr></thead>
<tbody>${layersHtml}</tbody></table>
${hasProblems ? '<div class="cb"><strong>Рекомендация:</strong>Обнаружены проблемы в настройке маркировки. Рекомендуется бесплатная консультация специалиста.</div>' : '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#16a34a;"><strong>Маркировка настроена хорошо.</strong> Рекомендуем периодическую проверку.</div>'}
${clientComment ? `<div class="cb"><strong>Комментарий:</strong>${clientComment}</div>` : ''}${managerComment ? `<div class="cb"><strong>Заметки менеджера:</strong>${managerComment}</div>` : ''}
<div class="sig"><div><div class="l"></div>Специалист</div><div><div class="l"></div>Клиент</div></div>
<div class="ft">OOO &laquo;Теллур-Интех&raquo; &middot; +7 (812) 465-94-57 &middot; push@tellur.spb.ru</div></body></html>`
      const win = window.open('', '_blank')
      if (win) { win.document.write(printHtml); win.document.close(); setTimeout(() => { win.print() }, 300) }
      return
    }

    // Для обычных заказов — используем сохранённый HTML или строим из данных
    const savedHtml = order['Файл заказа'] || order['_col12'] || order['orderHtml'] || ''

    if (savedHtml && savedHtml.includes('<html')) {
      const win = window.open('', '_blank')
      if (win) {
        win.document.write(savedHtml)
        win.document.close()
        setTimeout(() => { win.print() }, 500)
      }
    } else {
      const phone = (order['Телефон'] || order['_col3'] || '').replace(/^['#]/, '')
      const clientName = order['Клиент'] || ''
      const email = (order['Email'] || order['_col4'] || '').replace(/^['#]/, '')
      const kkm = order['ККМ'] || ''
      const services = order['Услуги'] || ''
      const total = order['Сумма'] || order['Итого'] || '0'
      const timestamp = order['Дата/время'] || ''
      const status = order['Статус'] || ''
      const inn = order['ИНН'] || ''
      const clientComment = order['Комментарий'] || ''
      const managerComment = order['Комментарий менеджера'] || ''
      const condition = order['Состояние'] || ''

      const printHtml = `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><title>Заказ №${orderNum}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:13px;color:#222;padding:30px;max-width:700px;margin:0 auto}
h1{font-size:18px;margin-bottom:4px}.sub{color:#666;font-size:12px;margin-bottom:20px}
table{width:100%;border-collapse:collapse;margin-bottom:16px}th,td{border:1px solid #ddd;padding:8px 10px;text-align:left;font-size:13px}
th{background:#f5f5f5;font-weight:600;width:140px}.st{font-weight:700;font-size:14px;margin:18px 0 8px;padding-bottom:4px;border-bottom:2px solid #1e3a5f}
.cb{background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 14px;margin-top:10px;font-size:12px}.cb strong{display:block;margin-bottom:4px}
.sig{display:flex;justify-content:space-between;margin-top:40px}.sig div{width:200px;text-align:center}.sig .l{border-top:1px solid #333;margin-bottom:4px;padding-top:30px}
.ft{margin-top:30px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#999}@media print{body{padding:15px}}</style>
</head><body><h1>Заказ-наряд №${orderNum}</h1><p class="sub">${timestamp}${status ? ' · Статус: ' + status : ''}</p>
<div class="st">Клиент</div><table><tr><th>Клиент</th><td>${clientName}</td></tr>${inn ? `<tr><th>ИНН</th><td>${inn}</td></tr>` : ''}${phone ? `<tr><th>Телефон</th><td>${phone}</td></tr>` : ''}${email ? `<tr><th>Email</th><td>${email}</td></tr>` : ''}</table>
<div class="st">Касса</div><table><tr><th>Тип ККМ</th><td>${kkm || '—'}</td></tr>${condition ? `<tr><th>Состояние</th><td>${condition}</td></tr>` : ''}</table>
<div class="st">Услуги</div><table><tr><th>Перечень</th><td>${services || '—'}</td></tr><tr><th>Сумма</th><td><strong>${total} ₽</strong></td></tr></table>
${clientComment ? `<div class="cb"><strong>Комментарий клиента:</strong>${clientComment}</div>` : ''}${managerComment ? `<div class="cb"><strong>Заметки менеджера:</strong>${managerComment}</div>` : ''}
<div class="sig"><div><div class="l"></div>Исполнитель</div><div><div class="l"></div>Клиент</div></div>
<div class="ft">ООО «Теллур-Интех» · +7 (812) 465-94-57 · push@tellur.spb.ru</div></body></html>`
      const win = window.open('', '_blank')
      if (win) { win.document.write(printHtml); win.document.close(); setTimeout(() => { win.print() }, 300) }
    }
  }

  // Извлечение данных заказа — единая функция для мобильных карточек и таблицы
  const getOrderData = (order: Order) => {
    const phone = (order['Телефон'] || order['_col3'] || '').replace(/^['#]/, '')
    const clientName = order['Клиент'] || order['_col2'] || ''
    const kkm = order['ККМ'] || order['_col5'] || ''
    const services = order['Услуги'] || order['_col7'] || ''
    const total = order['Сумма'] || order['_col8'] || order['Итого'] || '0'
    const orderNum = order['Заказ №'] || order['_col1'] || order['Дата/время']?.slice(0, 10) || ''
    const timestamp = order['Дата/время'] || order['_col0'] || ''
    const email = (order['Email'] || order['_col4'] || '').replace(/^['#]/, '')
    const clientComment = order['Комментарий'] || order['_col9'] || order['Примечание'] || ''
    const managerComment = order['Комментарий менеджера'] || order['_col11'] || ''
    const inn = order['ИНН'] || ''
    const status = getStatusFromOrder(order)
    const badge = getStatusBadge(status)
    return { phone, clientName, kkm, services, total, orderNum, timestamp, email, clientComment, managerComment, inn, status, badge }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Шапка */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
            </div>
            <h1 className="font-semibold text-[#1e3a5f] text-sm sm:text-base">Кабинет</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#1e3a5f] transition-colors disabled:opacity-40"
              title="Обновить"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              {logoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              <span className="hidden sm:inline">Выход</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Статистика */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase">Всего</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#1e3a5f]">{stats.total}</p>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
              <span className="text-[10px] sm:text-xs font-medium text-blue-600 uppercase">Новые</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-700">{stats.newCount}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
              <span className="text-[10px] sm:text-xs font-medium text-yellow-600 uppercase">В работе</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-yellow-700">{stats.inProgress}</p>
          </div>
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
              <span className="text-[10px] sm:text-xs font-medium text-purple-600 uppercase">Ждёт звонка</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-purple-700">{stats.waitingCall}</p>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-initial px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-colors"
            >
              <option value="">Все статусы</option>
              <option value="новый">Новый</option>
              <option value="в работе">В работе</option>
              <option value="ждёт звонка">Ждёт звонка</option>
              <option value="выполнен">Выполнен</option>
              <option value="отменён">Отменён</option>
              <option value="консультация">Консультация</option>
            </select>
            <span className="text-[11px] sm:text-xs text-slate-400 whitespace-nowrap">
              {filteredOrders.length}/{data?.total || 0}
            </span>
          </div>
        </div>

        {/* Ошибка / Настройка Google Sheets */}
        {error && !data && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-start gap-3 p-4 sm:p-5 bg-amber-50 border-b border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Не удалось загрузить заказы</p>
                <p className="text-sm text-amber-700 mt-0.5">{error}</p>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <h3 className="text-base font-semibold text-slate-800">Инструкция по настройке</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Создайте Google Таблицу</p>
                    <p className="text-sm text-slate-500 mt-0.5">Откройте <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] underline">Google Sheets</a> и создайте новую таблицу. В первой строке (Лист1) добавьте заголовки колонок:</p>
                    <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-700 overflow-x-auto">
                      Дата/время | Заказ № | Клиент | Телефон | Email | ККМ | Состояние | Услуги | Сумма | Комментарий | Статус | Комментарий менеджера | Файл заказа
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Создайте сервисный аккаунт Google Cloud</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Перейдите в <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] underline">Google Cloud Console</a> → создайте проект → включите <strong>Google Sheets API</strong> → создайте сервисный аккаунт → скачайте JSON-ключ.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Дайте доступ сервисному аккаунту к таблице</p>
                    <p className="text-sm text-slate-500 mt-0.5">Откройте созданную Google Таблицу → кнопку «Поделиться» → вставьте email сервисного аккаунта из JSON-ключа (поле <code className="bg-slate-100 px-1 rounded text-xs">client_email</code>) → роль «Редактор».</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center">4</span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Настройте переменные окружения в Vercel</p>
                    <p className="text-sm text-slate-500 mt-0.5">В панели Vercel → Settings → Environment Variables добавьте:</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <span className="font-mono font-semibold text-slate-700">GOOGLE_SHEETS_ID</span>
                        <span className="text-slate-400 mx-2">=</span>
                        <span className="text-slate-500">ID из URL таблицы (docs.google.com/spreadsheets/d/<strong>ID</strong>/edit)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={fetchOrders} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1e3a5f] rounded-lg hover:bg-[#1e3a5f]/90 transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Попробовать снова
              </button>
            </div>
          </div>
        )}

        {/* Загрузка */}
        {loading && !data && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#1e3a5f]" />
            <span className="ml-2 text-sm text-slate-500">Загрузка заказов...</span>
          </div>
        )}

        {/* ========================================= */}
        {/* МОБИЛЬНЫЕ КАРТОЧКИ (только на маленьких экранах) */}
        {/* ========================================= */}
        {data && (
          <>
            <div className="sm:hidden space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
                  {search || statusFilter ? 'Заказы не найдены' : 'Нет заказов'}
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const d = getOrderData(order)
                  const isExpanded = expandedRow === order._row
                  return (
                    <div key={order._row} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      {/* Заголовок карточки */}
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono text-xs font-semibold text-[#1e3a5f]">#{d.orderNum}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${d.badge.bg} ${d.badge.color}`}>
                                {d.badge.label}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-slate-800 truncate">{d.clientName || '—'}</p>
                          </div>
                          <p className="text-sm font-bold text-slate-800 whitespace-nowrap shrink-0">
                            {parseInt(d.total.replace(/[^\d]/g, ''))?.toLocaleString('ru-RU') || '0'} ₽
                          </p>
                        </div>

                        {/* Телефон и дата */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                          <span className="truncate">{d.timestamp}</span>
                          {d.kkm && <span className="truncate text-slate-400">{d.kkm}</span>}
                        </div>

                        {/* Телефон — крупный и кликабельный */}
                        {d.phone && (
                          <a
                            href={`tel:${d.phone.replace(/[\s()-]/g, '')}`}
                            className="flex items-center gap-2 px-3 py-2 bg-[#1e3a5f]/5 border border-[#1e3a5f]/15 rounded-lg text-sm font-medium text-[#1e3a5f] mb-2 active:bg-[#1e3a5f]/10"
                          >
                            <Phone className="w-4 h-4 shrink-0" />
                            <span>{d.phone}</span>
                          </a>
                        )}

                        {/* Кнопки действий — всегда видны */}
                        <div className="flex items-center gap-2">
                          <select
                            value={d.status}
                            onChange={(e) => handleStatusChange(order._row, e.target.value)}
                            disabled={updateLoading === order._row}
                            className={`flex-1 text-xs font-medium px-2.5 py-2 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 ${d.badge.bg} ${d.badge.color}`}
                          >
                            <option value="">— статус —</option>
                            <option value="новый">Новый</option>
                            <option value="ждёт звонка">Ждёт звонка</option>
                            <option value="в работе">В работе</option>
                            <option value="выполнен">Выполнен</option>
                            <option value="отменён">Отменён</option>
                            <option value="консультация">Консультация</option>
                          </select>
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : order._row)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Расширенная часть */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/50 px-3 py-3 space-y-3">
                          {/* Детали клиента */}
                          <div className="space-y-1.5 text-sm">
                            {d.inn && <p className="text-slate-600">ИНН: {d.inn}</p>}
                            {d.email && (
                              <a href={`mailto:${d.email}`} className="flex items-center gap-1.5 text-[#1e3a5f] hover:underline text-xs">
                                <Mail className="w-3.5 h-3.5" />{d.email}
                              </a>
                            )}
                            {d.services && <p className="text-xs text-slate-600"><span className="text-slate-400">Услуги:</span> {d.services}</p>}
                          </div>

                          {/* Комментарий клиента */}
                          {d.clientComment && (
                            <div className="bg-amber-50/70 border border-amber-200/50 rounded-lg p-2.5">
                              <p className="text-[11px] font-semibold text-amber-600 mb-0.5 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" /> Комментарий клиента
                              </p>
                              <p className="text-xs text-slate-700">{d.clientComment}</p>
                            </div>
                          )}

                          {/* Комментарий менеджера */}
                          <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Заметки менеджера
                            </p>
                            <textarea
                              value={d.managerComment}
                              onChange={(e) => handleCommentUpdate(order._row, e.target.value)}
                              onBlur={(e) => handleCommentUpdate(order._row, e.target.value)}
                              placeholder="Добавить комментарий..."
                              rows={2}
                              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-colors resize-y"
                            />
                          </div>

                          {/* Кнопки */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handlePrintOrder(order)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1e3a5f] bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg hover:bg-[#1e3a5f]/10 transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" />Печать
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${d.clientName}\n${d.phone}\n${d.email}\n\nУслуги: ${d.services}\nСумма: ${d.total} ₽`)
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />Копировать
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* ========================================= */}
            {/* ДЕСКТОПНАЯ ТАБЛИЦА (скрыта на мобильных) */}
            {/* ========================================= */}
            <div className="hidden sm:block bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Заказ</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Дата</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Клиент</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Телефон</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">ККМ</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Услуги</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Сумма</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Статус</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                          {search || statusFilter ? 'Заказы не найдены' : 'Нет заказов'}
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const d = getOrderData(order)
                        const isExpanded = expandedRow === order._row

                        return (
                          <>
                            <tr key={order._row} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3">
                                <span className="font-mono text-xs font-medium text-[#1e3a5f]">#{d.orderNum}</span>
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                                {d.timestamp}
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-medium text-slate-800 truncate max-w-[180px]">{d.clientName || '—'}</p>
                              </td>
                              <td className="px-4 py-3">
                                {d.phone ? (
                                  <a href={`tel:${d.phone.replace(/[\s()-]/g, '')}`} className="text-xs text-[#1e3a5f] hover:underline whitespace-nowrap">{d.phone}</a>
                                ) : <span className="text-xs text-slate-400">—</span>}
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell whitespace-nowrap max-w-[120px] truncate">
                                {d.kkm || '—'}
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-600 hidden lg:table-cell max-w-[200px] truncate">
                                {d.services || '—'}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                                {parseInt(d.total.replace(/[^\d]/g, ''))?.toLocaleString('ru-RU') || '0'} ₽
                              </td>
                              <td className="px-4 py-3 text-center">
                                <select
                                  value={d.status}
                                  onChange={(e) => handleStatusChange(order._row, e.target.value)}
                                  disabled={updateLoading === order._row}
                                  className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 ${d.badge.bg} ${d.badge.color}`}
                                >
                                  <option value="">—</option>
                                  <option value="новый">Новый</option>
                                  <option value="ждёт звонка">Ждёт звонка</option>
                                  <option value="в работе">В работе</option>
                                  <option value="выполнен">Выполнен</option>
                                  <option value="отменён">Отменён</option>
                                  <option value="консультация">Консультация</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => setExpandedRow(isExpanded ? null : order._row)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr key={`${order._row}-expanded`}>
                                <td colSpan={9} className="px-4 py-0">
                                  <div className="bg-slate-50/80 border-t border-b border-slate-100 p-5 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div>
                                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                                          <Building2 className="w-3.5 h-3.5" /> Клиент
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                          {d.clientName && <p className="font-medium text-slate-800">{d.clientName}</p>}
                                          {d.inn && <p className="text-slate-600">ИНН: {d.inn}</p>}
                                          {d.phone && (
                                            <a href={`tel:${d.phone.replace(/[\s()-]/g, '')}`} className="flex items-center gap-1.5 text-[#1e3a5f] hover:underline">
                                              <Phone className="w-3.5 h-3.5" />{d.phone}
                                            </a>
                                          )}
                                          {d.email && (
                                            <a href={`mailto:${d.email}`} className="flex items-center gap-1.5 text-[#1e3a5f] hover:underline">
                                              <Mail className="w-3.5 h-3.5" />{d.email}
                                            </a>
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                                          <FileText className="w-3.5 h-3.5" /> Касса
                                        </h4>
                                        <div className="space-y-1 text-sm text-slate-600">
                                          {d.kkm && <p>Тип: <span className="font-medium">{d.kkm}</span></p>}
                                          {order['Состояние'] && <p>Состояние: {order['Состояние']}</p>}
                                        </div>
                                      </div>

                                      <div className="sm:col-span-2 lg:col-span-1">
                                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                                          <ClipboardList className="w-3.5 h-3.5" /> Услуги
                                        </h4>
                                        <p className="text-sm text-slate-600">{d.services || '—'}</p>
                                      </div>
                                    </div>

                                    {d.clientComment && (
                                      <div className="bg-amber-50/70 border border-amber-200/50 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-amber-600 mb-1 flex items-center gap-1.5">
                                          <MessageSquare className="w-3 h-3" /> Комментарий клиента
                                        </p>
                                        <p className="text-sm text-slate-700">{d.clientComment}</p>
                                      </div>
                                    )}

                                    <div>
                                      <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Заметки менеджера
                                      </h4>
                                      <textarea
                                        value={d.managerComment}
                                        onChange={(e) => handleCommentUpdate(order._row, e.target.value)}
                                        onBlur={(e) => handleCommentUpdate(order._row, e.target.value)}
                                        placeholder="Добавить комментарий к заказу..."
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-colors resize-y"
                                      />
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                      {d.phone && (
                                        <a
                                          href={`tel:${d.phone.replace(/[\s()-]/g, '')}`}
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1e3a5f] bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg hover:bg-[#1e3a5f]/10 transition-colors"
                                        >
                                          <Phone className="w-3.5 h-3.5" />Позвонить
                                        </a>
                                      )}
                                      <button
                                        onClick={() => handlePrintOrder(order)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1e3a5f] bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg hover:bg-[#1e3a5f]/10 transition-colors"
                                      >
                                        <Printer className="w-3.5 h-3.5" />Печать
                                      </button>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(`${d.clientName}\n${d.phone}\n${d.email}\n\nУслуги: ${d.services}\nСумма: ${d.total} ₽`)
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                                      >
                                        <Download className="w-3.5 h-3.5" />Копировать
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {data && (
              <p className="text-xs text-center text-slate-400">
                Данные загружены из Google Sheets. Изменения статуса сохраняются автоматически.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
