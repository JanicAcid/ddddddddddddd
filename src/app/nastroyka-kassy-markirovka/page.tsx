// ============================================================================
// Настройка кассы для маркировки — SEO Landing Page
// ============================================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ChevronDown,
  Phone,
  Calculator,
  CheckCircle,
  Settings,
  FileText,
  ShieldCheck,
  Database,
  CloudUpload,
  GraduationCap,
  Clock,
  Monitor,
} from 'lucide-react'

const SITE_URL = 'https://tellurmarkirovka.vercel.app'
const PAGE_URL = `${SITE_URL}/nastroyka-kassy-markirovka`

export const metadata: Metadata = {
  title: 'Настройка кассы для маркировки в СПб | Цена под ключ, за 1 день — Теллур-Интех',
  description:
    'Настройка кассы для маркировки товаров в Санкт-Петербурге. Меркурий, Атол, Эвотор, Штрих-М. Цена от 1 500 ₽. Под ключ за 1 день, без ошибок. ФФД 1.2, Честный ЗНАК, ЭДО, ТС ПИоТ. Бесплатная консультация.',
  keywords: [
    'настройка кассы маркировка',
    'настройка кассы для маркировки спб',
    'настройка кассы маркировка цена',
    'как настроить кассу для маркировки',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Настройка кассы для маркировки в СПб — Теллур-Интех',
    description:
      'Настройка кассы под ключ для маркировки товаров в Санкт-Петербурге. Меркурий, Атол, Эвотор, Штрих-М. Цена от 1 500 ₽. За 1 день, без ошибок.',
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
    { '@type': 'ListItem', position: 2, name: 'Настройка кассы для маркировки', item: PAGE_URL },
  ],
}

