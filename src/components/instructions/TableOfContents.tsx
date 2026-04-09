'use client'

// ============================================================================
// Содержание статьи (Table of Contents) — sticky sidebar
// ============================================================================

import { useEffect, useState } from 'react'
import { List } from 'lucide-react'

interface TocItem {
  id: string
  title: string
  step: number
}

interface TableOfContentsProps {
  steps: TocItem[]
}

export function TableOfContents({ steps }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Находим ближайший видимый элемент сверху
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          // Сортируем по позиции (ближайший к верху)
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    steps.forEach(step => {
      const el = document.getElementById(step.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [steps])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="sticky top-4" aria-label="Содержание статьи">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <List className="w-4 h-4 text-[#1e3a5f]" />
          <h4 className="text-sm font-bold text-[#1e3a5f]">Содержание</h4>
        </div>
        <ol className="space-y-1">
          {steps.map(step => (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => handleClick(step.id)}
                className={`text-left text-sm transition-colors duration-200 py-1 px-2 rounded-lg w-full ${
                  activeId === step.id
                    ? 'bg-[#1e3a5f]/5 text-[#1e3a5f] font-semibold'
                    : 'text-slate-500 hover:text-[#1e3a5f] hover:bg-slate-50'
                }`}
              >
                <span className="text-[#e8a817] font-bold mr-1.5">{step.step}.</span>
                {step.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
