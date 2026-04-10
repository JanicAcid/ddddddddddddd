// ============================================================================
// SiteFooter — единый подвал для всех страниц
// ============================================================================

import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin, Lock } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Главная', href: '/' },
  { label: 'Диагностика', href: '/diagnostika' },
  { label: 'Калькуляторы', href: '/kalkulyatory' },
  { label: 'База знаний', href: '/instructions' },
  { label: 'Услуги', href: '/services' },
  { label: 'Контакты', href: '/contacts' },
]

const SERVICE_LINKS = [
  { label: 'Подключение маркировки под ключ', href: '/kalkulyatory/markirovka' },
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
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p className="order-2 sm:order-1">© {new Date().getFullYear()} ООО «Теллур-Интех». Все права защищены.</p>
          <div className="flex items-center gap-3 order-1 sm:order-2">
            <p className="text-center sm:text-right">Центр технического обслуживания кассового оборудования</p>
            <Link href="/admin/login" className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors" title="Кабинет менеджера">
              <Lock className="w-3.5 h-3.5" />
              <span>Кабинет</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
