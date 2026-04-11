// ============================================================================
// Интеграция 1С с маркировкой — SEO Landing Page
// ============================================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ChevronDown,
  Phone,
  Calculator,
  CheckCircle,
  ArrowLeftRight,
  FileText,
  ScanBarcode,
  ClipboardCheck,
  GraduationCap,
  Clock,
  Settings,
  Monitor,
  ShoppingCart,
  Building,
  BarChart3,
  Package,
  ShieldCheck,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'

const SITE_URL = 'https://tellurmarkirovka.vercel.app'
const PAGE_URL = `${SITE_URL}/integraciya-1c`

export const metadata: Metadata = {
  title: 'Интеграция 1С с маркировкой в СПб | Настройка Честный ЗНАК + 1С — Теллур-Интех',
  description:
    'Интеграция 1С с системой маркировки Честный ЗНАК в Санкт-Петербурге. Настройка обмена данными, ЭДО, сканирование Data Matrix. Цена от 5 000 ₽. Подключение за 1-2 дня.',
  keywords: [
    'интеграция 1с маркировка',
    '1с честный знак',
    'настройка 1с маркировка',
    'интеграция 1с честный знак спб',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Интеграция 1С с маркировкой в СПб — Теллур-Интех',
    description:
      'Настройка интеграции 1С с системой маркировки Честный ЗНАК. Обмен данными, ЭДО, сканирование Data Matrix. Цена от 5 000 ₽.',
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
    { '@type': 'ListItem', position: 2, name: 'Интеграция 1С с маркировкой', item: PAGE_URL },
  ],
}

const jsonLdService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Интеграция 1С с системой маркировки Честный ЗНАК',
  description:
    'Настройка интеграции программы 1С с государственной системой маркировки Честный ЗНАК в Санкт-Петербурге. Автоматический обмен данными, ЭДО, сканирование штрихкодов Data Matrix, управление остатками. 1С:Бухгалтерия, 1С:Розница, 1С:Управление торговлей, 1С:Комплексная. Цена от 5 000 ₽.',
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Санкт-Петербург',
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Россия' },
  },
  serviceType: 'Интеграция 1С с системой маркировки',
  category: 'Автоматизация бизнеса',
  offers: {
    '@type': 'Offer',
    price: '5000',
    priceCurrency: 'RUB',
    description: 'Базовая интеграция 1С с маркировкой от 5 000 ₽',
  },
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Сколько стоит интеграция 1С с маркировкой?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Базовая интеграция 1С с Честным ЗНАКом начинается от 5 000 ₽. Полная интеграция под ключ с настройкой ЭДО, сканеров штрихкодов и обучением — от 10 000 ₽. Стоимость зависит от конфигурации 1С и объёма работ. Рассчитайте точную цену в бесплатном калькуляторе за 2 минуты.',
      },
    },
    {
      '@type': 'Question',
      name: 'Какие версии 1С поддерживает интеграция с маркировкой?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Мы настраиваем интеграцию с основными конфигурациями 1С: 1С:Бухгалтерия 3.0, 1С:Розница 2.2/2.3, 1С:Управление торговлей (УТ 11), 1С:Комплексная автоматизация (1С:КА 2), 1С:ERP Управление предприятием. Важно, чтобы версия была актуальной и поддерживала формат обмена данными с Честным ЗНАКом.',
      },
    },
    {
      '@type': 'Question',
      name: 'Нужен ли сканер штрихкодов для работы с маркировкой?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Да, для сканирования кодов Data Matrix необходим 2D-сканер штрихкодов. Обычные 1D-сканеры не читают коды маркировки. Рекомендуем сканеры: Honeywell, Datalogic, Zebra. Если сканер уже есть — проверим совместимость. Если нет — подберём оптимальную модель.',
      },
    },
    {
      '@type': 'Question',
      name: 'Сколько времени занимает интеграция 1С с маркировкой?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Базовая интеграция 1С с Честным ЗНАКом занимает 1–2 рабочих дня. Полная настройка под ключ с ЭДО, сканерами и обучением — 2–3 дня. Срок зависит от текущего состояния 1С, версии конфигурации и количества торговых точек.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что если мы уже работаем в 1С — нужно ли что-то менять?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Если вы уже используете 1С, мы добавим модуль маркировки в вашу текущую конфигурацию. Данные не будут потеряны. Обновим 1С до актуального релиза, настроим обмен с Честным ЗНАКом, подключим ЭДО и сканеры. Процесс проходит без остановки текущей работы.',
      },
    },
  ],
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    icon: <ArrowLeftRight className="w-5 h-5" />,
    title: 'Автоматическая синхронизация данных',
    desc: '1С автоматически обменивается данными с Честным ЗНАКом: приёмка товаров, списание, перемещение между точками. Нет необходимости вручную вводить коды маркировки — всё происходит автоматически через ЭДО.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Минимум ошибок',
    desc: 'Исключаем ручной ввод кодов Data Matrix — сканер считывает код, 1С автоматически проверяет его в Честном ЗНАКе и формирует документ. Снижение ошибок при приёмке и продаже до нуля.',
  },
  {
    icon: <Package className="w-5 h-5" />,
    title: 'Управление остатками',
    desc: 'Точное отслеживание остатков маркированных товаров в 1С. Система автоматически обновляет количество при каждой продаже, приёмке или списании. Вы всегда знаете, сколько маркированного товара на складе.',
  },
]

