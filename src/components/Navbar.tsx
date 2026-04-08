// ============================================================================
// ГЛОБАЛЬНЫЙ NAVBAR — шапка сайта для всех страниц
// Мобильный: гамбургер → выдвижное меню
// Десктоп: горизонтальное меню
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Menu, X, ChevronRight, MessageCircle } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Калькулятор', href: '/' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Инструкции', href: '/instructions' },
  { label: 'Услуги', href: '/services' },
  { label: 'О нас', href: '/about' },
  { label: 'Контакты', href: '/contacts' },
]

const MAIN_PHONE = '+7 (812) 465-94-57'
const MAIN_PHONE_HREF = 'tel:+78124659457'

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Закрыть меню при переходе
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
        style={{ borderBottom: '1px solid rgba(30,58,95,0.08)' }}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-14">
            {/* Лого */}
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Теллур-Интех — на главную">
              <Image src="/logo.webp" alt="Теллур-Интех" width={88} height={72} className="h-10 w-auto sm:h-9" quality={100} />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs text-slate-400 leading-tight">
                  Центр ТО касс
                </span>
                <span className="text-[9px] text-slate-300 leading-tight hidden sm:inline">
                  кассового оборудования
                </span>
              </div>
            </Link>

            {/* Десктоп: меню */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Основная навигация">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#1e3a5f]/8 text-[#1e3a5f] font-semibold'
                      : 'text-slate-500 hover:text-[#1e3a5f] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Телефон + гамбургер */}
            <div className="flex items-center gap-2">
              <a
                href={MAIN_PHONE_HREF}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e8a817] hover:bg-[#d49a12] text-white text-[13px] font-bold rounded-lg transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {MAIN_PHONE}
              </a>

              {/* Мобильный: иконка телефона */}
              <a
                href={MAIN_PHONE_HREF}
                className="sm:hidden inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#e8a817] hover:bg-[#d49a12] text-white transition-colors shadow-md"
                aria-label="Позвонить"
              >
                <Phone className="w-6 h-6" />
              </a>

              {/* Гамбургер (мобильный + планшет) */}
              <button
                type="button"
                onClick={() => setMenuOpen(v => !v)}
                className="lg:hidden inline-flex items-center justify-center w-12 h-12 rounded-xl text-[#1e3a5f] hover:bg-slate-100 transition-colors"
                aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Мобильное меню — выдвижная панель */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          {/* Панель */}
          <nav
            className="fixed top-12 left-0 right-0 bottom-0 z-40 bg-white lg:hidden overflow-y-auto"
            aria-label="Мобильная навигация"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#1e3a5f]/8 text-[#1e3a5f] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>
              ))}

              {/* Телефон в меню */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <a
                  href={MAIN_PHONE_HREF}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#e8a817] hover:bg-[#d49a12] text-white text-sm font-bold rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {MAIN_PHONE}
                </a>
                <div className="mt-3 space-y-1.5">
                  <p className="text-[11px] text-slate-400 text-center">Другие телефоны:</p>
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <a href="tel:+78123210606" className="hover:text-[#1e3a5f]">+7 (812) 321-06-06</a>
                    <a href="tel:+78137140895" className="hover:text-[#1e3a5f]">+7 (813) 714-08-95</a>
                  </div>
                </div>
              </div>

              {/* Логотип внизу */}
              <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400">ООО «Теллур-Интех»</p>
                <p className="text-[10px] text-slate-300 mt-0.5">Центр технического обслуживания кассового оборудования с 1995 года</p>
              </div>
            </div>
          </nav>
        </>
      )}

      {/* Spacer для fixed header */}
      <div className="h-14" />
    </>
  )
}
