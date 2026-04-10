'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  Phone,
  Calculator,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
  Printer,
  Monitor,
  Truck,
  CreditCard,
  Wifi,
  ShieldCheck,
  Zap,
  Settings,
  ArrowRight,
  Loader2,
  Send,
  ChevronLeft,
  Store,
  User,
} from 'lucide-react'

const SITE_URL = 'https://tellurmarkirovka.vercel.app'
const PAGE_URL = `${SITE_URL}/kakuyu-kassu-dlya-markirovki`

// ─── Metadata (inlined for 'use client') ─────────────────────────────────────
// Metadata exported via head in layout; page is 'use client' for interactivity.

/*
export const metadata: Metadata = {
  title: 'Какую кассу выбрать для маркировки товаров в 2025 | Подбор, обзор моделей — Теллур-Интех',
  description:
    'Какую онлайн-кассу выбрать для работы с маркировкой товаров. Обзор моделей Атол, Эвотор, Меркурий, Штрих-М, Элвес, Пионер. Требования ФФД 1.2, фискальный накопитель, сканер штрихкодов. Подбор кассы под вид бизнеса в СПб.',
  keywords: [
    'какую кассу выбрать для маркировки',
    'касса для маркировки товаров 2025',
    'онлайн касса маркировка',
    'касса с поддержкой ФФД 1.2',
    'какая касса нужна для честного знака',
    'подбор кассы для маркировки',
    'касса для маркировки спб',
    'смарт терминал для маркировки',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Какую кассу выбрать для маркировки товаров — Теллур-Интех',
    description:
      'Полный гайд по выбору онлайн-кассы для маркировки. Обзор моделей Атол, Эвотор, Меркурий, Штрих-М. Требования ФФД 1.2, подбор под вид бизнеса. Консультация бесплатно.',
    url: PAGE_URL,
    siteName: 'Теллур-Интех',
    locale: 'ru_RU',
    type: 'article',
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
*/

// ─── JsonLd ───────────────────────────────────────────────────────────────────

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Какую кассу выбрать для маркировки', item: PAGE_URL },
  ],
}

const jsonLdArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Какую кассу выбрать для работы с маркировкой товаров в 2025 году',
  description:
    'Полное руководство по выбору онлайн-кассы для маркировки: обязательные требования ФФД 1.2, обзор популярных моделей по категориям бизнеса, критерии подбора и рекомендации специалистов.',
  author: {
    '@type': 'Organization',
    name: 'ООО «Теллур-Интех»',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'ООО «Теллур-Интех»',
    url: SITE_URL,
  },
  datePublished: '2025-01-15',
  dateModified: '2025-04-10',
  mainEntityOfPage: PAGE_URL,
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Какое главное требование к кассе для маркировки?',
      acceptedAnswer: {
        '@type': 'Answer',
      text: 'Касса должна поддерживать формат фискальных документов (ФФД) версии 1.2 и работать с фискальным накопителем ФН 1.1М или новее. Это обязательное требование для передачи данных о маркированных товарах в Честный ЗНАК через ОФД. Без ФФД 1.2 пробитие чека по маркированному товару невозможно.',
      },
    },
    {
      '@type': 'Question',
      name: 'Можно ли использовать старую кассу для маркировки?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'В большинстве случаев старую кассу можно адаптировать. Если оборудование поддерживает обновление прошивки до ФФД 1.2 — достаточно обновить ПО и заменить фискальный накопитель на ФН 1.1М. Если модель не поддерживает ФФД 1.2 даже после обновления — придётся заменить кассу.',
      },
    },
    {
      '@type': 'Question',
      name: 'Нужен ли сканер штрихкодов для работы с маркировкой?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Да, 2D-сканер штрихкодов (для считывания кодов Data Matrix) обязателен. Встроенный или внешний — зависит от модели кассы. Смарт-терминалы обычно имеют встроенный сканер, фискальные регистраторы требуют подключения внешнего.',
      },
    },
    {
      '@type': 'Question',
      name: 'Какая касса лучше для малого магазина?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Для небольшого магазина с небольшим потоком клиентов подойдут смарт-терминалы: Эвотор 5, Атол Sigma 10 или Меркурий 185. Они компактные, имеют встроенный сканер и сенсорный экран. Стоимость — от 15 000 ₽. Для магазина с одним кассовым местом этого достаточно.',
      },
    },
    {
      '@type': 'Question',
      name: 'Сколько стоит касса с поддержкой маркировки?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Бюджетные модели (Меркурий 115Ф, Атол 25Ф) — от 10 000 ₽. Средний сегмент (Эвотор 5, Атол Sigma 10) — 15 000–30 000 ₽. Флагманские решения (Эвотор 7.3, Атол Sigma 10, Pirit 2Ф) — от 39 900 ₽. К цене кассы добавьте стоимость ФН (8 000–13 000 ₽) и настройку (от 1 500 ₽).',
      },
    },
    {
      '@type': 'Question',
      name: 'Чем отличается фискальный регистратор от смарт-терминала?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Фискальный регистратор — это устройство только для печати чеков, его нужно подключать к компьютеру или POS-системе. Смарт-терминал — это автономное устройство с экраном и встроенным ПО для учёта товаров, сканирования штрихкодов и пробития чеков. Для маркировки смарт-терминал удобнее, но дороже.',
      },
    },
  ],
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const REQUIREMENTS = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Поддержка ФФД 1.2',
    desc: 'Формат фискальных документов версии 1.2 обязателен для работы с маркированными товарами. Именно через ФФД 1.2 касса передаёт в ОФД и далее в Честный ЗНАК коды маркировки (Data Matrix) при каждой продаже. Без ФФД 1.2 касса не сможет корректно пробивать чеки по маркированным товарам, что приведёт к штрафам.',
  },
  {
    icon: <Printer className="w-5 h-5" />,
    title: 'Фискальный накопитель ФН 1.1М и новее',
    desc: 'Фискальный накопитель (ФН) — это чип внутри кассы, который хранит информацию о всех пробитых чеках. Для маркировки требуется модель ФН 1.1М или выше, так как только они поддерживают ФФД 1.2. Старые накопители (ФН 1.0, ФН 1.1) не подходят — их придётся заменить. Срок службы ФН — 15 или 36 месяцев, в зависимости от режима работы.',
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    title: '2D-сканер штрихкодов (Data Matrix)',
    desc: 'Для считывания кодов маркировки Data Matrix необходим 2D-сканер. Некоторые кассы имеют встроенный сканер (Эвотор, Атол Sigma, Меркурий 185), другие требуют подключения внешнего USB или Bluetooth-сканера. Обычный 1D-сканер для EAN-13 не сможет прочитать код маркировки — это важный момент при выборе.',
  },
  {
    icon: <Wifi className="w-5 h-5" />,
    title: 'Подключение к интернету',
    desc: 'Онлайн-касса должна иметь стабильное подключение к интернету для передачи фискальных данных через ОФД в ФНС и Честный ЗНАК. Практически все современные модели поддерживают Wi-Fi, 4G/LTE или Ethernet. Для надёжной работы рекомендуем резервный канал связи.',
  },
]

