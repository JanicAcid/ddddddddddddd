'use client'

import { useState } from 'react'
import {
  ChevronDown, ChevronLeft, ArrowRight,
  CheckCircle, Phone, Store, User, Send, Loader2, Save, CheckCircle2
} from 'lucide-react'
import {
  isCrmConfigured,
  createKassaConsultOrder,
  sendOrderToYandexTable,
} from '@/lib/yandex-tables-service'

// ═══════════════════════════════════════════════════════════════════════════
// Данные для подбора кассы
// ═══════════════════════════════════════════════════════════════════════════

const BIZ_TYPES = [
  { id: 'shop', label: 'Магазин (розница)', icon: '🏪' },
  { id: 'cafe', label: 'Кафе / ресторан / общепит', icon: '☕' },
  { id: 'pharma', label: 'Аптека', icon: '💊' },
  { id: 'courier', label: 'Курьер / доставка', icon: '🚗' },
  { id: 'market', label: 'Ярмарка / выездная торговля', icon: '🎪' },
  { id: 'beauty', label: 'Салон красоты / услуги', icon: '💇' },
  { id: 'other', label: 'Другое', icon: '📦' },
]

const FORMAT_OPTIONS = [
  { id: 'smart', label: 'Смарт-терминал (экран + сканер)', desc: 'Автономная касса — не нужен компьютер' },
  { id: 'fiscal', label: 'Фискальный регистратор + POS', desc: 'Подключается к компьютеру или кассовой системе' },
  { id: 'mobile', label: 'Мобильная касса', desc: 'С аккумулятором — для выездной работы' },
  { id: 'unsure', label: 'Не знаю — посоветуйте', desc: 'Подберём оптимальный вариант под ваши задачи' },
]

const BUDGET_OPTIONS = [
  { id: 'low', label: 'До 15 000 ₽', desc: 'Бюджетное решение' },
  { id: 'mid', label: '15 000 – 30 000 ₽', desc: 'Оптимальное соотношение цена/качество' },
  { id: 'high', label: '30 000 – 50 000 ₽', desc: 'Максимум возможностей' },
  { id: 'any', label: 'Не ограничен', desc: 'Подберём лучшую модель' },
]

