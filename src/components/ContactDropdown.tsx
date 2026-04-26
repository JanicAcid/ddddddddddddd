'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, ChevronUp, Phone } from 'lucide-react'
import { FaTelegram } from 'react-icons/fa'

const TELEGRAM_URL = 'https://t.me/+79219403870'
const MAX_URL = 'https://max.ru/u/f9LHodD0cOKAQIkb0s8W9FEngaXuCgU--hLEErjZL5jCKC4-Wr8lbwVsZO4'
const PHONE_URL = 'tel:+79219403870'
const PHONE_DISPLAY = '+7 (921) 940-38-70'

interface ContactDropdownProps {
  variant?: 'hero' | 'cta' | 'default'
  children?: React.ReactNode
}

export function ContactDropdown({ variant = 'default', children }: ContactDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Закрытие при клике снаружи
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isHero = variant === 'hero'
  const isCta = variant === 'cta'

  // Классы для кнопки-триггера
  const triggerClasses = isHero
    ? 'w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 bg-white/15 hover:bg-white/25 text-white text-base sm:text-lg font-medium rounded-xl transition-all border border-white/20 hover:border-white/30'
    : isCta
    ? 'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-[#1e3a5f] font-bold rounded-xl transition-colors shadow-md'
    : 'inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-medium rounded-xl transition-colors'

  const iconSize = isHero ? 'w-5 h-5' : 'w-4 h-4'

  return (
    <div ref={ref} className="relative">
      {/* Триггер */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClasses}
      >
        {children || (
          <>
            <MessageCircle className={iconSize} />
            Задать вопрос
          </>
        )}
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <div className={`absolute z-50 mt-2 ${isHero || isCta ? 'left-0 right-0 sm:right-0 sm:left-auto' : 'left-0'} w-full sm:w-72 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-up`}>
          <div className="p-1.5">
            {/* Telegram */}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors no-underline text-slate-700"
            >
              <div className="w-9 h-9 rounded-full bg-[#0088cc] flex items-center justify-center shrink-0">
                <FaTelegram className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Telegram</p>
                <p className="text-xs text-slate-500">Быстрый ответ</p>
              </div>
            </a>

            {/* MAX */}
            <a
              href={MAX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors no-underline text-slate-700"
            >
              <div className="w-9 h-9 flex items-center justify-center shrink-0">
                <img src="/max-icon.png" alt="МАКС" className="w-9 h-9 rounded-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">МАКС</p>
                <p className="text-xs text-slate-500">Мессенджер</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href={PHONE_URL}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors no-underline text-slate-700"
            >
              <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Позвонить</p>
                <p className="text-xs text-slate-500">{PHONE_DISPLAY}</p>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
