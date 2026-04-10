'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { HelpCircle, X, ChevronRight } from 'lucide-react'

const FAQ_ITEMS = [
  { id: 'faq-1', slug: 'chto-takoe-markirovka', question: 'Что такое маркировка товаров?' },
  { id: 'faq-2', slug: 'chto-nuzhno-dlya-podklyucheniya', question: 'Что нужно для подключения?' },
  { id: 'faq-3', slug: 'kakie-kassy-podhodyat', question: 'Какие кассы подходят?' },
  { id: 'faq-4', slug: 'kakie-tovary-podlezhat-markirovke', question: 'Какие товары подлежат маркировке?' },
  { id: 'faq-5', slug: 'skolko-dlitsya-nastroyka', question: 'Сколько длится настройка?' },
  { id: 'faq-6', slug: 'novaya-bu-tekuschaya-kassa', question: 'Новая / б/у / текущая касса?' },
  { id: 'faq-7', slug: 'chto-takoe-edo', question: 'Что такое ЭДО?' },
  { id: 'faq-8', slug: 'shtrafy-za-markirovku', question: 'Штрафы за отсутствие маркировки?' },
  { id: 'faq-9', slug: 'chestnyznak', question: 'Что такое Честный ЗНАК?' },
  { id: 'faq-10', slug: 'tspiott', question: 'Что такое ТС ПИоТ?' },
  { id: 'faq-11', slug: 'besplatnaya-konsultatsiya', question: 'Бесплатная консультация' },
  { id: 'faq-12', slug: 'registratsiya-chestnyznak', question: 'Регистрация в Честном ЗНАКе' },
]

export function FaqWidget() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  // Слушаем открытие/закрытие чата
  useEffect(() => {
    const openHandler = () => setChatOpen(true)
    const closeHandler = () => setChatOpen(false)
    window.addEventListener('chat-opened', openHandler)
    window.addEventListener('chat-closed', closeHandler)
    return () => {
      window.removeEventListener('chat-opened', openHandler)
      window.removeEventListener('chat-closed', closeHandler)
    }
  }, [])

  const handleFaqClick = (item: typeof FAQ_ITEMS[number]) => {
    setIsOpen(false)

    if (pathname === '/faq') {
      // Уже на странице FAQ — скроллим к вопросу и открываем его
      setTimeout(() => {
        const el = document.getElementById(item.slug)
        if (el) {
          // Открываем <details> если закрыт
          if (!(el instanceof HTMLDetailsElement && el.open)) {
            if (el instanceof HTMLDetailsElement) el.open = true
          }
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Подсветка
          el.classList.add('ring-2', 'ring-[#e8a817]/50', 'rounded-lg')
          setTimeout(() => el.classList.remove('ring-2', 'ring-[#e8a817]/50', 'rounded-lg'), 3000)
        }
      }, 100)
    } else {
      // На любой другой странице — переходим на /faq с якорем
      router.push(`/faq#${item.slug}`)
    }
  }

  return (
    <div className={`fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start gap-3 transition-opacity duration-300 ${chatOpen ? 'opacity-0 pointer-events-none' : ''}`}>
      {/* FAQ панель */}
      <div
        className={`relative flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-[340px] sm:w-[380px] max-h-[70vh] opacity-100 translate-y-0 scale-100'
            : 'w-0 h-0 opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
        style={{ boxShadow: isOpen ? '0 25px 60px -12px rgba(0, 0, 0, 0.25)' : undefined }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ backgroundColor: '#1e3a5f' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight">Частые вопросы</h3>
              <p className="text-white/60 text-xs mt-0.5">О маркировке товаров</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors" aria-label="Закрыть FAQ">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {FAQ_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleFaqClick(item)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-[#1e3a5f]/[0.04] transition-colors text-left group"
            >
              <ChevronRight className="w-4 h-4 text-[#e8a817] shrink-0 group-hover:translate-x-0.5 transition-transform" />
              <span className="text-sm text-slate-700 group-hover:text-[#1e3a5f] font-medium leading-snug transition-colors">{item.question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Плавающая кнопка FAQ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ backgroundColor: '#e8a817' }}
        aria-label={isOpen ? 'Закрыть FAQ' : 'Открыть FAQ'}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <HelpCircle className="w-6 h-6 text-white" />}
      </button>
    </div>
  )
}
