// ============================================================================
// JSON-LD СТРУКТУРИРОВАННЫЕ ДАННЫЕ
// ============================================================================

const SITE_URL = 'https://tellurmarkirovka.vercel.app'
const MAIN_SITE = 'https://tellur.spb.ru'

// ============================================================================
// Organization — корневая сущность
// ============================================================================
const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'ООО «Теллур-Интех»',
  alternateName: ['Теллур-Интех', 'ТЕЛЛУР', 'Теллур'],
  url: MAIN_SITE,
  logo: `${SITE_URL}/logo.webp`,
  image: `${SITE_URL}/logo.webp`,
  description: 'Сервисный центр кассового оборудования в Санкт-Петербурге с 1995 года. Подключение маркировки товаров под ключ, обслуживание ККТ, регистрация в ФНС, настройка Честного ЗНАК, ЭДО, ТС ПИоТ. Все районы Санкт-Петербурга, Ленинградская область.',
  foundingDate: '1995',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Константина Заслонова д. 32-34, лит. А, пом. 1Н',
    addressLocality: 'Санкт-Петербург',
    addressRegion: 'Ленинградская область',
    postalCode: '192148',
    addressCountry: 'RU',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+7-812-321-06-06',
      contactType: 'customer service',
      areaServed: { '@type': 'City', name: 'Санкт-Петербург' },
      availableLanguage: 'Russian',
    },
    {
      '@type': 'ContactPoint',
      telephone: '+7-812-465-94-57',
      contactType: 'customer service',
      areaServed: { '@type': 'City', name: 'Пушкин' },
      availableLanguage: 'Russian',
    },
    {
      '@type': 'ContactPoint',
      telephone: '+7-813-714-08-95',
      contactType: 'customer service',
      areaServed: { '@type': 'City', name: 'Гатчина' },
      availableLanguage: 'Russian',
    },
  ],
  sameAs: [
    MAIN_SITE,
    `${MAIN_SITE}/next/about-us/`,
  ],
}

// ============================================================================
// WebSite — для sitelinks в Google
// ============================================================================
const webSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Калькулятор маркировки — Теллур-Интех',
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'ru',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

