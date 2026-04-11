import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string // no href = current page (not clickable)
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className="flex items-center gap-1 text-sm text-slate-400 py-3 flex-wrap">
      <Link href="/" className="flex items-center gap-1 hover:text-[#1e3a5f] transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Главная</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#1e3a5f] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-600 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
