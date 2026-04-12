// ============================================================================
// Страница отдельной статьи /instructions/[slug]
// ============================================================================

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Globe, Users, KeyRound, FileSignature, FileCheck, Settings,
  Clock, Calendar, Tag, Lightbulb, AlertTriangle, ChevronRight,
  ArrowLeft, Phone, MessageSquare, Calculator,
  Monitor, ShieldCheck, Cpu, List, ScanLine, Wrench, CheckCircle,
} from 'lucide-react'
import { getAllArticleSlugs, getArticleBySlug, getRelatedArticles } from '@/config/articles'
import { ArticleCard } from '@/components/instructions/ArticleCard'
import { TableOfContents } from '@/components/instructions/TableOfContents'
import { ArticleJsonLd } from '@/components/instructions/ArticleJsonLd'

const SITE_URL = 'https://kassa-cto.ru'

// ============================================================================
// Маппинг иконок — используем реальные lucide-react компоненты
// ============================================================================
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Users,
  KeyRound,
  FileSignature,
  FileCheck,
  Settings,
  Monitor,
  ShieldCheck,
  Cpu,
  List,
  ScanLine,
  Wrench,
  CheckCircle,
}

// ============================================================================
// Static params для pre-rendering всех статей
// ============================================================================
export function generateStaticParams() {
  return getAllArticleSlugs().map(slug => ({ slug }))
}

// ============================================================================
// Dynamic metadata для каждой статьи
// ============================================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}

  return {
    title: `${article.title} — Теллур-Интех`,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: `${SITE_URL}/instructions/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/instructions/${slug}`,
      siteName: 'Теллур-Интех',
      locale: 'ru_RU',
      type: 'article',
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: ['Теллур-Интех'],
      tags: [article.category, ...article.keywords.slice(0, 5)],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}

// ============================================================================
// Страница
// ============================================================================
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const relatedArticles = getRelatedArticles(slug)

  const tocItems = article.steps.map((step, i) => ({
    id: `step-${i + 1}`,
    title: step.title,
    step: i + 1,
  }))

  const dateFormatted = new Date(article.dateModified).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <ArticleJsonLd
        slug={article.slug}
        title={article.title}
        description={article.description}
        datePublished={article.datePublished}
        dateModified={article.dateModified}
        image="/logo.webp"
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 sm:mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#1e3a5f] transition-colors">Главная</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href="/instructions" className="hover:text-[#1e3a5f] transition-colors">Инструкции</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-[#1e3a5f] font-medium truncate max-w-[200px] sm:max-w-none">{article.shortTitle}</span>
        </nav>

        {/* Layout: content + sidebar */}
        <div className="flex gap-6 lg:gap-8">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            {/* Article header */}
            <header className="mb-6 sm:mb-8">
              {/* Обложка */}
              <div className={`h-48 sm:h-64 bg-gradient-to-br ${article.coverColor} rounded-2xl mb-5 sm:mb-6 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 text-center px-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-3">
                    {article.category}
                  </span>
                  <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-tight max-w-2xl mx-auto">
                    {article.shortTitle}
                  </h1>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {article.readingTime} мин. чтения
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Обновлено: {dateFormatted}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  {article.category}
                </span>
              </div>
            </header>

            {/* Введение */}
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                {article.description}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-6 sm:space-y-8">
              {article.steps.map((step, idx) => {
                const IconComponent = ICON_MAP[step.icon] || Settings
                const stepId = `step-${idx + 1}`

                return (
                  <section key={stepId} id={stepId} className="scroll-mt-20">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      {/* Шапка шага */}
                      <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                          {step.icon ? (
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          ) : (
                            <span className="text-white font-bold text-lg sm:text-xl">{idx + 1}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[#e8a817] font-extrabold text-sm">ШАГ {idx + 1}</span>
                          </div>
                          <h2 className="text-lg sm:text-xl font-bold text-[#1e3a5f] leading-snug">
                            {step.title}
                          </h2>
                        </div>
                      </div>

                      {/* Контент шага */}
                      <div className="p-4 sm:p-5">
                        <div
                          className="prose prose-slate max-w-none prose-headings:text-[#1e3a5f] prose-strong:text-slate-800 prose-a:text-[#1e3a5f] prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-li:marker:text-[#e8a817]"
                          dangerouslySetInnerHTML={{ __html: step.content }}
                        />

                        {/* Совет */}
                        {step.tip && (
                          <div className="mt-4 flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                            <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-emerald-800 mb-0.5">Полезный совет</p>
                              <p className="text-sm text-emerald-700 leading-relaxed">{step.tip}</p>
                            </div>
                          </div>
                        )}

                        {/* Предупреждение */}
                        {step.warning && (
                          <div className="mt-3 flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-100">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-amber-800 mb-0.5">Внимание</p>
                              <p className="text-sm text-amber-700 leading-relaxed">{step.warning}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>

            {/* CTA — нужна помощь */}
            <div className="mt-8 sm:mt-10 bg-gradient-to-r from-[#1e3a5f] to-[#2a5080] rounded-2xl p-6 sm:p-8">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Нужна помощь с подключением?
                </h2>
                <p className="text-white/70 text-sm sm:text-base mb-5 max-w-xl mx-auto">
                  Наши инженеры подключат маркировку под ключ за 1–3 дня. 
                  Бесплатная консультация по телефону.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="tel:+78123210606"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#e8a817] hover:bg-[#d49a12] text-white font-bold rounded-xl transition-colors shadow-md w-full sm:w-auto justify-center"
                  >
                    <Phone className="w-5 h-5" />
                    +7 (812) 321-06-06
                  </a>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl transition-colors w-full sm:w-auto justify-center"
                  >
                    <Calculator className="w-5 h-5" />
                    Калькулятор маркировки
                  </Link>
                </div>
              </div>
            </div>

            {/* Связанные статьи */}
            {relatedArticles.length > 0 && (
              <div className="mt-8 sm:mt-10">
                <h2 className="text-lg sm:text-xl font-bold text-[#1e3a5f] mb-4">
                  Другие инструкции
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.map(a => (
                    <ArticleCard
                      key={a.slug}
                      slug={a.slug}
                      title={a.shortTitle}
                      description={a.description}
                      category={a.category}
                      readingTime={a.readingTime}
                      coverColor={a.coverColor}
                      datePublished={a.datePublished}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Навигация назад */}
            <div className="mt-8 text-center">
              <Link
                href="/instructions"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Все инструкции
              </Link>
            </div>
          </article>

          {/* Sidebar — TOC (только desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <TableOfContents steps={tocItems} />

            {/* Мини-CTA в сайдбаре */}
            <div className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="text-sm font-bold text-[#1e3a5f] mb-2">Бесплатная консультация</p>
              <p className="text-xs text-slate-500 mb-3">
                Позвоните или напишите нам — поможем с подключением маркировки.
              </p>
              <a
                href="tel:+78123210606"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8a817] hover:bg-[#d49a12] text-white text-sm font-bold rounded-lg transition-colors w-full justify-center"
              >
                <Phone className="w-4 h-4" />
                Позвонить
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