const RECOMMENDATIONS: Record<string, { models: { name: string; price: string; vendor: string; best: string }[]; extra: string }> = {
  'shop_smart_low':    { models: [{ name: 'Эвотор 5 (СТ5Ф)', price: 'от 24 900 ₽', vendor: 'ЭВОТОР', best: 'Малый магазин, павильон' }, { name: 'Меркурий 115Ф', price: 'от 10 900 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Магазин с ограниченным бюджетом' }], extra: 'Для малого магазина рекомендуем смарт-терминал — автономный, со встроенным сканером. При ограниченном бюджете рассмотрим Меркурий 115Ф + внешний 2D-сканер.' },
  'shop_smart_mid':    { models: [{ name: 'Атол Sigma 7Ф', price: 'от 32 000 ₽', vendor: 'АТОЛ', best: 'Компактная, с хорошим экраном' }, { name: 'Меркурий 185Ф', price: 'от 35 900 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Встроенный сканер, Wi-Fi' }], extra: 'Обе модели имеют встроенный 2D-сканер и поддерживают ФФД 1.2. Отличный выбор для магазина с одним кассовым местом.' },
  'shop_smart_high':   { models: [{ name: 'Атол Sigma 8Ф', price: 'от 42 000 ₽', vendor: 'АТОЛ', best: 'Большой экран, экосистема АТОЛ' }, { name: 'Эвотор 7.3 (СТ3Ф)', price: 'от 42 900 ₽', vendor: 'ЭВОТОР', best: 'Флагман, 8-ядерный процессор' }], extra: 'Флагманские решения для магазина с большим ассортиментом. Мощный процессор, большой экран, все интерфейсы связи.' },
  'shop_smart_any':    { models: [{ name: 'Атол Sigma 8Ф', price: 'от 42 000 ₽', vendor: 'АТОЛ', best: 'Лучшая в классе' }, { name: 'Эвотор 7.3 (СТ3Ф)', price: 'от 42 900 ₽', vendor: 'ЭВОТОР', best: 'Максимальные возможности' }], extra: 'Рекомендуем лучшие модели в классе смарт-терминалов. Обе поддерживают все виды маркировки и имеют встроенный 2D-сканер.' },
  'shop_fiscal_low':   { models: [{ name: 'Элвес-ФР-Ф', price: 'от 12 900 ₽', vendor: 'НТЦ Измеритель', best: 'Компактный, Bluetooth' }, { name: 'Пионер-114Ф', price: 'от 12 500 ₽', vendor: 'Пионер Инжиниринг', best: 'Бюджетный вариант' }], extra: 'Фискальный регистратор + внешний 2D-сканер (от 3 000 ₽). Подключается к вашему компьютеру или POS-системе.' },
  'shop_fiscal_mid':   { models: [{ name: 'Атол 30Ф', price: 'от 18 900 ₽', vendor: 'АТОЛ', best: 'Автоотрезчик, Wi-Fi' }, { name: 'Штрих-М-01Ф', price: 'от 15 500 ₽', vendor: 'ШТРИХ-М', best: 'Надёжная конструкция' }], extra: 'Проверенные фискальные регистраторы для POS-системы. Не забудьте про внешний 2D-сканер для считывания кодов маркировки.' },
  'cafe_smart_mid':    { models: [{ name: 'Эвотор 5 (СТ5Ф)', price: 'от 24 900 ₽', vendor: 'ЭВОТОР', best: 'Кофейня, фастфуд' }, { name: 'Атол Sigma 7Ф', price: 'от 32 000 ₽', vendor: 'АТОЛ', best: 'Ресторан, кафе' }], extra: 'Для общепита рекомендуем смарт-терминал с Wi-Fi и встроенным сканером. Удобное управление меню и учёт ингредиентов через приложения.' },
  'cafe_smart_high':   { models: [{ name: 'Эвотор 7.3 (СТ3Ф)', price: 'от 42 900 ₽', vendor: 'ЭВОТОР', best: 'Ресторан с большим меню' }], extra: 'Большой экран удобен для работы с меню. Встроенный 2D-сканер для маркированной продукции (пиво, вода).' },
  'pharma_smart_mid':  { models: [{ name: 'Атол Sigma 7Ф', price: 'от 32 000 ₽', vendor: 'АТОЛ', best: 'Аптека' }, { name: 'Эвотор 7.3 (СТ3Ф)', price: 'от 42 900 ₽', vendor: 'ЭВОТОР', best: 'Аптека с широким ассортиментом' }], extra: 'Для аптеки нужен смарт-терминал с интеграцией в учётную систему (1С:Аптека, еФарма). Поддержка маркировки лекарств обязательна.' },
  'courier_mobile_low': { models: [{ name: 'Меркурий 115Ф', price: 'от 10 900 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Курьер, доставка' }, { name: 'Меркурий-119Ф', price: 'от 14 900 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Компактная мобильная ККТ' }], extra: 'Компактные мобильные кассы с аккумулятором. Bluetooth для связи со смартфоном или планшетом курьера.' },
  'courier_mobile_mid': { models: [{ name: 'Эвотор 5i (СТ51Ф)', price: 'от 29 900 ₽', vendor: 'ЭВОТОР', best: 'Доставка продуктов' }, { name: 'Меркурий-180Ф', price: 'от 22 900 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Мобильная касса с печатью' }], extra: 'Эвотор 5i — лучший выбор для курьера: Android, встроенный 2D-сканер, 4G, аккумулятор 4000 мАч. Меркурий-180Ф — полноценная мобильная ККТ с автоотрезчиком.' },
  'market_mobile_low': { models: [{ name: 'Меркурий 115Ф', price: 'от 10 900 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Ярмарка' }, { name: 'Меркурий-119Ф', price: 'от 14 900 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Выездная торговля' }], extra: 'Для ярмарок достаточно лёгкой мобильной кассы с аккумулятором. Работает автономно весь день.' },
  'beauty_smart_mid':  { models: [{ name: 'Эвотор 5 (СТ5Ф)', price: 'от 24 900 ₽', vendor: 'ЭВОТОР', best: 'Салон красоты' }], extra: 'Для салона красоты достаточно компактного смарт-терминала. Маркировка парфюмерии — обязательна с 2026 года.' },
}

function getRecommendations(biz: string, format: string, budget: string) {
  const key = `${biz}_${format}_${budget}`
  return RECOMMENDATIONS[key]
}

