'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Info, Check, Phone } from 'lucide-react'
import {
  kkmTypes, scannerPrices, firmwareLicensePrices, sigmaTariffLink,
  type KkmType
} from '@/config/services'
import { step2Services } from '@/config/services-step2'
import { step3Services } from '@/config/services-step3'
import { OFD_PROVIDERS } from '@/config/ofd'
import { getProductCardPrice } from '@/config/product-cards'
import type { Step, KkmCondition, ClientData, TotalCalc, HintButtonProps } from '@/components/calculator/types'
import { HintButton } from '@/components/calculator/HintButton'
import { DoneScreen, generateOrderHtml } from '@/components/calculator/DoneScreen'
import { StepBrands } from '@/components/calculator/StepBrands'
import { StepServices } from '@/components/calculator/StepServices'
import { StepExtra } from '@/components/calculator/StepExtra'
import { StepSummary } from '@/components/calculator/StepSummary'
import { SeoContent } from '@/components/SeoContent'

// ============================================================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================================================

export default function TellurServiceCalculator() {
  const mainRef = useRef<HTMLDivElement>(null)
  const conditionRef = useRef<HTMLDivElement>(null)
  const [conditionFlash, setConditionFlash] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isDone, setIsDone] = useState(false)
  const [kkmType, setKkmType] = useState<KkmType>('' as KkmType)
  const [kkmCondition, setKkmCondition] = useState<KkmCondition>('' as KkmCondition)
  const [sigmaSelected, setSigmaSelected] = useState(false)
  const [evotorTradeType, setEvotorTradeType] = useState<'none' | 'marking' | 'alcohol' | 'both'>('none')
  const [evotorAppsSelected, setEvotorAppsSelected] = useState<Set<string>>(new Set())
  const [evotorHasSubscription, setEvotorHasSubscription] = useState(false)
  const [step2Selections, setStep2Selections] = useState<string[]>([])
  const [step3Selections, setStep3Selections] = useState<string[]>([])
  const [trainingHours, setTrainingHours] = useState(1)
  const [productCardCount, setProductCardCount] = useState(0)
  const [scannerChecked, setScannerChecked] = useState(false)
  const [firmwareChecked, setFirmwareChecked] = useState(false)
  const [licenseChecked, setLicenseChecked] = useState(false)
  const [evotorRestore, setEvotorRestore] = useState(false)
  const [ofdChecked, setOfdChecked] = useState(false)
  const [ofdPeriod, setOfdPeriod] = useState<'15' | '36'>('15')
  const [ofdProvider, setOfdProvider] = useState('takskom')
  const [fnChecked, setFnChecked] = useState(false)
  const [fnPeriod, setFnPeriod] = useState<'15' | '36'>('15')
  const [fnActivityType, setFnActivityType] = useState('general')
  // Сигма — 3 тарифа, оплачиваются отдельно на sigma.ru/tarify/
  const [sigmaHelpChecked, setSigmaHelpChecked] = useState(false)
  const [unsureFnsRegistration, setUnsureFnsRegistration] = useState(false)
  const [alreadyMarking, setAlreadyMarking] = useState(false)
  const [serviceContractChecked, setServiceContractChecked] = useState(false)
  const [serviceContractPeriod, setServiceContractPeriod] = useState<'month' | 'year'>('month')

  const [clientData, setClientData] = useState<ClientData>({
    name: '', inn: '', phone: '', email: '', address: '',
    kkmModel: '', kkmNumber: '', fnNumber: '', comment: '',
    evotorLogin: '', evotorPassword: '', hasEcp: false,
    fnActivityType: '', sellsExcise: false
  })

  const [showBanner, setShowBanner] = useState(true)
  const [activeHint, setActiveHint] = useState<string | null>(null)
  const handleHintOpen = useCallback((key: string) => setActiveHint(key), [])
  const handleHintClose = useCallback(() => setActiveHint(null), [])

  const hintProps: HintButtonProps = { activeHint, onHintOpen: handleHintOpen, onHintClose: handleHintClose }

  // Авто-скрытие баннера ТС ПИоТ через 1 минуту
  useEffect(() => {
    if (!showBanner) return
    const timer = setTimeout(() => setShowBanner(false), 60000)
    return () => clearTimeout(timer)
  }, [showBanner])

  const effectiveKkm: KkmType = (kkmType === 'atol' && sigmaSelected) ? 'sigma' : kkmType
  const currentKkmInfo = kkmType && kkmTypes[kkmType] ? kkmTypes[kkmType] : { name: '', shortName: '', description: '', features: [], hidden: false }
  const effectiveKkmInfo = effectiveKkm && kkmTypes[effectiveKkm] ? kkmTypes[effectiveKkm] : { name: '', shortName: '', description: '', features: [], hidden: false }
  const visibleKkmTypes = Object.entries(kkmTypes).filter(([_, kkm]) => !kkm.hidden)

  const needsFirmwareOrLicense = kkmCondition !== '' && kkmCondition !== 'new' && kkmType !== '' && kkmType !== 'evotor' && effectiveKkm !== 'sigma'
  const fwPrices = effectiveKkm && firmwareLicensePrices[effectiveKkm] ? firmwareLicensePrices[effectiveKkm] : { firmware: 0, license: 0 }

  // Сигма подписки: обязательна для новых касс, опциональна для старых/БУ
  const sigmaSubsLocked = effectiveKkm === 'sigma' && kkmCondition === 'new'
  const showSigmaSubs = effectiveKkm === 'sigma'

  // Новая касса: ОФД обязательно, б/у и старые: по умолчанию включено, можно снять
  const ofdLocked = kkmCondition === 'new' || kkmCondition === 'used'
  const ofdEffective = ofdLocked || ofdChecked

  // Валидация
  const contactValid = clientData.phone.trim() !== ''
  // Для ВСЕХ касс: нужно выбрать вид деятельности (кроме уже работающих с маркировкой)
  const needsActivityType = kkmCondition !== '' && !alreadyMarking
  const activityTypeReady = !needsActivityType || evotorTradeType !== 'none' || evotorAppsSelected.size > 0
  const canGoStep2 = kkmType !== '' && kkmCondition !== '' && activityTypeReady
  const canGoStep3 = step2Selections.length > 0

  // --- Синхронизация торгового типа и приложений Эвотор ---
  const handleEvotorTradeType = useCallback((tradeType: 'marking' | 'alcohol' | 'both') => {
    setEvotorTradeType(tradeType)
    setEvotorAppsSelected(prev => {
      const next = new Set(prev)
      // Добавляем обязательные приложения по типу торговли
      if (tradeType === 'marking' || tradeType === 'both') {
        next.add('marking')
        next.add('tobacco')
      } else {
        next.delete('marking')
        next.delete('tobacco')
      }
      if (tradeType === 'alcohol' || tradeType === 'both') next.add('utm')
      else next.delete('utm')
      // Опциональные приложения оставляем как были
      return next
    })
  }, [])

  const handleEvotorAppToggle = useCallback((appId: string) => {
    setEvotorAppsSelected(prev => {
      const next = new Set(prev)
      if (next.has(appId)) next.delete(appId)
      else next.add(appId)
      // Обратная синхронизация типа торговли по выбранным приложениям
      const hasMarking = next.has('marking') || next.has('tobacco')
      const hasUtm = next.has('utm')
      if (hasMarking && hasUtm) setEvotorTradeType('both')
      else if (hasMarking) setEvotorTradeType('marking')
      else if (hasUtm) setEvotorTradeType('alcohol')
      else setEvotorTradeType('none')
      return next
    })
  }, [])

  // Автоматическая постановка галочек в step2 на основе состояния
  useEffect(() => {
    const isSmartTerminal = kkmType === 'evotor' || effectiveKkm === 'sigma'
    const isPartialMode = alreadyMarking  // только если галочка «уже работаю» нажата
    const isRegistrationMode = kkmCondition === 'old' && !alreadyMarking  // текущая касса, но нужно подключить маркировку

    // Определяем наличие маркировки и алкоголя
    let hasMarking = false
    let hasAlcohol = false
    if (isSmartTerminal) {
      hasMarking = evotorTradeType === 'marking' || evotorTradeType === 'both' || evotorAppsSelected.has('marking') || evotorAppsSelected.has('tobacco')
      hasAlcohol = evotorTradeType === 'alcohol' || evotorTradeType === 'both' || evotorAppsSelected.has('utm')
    } else {
      // Для не-смарт терминалов: используем выбранный вид деятельности
      hasMarking = evotorTradeType === 'marking' || evotorTradeType === 'both'
      hasAlcohol = evotorTradeType === 'alcohol' || evotorTradeType === 'both' || clientData.sellsExcise
    }

    // Авто-установка sellsExcise при выборе алкоголя
    if (hasAlcohol && !clientData.sellsExcise) {
      setClientData(prev => ({ ...prev, sellsExcise: true }))
    }

    // Не-смарт терминал без маркировки/алкоголя — не ставим ничего автоматически
    if (!isSmartTerminal && !hasMarking && !hasAlcohol && !isPartialMode && !isRegistrationMode) return

    setStep2Selections(prev => {
      const next = new Set(prev)

      // ====== УЖЕ РАБОТАЕТ С МАРКИРОВКОЙ (галочка нажата) ======
      if (isPartialMode) {
        // Частичная настройка — клиент уже работает с маркировкой
        next.delete('marking_setup')
        if (!next.has('partial_marketing_setup')) next.add('partial_marketing_setup')

        if (hasAlcohol) {
          if (!next.has('fns_reregistration')) next.add('fns_reregistration')
        } else {
          if (!unsureFnsRegistration) next.delete('fns_reregistration')
        }
        return [...next]
      }

      // ====== ТЕКУЩАЯ КАССА: НУЖНО ПОДКЛЮЧИТЬ МАРКИРОВКУ ======
      if (isRegistrationMode) {
        next.delete('partial_marketing_setup')
        if (!next.has('marking_setup')) next.add('marking_setup')
        if (!next.has('fns_reregistration')) next.add('fns_reregistration')
        return [...next]
      }

      // ====== НОВАЯ / Б/У КАССА ======
      // Убираем partial если ушли из режима «уже работает»
      if (!isPartialMode) {
        next.delete('partial_marketing_setup')
      }

      // Для новой/б/у кассы: регистрация обязательна
      if (kkmCondition === 'new' || kkmCondition === 'used') {
        if (!next.has('fns_reregistration')) next.add('fns_reregistration')
        // Полная маркировка — если выбран вид деятельности с маркировкой
        if (hasMarking) {
          if (!next.has('marking_setup') && !next.has('partial_marketing_setup')) next.add('marking_setup')
        }
      }

      return [...next]
    })
  }, [kkmType, effectiveKkm, evotorTradeType, evotorAppsSelected, kkmCondition, clientData.sellsExcise, alreadyMarking, unsureFnsRegistration])

  const markingDesc = useMemo(() => {
    if (kkmType === 'evotor') return 'Связываем ЭДО, Честный ЗНАК, кассу Эвотор, ТС ПИоТ и личный кабинет Эвотор в единую цепочку — от приёмки товара до пробития чека'
    return 'Связываем ЭДО, Честный ЗНАК, Вашу кассу и ТС ПИоТ в единую цепочку — от приёмки товара до пробития чека'
  }, [kkmType])

  const totalCalc = useMemo((): TotalCalc => {
    const items: { name: string; price: number }[] = []

    step2Services.forEach(s => {
      if (step2Selections.includes(s.id)) {
        const displayName = s.id === 'fns_reregistration' && (kkmCondition === 'new' || kkmCondition === 'used')
          ? 'Регистрация ККТ в ФНС'
          : s.name
        items.push({ name: displayName, price: s.price })
      }
    })

    step3Services.forEach(s => {
      if (step3Selections.includes(s.id)) {
        if (s.id === 'training') items.push({ name: s.name, price: s.price * trainingHours })
        else items.push({ name: s.name, price: s.price })
      }
    })

    // ФН — фискальный накопитель
    if (fnChecked) {
      items.push({ name: `Фискальный накопитель (ФН) — ${fnPeriod === '15' ? '15' : '36'} мес. (вид: ${fnActivityType === 'general' ? 'общая торговля' : 'подакцизная продукция'}) — цена уточняется менеджером`, price: 0 })
    }

    // ОФД
    if (ofdEffective) {
      const provider = OFD_PROVIDERS.find(p => p.id === ofdProvider) || OFD_PROVIDERS[0]
      const periodInfo = provider.periods[ofdPeriod]
      items.push({ name: `${provider.name} — договор на ${ofdPeriod === '15' ? '15' : '36'} мес.`, price: periodInfo.price })
    }

    if (scannerChecked) items.push({ name: 'Сканер 2D для считывания кодов маркировки', price: scannerPrices[effectiveKkm] })
    if (firmwareChecked) items.push({ name: 'Обновление программного обеспечения кассы', price: fwPrices.firmware })
    if (licenseChecked) items.push({ name: 'Лицензия на ПО кассы', price: fwPrices.license })
    if (evotorRestore) items.push({ name: 'Восстановление доступа к ЛК Эвотор', price: 500 })

    if (productCardCount > 0) {
      const p = getProductCardPrice(productCardCount)
      items.push({ name: `Создание карточек товаров (${productCardCount} шт.)`, price: p * productCardCount })
    }

    // Договор обслуживания
    if (serviceContractChecked) {
      if (serviceContractPeriod === 'month') {
        items.push({ name: 'Договор обслуживания — помесячная оплата', price: 1000 })
      } else {
        items.push({ name: 'Договор обслуживания — подписка на 12 месяцев', price: 10000 })
      }
    }

    // Сигма — помощь с оформлением тарифа и восстановлением доступа к кабинету
    if (effectiveKkm === 'sigma' && sigmaHelpChecked) {
      items.push({ name: 'Оформление тарифа Сигма + восстановление доступа к кабинету', price: 500 })
    }

    return { items, total: items.reduce((sum, i) => sum + i.price, 0) }
  }, [step2Selections, step3Selections, scannerChecked, firmwareChecked, licenseChecked, evotorRestore, productCardCount, trainingHours, effectiveKkm, fwPrices, kkmCondition, ofdEffective, ofdPeriod, ofdProvider, fnChecked, fnPeriod, fnActivityType, evotorAppsSelected, sigmaHelpChecked, serviceContractChecked, serviceContractPeriod])

  const goToStep = (step: Step) => {
    if (step === 2 && !canGoStep2) return
    if (step === 3 && !canGoStep3) return
    setCurrentStep(step)
    setIsDone(false)
    // Авто-скролл наверх при смене шага
    setTimeout(() => {
      mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  // Сброс торгового типа при смене типа кассы или состояния
  useEffect(() => {
    setEvotorTradeType('none')
    setEvotorAppsSelected(new Set())
    setEvotorHasSubscription(false)
    // Для б/у касс — сбрасываем ОФД на Такском
    if (kkmCondition === 'used' && ofdProvider !== 'takskom') setOfdProvider('takskom')
  }, [kkmType, kkmCondition])

  // ---- Печать ----
  const handlePrint = () => {
    const printContent = generateOrderHtml({
      effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc,
      step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration,
      includeChecklist: false
    })
    const printWithScript = printContent.replace('</body>', '<script>window.print();</script></body>')
    const w = window.open('', '_blank')
    if (w) { w.document.write(printWithScript); w.document.close() }
  }

  // ---- Готово ----
  const handleDone = () => {
    setIsDone(true); setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  // ---- Полный сброс ----
  const handleReset = () => {
    // Шаг 1 — касса
    setKkmType('' as KkmType); setKkmCondition('' as KkmCondition); setSigmaSelected(false);
    setEvotorTradeType('none'); setEvotorAppsSelected(new Set()); setEvotorHasSubscription(false);
    setAlreadyMarking(false); setUnsureFnsRegistration(false);
    // Шаг 2 — услуги
    setStep2Selections([]); setOfdChecked(false); setOfdPeriod('15'); setOfdProvider('takskom');
    // Шаг 3 — дополнительно
    setStep3Selections([]); setScannerChecked(false); setProductCardCount(0); setTrainingHours(1);
    setFirmwareChecked(false); setLicenseChecked(false); setEvotorRestore(false);
    setSigmaHelpChecked(false); setOfdChecked(false); setFnChecked(false);
    setFnPeriod('15'); setFnActivityType('general');
    setServiceContractChecked(false); setServiceContractPeriod('month');
    // Клиентские данные
    setClientData({ name: '', inn: '', phone: '', email: '', address: '', kkmModel: '', kkmNumber: '', fnNumber: '', comment: '', evotorLogin: '', evotorPassword: '', hasEcp: false, fnActivityType: '', sellsExcise: false });
    // Общее
    setCurrentStep(1); setIsDone(false); window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ===================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e8ecf2] flex flex-col">
        <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; opacity: 0; }
[data-slot=checkbox]{width:34px;height:34px;min-width:34px;min-height:34px;border:2px solid #475569;border-radius:8px;cursor:pointer;transition:all .15s ease;margin-top:0}
[data-slot=checkbox]:hover{border-color:#1e3a5f;box-shadow:0 0 0 3px rgba(30,58,95,.12)}
[data-slot=checkbox][data-state=checked]{background-color:#1e3a5f;border-color:#1e3a5f}
[data-slot=checkbox][data-state=checked]:hover{background-color:#162d4a}
.space-y-3 .flex.items-start.gap-3,.space-y-4 .flex.items-start.gap-3,.space-y-5 .flex.items-start.gap-3{flex-wrap:wrap}`}</style>
        {/* HEADER */}
        <header className="bg-white shadow-sm border-b border-[#1e3a5f]/10">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Вернуться на главную"
                onClick={() => { setCurrentStep(1); setIsDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrentStep(1); setIsDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
              >
                <Image src="/logo.webp" alt="Теллур-Интех" width={88} height={72} className="w-11 h-9 sm:w-[88px] sm:h-[72px]" quality={100} />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e3a5f] truncate">Калькулятор маркировки</h1>
              </div>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('scroll-to-contacts'))}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 bg-[#e8a817] hover:bg-[#d49a12] text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Контакты</span>
              </button>
            </div>
          </div>
        </header>



        <main ref={mainRef} className="flex-1 max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 w-full">

          <div className="mt-1 sm:mt-2">


            {/* STEP INDICATOR */}
            <div className="max-w-lg mx-auto mb-3 sm:mb-5">
              <div className="flex items-center">
                {[
                  { num: 1, label: 'Касса' },
                  { num: 2, label: 'Услуги' },
                  { num: 3, label: 'Дополнительно' },
                  { num: 4, label: 'Готово' }
                ].map((step, idx) => {
                  const isActive = currentStep === step.num || (isDone && step.num === 4)
                  const isCompleted = isDone || currentStep > step.num
                  return (
                    <React.Fragment key={step.num}>
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (step.num === 2 && !canGoStep2) return
                            if (step.num === 3 && !canGoStep3) return
                            if (step.num === 4 && step2Selections.length === 0) return
                            goToStep(step.num as Step)
                          }}
                          disabled={step.num === 2 && !canGoStep2 || step.num === 3 && !canGoStep3 || step.num === 4 && step2Selections.length === 0}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shrink-0 ${isCompleted ? 'bg-[#1e3a5f] text-white shadow-md cursor-pointer hover:bg-[#1e3a5f]/90' : isActive ? 'bg-[#e8a817] text-white ring-4 ring-[#e8a817]/20 shadow-md' : (step.num === 2 && !canGoStep2 || step.num === 3 && !canGoStep3 || step.num === 4 && step2Selections.length === 0) ? 'bg-white border-2 border-slate-300 text-slate-300 cursor-not-allowed opacity-60' : 'bg-white border-2 border-slate-300 text-slate-400 cursor-pointer hover:border-slate-400'}`}
                        >
                          {isCompleted && !isActive ? <Check className="w-4 h-4" /> : step.num}
                        </button>
                        <span className={`text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap ${isActive ? 'text-[#1e3a5f] font-bold' : isCompleted ? 'text-[#1e3a5f]/70' : 'text-slate-400'}`}>{step.label}</span>
                      </div>
                      {idx < 3 && (
                        <div className={`flex-1 h-1 rounded-full transition-colors duration-300 mx-1 ${currentStep > step.num || isDone ? 'bg-[#1e3a5f]' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>

            {/* ============================================================ */}
            {/* ВЫБОР КАССЫ */}
            {/* ============================================================ */}
            {currentStep === 1 && !isDone && (
              <StepBrands
                kkmType={kkmType}
                kkmCondition={kkmCondition}
                sigmaSelected={sigmaSelected}
                evotorTradeType={evotorTradeType}
                evotorAppsSelected={evotorAppsSelected}
                evotorHasSubscription={evotorHasSubscription}
                conditionFlash={conditionFlash}
                conditionRef={conditionRef}
                currentKkmInfo={currentKkmInfo}
                visibleKkmTypes={visibleKkmTypes}
                effectiveKkm={effectiveKkm}
                showSigmaSubs={showSigmaSubs}
                sigmaSubsLocked={sigmaSubsLocked}
                needsFirmwareOrLicense={needsFirmwareOrLicense}
                fwPrices={fwPrices}
                canGoStep2={canGoStep2}
                sigmaHelpChecked={sigmaHelpChecked}
                firmwareChecked={firmwareChecked}
                licenseChecked={licenseChecked}
                effectiveKkmInfo={effectiveKkmInfo}
                alreadyMarking={alreadyMarking}
                setAlreadyMarking={setAlreadyMarking}
                setKkmType={(v) => {
                  if (!kkmCondition) {
                    setConditionFlash(true)
                    conditionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    setTimeout(() => setConditionFlash(false), 2000)
                    return
                  }
                  setKkmType(v); if (v !== 'atol') { setSigmaSelected(false); setSigmaHelpChecked(false) }
                }}
                setKkmCondition={setKkmCondition}
                setSigmaSelected={setSigmaSelected}
                setSigmaHelpChecked={setSigmaHelpChecked}
                setEvotorTradeType={setEvotorTradeType}
                setEvotorHasSubscription={setEvotorHasSubscription}
                setEvotorAppsSelected={setEvotorAppsSelected}
                setScannerChecked={setScannerChecked}
                setFirmwareChecked={setFirmwareChecked}
                setLicenseChecked={setLicenseChecked}
                handleEvotorTradeType={handleEvotorTradeType}
                handleEvotorAppToggle={handleEvotorAppToggle}
                hintProps={hintProps}
                goToStep={goToStep}
              />
            )}

            {/* ============================================================ */}
            {/* УСЛУГИ */}
            {/* ============================================================ */}
            {currentStep === 2 && !isDone && (
              <StepServices
                kkmCondition={kkmCondition}
                kkmType={kkmType}
                step2Selections={step2Selections}
                markingDesc={markingDesc}
                clientData={clientData}
                ofdChecked={ofdChecked}
                ofdPeriod={ofdPeriod}
                ofdProvider={ofdProvider}
                ofdLocked={ofdLocked}
                ofdEffective={ofdEffective}
                unsureFnsRegistration={unsureFnsRegistration}
                alreadyMarking={alreadyMarking}
                canGoStep3={canGoStep3}
                setStep2Selections={setStep2Selections}
                setOfdChecked={setOfdChecked}
                setOfdPeriod={setOfdPeriod}
                setOfdProvider={setOfdProvider}
                setClientData={setClientData}
                setUnsureFnsRegistration={setUnsureFnsRegistration}
                hintProps={hintProps}
                goToStep={goToStep}
                setCurrentStep={setCurrentStep}
                mainRef={mainRef}
              />
            )}

            {/* ============================================================ */}
            {/* ДОПОЛНИТЕЛЬНО */}
            {/* ============================================================ */}
            {currentStep === 3 && !isDone && (
              <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
                <StepExtra
                  kkmType={kkmType}
                  kkmCondition={kkmCondition}
                  effectiveKkm={effectiveKkm}
                  step3Selections={step3Selections}
                  scannerChecked={scannerChecked}
                  fnChecked={fnChecked}
                  productCardCount={productCardCount}
                  trainingHours={trainingHours}
                  serviceContractChecked={serviceContractChecked}
                  serviceContractPeriod={serviceContractPeriod}
                  evotorRestore={evotorRestore}
                  fnPeriod={fnPeriod}
                  fnActivityType={fnActivityType}
                  clientData={clientData}
                  totalCalc={totalCalc}
                  setStep3Selections={setStep3Selections}
                  setScannerChecked={setScannerChecked}
                  setFnChecked={setFnChecked}
                  setFnPeriod={setFnPeriod}
                  setFnActivityType={setFnActivityType}
                  setProductCardCount={setProductCardCount}
                  setTrainingHours={setTrainingHours}
                  setServiceContractChecked={setServiceContractChecked}
                  setServiceContractPeriod={setServiceContractPeriod}
                  setEvotorRestore={setEvotorRestore}
                  setClientData={setClientData}
                  hintProps={hintProps}
                  setCurrentStep={setCurrentStep}
                  mainRef={mainRef}
                  setIsDone={setIsDone}
                  handleReset={handleReset}
                  handleDone={handleDone}
                />
                <StepSummary
                  totalCalc={totalCalc}
                  effectiveKkm={effectiveKkm}
                  effectiveKkmInfo={effectiveKkmInfo}
                  kkmType={kkmType}
                />
              </div>
            )}

            {/* ГОТОВО */}
            {isDone && (
              <DoneScreen
                effectiveKkmInfo={effectiveKkmInfo}
                kkmCondition={kkmCondition}
                clientData={clientData}
                totalCalc={totalCalc}
                onBack={() => { setIsDone(false); setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }}
                onPrint={handlePrint}
                onClose={handleReset}
                kkmType={kkmType}
                effectiveKkm={effectiveKkm}
                step2Selections={step2Selections}
                step3Selections={step3Selections}
                scannerChecked={scannerChecked}
                fnChecked={fnChecked}
                productCardCount={productCardCount}
                serviceContractChecked={serviceContractChecked}
                evotorRestore={evotorRestore}
                sigmaHelpChecked={sigmaHelpChecked}
                unsureFnsRegistration={unsureFnsRegistration}
              />
            )}
          </div>
        </main>

        {/* SEO-контент для поисковых систем — ниже калькулятора */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-4 sm:pb-6">
          <SeoContent />
        </div>


        <footer className="bg-white border-t border-[#1e3a5f]/10 mt-auto mb-2 pb-2">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div
              className="flex items-center justify-center gap-3 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Вернуться на главную"
              onClick={() => { setCurrentStep(1); setIsDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrentStep(1); setIsDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
            >
              <Image src="/logo.webp" alt="Теллур-Интех" width={56} height={46} className="w-7 h-[23px] sm:w-[56px] sm:h-[46px]" quality={100} />
              <p className="text-xs sm:text-sm text-slate-500">ООО &quot;Теллур-Интех&quot; — сервисный центр кассового оборудования</p>
            </div>
          </div>
        </footer>


      </div>
  )
}
