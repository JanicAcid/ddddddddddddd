'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * При переходе на /faq#some-slug — скроллит к элементу с id="some-slug",
 * открывает <details> и подсвечивает на 3 секунды.
 */
export function FaqHashScroller() {
  const pathname = usePathname()
  const lastHash = useRef<string>('')

  const scrollToHash = (hash: string) => {
    if (!hash) return

    const el = document.getElementById(hash)
    if (!el) return

    // Открываем <details>
    if (el instanceof HTMLDetailsElement && !el.open) {
      el.open = true
    }

    // Скроллим к элементу
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Подсветка
    el.classList.add('ring-2', 'ring-[#e8a817]/50', 'rounded-lg')
    setTimeout(() => el.classList.remove('ring-2', 'ring-[#e8a817]/50', 'rounded-lg'), 3000)
  }

  // Скролл при первоначальной загрузке / навигации на страницу
  useEffect(() => {
    if (pathname !== '/faq') return

    const hash = window.location.hash.slice(1)
    if (!hash || hash === lastHash.current) return

    lastHash.current = hash

    const timer = setTimeout(() => scrollToHash(hash), 200)
    return () => clearTimeout(timer)
  }, [pathname])

  // Скролл при изменении хеша (клик из FaqWidget уже находясь на /faq)
  useEffect(() => {
    if (pathname !== '/faq') return

    const onHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (!hash || hash === lastHash.current) return

      lastHash.current = hash
      const timer = setTimeout(() => scrollToHash(hash), 100)
      return () => clearTimeout(timer)
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [pathname])

  return null
}
