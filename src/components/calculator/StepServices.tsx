'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, FileSignature, Settings2, Wrench } from 'lucide-react'
import { step2Services } from '@/config/services-step2'
import { OFD_PROVIDERS } from '@/config/ofd'
import type { OfdPeriod } from '@/config/ofd'
import type { KkmCondition, HintButtonProps } from './types'
import { HintButton } from './HintButton'

interface StepServicesProps {
  kkmCondition: KkmCondition
  kkmType: string
  step2Selections: string[]
  markingDesc: string
  clientData: { sellsExcise: boolean }
  ofdChecked: boolean
  ofdPeriod: OfdPeriod
  ofdProvider: string
  ofdLocked: boolean
  ofdEffective: boolean
  unsureFnsRegistration: boolean
  alreadyMarking: boolean
  canGoStep3: boolean
  // Setters
  setStep2Selections: (v: string[] | ((prev: string[]) => string[])) => void
  setOfdChecked: (v: boolean) => void
  setOfdPeriod: (v: OfdPeriod) => void
  setOfdProvider: (v: string) => void
  setClientData: (v: any) => void
  setUnsureFnsRegistration: (v: boolean) => void
  hintProps: HintButtonProps
  goToStep: (step: 1 | 2 | 3 | 4) => void
  setCurrentStep: (v: number) => void
  mainRef: React.RefObject<HTMLDivElement | null>
}

