// ============================================================================
// JSON-LD СТРУКТУРИРОВАННЫЕ ДАННЫЕ
// ============================================================================

const SITE_URL = 'https://tellurmarkirovka.vercel.app'

// LocalBusiness — для локального поиска в Яндексе и Google
const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Теллур-Интех',
  description: 'Сервисный центр кассового оборудования в Санкт-Петербурге. Подключение маркировки, регистрация ККТ, настройка Честного ЗНАК, ЭДО, ТС ПИоТ. Обслуживание касс Меркурий, Атол, Сигма, Штрих-М, Пионер, Эвотор, AQSI.',
  url: SITE_URL,
  telephone: ['+7-812-465-94-57', '+7-812-451-80-18', '+7-812-321-06-06'],
  email: 'push@tellur.spb.ru',
  image: `${SITE_URL}/logo.webp`,
  logo: `${SITE_URL}/logo.webp`,
  priceRange: '$$',
  address: [
    {
      '@type': 'PostalAddress',
      addressLocality: 'Санкт-Петербург',
      addressRegion: 'Ленинградская область',
      addressCountry: 'RU',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Санкт-Петербург' },
    { '@type': 'City', name: 'Пушкин' },
    { '@type': 'City', name: 'Гатчина' },
    { '@type': 'AdministrativeArea', name: 'Ленинградская область' },
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '59.7146',
    longitude: '30.3898',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
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
          description: 'Полная настройка маркировки: ЭДО, Честный ЗНАК, ТС ПИоТ, ФНС, касса',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Регистрация ККТ в ФНС',
          description: 'Регистрация контрольно-кассовой техники в налоговой инспекции',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Перерегистрация кассы с признаками маркировки',
          description: 'Перерегистрация ККТ в ФНС для работы с маркированными товарами и подакцизной продукцией',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Подключение ОФД',
          description: 'Подключение к оператору фискальных данных по партнёрской цене',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Замена фискального накопителя (ФН)',
          description: 'Замена ФН и перерегистрация кассы',
        },
      },
    ],
  },
}

// WebApplication — калькулятор
const webApplication = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Калькулятор маркировки',
  description: 'Бесплатный онлайн-калькулятор стоимости подключения маркировки для кассового оборудования. Расчёт за 2 минуты.',
  url: SITE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  author: {
    '@type': 'Organization',
    name: 'Теллур-Интех',
    url: SITE_URL,
  },
}

// FAQPage — вопросы и ответы из подсказок калькулятора
const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
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
        text: 'ТС ПИоТ (Единый Сервисный Модуль) — обязательный программный модуль, обеспечивающий защищённое взаимодействие кассы с системой Честный ЗНАК. Без него касса не сможет пробивать чеки по маркированным товарам. С 1 июля 2026 года продажа маркированных товаров без ТС ПИоТ запрещена статьёй 15.12 КоАП РФ. Лицензия приобретается на официальном портале ao-esp.ru.',
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
      name: 'В каких районах вы работаете?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Мы работаем в Санкт-Петербурге и Ленинградской области. Основные точки присутствия: Пушкин, Гатчина, центр Санкт-Петербурга. Также выезжаем в другие районы Ленинградской области. Возможна удалённая настройка для некоторых услуг.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что такое ОФД и зачем он нужен?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ОФД (оператор фискальных данных) — организация, которая принимает, хранит и передаёт в налоговую все фискальные данные с вашей кассы. Без ОФД касса не работает по закону. Мы — официальные партнёры ОФД ТАКСКОМ и предлагаем подключение по партнёрской цене — на 500-1000 рублей дешевле, чем на сайте напрямую.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что такое фискальный накопитель (ФН) и когда его менять?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ФН (фискальный накопитель) — чип внутри кассы, который хранит все пробитые чеки и передаёт данные в налоговую. Срок службы: 15 месяцев (общая торговля) или 36 месяцев (подакцизные товары). Когда срок заканчивается — касса блокируется. Замена ФН обязательна и требует перерегистрации кассы в ФНС.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что такое ЭЦП и нужна ли она для маркировки?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ЭЦП (электронная цифровая подпись) — это электронная подпись, хранящаяся на специальной флэшке (Рутокен, JaCarta). Без неё невозможно войти в ФНС, Честный ЗНАК, подписывать документы и принимать накладные от поставщиков. ЭЦП — обязательное условие для подключения маркировки.',
      },
    },
  ],
}

// Organization
const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ООО "Теллур-Интех"',
  alternateName: 'Теллур-Интех',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  description: 'Сервисный центр кассового оборудования в Санкт-Петербурге и Ленинградской области. Подключение маркировки, обслуживание ККТ, регистрация в ФНС.',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+7-812-465-94-57',
      contactType: 'customer service',
      areaServed: 'RU',
      availableLanguage: 'Russian',
    },
    {
      '@type': 'ContactPoint',
      telephone: '+7-812-451-80-18',
      contactType: 'customer service',
      areaServed: 'RU',
      availableLanguage: 'Russian',
    },
    {
      '@type': 'ContactPoint',
      telephone: '+7-812-321-06-06',
      contactType: 'customer service',
      areaServed: 'RU',
      availableLanguage: 'Russian',
    },
  ],
  sameAs: [],
}

// BreadcrumbList
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
      item: SITE_URL,
    },
  ],
}

export function JsonLd() {
  return (
    <>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  )
}
