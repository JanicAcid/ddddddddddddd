'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0

      setVisible(scrollTop > 300)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Наверх"
      className={`fixed bottom-20 right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer group {
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Круговой прогресс-бар */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        viewBox="0 0 48 48"
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2.5"
        />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 22}`}
          strokeDashoffset={`${2 * Math.PI * 22 * (1 - scrollProgress)}`}
          className="transition-[stroke-dashoffset] duration-150"
        />
      </svg>
      <ArrowUp className="w-5 h-5 relative z-10 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  )
}
