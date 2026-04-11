// ============================================================================
// Страница списка инструкций /instructions
// ============================================================================

import { getAllArticles, getAllCategories } from '@/config/articles'
import { ArticleCard } from '@/components/instructions/ArticleCard'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export default function InstructionsPage() {
  const articles = getAllArticles()
  const categories = getAllCategories()

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'База знаний' }]} />

      {/* Заголовок */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-tight">
          Инструкции по маркировке товаров
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
          Пошаговые руководства по подключению и настройке маркировки для ИП и ООО. 
          Честный ЗНАК, ТС ПИоТ, ЭДО, кассы — всё в одном месте.
        </p>
      </div>

      {/* Категории */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#1e3a5f] text-white text-xs font-semibold">
            Все ({articles.length})
          </span>
          {categories.map(cat => {
            const count = articles.filter(a => a.categorySlug === cat.slug).length
            return (
              <span
                key={cat.slug}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:border-[#1e3a5f]/30 hover:text-[#1e3a5f] transition-colors cursor-default"
              >
                {cat.name} ({count})
              </span>
            )
          })}
        </div>
      )}

      {/* Сетка статей */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {articles.map(article => (
            <ArticleCard
              key={article.slug}
              slug={article.slug}
              title={article.shortTitle}
              description={article.description}
              category={article.category}
              readingTime={article.readingTime}
              coverColor={article.coverColor}
              datePublished={article.datePublished}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-400">Инструкции скоро появятся. Следите за обновлениями!</p>
        </div>
      )}

      {/* CTA блок */}
      <div className="mt-8 sm:mt-12 bg-gradient-to-r from-[#1e3a5f] to-[#2a5080] rounded-2xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Нужна помощь с подключением маркировки?
        </h2>
        <p className="text-white/70 text-sm sm:text-base mb-4 max-w-xl mx-auto">
          Бесплатная консультация по телефону или в чате. Подключим маркировку под ключ 
          за 1–3 дня в Санкт-Петербурге и Ленинградской области.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="tel:+78123210606"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8a817] hover:bg-[#d49a12] text-white font-bold rounded-xl transition-colors shadow-md"
          >
            +7 (812) 321-06-06
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl transition-colors"
          >
            Калькулятор маркировки →
          </a>
        </div>
      </div>
    </div>
  )
}
