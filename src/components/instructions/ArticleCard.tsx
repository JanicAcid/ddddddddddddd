// ============================================================================
// Карточка статьи для страницы списка
// ============================================================================

import Link from 'next/link'

interface ArticleCardProps {
  slug: string
  title: string
  description: string
  category: string
  readingTime: number
  coverColor: string
  datePublished: string
}

export function ArticleCard({ slug, title, description, category, readingTime, coverColor, datePublished }: ArticleCardProps) {
  const date = new Date(datePublished).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link href={`/instructions/${slug}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:border-[#1e3a5f]/20 transition-all duration-300">
        {/* Обложка — градиент */}
        <div className={`h-40 bg-gradient-to-br ${coverColor} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
              {category}
            </span>
          </div>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white text-[#1e3a5f] text-xs font-bold shadow-md">
              Читать →
            </span>
          </div>
        </div>

        {/* Контент */}
        <div className="p-4">
          <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f] leading-snug group-hover:text-[#1e3a5f]/80 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            <span>{date}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{readingTime} мин. чтения</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