// ============================================================================
// LocalBusiness — для локального поиска в Яндексе и Google
// ============================================================================
const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#localbusiness`,
  name: 'Теллур-Интех — Сервисный центр кассового оборудования',
  description: 'Подключение маркировки товаров под ключ в Санкт-Петербурге. Центральный офис: ул. Заслонова 32-34 (м. Обводный канал). Все районы СПб, Ленинградская область. Регистрация ККТ в ФНС, настройка Честного ЗНАК, ЭДО, ТС ПИоТ, ОФД. Удалённая настройка. Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI.',
  url: SITE_URL,
  image: `${SITE_URL}/logo.webp`,
  logo: `${SITE_URL}/logo.webp`,
  priceRange: '$$',
  currenciesAccepted: 'RUB',
  paymentAccepted: 'Наличные, Безналичный расчёт',
  telephone: ['+7-812-321-06-06', '+7-812-465-94-57', '+7-813-714-08-95', '+7-921-932-41-63', '+7-921-903-43-26'],
  email: ['tellur@tellur.spb.ru', 'push@tellur.spb.ru', 'gtn@tellur.spb.ru'],
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Константина Заслонова д. 32-34, лит. А, пом. 1Н',
      addressLocality: 'Санкт-Петербург',
      addressRegion: 'Ленинградская область',
      postalCode: '192148',
      addressCountry: 'RU',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Октябрьский бульвар д. 50/30',
      addressLocality: 'Пушкин',
      addressRegion: 'Ленинградская область',
      addressCountry: 'RU',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Хохлова д. 6, пом. 2',
      addressLocality: 'Гатчина',
      addressRegion: 'Ленинградская область',
      addressCountry: 'RU',
    },
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '59.8736',
    longitude: '30.3264',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Санкт-Петербург' },
    { '@type': 'AdministrativeArea', name: 'Адмиралтейский район' },
    { '@type': 'AdministrativeArea', name: 'Василеостровский район' },
    { '@type': 'AdministrativeArea', name: 'Выборгский район' },
    { '@type': 'AdministrativeArea', name: 'Калининский район' },
    { '@type': 'AdministrativeArea', name: 'Кировский район' },
    { '@type': 'AdministrativeArea', name: 'Красногвардейский район' },
    { '@type': 'AdministrativeArea', name: 'Красносельский район' },
    { '@type': 'AdministrativeArea', name: 'Кронштадтский район' },
    { '@type': 'AdministrativeArea', name: 'Курортный район' },
    { '@type': 'AdministrativeArea', name: 'Московский район' },
    { '@type': 'AdministrativeArea', name: 'Невский район' },
    { '@type': 'AdministrativeArea', name: 'Петроградский район' },
    { '@type': 'AdministrativeArea', name: 'Приморский район' },
    { '@type': 'AdministrativeArea', name: 'Пушкинский район' },
    { '@type': 'AdministrativeArea', name: 'Фрунзенский район' },
    { '@type': 'AdministrativeArea', name: 'Центральный район' },
    { '@type': 'City', name: 'Пушкин' },
    { '@type': 'City', name: 'Гатчина' },
    { '@type': 'City', name: 'Павловск' },
    { '@type': 'City', name: 'Колпино' },
    { '@type': 'City', name: 'Красное Село' },
    { '@type': 'City', name: 'Ломоносов' },
    { '@type': 'City', name: 'Петергоф' },
    { '@type': 'City', name: 'Всеволожск' },
    { '@type': 'City', name: 'Выборг' },
    { '@type': 'City', name: 'Тосно' },
    { '@type': 'City', name: 'Кировск' },
    { '@type': 'City', name: 'Сертолово' },
    { '@type': 'City', name: 'Кудрово' },
    { '@type': 'City', name: 'Мурино' },
    { '@type': 'City', name: 'Шушары' },
    { '@type': 'City', name: 'Парголово' },
    { '@type': 'City', name: 'Зеленогорск' },
    { '@type': 'City', name: 'Сестрорецк' },
    { '@type': 'City', name: 'Кронштадт' },
    { '@type': 'AdministrativeArea', name: 'Ленинградская область' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '127',
    bestRating: '5',
    worstRating: '1',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Услуги маркировки и обслуживания касс',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Подключение маркировки под ключ',
          description: 'Полная настройка маркировки: ЭДО, Честный ЗНАК, ТС ПИоТ, ФНС, касса. Связываем 6 систем в единую цепочку.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Регистрация ККТ в ФНС',
          description: 'Регистрация контрольно-кассовой техники в налоговой инспекции. Новая регистрация и перерегистрация.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Перерегистрация кассы с признаками маркировки',
          description: 'Перерегистрация ККТ в ФНС для работы с маркированными товарами и подакцизной продукцией. Смена формата ФФД на 1.2.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Настройка ЭДО',
          description: 'Подключение электронного документооборота для приёмки маркированных товаров от поставщиков. Контур.Диадок, СБИС.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Подключение ОФД',
          description: 'Подключение к оператору фискальных данных (ОФД ТАКСКОМ) по партнёрской цене — на 500-1000 руб. дешевле.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Замена фискального накопителя (ФН)',
          description: 'Замена ФН и перерегистрация кассы в ФНС. ФН 15 мес. и 36 мес.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Обновление прошивки кассы',
          description: 'Обновление программного обеспечения кассы для поддержки ФФД 1.2 и маркировки.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Обучение работе с кассой',
          description: 'Обучение сотрудников работе с кассой, маркировкой, ЭДО и Честным ЗНАКом.',
        },
      },
    ],
  },
}

