// ============================================================================
// Подключение Честного ЗНАК — SEO Landing Page
// ============================================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ChevronDown,
  Phone,
  Calculator,
  CheckCircle,
  Key,
  UserPlus,
  Settings,
  Link2,
  GraduationCap,
  Clock,
  ShieldCheck,
  QrCode,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'

const SITE_URL = 'https://kassa-cto.ru'
const PAGE_URL = `${SITE_URL}/podklyuchenie-chestnyy-znak`

export const metadata: Metadata = {
  title: 'Подключение Честного ЗНАК в СПб | Регистрация, цена под ключ — Теллур-Интех',
  description:
    'Подключение Честный ЗНАК в Санкт-Петербурге. Регистрация для ИП и ООО, настройка рабочего места, привязка кассы. Цена от 1 500 ₽. За 1 день. Бесплатная консультация.',
  keywords: [
    'подключение честный знак',
    'регистрация честный знак',
    'честный знак спб',
    'подключение честный знак цена',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Подключение Честного ЗНАК в СПб — Теллур-Интех',
    description:
      'Регистрация и подключение Честного ЗНАК в Санкт-Петербурге для ИП и ООО. Цена от 1 500 ₽. Настройка под ключ за 1 день.',
    url: PAGE_URL,
    siteName: 'Теллур-Интех',
    locale: 'ru_RU',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// ─── JsonLd ───────────────────────────────────────────────────────────────────

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Подключение Честного ЗНАК', item: PAGE_URL },
  ],
}

const jsonLdService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Подключение Честного ЗНАК',
  description:
    'Регистрация и подключение к государственной системе маркировки Честный ЗНАК в Санкт-Петербурге для ИП и ООО. Оформление УКЭП, настройка личного кабинета, привязка кассы, обучение. Цена от 1 500 ₽. За 1 день.',
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Санкт-Петербург',
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Россия' },
  },
  serviceType: 'Регистрация и подключение Честного ЗНАК',
  category: 'Маркировка товаров',
  offers: {
    '@type': 'Offer',
    price: '1500',
    priceCurrency: 'RUB',
    description: 'Подключение Честного ЗНАК от 1 500 ₽, полная настройка под ключ от 5 300 ₽',
  },
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Сколько стоит подключение Честного ЗНАК?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Регистрация в Честном ЗНАКе бесплатная — это государственная система. Платная часть — настройка и подключение всех компонентов: УКЭП, настройка кабинета, привязка кассы, настройка ТС ПИоТ, обучение. Стоимость настройки от 1 500 ₽. Полная настройка под ключ — от 5 300 ₽.',
      },
    },
    {
      '@type': 'Question',
      name: 'Как зарегистрироваться в Честном ЗНАКе для ИП?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Для регистрации ИП в Честном ЗНАКе потребуется: УКЭП (усиленная квалифицированная электронная подпись) в аккредитованном УЦ, компьютер с установленным ПО для работы с ЭЦП, регистрация на честныйзнак.рф, подписание электронного соглашения с ЦРПТ. Процедура для ИП и ООО одинаковая. Мы помогаем пройти все шаги.',
      },
    },
    {
      '@type': 'Question',
      name: 'Какие документы нужны для подключения Честного ЗНАК?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Для подключения Честного ЗНАК необходимы: УКЭП на Рутокене или JaCarta, СНИЛС руководителя, ИНН организации или ИП. Для отдельных товарных групп могут потребоваться дополнительные документы (лицензии, сертификаты). Полный перечень зависит от категории маркируемых товаров.',
      },
    },
    {
      '@type': 'Question',
      name: 'Сколько занимает регистрация в Честном ЗНАКе?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Сама регистрация на честныйзнак.рф занимает 15–30 минут при наличии УКЭП. Полная настройка под ключ с привязкой кассы — 1 рабочий день. Если нужно дополнительно настроить ЭДО, ТС ПИоТ и кассу — до 2 дней.',
      },
    },
    {
      '@type': 'Question',
      name: 'Обязательно ли подключать Честный ЗНАК для моего бизнеса?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Подключение Честного ЗНАК обязательно, если вы реализуете маркированные товары: табак, обувь, одежда, молочная продукция, бутилированная вода, пиво, лекарства, парфюмерия, шины и другие категории. Перечень регулярно расширяется. Продажа немаркированных товаров влечёт штрафы по ст. 15.12 КоАП РФ: от 5 000 ₽ для ИП, от 50 000 ₽ для юрлиц.',
      },
    },
  ],
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SETUP_ITEMS = [
  {
    icon: <Key className="w-5 h-5" />,
    title: 'Оформление УКЭП',
    desc: 'Помогаем получить усиленную квалифицированную электронную подпись (УКЭП) в аккредитованном удостоверяющем центре. УКЭП необходима для входа в Честный ЗНАК, подписания документов и работы с ЭДО. Без УКЭП регистрация невозможна.',
  },
  {
    icon: <UserPlus className="w-5 h-5" />,
    title: 'Регистрация в системе',
    desc: 'Регистрируем учётную запись на честныйзнак.рф: создаём профиль, подписываем электронное соглашение с ЦРПТ (Центр развития перспективных технологий), настраиваем товарные группы в соответствии с вашей деятельностью.',
  },
  {
    icon: <Settings className="w-5 h-5" />,
    title: 'Настройка личного кабинета',
    desc: 'Настраиваем личный кабинет Честного ЗНАК: добавляем торговые точки, настраиваем полномочия сотрудников, настраиваем агрегаторов и участников оборота. Формируем структуру, удобную для ежедневной работы.',
  },
  {
    icon: <Link2 className="w-5 h-5" />,
    title: 'Привязка кассы',
    desc: 'Связываем контрольно-кассовую технику с системой Честный ЗНАК через ТС ПИоТ. Настраиваем сканирование кодов Data Matrix при пробитии чека. Проверяем корректность передачи данных — касса должна корректно выводить код маркировки в чеке.',
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: 'Обучение сотрудников',
    desc: 'Обучаем сотрудников работе в личном кабинете Честного ЗНАК: приёмка товаров, проверка кодов маркировки, вывод из оборота, работа с накладными. Выдаём пошаговую памятку для быстрого старта.',
  },
]

