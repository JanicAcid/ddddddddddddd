'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Phone, ChevronRight, ChevronLeft, AlertTriangle,
  CheckCircle2, HelpCircle, ArrowRight, ShieldCheck,
  Monitor, Settings, FileText, Eye, CreditCard,
  Clock, MessageCircle, User, Loader2, Send
} from 'lucide-react'

// ============================================================================
// ТИПЫ
// ============================================================================

interface Question {
  id: string
  title: string
  subtitle?: string
  icon: React.ReactNode
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
  { id: 'online', title: 'Онлайн-сервисы', icon: <CreditCard className="w-5 h-5" /> },
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
    icon: <Clock className="w-6 h-6" />,
    options: [
      { label: 'Только планирую', scores: { knowledge: 0, hardware: 0, fiscal: 0, online: 0, docs: 0 } },
      { label: '2020–2021 (первые волны)', scores: { knowledge: 0, hardware: 0, fiscal: 0, online: 0, docs: 0 } },
      { label: '2022–2023', scores: { knowledge: 1, hardware: 1, fiscal: 1, online: 1, docs: 1 } },
      { label: '2024–2025', scores: { knowledge: 2, hardware: 2, fiscal: 2, online: 2, docs: 2 } },
    ],
  },
  {
    id: 'q2_categories',
    title: 'Какие товарные группы вы продаёте?',
    subtitle: 'Выберите всё, что относится к вам',
    icon: <ShieldCheck className="w-6 h-6" />,
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
    ],
  },
  {
    id: 'q3_has_marked',
    title: 'Есть ли у вас товар с квадратиками-кодами (маркировкой)?',
    icon: <HelpCircle className="w-6 h-6" />,
    options: [
      { label: 'Да, весь товар с кодами', scores: { hardware: 2, fiscal: 1, online: 1, docs: 1, knowledge: 2 } },
      { label: 'Часть с кодами, часть без', scores: { hardware: 1, fiscal: 0, online: 0, docs: 0, knowledge: 1 } },
      { label: 'Нет, весь товар без кодов', scores: { hardware: 0, fiscal: 0, online: 0, docs: 0, knowledge: 0 } },
      { label: 'Не знаю, что это за коды', scores: { knowledge: 0, hardware: 0, fiscal: 0, online: 0, docs: 0 } },
    ],
  },
  {
    id: 'q4_scanning',
    title: 'При продаже сканируете ли вы с товара код-квадратик?',
    icon: <Monitor className="w-6 h-6" />,
    options: [
      { label: 'Да, всегда сканером', scores: { hardware: 2, fiscal: 2, online: 1, docs: 0, knowledge: 2 } },
      { label: 'Вручную — ввожу код руками', scores: { hardware: 1, fiscal: 1, online: 0, docs: 0, knowledge: 1 } },
      { label: 'Не знаю, о каких квадратиках речь', scores: { hardware: 0, fiscal: 0, online: 0, docs: 0, knowledge: 0 } },
      { label: 'Не продаю маркированный товар', scores: { hardware: 0, fiscal: 0, online: 0, docs: 0, knowledge: 0 } },
    ],
  },
  {
    id: 'q5_cz_visited',
    title: 'Заходили ли вы на честныйзнак.рф за последний месяц?',
    icon: <CreditCard className="w-6 h-6" />,
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
    icon: <Eye className="w-6 h-6" />,
    options: [
      { label: 'Да, видел', scores: { online: 2, fiscal: 2, knowledge: 2, hardware: 1, docs: 1 } },
      { label: 'Не проверял', scores: { online: 0, knowledge: 0, fiscal: 0, hardware: 0, docs: 0 } },
      { label: 'Не знаю где смотреть', scores: { online: 0, knowledge: 0, fiscal: 0, hardware: 0, docs: 0 } },
    ],
  },
  {
    id: 'q7_auto_reception',
    title: 'Товар от поставщика сам появляется в вашей учётной программе (1С, МойСклад и т.д.)?',
    icon: <FileText className="w-6 h-6" />,
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
    icon: <CreditCard className="w-6 h-6" />,
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
// КОМПОНЕНТ
// 0 = intro, 1–8 = вопросы, 9 = форма контактов, 10 = результат
// ============================================================================

export default function DiagnostikaPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [noCallNeeded, setNoCallNeeded] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

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

  // ---- формирование текстового отчёта ----
  const buildReport = (): string => {
    const statusEmoji = { green: '🟢', yellow: '🟡', red: '🔴' }
    const lines = ['📊 РЕЗУЛЬТАТ ДИАГНОСТИКИ', '']
    results.forEach(r => {
      lines.push(`${statusEmoji[r.status]} ${r.title}: ${r.status === 'green' ? 'В порядке' : r.status === 'yellow' ? 'Нужно проверить' : 'Есть проблемы'}`)
    })
    lines.push('')
    // Ответы на вопросы
    lines.push('— ОТВЕТЫ КЛИЕНТА —')
    QUESTIONS.forEach(q => {
      const a = answers[q.id] || []
      lines.push(`${q.title}: ${a.join(', ') || '—'}`)
    })
    return lines.join('\n')
  }

  // ---- отправка заявки ----
  const handleSubmit = async () => {
    if (noCallNeeded) {
      setStep(10)
      return
    }
    setSending(true)
    setSendError('')
    try {
      const report = buildReport()
      const orderNum = `ДИАГ-${Date.now().toString().slice(-6)}`

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
          kkmType: '',
          kkmCondition: '',
          services: ['Диагностика (тест)'],
          total: 0,
          comment: `Результат: ${summary}`,
          orderHtml: report,
        }),
      })

      // Отправляем в Telegram
      await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `🔍 Диагностика: ${clientName.trim()} | ${clientPhone.trim()}`,
          html: report,
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
        <div className="min-h-[calc(100vh-56px)] flex flex-col px-4 py-6 sm:py-8">
          <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-[#1e3a5f]">Вопрос {step} из 8</span>
                <span className="text-xs text-slate-400">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1e3a5f] to-[#e8a817] rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="anim-slide-in flex-1">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-7 mb-4">
                <div className="flex items-start gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center text-[#1e3a5f] shrink-0">
                    {currentQuestion.icon}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#1e3a5f] leading-snug">{currentQuestion.title}</h2>
                    {currentQuestion.subtitle && <p className="mt-1 text-xs text-slate-400">{currentQuestion.subtitle}</p>}
                  </div>
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

            <div className="flex items-center justify-between gap-3 mt-auto pt-4">
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-[#1e3a5f] rounded-xl hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Назад
              </button>
              {step < 8 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  disabled={!isAnswered(currentQuestion)}
                  className={`inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                    isAnswered(currentQuestion) ? 'bg-[#1e3a5f] hover:bg-[#2a5080] text-white shadow-md' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Далее <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep(9)}
                  disabled={!isAnswered(currentQuestion)}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                    isAnswered(currentQuestion) ? 'bg-[#e8a817] hover:bg-[#d49a12] text-white shadow-lg shadow-[#e8a817]/25' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Показать результат <ShieldCheck className="w-4 h-4" />
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
        <div className="min-h-[calc(100vh-56px)] flex flex-col px-4 py-6 sm:py-8">
          <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
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

            <div className="anim-fade-in flex-1">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-7 mb-4">
                <div className="flex items-start gap-3.5 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-[#e8a817]/10 flex items-center justify-center text-[#e8a817] shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#1e3a5f] leading-snug">
                      Как к вам обращаться?
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">
                      Чтобы мы могли связаться с вами и уточнить детали
                    </p>
                  </div>
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
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all"
                    />
                  </div>

                  {/* Галочка — не нужен звонок */}
                  <label className="flex items-start gap-3 cursor-pointer group py-1">
                    <input
                      type="checkbox"
                      checked={noCallNeeded}
                      onChange={e => setNoCallNeeded(e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border-2 border-slate-200 text-[#1e3a5f] focus:ring-[#1e3a5f]/20 cursor-pointer accent-[#1e3a5f]"
                    />
                    <span className="text-xs sm:text-sm text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                      Звонок пока не нужен — хочу просто увидеть результат
                    </span>
                  </label>
                </div>

                {/* Ошибка */}
                {sendError && (
                  <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                    {sendError}
                  </div>
                )}
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex items-center justify-between gap-3 mt-auto pt-4">
              <button
                type="button"
                onClick={() => setStep(8)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-[#1e3a5f] rounded-xl hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Назад
              </button>

              {noCallNeeded ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] hover:bg-[#2a5080] text-white text-sm font-bold rounded-xl transition-all shadow-md"
                >
                  Показать результат
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* RESULTS (шаг 10) */}
      {/* ================================================================ */}
      {step === 10 && (
        <div className="px-4 py-6 sm:py-8 pb-16">
          <div className="max-w-2xl mx-auto">

            {/* Если оставил контакты — уведомление */}
            {!noCallNeeded && (
              <div className="anim-fade-in mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-emerald-800 mb-1">
                      Заявка отправлена
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
                      Спасибо, {clientName.trim()}! Ваш результат диагностики сохранён. Специалист свяжется с вами по номеру {clientPhone.trim()} для уточнения деталей и бесплатной консультации.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Если без звонка */}
            {noCallNeeded && (
              <div className="anim-fade-in mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-blue-800 mb-1">
                      Вот ваш результат
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                      Если появятся вопросы или понадобится помощь с настройкой — звоните или пишите нам. Мы всегда на связи.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Заголовок */}
            <div className="text-center mb-6 sm:mb-8 anim-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2a5080] flex items-center justify-center shadow-lg shadow-[#1e3a5f]/20">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight mb-2">
                Результат проверки
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
                Анализ по 5 ключевым направлениям вашей настройки маркировки
              </p>
            </div>

            {/* Карточки слоёв */}
            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
              {results.map((layer, idx) => {
                const statusConfig = {
                  green: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, label: 'В порядке' },
                  yellow: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, label: 'Нужно проверить' },
                  red: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: <AlertTriangle className="w-5 h-5 text-red-500" />, label: 'Есть проблемы' },
                }
                const cfg = statusConfig[layer.status]
                return (
                  <div key={layer.id} className={`anim-fade-in ${cfg.bg} rounded-2xl border ${cfg.border} p-4 sm:p-5`} style={{ animationDelay: `${(idx + 2) * 0.08}s` }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="text-[#1e3a5f]">{layer.icon}</div>
                        <h3 className="text-sm sm:text-base font-bold text-[#1e3a5f]">{layer.title}</h3>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.badge}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {layer.tips.map((tip, tipIdx) => (
                        <li key={tipIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-30 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            {/* CTA */}
            <div className="anim-fade-in bg-gradient-to-br from-[#1e3a5f] to-[#2a5080] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#e8a817]/10 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
              <div className="relative">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-3">Нужна помощь с настройкой?</h2>
                <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed">
                  Бесплатная проверка настройки по телефону — за 15 минут. Или оставьте заявку, и мы перезвоним сами.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
                  <a href="tel:+78124659457" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#e8a817] hover:bg-[#d49a12] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#e8a817]/25">
                    <Phone className="w-5 h-5" /> +7 (812) 465-94-57
                  </a>
                  <a href="tel:+78123210606" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl transition-colors border border-white/15">
                    <Phone className="w-5 h-5" /> +7 (812) 321-06-06
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('open-chat'))}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-[#1e3a5f] font-bold rounded-xl transition-colors shadow-md"
                >
                  <MessageCircle className="w-5 h-5" /> Написать в чат
                </button>
              </div>
            </div>

            {/* Калькулятор */}
            <div className="mt-4 text-center">
              <Link href="/kalkulyatory/markirovka" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#1e3a5f]/20 text-[#1e3a5f] text-sm font-semibold rounded-xl hover:bg-[#1e3a5f] hover:text-white hover:border-[#1e3a5f] transition-all">
                Рассчитать стоимость маркировки <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Пройти заново */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => { setAnswers({}); setClientName(''); setClientPhone(''); setNoCallNeeded(false); setStep(0) }}
                className="text-sm text-slate-400 hover:text-[#1e3a5f] transition-colors underline underline-offset-2"
              >
                Пройти проверку заново
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
