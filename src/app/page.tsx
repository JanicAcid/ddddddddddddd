'use client'

import Link from 'next/link'
import {
  Calculator, MessageCircle, Phone, ArrowRight, Clock, ShieldCheck,
  Monitor, CreditCard, Zap, ChevronRight, FileText, HelpCircle,
  CheckCircle, Star, Building2, Users, Wrench
} from 'lucide-react'

// ============================================================================
// ГЛАВНАЯ — Центр поддержки пользователей ККТ
// Server Component (no 'use client')
// ============================================================================

const CALCULATORS = [
  {
    title: 'Калькулятор маркировки',
    desc: 'Расчёт стоимости подключения маркировки товаров: Честный ЗНАК, ТС ПИоТ, ЭДО, ОФД, регистрация ККТ.',
    href: '/kalkulyatory/markirovka',
    active: true,
    price: 'от 3 000 ₽',
  },
  {
    title: 'Калькулятор 1С',
    desc: 'Расчёт стоимости интеграции кассового оборудования с программами 1С: Предприятие.',
    href: '/kalkulyatory/1c',
    active: false,
    price: '',
  },
  {
    title: 'Расчёт ОФД',
    desc: 'Сравнение тарифов операторов фискальных данных: ТАКСКОМ, Контур, СБИС, Эвотор.',
    href: '/kalkulyatory/ofd',
    active: false,
    price: '',
  },
]

const STATS = [
  { value: 'С 1995 года', label: '30+ лет опыта' },
  { value: '5 000+', label: 'касс настроено' },
  { value: '300+', label: 'клиентов' },
  { value: '1–3 дня', label: 'срок подключения' },
]

const SERVICES = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Подключение маркировки',
    desc: 'Комплексная настройка: ЭДО, Честный ЗНАК, ТС ПИоТ, ККТ, ОФД — все 6 систем связаны.',
    href: '/services',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Регистрация ККТ в ФНС',
    desc: 'Подача заявления, настройка фискализации, подключение ОФД. Перерегистрация при необходимости.',
    href: '/services',
  },
  {
    icon: <Monitor className="w-6 h-6" />,
    title: 'Настройка ЭДО',
    desc: 'Подключение электронного документооборота: Контур.Диадок, СБИС, Такском.',
    href: '/services',
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: 'Замена фискального накопителя',
    desc: 'Замена ФН с перерегистрацией кассы в ФНС. 15 или 36 месяцев — подберём подходящий.',
    href: '/services',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Что такое маркировка товаров?',
    a: 'Система прослеживаемости, при которой каждая единица получает уникальный код Data Matrix. Код заносится в «Честный ЗНАК» и считывается кассой при продаже.',
  },
  {
    q: 'Сколько стоит подключение маркировки?',
    a: 'Базовая настройка — от 3 000 ₽. Точная стоимость зависит от типа кассы, набора услуг и состояния оборудования. Рассчитайте бесплатно в нашем калькуляторе.',
  },
  {
    q: 'Какие кассы подходят для маркировки?',
    a: 'Любая касса с поддержкой ФФД 1.2: Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI. Если касса старая — обновим прошивку.',
  },
]