function getGenericRecommendations(format: string, budget: string) {
  const all = Object.entries(RECOMMENDATIONS).filter(([, v]) => v).map(([, v]) => v)
  if (format === 'unsure') {
    return {
      models: [
        { name: 'Эвотор 5 (СТ5Ф)', price: 'от 24 900 ₽', vendor: 'ЭВОТОР', best: 'Универсальный выбор' },
        { name: 'Атол Sigma 7Ф', price: 'от 32 000 ₽', vendor: 'АТОЛ', best: 'Компактный, для большинства задач' },
        { name: 'Меркурий 115Ф', price: 'от 10 900 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Мобильный, бюджетный' },
      ],
      extra: 'Ответьте на первые два вопроса для более точной рекомендации. А пока — три универсальные модели, которые подойдут для большинства задач маркировки.',
    }
  }
  if (budget === 'low') {
    return all.find(r => r.models.some(m => parseInt(m.price.replace(/[^0-9]/g, '')) < 20000)) || all[0]
  }
  return all[Math.floor(all.length / 2)] || all[0]
}

// ═══════════════════════════════════════════════════════════════════════════
// Компонент «Консультация по вашей кассе» — подбор кассы за 3 шага
// ═══════════════════════════════════════════════════════════════════════════

export default function KassaConsultWidget() {
  const [step, setStep] = useState(0) // 0=intro, 1=biz, 2=format, 3=budget, 4=results, 5=form
  const [bizType, setBizType] = useState('')
  const [kassaFormat, setKassaFormat] = useState('')
  const [budget, setBudget] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [sendOk, setSendOk] = useState(false)
  const [crmSending, setCrmSending] = useState(false)
  const [crmResult, setCrmResult] = useState<'idle' | 'success' | 'error'>('idle')
  const showCrmButton = isCrmConfigured()

  const rec = step >= 4 ? (getRecommendations(bizType, kassaFormat, budget) || getGenericRecommendations(kassaFormat, budget)) : null

  const handleSend = () => {
    const modelsStr = rec ? rec.models.map(m => `${m.name} (${m.price})`).join(', ') : 'Не определены'
    const text = [
      `ПОДБОР КАССЫ`,
      ``,
      `Имя: ${clientName.trim()}`,
      `Телефон: ${clientPhone.trim()}`,
      `Тип бизнеса: ${bizType}`,
      `Формат: ${kassaFormat}`,
      `Бюджет: ${budget}`,
      ``,
      `Рекомендации: ${modelsStr}`,
    ].join('\n')
    window.open(`https://t.me/+79219403870?text=${encodeURIComponent(text)}`, '_blank')

    // Отправляем в CRM (если настроено)
    if (showCrmButton) {
      setCrmSending(true)
      setCrmResult('idle')
      const order = createKassaConsultOrder({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        bizType,
        kassaFormat,
        budget,
        recommendations: modelsStr,
      })
      sendOrderToYandexTable(order).then(res => {
        setCrmResult(res.success ? 'success' : 'error')
        setCrmSending(false)
      }).catch(() => {
        setCrmResult('error')
        setCrmSending(false)
      })
    }

    setSendOk(true)
    setStep(5)
  }

  const reset = () => { setStep(0); setBizType(''); setKassaFormat(''); setBudget(''); setClientName(''); setClientPhone(''); setSendOk(false); setCrmResult('idle') }

  return (
    <section className="mb-10 sm:mb-12">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a5080] rounded-2xl p-5 sm:p-6 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#e8a817]/20 flex items-center justify-center">
            <Store className="w-5 h-5 text-[#e8a817]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Консультация по вашей кассе</h2>
            <p className="text-xs text-white/60">3 вопроса — подберём кассу под ваш бизнес</p>
          </div>
        </div>
      </div>

      {/* ── Step 0: Intro ──────────────────────────── */}
      {step === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 text-center">
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            Ответьте на 3 простых вопроса — и мы порекомендуем подходящую модель кассы для работы с маркировкой.
            Затем специалист свяжется с вами для бесплатной консультации.
          </p>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#e8a817] hover:bg-[#d49a12] text-white text-base font-bold rounded-xl transition-all shadow-lg shadow-[#e8a817]/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Подобрать кассу <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ── Step 1: Business type ───────────────────── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f] mb-1">Чем вы занимаетесь?</h3>
          <p className="text-xs text-slate-400 mb-4">Выберите наиболее подходящий вариант</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {BIZ_TYPES.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => { setBizType(b.id); setStep(2) }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-slate-100 hover:border-[#1e3a5f] hover:bg-[#1e3a5f]/5 text-slate-700 hover:text-[#1e3a5f] text-sm font-medium transition-all"
              >
                <span>{b.icon}</span> {b.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(0)} className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#1e3a5f] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Назад
          </button>
        </div>
      )}

      {/* ── Step 2: Format ─────────────────────────── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f] mb-1">Какой формат кассы предпочитаете?</h3>
          <p className="text-xs text-slate-400 mb-4">Не уверены — выберите последний вариант</p>
          <div className="space-y-2.5">
            {FORMAT_OPTIONS.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => { setKassaFormat(f.id); setStep(3) }}
                className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-slate-100 hover:border-[#1e3a5f] hover:bg-[#1e3a5f]/5 text-slate-700 transition-all"
              >
                <span className="text-sm font-semibold text-[#1e3a5f]">{f.label}</span>
                <span className="block text-xs text-slate-400 mt-0.5">{f.desc}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(1)} className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#1e3a5f] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Назад
          </button>
        </div>
      )}

      {/* ── Step 3: Budget ─────────────────────────── */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f] mb-1">Какой бюджет на кассу?</h3>
          <p className="text-xs text-slate-400 mb-4">Учитывается только стоимость кассы, без настройки и ФН</p>
          <div className="grid grid-cols-2 gap-2.5">
            {BUDGET_OPTIONS.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => { setBudget(b.id); setStep(4) }}
                className="text-center px-4 py-4 rounded-xl border-2 border-slate-100 hover:border-[#e8a817] hover:bg-[#e8a817]/5 text-slate-700 transition-all"
              >
                <span className="block text-sm font-bold text-[#1e3a5f]">{b.label}</span>
                <span className="block text-xs text-slate-400 mt-0.5">{b.desc}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStep(2)} className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#1e3a5f] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Назад
          </button>
        </div>
      )}

      {/* ── Step 4: Results + form ─────────────────── */}
      {step === 4 && rec && (
        <div className="space-y-4">
          {/* Рекомендации */}
          <div className="bg-white rounded-2xl border-2 border-[#e8a817]/30 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#e8a817]/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#e8a817]" />
              </div>
              <h3 className="text-base font-bold text-[#1e3a5f]">Рекомендуемые модели</h3>
            </div>
            <div className="space-y-3">
              {rec.models.map((m, i) => (
                <div key={i} className={`rounded-xl border p-4 ${i === 0 ? 'border-[#e8a817]/40 bg-[#e8a817]/5' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#1e3a5f]">{i === 0 && <span className="text-[#e8a817] mr-1">Лучший выбор</span>}{m.name}</h4>
                      <p className="text-xs text-slate-400">{m.vendor}</p>
                    </div>
                    <span className="text-base font-extrabold text-[#e8a817]">{m.price}</span>
                  </div>
                  <p className="text-xs text-slate-500">{m.best}</p>
                </div>
              ))}
            </div>
            {rec.extra && <p className="mt-3 text-xs text-slate-500 leading-relaxed">{rec.extra}</p>}
          </div>

          {/* Форма консультации */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#1e3a5f]/5 flex items-center justify-center">
                <User className="w-5 h-5 text-[#1e3a5f]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e3a5f]">Получить консультацию</h3>
                <p className="text-xs text-slate-400">Специалист перезвонит за 15 минут</p>
              </div>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ваше имя"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all"
              />
              <input
                type="tel"
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                autoComplete="tel"
                inputMode="tel"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 transition-all"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-medium text-slate-500 hover:text-[#1e3a5f] rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Назад
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!clientName.trim() || !clientPhone.trim()}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${
                    clientName.trim() && clientPhone.trim()
                      ? 'bg-[#0088cc] hover:bg-[#006daa] text-white shadow-lg shadow-[#0088cc]/25'
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" /> Отправить в Telegram
                </button>
              </div>
              <a href="tel:+79219403870" className="block text-center text-xs text-slate-400 hover:text-[#1e3a5f] transition-colors mt-1">
                Или позвоните: +7 (921) 940-38-70
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 5: Sent ────────────────────────────── */}
      {step === 5 && sendOk && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-emerald-800 mb-1">Заявка отправлена</h3>
          <p className="text-sm text-emerald-700 leading-relaxed mb-2">
            Спасибо, {clientName.trim()}! Специалист свяжется с вами по номеру {clientPhone.trim()} для бесплатной консультации по подбору кассы.
          </p>
          {crmResult === 'success' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 rounded-full mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">Заявка сохранена в CRM</span>
            </div>
          )}
          {crmResult === 'error' && (
            <p className="text-xs text-amber-600 mb-2">CRM недоступна, но заявка отправлена через Telegram.</p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+79219403870"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e8a817] hover:bg-[#d49a12] text-white text-sm font-bold rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" /> Позвонить сейчас
            </a>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors"
            >
              Пройти заново
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
