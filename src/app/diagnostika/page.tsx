'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Phone, ChevronRight, ChevronLeft, AlertTriangle,
  CheckCircle2, HelpCircle, ArrowRight, ShieldCheck,
  Monitor, Settings, FileText, Eye, Wifi,
  Clock, MessageCircle, Loader2, Send, Calculator, RefreshCw
} from 'lucide-react'
import { KKT_CATALOG } from '@/config/kkt-catalog'

// ============================================================================
// ТИПЫ
// ============================================================================

interface Question {
  id: string
  title: string
  subtitle?: string
  options: Option[]
}

interface Option {
  label: string
  scores: Record<string, number>
}

interface LayerResult {
  id: string
  title: string
  icon: React.ReactNode
  score: number
  maxScore: number
  status: 'green' | 'yellow' | 'red'
  tips: string[]
}

// ============================================================================
// 5 СЛОЁВ ПРОВЕРКИ
// ============================================================================

const LAYERS = [
  { id: 'hardware', title: 'Оборудование', icon: <Monitor className="w-5 h-5" /> },
  { id: 'fiscal', title: 'Фискальные данные', icon: <Settings className="w-5 h-5" /> },
  { id: 'online', title: 'Онлайн-сервисы', icon: <Wifi className="w-5 h-5" /> },
  { id: 'docs', title: 'Документооборот', icon: <FileText className="w-5 h-5" /> },
  { id: 'knowledge', title: 'Знание и контроль', icon: <Eye className="w-5 h-5" /> },
]

// ============================================================================
// 8 ВОПРОСОВ
// ============================================================================

