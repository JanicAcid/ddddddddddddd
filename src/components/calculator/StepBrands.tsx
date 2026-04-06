'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  ScanLine, Info, AlertCircle,
  Package, Wine, PackageOpen, ExternalLink,
  Download, BadgeCheck, Star, Handshake, ArrowRight
} from 'lucide-react'
import { KKM_BRANDS } from '@/config/brands'
import { sigmaTariffLink } from '@/config/services'
import type { KkmType, KkmCondition, HintButtonProps } from './types'
import { HintButton } from './HintButton'

interface StepBrandsProps {
  kkmType: KkmType
  kkmCondition: KkmCondition
  sigmaSelected: boolean
  evotorTradeType: 'none' | 'marking' | 'alcohol' | 'both'
  evotorAppsSelected: Set<string>
  evotorHasSubscription: boolean
  conditionFlash: boolean
  conditionRef: React.RefObject<HTMLDivElement | null>
  currentKkmInfo: { name: string; shortName: string; description: string; features: readonly string[]; hidden?: boolean; requiresLkCredentials?: boolean; specialNote?: any }
  visibleKkmTypes: [string, any][]
  effectiveKkm: KkmType
  showSigmaSubs: boolean
  sigmaSubsLocked: boolean
  needsFirmwareOrLicense: boolean
  fwPrices: { firmware: number; license: number }
  canGoStep2: boolean
  sigmaHelpChecked: boolean
  firmwareChecked: boolean
  licenseChecked: boolean
  effectiveKkmInfo: { name: string }
  alreadyMarking: boolean
  setAlreadyMarking: (v: boolean) => void
  // Setters
  setKkmType: (v: KkmType) => void
  setKkmCondition: (v: KkmCondition) => void
  setSigmaSelected: (v: boolean) => void
  setSigmaHelpChecked: (v: boolean) => void
  setEvotorTradeType: (v: 'none' | 'marking' | 'alcohol' | 'both') => void
  setEvotorHasSubscription: (v: boolean) => void
  setEvotorAppsSelected: (v: Set<string>) => void
  setScannerChecked: (v: boolean) => void
  setFirmwareChecked: (v: boolean) => void
  setLicenseChecked: (v: boolean) => void
  handleEvotorTradeType: (v: 'marking' | 'alcohol' | 'both') => void
  handleEvotorAppToggle: (appId: string) => void
  hintProps: HintButtonProps
  goToStep: (step: 1 | 2 | 3 | 4) => void
}

