// ============================================================================
// SEO ТЕКСТОВЫЙ БЛОК — обёртка с состоянием для сворачивания
// SeoContentInner — клиентский компонент с аккордеонами
// Контент ВСЕГДА в HTML для поисковых роботов, сворачивается через max-h
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ArrowUp } from 'lucide-react'
import { SeoContentInner } from './SeoContentInner'

export function SeoContent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handlerContacts = () => {
      if (!open) setOpen(true)
      // Открыть нужную секцию внутри аккордеона
      window.dispatchEvent(new CustomEvent('open-seo-sections', { detail: { ids: ['offices'] } }))
      setTimeout(() => document.getElementById('contacts-section')?.scrollIntoView({ behavior: 'smooth' }), 600)
    }
    const handlerFaq = (e: Event) => {
      const { id } = (e as CustomEvent).detail || {}
      if (!open) setOpen(true)
      // Открыть секцию FAQ
      window.dispatchEvent(new CustomEvent('open-seo-sections', { detail: { ids: ['faq'] } }))
      setTimeout(() => {
        const el = document.getElementById(id || 'faq-1')
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (el) {
          el.classList.add('ring-2', 'ring-[#e8a817]/50', 'rounded-lg')
          setTimeout(() => el.classList.remove('ring-2', 'ring-[#e8a817]/50', 'rounded-lg'), 3000)
        }
      }, 600)
    }
    window.addEventListener('scroll-to-contacts', handlerContacts)
    window.addEventListener('scroll-to-faq', handlerFaq)
    return () => {
      window.removeEventListener('scroll-to-contacts', handlerContacts)
      window.removeEventListener('scroll-to-faq', handlerFaq)
    }
  }, [open])

  return (
    <div className="mb-2" id="seo-section">
      {/* Заголовок — по центру, в две строки */}
      <button
        type="button"
        onClick={() => { setOpen(v => !v) }}
        className="flex flex-col items-center w-full cursor-pointer select-none py-3"
        aria-expanded={open}
      >
        <h2 className="text-base sm:text-lg font-bold text-[#1e3a5f] text-center leading-snug">
          Сервисный центр кассового оборудования<br className="hidden sm:block" />
          {' '}в&nbsp;Санкт-Петербурге и&nbsp;Ленинградской области
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Подробнее о нас</p>
        <ChevronDown className={`w-5 h-5 text-[#1e3a5f]/60 mt-1 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {/* Контент всегда в DOM для краулеров. max-h-0 + overflow-hidden = свёрнут визуально */}
      <div
        className={`max-w-3xl mx-auto transition-[max-height,opacity] duration-500 ease-in-out ${
          open ? 'max-h-[100000px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <div className={open ? 'pt-1' : 'pointer-events-none'}>
          <SeoContentInner />
          {open && (
            <div className="flex justify-center mt-4 mb-2">
              <button
                type="button"
                onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-medium transition-colors"
              >
                <ArrowUp className="w-4 h-4" />
                Наверх
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