const SETUP_ITEMS = [
  {
    icon: <Settings className="w-5 h-5" />,
    title: 'Настройка обмена данными',
    desc: 'Настраиваем обмен между 1С и системой Честный ЗНАК: загружаем коды маркировки, настраиваем автоматическую выгрузку документов, настраиваем расписание синхронизации. 1С будет автоматически получать обновления из Честного ЗНАК.',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Интеграция с ЭДО',
    desc: 'Подключаем электронный документооборот (Контур.Диадок, СБИС, Такском) к 1С. Накладные от поставщиков с кодами маркировки автоматически попадают в 1С — не нужно вручную переносить данные.',
  },
  {
    icon: <ScanBarcode className="w-5 h-5" />,
    title: 'Подключение сканеров штрихкодов',
    desc: 'Настраиваем 2D-сканеры штрихкодов для считывания кодов Data Matrix. Проверяем совместимость сканера с вашей конфигурацией 1С. При необходимости подберём и поставим подходящую модель.',
  },
  {
    icon: <ClipboardCheck className="w-5 h-5" />,
    title: 'Тестирование',
    desc: 'Проводим полное тестирование: приёмка товара через ЭДО → 1С, продажа с кассы → Честный ЗНАК, проверка остатков, сканирование кодов. Устраняем все ошибки до передачи в работу.',
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: 'Обучение сотрудников',
    desc: 'Обучаем менеджеров и кладовщиков работе в 1С с маркированными товарами: приёмка через ЭДО, сканирование, списание, сверка остатков, формирование отчётов. Выдаём пошаговую инструкцию.',
  },
]

const CONFIGS = [
  {
    icon: <BarChart3 className="w-5 h-5" />,
    name: '1С:Бухгалтерия 3.0',
    desc: 'Базовая конфигурация для учёта маркированных товаров. Подходит для небольших компаний с одной торговой точкой.',
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    name: '1С:Розница 2.2 / 2.3',
    desc: 'Розничная торговля с поддержкой маркировки. Автоматизация магазина, учёт остатков, сканирование на кассе.',
  },
  {
    icon: <Building className="w-5 h-5" />,
    name: '1С:Управление торговлей (УТ 11)',
    desc: 'Мощная система для оптовой и розничной торговли. Полная интеграция с Честным ЗНАКом, ЭДО, управление складом.',
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    name: '1С:Комплексная автоматизация (1С:КА 2)',
    desc: 'Комплексное решение для среднего бизнеса. Управление торговлей, производством, складом с поддержкой маркировки.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Аудит текущей системы 1С',
    desc: 'Проверяем версию и конфигурацию 1С, наличие обновлений, настройки обмена данными, доступность сервера Честного ЗНАК. Определяем объём необходимых работ.',
  },
  {
    num: '02',
    title: 'Обновление и подготовка 1С',
    desc: 'Обновляем 1С до актуального релиза с поддержкой маркировки. Настраиваем параметры подключения к Честному ЗНАК: сертификаты, адреса серверов, учётные данные.',
  },
  {
    num: '03',
    title: 'Настройка обмена и ЭДО',
    desc: 'Настраиваем автоматический обмен данными между 1С и Честным ЗНАК. Подключаем ЭДО для автоматической приёмки накладных с кодами маркировки.',
  },
  {
    num: '04',
    title: 'Подключение оборудования',
    desc: 'Настраиваем 2D-сканеры штрихкодов, проверяем корректность считывания кодов Data Matrix. При необходимости подключаем ТС ПИоТ и настраиваем кассу.',
  },
  {
    num: '05',
    title: 'Тестирование и обучение',
    desc: 'Пробиваем полный цикл: приёмка → склад → продажа. Проверяем все звенья цепочки. Обучаем сотрудников и выдаём инструкции. Гарантийная поддержка 30 дней.',
  },
]

