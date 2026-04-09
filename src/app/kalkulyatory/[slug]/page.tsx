import Link from 'next/link'
import { ArrowLeft, Calculator, Clock } from 'lucide-react'

// ============================================================================
// Coming Soon — шаблон для будущих калькуляторов
// /kalkulyatory/[slug]/
// ============================================================================

interface PageProps {
  params: Promise<{ slug: string }>
}

const SLUG_NAMES: Record<string, string> = {
  '1c': '1С',
  'ofd': 'ОФД',
}

export default async function ComingSoonPage({ params }: PageProps) {
  const { slug } = await params
  const name = SLUG_NAMES[slug] || slug

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#1e3a5f]/5 flex items-center justify-center">
        <Calculator className="w-10 h-10 text-[#1e3a5f]/40" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] mb-3">
        Калькулятор {name}
      </h1>

      <p className="text-base sm:text-lg text-slate-500 mb-2">
        Калькулятор находится в разработке
      </p>
      <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
        Мы работаем над созданием удобного инструмента для расчёта стоимости.
        Следите за обновлениями или свяжитесь с нами для получения консультации.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/kalkulyatory"
          className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#1e3a5f]/20 text-[#1e3a5f] text-sm font-semibold rounded-xl hover:bg-[#1e3a5f] hover:text-white hover:border-[#1e3a5f] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Все калькуляторы
        </Link>
        <a
          href="tel:+78124659457"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e8a817] hover:bg-[#d49a12] text-white text-sm font-bold rounded-xl transition-colors"
        >
          <Clock className="w-4 h-4" />
          Позвонить
        </a>
      </div>
    </div>
  )
}