const CASSES_BY_CATEGORY = [
  {
    category: 'Смарт-терминалы для малого бизнеса',
    description: 'Автономные кассы с сенсорным экраном, встроенным сканером и ПО для учёта товаров. Идеальны для магазинов с 1–2 кассовыми местами, павильонов, аптек, точек общепита.',
    models: [
      {
        name: 'Эвотор 5 (СТ5Ф)',
        vendor: 'ЭВОТОР',
        price: 'от 24 900 ₽',
        features: ['5" сенсорный экран', 'Встроенный 2D-сканер', 'Android, магазин приложений', 'Wi-Fi, 4G'],
        best: 'Малый магазин, павильон, киоск',
      },
      {
        name: 'Эвотор 7.3 (СТ3Ф)',
        vendor: 'ЭВОТОР',
        price: 'от 39 900 ₽',
        features: ['7.3" IPS-экран', 'Встроенный 2D-сканер', '8-ядерный процессор', 'Android 11, 64 ГБ'],
        best: 'Средний магазин, аптека, кафе',
      },
      {
        name: 'Атол Sigma 10',
        vendor: 'АТОЛ',
        price: 'от 32 000 ₽',
        features: ['10.1" сенсорный экран', 'Встроенный 2D-сканер', 'Android, экосистема АТОЛ', 'Wi-Fi, 4G, Ethernet'],
        best: 'Магазин с assortиментом 5000+ SKU',
      },
      {
        name: 'Атол Sigma 7',
        vendor: 'АТОЛ',
        price: 'от 22 000 ₽',
        features: ['7" сенсорный экран', 'Встроенный 2D-сканер', 'Компактный корпус', 'Android, облачная связь'],
        best: 'Точка продаж с ограниченным пространством',
      },
      {
        name: 'Меркурий 185Ф',
        vendor: 'АСТОР ТРЕЙД',
        price: 'от 26 000 ₽',
        features: ['Сенсорный экран', 'Встроенный 2D-сканер', 'ФН 1.1М, ФФД 1.2', 'Wi-Fi, USB'],
        best: 'Малый и средний розничный магазин',
      },
    ],
  },
  {
    category: 'Фискальные регистраторы для среднего бизнеса',
    description: 'Устройства для печати чеков, которые подключаются к POS-системе или компьютеру. Подходят для магазинов с несколькими кассовыми местами, супермаркетов, автозаправок.',
    models: [
      {
        name: 'Атол 30Ф',
        vendor: 'АТОЛ',
        price: 'от 16 000 ₽',
        features: ['Автоотрезчик чеков', 'USB, Ethernet, Wi-Fi', 'ФН 1.1М, ФФД 1.2', '80 мм лента'],
        best: 'POS-система, супермаркет, ресторан',
      },
      {
        name: 'Штрих-М-01Ф',
        vendor: 'ШТРИХ-М',
        price: 'от 13 000 ₽',
        features: ['Надёжный механизм печати', 'USB, COM, Ethernet', 'ФН 1.1М, ФФД 1.2', 'Тихая печать'],
        best: 'Магазин с постоянным потоком покупателей',
      },
      {
        name: 'Элвес-ФР-Ф',
        vendor: 'НТЦ Измеритель',
        price: 'от 11 000 ₽',
        features: ['Компактный корпус', 'USB, Bluetooth', 'ФН 1.1М, ФФД 1.2', '58 мм лента'],
        best: 'Небольшая точка, мобильная торговля',
      },
      {
        name: 'Pirit 2Ф',
        vendor: 'Кристалл Сервис',
        price: 'от 14 000 ₽',
        features: ['Высокая скорость печати', 'USB, Ethernet, Wi-Fi', 'ФН 1.1М, ФФД 1.2', 'Надёжная конструкция'],
        best: 'Высокопроходная касса',
      },
    ],
  },
  {
    category: 'Мобильные кассы для курьеров и выездной торговли',
    description: 'Портативные кассы с аккумулятором для выездной торговли, курьерской доставки, ярмарок и мероприятий. Работают автономно от батареи.',
    models: [
      {
        name: 'Меркурий 115Ф',
        vendor: 'АСТОР ТРЕЙД',
        price: 'от 10 000 ₽',
        features: ['Аккумулятор, портативность', 'Bluetooth, USB', 'ФН 1.1М, ФФД 1.2', '58 мм лента'],
        best: 'Курьер, выездная торговля, ярмарка',
      },
      {
        name: 'Атол 25Ф',
        vendor: 'АТОЛ',
        price: 'от 13 500 ₽',
        features: ['Аккумулятор, лёгкий корпус', 'Wi-Fi, Bluetooth, USB', 'ФН 1.1М, ФФД 1.2', '58/80 мм лента'],
        best: 'Курьерская доставка, выездные продажи',
      },
      {
        name: 'Эвотор 5i (СТ51Ф)',
        vendor: 'ЭВОТОР',
        price: 'от 29 900 ₽',
        features: ['5" экран, Android', 'Встроенный 2D-сканер', '4G, Wi-Fi, NFC', 'Аккумулятор 4000 мАч'],
        best: 'Доставка продуктов, курьерская служба',
      },
      {
        name: 'Pioner-114Ф',
        vendor: 'Пионер инжиниринг',
        price: 'от 11 500 ₽',
        features: ['Аккумулятор, компактный', 'Bluetooth, USB', 'ФН 1.1М, ФФД 1.2', 'Низкая цена'],
        best: 'Бюджетная мобильная касса',
      },
    ],
  },
]

