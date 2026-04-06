// ============================================================================
// SEO ТЕКСТОВЫЙ БЛОК — обёртка с состоянием для сворачивания
// SeoContentInner — серверный компонент (рендерится для SEO)
// Контент ВСЕГДА в HTML для поисковых роботов, сворачивается через max-h
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ArrowUp } from 'lucide-react'
import { SeoContentInner } from './SeoContentInner'

export function SeoContent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => {
      if (!open) setOpen(true)
      setTimeout(() => document.getElementById('contacts-section')?.scrollIntoView({ behavior: 'smooth' }), 600)
    }
    window.addEventListener('scroll-to-contacts', handler)
    return () => window.removeEventListener('scroll-to-contacts', handler)
  }, [open])

  return (
    <div className="mb-2" id="seo-section">
      <button
        type="button"
        onClick={() => { setOpen(v => !v) }}
        className="flex items-center justify-between w-full cursor-pointer select-none py-2 max-w-3xl mx-auto px-3 sm:px-4"
        aria-expanded={open}
      >
        <h2 className="text-base sm:text-lg font-bold text-[#1e3a5f] text-left">Сервисный центр кассового оборудования в Санкт-Петербурге и Ленинградской области</h2>
        <ChevronDown className={`w-5 h-5 text-[#1e3a5f]/60 transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {/* Контент всегда в DOM для краулеров. max-h-0 + overflow-hidden = свёрнут визуально */}
      <div
        className={`max-w-3xl mx-auto px-3 sm:px-4 transition-[max-height,opacity] duration-500 ease-in-out ${
          open ? 'max-h-[10000px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <div className={open ? 'pt-1' : 'pointer-events-none'}>
          <SeoContentInner />
          {open && (
            <div className="flex justify-center mt-4 mb-2">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
