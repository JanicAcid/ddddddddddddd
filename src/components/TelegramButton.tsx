'use client'

import { useState } from 'react'
import { MessageCircle, X, Phone } from 'lucide-react'
import { FaTelegram } from 'react-icons/fa'

const TELEGRAM_URL = 'https://t.me/+79219403870'
const MAX_URL = 'https://max.ru/u/f9LHodD0cOKAQIkb0s8W9FEngaXuCgU--hLEErjZL5jCKC4-Wr8lbwVsZO4'
const PHONE_URL = 'tel:+79219403870'
const PHONE_DISPLAY = '+7 (921) 940-38-70'

// MAX иконка — градиентный скруглённый квадрат с большой буквой «А»
function MaxIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <defs>
        <linearGradient id="max-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077FF" />
          <stop offset="50%" stopColor="#5500FF" />
          <stop offset="100%" stopColor="#AA00FF" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#max-grad)" />
      <text x="16" y="23" textAnchor="middle" fill="white" fontSize="19" fontWeight="800" fontFamily="Arial,Helvetica,sans-serif">А</text>
    </svg>
  )
}

export function TelegramButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup menu */}
      <div
        className={`flex flex-col gap-2 transition-all duration-200 ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }`}
      >
        {/* Telegram */}
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-gray-900 hover:scale-105 active:scale-95 no-underline min-w-[200px]"
        >
          <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center shrink-0">
            <FaTelegram className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Telegram</p>
            <p className="text-xs text-gray-500">Написать в чат</p>
          </div>
        </a>

        {/* MAX */}
        <a
          href={MAX_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-gray-900 hover:scale-105 active:scale-95 no-underline min-w-[200px]"
        >
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <MaxIcon className="w-10 h-10" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">МАКС</p>
            <p className="text-xs text-gray-500">Написать в МАКС</p>
          </div>
        </a>

        {/* Phone */}
        <a
          href={PHONE_URL}
          className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-gray-900 hover:scale-105 active:scale-95 no-underline min-w-[200px]"
        >
          <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Позвонить</p>
            <p className="text-xs text-gray-500">{PHONE_DISPLAY}</p>
          </div>
        </a>
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ backgroundColor: isOpen ? '#64748b' : '#1e3a5f' }}
        aria-label={isOpen ? 'Закрыть' : 'Написать нам'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  )
}
