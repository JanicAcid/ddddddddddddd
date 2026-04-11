import Link from 'next/link'
import { ArrowLeft, Building2, Clock, ShieldCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { OpenChatButton } from '@/components/OpenChatButton'

// ============================================================================
// Диагностика ККТ — Проверка регистрации в ФНС (скоро)
// /diagnostika/fns
// ============================================================================

export default function FnsDiagnostikaPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: 'Диагностика', href: '/diagnostika' }, { label: 'Проверка ФНС' }]} />

      <div className="text-center mt-4">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#1e3a5f]/5 flex items-center justify-center">
          <Building2 className="w-10 h-10 text-[#1e3a5f]/40" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] mb-3">
          Проверка регистрации ККТ в ФНС
        </h1>

        <p className="text-base sm:text-lg text-slate-500 mb-2">
          Инструмент находится в разработке
        </p>
        <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
          Сможете проверить статус регистрации контрольно-кассовой техники в налоговой:
          корректность ФФД, подключение ОФД, срок действия ФН и актуальность реквизитов.
        </p>

        {/* Превью возможностей */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 mb-8 text-left">
          <h2 className="text-sm font-bold text-[#1e3a5f] mb-3">Что будет проверять инструмент:</h2>
          <div className="space-y-2.5">
            {[
              'Статус регистрации ККТ в ФНС',
              'Версия ФФД (1.05 / 1.2)',
              'Срок действия фискального накопителя',
              'Подключение и статус ОФД',
              'Признаки маркировки в карточке регистрации',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#e8a817] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/diagnostika"
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#1e3a5f]/20 text-[#1e3a5f] text-sm font-semibold rounded-xl hover:bg-[#1e3a5f] hover:text-white hover:border-[#1e3a5f] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Все диагностики
          </Link>
          <OpenChatButton
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e8a817] hover:bg-[#d49a12] text-white text-sm font-bold rounded-xl transition-colors"
          >
            <Clock className="w-4 h-4" />
            Проверить вручную
          </OpenChatButton>
        </div>
      </div>
    </div>
  )
}