const QUESTIONS: Question[] = [
  {
    id: 'q1_experience',
    title: 'Когда вы впервые столкнулись с маркировкой?',
    options: [
      { label: 'Только планирую', scores: { knowledge: 0, hardware: 0, fiscal: 0, online: 0, docs: 0 } },
      { label: '2020–2021 (первые волны)', scores: { knowledge: 0, hardware: 0, fiscal: 0, online: 0, docs: 0 } },
      { label: '2022–2023', scores: { knowledge: 1, hardware: 1, fiscal: 1, online: 1, docs: 1 } },
      { label: '2024–2025', scores: { knowledge: 2, hardware: 2, fiscal: 2, online: 2, docs: 2 } },
    ],
  },
  {
    id: 'q2_categories',
    title: 'Какие товарные группы вы продаёте или планируете продавать?',
    subtitle: 'Выберите всё, что относится к вам',
    options: [
      { label: 'Одежда и текстиль', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Обувь', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Молочная продукция', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Вода', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Табак', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Лекарства', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Парфюмерия', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Пиво / слабый алкоголь', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Шины', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Бытовая химия', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Фотоаппараты / лампы-вспышки', scores: { knowledge: 2, docs: 1, online: 1, hardware: 0, fiscal: 0 } },
      { label: 'Другая группа', scores: { knowledge: 1, docs: 0, online: 0, hardware: 0, fiscal: 0 } },
      { label: 'Пока не продаю маркировку', scores: { knowledge: 0, docs: 0, online: 0, hardware: 0, fiscal: 0 } },
      { label: 'Планирую начать', scores: { knowledge: 0, docs: 0, online: 0, hardware: 0, fiscal: 0 } },
    ],
  },
  {
    id: 'q3_has_marked',
    title: 'Есть ли у вас товар с квадратиками-кодами (маркировкой)?',
    options: [
      { label: 'Да, весь товар с кодами', scores: { hardware: 2, fiscal: 1, online: 1, docs: 1, knowledge: 2 } },
      { label: 'Часть с кодами, часть без', scores: { hardware: 1, fiscal: 0, online: 0, docs: 0, knowledge: 1 } },
      { label: 'Нет, весь товар без кодов', scores: { hardware: 0, fiscal: 0, online: 0, docs: 0, knowledge: 0 } },
      { label: 'Не знаю, что это за коды', scores: { knowledge: 0, hardware: 0, fiscal: 0, online: 0, docs: 0 } },
    ],
  },
  {
    id: 'q4_scanning',
    title: 'Сканируете ли вы с товара код-квадратик при продаже?',
    options: [
      { label: 'Да, всегда сканером', scores: { hardware: 2, fiscal: 2, online: 1, docs: 0, knowledge: 2 } },
      { label: 'Вручную — ввожу код руками', scores: { hardware: 1, fiscal: 1, online: 0, docs: 0, knowledge: 1 } },
      { label: 'Не знаю, о каких квадратиках речь', scores: { hardware: 0, fiscal: 0, online: 0, docs: 0, knowledge: 0 } },
      { label: 'Ещё не продаю маркированный товар', scores: { hardware: 0, fiscal: 0, online: 0, docs: 0, knowledge: 0 } },
    ],
  },
  {
    id: 'q5_cz_visited',
    title: 'Заходили ли вы на честныйзнак.рф за последний месяц?',
    options: [
      { label: 'Да, захожу регулярно', scores: { online: 2, knowledge: 2, docs: 1, hardware: 0, fiscal: 1 } },
      { label: 'Давно не заходил', scores: { online: 0, knowledge: 0, docs: 0, hardware: 0, fiscal: 0 } },
      { label: 'Один раз при регистрации — и всё', scores: { online: 0, knowledge: 0, docs: 0, hardware: 0, fiscal: 0 } },
      { label: 'Не знаю, что это', scores: { online: 0, knowledge: 0, docs: 0, hardware: 0, fiscal: 0 } },
    ],
  },
  {
    id: 'q6_cz_checks',
    title: 'Видели ли вы на честныйзнак.рф свои продажи (пробитые чеки)?',
    options: [
      { label: 'Да, видел', scores: { online: 2, fiscal: 2, knowledge: 2, hardware: 1, docs: 1 } },
      { label: 'Не проверял', scores: { online: 0, knowledge: 0, fiscal: 0, hardware: 0, docs: 0 } },
      { label: 'Не знаю где смотреть', scores: { online: 0, knowledge: 0, fiscal: 0, hardware: 0, docs: 0 } },
    ],
  },
  {
    id: 'q7_auto_reception',
    title: 'Товар от поставщика сам появляется в вашей учётной программе (1С, МойСклад и т.д.)?',
    options: [
      { label: 'Да, сам приходит', scores: { docs: 2, online: 2, hardware: 1, fiscal: 1, knowledge: 2 } },
      { label: 'Приходят накладные, но вбиваю вручную', scores: { docs: 0, online: 0, hardware: 0, fiscal: 0, knowledge: 1 } },
      { label: 'Нет учётной программы', scores: { docs: 0, online: 0, hardware: 0, fiscal: 0, knowledge: 0 } },
      { label: 'Не знаю', scores: { docs: 0, online: 0, hardware: 0, fiscal: 0, knowledge: 0 } },
    ],
  },
  {
    id: 'q8_subscriptions',
    title: 'Знаете ли вы, за что платите каждый месяц по кассе?',
    options: [
      { label: 'Да, всё понимаю', scores: { knowledge: 2, online: 2, docs: 1, hardware: 1, fiscal: 1 } },
      { label: 'Примерно знаю', scores: { knowledge: 1, online: 1, docs: 0, hardware: 0, fiscal: 0 } },
      { label: 'Платю потому что «надо»', scores: { knowledge: 0, online: 0, docs: 0, hardware: 0, fiscal: 0 } },
      { label: 'Не знаю', scores: { knowledge: 0, online: 0, docs: 0, hardware: 0, fiscal: 0 } },
    ],
  },
]

// ============================================================================
// МАКСИМАЛЬНЫЕ БАЛЛЫ
// ============================================================================

const MAX_SCORES: Record<string, number> = { hardware: 8, fiscal: 10, online: 10, docs: 6, knowledge: 14 }

// ============================================================================
// ПОДСКАЗКИ ПО СЛОЯМ
// ============================================================================

