// ============================================================================
// SiteFooter — единый подвал для всех страниц
// ============================================================================

import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin, Lock } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Калькулятор маркировки', href: '/' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Инструкции', href: '/instructions' },
  { label: 'Услуги', href: '/services' },
  { label: 'О компании', href: '/about' },
  { label: 'Контакты', href: '/contacts' },
]

const SERVICE_LINKS = [
  { label: 'Подключение маркировки под ключ', href: '/' },
  { label: 'Регистрация ККТ в ФНС', href: '/services' },
  { label: 'Настройка ЭДО', href: '/services' },
  { label: 'Подключение ОФД', href: '/services' },
  { label: 'Замена фискального накопителя', href: '/services' },
  { label: 'Инструкция: Честный ЗНАК', href: '/instructions/kak-podklyuchit-kabinet-chestnyznak' },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Лого + описание */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Image src="/logo.webp" alt="Теллур-Интех" width={88} height={72} className="h-10 w-auto brightness-0 invert" quality={100} />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Центр технического обслуживания кассового оборудования в Санкт-Петербурге с 1995 года.
              Подключение маркировки под ключ.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-white/90">Навигация</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Услуги */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-white/90">Услуги</h4>
            <ul className="space-y-2">
              {SERVICE_LINKS.map(link => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-white/90">Контакты</h4>
            <div className="space-y-2.5">
              <a href="tel:+78124659457" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                +7 (812) 465-94-57
              </a>
              <a href="tel:+78123210606" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                +7 (812) 321-06-06
              </a>
              <a href="mailto:push@tellur.spb.ru" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                push@tellur.spb.ru
              </a>
              <div className="flex items-start gap-2 text-sm text-white/50">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>СПб, ул. Заслонова 32-34</span>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <p>© {new Date().getFullYear()} ООО «Теллур-Интех». Все права защищены.</p>
          <div className="flex items-center gap-4">
            <p>Центр технического обслуживания кассового оборудования</p>
            <Link href="/admin/login" className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors" title="Кабинет менеджера">
              <Lock className="w-3.5 h-3.5" />
              <span>Кабинет</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