const jsonLdService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Настройка кассы для маркировки товаров',
  description:
    'Комплексная настройка контрольно-кассовой техники для работы с маркированными товарами в Санкт-Петербурге. ЭДО, Честный ЗНАК, ТС ПИоТ, ФФД 1.2, ОФД, обучение сотрудников. Кассы: Меркурий, Атол, Эвотор, Штрих-М, Пионер, AQSI. Под ключ за 1 день.',
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Санкт-Петербург',
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Россия' },
  },
  serviceType: 'Настройка кассы для маркировки товаров',
  category: 'Кассовое оборудование',
  offers: {
    '@type': 'Offer',
    price: '1500',
    priceCurrency: 'RUB',
    description: 'Частичная настройка маркировки от 1 500 ₽, полная под ключ от 5 300 ₽',
  },
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Сколько стоит настройка кассы для маркировки?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Частичная настройка маркировки начинается от 1 500 ₽. Полная настройка под ключ — от 5 300 ₽.',
      },
    },
    {
      '@type': 'Question',
      name: 'Как проходит процесс настройки кассы для маркировки?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Процесс включает 6 шагов: диагностика кассы и проверка ФФД 1.2, регистрация/перерегистрация ККТ в ФНС, подключение ОФД, настройка ЭДО для приёмки товаров, подключение Честный ЗНАК и ТС ПИоТ, тестирование и обучение сотрудников. Весь процесс занимает 1 день при наличии ЭЦП.',
      },
    },
    {
      '@type': 'Question',
      name: 'Нужна ли ЭЦП для настройки кассы под маркировку?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Да, электронная цифровая подпись (ЭЦП) на Рутокене или JaCarta обязательна. Без неё невозможно зарегистрировать кассу в ФНС, войти в Честный ЗНАК, подписать документы ЭДО и принимать накладные от поставщиков. Если ЭЦП ещё нет, мы поможем оформить её в аккредитованном удостоверяющем центре.',
      },
    },
    {
      '@type': 'Question',
      name: 'За сколько дней настраиваете кассу?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'При наличии ЭЦП настройка кассы под ключ занимает 1 рабочий день. Для б/у касс может потребоваться 2-3 дня — дополнительно обновляем прошивку и при необходимости заменяем фискальный накопитель. Регистрация ККТ в ФНС — 1-2 дня (ожидание подтверждения от налоговой).',
      },
    },
    {
      '@type': 'Question',
      name: 'Что если у меня старая касса — подходит ли она для маркировки?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Большинство касс можно адаптировать под маркировку. Необходима поддержка ФФД 1.2 — для старых касс обновляем прошивку и при необходимости заменяем фискальный накопитель. Мы работаем с Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI. Если касса совсем устарела, подберём оптимальную замену.',
      },
    },
  ],
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SETUP_ITEMS = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'ЭДО — электронный документооборот',
    desc: 'Подключаем оператора ЭДО (Контур.Диадок, СБИС, Такском) для обмена электронными накладными с поставщиками. Без ЭДО коды маркировки не попадут в Честный ЗНАК при приёмке товара. Настраиваем подпись УКЭП, маршрутизацию документов и автоматическую обработку.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Честный ЗНАК — государственная система маркировки',
    desc: 'Регистрируем вашу учётную запись на честныйзнак.рф, подписываем электронное соглашение с ЦРПТ, настраиваем товарные группы и номенклатуру. Привязываем рабочее место кассира к системе для сканирования кодов Data Matrix при продаже.',
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: 'ТС ПИоТ — программный модуль',
    desc: 'Оформляем лицензию ТС ПИоТ (Тренажёро-Сервер Программно-Информационный Оператор Торговли) — это «переводчик» между кассой и Честным ЗНАКом. Устанавливаем и настраиваем модуль на кассовом оборудовании. Без ТС ПИоТ касса не пробивает маркированные товары.',
  },
  {
    icon: <CloudUpload className="w-5 h-5" />,
    title: 'ФНС и ФФД 1.2 — регистрация кассы',
    desc: 'Регистрируем или перерегистрируем ККТ в налоговой инспекции с переходом на формат фискальных документов 1.2 (обязателен для маркировки). Подключаем ОФД по партнёрской цене — на 500–1 000 ₽ дешевле рынка.',
  },
  {
    icon: <CloudUpload className="w-5 h-5" />,
    title: 'ОФД — оператор фискальных данных',
    desc: 'Подключаем к оператору фискальных данных (ОФД ТАКСКОМ). Без ОФД касса не работает по закону 54-ФЗ. Договор на 15 или 36 месяцев по партнёрской цене. Все чеки будут корректно передаваться в налоговую.',
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: 'Обучение сотрудников',
    desc: 'Проводим практическое обучение кассиров и менеджеров: сканирование кодов Data Matrix, приёмка маркированных товаров через ЭДО, порядок пробития чека с признаками маркировки, действия при ошибках и отказах. Обучение входит в стоимость настройки.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Диагностика кассы',
    desc: 'Проверяем модель, версию прошивки, наличие фискального накопителя и поддержку ФФД 1.2. Определяем, нужна ли замена ФН или обновление ПО.',
  },
  {
    num: '02',
    title: 'Регистрация в ФНС',
    desc: 'Оформляем регистрацию или перерегистрацию ККТ в налоговой с указанием признаков маркировки и формата ФФД 1.2.',
  },
  {
    num: '03',
    title: 'Подключение ОФД',
    desc: 'Настраиваем связь с оператором фискальных данных. Проверяем обмен данными: касса → ОФД → ФНС.',
  },
  {
    num: '04',
    title: 'Настройка ЭДО и Честного ЗНАК',
    desc: 'Подключаем электронный документооборот, регистрируем в Честном ЗНАКе, оформляем лицензию ТС ПИоТ, связываем все системы.',
  },
  {
    num: '05',
    title: 'Тестирование',
    desc: 'Пробиваем тестовый чек по маркированному товару, проверяем корректность передачи данных во все системы. Устраняем ошибки.',
  },
  {
    num: '06',
    title: 'Обучение и передача',
    desc: 'Обучаем сотрудников работе с маркированными товарами. Выдаём памятку с инструкцией. Гарантийная поддержка 30 дней.',
  },
]