// ============================================================================
// WebApplication — калькулятор
// ============================================================================
const webApplication = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${SITE_URL}/#webapp`,
  name: 'Калькулятор маркировки',
  description: 'Бесплатный онлайн-калькулятор стоимости подключения маркировки в Санкт-Петербурге. Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI. Расчёт за 2 минуты. Санкт-Петербург, Ленинградская область.',
  url: SITE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  browserRequirements: 'Требуется JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  author: { '@id': `${SITE_URL}/#organization` },
  publisher: { '@id': `${SITE_URL}/#organization` },
  featureList: [
    'Расчёт стоимости маркировки',
    'Выбор бренда кассы',
    'Выбор состояния кассы (новая, б/у, текущая)',
    'Подбор необходимых услуг',
    'Пошаговый расчёт',
    'Печать сметы',
  ],
}

// ============================================================================
// FAQPage — расширенный список вопросов и ответов
// ============================================================================
const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Что такое подключение маркировки под ключ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Подключение маркировки под ключ — это комплексная настройка всех систем, необходимых для продажи маркированных товаров: ЭДО (электронный документооборот), Честный ЗНАК (государственный реестр маркировки), касса, ТС ПИоТ (Единый Сервисный Модуль), а также подача заявления в ФНС со сменой формата ФФД. Мы связываем 6 различных систем в единую цепочку — от приёмки товара через ЭДО до пробития чека на кассе.',
      },
    },
    {
      '@type': 'Question',
      name: 'Сколько стоит подключение маркировки?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Стоимость подключения маркировки зависит от состояния кассы (новая, б/у или действующая), бренда (Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI) и набора необходимых услуг. Используйте наш бесплатный калькулятор на сайте для точного расчёта — это занимает не более 2 минут. Базовая настройка маркировки начинается от 3 000 рублей.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что такое ТС ПИоТ и обязательно ли оно?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ТС ПИоТ (Тренажёро-Сервер Программно-Информационный Оператор Торговли) — обязательный программный модуль, обеспечивающий защищённое взаимодействие кассы с системой Честный ЗНАК. Без него касса не сможет пробивать чеки по маркированным товарам. Лицензия приобретается на официальном портале ao-esp.ru. Обязательно для всех касс, работающих с маркированными товарами.',
      },
    },
    {
      '@type': 'Question',
      name: 'Для каких касс вы настраиваете маркировку?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Мы настраиваем маркировку для всех основных брендов кассового оборудования: Меркурий, Атол (включая линейку Сигма), Эвотор, Штрих-М, Пионер, AQSI. Обслуживаем как фискальные регистраторы, так и смарт-терминалы. Работаем с кассами в любом состоянии — новые, б/у и действующие.',
      },
    },
    {
      '@type': 'Question',
      name: 'В каких городах вы работаете?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Мы работаем в Санкт-Петербурге и Ленинградской области. Три офиса: в центре Санкт-Петербурга (ул. Заслонова 32-34), в Пушкине (Октябрьский бульвар 50/30) и в Гатчине (ул. Хохлова 6). Клиенты привозят кассы к нам — настройка выполняется на месте в день визита. Также доступна удалённая настройка для некоторых услуг — нужен компьютер с ЭЦП.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что такое ОФД и зачем он нужен?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ОФД (оператор фискальных данных) — организация, которая принимает, хранит и передаёт в налоговую все фискальные данные с вашей кассы. Без ОФД касса не работает по закону (ФЗ-54). Мы — официальные партнёры ОФД ТАКСКОМ и предлагаем подключение по партнёрской цене — на 500-1000 рублей дешевле, чем на сайте напрямую.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что такое фискальный накопитель (ФН) и когда его менять?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ФН (фискальный накопитель) — чип внутри кассы, который хранит все пробитые чеки и передаёт данные в налоговую через ОФД. Срок службы: 15 месяцев (общая торговля) или 36 месяцев (подакцизные товары). Когда срок заканчивается — касса блокируется. Замена ФН обязательна и требует перерегистрации кассы в ФНС. Цена зависит от типа и производителя.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что такое ЭЦП и нужна ли она для маркировки?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ЭЦП (электронная цифровая подпись) — электронная подпись, хранящаяся на специальной флэшке (Рутокен, JaCarta). Без неё невозможно войти в ФНС, Честный ЗНАК, подписывать документы и принимать накладные от поставщиков через ЭДО. ЭЦП — обязательное условие для подключения маркировки. Оформляется в аккредитованном удостоверяющем центре.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что такое ЭДО и как оно связано с маркировкой?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ЭДО (электронный документооборот) — система обмена электронными накладными и документами между поставщиками и покупателями. Для работы с маркированными товарами необходимо принимать товары через ЭДО, чтобы коды Data Matrix попадали в вашу учётную систему Честного ЗНАК. Мы подключаем Контур.Диадок, СБИС и другие операторы ЭДО.',
      },
    },
    {
      '@type': 'Question',
      name: 'Сколько времени занимает подключение маркировки?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Полная настройка маркировки под ключ занимает от 1 до 3 рабочих дней. Регистрация ККТ в ФНС — 1-2 дня. Настройка ЭДО, Честный ЗНАК, ТС ПИоТ и кассы — 1 день при наличии ЭЦП. Для б/у касс может потребоваться обновление прошивки — ещё 1 день. Мы работаем быстро и гарантируем результат.',
      },
    },
    {
      '@type': 'Question',
      name: 'Какие товары подлежат обязательной маркировке в 2025-2026 годах?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Обязательная маркировка действует для: сигарет и табачной продукции, обуви, одежды и текстиля, бутилированной воды, пива и слабого алкоголя, молочной продукции, фотоплёнки, шин, лекарств, парфюмерии, антисептиков, витаминов, подгузников, мотоциклов и велосипедов. С 2025-2026 годов перечень расширяется. Проверить актуальный список можно на сайте честныйзнак.рф.',
      },
    },
    {
      '@type': 'Question',
      name: 'Чем отличается подключение маркировки для новой кассы от старой?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Для новой кассы: полная регистрация ККТ в ФНС, подключение ОФД, установка ФН, настройка маркировки с нуля (ЭДО, Честный ЗНАК, ТС ПИоТ). Для действующей кассы: добавление признаков маркировки, перерегистрация в ФНС, настройка связей с Честным ЗНАКом. Для б/у касс: дополнительно обновление прошивки, оформление лицензии, замена ФН. Укажите состояние кассы в калькуляторе для точного расчёта.',
      },
    },
  ],
}

// ============================================================================
// BreadcrumbList — исправленный
// ============================================================================
const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Главная',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Калькулятор маркировки',
    },
  ],
}

// ============================================================================
// Service — основная услуга (для расширенных сниппетов)
// ============================================================================
const markingService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${SITE_URL}/#service`,
  name: 'Подключение маркировки товаров под ключ',
  description: 'Комплексное подключение маркировки товаров в Санкт-Петербурге для розничных точек продаж: настройка ЭДО, Честного ЗНАК, ТС ПИоТ, регистрация ККТ в ФНС, подключение ОФД. Все районы Санкт-Петербурга, Ленинградская область. Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI.',
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Ленинградская область',
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Россия' },
  },
  serviceType: 'Подключение маркировки товаров',
  category: 'Кассовое оборудование',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Виды услуг маркировки',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Подключение маркировки под ключ — новая касса' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Подключение маркировки — действующая касса' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Подключение маркировки — б/у касса' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Регистрация ККТ в ФНС' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Перерегистрация ККТ' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Настройка ЭДО' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Подключение ОФД' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Замена фискального накопителя' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Обучение работе с кассой' } },
    ],
  },
}

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(markingService) }}
      />
    </>
  )
}
