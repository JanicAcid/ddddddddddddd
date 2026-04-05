// ============================================================================
// SEO ТЕКСТОВЫЙ БЛОК — обёртка с состоянием для сворачивания
// SeoContentInner — серверный компонент (рендерится для SEO)
// ============================================================================

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SeoContentInner } from './SeoContentInner'

export function SeoContent() {
  const [open, setOpen] = useState(false)

  return (
    <details open={open} className="group mb-2" onToggle={(e) => e.preventDefault()}>
      <summary className="flex items-center justify-between cursor-pointer select-none list-none py-2 max-w-3xl mx-auto px-3 sm:px-4">
        <h2 className="text-base sm:text-lg font-bold text-[#1e3a5f]">Сервисный центр кассового оборудования в Санкт-Петербурге и Ленинградской области</h2>
        <ChevronDown className="w-5 h-5 text-[#1e3a5f]/60 transition-transform group-open:rotate-180 shrink-0 ml-2" />
      </summary>
      {open && (
        <div className="max-w-3xl mx-auto px-3 sm:px-4">
          <SeoContentInner />
        </div>
      )}
    </details>
  )
}