const TIPS: Record<string, Record<string, string[]>> = {
  hardware: {
    green: ['Оборудование настроено корректно', 'Сканер считывает коды маркировки'],
    yellow: ['Проверьте, считывает ли ваш сканер квадратные коды Data Matrix', 'Убедитесь, что в карточке товара на кассе стоит признак «маркированный»', 'Проверьте актуальность прошивки кассы'],
    red: ['Вам может потребоваться 2D-сканер для считывания кодов маркировки', 'Прошивка кассы может быть устаревшей — нужна поддержка ФФД 1.2', 'Настройки кассы (ОИСМ, порты) могли быть нарушены'],
  },
  fiscal: {
    green: ['Фискальные данные передаются корректно'],
    yellow: ['Проверьте, что касса формирует актуальные теги маркировки в чеке', 'Убедитесь, что признак маркированного товара передаётся в чеке', 'Возможно, обновление драйверов кассы решит проблему'],
    red: ['Касса может пробивать товар без передачи кода маркировки в чек', 'Необходима диагностика настроек фискальных параметров', 'Возможно, требуется обновление прошивки и драйверов'],
  },
  online: {
    green: ['Онлайн-сервисы настроены и работают'],
    yellow: ['Проверьте, получает ли ОФД ваши чеки', 'Проверьте токен Честного ЗНАК — возможно, требуется обновление', 'Проверьте подключение ТС ПИоТ'],
    red: ['Данные могут не доходить до Честного ЗНАК', 'Требуется полная проверка цепочки: касса → ОФД → ЧЗ', 'Подписки могут быть не оплачены или не настроены'],
  },
  docs: {
    green: ['Электронный документооборот работает автоматически'],
    yellow: ['Проверьте, попадают ли коды маркировки из накладных в учётную систему', 'Убедитесь, что ЭЦП актуальна и подходит к оператору ЭДО', 'Товар может приходить от поставщика, но коды не вноситься в Честный ЗНАК'],
    red: ['Товар от поставщика может «не существовать» в системе маркировки', 'Требуется подключение ЭДО для автоматической приёмки', 'Без ЭДО коды маркировки нужно вводить вручную в Честный ЗНАК'],
  },
  knowledge: {
    green: ['Вы контролируете свои настройки и платежи'],
    yellow: ['Рекомендуем периодически заходить на честныйзнак.рф и проверять чеки', 'Разберитесь, за какие именно услуги платите каждый месяц', 'Уточните, какие товарные группы стали обязательными после вашей последней настройки'],
    red: ['Рекомендуем бесплатный аудит текущей настройки', 'С 2020–2021 изменилось многое: новые группы, ФФД 1.2, ТС ПИоТ', 'Есть риск штрафов за незнание обязательных требований'],
  },
}

// ============================================================================
// МЭППИНГ СЛОЁВ → УСЛУГИ В КАЛЬКУЛЯТОРЕ
// ============================================================================

const LAYER_CALC_MAP: Record<string, {
  title: string
  calcServices: string[]
  description: string
}> = {
  hardware: {
    title: 'Оборудование',
    calcServices: ['Сканер 2D для кодов', 'Обновление прошивки кассы', 'Лицензия на ПО'],
    description: 'Правильно работающее оборудование — основа маркировки. Без 2D-сканера и актуальной прошивки касса не сможет считывать и передавать коды маркировки в чек.',
  },
  fiscal: {
    title: 'Фискальные данные',
    calcServices: ['Подключение маркировки', 'Регистрация/перерегистрация ККТ в ФНС'],
    description: 'Касса должна правильно передавать коды маркировки в чеке через ОФД в Честный ЗНАК. Без корректных фискальных настроек система маркировки не работает.',
  },
  online: {
    title: 'Онлайн-сервисы',
    calcServices: ['Подключение ОФД', 'Подключение маркировки'],
    description: 'Цепочка «касса → ОФД → Честный ЗНАК → ТС ПИоТ» должна работать без разрывов. Если хотя бы одно звено не настроено — данные теряются.',
  },
  docs: {
    title: 'Документооборот',
    calcServices: ['Подключение маркировки', 'Договор обслуживания'],
    description: 'ЭДО обеспечивает автоматическую приёмку товара от поставщика. Без ЭДО коды маркировки нужно вводить вручную в Честный ЗНАК, что занимает время и ведёт к ошибкам.',
  },
  knowledge: {
    title: 'Знание и контроль',
    calcServices: ['Обучение работе с кассой', 'Договор обслуживания'],
    description: 'Регулярное обслуживание и обучение помогают избежать сбоев и штрафов. Менеджер будет на связи и поможет при любых изменениях в законодательстве.',
  },
}

// ============================================================================
// КОМПОНЕНТ РЕКОМЕНДАЦИЙ → КАЛЬКУЛЯТОР
// ============================================================================