const COMPARISON_CRITERIA = [
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    title: 'Тип кассы',
    desc: 'Определитесь с форматом торговли. Для магазина с 1–2 местами достаточно смарт-терминала — он автономен, имеет экран и сканер. Для супермаркета с несколькими кассами подойдёт фискальный регистратор, подключённый к POS-компьютеру. Для курьеров нужна мобильная касса с аккумулятором.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Скорость печати',
    desc: 'В магазинах с высоким потоком покупателей (супермаркеты, фастфуд) важна скорость печати — не менее 200 мм/с. Для небольших точек достаточно 50–100 мм/с. Медленная печать создаёт очередь и снижает качество обслуживания клиентов.',
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: 'Оплата картой',
    desc: 'Если планируете принимать оплату банковской картой, проверьте, поддерживает ли касса подключение эквайрингового терминала или имеет встроенный NFC-модуль. Некоторые смарт-терминалы (Эвотор, Атол Sigma) поддерживают вставку SIM-карты эквайринга.',
  },
  {
    icon: <Truck className="w-5 h-5" />,
    title: 'Интеграция с учётом',
    desc: 'Если используете 1С, МойСклад или другую учётную систему — убедитесь, что касса поддерживает интеграцию. Смарт-терминалы на Android чаще всего имеют готовые приложения или API для подключения к облачным системам учёта. Фискальные регистраторы подключаются через драйверы.',
  },
  {
    icon: <Printer className="w-5 h-5" />,
    title: 'Ширина чековой ленты',
    desc: 'Стандартная ширина — 58 мм (компактные модели) и 80 мм (полноформатные). Чеки 80 мм удобнее для магазинов с длинным списком покупок — на них помещается больше информации. Для ярмарок и курьеров достаточно 58 мм.',
  },
]

const FAQS = [
  {
    q: 'Какое главное требование к кассе для маркировки?',
    a: 'Касса обязана поддерживать формат фискальных документов (ФФД) версии 1.2 и работать с фискальным накопителем ФН 1.1М или новее. Именно через ФФД 1.2 касса передаёт коды маркировки Data Matrix в ОФД, а оттуда — в Честный ЗНАК и ФНС. Без этого пробитие чека по маркированному товару невозможно. За использование кассы, не соответствующей требованиям, предусмотрены штрафы по ч. 4 ст. 14.5 КоАП РФ: для юрлиц — от 5 000 до 10 000 ₽, для должностных лиц — от 1 500 до 3 000 ₽.',
  },
  {
    q: 'Можно ли использовать старую кассу для маркировки?',
    a: 'В большинстве случаев старую кассу можно адаптировать под маркировку. Если модель аппаратно поддерживает ФФД 1.2 — достаточно обновить прошивку и заменить фискальный накопитель на ФН 1.1М. Многие модели Атол, Штрих-М, Меркурий и Эвотор поддерживают обновление ПО. Если же касса не поддерживает ФФД 1.2 даже после обновления — придётся заменить оборудование. Мы бесплатно проконсультируем по совместимости вашей кассы: <Link href="tel:+78124659457" className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#2a5080]">+7 (812) 465-94-57</Link>.',
  },
  {
    q: 'Нужен ли сканер штрихкодов для работы с маркировкой?',
    a: 'Да, 2D-сканер для считывания кодов Data Matrix обязателен. Обычный линейный (1D) сканер для штрихкодов EAN-13 не сможет прочитать квадратный код маркировки. Некоторые кассы имеют встроенный 2D-сканер (Эвотор 5, Эвотор 7.3, Атол Sigma 10, Меркурий 185), другие требуют подключения внешнего сканера через USB или Bluetooth. Внешний 2D-сканер стоит от 3 000 ₽.',
  },
  {
    q: 'Какая касса лучше для малого магазина?',
    a: 'Для магазина с 1–2 кассовыми местами и небольшим ассортиментом оптимальны смарт-терминалы: Эвотор 5 (от 24 900 ₽) — бюджетное решение с встроенным сканером, Атол Sigma 7 (от 22 000 ₽) — компактный с хорошим экраном, Эвотор 7.3 (от 39 900 ₽) — флагман с большим дисплеем и мощным процессором. Все три модели работают на Android, поддерживают магазин приложений и легко настраиваются под маркировку.',
  },
  {
    q: 'Сколько стоит касса с поддержкой маркировки?',
    a: 'Бюджетные модели (Меркурий 115Ф, Атол 25Ф) — от 10 000 ₽. Смарт-терминалы среднего сегмента (Эвотор 5, Атол Sigma 7) — от 15 000 до 25 000 ₽. Флагманские решения (Эвотор 7.3, Атол Sigma 10, Pirit 2Ф) — от 25 000 до 40 000 ₽. К стоимости кассы добавьте: фискальный накопитель (8 000–13 000 ₽ в зависимости от срока), настройку под маркировку (от 1 500 ₽) и при необходимости внешний 2D-сканер (от 3 000 ₽). Рассчитайте точную стоимость в нашем бесплатном <Link href="/" className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#2a5080]">калькуляторе маркировки</Link>.',
  },
  {
    q: 'Чем отличается фискальный регистратор от смарт-терминала?',
    a: 'Фискальный регистратор — это устройство только для печати чеков, его обязательно подключать к компьютеру или POS-системе с установленным кассовым ПО. Смарт-терминал — это полностью автономное устройство с сенсорным экраном, встроенным сканером и операционной системой (Android). Смарт-терминал не требует компьютера, удобнее в настройке и эксплуатации, но стоит дороже. Для одиночной точки продаж рекомендуем смарт-терминал, для нескольких касс в супермаркете — фискальные регистраторы к единой POS-системе.',
  },
]

