'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import {
  Info, AlertTriangle,
  GraduationCap, RefreshCw, KeyRound, ClipboardCheck,
  RotateCcw, Download, ArrowLeft, CheckCheck,
  Send, Clock, ChevronDown, ChevronUp, Shield
} from 'lucide-react'
import { step3Services } from '@/config/services-step3'
import { getProductCardPrice, getProductCardPriceLabel } from '@/config/product-cards'
import { scannerPrices } from '@/config/services'
import type { KkmType, KkmCondition, ClientData, HintButtonProps, TotalCalc } from './types'
import { HintButton } from './HintButton'

interface StepExtraProps {
  kkmType: KkmType
  kkmCondition: KkmCondition
  effectiveKkm: KkmType
  step3Selections: string[]
  scannerChecked: boolean
  fnChecked: boolean
  productCardCount: number
  trainingHours: number
  serviceContractChecked: boolean
  serviceContractPeriod: 'month' | 'year'
  evotorRestore: boolean
  fnPeriod: string
  fnActivityType: string
  clientData: ClientData
  totalCalc: TotalCalc
  // Setters
  setStep3Selections: (v: string[] | ((prev: string[]) => string[])) => void
  setScannerChecked: (v: boolean) => void
  setFnChecked: (v: boolean) => void
  setFnPeriod: (v: string) => void
  setFnActivityType: (v: string) => void
  setProductCardCount: (v: number) => void
  setTrainingHours: (v: number) => void
  setServiceContractChecked: (v: boolean) => void
  setServiceContractPeriod: (v: 'month' | 'year') => void
  setEvotorRestore: (v: boolean) => void
  setClientData: (v: ClientData | ((prev: ClientData) => ClientData)) => void
  hintProps: HintButtonProps
  setCurrentStep: (v: number) => void
  mainRef: React.RefObject<HTMLDivElement | null>
  setIsDone: (v: boolean) => void
  handleReset: () => void
  handleDone: () => void
}