function CalcRecommendations({ results }: { results: LayerResult[] }) {
  const problemLayers = results.filter(r => r.status !== 'green')

  // Если всё зелёное — короткая карточка
  if (problemLayers.length === 0) {
    return (
      <div className="anim-fade-in mb-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-emerald-800 leading-snug">
              Ваша маркировка настроена хорошо
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-emerald-600 leading-relaxed">
              По результатам проверки проблем не обнаружено. Но требования меняются — рекомендуем периодическую проверку или подключить договор обслуживания.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/kalkulyatory/markirovka"
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#e8a817] hover:bg-[#d49a12] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#e8a817]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calculator className="w-5 h-5" />
            Рассчитать стоимость обслуживания
          </Link>
          <Link
            href="/services"
            className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#1e3a5f] font-semibold rounded-xl transition-all border-2 border-[#1e3a5f]/20 hover:border-[#1e3a5f]"
          >
            Все услуги
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // Есть проблемы — развёрнутые рекомендации с привязкой к калькулятору
  return (
    <div className="anim-fade-in mb-6 bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-[#e8a817]/30 rounded-2xl p-5 sm:p-6">
      <div className="flex items-start gap-3.5 mb-5">
        <div className="w-11 h-11 rounded-xl bg-[#e8a817]/10 flex items-center justify-center shrink-0">
          <Calculator className="w-6 h-6 text-[#e8a817]" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f] leading-snug">
            Что может потребоваться
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
            На основе вашей проверки мы рекомендуем обратить внимание на следующие услуги. Рассчитайте точную стоимость в калькуляторе.
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {problemLayers.map(layer => {
          const map = LAYER_CALC_MAP[layer.id]
          if (!map) return null
          const statusIcon = layer.status === 'red'
            ? <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />

          return (
            <div key={layer.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-start gap-2.5 mb-2">
                {statusIcon}
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#1e3a5f]">{map.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{map.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2.5 pl-6">
                {map.calcServices.map((svc, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#e8a817]/10 text-xs font-semibold text-[#b8860b]">
                    <Settings className="w-3 h-3" />
                    {svc}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Link
        href="/kalkulyatory/markirovka"
        className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[#e8a817] hover:bg-[#d49a12] text-white text-base sm:text-lg font-bold rounded-xl transition-all shadow-lg shadow-[#e8a817]/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]"
      >
        <Calculator className="w-5 h-5" />
        Рассчитать стоимость решения
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  )
}

// ============================================================================
// КОМПОНЕНТ
// 0 = intro, 1–8 = вопросы, 9 = форма контактов, 10 = результат
// ============================================================================

export default function DiagnostikaPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [selectedManufacturer, setSelectedManufacturer] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  const filteredModels = useMemo(() => {
    const mfr = KKT_CATALOG.find(m => m.id === selectedManufacturer)
    return mfr?.models || []
  }, [selectedManufacturer])

  // ---- выбор ответов ----
  const toggleAnswer = (qId: string, label: string) => {
    const isMulti = qId === 'q2_categories'
    setAnswers(prev => {
      const cur = prev[qId] || []
      if (isMulti) {
        const has = cur.includes(label)
        return { ...prev, [qId]: has ? cur.filter(l => l !== label) : [...cur, label] }
      }
      return { ...prev, [qId]: [label] }
    })
  }

  const isSelected = (qId: string, label: string) => (answers[qId] || []).includes(label)
  const isAnswered = (q: Question) => {
    const a = answers[q.id]
    if (!a || a.length === 0) return false
    return true
  }

  // ---- подсчёт результатов (доступен с шага 9) ----
  const results: LayerResult[] = useMemo(() => {
    if (step < 9) return []
    const scores: Record<string, number> = {}
    LAYERS.forEach(l => { scores[l.id] = 0 })
    QUESTIONS.forEach(q => {
      const sel = answers[q.id] || []
      q.options.forEach(opt => {
        if (sel.includes(opt.label)) {
          Object.entries(opt.scores).forEach(([lid, s]) => {
            scores[lid] = (scores[lid] || 0) + s
          })
        }
      })
    })
    return LAYERS.map(layer => {
      const raw = scores[layer.id]
      const max = MAX_SCORES[layer.id]
      const pct = max > 0 ? raw / max : 0
      let status: 'green' | 'yellow' | 'red' = 'red'
      if (pct >= 0.6) status = 'green'
      else if (pct >= 0.3) status = 'yellow'
      return { id: layer.id, title: layer.title, icon: layer.icon, score: raw, maxScore: max, status, tips: TIPS[layer.id][status] }
    })
  }, [step, answers])

  // ---- формирование HTML-бланка отчёта ----
  const buildReportHtml = (): string => {
    const statusColors = { green: '#16a34a', yellow: '#d97706', red: '#dc2626' }
    const statusLabels = { green: 'В порядке', yellow: 'Нужно проверить', red: 'Есть проблемы' }
    const statusBg = { green: '#f0fdf4', yellow: '#fffbeb', red: '#fef2f2' }

    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

    const now = new Date()
    const dateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

    const kktMfr = KKT_CATALOG.find(m => m.id === selectedManufacturer)
    const kktLabel = kktMfr ? (selectedModel ? `${kktMfr.name} ${selectedModel}` : kktMfr.name) : (selectedManufacturer === '_none' ? 'Нет кассы' : '')

    const layersHtml = results.map(r => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1e3a5f;">${esc(r.title)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">
          <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;color:${statusColors[r.status]};background:${statusBg[r.status]};">${esc(statusLabels[r.status])}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;">${r.score} из ${r.maxScore}</td>
      </tr>
    `).join('')

    const questionsHtml = QUESTIONS.map((q, idx) => {
      const a = answers[q.id] || []
      return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#94a3b8;font-size:13px;vertical-align:top;width:30px;">${idx + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#334155;font-size:13px;vertical-align:top;">${esc(q.title)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#1e3a5f;font-size:13px;font-weight:500;">${a.map(esc).join(', ') || '&#8212;'}</td>
      </tr>`
    }).join('')

    const tipsHtml = results.filter(r => r.status !== 'green').map(r => `
      <div style="margin-bottom:12px;">
        <div style="font-weight:600;color:${statusColors[r.status]};font-size:13px;margin-bottom:4px;">${esc(r.title)}</div>
        ${r.tips.map(t => `<div style="color:#64748b;font-size:12px;padding-left:12px;">&#8226; ${esc(t)}</div>`).join('')}
      </div>
    `).join('')

    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:24px;background:#f8fafc;}</style></head><body>
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);overflow:hidden;">
  <div style="background:linear-gradient(135deg,#1e3a5f,#2a5080);padding:24px;color:#fff;">
    <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Теллур-Интех</div>
    <div style="font-size:20px;font-weight:700;margin-bottom:4px;">Результат диагностики маркировки</div>
    <div style="font-size:13px;opacity:0.8;">${esc(dateStr)} в ${esc(timeStr)}</div>
  </div>
  ${kktLabel ? `<div style="padding:12px 24px;background:#f0f9ff;border-bottom:1px solid #bae6fd;"><span style="font-size:12px;color:#0369a1;font-weight:600;">Касса клиента: </span><span style="font-size:12px;color:#0c4a6e;">${esc(kktLabel)}</span></div>` : ''}
  <div style="padding:20px 24px;">
    <div style="font-size:14px;font-weight:700;color:#1e3a5f;margin-bottom:12px;">Сводка по слоям</div>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="background:#f8fafc;">
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e2e8f0;color:#64748b;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Слой</th>
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e2e8f0;color:#64748b;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Статус</th>
        <th style="padding:8px 12px;text-align:left;border-bottom:2px solid #e2e8f0;color:#64748b;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Баллы</th>
      </tr></thead>
      <tbody>${layersHtml}</tbody>
    </table>
  </div>
  ${results.some(r => r.status !== 'green') ? `
  <div style="padding:0 24px 20px;">
    <div style="font-size:14px;font-weight:700;color:#1e3a5f;margin-bottom:10px;">Рекомендации</div>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;">${tipsHtml}</div>
  </div>` : ''}
  <div style="padding:0 24px 20px;">
    <div style="font-size:14px;font-weight:700;color:#1e3a5f;margin-bottom:10px;">Ответы клиента</div>
    <table style="width:100%;border-collapse:collapse;">
      <tbody>${questionsHtml}</tbody>
    </table>
  </div>
  <div style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center;">
    ООО &quot;Теллур-Интех&quot; | +7 (812) 465-94-57 | push@tellur.spb.ru | kassa-cto.ru
  </div>
</div></body></html>`
  }

  // ---- формирование текстового отчёта для Telegram ----
  const buildTelegramReport = (): string => {
    const statusEmoji = { green: '✅', yellow: '⚠️', red: '❌' }
    const statusLabels = { green: 'В порядке', yellow: 'Нужно проверить', red: 'Есть проблемы' }
    const kktMfr = KKT_CATALOG.find(m => m.id === selectedManufacturer)
    const kktStr = kktMfr ? (selectedModel ? `Касса: ${kktMfr.name} ${selectedModel}` : `Касса: ${kktMfr.name}`) : (selectedManufacturer === '_none' ? 'Касса: нет' : '')
    const lines = [`📊 ДИАГНОСТИКА МАРКИРОВКИ`, `👤 ${clientName.trim()}`, `📞 ${clientPhone.trim()}`, ``]
    if (kktStr) lines.push(`🖥️ ${kktStr}`, '')
    results.forEach(r => {
      lines.push(`${statusEmoji[r.status]} ${r.title}: ${statusLabels[r.status]} (${r.score}/${r.maxScore})`)
    })
    lines.push('')
    lines.push('— ОТВЕТЫ —')
    QUESTIONS.forEach((q, idx) => {
      const a = answers[q.id] || []
      lines.push(`${idx + 1}. ${q.title}: ${a.join(', ') || '—'}`)
    })
    return lines.join('\n')
  }

  // ---- отправка заявки ----
  const handleSubmit = async () => {
    setSending(true)
    setSendError('')
    try {
      const reportHtml = buildReportHtml()
      const telegramReport = buildTelegramReport()
      const orderNum = `ДИАГ-${Date.now().toString().slice(-6)}`

      const kktMfr = KKT_CATALOG.find(m => m.id === selectedManufacturer)
      const kkmDisplay = kktMfr ? (selectedModel ? `${kktMfr.name} ${selectedModel}` : kktMfr.name) : (selectedManufacturer === '_none' ? 'Нет кассы' : '')

      // Сводка по статусам для комментария
      const summary = results.map(r => {
        const label = r.status === 'green' ? '✅' : r.status === 'yellow' ? '⚠️' : '❌'
        return `${label} ${r.title}`
      }).join(' | ')

      await fetch('/api/log-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNum,
          clientName: clientName.trim(),
          phone: clientPhone.trim(),
          kkmType: kkmDisplay || '',
          kkmCondition: '',
          services: ['Диагностика маркировки'],
          total: 0,
          comment: `Результат: ${summary}${kkmDisplay ? ` | Касса: ${kkmDisplay}` : ''}`,
          orderHtml: reportHtml,
        }),
      })

      // Отправляем в Telegram
      await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `🔍 Диагностика: ${clientName.trim()} | ${clientPhone.trim()}`,
          html: telegramReport,
        }),
      })

      setStep(10)
    } catch {
      setSendError('Произошла ошибка. Попробуйте ещё раз.')
    } finally {
      setSending(false)
    }
  }

  const currentQuestion = step >= 1 && step <= 8 ? QUESTIONS[step - 1] : null
  const progress = step >= 1 && step <= 8 ? (step / 8) * 100 : step >= 9 ? 100 : 0
  const questionAreaRef = useRef<HTMLDivElement>(null)

  // Автоскролл к верху при смене шага
  useEffect(() => {
    if (step >= 1 && step <= 9 && questionAreaRef.current) {
      questionAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [step])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(232, 168, 23, 0.4); } 50% { box-shadow: 0 0 0 8px rgba(232, 168, 23, 0); } }
        .anim-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .anim-slide-in { animation: slideIn 0.3s ease-out forwards; }
        .anim-scale-in { animation: scaleIn 0.3s ease-out forwards; }
        .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
      `}</style>

      {/* ================================================================ */}
      {/* INTRO */}
      {/* ================================================================ */}
      {step === 0 && (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8">
          <div className="max-w-lg w-full text-center anim-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2a5080] flex items-center justify-center shadow-lg shadow-[#1e3a5f]/20">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight mb-3">
              Проверьте настройку маркировки
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
              Ответьте на 8 простых вопросов — и мы покажем, где в вашей цепочке маркировки могут быть проблемы. Без терминов, на понятном языке. Займёт 2–3 минуты.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
              {[
                { icon: <Clock className="w-5 h-5 text-[#e8a817]" />, text: '8 вопросов, 3 минуты' },
                { icon: <HelpCircle className="w-5 h-5 text-[#e8a817]" />, text: 'Без сложных терминов' },
                { icon: <FileText className="w-5 h-5 text-[#e8a817]" />, text: 'Конкретные рекомендации' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                  {item.icon}
                  <span className="text-xs sm:text-sm text-slate-600 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="pulse-glow inline-flex items-center gap-2.5 px-8 py-4 bg-[#e8a817] hover:bg-[#d49a12] text-white text-lg font-bold rounded-xl transition-all shadow-lg shadow-[#e8a817]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Начать проверку
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* QUESTIONS */}
      {/* ================================================================ */}
      {currentQuestion && (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-6 sm:py-8">
          <div ref={questionAreaRef} className="max-w-xl mx-auto w-full">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-[#1e3a5f]">Вопрос {step} из 8</span>
                <span className="text-xs text-slate-400">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1e3a5f] to-[#e8a817] rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="anim-slide-in">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-7 mb-5">
                <div className="mb-5">
                  <h2 className="text-base sm:text-lg font-bold text-[#1e3a5f] leading-snug">{currentQuestion.title}</h2>
                  {currentQuestion.subtitle && <p className="mt-1 text-xs text-slate-400">{currentQuestion.subtitle}</p>}
                </div>
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleAnswer(currentQuestion.id, opt.label)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        isSelected(currentQuestion.id, opt.label)
                          ? 'border-[#1e3a5f] bg-[#1e3a5f]/5 text-[#1e3a5f] font-semibold'
                          : 'border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected(currentQuestion.id, opt.label) ? 'border-[#1e3a5f]' : 'border-slate-200'
                        }`}>
                          {isSelected(currentQuestion.id, opt.label) && <div className="w-2.5 h-2.5 rounded-full bg-[#1e3a5f] anim-scale-in" />}
                        </div>
                        <span className="text-sm sm:text-[15px] leading-snug">{opt.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Навигация — под карточкой вопроса */}
            <div className="flex items-center justify-between gap-3 mt-5 mb-2">
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-medium text-slate-500 hover:text-[#1e3a5f] rounded-xl hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Назад
              </button>
              {step < 8 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  disabled={!isAnswered(currentQuestion)}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold rounded-xl transition-all ${
                    isAnswered(currentQuestion) ? 'bg-[#1e3a5f] hover:bg-[#2a5080] text-white shadow-lg shadow-[#1e3a5f]/20' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Далее <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep(9)}
                  disabled={!isAnswered(currentQuestion)}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold rounded-xl transition-all ${
                    isAnswered(currentQuestion) ? 'bg-[#e8a817] hover:bg-[#d49a12] text-white shadow-lg shadow-[#e8a817]/25' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Показать результат <ShieldCheck className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* КОНТАКТНАЯ ФОРМА (шаг 9) */}
      {/* ================================================================ */}
      {step === 9 && (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-6 sm:py-8">
        <div ref={questionAreaRef} className="max-w-xl mx-auto w-full">
            {/* Прогресс — заполнен */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-emerald-600">Все 8 вопросов отвечены</span>
                <span className="text-xs text-slate-400">100%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="anim-fade-in">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-7 mb-5">
                <div className="mb-6">
                  <h2 className="text-base sm:text-lg font-bold text-[#1e3a5f] leading-snug">
                    Как к вам обращаться?
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Чтобы мы могли связаться с вами и уточнить детали
                  </p>
                </div>

                {/* Форма */}
                <div className="space-y-4">
                  {/* Имя */}
                  <div>
                    <label htmlFor="diag-name" className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">
                      Ваше имя
                    </label>
                    <input
                      id="diag-name"
                      type="text"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="Иван Иванов"
                      autoComplete="name"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all"
                    />
                  </div>

                  {/* Телефон */}
                  <div>
                    <label htmlFor="diag-phone" className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">
                      Телефон
                    </label>
                    <input
                      id="diag-phone"
                      type="tel"
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      placeholder="+7 (999) 123-45-67"
                      autoComplete="tel"
                      inputMode="tel"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all"
                    />
                  </div>

                  {/* Выбор кассы */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">
                      Ваша касса <span className="text-slate-400 font-normal">(необязательно)</span>
                    </label>
                    <select
                      value={selectedManufacturer}
                      onChange={e => { setSelectedManufacturer(e.target.value); setSelectedModel('') }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all"
                    >
                      <option value="">— Выберите производителя —</option>
                      <option value="_none">У меня нет кассы</option>
                      {KKT_CATALOG.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  {filteredModels.length > 0 && (
                    <div className="anim-fade-in">
                      <label className="block text-sm font-semibold text-[#1e3a5f] mb-1.5">
                        Модель кассы
                      </label>
                      <select
                        value={selectedModel}
                        onChange={e => setSelectedModel(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all"
                      >
                        <option value="">— Выберите модель —</option>
                        {filteredModels.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Ошибка */}
                {sendError && (
                  <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                    {sendError}
                  </div>
                )}
              </div>
            </div>

            {/* Навигация — сразу под карточкой */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(8)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-[#1e3a5f] rounded-xl hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Назад
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!clientName.trim() || !clientPhone.trim() || sending}
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${
                  clientName.trim() && clientPhone.trim() && !sending
                    ? 'bg-[#e8a817] hover:bg-[#d49a12] text-white shadow-lg shadow-[#e8a817]/25'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Получить результат
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* ПОДТВЕРЖДЕНИЕ / РЕЗУЛЬТАТЫ (шаг 10) */}
      {/* ================================================================ */}
      {step === 10 && (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8">
          <div className="max-w-xl mx-auto w-full">

            {/* Успешная отправка */}
            <div className="text-center anim-fade-in mb-8">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight mb-2">
                Спасибо! Ваша заявка отправлена
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
                Наш специалист свяжется с вами в течение 15 минут
              </p>
            </div>

            {/* Сводка по слоям */}
            <div className="anim-fade-in bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 mb-6" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-sm sm:text-base font-bold text-[#1e3a5f] mb-4">Результаты диагностики</h2>
              <div className="space-y-3">
                {results.map((layer) => {
                  const statusConfig = {
                    green: { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'В порядке' },
                    yellow: { dot: 'bg-amber-500', text: 'text-amber-700', label: 'Нужно проверить' },
                    red: { dot: 'bg-red-500', text: 'text-red-700', label: 'Есть проблемы' },
                  }
                  const cfg = statusConfig[layer.status]
                  return (
                    <div key={layer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                        <span className="text-sm text-slate-700 font-medium truncate">{layer.title}</span>
                      </div>
                      <span className={`text-xs font-semibold shrink-0 ml-3 ${cfg.text}`}>{cfg.label}</span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400">Баллы: {results.reduce((s, r) => s + r.score, 0)} из {results.reduce((s, r) => s + r.maxScore, 0)}</span>
                <span className="text-xs text-slate-400">5 слоёв проверено</span>
              </div>
            </div>

            {/* Лид-генерация — тёмная карточка */}
            <div className="anim-fade-in rounded-2xl p-5 sm:p-6 mb-6" style={{ animationDelay: '0.2s', background: '#1e3a5f' }}>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug mb-2">
                Обнаружены проблемы?
              </h2>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-5">
                Наши специалисты исправят ошибки маркировки за 1 рабочий день. Без остановки вашей работы.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('open-chat'))}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: '#e8a817', color: '#fff' }}
              >
                <MessageCircle className="w-5 h-5" />
                Получить настройку под ключ
              </button>
              <div className="mt-3 text-center">
                <Link
                  href="/kalkulyatory/markirovka"
                  className="text-xs sm:text-sm font-medium transition-colors hover:underline"
                  style={{ color: '#e8a817' }}
                >
                  Рассчитать стоимость
                </Link>
              </div>
            </div>

            {/* Пройти ещё раз */}
            <div className="anim-fade-in text-center" style={{ animationDelay: '0.3s' }}>
              <button
                type="button"
                onClick={() => { setStep(0); setAnswers({}); setClientName(''); setClientPhone(''); setSelectedManufacturer(''); setSelectedModel('') }}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-[#1e3a5f] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Пройти диагностику ещё раз
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
