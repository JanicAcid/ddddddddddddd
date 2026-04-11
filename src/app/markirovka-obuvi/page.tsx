// ============================================================================
// Маркировка обуви 2025 — SEO Landing Page
// ============================================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Phone,
  Calculator,
  MessageCircle,
  UserPlus,
  Settings,
  Wifi,
  GraduationCap,
} from 'lucide-react'
import { OpenChatButton } from '@/components/OpenChatButton'

const SITE_URL = 'https://tellurmarkirovka.vercel.app'
const PAGE_URL = `${SITE_URL}/markirovka-obuvi`

export const metadata: Metadata = {
  title: 'Маркировка обуви 2025 — настройка кассы, подключение к Честный ЗНАК | Теллур-Интех',
  description:
    'Маркировка обуви по Data Matrix: настройка кассы, регистрация в Честном ЗНАКе, ЭДО и ОФД. Цена от 5 000 ₽, срок от 1 дня. Санкт-Петербург и Ленинградская область.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Маркировка обуви 2025 — настройка кассы, подключение к Честный ЗНАК',
    description:
      'Полная настройка маркировки обуви под ключ: касса, Честный ЗНАК, ЭДО, ТС ПИоТ, ОФД. От 5 000 ₽, от 1 дня.',
    url: PAGE_URL,
    siteName: 'Теллур-Интех',
    locale: 'ru_RU',
    type: 'article',
  },
}

const REQUIREMENTS = [
  {
    icon: <UserPlus className="w-6 h-6" />,
    title: 'Регистрация в Честный ЗНАК',
    desc: 'Оформление учётной записи на честныйзнак.рф, подписание электронного соглашения с ЦРПТ, настройка товарной группы «Обувь» и привязка рабочего места кассира к системе маркировки.',
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: 'Настройка ККТ для маркировки',
    desc: 'Регистрация или перерегистрация кассы в ФНС с признаками маркировки, переход на ФФД 1.2, установка ТС ПИоТ — модуля, обеспечивающего обмен данными между кассой и Честным ЗНАКом.',
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    title: 'Подключение к ОФД',
    desc: 'Подключение к оператору фискальных данных (ОФД) по партнёрской тарификации. Без ОФД касса не может передавать чеки в ФНС — это обязательное требование по закону 54-ФЗ для всех касс.',
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: 'Обучение персонала',
    desc: 'Практическое обучение кассиров сканированию кодов Data Matrix с коробок и бирок обуви, порядку пробития чека с признаками маркировки и действиям при нечитаемых кодах.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Диагностика кассы',
    desc: 'Проверяем модель кассы, версию прошивки, поддержку ФФД 1.2 и совместимость 2D-сканера. Определяем объём необходимых работ.',
  },
  {
    num: '02',
    title: 'Подключение всех систем',
    desc: 'Регистрируем кассу в ФНС, подключаем ОФД, Честный ЗНАК, ЭДО и ТС ПИоТ — связываем все компоненты в единую цепочку маркировки.',
  },
  {
    num: '03',
    title: 'Тестирование',
    desc: 'Пробиваем тестовый чек по маркированной паре обуви, проверяем корректность передачи данных в Честный ЗНАК, ОФД и ФНС.',
  },
  {
    num: '04',
    title: 'Обучение и передача',
    desc: 'Обучаем сотрудников работе с маркированной обувью. Выдаём памятку с пошаговой инструкцией. Гарантийная поддержка 30 дней.',
  },
]

const FAQS = [
  {
    q: 'С какого момента обязательна маркировка обуви?',
    a: 'Маркировка обуви стала обязательной с 1 июля 2020 года — обувь стала одной из первых товарных групп, перешедших на обязательную маркировку. С этого момента каждая пара обуви, произведённая или импортированная в Россию, должна иметь код Data Matrix на упаковке или бирке. С 1 марта 2021 года маркировка стала обязательна и для розничных продавцов.',
  },
  {
    q: 'Какие штрафы за продажу обуви без маркировки?',
    a: 'Штрафы за оборот немаркированной обуви предусмотрены ст. 15.12 КоАП РФ: для граждан — от 2 000 до 4 000 ₽, для должностных лиц — от 5 000 до 10 000 ₽, для юридических лиц — от 50 000 до 300 000 ₽. С товарных групп, подлежащих маркировке, дополнительно применяется ст. 15.12.1 КоАП РФ с конфискацией товара. При обороте свыше 1,5 млн ₽ возможна уголовная ответственность по ст. 171.1 УК РФ.',
  },
  {
    q: 'Нужен ли специальный сканер для маркировки обуви?',
    a: 'Да, для считывания кодов Data Matrix с обуви потребуется 2D-имиджевый сканер. Код маркировки представляет собой двухмерную матрицу, которую обычный 1D-сканер штрихкодов не прочитает. Если вы используете смарт-терминал (Эвотор, Меркурий), он, как правило, уже оснащён встроенным 2D-сканером. Для фискальных регистраторов сканер приобретается отдельно — подберём совместимую модель.',
  },
  {
    q: 'Как маркировка обуви влияет на возврат товара?',
    a: 'При возврате маркированной обуви покупателю необходимо пробить чек возврата с тем же кодом Data Matrix, по которому товар был продан. Касса отправляет в Честный ЗНАК сигнал о выбытии товара, и код снова становится доступен для оборота. Если код не считался или был повреждён, возврат проводится через официальное обращение в Честный ЗНАК. Мы обучим сотрудников правильному порядку оформления возвратов.',
  },
]