const ARTICLES = [
  {
    title: 'Как подключить кабинет Честный ЗНАК',
    slug: 'kak-podklyuchit-kabinet-chestnyznak',
    category: 'Честный ЗНАК',
    readingTime: 12,
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* CSS-only fade-in-up animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .anim-delay-1 { animation-delay: 0.1s; }
        .anim-delay-2 { animation-delay: 0.2s; }
        .anim-delay-3 { animation-delay: 0.3s; }
        .anim-delay-4 { animation-delay: 0.4s; }
        .anim-delay-5 { animation-delay: 0.5s; }
        .anim-delay-6 { animation-delay: 0.6s; }
      `}</style>

      {/* ================================================================== */}
      {/* HERO SECTION */}
      {/* ================================================================== */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#2a5080] to-[#1e3a5f] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#e8a817]/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 text-center">
          <div className="anim-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs sm:text-sm font-medium mb-6">
              <Star className="w-3.5 h-3.5 text-[#e8a817]" />
              Центр технического обслуживания кассового оборудования
            </span>
          </div>

          <h1 className="anim-fade-in-up anim-delay-1 text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold text-white leading-tight mb-4 sm:mb-6">
            Поддержка пользователей ККТ
          </h1>

          <p className="anim-fade-in-up anim-delay-2 text-base sm:text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Центр технического обслуживания кассового оборудования&nbsp;— ООО&nbsp;«Теллур-Интех»
          </p>

          <div className="anim-fade-in-up anim-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/kalkulyatory/markirovka"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 bg-[#e8a817] hover:bg-[#d49a12] text-white text-base sm:text-lg font-bold rounded-xl transition-all shadow-lg shadow-[#e8a817]/25 hover:shadow-xl hover:shadow-[#e8a817]/35 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calculator className="w-5 h-5" />
              Рассчитать стоимость маркировки
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-chat'))}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 bg-white/15 hover:bg-white/25 text-white text-base sm:text-lg font-medium rounded-xl transition-all border border-white/20 hover:border-white/30"
            >
              <MessageCircle className="w-5 h-5" />
              Задать вопрос
            </button>
            <a
              href="tel:+78124659457"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white text-base sm:text-lg font-medium rounded-xl transition-all border border-white/15 hover:border-white/25"
            >
              <Phone className="w-5 h-5" />
              Позвонить
            </a>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ================================================================== */}
      {/* QUICK CALCULATOR CARDS */}
      {/* ================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="anim-fade-in-up anim-delay-2 text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f]">
            Калькуляторы стоимости
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Рассчитайте точную стоимость услуг за 2 минуты
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {CALCULATORS.map((calc, idx) => (
            <Link
              key={idx}
              href={calc.active ? calc.href : '#'}
              className={`anim-fade-in-up anim-delay-${idx + 3} group relative bg-white rounded-2xl border-2 p-5 sm:p-6 transition-all duration-300 hover:shadow-lg ${
                calc.active
                  ? 'border-[#e8a817]/40 hover:border-[#e8a817] shadow-md'
                  : 'border-slate-100 hover:border-slate-200'
              } ${!calc.active ? 'pointer-events-none' : ''}`}
            >
              {/* Gold badge for active */}
              {calc.active && (
                <div className="absolute -top-3 left-5">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e8a817] text-white text-[10px] sm:text-xs font-bold shadow-md shadow-[#e8a817]/30">
                    <CheckCircle className="w-3 h-3" />
                    Работает
                  </span>
                </div>
              )}

              {/* Coming soon badge */}
              {!calc.active && (
                <div className="absolute -top-3 left-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-200 text-slate-500 text-[10px] sm:text-xs font-bold">
                    Скоро
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                calc.active
                  ? 'bg-[#e8a817]/10 text-[#e8a817]'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                <Calculator className="w-6 h-6" />
              </div>

              <h3 className={`text-base sm:text-lg font-bold mb-2 ${
                calc.active ? 'text-[#1e3a5f]' : 'text-slate-500'
              }`}>
                {calc.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {calc.desc}
              </p>

              {calc.active && (
                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                  calc.active ? 'text-[#e8a817] group-hover:gap-2.5' : ''
                } transition-all`}>
                  {calc.price && <span>{calc.price}</span>}
                  Открыть <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* TRUST / STATS SECTION */}
      {/* ================================================================== */}
      <section className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5080]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                  {idx === 0 && <Clock className="w-6 h-6 text-[#e8a817]" />}
                  {idx === 1 && <Wrench className="w-6 h-6 text-[#e8a817]" />}
                  {idx === 2 && <Users className="w-6 h-6 text-[#e8a817]" />}
                  {idx === 3 && <ShieldCheck className="w-6 h-6 text-[#e8a817]" />}
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-white/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SERVICES PREVIEW */}
      {/* ================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f]">
            Наши услуги
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Полный спектр услуг по обслуживанию кассового оборудования
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {SERVICES.map((service, idx) => (
            <Link
              key={idx}
              href={service.href}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 hover:shadow-md hover:border-[#1e3a5f]/20 transition-all duration-300"
            >
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center text-[#1e3a5f] shrink-0 group-hover:bg-[#1e3a5f]/10 transition-colors">
                  {service.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#1e3a5f] leading-snug group-hover:text-[#e8a817] transition-colors">
                    {service.title}
                  </h3>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 shrink-0 group-hover:text-[#1e3a5f] group-hover:translate-x-1 transition-all ml-auto" />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {service.desc}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#1e3a5f]/20 text-[#1e3a5f] text-sm font-semibold rounded-xl hover:bg-[#1e3a5f] hover:text-white hover:border-[#1e3a5f] transition-all"
          >
            Все услуги
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ + USEFUL SECTION */}
      {/* ================================================================== */}
      <section className="bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            {/* FAQ */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <HelpCircle className="w-5 h-5 text-[#e8a817]" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1e3a5f]">
                  Частые вопросы
                </h2>
              </div>
              <div className="space-y-3">
                {FAQ_ITEMS.map((item, idx) => (
                  <details
                    key={idx}
                    className="group bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50/50 transition-colors list-none">
                      <h3 className="text-sm font-semibold text-[#1e3a5f] pr-4 leading-snug">{item.q}</h3>
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-4 pb-3.5">
                      <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
              <Link
                href="/faq"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#e8a817] hover:text-[#d49a12] transition-colors"
              >
                Все вопросы <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Useful */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-5 h-5 text-[#e8a817]" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1e3a5f]">
                  Полезное
                </h2>
              </div>
              {ARTICLES.length > 0 ? (
                <div className="space-y-3">
                  {ARTICLES.map((article, idx) => (
                    <Link
                      key={idx}
                      href={`/instructions/${article.slug}`}
                      className="group block bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:shadow-md hover:border-[#1e3a5f]/20 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#2a5080] flex items-center justify-center text-white shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[#1e3a5f] group-hover:text-[#e8a817] transition-colors leading-snug">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-slate-400">{article.category}</span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-400">{article.readingTime} мин чтения</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-100 p-6 text-center">
                  <p className="text-sm text-slate-400">Статьи скоро появятся</p>
                </div>
              )}
              <Link
                href="/instructions"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#e8a817] hover:text-[#d49a12] transition-colors"
              >
                База знаний <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA BOTTOM */}
      {/* ================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a5080] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#e8a817]/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

          <div className="relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3">
              Нужна помощь?
            </h2>
            <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed">
              Позвоните или напишите нам — подключим маркировку под ключ, ответим на вопросы, поможем с кассой
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
              <a
                href="tel:+78124659457"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#e8a817] hover:bg-[#d49a12] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#e8a817]/25"
              >
                <Phone className="w-5 h-5" />
                +7 (812) 465-94-57
              </a>
              <a
                href="tel:+78123210606"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl transition-colors border border-white/15"
              >
                <Phone className="w-5 h-5" />
                +7 (812) 321-06-06
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('open-chat'))}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-[#1e3a5f] font-bold rounded-xl transition-colors shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                Открыть чат
              </button>
              <a
                href="mailto:push@tellur.spb.ru"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                push@tellur.spb.ru
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
