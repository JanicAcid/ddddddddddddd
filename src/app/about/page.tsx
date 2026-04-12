// ============================================================================
// О компании — Теллур-Интех
// ============================================================================

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Zap, Users, CheckCircle, Clock, MapPin, Phone, Mail, Award } from 'lucide-react'

const SITE_URL = 'https://kassa-cto.ru'

export const metadata: Metadata = {
  title: 'О компании — ООО «Теллур-Интех» | Центр технического обслуживания касс с 1995 года',
  description: 'ООО «Теллур-Интех» — центр технического обслуживания кассового оборудования в Санкт-Петербурге с 1995 года. Более 30 лет опыта. Офисы: СПб (ул. Заслонова 32-34), Пушкин, Гатчина. Подключение маркировки, ремонт касс, ЭДО.',
  keywords: ['теллур-интех', 'о компании теллур', 'сервисный центр касс спб', 'ремонт касс сант-петербург', 'маркировка под ключ спб', 'обслуживание кассового оборудования'],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'О компании — Теллур-Интех',
    description: 'Центр технического обслуживания кассового оборудования в Санкт-Петербурге с 1995 года.',
    url: `${SITE_URL}/about`,
    siteName: 'Теллур-Интех',
    locale: 'ru_RU',
    type: 'website',
  },
}

const ADVANTAGES = [
  { icon: <ShieldCheck className="w-5 h-5" />, title: 'Опыт с 1995 года', desc: 'Более 30 лет на рынке кассового оборудования. Знаем все нюансы настройки маркировки для разных типов бизнеса.' },
  { icon: <Zap className="w-5 h-5" />, title: 'Быстрое подключение', desc: 'Полная настройка маркировки под ключ — от 1 до 3 рабочих дней. Всё в один визит.' },
  { icon: <Users className="w-5 h-5" />, title: 'Сертифицированные инженеры', desc: 'Сертификаты производителей: Меркурий, Атол, Сигма, Эвотор. Регулярное повышение квалификации.' },
  { icon: <CheckCircle className="w-5 h-5" />, title: 'Гарантия результата', desc: 'Отвечаем за работоспособность всей цепочки: от приёмки товара через ЭДО до пробития чека.' },
  { icon: <Award className="w-5 h-5" />, title: 'Официальный партнёр', desc: 'Партнёры ОФД ТАКСКОМ, Эвотор, Меркурий. Партнёрские цены для клиентов.' },
  { icon: <MapPin className="w-5 h-5" />, title: '3 офиса', desc: 'Санкт-Петербург (м. Обводный канал), Пушкин, Гатчина. Удобная локация для клиентов из всех районов.' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <Image src="/logo.webp" alt="Теллур-Интех" width={88} height={72} className="h-14 w-auto mx-auto mb-3" quality={100} />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight">
          ООО «Теллур-Интех»
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Центр технического обслуживания кассового оборудования в Санкт-Петербурге с 1995 года
        </p>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 mb-6">
        <div className="prose prose-slate max-w-none text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3">
          <p>
            Компания <strong className="text-[#1e3a5f]">ТЕЛЛУР</strong> работает на рынке торгового, офисного и банковского оборудования с 1995 года (более 30 лет).
            Осуществляем продажу, установку и обслуживание кассового оборудования. Основная деятельность — предоставление комплексных
            сервисных услуг: ремонт, техническая поддержка и полное решение технических задач «из одних рук».
          </p>
          <p>
            Мы специализируемся на <strong>подключении маркировки в Санкт-Петербурге</strong> для малого и среднего бизнеса: от продуктовых
            магазинов и аптек до розничных точек продаж сигарет, обуви, одежды, воды, молочной продукции и других маркированных товаров.
            Наши инженеры обслуживают предпринимателей по всему городу: от центра до Красногвардейского и Курортного районов.
          </p>
          <p>
            Обслуживаем все основные бренды кассового оборудования: <strong>Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI</strong>.
            Наша команда инженеров имеет сертификации производителей и опыт настройки сотен касс для работы с системой
            «Честный ЗНАК».
          </p>
        </div>
      </div>

      {/* Advantages */}
      <h2 className="text-lg sm:text-xl font-bold text-[#1e3a5f] mb-4">Почему выбирают нас</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {ADVANTAGES.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="w-9 h-9 rounded-lg bg-[#e8a817]/10 flex items-center justify-center text-[#e8a817] mb-2.5">
              {item.icon}
            </div>
            <h3 className="text-sm font-bold text-[#1e3a5f] mb-1">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/contacts"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8a817] hover:bg-[#d49a12] text-white font-bold rounded-xl transition-colors shadow-md"
        >
          <Phone className="w-5 h-5" />
          Контакты и адреса
        </Link>
      </div>
    </div>
  )
}