export default function MarkirovkaObuviPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* ── Breadcrumbs ──────────────────────────────────────────────── */}
        <nav className="mb-4 text-xs text-slate-400" aria-label="Хлебные крошки">
          <Link href="/" className="hover:text-[#1e3a5f] transition-colors">Главная</Link>
          <ChevronRight className="inline w-3 h-3 mx-1 text-slate-300" />
          <span className="text-slate-600">Маркировка обуви</span>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 sm:p-8 mb-8 sm:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight">
            Маркировка обуви 2025
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Маркировка обуви обязательна с июля 2020 года. Каждая пара обуви должна иметь код Data Matrix
            на упаковке. Мы настроим кассу, подключим Честный ЗНАК, ЭДО и ОФД — полный цикл за 1 день
            без остановки работы вашего магазина.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link
              href="/kalkulyatory/markirovka"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] hover:bg-[#2a5080] text-white font-bold rounded-xl transition-colors shadow-md"
            >
              <Calculator className="w-5 h-5" />
              Рассчитать стоимость
            </Link>
            <OpenChatButton
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#1e3a5f]/20 hover:border-[#1e3a5f]/40 text-[#1e3a5f] font-bold rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Получить консультацию
            </OpenChatButton>
          </div>
        </section>

        {/* ── Что необходимо для маркировки обуви ─────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-2">
            Что необходимо для маркировки обуви
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Для легальной продажи маркированной обуви необходимо связать несколько систем.
            Каждая из них обязательна — без хотя бы одной касса не сможет пробивать чеки
            с кодами Data Matrix и передавать данные в Честный ЗНАК.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {REQUIREMENTS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-[#1e3a5f]/20 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center text-[#1e3a5f] shrink-0">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#1e3a5f] leading-snug">{item.title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Как проходит настройка ───────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Как проходит настройка маркировки обуви
          </h2>
          <div className="space-y-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5 flex items-start gap-4"
              >
                <span className="text-2xl font-extrabold text-[#e8a817] shrink-0 leading-none mt-0.5">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#1e3a5f] mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Стоимость ────────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <div className="bg-white rounded-2xl border-2 border-[#e8a817]/30 shadow-sm p-6 sm:p-8 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Стоимость настройки маркировки обуви</p>
            <p className="text-3xl font-extrabold text-[#1e3a5f] mb-1">от 5 000 ₽</p>
            <p className="text-sm text-slate-500 mb-4">от 1 рабочего дня · без остановки работы магазина</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#e8a817] shrink-0" />
                <span className="text-slate-600 text-sm font-medium">Подключим к Честный ЗНАК</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#e8a817] shrink-0" />
                <span className="text-slate-600 text-sm font-medium">Настроим кассу и 1С</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#e8a817] shrink-0" />
                <span className="text-slate-600 text-sm font-medium">Обучим персонал</span>
              </div>
            </div>
            <Link
              href="/kalkulyatory/markirovka"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8a817] hover:bg-[#d49a12] text-white font-bold rounded-xl transition-colors shadow-md"
            >
              <Calculator className="w-5 h-5" />
              Рассчитать точную стоимость
            </Link>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Часто задаваемые вопросы о маркировке обуви
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <summary className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 cursor-pointer hover:bg-slate-50/50 transition-colors list-none">
                  <h3 className="text-sm sm:text-[15px] font-semibold text-[#1e3a5f] pr-4">{faq.q}</h3>
                  <ChevronDown className="w-5 h-5 text-slate-300 shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                  <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA Bottom ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5080] rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Настроим маркировку обуви под ключ
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-4 max-w-xl mx-auto">
            Бесплатная консультация — перезвоним за 15 минут. Рассчитаем точную стоимость и подберём
            оптимальное решение под ваш бюджет.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <OpenChatButton
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-colors shadow-md"
              style={{ backgroundColor: '#e8a817' }}
            >
              Оставить заявку
            </OpenChatButton>
            <a
              href="tel:+78124659457"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5" />
              +7 (812) 465-94-57
            </a>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/50">
            <Link href="/services" className="underline underline-offset-2 hover:text-white/80 transition-colors">
              Все услуги
            </Link>
            <span>|</span>
            <Link href="/nastroyka-kassy-markirovka" className="underline underline-offset-2 hover:text-white/80 transition-colors">
              Настройка кассы
            </Link>
            <span>|</span>
            <Link href="/faq" className="underline underline-offset-2 hover:text-white/80 transition-colors">
              Частые вопросы
            </Link>
            <span>|</span>
            <Link href="/contacts" className="underline underline-offset-2 hover:text-white/80 transition-colors">
              Контакты
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