export function StepBrands({
  kkmType, kkmCondition, sigmaSelected,
  evotorTradeType, evotorAppsSelected, evotorHasSubscription,
  conditionFlash, conditionRef, currentKkmInfo, visibleKkmTypes,
  effectiveKkm, showSigmaSubs, sigmaSubsLocked, needsFirmwareOrLicense, fwPrices,
  canGoStep2, sigmaHelpChecked, firmwareChecked, licenseChecked, effectiveKkmInfo,
  alreadyMarking, setAlreadyMarking,
  setKkmType, setKkmCondition, setSigmaSelected, setSigmaHelpChecked,
  setEvotorTradeType, setEvotorHasSubscription, setEvotorAppsSelected,
  setScannerChecked, setFirmwareChecked, setLicenseChecked,
  handleEvotorTradeType, handleEvotorAppToggle,
  hintProps, goToStep
}: StepBrandsProps) {
  return (
    <div className="relative">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f]">Состояние кассы</h3>
            {/* Состояние кассы */}
            <div ref={conditionRef} id="condition-section" className={`rounded-lg transition-all duration-300 ${conditionFlash ? 'ring-4 ring-red-400/50 ring-offset-2' : ''}`}>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                <div
                  onClick={() => { setKkmCondition('old'); setScannerChecked(false) }}
                  className={`flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${kkmCondition === 'old' ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-xl bg-[#1e3a5f]/5 shrink-0">
                    <BadgeCheck className="w-12 h-12 sm:w-14 sm:h-14 text-[#1e3a5f]" />
                  </div>
                  <Label className={`cursor-pointer text-xs sm:text-sm font-bold text-center leading-tight ${kkmCondition === 'old' ? 'text-[#1e3a5f]' : 'text-slate-700'}`}>Текущая</Label>
                  <span className="text-[10px] text-slate-400 text-center leading-tight">Работаю на ней</span>
                </div>
                <div
                  onClick={() => { setKkmCondition('new'); setScannerChecked(true) }}
                  className={`flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${kkmCondition === 'new' ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-xl bg-[#e8a817]/10 shrink-0">
                    <Star className="w-12 h-12 sm:w-14 sm:h-14 text-[#e8a817]" />
                  </div>
                  <Label htmlFor="cond_new" className={`cursor-pointer text-xs sm:text-sm font-bold text-center leading-tight ${kkmCondition === 'new' ? 'text-[#1e3a5f]' : 'text-slate-700'}`}>Новая</Label>
                  <span className="text-[10px] text-slate-400 text-center leading-tight">Только что купленная</span>
                </div>
                <div
                  onClick={() => { setKkmCondition('used'); setScannerChecked(true) }}
                  className={`flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${kkmCondition === 'used' ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-xl bg-[#1e3a5f]/5 shrink-0">
                    <Handshake className="w-12 h-12 sm:w-14 sm:h-14 text-[#1e3a5f]" />
                  </div>
                  <Label className={`cursor-pointer text-xs sm:text-sm font-bold text-center leading-tight ${kkmCondition === 'used' ? 'text-[#1e3a5f]' : 'text-slate-700'}`}>Б/у</Label>
                  <span className="text-[10px] text-slate-400 text-center leading-tight">Купил с рук</span>
                </div>
              </div>
            </div>

            {kkmCondition === 'new' && (
              <div className="p-2.5 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-[#1e3a5f]">
                  <Info className="w-4 h-4 shrink-0" />
                  <span className="font-medium">Для новой кассы обязательны: регистрация в ФНС и подключение ОФД — учтены ниже в расчёте</span>
                </div>
              </div>
            )}

            {/* Галочка «Я уже работаю с маркированным товаром» */}
            {kkmCondition === 'old' && (
              <div className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors ${alreadyMarking ? 'bg-green-50 border-green-200' : 'bg-[#1e3a5f]/5 border-[#1e3a5f]/20'}`}>
                <Checkbox id="already_marking"
                  checked={alreadyMarking}
                  onCheckedChange={(c) => {
                    const val = !!c
                    setAlreadyMarking(val)
                    if (!val) {
                      setEvotorHasSubscription(false)
                    }
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                <div className="flex-1 min-w-0">
                  <Label htmlFor="already_marking" className="cursor-pointer font-medium text-sm leading-snug text-[#1e3a5f]">
                    Я уже работаю с маркированным товаром
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5">Отметьте, если касса уже настроена для маркировки и Вам нужно подключить дополнительные модули, добавить алкоголь или устранить проблемы.</p>
                </div>
              </div>
            )}

            {/* Разделитель */}
            <Separator />

            {/* Заголовок перед брендами */}
            <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f]">Выберите Вашу кассу</h3>

            {/* Сетка касс */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              {visibleKkmTypes.map(([key, kkm]) => {
                const brand = KKM_BRANDS[key] || { color: '#64748b', bg: '#64748b' }
                const isSelected = kkmType === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setKkmType(key as KkmType)}
                    className={`relative flex flex-col items-center justify-start gap-3 rounded-xl border-2 pt-8 pb-5 sm:pt-9 sm:pb-6 transition-all duration-200 cursor-pointer group ${isSelected ? 'bg-white' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    style={isSelected ? { borderColor: brand.color } : undefined}
                  >
                    <span className={`text-xs sm:text-sm font-medium leading-none order-first ${isSelected ? 'text-[#1e3a5f]' : 'text-slate-400 group-hover:text-slate-500'} transition-colors`}>{kkm.shortName}</span>
                    <div className="relative h-[52px] sm:h-[58px] w-full">
                      <Image src={`/brands/${key}.webp`} alt={kkm.shortName} fill className="object-contain opacity-85" quality={100} unoptimized sizes="(max-width: 640px) 30vw, 200px" />
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Кнопка «Другой производитель» */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-chat'))}
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#1e3a5f] bg-transparent hover:bg-[#1e3a5f]/[0.02] text-sm font-medium text-slate-500 hover:text-[#1e3a5f] transition-all duration-200 cursor-pointer group"
            >
              <Info className="w-4 h-4 shrink-0 group-hover:text-[#e8a817]" />
              <span>Здесь нет моего производителя</span>
              <span className="text-xs text-slate-400 group-hover:text-slate-500 hidden sm:inline">— напишите нам</span>
            </button>

            {kkmType === 'atol' && (
              <div className="p-2.5 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Checkbox id="sigmaCheck" checked={sigmaSelected} onCheckedChange={(c) => setSigmaSelected(c as boolean)} className="w-8 h-8 shrink-0" />
                  <div className="min-w-0">
                    <Label htmlFor="sigmaCheck" className="cursor-pointer font-medium text-[#1e3a5f] text-sm">У меня касса Сигма (производство Атол)</Label>
                    <p className="text-xs text-slate-500 mt-0.5">Смарт-терминалы под брендом Сигма выпускаются компанией Атол</p>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================================ */}
            {/* ВИД ДЕЯТЕЛЬНОСТИ — для ВСЕХ типов касс (кроме уже работающих с маркировкой) */}
            {/* ============================================================================ */}
            {kkmType !== '' && kkmCondition !== '' && !alreadyMarking && (
              <div className="p-2.5 sm:p-3 bg-[#e8a817]/5 border border-[#e8a817]/30 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <ScanLine className="w-5 h-5 text-[#e8a817] shrink-0" />
                  <p className="font-semibold text-[#1e3a5f] text-sm">Чем планируете торговать?</p>
                </div>
                <p className="text-xs text-slate-500">Выберите категорию — это поможет подобрать нужные услуги и настройки.</p>
                <RadioGroup value={evotorTradeType === 'none' ? '' : evotorTradeType} onValueChange={(v) => handleEvotorTradeType(v as 'marking' | 'alcohol' | 'both')} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="marking" id="trade_marking_all" />
                    <Package className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                    <Label htmlFor="trade_marking_all" className="cursor-pointer text-sm">Маркированные товары (сигареты, обувь, вода и т.д.)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alcohol" id="trade_alcohol_all" />
                    <Wine className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                    <Label htmlFor="trade_alcohol_all" className="cursor-pointer text-sm">Алкоголь (пиво, вино, крепкий алкоголь)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="trade_both_all" />
                    <PackageOpen className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                    <Label htmlFor="trade_both_all" className="cursor-pointer text-sm">Маркированные товары + алкоголь</Label>
                  </div>
                </RadioGroup>
                {kkmType === 'evotor' && (
                  <a href="https://market.evotor.ru/store/apps/a50741fb-6e03-4e57-93da-00fdc5647a5a" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#1e3a5f] hover:underline font-medium">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    Приложение «Продажа табака» в магазине Эвотор
                  </a>
                )}
                {evotorTradeType === 'none' && evotorAppsSelected.size === 0 && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />Выберите вид деятельности, чтобы продолжить</p>
                )}
              </div>
            )}

            {/* ============================================================================ */}
            {/* СИГМА — подписки Атол */}
            {/* ============================================================================ */}
            {showSigmaSubs && (
              <>
                {/* Для новых и б/у — информация о подписке Сигма */}
                {(kkmCondition === 'new' || kkmCondition === 'used') && !evotorHasSubscription && (
                <div className="p-2.5 sm:p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg space-y-3">
                  <p className="font-medium text-[#1e3a5f] text-sm">Подписка на Сигма оформляется на официальном сайте</p>
                  <p className="text-sm text-slate-600">Для работы кассы Сигма необходимо оформить один из трёх тарифов на <a href={sigmaTariffLink} target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] underline hover:no-underline font-medium">sigma.ru</a>. Подписка оплачивается напрямую у Сигма и включает автообновление.</p>
                  <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-[#1e3a5f]/10">
                    <Checkbox id="sigma_help" checked={sigmaHelpChecked}
                      onCheckedChange={(c) => setSigmaHelpChecked(c as boolean)}
                      className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor="sigma_help" className="cursor-pointer font-medium text-[#1e3a5f] text-sm leading-snug">
                        Помощь с оформлением тарифа + восстановление доступа к кабинету Сигма
                      </Label>
                      <p className="text-xs text-slate-500 mt-0.5">Если нет доступа к личному кабинету Сигма — восстановим логин/пароль и поможем подобрать и оформить подходящий тариф.</p>
                      <span className="text-sm font-bold text-[#1e3a5f]">500 руб.</span>
                    </div>
                  </div>
                </div>
                )}

                {/* Для действующей — галочка «имеется подписка» */}
                {kkmCondition === 'old' && (
                  <div className="p-2.5 sm:p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg space-y-3">
                    <p className="font-medium text-[#1e3a5f] text-sm">Что нужно подключить на действующей кассе?</p>
                    <div className="flex items-start gap-2.5 p-2.5 bg-white rounded border border-[#1e3a5f]/10">
                      <Checkbox id="sigma_has_sub" checked={evotorHasSubscription}
                        onCheckedChange={(c) => {
                          const checked = c as boolean
                          setEvotorHasSubscription(checked)
                          if (checked) {
                            setEvotorTradeType('marking')
                            setEvotorAppsSelected(new Set(['marking']))
                            setAlreadyMarking(true)
                          } else {
                            setEvotorTradeType('none')
                            setEvotorAppsSelected(new Set())
                          }
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="sigma_has_sub" className="cursor-pointer font-medium text-[#1e3a5f] text-sm leading-snug">
                          У меня уже есть оплаченный тариф Сигма
                        </Label>
                        <p className="text-xs text-slate-500 mt-0.5">Отметьте, если на кассе Сигма уже оформлен тариф. Мы настроим связь с Честный ЗНАК, ЭДО и ТС ПИоТ.</p>
                      </div>
                    </div>
                    {evotorHasSubscription && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <button type="button" onClick={(e) => { e.stopPropagation(); hintProps.onHintOpen('tspiot') }}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-200/60 text-amber-800 text-xs font-bold shrink-0">?</button>
                        <span className="text-xs text-amber-700">Могут потребоваться и другие приложения — уточните у менеджера!</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ============================================================================ */}
            {/* ЭВOTOR — подписки + приложения */}
            {/* ============================================================================ */}
            {kkmType === 'evotor' && currentKkmInfo.specialNote?.apps && (
              <>
                {/* Для действующей — галочка «имеется подписка» */}
                {kkmCondition === 'old' && (
                  <div className="p-2.5 sm:p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg space-y-3">
                    <p className="font-medium text-[#1e3a5f] text-sm">Что нужно подключить на действующей кассе?</p>
                    <div className="flex items-start gap-2.5 p-2.5 bg-white rounded border border-[#1e3a5f]/10">
                      <Checkbox id="evotor_has_sub" checked={evotorHasSubscription}
                        onCheckedChange={(c) => {
                          const checked = c as boolean
                          setEvotorHasSubscription(checked)
                          if (checked) {
                            setEvotorTradeType('marking')
                            setEvotorAppsSelected(new Set(['marking']))
                            setAlreadyMarking(true)
                          } else {
                            setEvotorTradeType('none')
                            setEvotorAppsSelected(new Set())
                          }
                        }}
                        className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor="evotor_has_sub" className="cursor-pointer font-medium text-[#1e3a5f] text-sm leading-snug">
                          У меня уже есть текущая подписка на приложение Эвотор для маркировки
                        </Label>
                        <p className="text-xs text-slate-500 mt-0.5">Отметьте, если на кассе уже установлено и оплачено приложение «Маркировка». Мы настроим связь с Честный ЗНАК, ЭДО и ТС ПИоТ.</p>
                      </div>
                    </div>
                    {evotorHasSubscription && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <button type="button" onClick={(e) => { e.stopPropagation(); hintProps.onHintOpen('tspiot') }}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-200/60 text-amber-800 text-xs font-bold shrink-0">?</button>
                        <span className="text-xs text-amber-700">Могут потребоваться и другие приложения — уточните у менеджера!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Список приложений Эвотор (когда нет текущей подписки) */}
                {!evotorHasSubscription && (
                <div className="p-2.5 sm:p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg space-y-3">
                  <p className="font-medium text-[#1e3a5f] text-sm">{currentKkmInfo.specialNote.title}</p>
                  <p className="text-sm text-slate-600">{currentKkmInfo.specialNote.content}</p>
                  {currentKkmInfo.specialNote.apps.map((app, idx) => {
                    const appKey = app.name.includes('\u041c\u0430\u0440\u043a\u0438\u0440\u043e\u0432\u043a\u0430') ? 'marking' : app.name.includes('\u0423\u0422\u041c') ? 'utm' : app.name.includes('\u0442\u0430\u0431\u0430\u043a\u0430') ? 'tobacco' : `opt_${idx}`
                    const isSelected = evotorAppsSelected.has(appKey)
                    const canToggle = !evotorHasSubscription
                    return (
                      <div key={idx} className={`p-3 sm:p-4 bg-white rounded-lg border ${isSelected ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'} ${canToggle ? 'cursor-pointer hover:border-slate-300 transition-colors' : ''}`} style={{ animationDelay: `${idx * 50}ms` }}
                        onClick={() => canToggle ? handleEvotorAppToggle(appKey) : undefined}>
                        <div className="flex items-start gap-2">
                          {canToggle && (
                            <Checkbox checked={isSelected} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 pointer-events-none" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-[#1e3a5f] text-sm">{app.name}</p>
                              {app.required
                                ? <Badge className="bg-[#e8a817]/20 text-[#1e3a5f] text-xs">Обязательно</Badge>
                                : <Badge variant="outline" className="text-slate-500 text-xs">Опционально</Badge>
                              }
                              {isSelected && <Badge className="bg-green-100 text-green-700 text-xs">Выбрано</Badge>}
                            </div>
                            <p className="text-sm text-slate-600 mt-0.5">{app.purpose}</p>
                            {app.condition && <p className="text-xs text-slate-500 mt-0.5">({app.condition})</p>}
                            <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1e3a5f] flex items-center gap-1 mt-1 hover:underline"
                              onClick={(e) => e.stopPropagation()}>
                              <ExternalLink className="w-3 h-3 shrink-0" /><span className="break-all">Страница приложения в магазине Эвотор</span>
                            </a>
                            {app.price != null && (
                              <p className="text-sm font-semibold text-[#1e3a5f] mt-1">{app.price.toLocaleString('ru-RU')} руб.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                )}
              </>
            )}

            {/* Атол — согласие для действующих касс */}
            {kkmType === 'atol' && !sigmaSelected && kkmCondition === 'old' && (
              <div className="p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-blue-800 text-sm">Согласие для добавления в партнёрский кабинет Атол</p>
                    <p className="text-xs text-blue-600 mt-1">Для обслуживания Вашей кассы Атол нам нужно добавить её в наш партнёрский кабинет. Для этого требуется Ваше согласие — скачайте, заполните и подпишите. Укажите наш код партнёра <strong>9331</strong> в заявлении. Можете подготовить заранее или наш инженер поможет при обращении.</p>
                    <a
                      href="/soglasiye-atol.pdf"
                      download
                      className="inline-flex items-center gap-2 mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Скачать согласие (PDF)
                    </a>
                  </div>
                </div>
              </div>
            )}

            {needsFirmwareOrLicense && (
              <div className="p-2.5 sm:p-3 bg-[#e8a817]/10 border border-[#e8a817]/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-[#e8a817] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1e3a5f] text-sm">Для {kkmCondition === 'used' ? 'б/у' : 'старой'} кассы {effectiveKkmInfo.name} могут потребоваться:</p>
                    <div className="mt-2 space-y-1.5 text-sm text-slate-700">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 p-2 bg-white rounded border border-[#e8a817]/20">
                        <div className="flex items-center gap-2">
                          <HintButton hintKey="firmware_update" {...hintProps} />
                          <Checkbox id="firmware_chk" checked={firmwareChecked} onCheckedChange={(c) => setFirmwareChecked(c as boolean)} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                          <Label htmlFor="firmware_chk" className="cursor-pointer text-sm font-medium">Обновление программы (прошивка)</Label>
                        </div>
                        <span className="font-semibold text-[#1e3a5f] sm:whitespace-nowrap sm:ml-auto">{fwPrices.firmware.toLocaleString('ru-RU')} руб.</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 p-2 bg-white rounded border border-[#e8a817]/20">
                        <div className="flex items-center gap-2">
                          <HintButton hintKey="kkm_license" {...hintProps} />
                          <Checkbox id="license_chk" checked={licenseChecked} onCheckedChange={(c) => setLicenseChecked(c as boolean)} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                          <Label htmlFor="license_chk" className="cursor-pointer text-sm font-medium">Лицензия на ПО кассы</Label>
                        </div>
                        <span className="font-semibold text-[#1e3a5f] sm:whitespace-nowrap sm:ml-auto">{fwPrices.license.toLocaleString('ru-RU')} руб.</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Отметьте то, что нужно. Если не уверены — мы проверим при осмотре кассы.</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Button className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-5 sm:py-6 text-lg sm:text-xl font-bold" size="lg" onClick={() => goToStep(2)} disabled={!canGoStep2}>
          Далее — выбор услуг <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
