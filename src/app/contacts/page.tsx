// ============================================================================
// Контакты — адреса, телефоны, карта
// ============================================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ExternalLink, MessageCircle, Calculator } from 'lucide-react'
import { BRANCHES } from '@/config/contacts'

const SITE_URL = 'https://tellurmarkirovka.vercel.app'

export const metadata: Metadata = {
  title: 'Контакты — Теллур-Интех | Центр технического обслуживания касс, Санкт-Петербург',
  description: 'Контакты ООО «Теллур-Интех»: телефон, адреса офисов в Санкт-Петербурге, Пушкине и Гатчине. Часы работы, email. Бесплатная консультация по маркировке.',
  keywords: ['контакты теллур-интех', 'адрес теллур спб', 'телефон сервисный центр касс', 'ремонт касс контакты', 'маркировка контакты спб', 'теллур-интех пушкин', 'теллур-интех гатчина'],
  alternates: { canonical: `${SITE_URL}/contacts` },
  openGraph: {
    title: 'Контакты — Теллур-Интех',
    description: 'Адреса и телефоны центра технического обслуживания касс в Санкт-Петербурге.',
    url: `${SITE_URL}/contacts`,
    siteName: 'Теллур-Интех',
    locale: 'ru_RU',
    type: 'website',
  },
}

const YANDEX_MAP_LINKS: Record<string, string> = {
  'Теллур-Центр': 'https://yandex.com/maps/-/CPfpvF1T',
  'Теллур-Пушкин': 'https://yandex.com/maps/-/CPfprG0R',
  'Теллур-Гатчина': 'https://yandex.com/maps/-/CPfpnHoK',
}

export default function ContactsPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight">
          Контакты
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Три офиса в Санкт-Петербурге и Ленинградской области
        </p>
      </div>

      {/* Main Phone CTA */}
      <div className="bg-gradient-to-r from-[#e8a817] to-[#d49a12] rounded-2xl p-5 sm:p-6 text-center mb-6 sm:mb-8">
        <p className="text-white/80 text-sm mb-1">Бесплатная консультация</p>
        <a href="tel:+78124659457" className="inline-block text-2xl sm:text-3xl font-extrabold text-white">
          +7 (812) 465-94-57
        </a>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-white/70">
          <a href="tel:+78123210606" className="hover:text-white transition-colors">+7 (812) 321-06-06</a>
          <a href="tel:+78137140895" className="hover:text-white transition-colors">+7 (813) 714-08-95</a>
        </div>
      </div>

      {/* Offices */}
      <div className="space-y-4 sm:space-y-5 mb-8">
        {BRANCHES.map((branch) => (
          <div
            key={branch.name}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5080] px-5 py-3">
              <h2 className="text-white font-bold text-base sm:text-lg">«{branch.name}»</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#e8a817] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm sm:text-[15px] text-slate-700">{branch.address}</p>
                  {YANDEX_MAP_LINKS[branch.name] && (
                    <a
                      href={YANDEX_MAP_LINKS[branch.name]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline mt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Открыть на карте
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#e8a817] shrink-0" />
                <a href={`mailto:${branch.email}`} className="text-sm text-[#1e3a5f] hover:underline">{branch.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#e8a817] shrink-0" />
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {branch.phones.map((phone, i) => (
                    <a key={i} href={'tel:' + phone.replace(/[^0-9+]/g, '')} className="text-sm text-[#1e3a5f] hover:underline">
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#e8a817] shrink-0" />
                <span className="text-sm text-slate-600">{branch.schedule}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <Calculator className="w-4 h-4" />
          Калькулятор маркировки
        </Link>
        <Link
          href="/instructions"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1e3a5f]/20 text-[#1e3a5f] text-sm font-medium rounded-xl hover:bg-[#1e3a5f]/5 transition-colors"
        >
          Инструкции
        </Link>
      </div>
    </div>
  )
}