export function StepExtra({
  kkmType, kkmCondition, effectiveKkm,
  step3Selections, scannerChecked, fnChecked, productCardCount, trainingHours,
  serviceContractChecked, serviceContractPeriod, evotorRestore,
  fnPeriod, fnActivityType, clientData, totalCalc,
  setStep3Selections, setScannerChecked, setFnChecked, setFnPeriod, setFnActivityType,
  setProductCardCount, setTrainingHours, setServiceContractChecked, setServiceContractPeriod,
  setEvotorRestore, setClientData,
  hintProps, setCurrentStep, mainRef, setIsDone,
  handleReset, handleDone
}: StepExtraProps) {
  const [showDetails, setShowDetails] = useState(false)
  const canSubmit = clientData.name.trim() !== '' && clientData.phone.trim() !== ''
  return (
    <div className="max-w-3xl mx-auto space-y-2">

        {/* ФН — фискальный накопитель */}
        <Card className={fnChecked ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
          <CardContent className="">
            <div className="flex items-start gap-2">
              <HintButton hintKey="fn_product" {...hintProps} />
              <Checkbox id="fn_product" checked={fnChecked}
                onCheckedChange={(c) => { setFnChecked(c as boolean); if (c) setFnActivityType(fnPeriod === '36' ? 'excise' : 'general') }}
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                  <Label htmlFor="fn_product" className="font-bold text-sm cursor-pointer leading-snug">Фискальный накопитель (ФН)</Label>
                  <span className="text-xs text-slate-400 shrink-0">цена уточняется</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Обязательный чип памяти кассы. Срок зависит от вида деятельности</p>
                {fnChecked && (
                  <div className="mt-1.5 space-y-1.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Вид деятельности</Label>
                      <RadioGroup value={fnActivityType} onValueChange={(v) => {
                        setFnActivityType(v as string)
                        setFnPeriod(v === 'excise' ? '36' : '15')
                      }} className="space-y-1.5">
                        <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-[#1e3a5f]/10">
                          <RadioGroupItem value="general" id="fn_general" />
                          <Label htmlFor="fn_general" className="flex-1 cursor-pointer text-xs">
                            <span className="font-medium">Общая торговля</span>
                            <span className="ml-2 text-xs text-slate-400">— ФН на 15 мес.</span>
                          </Label>
                        </div>
                        <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-[#1e3a5f]/10">
                          <RadioGroupItem value="excise" id="fn_excise" />
                          <Label htmlFor="fn_excise" className="flex-1 cursor-pointer text-xs">
                            <span className="font-medium">Подакцизная продукция</span>
                            <span className="ml-2 text-xs text-slate-400">— ФН на 36 мес. (алкоголь, табак)</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="p-1.5 bg-amber-50 border border-amber-200 rounded">
                      <p className="text-xs text-amber-700">
                        <strong>ФН на {fnPeriod} мес.</strong> — стоимость уточняется у менеджера, цена на ФН регулярно меняется
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Сканер */}
        <Card className={scannerChecked ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
          <CardContent className="">
            <div className="flex items-start gap-2">
              <HintButton hintKey="scanner_2d" {...hintProps} />
              <Checkbox id="scanner" checked={scannerChecked} onCheckedChange={(c) => setScannerChecked(c as boolean)} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="scanner" className="font-bold text-sm cursor-pointer leading-snug">Сканер 2D для считывания кодов маркировки</Label>
                  <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm">{scannerPrices[effectiveKkm]?.toLocaleString('ru-RU') ?? '…'} руб.</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Читает квадратные коды (Data Matrix) на маркированных товарах. Обычный сканер не подойдёт.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Карточки товаров */}
        <Card className={productCardCount > 0 ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
          <CardContent className="">
            <div className="flex items-start gap-2">
              <HintButton hintKey="product_cards" {...hintProps} />
              <Checkbox id="product_cards" checked={productCardCount > 0} onCheckedChange={(c) => setProductCardCount(c ? 1 : 0)} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="product_cards" className="font-bold text-sm cursor-pointer leading-snug">Создание карточек товаров</Label>
                  <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm">
                    {productCardCount > 0 ? `${(getProductCardPrice(productCardCount) * productCardCount).toLocaleString('ru-RU')} руб.` : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Карточки создаются на кассовом аппарате. Не применяется для ФР Атол и ФР Штрих-М.</p>
                {productCardCount > 0 && (
                  <div className="mt-1.5 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs shrink-0">Количество:</Label>
                      <Input type="number" min={1} max={1500} value={productCardCount}
                        onChange={(e) => setProductCardCount(Math.max(1, Math.min(1500, parseInt(e.target.value) || 0)))} className="w-24" />
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>до 100 — 80₽/шт.</span>
                      <span>100–500 — 60₽/шт.</span>
                      <span>500+ — 40₽/шт.</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Итого: {productCardCount} × {getProductCardPriceLabel(productCardCount)} = {(getProductCardPrice(productCardCount) * productCardCount).toLocaleString('ru-RU')} руб.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Доп. услуги */}
        {step3Services.map((service, idx) => {
          const selected = step3Selections.includes(service.id)
          return (
            <Card key={service.id} className={selected ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
              <CardContent className="">
                <div className="flex items-start gap-2">
                  {service.hintKey && <HintButton hintKey={service.hintKey} {...hintProps} />}
                  <Checkbox id={service.id} checked={selected}
                    onCheckedChange={() => setStep3Selections((prev: string[]) => prev.includes(service.id) ? prev.filter(x => x !== service.id) : [...prev, service.id])}
                    className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor={service.id} className="font-bold text-sm cursor-pointer leading-snug">{service.name}</Label>
                      <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm">{service.price.toLocaleString('ru-RU')} руб.</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{service.description}</p>
                    {service.id === 'training' && selected && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <Label className="text-xs shrink-0">Часов:</Label>
                        <Input type="number" min={1} max={10} value={trainingHours}
                          onChange={(e) => setTrainingHours(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} className="w-20" />
                        <span className="text-xs text-slate-500">= {(service.price * trainingHours).toLocaleString('ru-RU')} руб.</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Договор обслуживания */}
        <Card className={serviceContractChecked ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
          <CardContent className="">
            <div className="flex items-start gap-2">
              <HintButton hintKey="service_contract" {...hintProps} />
              <Checkbox id="service_contract" checked={serviceContractChecked}
                onCheckedChange={(c) => setServiceContractChecked(c as boolean)}
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="service_contract" className="font-bold text-sm cursor-pointer leading-snug">Договор обслуживания</Label>
                  <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm">1 000 руб./мес.</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Регулярное обслуживание кассы — визиты мастера, профилактика, приоритетная поддержка</p>
                {serviceContractChecked && (
                  <div className="mt-1.5 space-y-1.5">
                    <RadioGroup value={serviceContractPeriod} onValueChange={(v) => setServiceContractPeriod(v as 'month' | 'year')} className="space-y-1.5">
                      <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-[#1e3a5f]/10">
                        <RadioGroupItem value="month" id="sc_month" />
                        <Label htmlFor="sc_month" className="flex-1 cursor-pointer text-xs">
                          <span className="font-medium text-[#1e3a5f]">Помесячная оплата</span>
                          <span className="ml-2 font-bold text-[#1e3a5f]">1 000 ₽/мес.</span>
                        </Label>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-green-200">
                        <RadioGroupItem value="year" id="sc_year" />
                        <Label htmlFor="sc_year" className="flex-1 cursor-pointer text-xs">
                          <span className="font-medium text-[#1e3a5f]">Подписка на 12 мес.</span>
                          <span className="ml-2 font-bold text-[#1e3a5f]">10 000 ₽/год</span>
                          <Badge className="bg-green-100 text-green-700 text-xs ml-2">выгодно</Badge>
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="p-1.5 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded space-y-1">
                      <p className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wide">Что входит:</p>
                      <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                        <li>Вызов мастера без доплаты</li>
                        <li>Ежемесячный визит с ревизией и профилактикой</li>
                        <li>Удалённая поддержка в рабочие часы (МСК)</li>
                        <li>Приоритетная запись на обслуживание</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 py-4 text-base font-bold" size="lg" onClick={() => { setCurrentStep(2); setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }}><ArrowLeft className="w-5 h-5 mr-2" /> Назад</Button>
        </div>

        {/* ПРОДАЮЩАЯ ФОРМА ЗАЯВКИ */}
        <Card id="lead-form-section" className="border-[#1e3a5f]/20 overflow-hidden">
          {/* Верхняя акцентная полоска */}
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a5080] px-4 sm:px-5 py-4 sm:py-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-extrabold text-base sm:text-lg leading-tight">Оставьте заявку — получите расчёт</h3>
                <p className="text-white/70 text-xs sm:text-sm mt-1">Менеджер перезвонит в течение <span className="text-[#e8a817] font-semibold">15 минут</span> и подготовит точную смету</p>
              </div>
            </div>
          </div>

          <CardContent className="p-4 sm:p-5 space-y-4">
            {/* Основные поля — всегда видны */}
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Как к вам обращаться? <span className="text-red-500">*</span></Label>
                <Input value={clientData.name} onChange={(e) => setClientData({ ...clientData, name: e.target.value })} placeholder="ИП Иванов или ООО «Ромашка»" className="mt-1.5 text-sm h-11" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Телефон <span className="text-red-500">*</span></Label>
                <Input type="tel" value={clientData.phone} onChange={(e) => setClientData({ ...clientData, phone: e.target.value })} placeholder="+7 (___) ___-__-__" className="mt-1.5 text-sm h-11" />
              </div>
            </div>

            {/* Раскрывающийся блок доп. сведений */}
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-slate-200 hover:border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/[0.02] transition-all text-left group"
            >
              <span className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-[#1e3a5f] transition-colors">
                Дополнительные сведения
                {!showDetails && <span className="text-slate-400 font-normal ml-1 hidden sm:inline">— ИНН, адрес, модель кассы</span>}
              </span>
              {showDetails
                ? <ChevronUp className="w-4 h-4 text-slate-400" />
                : <ChevronDown className="w-4 h-4 text-slate-400" />
              }
            </button>

            {showDetails && (
              <div className="space-y-3 animate-fade-in-up border-l-2 border-[#1e3a5f]/10 pl-3.5 ml-1">
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <div>
                    <Label className="text-xs">ИНН <span className="text-slate-400 font-normal">(если знаете)</span></Label>
                    <Input value={clientData.inn} onChange={(e) => setClientData({ ...clientData, inn: e.target.value })} placeholder="0000000000" className="mt-1 text-sm h-10" />
                  </div>
                  <div>
                    <Label className="text-xs">Электронная почта</Label>
                    <Input type="email" value={clientData.email} onChange={(e) => setClientData({ ...clientData, email: e.target.value })} placeholder="mail@company.ru" className="mt-1 text-sm h-10" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Адрес установки кассы</Label>
                  <Input list="ru-addresses" value={clientData.address} onChange={(e) => setClientData({ ...clientData, address: e.target.value })} className="mt-1 text-sm h-10" />
                  <datalist id="ru-addresses">
                    <option value="г. Санкт-Петербург" /><option value="г. Москва" /><option value="г. Новосибирск" /><option value="г. Екатеринбург" /><option value="г. Казань" /><option value="г. Нижний Новгород" /><option value="г. Челябинск" /><option value="г. Самара" /><option value="г. Омск" /><option value="г. Ростов-на-Дону" /><option value="г. Уфа" /><option value="г. Красноярск" /><option value="г. Воронеж" /><option value="г. Пермь" /><option value="г. Волгоград" /><option value="г. Краснодар" /><option value="г. Саратов" /><option value="г. Тюмень" /><option value="г. Тольятти" /><option value="г. Ижевск" />
                  </datalist>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <div>
                    <Label className="text-xs">Модель кассы <span className="text-slate-400 font-normal">(на кассе и в чеке)</span></Label>
                    <Input value={clientData.kkmModel} onChange={(e) => setClientData({ ...clientData, kkmModel: e.target.value })} className="mt-1 text-sm h-10" />
                  </div>
                  <div>
                    <Label className="text-xs">Заводской номер</Label>
                    <Input value={clientData.kkmNumber} onChange={(e) => setClientData({ ...clientData, kkmNumber: e.target.value })} className="mt-1 text-sm h-10" />
                  </div>
                </div>
                {kkmType === 'evotor' && (
                  <div className="p-2.5 bg-[#1e3a5f]/5 rounded-lg space-y-2">
                    <p className="text-xs text-[#1e3a5f] font-medium flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />Данные от ЛК Эвотор
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Логин (телефон)</Label>
                        <Input type="tel" value={clientData.evotorLogin} onChange={(e) => setClientData({ ...clientData, evotorLogin: e.target.value })} className="mt-1 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Пароль</Label>
                        <Input type="password" value={clientData.evotorPassword} onChange={(e) => setClientData({ ...clientData, evotorPassword: e.target.value })} className="mt-1 text-sm" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-[#e8a817]/10 border border-[#e8a817]/30 rounded">
                      <Checkbox id="evotor_restore_r" checked={evotorRestore} onCheckedChange={(c) => setEvotorRestore(c as boolean)} className="w-5 h-5 shrink-0" />
                      <Label htmlFor="evotor_restore_r" className="cursor-pointer text-xs text-[#1e3a5f]">Нет данных ЛК — помощь с восстановлением <span className="font-semibold">500 руб.</span></Label>
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-xs">Примечания</Label>
                  <Input value={clientData.comment} onChange={(e) => setClientData({ ...clientData, comment: e.target.value })} placeholder="Дополнительная информация" className="mt-1 text-sm h-10" />
                </div>
              </div>
            )}

            {/* Траст-блок: время ответа + конфиденциальность */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-[#1e3a5f] shrink-0" />
                <span>Ответ в течение <strong className="text-slate-700">15 минут</strong> в рабочее время</span>
              </div>
              <div className="hidden sm:block w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>Данные защищены по <strong className="text-slate-700">152-ФЗ</strong></span>
              </div>
            </div>
          </CardContent>

          {/* CTA кнопка с ценой */}
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
            {/* Галочка ЭЦП перед отправкой */}
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
              <Checkbox
                id="ecp_check_form"
                checked={clientData.hasEcp}
                onCheckedChange={(c) => setClientData(prev => ({ ...prev, hasEcp: !!c }))}
                className="w-5 h-5 mt-0.5 shrink-0"
              />
              <Label htmlFor="ecp_check_form" className="cursor-pointer text-xs sm:text-sm text-amber-800 leading-snug">
                У меня есть <strong>ЭЦП</strong> (электронная подпись на Рутокен / JaCarta)
              </Label>
            </div>
            <Button
              className={`w-full py-4 sm:py-5 text-base sm:text-lg font-bold transition-all ${canSubmit ? 'bg-[#e8a817] hover:bg-[#d49a12] hover:shadow-lg hover:shadow-[#e8a817]/20 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
              size="lg"
              disabled={!canSubmit}
              onClick={handleDone}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Отправить заявку
            </Button>
            <p className="text-[10px] sm:text-xs text-slate-400 text-center mt-2">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </div>
        </Card>
        {kkmType === 'atol' && effectiveKkm !== 'sigma' && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-blue-800 text-xs">Согласие для партнёрского кабинета Атол</p>
                <p className="text-xs text-blue-600 mt-0.5">Для обслуживания кассы Атол нужно добавить её в наш партнёрский кабинет. Укажите код <strong>9331</strong> в заявлении.</p>
                <a href="/soglasiye-atol.pdf" download className="inline-flex items-center gap-2 mt-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Скачать согласие (PDF)
                </a>
              </div>
            </div>
          </div>
        )}
        <Button variant="outline" className="w-full text-xs" onClick={handleReset}>Сбросить всё</Button>
    </div>
  )
}
