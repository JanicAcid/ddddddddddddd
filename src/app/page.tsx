'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import React from 'react'
import Image from 'next/image'
import { formatPhone, isPhoneValid } from '@/lib/phone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Info, Check, Phone, Send, MessageSquare } from 'lucide-react'
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
  const [orderNum, setOrderNum] = useState<string | null>(null)
  const [isCorrection, setIsCorrection] = useState(false)
  const [isConsultation, setIsConsultation] = useState(false)
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
  const contactValid = isPhoneValid(clientData.phone)
  // Для ВСЕХ касс: нужно выбрать вид деятельности (кроме уже работающих с маркировкой и кроме Сигмы)
  const needsActivityType = kkmCondition !== '' && !alreadyMarking && effectiveKkm !== 'sigma'
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
      } else {
        next.delete('marking')
      }
      if (tradeType === 'alcohol' || tradeType === 'both') next.add('utm')
      else next.delete('utm')
      // Опциональные приложения (tobacco и др.) оставляем как были
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

    // Авто-установка sellsExcise при выборе алкоголя (все типы касс)
    if (hasAlcohol && !clientData.sellsExcise) {
      setClientData(prev => ({ ...prev, sellsExcise: true }))
    }

    // Авто-установка unsureFnsRegistration при алкоголь/сигареты для текущих касс (partial)
    if (isPartialMode && hasAlcohol && !unsureFnsRegistration) {
      setUnsureFnsRegistration(true)
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

      // Для новой/б/у кассы: полная маркировка обязательна (включает регистрацию ККТ в ФНС)
      if (kkmCondition === 'new' || kkmCondition === 'used') {
        // Регистрация ККТ теперь включена в marking_setup — не добавляем отдельно
        next.delete('fns_reregistration')
        // Полная маркировка — всегда для новой/б/у кассы
        if (!next.has('marking_setup') && !next.has('partial_marketing_setup')) next.add('marking_setup')
      }

      return [...next]
    })
  }, [kkmType, effectiveKkm, evotorTradeType, evotorAppsSelected, kkmCondition, clientData.sellsExcise, alreadyMarking, unsureFnsRegistration])

  const markingDesc = useMemo(() => {
    const chestnyznakLink = <a href="https://честныйзнак.рф" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-slate-600 hover:text-[#1e3a5f] transition-colors">Честный ЗНАК<img src="/chestnyznak.png" alt="" className="w-3.5 h-3.5" /></a>
    if (kkmType === 'evotor') return <>Связываем ЭДО, {chestnyznakLink}, кассу Эвотор, ТС ПИоТ и личный кабинет Эвотор в единую цепочку — от приёмки товара до пробития чека</>
    return <>Связываем ЭДО, {chestnyznakLink}, Вашу кассу и ТС ПИоТ в единую цепочку — от приёмки товара до пробития чека</>
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

  // Надёжный скролл наверх: работает на мобиле и ПК
  const smoothScrollToTop = useCallback(() => {
    const el = mainRef.current
    if (!el) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'smooth' })
    // Фоллбэк для iOS Safari — принудительный скролл через 300мс
    setTimeout(() => {
      const top2 = el.getBoundingClientRect().top + window.scrollY
      if (Math.abs(window.scrollY - top2) > 10) {
        window.scrollTo({ top: top2, behavior: 'auto' })
      }
    }, 350)
  }, [])

  const goToStep = (step: Step) => {
    // Назад — всегда можно на любой предыдущий шаг
    if (step < currentStep) {
      setCurrentStep(step)
      setIsDone(false)
      ;(document.activeElement as HTMLElement)?.blur()
      setTimeout(smoothScrollToTop, 50)
      return
    }
    // Вперёд — только на следующий шаг (+1), нельзя перепрыгивать
    if (step !== currentStep + 1) return
    // Проверяем минимальные требования ТЕКУЩЕГО шага
    if (currentStep === 1 && !canGoStep2) return
    if (currentStep === 2 && !canGoStep3) return
    if (currentStep === 3) {
      if (step2Selections.length === 0) return
      if (!contactValid) return
    }
    setCurrentStep(step)
    setIsDone(false)
    ;(document.activeElement as HTMLElement)?.blur()
    setTimeout(smoothScrollToTop, 50)
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
      includeChecklist: false,
      isConsultation
    })
    const printWithScript = printContent.replace('</body>', '<script>window.print();</script></body>')
    const w = window.open('', '_blank')
    if (w) { w.document.write(printWithScript); w.document.close() }
  }

  // ---- Готово ----
  const handleDone = () => {
    // Консультация — всегда новая заявка, не корректировка
    if (isConsultation) {
      setOrderNum(Date.now().toString().slice(-6))
      setIsCorrection(false)
    } else if (orderNum) {
      setIsCorrection(true)
    } else {
      setOrderNum(Date.now().toString().slice(-6))
      setIsCorrection(false)
    }
    setIsDone(true)
    ;(document.activeElement as HTMLElement)?.blur()
    setTimeout(smoothScrollToTop, 50)
  }

  // ---- Консультация (без выбора услуг) ----
  const startConsultation = () => {
    setIsConsultation(true)
    setIsDone(false)
    if (!orderNum) setOrderNum(Date.now().toString().slice(-6))
    ;(document.activeElement as HTMLElement)?.blur()
    setTimeout(smoothScrollToTop, 50)
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
    setCurrentStep(1); setIsDone(false); setOrderNum(null); setIsCorrection(false); setIsConsultation(false); window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ===================================================================
  // Консультация: подмена totalCalc
  const consultationCalc = useMemo((): TotalCalc => ({
    items: [{ name: 'Консультация по вашей кассе', price: 0 }],
    total: 0
  }), [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e8ecf2] flex flex-col relative">
        <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; opacity: 0; }
@keyframes greenPulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 70% { box-shadow: 0 0 0 12px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }
@keyframes greenSlideIn { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
.animate-green-pulse { animation: greenPulse 1.5s ease-out 2; }
.animate-green-slide { animation: greenSlideIn 0.4s ease-out forwards; opacity: 0; }
[data-slot=checkbox]{width:34px;height:34px;min-width:34px;min-height:34px;border:2.5px solid #334155;border-radius:8px;cursor:pointer;transition:all .15s ease;margin-top:0;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08)}
[data-slot=checkbox]:hover{border-color:#1e3a5f;box-shadow:0 0 0 3px rgba(30,58,95,.15)}
[data-slot=checkbox][data-state=checked]{background-color:#1e3a5f;border-color:#1e3a5f}
[data-slot=checkbox][data-state=checked]:hover{background-color:#162d4a}
[data-slot=radio-group-item]{border:2.5px solid #334155;box-shadow:0 1px 3px rgba(0,0,0,.08)}
[data-slot=radio-group-item]:hover{border-color:#1e3a5f;box-shadow:0 0 0 3px rgba(30,58,95,.15)}
[data-slot=radio-group-item][data-state=checked]{border-color:#1e3a5f;background:#fff}
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
                <div className="min-w-0">
                  <h1 className="text-base sm:text-2xl font-extrabold text-[#1e3a5f] whitespace-nowrap overflow-hidden text-ellipsis">Калькулятор маркировки</h1>
                  <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-x-1 whitespace-nowrap overflow-hidden">
                    <a href="https://честныйзнак.рф" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-slate-600 hover:text-[#1e3a5f] transition-colors shrink-0">Честный ЗНАК<img src="/chestnyznak.png" alt="" className="w-6 h-6 sm:w-6 sm:h-6" /></a>
                    <span className="text-slate-300 shrink-0">·</span>
                    <a href="https://ao-esp.ru/#ESM" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-slate-600 hover:text-[#1e3a5f] transition-colors shrink-0">ТС ПИоТ<img src="/tspiot-dark.png" alt="" style={{width:'auto',height:'20px'}} className="sm:hidden" /><img src="/tspiot-dark.png" alt="" style={{width:'auto',height:'26px'}} className="hidden sm:inline" /></a>
                  </p>
                </div>
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
            {!isConsultation && (
            <div className="max-w-lg mx-auto mb-3 sm:mb-5">
              <div className="flex items-center">
                {[
                  { num: 1, label: 'Касса' },
                  { num: 2, label: 'Услуги' },
                  { num: 3, label: 'Дополнительно' },
                  { num: 4, label: 'Готово' }
                ].map((step, idx) => {
                  const isActive = currentStep === step.num || (isDone && step.num === 4)
                  const isVisited = isDone || currentStep > step.num
                  const isForward = step.num > currentStep
                  const isNextStep = step.num === currentStep + 1
                  // Назад — всегда можно. Вперёд — только на следующий (+1) и только если текущий шаг заполнен
                  const canGoNext =
                    (currentStep === 1 && canGoStep2) ||
                    (currentStep === 2 && canGoStep3) ||
                    (currentStep === 3 && step2Selections.length > 0 && contactValid)
                  const isDisabled = isForward && !(isNextStep && canGoNext)
                  return (
                    <React.Fragment key={step.num}>
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (isDisabled) return
                            goToStep(step.num as Step)
                          }}
                          disabled={isDisabled}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shrink-0 ${isVisited && !isActive ? 'bg-[#1e3a5f] text-white shadow-md cursor-pointer hover:bg-[#1e3a5f]/90' : isActive ? 'bg-[#e8a817] text-white ring-4 ring-[#e8a817]/20 shadow-md' : isDisabled ? 'bg-white border-2 border-slate-200 text-slate-300 cursor-not-allowed opacity-50' : 'bg-white border-2 border-slate-300 text-slate-500 cursor-pointer hover:border-[#1e3a5f] hover:text-[#1e3a5f]'}`}
                        >
                          {isVisited && !isActive ? <Check className="w-4 h-4" /> : step.num}
                        </button>
                        <span className={`text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap ${isActive ? 'text-[#1e3a5f] font-bold' : isVisited ? 'text-[#1e3a5f]/70' : isDisabled ? 'text-slate-300' : 'text-slate-500'}`}>{step.label}</span>
                      </div>
                      {idx < 3 && (
                        <div className={`flex-1 h-1 rounded-full transition-colors duration-300 mx-1 ${isVisited || (step.num === currentStep) ? 'bg-[#1e3a5f]' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
            )}

            {/* ============================================================ */}
            {/* ВЫБОР КАССЫ */}
            {/* ============================================================ */}
            {currentStep === 1 && !isDone && !isConsultation && (
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
                startConsultation={startConsultation}
              />
            )}

            {/* ============================================================ */}
            {/* УСЛУГИ */}
            {/* ============================================================ */}
            {currentStep === 2 && !isDone && !isConsultation && (
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
            {currentStep === 3 && !isDone && !isConsultation && (
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

            {/* ============================================================ */}
            {/* КОНСУЛЬТАЦИЯ — форма заявки */}
            {/* ============================================================ */}
            {isConsultation && !isDone && (
              <div className="max-w-2xl mx-auto space-y-3">
                <Card className="border-[#1e3a5f]/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5080] px-4 sm:px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-extrabold text-base sm:text-lg leading-tight">Консультация по вашей кассе</h3>
                        <p className="text-white/70 text-xs sm:text-sm mt-1">Менеджер перезвонит и поможет подобрать решение</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-5 space-y-3">
                    <div>
                      <Label className="text-xs font-semibold text-slate-700">Как к вам обращаться? <span className="text-red-500">*</span></Label>
                      <Input value={clientData.name} onChange={(e) => setClientData({ ...clientData, name: e.target.value })} placeholder="ИП Иванов или ООО «Ромашка»" className="mt-1.5 text-sm h-11" />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-700">Телефон <span className="text-red-500">*</span></Label>
                      <Input type="tel" value={clientData.phone} onChange={(e) => setClientData({ ...clientData, phone: formatPhone(e.target.value) })} placeholder="+7 (___) ___-__-__" className="mt-1.5 text-sm h-11" maxLength={18} />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-700">Модель кассы <span className="text-red-500">*</span></Label>
                      <Input value={clientData.kkmModel} onChange={(e) => setClientData({ ...clientData, kkmModel: e.target.value })} placeholder="Например: Меркурий 185Ф, Атол 90Ф..." className="mt-1.5 text-sm h-11" />
                      <p className="text-[11px] text-slate-400 mt-1">Найдите на корпусе кассы или в чеке</p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-700">Опишите проблему</Label>
                      <Input value={clientData.comment} onChange={(e) => setClientData({ ...clientData, comment: e.target.value })} placeholder="Что случилось с кассой или что нужно настроить" className="mt-1.5 text-sm h-11" />
                    </div>
                    <Button
                      className={`w-full py-4 sm:py-5 text-base sm:text-lg font-bold transition-all ${clientData.name.trim() !== '' && isPhoneValid(clientData.phone) && clientData.kkmModel.trim() !== '' ? 'bg-[#e8a817] hover:bg-[#d49a12] hover:shadow-lg hover:shadow-[#e8a817]/20 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                      size="lg"
                      disabled={clientData.name.trim() === '' || !isPhoneValid(clientData.phone) || clientData.kkmModel.trim() === ''}
                      onClick={handleDone}
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Отправить заявку
                    </Button>
                    <p className="text-[10px] sm:text-xs text-slate-400 text-center">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
                  </CardContent>
                </Card>
                <Button variant="outline" className="w-full text-xs" onClick={handleReset}>Сбросить</Button>
              </div>
            )}

            {/* ГОТОВО */}
            {isDone && (
              <DoneScreen
                effectiveKkmInfo={effectiveKkmInfo}
                kkmCondition={kkmCondition}
                clientData={clientData}
                totalCalc={isConsultation ? consultationCalc : totalCalc}
                onBack={isConsultation ? handleReset : () => { setIsDone(false); setTimeout(smoothScrollToTop, 50) }}
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
                orderNum={orderNum}
                isCorrection={isCorrection}
                unsureFnsRegistration={unsureFnsRegistration}
                isConsultation={isConsultation}
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
