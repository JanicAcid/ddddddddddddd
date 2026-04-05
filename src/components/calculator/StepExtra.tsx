'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import {
  ScanLine, Info, AlertTriangle, AlertCircle,
  Cpu, FilePlus2, LayoutList,
  GraduationCap, RefreshCw, KeyRound, ClipboardCheck,
  RotateCcw, Download, ArrowLeft, CheckCheck
} from 'lucide-react'
import { step3Services } from '@/config/services-step3'
import { getProductCardPrice, getProductCardPriceLabel } from '@/config/product-cards'
import { scannerPrices } from '@/config/services'
import type { KkmType, KkmCondition, ClientData, HintButtonProps } from './types'
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
  fnPeriod, fnActivityType, clientData,
  setStep3Selections, setScannerChecked, setFnChecked, setFnPeriod, setFnActivityType,
  setProductCardCount, setTrainingHours, setServiceContractChecked, setServiceContractPeriod,
  setEvotorRestore, setClientData,
  hintProps, setCurrentStep, mainRef, setIsDone,
  handleReset, handleDone
}: StepExtraProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">

        {/* ФН — фискальный накопитель */}
        <Card className={fnChecked ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
          <CardContent className="">
            <div className="flex items-start gap-2">
              <HintButton hintKey="fn_product" {...hintProps} />

              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                <Cpu className="w-5 h-5 sm:w-5 sm:h-5 text-[#1e3a5f]" />
              </div>          <Checkbox id="fn_product" checked={fnChecked}
                onCheckedChange={(c) => { setFnChecked(c as boolean); if (c) { setFnActivityType(fnPeriod === '36' ? 'excise' : 'general'); setStep3Selections((prev: string[]) => prev.includes('fn_replacement') ? prev : [...prev, 'fn_replacement']) } else { setStep3Selections((prev: string[]) => prev.filter(x => x !== 'fn_replacement')) } }}
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                  <Label htmlFor="fn_product" className="font-bold text-sm cursor-pointer leading-snug">Фискальный накопитель (ФН)</Label>
                  <span className="text-xs text-slate-400 shrink-0">цена уточняется</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Обязательный чип памяти кассы. Срок зависит от вида деятельности</p>
                {fnChecked && (
                  <div className="mt-2 space-y-2">
                    {/* Вид деятельности */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Вид деятельности</Label>
                      <RadioGroup value={fnActivityType} onValueChange={(v) => {
                        setFnActivityType(v as string)
                        setFnPeriod(v === 'excise' ? '36' : '15')
                      }} className="space-y-2">
                        <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-[#1e3a5f]/10">
                          <RadioGroupItem value="general" id="fn_general" />
                          <Label htmlFor="fn_general" className="flex-1 cursor-pointer text-sm">
                            <span className="font-medium">Общая торговля</span>
                            <span className="ml-2 text-xs text-slate-400">— ФН на 15 месяцев</span>
                          </Label>
                        </div>
                        <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-[#1e3a5f]/10">
                          <RadioGroupItem value="excise" id="fn_excise" />
                          <Label htmlFor="fn_excise" className="flex-1 cursor-pointer text-sm">
                            <span className="font-medium">Подакцизная продукция</span>
                            <span className="ml-2 text-xs text-slate-400">— ФН на 36 месяцев (алкоголь, табак)</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-700">
                        <strong>ФН на {fnPeriod} мес.</strong> — стоимость уточняется у менеджера по телефону, так как цена на ФН регулярно меняется
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

              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                <ScanLine className="w-5 h-5 sm:w-5 sm:h-5 text-[#1e3a5f]" />
              </div>          <Checkbox id="scanner" checked={scannerChecked} onCheckedChange={(c) => setScannerChecked(c as boolean)} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                  <Label htmlFor="scanner" className="font-bold text-base cursor-pointer leading-snug">Сканер 2D для считывания кодов маркировки</Label>
                  <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">{scannerPrices[effectiveKkm].toLocaleString('ru-RU')} руб.</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Читает квадратные коды (Data Matrix) на маркированных товарах. Обычный сканер не подойдёт.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Регистрация ККТ в ФНС — только для новых касс, заблокировано */}
        {kkmCondition === 'new' && (
          <Card className="border-[#1e3a5f] bg-[#1e3a5f]/[0.03]">
            <CardContent className="">
              <div className="flex items-start gap-2">
                <HintButton hintKey="fns_registration" {...hintProps} />

                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                  <FilePlus2 className="w-5 h-5 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                </div>            <Checkbox id="fns_reg" checked={true} disabled={true} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                    <Label htmlFor="fns_reg" className="font-bold text-sm text-[#1e3a5f] leading-snug cursor-default">Регистрация ККТ в ФНС</Label>
                    <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">1 500 руб.</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Подача заявления о регистрации кассы на сайте ФНС, подписание ЭЦП, сопровождение до подтверждения — обязательно для новой кассы</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Карточки товаров */}
        <Card className={productCardCount > 0 ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
          <CardContent className="">
            <div className="flex items-start gap-2">
              <HintButton hintKey="product_cards" {...hintProps} />

              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                <LayoutList className="w-5 h-5 sm:w-5 sm:h-5 text-[#1e3a5f]" />
              </div>          <Checkbox id="product_cards" checked={productCardCount > 0} onCheckedChange={(c) => setProductCardCount(c ? 1 : 0)} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                  <Label htmlFor="product_cards" className="font-bold text-sm sm:text-base cursor-pointer leading-snug">Создание карточек товаров</Label>
                  <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">
                    {productCardCount > 0 ? `${(getProductCardPrice(productCardCount) * productCardCount).toLocaleString('ru-RU')} руб.` : ''}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Карточки создаются на кассовом аппарате. При массовой заливке через ПК могут потребоваться доп. приложения от производителя. Не применяется для ФР Атол и ФР Штрих-М.</p>
                {productCardCount > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm shrink-0">Количество:</Label>
                      <Input type="number" min={1} max={1500} value={productCardCount}
                        onChange={(e) => setProductCardCount(Math.max(1, Math.min(1500, parseInt(e.target.value) || 0)))} className="w-24 sm:w-28" />
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>до 100 шт. — 80 руб./шт.</span>
                      <span>100–500 — 60 руб./шт.</span>
                      <span>500+ — 40 руб./шт.</span>
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
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                    {(() => { const ServiceIcon = service.id === 'training' ? GraduationCap : service.id === 'fn_replacement' ? RefreshCw : KeyRound; return <ServiceIcon className="w-5 h-5 sm:w-5 sm:h-5 text-[#1e3a5f]" /> })()}
                  </div>
                  <Checkbox id={service.id} checked={selected}
                    onCheckedChange={() => setStep3Selections((prev: string[]) => prev.includes(service.id) ? prev.filter(x => x !== service.id) : [...prev, service.id])}
                    className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                      <Label htmlFor={service.id} className="font-bold text-base cursor-pointer leading-snug">{service.name}</Label>
                      <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">{service.price.toLocaleString('ru-RU')} руб.</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{service.description}</p>
                    {service.id === 'training' && selected && (
                      <div className="mt-3 flex items-center gap-2">
                        <Label className="text-sm shrink-0">Часов:</Label>
                        <Input type="number" min={1} max={10} value={trainingHours}
                          onChange={(e) => setTrainingHours(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} className="w-20" />
                        <span className="text-sm text-slate-500">= {(service.price * trainingHours).toLocaleString('ru-RU')} руб.</span>
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

              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                <ClipboardCheck className="w-5 h-5 sm:w-5 sm:h-5 text-[#1e3a5f]" />
              </div>          <Checkbox id="service_contract" checked={serviceContractChecked}
                onCheckedChange={(c) => setServiceContractChecked(c as boolean)}
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                  <Label htmlFor="service_contract" className="font-bold text-base cursor-pointer leading-snug">Договор обслуживания</Label>
                  <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">1 000 руб./мес.</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Регулярное обслуживание кассы — визиты мастера, профилактика, приоритетная поддержка</p>
                {serviceContractChecked && (
                  <div className="mt-2 space-y-2">
                    <RadioGroup value={serviceContractPeriod} onValueChange={(v) => setServiceContractPeriod(v as 'month' | 'year')} className="space-y-2">
                      <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-[#1e3a5f]/10">
                        <RadioGroupItem value="month" id="sc_month" />
                        <Label htmlFor="sc_month" className="flex-1 cursor-pointer text-sm">
                          <span className="font-medium text-[#1e3a5f]">Помесячная оплата</span>
                          <span className="ml-2 font-bold text-[#1e3a5f]">1 000 ₽/мес.</span>
                        </Label>
                      </div>
                      <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-green-200">
                        <RadioGroupItem value="year" id="sc_year" />
                        <Label htmlFor="sc_year" className="flex-1 cursor-pointer text-sm">
                          <span className="font-medium text-[#1e3a5f]">Подписка на 12 месяцев</span>
                          <span className="ml-2 inline-flex items-center gap-1.5">
                            <span className="font-bold text-[#1e3a5f]">10 000 ₽/год</span>
                          </span>
                          <Badge className="bg-green-100 text-green-700 text-xs ml-2">выгодно</Badge>
                        </Label>
                      </div>
                    </RadioGroup>
                    <div className="p-2.5 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-lg space-y-1.5">
                      <p className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wide">Что входит в договор обслуживания:</p>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                        <li>Вызов мастера без дополнительной платы</li>
                        <li>Ежемесячный визит с ревизией и профилактикой кассы</li>
                        <li>Удалённая поддержка в рабочие часы (по МСК)</li>
                        <li>Приоритетная запись на обслуживание</li>
                      </ul>
                      <p className="text-xs text-slate-400 italic pt-1">Подробности — в договоре обслуживания</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Данные кассы — скрыты, перенесены в контакты */}

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 py-5 sm:py-6 text-base sm:text-lg font-bold" size="lg" onClick={() => { setCurrentStep(2); setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }}><ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> Назад</Button>
        </div>

        {/* Контактные данные — в центральной колонке */}
        <Card id="contacts-section" className="border-[#1e3a5f]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2"><Info className="w-5 h-5 sm:w-5 sm:h-5 text-[#1e3a5f] shrink-0" />Контактные данные</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm">Наименование (юрлицо / ИП) <span className="text-red-500">*</span></Label>
              <Input value={clientData.name} onChange={(e) => setClientData({ ...clientData, name: e.target.value })} placeholder="ООО «Ромашка»" className="mt-1" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Телефон <span className="text-red-500">*</span></Label>
                <Input type="tel" value={clientData.phone} onChange={(e) => setClientData({ ...clientData, phone: e.target.value })} placeholder="+7" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Электронная почта</Label>
                <Input type="email" value={clientData.email} onChange={(e) => setClientData({ ...clientData, email: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">ИНН <span className="text-red-500">*</span></Label>
                <Input value={clientData.inn} onChange={(e) => setClientData({ ...clientData, inn: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Адрес установки кассы</Label>
                <Input list="ru-addresses" value={clientData.address} onChange={(e) => setClientData({ ...clientData, address: e.target.value })} className="mt-1" />
                <datalist id="ru-addresses">
                  <option value="г. Москва" /><option value="г. Санкт-Петербург" /><option value="г. Новосибирск" /><option value="г. Екатеринбург" /><option value="г. Казань" /><option value="г. Нижний Новгород" /><option value="г. Челябинск" /><option value="г. Самара" /><option value="г. Омск" /><option value="г. Ростов-на-Дону" /><option value="г. Уфа" /><option value="г. Красноярск" /><option value="г. Воронеж" /><option value="г. Пермь" /><option value="г. Волгоград" /><option value="г. Краснодар" /><option value="г. Саратов" /><option value="г. Тюмень" /><option value="г. Тольятти" /><option value="г. Ижевск" /><option value="г. Барнаул" /><option value="г. Ульяновск" /><option value="г. Иркутск" /><option value="г. Хабаровск" /><option value="г. Ярославль" /><option value="г. Владивосток" /><option value="г. Махачкала" /><option value="г. Томск" /><option value="г. Оренбург" /><option value="г. Кемерово" /><option value="г. Рязань" /><option value="г. Астрахань" /><option value="г. Набережные Челны" /><option value="г. Пенза" /><option value="г. Липецк" /><option value="г. Тула" /><option value="г. Калининград" /><option value="г. Балашиха" /><option value="г. Курск" /><option value="г. Ставрополь" /><option value="г. Улан-Удэ" /><option value="г. Тверь" /><option value="г. Белгород" /><option value="г. Сочи" /><option value="г. Нижний Тагил" /><option value="г. Архангельск" /><option value="г. Волжский" /><option value="г. Калуга" /><option value="г. Сургут" /><option value="г. Чебоксары" /><option value="г. Ковров" /><option value="г. Иваново" /><option value="г. Брянск" /><option value="г. Смоленск" /><option value="г. Вологда" /><option value="г. Орёл" /><option value="г. Владимир" /><option value="г. Мурманск" /><option value="г. Череповец" /><option value="г. Тамбов" /><option value="г. Петрозаводск" /><option value="г. Кострома" /><option value="г. Новороссийск" /><option value="г. Таганрог" /><option value="г. Сыктывкар" /><option value="г. Комсомольск-на-Амуре" /><option value="г. Нальчик" /><option value="г. Йошкар-Ола" /><option value="г. Грозный" /><option value="г. Дзержинск" /><option value="г. Шахты" /><option value="г. Братск" /><option value="г. Псков" /><option value="г. Ангарск" /><option value="г. Нижневартовск" /><option value="г. Бийск" /><option value="г. Курган" /><option value="г. Прокопьевск" /><option value="г. Рыбинск" /><option value="г. Севастополь" /><option value="г. Симферополь" /><option value="г. Краснодарский край" /><option value="г. Ленинградская область" /><option value="г. Московская область" /><option value="Республика Татарстан" /><option value="Республика Башкортостан" /><option value="Краснодарский край" /><option value="Ставропольский край" /><option value="Республика Крым" />
                </datalist>
              </div>
            </div>
            {/* Данные кассы — внутри контактов */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Модель кассы <span className="text-slate-400 font-normal">(указан на самой кассе и в любом кассовом чеке)</span></Label>
                <Input value={clientData.kkmModel} onChange={(e) => setClientData({ ...clientData, kkmModel: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Заводской номер</Label>
                <Input value={clientData.kkmNumber} onChange={(e) => setClientData({ ...clientData, kkmNumber: e.target.value })} className="mt-1" />
              </div>
            </div>
            {kkmType === 'evotor' && (
              <div className="p-3 bg-[#1e3a5f]/5 rounded-lg space-y-3">
                <p className="text-sm text-[#1e3a5f] font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />Данные от ЛК Эвотор
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Логин (телефон)</Label>
                    <Input type="tel" value={clientData.evotorLogin} onChange={(e) => setClientData({ ...clientData, evotorLogin: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Пароль</Label>
                    <Input type="password" value={clientData.evotorPassword} onChange={(e) => setClientData({ ...clientData, evotorPassword: e.target.value })} className="mt-1" />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-[#e8a817]/10 border border-[#e8a817]/30 rounded-lg">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                    <RotateCcw className="w-5 h-5 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                  </div>
                  <Checkbox id="evotor_restore_r" checked={evotorRestore} onCheckedChange={(c) => setEvotorRestore(c as boolean)} className="w-5 h-5 shrink-0" />
                  <Label htmlFor="evotor_restore_r" className="cursor-pointer text-xs text-[#1e3a5f]">Нет данных ЛК — помощь с восстановлением <span className="font-semibold">500 руб.</span></Label>
                </div>
              </div>
            )}
            <div>
              <Label className="text-sm">Примечания</Label>
              <Input value={clientData.comment} onChange={(e) => setClientData({ ...clientData, comment: e.target.value })} placeholder="Дополнительная информация" className="mt-1" />
            </div>
            <p className="text-xs text-red-500 font-medium">* Название, телефон и ИНН обязательны</p>
          </CardContent>
        </Card>

        {/* Кнопка Готово — под контактами в центре */}
        <Button className="w-full bg-[#e8a817] hover:bg-[#d49a12] py-5 sm:py-6 text-lg sm:text-xl font-bold" size="lg" disabled={!clientData.name.trim() || !clientData.phone.trim() || !clientData.inn.trim()} onClick={handleDone}>
          <CheckCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Готово
        </Button>
        {kkmType === 'atol' && effectiveKkm !== 'sigma' && (
          <div className="p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-blue-800 text-sm">Согласие для добавления в партнёрский кабинет Атол</p>
                <p className="text-xs text-blue-600 mt-1">Для обслуживания Вашей кассы Атол нам нужно добавить её в наш партнёрский кабинет. Скачайте, заполните и подпишите. Укажите наш код партнёра <strong>9331</strong> в заявлении. Можете подготовить заранее или наш инженер поможет при обращении.</p>
                <a href="/soglasiye-atol.pdf" download className="inline-flex items-center gap-2 mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Скачать согласие (PDF)
                </a>
              </div>
            </div>
          </div>
        )}
        <Button variant="outline" className="w-full text-sm" onClick={handleReset}>Сбросить всё</Button>
    </div>
  )
}