const CASSES = [
  'Меркурий — фискальные регистраторы и смарт-терминалы',
  'Атол (включая линейку Сигма) — широкий модельный ряд',
  'Эвотор — смарт-терминалы с сенсорным экраном',
  'Штрих-М — надёжные фискальные регистраторы',
  'Пионер — компактные и доступные кассы',
  'AQSI — мобильные терминалы и фискальные регистраторы',
  'Сигма (Атол) — флагманская линейка Атол',
]

const FAQS = [
  {
    q: 'Сколько стоит настройка кассы для маркировки?',
    a: 'Частичная настройка маркировки начинается от 1 500 ₽. Полная настройка под ключ — от 5 300 ₽. Рассчитайте точную стоимость в нашем бесплатном <Link href="/" className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#2a5080]">калькуляторе</Link> — это занимает 2 минуты.',
  },
  {
    q: 'Как проходит процесс настройки кассы?',
    a: 'Процесс состоит из 6 шагов: диагностика кассы и проверка поддержки ФФД 1.2, регистрация ККТ в ФНС с признаками маркировки, подключение ОФД, настройка ЭДО для приёмки товаров от поставщиков, регистрация в Честном ЗНАКе и установка ТС ПИоТ, финальное тестирование и обучение сотрудников. При наличии ЭЦП весь цикл занимает 1 рабочий день.',
  },
  {
    q: 'Нужна ли ЭЦП для настройки кассы под маркировку?',
    a: 'Да, электронная цифровая подпись (УКЭП) на Рутокене или JaCarta — обязательное требование. Без ЭЦП невозможно зарегистрировать кассу в ФНС, войти в личный кабинет Честного ЗНАК, подписать документы ЭДО и принимать накладные от поставщиков. Если ЭЦП ещё не оформлена, мы подскажем, как получить её в аккредитованном удостоверяющем центре.',
  },
  {
    q: 'За сколько дней настраиваете кассу?',
    a: 'При наличии ЭЦП полная настройка кассы под ключ занимает 1 рабочий день. Регистрация ККТ в ФНС занимает 1–2 дня (ожидание подтверждения от налоговой). Для б/у касс может потребоваться 2–3 дня — дополнительно обновляем прошивку и при необходимости заменяем фискальный накопитель. Мы всегда работаем быстро и без ошибок.',
  },
  {
    q: 'Что если у меня старая касса — можно ли настроить маркировку?',
    a: 'В большинстве случаев старую кассу можно адаптировать под маркировку. Главное требование — поддержка формата ФФД 1.2. Если текущая прошивка не поддерживает ФФД 1.2, мы обновим программное обеспечение. При необходимости заменим фискальный накопитель. Если касса полностью устарела и не подлежит обновлению, поможем подобрать оптимальную замену с учётом вашего бюджета.',
  },
]

// ─── Page Component ───────────────────────────────────────────────────────────

