// ============================================================================
// SEO ТЕКСТОВЫЙ БЛОК — обёртка с состоянием для сворачивания
// SeoContentInner — серверный компонент (рендерится для SEO)
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { SeoContentInner } from './SeoContentInner'

export function SeoContent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => {
      const el = document.getElementById('contacts-section')
      if (el && !open) setOpen(true)
    }
    window.addEventListener('scroll-to-contacts', handler)
    return () => window.removeEventListener('scroll-to-contacts', handler)
  }, [open])

  return (
    <div className="mb-2" id="contacts-section">
      <button
        type="button"
        onClick={() => { setOpen(v => !v) }}
        className="flex items-center justify-between w-full cursor-pointer select-none py-2 max-w-3xl mx-auto px-3 sm:px-4"
      >
        <h2 className="text-base sm:text-lg font-bold text-[#1e3a5f] text-left">Сервисный центр кассового оборудования в Санкт-Петербурге и Ленинградской области</h2>
        <ChevronDown className={`w-5 h-5 text-[#1e3a5f]/60 transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="max-w-3xl mx-auto px-3 sm:px-4">
          <SeoContentInner />
        </div>
      )}
    </div>
  )
}