const FAQS = [
  {
    q: 'Сколько стоит интеграция 1С с маркировкой?',
    a: 'Базовая интеграция 1С с Честным ЗНАКом (настройка обмена данными) начинается от 5 000 ₽. Полная интеграция под ключ с подключением ЭДО, настройкой сканеров штрихкодов и обучением сотрудников — от 10 000 ₽. Окончательная стоимость зависит от конфигурации 1С, количества торговых точек и объёма товаров. Рассчитайте точную цену в нашем бесплатном <Link href="/" className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#2a5080]">калькуляторе</Link>.',
  },
  {
    q: 'Какие версии 1С поддерживает интеграция с маркировкой?',
    a: 'Мы настраиваем интеграцию со всеми основными конфигурациями 1С, которые поддерживают работу с маркировкой: 1С:Бухгалтерия 3.0, 1С:Розница 2.2 и 2.3, 1С:Управление торговлей (УТ 11), 1С:Комплексная автоматизация (1С:КА 2), 1С:ERP Управление предприятием. Важно, чтобы конфигурация была актуальной — старые версии могут не поддерживать формат обмена с Честным ЗНАКом. При необходимости обновим 1С.',
  },
  {
    q: 'Нужен ли сканер штрихкодов для работы с маркировкой в 1С?',
    a: 'Да, для считывания кодов маркировки Data Matrix необходим <strong className="text-slate-700">2D-сканер штрихкодов</strong>. Обычные 1D-сканеры (линейные) не могут считывать двумерные коды Data Matrix. Рекомендуем проверенные модели: Honeywell Voyager 1202g, Datalogic QuickScan QD2500, Zebra DS3608. Если сканер уже есть — проверим совместимость с вашей конфигурацией 1С.',
  },
  {
    q: 'Сколько времени занимает интеграция 1С с маркировкой?',
    a: 'Базовая настройка обмена данными между 1С и Честным ЗНАКом занимает 1–2 рабочих дня. Полная интеграция под ключ с подключением ЭДО, настройкой сканеров и обучением сотрудников — 2–3 рабочих дня. Если требуется обновление 1С или замена оборудования — добавляется 1 день. Мы работаем быстро, чтобы минимизировать простой вашего бизнеса.',
  },
  {
    q: 'Что если мы уже работаем в 1С — нужно ли что-то менять?',
    a: 'Нет, менять текущую систему не нужно. Мы добавим модуль маркировки в вашу действующую конфигурацию 1С — все текущие данные, справочники и настройки сохранятся. Процесс выглядит так: обновляем 1С до актуального релиза, настраиваем обмен с Честным ЗНАКом, подключаем ЭДО, настраиваем сканеры. Работа проходит без остановки текущей деятельности.',
  },
]

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Integraciya1CPage() {
  return (
    <>
      {/* JsonLd */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Breadcrumbs items={[{ label: 'Интеграция 1С и маркировки' }]} />

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight">
            Интеграция 1С с системой маркировки в Санкт-Петербурге
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Настройка обмена данными между 1С и Честным ЗНАКом. Автоматическая приёмка товаров
            через ЭДО, сканирование Data Matrix, управление остатками. Подключение за 1–2 дня
            без ошибок. Цена от 5 000 ₽.
          </p>
        </div>

        {/* ── Зачем нужна интеграция ──────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Зачем нужна интеграция 1С с маркировкой
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Если вы ведёте учёт в программе 1С и торгуете маркированными товарами, интеграция
            с Честным ЗНАКом — не просто удобство, а необходимость. Без автоматического обмена
            данными вам придётся вручную вносить каждый код маркировки, что ведёт к ошибкам,
            задержкам и штрафам.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BENEFITS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center text-[#1e3a5f] mb-3">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-[#1e3a5f] mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Что входит ──────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Что входит в интеграцию 1С с Честным ЗНАКом
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Мы настраиваем полную цепочку обмена данными между вашей учётной системой и
            государственной системой маркировки. Все компоненты работают как единое целое —
            от приёмки товара до формирования отчётов.
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

        {/* ── Конфигурации 1С ─────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Какие конфигурации 1С поддерживаем
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Мы работаем со всеми основными конфигурациями 1С, которые поддерживают работу
            с маркированными товарами. Важно, чтобы версия была актуальной — старые релизы
            могут не поддерживать текущий формат обмена с Честным ЗНАК.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONFIGS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1e3a5f]/5 flex items-center justify-center text-[#1e3a5f] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1e3a5f] mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5 этапов ────────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Как проходит интеграция — 5 этапов
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Наш отлаженный процесс интеграции 1С с маркировкой гарантирует отсутствие ошибок
            и минимальное время простоя. Каждый этап контролируется инженером.
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

        {/* ── Цены ────────────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Цены на интеграцию 1С с маркировкой
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Стоимость зависит от конфигурации 1С, количества торговых точек и объёма
            необходимых работ. Работаем прозрачно — без скрытых платежей.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Базовая</p>
              <p className="text-2xl font-extrabold text-[#1e3a5f]">от 5 000 ₽</p>
              <p className="text-xs text-slate-500 mt-2">Настройка обмена данными между 1С и Честным ЗНАК</p>
            </div>
            <div className="bg-white rounded-xl border-2 border-[#e8a817]/40 shadow-sm p-4 text-center relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#e8a817] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                Под ключ
              </span>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Полная</p>
              <p className="text-2xl font-extrabold text-[#1e3a5f]">от 10 000 ₽</p>
              <p className="text-xs text-slate-500 mt-2">Обмен данными, ЭДО, сканеры, тестирование, обучение</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Рассчитайте точную стоимость в бесплатном{' '}
            <Link href="/" className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#2a5080]">
              калькуляторе
            </Link>{' '}
            — за 2 минуты без регистрации.
          </p>
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
            Нужна интеграция 1С с маркировкой?
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-4 max-w-xl mx-auto">
            Бесплатная консультация — перезвоним за 15 минут. Настроим интеграцию под ключ
            за 1–2 дня, без ошибок и простоев.
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
