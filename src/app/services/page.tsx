// ============================================================================
// Услуги — наши услуги по маркировке и обслуживанию касс
// ============================================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { Wrench, FileText, ShieldCheck, GraduationCap, Tag, Settings, Phone, Calculator, CheckCircle2, ArrowLeftRight, Cog } from 'lucide-react'
import { OpenChatButton } from '@/components/OpenChatButton'
import { Breadcrumbs } from '@/components/Breadcrumbs'

const SITE_URL = 'https://tellurmarkirovka.vercel.app'

export const metadata: Metadata = {
  title: 'Услуги по маркировке товаров и обслуживанию касс — Теллур-Интех',
  description: 'Полный перечень услуг: подключение маркировки под ключ, регистрация ККТ, настройка ЭДО, Честный ЗНАК, ТС ПИоТ, ОФД, замена ФН, обучение. Санкт-Петербург, Ленинградская область.',
  keywords: ['услуги маркировка', 'подключение маркировки под ключ', 'регистрация ккт фнс', 'настройка эдо', 'подключение офд', 'замена фискального накопителя', 'обучение касса', 'ремонт касс спб'],
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: 'Услуги — Теллур-Интех',
    description: 'Подключение маркировки под ключ, обслуживание касс, ЭДО, Честный ЗНАК.',
    url: `${SITE_URL}/services`,
    siteName: 'Теллур-Интех',
    locale: 'ru_RU',
    type: 'website',
  },
}

const SERVICES = [
  {
    icon: <Tag className="w-6 h-6" />,
    title: 'Подключение маркировки под ключ',
    desc: 'Комплексная настройка всех систем для работы с маркированными товарами: ЭДО, Честный ЗНАК, ТС ПИоТ, регистрация ККТ в ФНС, подключение ОФД. Связываем 6 систем в единую цепочку — от приёмки товара до пробития чека.',
    price: 'от 1 500 ₽',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Регистрация ККТ в ФНС',
    desc: 'Оформление карточки регистрации контрольно-кассовой техники в налоговой инспекции. Подача заявления, настройка параметров фискализации, подключение ОФД. Для действующих касс — перерегистрация с добавлением признаков маркировки и смена ФФД на 1.2.',
    price: 'включено в маркировку',
  },
  {
    icon: <ArrowLeftRight className="w-6 h-6" />,
    title: 'Настройка ЭДО',
    desc: 'Подключение электронного документооборота для обмена накладными с поставщиками маркированных товаров. Работаем с операторами: Контур.Диадок, СБИС, Такском. ЭДО необходимо для приёмки товаров — без него коды маркировки не попадут в Честный ЗНАК.',
    price: 'включено в маркировку',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Подключение ОФД',
    desc: 'Подключение к оператору фискальных данных. Мы — официальные партнёры ОФД ТАКСКОМ. Договор на 15 или 36 месяцев по цене ниже, чем на сайте напрямую. Экономия от 500 до 1 000 ₽.',
    price: 'от 3 000 ₽/15 мес.',
  },
  {
    icon: <Cog className="w-6 h-6" />,
    title: 'Замена фискального накопителя (ФН)',
    desc: 'Замена истёкшего ФН с перерегистрацией кассы в ФНС. Срок службы: 15 месяцев (общая торговля) или 36 месяцев (подакцизные товары). При истечении срока касса блокируется. Подберём подходящий ФН и оформим замену.',
    price: 'цена уточняется',
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: 'Обновление прошивки кассы',
    desc: 'Обновление программного обеспечения кассы для поддержки ФФД 1.2 и маркировки. Обязательно для старых касс, не поддерживающих новый формат фискальных документов. Без обновления маркировка не будет работать.',
    price: 'от 1 500 ₽',
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: 'Обучение работе с кассой',
    desc: 'Практическое обучение сотрудников работе с кассовым оборудованием, сканированию кодов Data Matrix, приёмке маркированных товаров через ЭДО, порядку пробития чека с признаками маркировки.',
    price: 'от 1 500 ₽/час',
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: 'Ремонт кассового оборудования',
    desc: 'Ремонт контрольно-кассовой техники всех основных брендов: Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI. Диагностика, замена комплектующих, обновление ПО, настройка. Оригинальные запчасти, гарантия.',
    price: 'диагностика бесплатно',
  },
]

export default function ServicesPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Услуги' }]} />

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight">
          Наши услуги
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
          Полный спектр услуг по маркировке товаров и обслуживанию кассового оборудования
          в Санкт-Петербурге и Ленинградской области
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {SERVICES.map((service, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-[#1e3a5f]/20 transition-all duration-300"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center text-[#1e3a5f] shrink-0">
                {service.icon}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[#1e3a5f] leading-snug">{service.title}</h2>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-3">{service.desc}</p>
            <p className="text-sm font-bold text-[#e8a817]">{service.price}</p>
          </div>
        ))}
      </div>

      {/* Conversion CTA — Настройка маркировки под ключ */}
      <div className="mt-8 sm:mt-10 rounded-2xl p-6 sm:p-8 text-center" style={{ backgroundColor: '#1e3a5f' }}>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          Настройка маркировки под ключ
        </h2>
        <p className="text-white/70 text-sm sm:text-base mb-6">
          от 1 дня · от 5 000 ₽ · без остановки работы
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle2 className="w-5 h-5 text-[#e8a817] shrink-0" />
            <span className="text-white text-sm font-medium">Подключим к Честный ЗНАК</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle2 className="w-5 h-5 text-[#e8a817] shrink-0" />
            <span className="text-white text-sm font-medium">Настроим кассу и 1С</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle2 className="w-5 h-5 text-[#e8a817] shrink-0" />
            <span className="text-white text-sm font-medium">Обучим персонал</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <OpenChatButton
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-colors shadow-md"
            style={{ backgroundColor: '#e8a817' }}
          >
            Оставить заявку
          </OpenChatButton>
          <Link
            href="/kalkulyatory/markirovka"
            className="text-white/80 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
          >
            Рассчитать стоимость
          </Link>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-[#1e3a5f] to-[#2a5080] rounded-2xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Рассчитайте стоимость онлайн
        </h2>
        <p className="text-white/70 text-sm sm:text-base mb-4 max-w-xl mx-auto">
          Бесплатный калькулятор — точная смета за 2 минуты. Без скрытых платежей.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/kalkulyatory/markirovka"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8a817] hover:bg-[#d49a12] text-white font-bold rounded-xl transition-colors shadow-md"
          >
            <Calculator className="w-5 h-5" />
            Калькулятор маркировки
          </Link>
          <a
            href="tel:+78124659457"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl transition-colors"
          >
            <Phone className="w-5 h-5" />
            +7 (812) 465-94-57
          </a>
        </div>
      </div>
    </div>
  )
}
