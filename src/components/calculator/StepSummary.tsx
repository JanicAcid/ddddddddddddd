'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CreditCard, AlertTriangle, Mail, Phone } from 'lucide-react'
import type { TotalCalc } from './types'

interface StepSummaryProps {
  totalCalc: TotalCalc
  effectiveKkm: string
  effectiveKkmInfo: { name: string }
  kkmType: string
}

export function StepSummary({ totalCalc, effectiveKkm, effectiveKkmInfo, kkmType }: StepSummaryProps) {
  return (
    <>
      {/* ИТОГО */}
      <Card className="border-[#1e3a5f]/20 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-[#1e3a5f] text-sm sm:text-base"><CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />Расчёт стоимости</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            {totalCalc.items.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Отметьте услуги</p>
            ) : totalCalc.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="text-slate-600 leading-snug min-w-0">{item.name}</span>
                <span className="font-medium whitespace-nowrap shrink-0">{item.price.toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-base sm:text-lg">Итого:</span>
            <span className="font-bold text-xl sm:text-2xl text-[#1e3a5f]">{totalCalc.total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <p className="text-sm text-slate-400 mt-2">Касса: {effectiveKkmInfo.name}</p>
          <p className="text-xs text-slate-400">
            {effectiveKkm === 'sigma' || kkmType === 'evotor'
              ? 'ТС ПИоТ — отдельно. Подписка на смарт-терминале — у производителя'
              : 'ТС ПИоТ — оплачивается отдельно'
            }
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#1e3a5f]/5">
        <CardContent className="pt-4">
          <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[#e8a817] shrink-0" />Важно знать</h4>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600">
            <p>С <strong>01.07.2026</strong> продажа маркированных товаров без ТС ПИоТ запрещена (<strong>ст. 15.12 КоАП РФ</strong>)</p>
            <p>Лицензия ТС ПИоТ — на сайте <strong>ao-esp.ru</strong></p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <h4 className="font-semibold mb-3 text-sm">Контакты</h4>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600">
            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0" />push@tellur.spb.ru</p>
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" />+7 (812) 465-94-57</p>
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" />+7 (812) 451-80-18</p>
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" />+7 (812) 321-06-06</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
