'use client'

import Link from 'next/link'
import { Calculator, ArrowRight, CheckCircle } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'

const CALCULATORS = [
  {
    title: 'Калькулятор маркировки товаров',
    desc: 'Расчёт стоимости подключения маркировки: Честный ЗНАК, ТС ПИоТ, ЭДО, ОФД, регистрация ККТ. Работает для всех основных брендов касс.',
    price: 'от 5 300 ₽',
    href: '/kalkulyatory/markirovka',
    active: true,
    icon: <Calculator className="w-7 h-7" />,
  },
  {
    title: 'Калькулятор интеграции 1С',
    desc: 'Расчёт стоимости интеграции кассового оборудования с программами 1С: Предприятие. Обмен данными, настройка подключений.',
    price: '',
    href: '/kalkulyatory/1c',
    active: false,
    icon: <Calculator className="w-7 h-7" />,
  },
  {
    title: 'Расчёт стоимости ОФД',
    desc: 'Сравнение тарифов операторов фискальных данных: ТАКСКОМ, Контур, СБИС, Эвотор. Подбор оптимального тарифа.',
    price: '',
    href: '/kalkulyatory/ofd',
    active: false,
    icon: <Calculator className="w-7 h-7" />,
  },
]

export default function KalkulyatoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <Breadcrumbs items={[{ label: 'Калькуляторы' }]} />

      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight">
          Калькуляторы стоимости
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
          Бесплатные онлайн-калькуляторы для точного расчёта стоимости услуг по обслуживанию кассового оборудования
        </p>
      </div>

      {/* Calculator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {CALCULATORS.map((calc, idx) => (
          <Link
            key={idx}
            href={calc.active ? calc.href : '#'}
            className={`group relative bg-white rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
              calc.active
                ? 'border-[#e8a817]/40 hover:border-[#e8a817] shadow-md'
                : 'border-slate-100 hover:border-slate-200'
            } ${!calc.active ? 'pointer-events-none opacity-80' : ''}`}
          >
            {/* Active badge */}
            {calc.active && (
              <div className="absolute -top-3 left-5">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e8a817] text-white text-xs font-bold shadow-md shadow-[#e8a817]/30">
                  <CheckCircle className="w-3 h-3" />
                  Работает
                </span>
              </div>
            )}

            {/* Coming soon badge */}
            {!calc.active && (
              <div className="absolute -top-3 left-5">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-200 text-slate-500 text-xs font-bold">
                  Скоро
                </span>
              </div>
            )}

            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
              calc.active
                ? 'bg-[#e8a817]/10 text-[#e8a817]'
                : 'bg-slate-100 text-slate-400'
            }`}>
              {calc.icon}
            </div>

            <h2 className={`text-lg font-bold mb-2 ${
              calc.active ? 'text-[#1e3a5f]' : 'text-slate-500'
            }`}>
              {calc.title}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              {calc.desc}
            </p>

            {calc.active ? (
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#e8a817]">{calc.price}</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e3a5f] group-hover:gap-2.5 transition-all">
                  Открыть <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Калькулятор в разработке</p>
            )}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 bg-gradient-to-r from-[#1e3a5f] to-[#2a5080] rounded-2xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Нужна помощь с расчётом?
        </h2>
        <p className="text-white/70 text-sm sm:text-base mb-4 max-w-lg mx-auto">
          Менеджер перезвонит за 15 минут и поможет рассчитать точную стоимость
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="tel:+78124659457"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8a817] hover:bg-[#d49a12] text-white font-bold rounded-xl transition-colors shadow-md"
          >
            +7 (812) 465-94-57
          </a>
          <button
            type="button"
            onClick={() => window.open('https://t.me/spbmarkirovka_bot', '_blank')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl transition-colors"
          >
            Открыть чат
          </button>
        </div>
      </div>
    </div>
  )
}