export default function NastroykaKassyPage() {
  return (
    <>
      {/* JsonLd */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-slate-400" aria-label="Хлебные крошки">
          <Link href="/" className="hover:text-[#1e3a5f] transition-colors">Главная</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-600">Настройка кассы для маркировки</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight">
            Настройка кассы для маркировки в Санкт-Петербурге
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Комплексная настройка кассового оборудования под ключ для работы с маркированными товарами.
            ЭДО, Честный ЗНАК, ТС ПИоТ, ФФД 1.2, ОФД — связываем все системы без ошибок за 1 день.
            Цена от 1 500 ₽.
          </p>
        </div>

        {/* ── Что входит в настройку ─────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Что входит в настройку кассы под ключ
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Настройка кассы для маркировки — это комплексная процедура, которая связывает несколько
            систем в единую цепочку. Каждая из них обязательна: без хотя бы одной касса не сможет
            пробивать чеки по маркированным товарам. Мы настраиваем все компоненты под ключ, чтобы вы
            могли сразу приступать к работе.
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

        {/* ── Цены ───────────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Цены на настройку кассы для маркировки
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Стоимость зависит от состояния кассы, бренда и набора необходимых услуг. Мы работаем
            прозрачно — без скрытых платежей. Используйте наш бесплатный{' '}
            <Link href="/" className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#2a5080]">
              калькулятор
            </Link>{' '}
            для точного расчёта.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Базовая</p>
              <p className="text-2xl font-extrabold text-[#1e3a5f]">от 1 500 ₽</p>
              <p className="text-xs text-slate-500 mt-2">Настройка одной из систем (ЭДО, Честный ЗНАК или ТС ПИоТ)</p>
            </div>
            <div className="bg-white rounded-xl border-2 border-[#e8a817]/40 shadow-sm p-4 text-center relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#e8a817] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                Под ключ
              </span>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Полная</p>
              <p className="text-2xl font-extrabold text-[#1e3a5f]">8 000 – 15 000 ₽</p>
              <p className="text-xs text-slate-500 mt-2">Все системы: ЭДО, Честный ЗНАК, ТС ПИоТ, ФНС, ОФД, обучение</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Б/у касса</p>
              <p className="text-2xl font-extrabold text-[#1e3a5f]">+2 000 ₽</p>
              <p className="text-xs text-slate-500 mt-2">Доплата за обновление прошивки и диагностику б/у оборудования</p>
            </div>
          </div>
        </section>

        {/* ── 6 шагов ────────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Как мы настраиваем кассу — 6 шагов
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Наш отлаженный процесс позволяет настроить кассу для маркировки без ошибок и за минимальное
            время. Каждый этап контролируется инженером — мы не пропускаем ни одного шага.
          </p>
          <div className="space-y-4">
            {STEPS.map((step, idx) => (
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

        {/* ── Какие кассы ────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Какие кассы поддерживают маркировку
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Для работы с маркированными товарами необходима касса с поддержкой формата ФФД 1.2.
            Мы обслуживаем все основные бренды кассового оборудования в Санкт-Петербурге.
            Если у вас уже есть касса — проверим совместимость и настроим. Если нет — поможем подобрать.
          </p>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5">
            <ul className="space-y-3">
              {CASSES.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-[15px] text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Сколько времени ────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Сколько времени занимает настройка
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-[#e8a817]" />
                <h3 className="text-base font-bold text-[#1e3a5f]">Новая касса — 1 день</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                При наличии электронной цифровой подписи (ЭЦП) полная настройка новой кассы под ключ
                занимает 1 рабочий день. Это включает регистрацию ККТ в ФНС, подключение ОФД, настройку
                ЭДО, Честного ЗНАК и ТС ПИоТ, тестирование и обучение сотрудников.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-[#e8a817]" />
                <h3 className="text-base font-bold text-[#1e3a5f]">Б/у касса — 2–3 дня</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Для касс, которые уже находились в эксплуатации, потребуется дополнительное время на
                диагностику, обновление прошивки до ФФД 1.2 и при необходимости замену фискального
                накопителя. Общий срок — 2–3 рабочих дня с момента обращения.
              </p>
            </div>
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
            Нужна настройка кассы для маркировки?
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-4 max-w-xl mx-auto">
            Бесплатная консультация — перезвоним за 15 минут. Рассчитаем точную стоимость и подберём
            оптимальное решение под ваш бюджет.
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
            <Link href="/kakuyu-kassu-dlya-markirovki" className="underline underline-offset-2 hover:text-white/80 transition-colors">
              Какую кассу выбрать
            </Link>
            <span>|</span>
            <Link href="/podklyuchenie-chestnyy-znak" className="underline underline-offset-2 hover:text-white/80 transition-colors">
              Подключение Честного ЗНАК
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