const REG_STEPS = [
  {
    num: '01',
    title: 'Получение УКЭП',
    desc: 'Оформляем усиленную квалифицированную электронную подпись в аккредитованном удостоверяющем центре. Срок изготовления — 1–3 рабочих дня. Нужен СНИЛС и ИНН.',
  },
  {
    num: '02',
    title: 'Создание учётной записи',
    desc: 'Заходим на честныйзнак.рф с помощью УКЭП, заполняем профиль организации (ИНН, название, адрес, контактные данные). Подписываем электронное соглашение с ЦРПТ.',
  },
  {
    num: '03',
    title: 'Настройка товарных групп',
    desc: 'Добавляем товарные группы, с которыми вы работаете: табак, обувь, молочная продукция и другие. Настраиваем коды ОКПД2 и подключаем нужные модули системы.',
  },
  {
    num: '04',
    title: 'Привязка кассы и тестирование',
    desc: 'Связываем кассу с Честным ЗНАКом через ТС ПИоТ, пробиваем тестовый чек, проверяем корректность передачи кода маркировки в системе. Обучаем сотрудников и передаём готовое решение.',
  },
]

const FAQS = [
  {
    q: 'Сколько стоит подключение Честного ЗНАК?',
    a: 'Сама регистрация в Честном ЗНАКе — бесплатная, это государственная система. Платная часть — это работа специалиста по настройке всех компонентов: помощь с УКЭП, регистрация, настройка кабинета, привязка кассы, ТС ПИоТ, обучение сотрудников. Стоимость настройки начинается от 1 500 ₽, полная настройка под ключ — от 5 300 ₽. Рассчитайте точную стоимость в нашем бесплатном <Link href="/" className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#2a5080]">калькуляторе</Link>.',
  },
  {
    q: 'Как зарегистрироваться в Честном ЗНАКе для ИП?',
    a: 'Для регистрации ИП необходимы: УКЭП на Рутокене или JaCarta, компьютер с ПО для работы с электронной подписью (КриптоПро CSP или аналоги), СНИЛС и ИНН. Регистрация проходит на сайте честныйзнак.рф — заходите по УКЭП, заполняете профиль, подписываете соглашение с ЦРПТ. Процедура для ИП и ООО одинаковая. Наши инженеры помогут пройти все шаги без ошибок.',
  },
  {
    q: 'Какие документы нужны для подключения Честного ЗНАК?',
    a: 'Базовый комплект: УКЭП (усиленная квалифицированная электронная подпись), СНИЛС руководителя, ИНН организации или ИП. Для отдельных товарных групп могут потребоваться дополнительные документы — например, лицензия на фармацевтическую деятельность для лекарств. Полный перечень зависит от категорий товаров, с которыми вы работаете.',
  },
  {
    q: 'Сколько занимает регистрация в Честном ЗНАКе?',
    a: 'Сама регистрация на честныйзнак.рф занимает 15–30 минут при наличии УКЭП. Если УКЭП нужно оформить — это ещё 1–3 рабочих дня. Полная настройка под ключ с привязкой кассы, настройкой ЭДО и ТС ПИоТ — 1 рабочий день. Мы работаем быстро и гарантируем результат.',
  },
  {
    q: 'Обязательно ли подключать Честный ЗНАК для моего бизнеса?',
    a: 'Подключение Честного ЗНАК обязательно, если вы реализуете маркированные товары: сигареты, обувь, одежда, бутилированная вода, пиво, молочная продукция, лекарства, парфюмерия, шины, антисептики и другие категории. С 2025–2026 годов перечень продолжает расширяться. Продажа немаркированных товаров влечёт штрафы по ст. 15.12 КоАП РФ: для ИП — от 5 000 ₽, для юридических лиц — от 50 000 ₽. При повторном нарушении возможна конфискация товара. Проконсультируйтесь с нами — мы бесплатно определим, распространяется ли маркировка на ваш бизнес.',
  },
]

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ChestnyznakPage() {
  return (
    <>
      {/* JsonLd */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Breadcrumbs items={[{ label: 'Подключение Честного ЗНАК' }]} />

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight">
            Подключение Честного ЗНАК в Санкт-Петербурге
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Регистрация и полное подключение к государственной системе маркировки для ИП и ООО.
            Настройка рабочего места, привязка кассы, обучение сотрудников. Под ключ за 1 день.
            Цена от 1 500 ₽. Бесплатная консультация.
          </p>
        </div>

        {/* ── Что такое Честный ЗНАК ──────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Что такое Честный ЗНАК и зачем он нужен
          </h2>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5">
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-4">
              <strong className="text-[#1e3a5f]">Честный ЗНАК</strong> (честныйзнак.рф) — это
              государственная информационная система прослеживаемости товаров в Российской Федерации.
              Каждая единица маркированной продукции получает уникальный код <strong className="text-slate-700">Data Matrix</strong>,
              который наносится на упаковку производителем и заносится в базу данных.
            </p>
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-4">
              При продаже товара кассир сканирует код Data Matrix, и информация о реализации
              автоматически передаётся через ОФД в ФНС и Честный ЗНАК. Это позволяет государству
              отслеживать движение товаров от производства до конечного потребителя и бороться с
              контрафактом.
            </p>
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
              Подключение к Честному ЗНАКу — <strong className="text-slate-700">обязательное требование закона</strong> для
              всех, кто продаёт маркированные товары. Система работает с 2019 года, и перечень
              маркируемых категорий постоянно расширяется. На сегодняшний день это сигареты, обувь,
              одежда, бутилированная вода, пиво, молочная продукция, лекарства, парфюмерия, шины
              и другие категории.
            </p>
          </div>
        </section>

        {/* ── Что входит в подключение ────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Что входит в подключение Честного ЗНАК под ключ
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Мы предлагаем комплексное подключение Честного ЗНАК — от получения УКЭП до финального
            тестирования кассы. Вам не нужно разбираться в технических деталях — мы всё сделаем за вас.
          </p>
          <div className="space-y-4">
            {SETUP_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center text-[#1e3a5f] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1e3a5f] mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Пошаговая регистрация ───────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Как зарегистрироваться в Честном ЗНАКе — пошагово
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Процесс регистрации состоит из 4 основных этапов. При обращении к нам мы проведём вас
            через каждый шаг — без ошибок и задержек.
          </p>
          <div className="space-y-4">
            {REG_STEPS.map((step, idx) => (
              <div
                key={idx}
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

        {/* ── Стоимость ───────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Стоимость подключения Честного ЗНАК
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Регистрация в системе Честный ЗНАК — бесплатная. Стоимость зависит от объёма работ:
            нужна ли УКЭП, сколько товарных групп, нужно ли настраивать кассу и ЭДО.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Регистрация</p>
              <p className="text-2xl font-extrabold text-[#1e3a5f]">от 1 500 ₽</p>
              <p className="text-xs text-slate-500 mt-2">Настройка кабинета, товарных групп и привязка кассы</p>
            </div>
            <div className="bg-white rounded-xl border-2 border-[#e8a817]/40 shadow-sm p-4 text-center relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#e8a817] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                Под ключ
              </span>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Полная настройка</p>
              <p className="text-2xl font-extrabold text-[#1e3a5f]">от 8 000 ₽</p>
              <p className="text-xs text-slate-500 mt-2">УКЭП, Честный ЗНАК, ТС ПИоТ, ЭДО, касса, обучение</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Точную стоимость рассчитайте в бесплатном{' '}
            <Link href="/" className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#2a5080]">
              калькуляторе
            </Link>{' '}
            — за 2 минуты без регистрации.
          </p>
        </section>

        {/* ── Сколько занимает ────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Сколько занимает регистрация
          </h2>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-[#e8a817]" />
              <h3 className="text-base font-bold text-[#1e3a5f]">Полная настройка — 1 рабочий день</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              При наличии УКЭП регистрация в Честном ЗНАКе и полная настройка рабочего места занимает
              1 рабочий день. Это включает: регистрацию на честныйзнак.рф, подписание соглашения с ЦРПТ,
              настройку товарных групп, привязку кассы через ТС ПИоТ и тестирование.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Если УКЭП нужно оформить — добавьте 1–3 рабочих дня на изготовление. Если одновременно
              настраивается касса и ЭДО — 1–2 дня. Мы работаем оперативно, чтобы вы могли начать
              продавать маркированные товары как можно скорее.
            </p>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Часто задаваемые вопросы
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

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5080] rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Нужна помощь с подключением Честного ЗНАК?
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-4 max-w-xl mx-auto">
            Бесплатная консультация — перезвоним за 15 минут. Подключим под ключ за 1 день, без ошибок.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+78124659457"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8a817] hover:bg-[#d49a12] text-white font-bold rounded-xl transition-colors shadow-md"
            >
              <Phone className="w-5 h-5" />
              +7 (812) 465-94-57
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Калькулятор маркировки
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/50">
            <Link href="/nastroyka-kassy-markirovka" className="underline underline-offset-2 hover:text-white/80 transition-colors">
              Настройка кассы для маркировки
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