// ─── Page Component ───────────────────────────────────────────────────────────

export default function KakuyuKassuPage() {
  return (
    <>
      {/* JsonLd */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-slate-400" aria-label="Хлебные крошки">
          <Link href="/" className="hover:text-[#1e3a5f] transition-colors">Главная</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-600">Какую кассу выбрать для маркировки</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight">
            Какую кассу выбрать для работы с маркировкой товаров
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Обзор моделей, обязательные требования ФФД 1.2, критерии выбора по типу бизнеса.
            Поможем подобрать кассу под ваши задачи и настроить маркировку — бесплатно проконсультируем
            по телефону.
          </p>
        </div>

        {/* ── Введение ──────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-4">
            При розничной продаже маркированных товаров — одежды, обуви, духов, молочной продукции,
            пива, бутилированной воды, табака и других категорий — онлайн-касса должна передавать
            сведения о каждой единице товара не только в налоговую через ОФД, но и в систему
            «Честный ЗНАК». Это значит, что далеко не каждая касса подойдёт.
          </p>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-4">
            С 1 февраля 2022 года формат фискальных документов (ФФД) версии 1.2 стал обязательным
            для работы с маркированными товарами (поправки в Федеральный закон № 54-ФЗ, внесённые
            Федеральным законом № 238-ФЗ от 26.07.2019). Если ваша касса не поддерживает ФФД 1.2 —
            она не сможет корректно пробивать чеки по маркированным товарам.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Штрафы за несоответствующую ККТ</p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Согласно ч. 4 ст. 14.5 КоАП РФ, за использование кассы, не отвечающей требованиям
                  законодательства (в том числе не поддерживающей ФФД 1.2): для юрлиц — штраф от 5 000
                  до 10 000 ₽, для должностных лиц — от 1 500 до 3 000 ₽.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Обязательные требования ───────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-2">
            Обязательные требования к кассе для маркировки
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Прежде чем выбирать модель, убедитесь, что касса соответствует четырём обязательным
            требованиям. Без любого из них работа с маркированными товарами невозможна.
          </p>
          <div className="space-y-4">
            {REQUIREMENTS.map((item, idx) => (
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

        {/* ── Кассы по категориям ──────────────────────────────────── */}
        {CASSES_BY_CATEGORY.map((cat, catIdx) => (
          <section key={catIdx} className="mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-2">
              {cat.category}
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
              {cat.description}
            </p>
            <div className="space-y-4">
              {cat.models.map((model, modelIdx) => (
                <div
                  key={modelIdx}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-[#1e3a5f]">{model.name}</h3>
                      <p className="text-xs text-slate-400">{model.vendor}</p>
                    </div>
                    <span className="text-lg font-extrabold text-[#e8a817] shrink-0">{model.price}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ul className="space-y-1.5">
                      {model.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 font-medium mb-1">Подходит для:</p>
                      <p className="text-sm text-slate-700">{model.best}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* ── Критерии выбора ───────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-2">
            Критерии выбора кассы для маркировки
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            Помимо обязательных технических требований, при выборе кассы учитывайте особенности вашего
            бизнеса. Правильно подобранная касса не только соответствует законодательству, но и
            ускоряет работу кассира, снижает количество ошибок и повышает качество обслуживания.
          </p>
          <div className="space-y-4">
            {COMPARISON_CRITERIA.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e8a817]/10 flex items-center justify-center text-[#e8a817] shrink-0">
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

        {/* ── Старая касса — что делать ─────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-2">
            У вас уже есть касса? Проверим совместимость
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-4">
            Если вы уже используете онлайн-кассу и не уверены, подходит ли она для маркировки — не
            спешите покупать новую. В большинстве случаев существующую кассу можно адаптировать:
          </p>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-sm font-extrabold text-[#e8a817] shrink-0">01</span>
                <span className="text-sm text-slate-600 leading-relaxed">
                  <strong className="text-[#1e3a5f]">Проверяем модель и прошивку.</strong> Уточняем,
                  поддерживает ли касса ФФД 1.2 аппаратно. Для этого достаточно назвать модель кассы
                  — мы проверим по реестру ФНС.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sm font-extrabold text-[#e8a817] shrink-0">02</span>
                <span className="text-sm text-slate-600 leading-relaxed">
                  <strong className="text-[#1e3a5f]">Обновляем ПО.</strong> Если модель поддерживает
                  ФФД 1.2, обновляем прошивку кассы до последней версии. На большинстве моделей Атол,
                  Штрих-М, Эвотор и Меркурий это делается за 15–30 минут.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sm font-extrabold text-[#e8a817] shrink-0">03</span>
                <span className="text-sm text-slate-600 leading-relaxed">
                  <strong className="text-[#1e3a5f]">Меняем фискальный накопитель.</strong> Если текущий
                  ФН не поддерживает ФФД 1.2 (старые модели ФН 1.0, ФН 1.1), устанавливаем новый
                  ФН 1.1М и перерегистрируем ККТ в ФНС.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sm font-extrabold text-[#e8a817] shrink-0">04</span>
                <span className="text-sm text-slate-600 leading-relaxed">
                  <strong className="text-[#1e3a5f]">Настраиваем маркировку.</strong> Подключаем ЭДО,
                  регистрируем в Честном ЗНАКе, устанавливаем ТС ПИоТ, тестируем пробитие чека с
                  кодом маркировки.{' '}
                  <Link href="/nastroyka-kassy-markirovka" className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#2a5080]">
                    Подробнее о настройке →
                  </Link>
                </span>
              </li>
            </ul>
          </div>
          <p className="mt-4 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
            Если касса полностью устарела и не поддерживает ФФД 1.2 даже после обновления — поможем
            подобрать оптимальную замену с учётом вашего бюджета и типа бизнеса.
          </p>
        </section>

        {/* ── КОНСУЛЬТАЦИЯ ПО ВАШЕЙ КАССЕ — подбор ────────────────── */
        <KassaConsultWidget />

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-6">
            Часто задаваемые вопросы
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                id={`faq-${idx}`}
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
            Нужна помощь с выбором или настройкой кассы?
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-4 max-w-xl mx-auto">
            Бесплатно проконсультируем — перезвоним за 15 минут. Проверим совместимость вашей кассы,
            подберём оптимальную модель и рассчитаем стоимость настройки.
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
              href="/nastroyka-kassy-markirovka"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl transition-colors"
            >
              <Settings className="w-5 h-5" />
              Настройка кассы под ключ
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/50">
            <Link href="/podklyuchenie-chestnyy-znak" className="underline underline-offset-2 hover:text-white/80 transition-colors">
              Подключение Честного ЗНАК
            </Link>
            <span>|</span>
            <Link href="/integraciya-1c" className="underline underline-offset-2 hover:text-white/80 transition-colors">
              Интеграция с 1С
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

// ═══════════════════════════════════════════════════════════════════════════
// ВИДЖЕТ «Консультация по вашей кассе» — подбор кассы за 3 шага
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
  'shop_smart_low':    { models: [{ name: 'Эвотор 5 (СТ5Ф)', price: 'от 24 900 ₽', vendor: 'ЭВОТОР', best: 'Малый магазин, павильон' }, { name: 'Меркурий 115Ф', price: 'от 10 000 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Магазин с ограниченным бюджетом' }], extra: 'Для малого магазина рекомендуем смарт-терминал — автономный, со встроенным сканером. При ограниченном бюджете рассмотрим Меркурий 115Ф + внешний 2D-сканер.' },
  'shop_smart_mid':    { models: [{ name: 'Атол Sigma 7', price: 'от 22 000 ₽', vendor: 'АТОЛ', best: 'Компактная, с хорошим экраном' }, { name: 'Меркурий 185Ф', price: 'от 26 000 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Встроенный сканер, Wi-Fi' }], extra: 'Обе модели имеют встроенный 2D-сканер и поддерживают ФФД 1.2. Отличный выбор для магазина с одним кассовым местом.' },
  'shop_smart_high':   { models: [{ name: 'Атол Sigma 10', price: 'от 32 000 ₽', vendor: 'АТОЛ', best: 'Большой экран, экосистема АТОЛ' }, { name: 'Эвотор 7.3 (СТ3Ф)', price: 'от 39 900 ₽', vendor: 'ЭВОТОР', best: 'Флагман, 8-ядерный процессор' }], extra: 'Флагманские решения для магазина с большим ассортиментом. Мощный процессор, большой экран, все интерфейсы связи.' },
  'shop_smart_any':    { models: [{ name: 'Атол Sigma 10', price: 'от 32 000 ₽', vendor: 'АТОЛ', best: 'Лучшая в классе' }, { name: 'Эвотор 7.3 (СТ3Ф)', price: 'от 39 900 ₽', vendor: 'ЭВОТОР', best: 'Максимальные возможности' }], extra: 'Рекомендуем лучшие модели в классе смарт-терминалов. Обе поддерживают все виды маркировки и имеют встроенный 2D-сканер.' },
  'shop_fiscal_low':   { models: [{ name: 'Элвес-ФР-Ф', price: 'от 11 000 ₽', vendor: 'НТЦ Измеритель', best: 'Компактный, Bluetooth' }, { name: 'Pioner-114Ф', price: 'от 11 500 ₽', vendor: 'Пионер', best: 'Бюджетный вариант' }], extra: 'Фискальный регистратор + внешний 2D-сканер (от 3 000 ₽). Подключается к вашему компьютеру или POS-системе.' },
  'shop_fiscal_mid':   { models: [{ name: 'Атол 30Ф', price: 'от 16 000 ₽', vendor: 'АТОЛ', best: 'Автоотрезчик, Wi-Fi' }, { name: 'Штрих-М-01Ф', price: 'от 13 000 ₽', vendor: 'ШТРИХ-М', best: 'Надёжная конструкция' }], extra: 'Проверенные фискальные регистраторы для POS-системы. Не забудьте про внешний 2D-сканер для считывания кодов маркировки.' },
  'cafe_smart_mid':    { models: [{ name: 'Эвотор 5 (СТ5Ф)', price: 'от 24 900 ₽', vendor: 'ЭВОТОР', best: 'Кофейня, фастфуд' }, { name: 'Атол Sigma 7', price: 'от 22 000 ₽', vendor: 'АТОЛ', best: 'Ресторан, кафе' }], extra: 'Для общепита рекомендуем смарт-терминал с Wi-Fi и встроенным сканером. Удобное управление меню и учёт ингредиентов через приложения.' },
  'cafe_smart_high':   { models: [{ name: 'Эвотор 7.3 (СТ3Ф)', price: 'от 39 900 ₽', vendor: 'ЭВОТОР', best: 'Ресторан с большим меню' }], extra: 'Большой экран удобен для работы с меню. Встроенный 2D-сканер для маркированной продукции (пиво, вода).' },
  'pharma_smart_mid':  { models: [{ name: 'Атол Sigma 7', price: 'от 22 000 ₽', vendor: 'АТОЛ', best: 'Аптека' }, { name: 'Эвотор 7.3 (СТ3Ф)', price: 'от 39 900 ₽', vendor: 'ЭВОТОР', best: 'Аптека с широким ассортиментом' }], extra: 'Для аптеки нужен смарт-терминал с интеграцией в учётную систему (1С:Аптека, еФарма). Поддержка маркировки лекарств обязательна.' },
  'courier_mobile_low': { models: [{ name: 'Меркурий 115Ф', price: 'от 10 000 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Курьер, доставка' }, { name: 'Pioner-114Ф', price: 'от 11 500 ₽', vendor: 'Пионер', best: 'Бюджетная мобильная' }], extra: 'Компактные мобильные кассы с аккумулятором. Bluetooth для связи со смартфоном или планшоном курьера.' },
  'courier_mobile_mid': { models: [{ name: 'Эвотор 5i (СТ51Ф)', price: 'от 29 900 ₽', vendor: 'ЭВОТОР', best: 'Доставка продуктов' }, { name: 'Атол 25Ф', price: 'от 13 500 ₽', vendor: 'АТОЛ', best: 'Универсальная мобильная' }], extra: 'Эвотор 5i — лучший выбор для курьера: Android, встроенный 2D-сканер, 4G, аккумулятор 4000 мАч.' },
  'market_mobile_low': { models: [{ name: 'Меркурий 115Ф', price: 'от 10 000 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Ярмарка' }, { name: 'Pioner-114Ф', price: 'от 11 500 ₽', vendor: 'Пионер', best: 'Выездная торговля' }], extra: 'Для ярмарок достаточно лёгкой мобильной кассы с аккумулятором. Работает автономно весь день.' },
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
        { name: 'Атол Sigma 7', price: 'от 22 000 ₽', vendor: 'АТОЛ', best: 'Компактный, для большинства задач' },
        { name: 'Меркурий 115Ф', price: 'от 10 000 ₽', vendor: 'АСТОР ТРЕЙД', best: 'Мобильный, бюджетный' },
      ],
      extra: 'Ответьте на первые два вопроса для более точной рекомендации. А пока — три универсальные модели, которые подойдут для большинства задач маркировки.',
    }
  }
  if (budget === 'low') {
    return all.find(r => r.models.some(m => parseInt(m.price.replace(/[^0-9]/g, '')) < 20000)) || all[0]
  }
  return all[Math.floor(all.length / 2)] || all[0]
}

function KassaConsultWidget() {
  const [step, setStep] = useState(0) // 0=intro, 1=biz, 2=format, 3=budget, 4=results, 5=form
  const [bizType, setBizType] = useState('')
  const [kassaFormat, setKassaFormat] = useState('')
  const [budget, setBudget] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [sendOk, setSendOk] = useState(false)

  const rec = step >= 4 ? (getRecommendations(bizType, kassaFormat, budget) || getGenericRecommendations(kassaFormat, budget)) : null

  const handleSend = async () => {
    setSending(true)
    try {
      const modelsStr = rec ? rec.models.map(m => `${m.name} (${m.price})`).join(', ') : 'Не определены'
      await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `🖥 Подбор кассы: ${clientName.trim()} | ${clientPhone.trim()}`,
          html: `🖥 ПОДБОР КАССЫ\n👤 ${clientName.trim()}\n📞 ${clientPhone.trim()}\n\nТип бизнеса: ${bizType}\nФормат: ${kassaFormat}\nБюджет: ${budget}\n\nРекомендации:\n${modelsStr}`,
        }),
      })
      await fetch('/api/log-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNum: `КАССА-${Date.now().toString().slice(-6)}`,
          clientName: clientName.trim(),
          phone: clientPhone.trim(),
          kkmType: rec ? rec.models[0]?.name || '' : '',
          kkmCondition: '',
          services: ['Консультация по подбору кассы'],
          total: 0,
          comment: `Подбор кассы | Тип: ${bizType} | Формат: ${kassaFormat} | Бюджет: ${budget} | Рекомендация: ${modelsStr}`,
        }),
      })
      setSendOk(true)
      setStep(5)
    } catch {
      // silent
    } finally {
      setSending(false)
    }
  }

  const reset = () => { setStep(0); setBizType(''); setKassaFormat(''); setBudget(''); setClientName(''); setClientPhone(''); setSendOk(false) }

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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 text-center anim-fade-in-up">
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 anim-fade-in-up">
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
                <span className="text-xl">{b.icon}</span> {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Format ─────────────────────────── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 anim-fade-in-up">
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 anim-fade-in-up">
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
        <div className="space-y-4 anim-fade-in-up">
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
                  disabled={!clientName.trim() || !clientPhone.trim() || sending}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${
                    clientName.trim() && clientPhone.trim() && !sending
                      ? 'bg-[#e8a817] hover:bg-[#d49a12] text-white shadow-lg shadow-[#e8a817]/25'
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`
                >
                  {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Отправляем...</> : <><Send className="w-4 h-4" /> Получить консультацию</>}
                </button>
              </div>
              <a href="tel:+78124659457" className="block text-center text-xs text-slate-400 hover:text-[#1e3a5f] transition-colors mt-1">
                Или позвоните: +7 (812) 465-94-57
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 5: Sent ────────────────────────────── */}
      {step === 5 && sendOk && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 anim-fade-in-up text-center">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-emerald-800 mb-1">Заявка отправлена</h3>
          <p className="text-sm text-emerald-700 leading-relaxed mb-4">
            Спасибо, {clientName.trim()}! Специалист свяжется с вами по номеру {clientPhone.trim()} для бесплатной консультации по подбору кассы.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+78124659457"
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
