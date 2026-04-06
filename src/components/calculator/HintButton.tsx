'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { hints } from '@/config/hints'
import type { HintButtonProps } from './types'

export function HintButton({ hintKey, activeHint, onHintOpen, onHintClose }: HintButtonProps) {
  const hint = hints[hintKey]
  const isOpen = activeHint === hintKey
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!hint) return null
  const modal = isOpen && mounted ? createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={(e) => { e.stopPropagation(); onHintClose() }} />
      <div className="relative z-10 w-full max-w-md max-h-[75vh] flex flex-col bg-white border-2 border-[#1e3a5f]/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-[#1e3a5f]/5 border-b border-[#1e3a5f]/10 shrink-0">
          <span className="font-bold text-[#1e3a5f] text-xs uppercase tracking-wide">Подсказка</span>
          <button
            type="button"
            onClick={() => onHintClose()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e3a5f]/10 hover:bg-[#1e3a5f]/20 active:bg-[#1e3a5f]/30 text-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm text-slate-600">
          <p><strong className="text-[#1e3a5f]">Что это:</strong> {hint.what}</p>
          <p><strong className="text-[#1e3a5f]">Зачем:</strong> {hint.why}</p>
          <p><strong className="text-[#1e3a5f]">Когда:</strong> {hint.when}</p>
          <p className="text-slate-500 text-xs pt-3 border-t border-slate-200"><em>Пример: {hint.example}</em></p>
        </div>
        <div className="px-4 py-3 border-t border-[#1e3a5f]/10 bg-[#1e3a5f]/[0.02] shrink-0">
          <button
            type="button"
            onClick={() => onHintClose()}
            className="w-full py-2.5 rounded-lg bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 active:bg-[#1e3a5f]/80 text-white font-medium text-sm transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onHintOpen(hintKey) }}
        className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e3a5f]/10 hover:bg-[#1e3a5f]/20 active:bg-[#1e3a5f]/30 text-[#1e3a5f] hover:text-[#1e3a5f] transition-colors shrink-0"
        aria-label="Подсказка"
      >
        <span className="text-xs sm:text-sm font-bold">?</span>
      </button>
      {modal}
    </>
  )
}