export function StepServices({
  kkmCondition, kkmType, step2Selections, markingDesc,
  clientData, ofdChecked, ofdPeriod, ofdProvider,
  ofdLocked, ofdEffective, unsureFnsRegistration, alreadyMarking, canGoStep3,
  setStep2Selections, setOfdChecked, setOfdPeriod, setOfdProvider,
  setClientData, setUnsureFnsRegistration,
  hintProps, goToStep, setCurrentStep, mainRef
}: StepServicesProps) {
  const isPartialMode = alreadyMarking || kkmCondition === 'old'

  return (
    <div className="max-w-2xl mx-auto space-y-2">

      {/* Подакцизные товары — выше всех */}
      {(step2Selections.includes('fns_reregistration') || kkmCondition === 'new' || isPartialMode) && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="">
            <div className="flex items-start gap-2">
              <Checkbox id="excise_check"
                checked={clientData.sellsExcise}
                onCheckedChange={(c) => {
                  const val = !!c
                  setClientData((prev: any) => ({ ...prev, sellsExcise: val }))
                  if (isPartialMode && val) {
                    setStep2Selections((prev: string[]) => {
                      if (prev.includes('fns_reregistration')) return prev
                      return [...prev, 'fns_reregistration']
                    })
                  }
                  if (isPartialMode && !val && !unsureFnsRegistration) {
                    setStep2Selections((prev: string[]) => prev.filter(x => x !== 'fns_reregistration'))
                  }
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <div className="flex-1 min-w-0">
                <Label htmlFor="excise_check" className="font-semibold text-sm cursor-pointer leading-snug text-orange-800">
                  Планируете продавать подакцизные товары?
                </Label>
                <p className="text-xs text-orange-600 mt-0.5">Алкоголь, табачная продукция, пиво — повлияет на выбор ФН и настройки</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Активные (доступные для выбора) услуги */}
      {step2Services.filter(s => {
        if (s.id === 'partial_marketing_setup' && !isPartialMode) return false
        // Полная настройка недоступна если уже работает с маркировкой
        if (s.id === 'marking_setup' && isPartialMode) return false
        // Перерегистрация: полностью скрыта для б/у, недоступна для новых (включена автоматически)
        if (kkmCondition === 'used' && s.id === 'fns_reregistration') return false
        const isLocked = kkmCondition === 'new' && s.id === 'fns_reregistration'
        const isMutuallyDisabled = (
          (s.id === 'partial_marketing_setup' && step2Selections.includes('marking_setup')) ||
          (s.id === 'marking_setup' && step2Selections.includes('partial_marketing_setup'))
        )
        // Перерегистрация для уже работающей кассы — только при подакцизных или галочке "не уверен"
        const isFnsBlockedForOld = isPartialMode && s.id === 'fns_reregistration' &&
          !clientData.sellsExcise && !unsureFnsRegistration
        return !isLocked && !isMutuallyDisabled && !isFnsBlockedForOld
      }).map((service, idx) => {
        const desc = service.id === 'marking_setup' ? markingDesc : service.description
        const selected = step2Selections.includes(service.id)
        const ServiceIcon = service.id === 'fns_reregistration' ? FileSignature : service.id === 'marking_setup' ? Settings2 : Wrench
        return (
          <Card key={service.id} className={selected ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
            <CardContent className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-start gap-2">
                {service.hintKey && <HintButton hintKey={service.hintKey} {...hintProps} />}
                <Checkbox id={service.id} checked={selected}
                  onCheckedChange={() => {
                    const mutuallyExclusive = service.id === 'marking_setup' ? 'partial_marketing_setup' : service.id === 'partial_marketing_setup' ? 'marking_setup' : null
                    setStep2Selections((prev: string[]) => {
                      const without = mutuallyExclusive ? prev.filter(x => x !== mutuallyExclusive) : prev
                      const isNowSelected = !without.includes(service.id)
                      const next = isNowSelected ? [...without, service.id] : without.filter(x => x !== service.id)
                      if (service.id === 'partial_marketing_setup' && isNowSelected) {
                        setUnsureFnsRegistration(false)
                        if (!clientData.sellsExcise) {
                          return next.filter(x => x !== 'fns_reregistration')
                        }
                      }
                      return next
                    })
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor={service.id} className="font-bold text-sm leading-snug cursor-pointer">{service.name}</Label>
                    <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm">{service.price.toLocaleString('ru-RU')} руб.</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  {service.id === 'partial_marketing_setup' && selected && (
                    <div className="mt-1.5 space-y-1.5">
                      <div className="p-1.5 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-xs text-orange-700 font-medium">⚠ Перерегистрация кассы в ФНС не включена — ответственность за корректность регистрации на Вас. Если касса уже зарегистрирована с признаками маркировки и форматом ФФД 1.2 — всё в порядке.</p>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200">
                        <Checkbox id="unsure_fns_reg"
                          checked={unsureFnsRegistration}
                          onCheckedChange={(c) => {
                            const val = c as boolean
                            setUnsureFnsRegistration(val)
                            if (val) {
                              setStep2Selections((prev: string[]) => {
                                if (prev.includes('fns_reregistration')) return prev
                                return [...prev, 'fns_reregistration']
                              })
                            } else if (!clientData.sellsExcise) {
                              setStep2Selections((prev: string[]) => prev.filter(x => x !== 'fns_reregistration'))
                            }
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
                        <Label htmlFor="unsure_fns_reg" className="cursor-pointer text-xs leading-snug">
                          Не уверен, верно ли зарегистрирована касса в ФНС
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* ОФД */}
      {(() => {
        // Для б/у касс — только Такском, для остальных — все кроме заблокированных для новых
        const visibleProviders = kkmCondition === 'used'
          ? OFD_PROVIDERS.filter(p => p.id === 'takskom')
          : OFD_PROVIDERS.filter(p => !p.lockedForNew || kkmCondition !== 'new')
        const selectedProvider = OFD_PROVIDERS.find(p => p.id === ofdProvider) || OFD_PROVIDERS[0]
        return (
          <Card className={ofdEffective ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
            <CardContent className="">
              <div className="flex items-start gap-2">
                <HintButton hintKey="ofd_takskom" {...hintProps} />
                <Checkbox id="ofd_check"
                  checked={ofdEffective}
                  disabled={ofdLocked}
                  onCheckedChange={(c) => setOfdChecked(c as boolean)}
                  className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <Label htmlFor="ofd_check" className={`font-bold text-sm cursor-pointer leading-snug ${ofdLocked ? 'text-[#1e3a5f]' : ''}`}>
                        ОФД (оператор фискальных данных)
                      </Label>
                      {selectedProvider.partner && <Badge className="bg-[#e8a817]/20 text-[#1e3a5f] text-xs shrink-0">Партнёр</Badge>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Обязательное подключение для работы кассы.{ofdLocked && ' Для новой кассы включено автоматически.'}
                  </p>
                  {ofdEffective && (
                    <div className="mt-1.5 space-y-1.5">
                      {visibleProviders.length > 1 && (
                        <RadioGroup value={ofdProvider} onValueChange={setOfdProvider} className="space-y-1.5">
                          {visibleProviders.map(provider => (
                            <div key={provider.id} className="flex items-center gap-2 p-1.5 bg-white rounded border border-[#1e3a5f]/10">
                              <RadioGroupItem value={provider.id} id={`ofd_${provider.id}`} />
                              <Label htmlFor={`ofd_${provider.id}`} className="flex-1 cursor-pointer text-xs">
                                <span className="font-medium text-[#1e3a5f]">{provider.name}</span>
                                {provider.partner && <Badge className="bg-[#e8a817]/20 text-[#1e3a5f] text-xs ml-2">Партнёр</Badge>}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      <RadioGroup value={ofdPeriod} onValueChange={(v) => setOfdPeriod(v as OfdPeriod)} className="space-y-1.5">
                        {(['15', '36'] as const).map(period => {
                          const info = selectedProvider.periods[period]
                          return (
                            <div key={period} className="flex items-center gap-2 p-1.5 bg-white rounded border border-[#1e3a5f]/10">
                              <RadioGroupItem value={period} id={`ofd_period_${period}`} />
                              <Label htmlFor={`ofd_period_${period}`} className="flex-1 cursor-pointer text-xs">
                                <span className="font-medium text-[#1e3a5f]">Договор на {period === '15' ? '15' : '36'} мес.</span>
                                <span className="ml-2 inline-flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-[#1e3a5f] text-xs">{info.price.toLocaleString('ru-RU')} ₽</span>
                                  <span className="text-slate-400 line-through text-xs">{info.originalPrice.toLocaleString('ru-RU')} ₽</span>
                                  <span className="text-xs text-green-600 font-medium">скидка</span>
                                </span>
                              </Label>
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })()}

      <div className="flex gap-4">
        <Button variant="outline" className="flex-1 py-4 text-base font-bold" size="lg" onClick={() => { setCurrentStep(1); setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }}><ArrowLeft className="w-5 h-5 mr-2" /> Назад</Button>
        <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-4 text-base font-bold" size="lg" onClick={() => goToStep(3)} disabled={!canGoStep3}>Далее <ArrowRight className="w-5 h-5 ml-2" /></Button>
      </div>
    </div>
  )
}
