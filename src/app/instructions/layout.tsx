// ============================================================================
// Layout для раздела /instructions — шапка, подвал, мета
// ============================================================================

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, ArrowLeft } from 'lucide-react'

const SITE_URL = 'https://tellurmarkirovka.vercel.app'

export const metadata: Metadata = {
  title: 'Инструкции по маркировке товаров | Честный ЗНАК, ТС ПИоТ, ЭДО — Теллур-Интех',
  description: 'Пошаговые инструкции по подключению маркировки товаров: регистрация в Честном ЗНАК, настройка ТС ПИоТ, подключение ЭДО, работа с кассой. Для ИП и ООО в Санкт-Петербурге.',
  keywords: [
    'инструкция маркировка', 'как подключить маркировку', 'инструкция честный знак',
    'как подключить честный знак', 'инструкция тс пиот', 'подключить тс пиот',
    'инструкция эдо', 'подключить эдо маркировка', 'инструкция маркировка для ип',
    'инструкция маркировка для ооо', 'маркировка пошагово', 'честный знак пошаговая инструкция',
    'подключить кабинет честный знак', 'на кассу честный знак',
    'подключить кассу к честному знаку', 'настроить маркировку на кассе',
  ],
  alternates: {
    canonical: `${SITE_URL}/instructions`,
  },
  openGraph: {
    title: 'Инструкции по маркировке товаров — Теллур-Интех',
    description: 'Пошаговые инструкции: Честный ЗНАК, ТС ПИоТ, ЭДО, кассы. Для ИП и ООО.',
    url: `${SITE_URL}/instructions`,
    siteName: 'Теллур-Интех',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function InstructionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e8ecf2] flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-[#1e3a5f]/10 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0" aria-label="На главную">
                <Image src="/logo.webp" alt="Теллур-Интех" width={88} height={72} className="w-11 h-9 sm:w-[88px] sm:h-[72px]" quality={100} />
              </Link>
              <div className="min-w-0 flex items-center gap-1 sm:gap-2">
                <Link href="/" className="flex items-center gap-1 text-slate-400 hover:text-[#1e3a5f] transition-colors shrink-0">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Калькулятор</span>
                </Link>
                <span className="text-slate-300">/</span>
                <h1 className="text-base sm:text-lg font-bold text-[#1e3a5f] whitespace-nowrap overflow-hidden text-ellipsis">
                  Инструкции
                </h1>
              </div>
            </div>
            <a
              href="tel:+78123210606"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#e8a817] hover:bg-[#d49a12] text-white text-sm sm:text-base font-bold rounded-xl transition-colors shrink-0 shadow-md hover:shadow-lg"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">+7 (812) 321-06-06</span>
              <span className="sm:hidden">Позвонить</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#1e3a5f]/10 mt-auto">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.webp" alt="Теллур-Интех" width={56} height={46} className="w-7 h-[23px] sm:w-[56px] sm:h-[46px]" quality={100} />
              <p className="text-xs sm:text-sm text-slate-500">ООО &quot;Теллур-Интех&quot; — сервисный центр кассового оборудования</p>
            </Link>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>СПб, ул. Заслонова 32-34</span>
              <a href="tel:+78123210606" className="hover:text-[#1e3a5f] transition-colors">+7 (812) 321-06-06</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
