'use client'

import { useMemo, useCallback, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CheckCheck, CreditCard, AlertCircle, Printer,
  Phone, MessageSquare, Download, X, ArrowLeft, CheckCircle2, Info
} from 'lucide-react'
import { PHONES } from '@/config/contacts'
import type { DoneScreenProps, GenerateOrderHtmlParams } from './types'

// ============================================================================
// ГЕНЕРАЦИЯ HTML ЗАКАЗ-НАРЯДА
// ============================================================================

export function generateOrderHtml(params: GenerateOrderHtmlParams): string {
  const condLabel = params.kkmCondition === 'new' ? 'Новая' : params.kkmCondition === 'used' ? 'Б/у' : 'Текущая (работающая)'
  const orderNum = Date.now().toString().slice(-6)
  const sepText = params.kkmType === 'evotor' || params.kkmType === 'sigma' ? 'ТС ПИоТ и подписка на смарт-терминале — оплачиваются отдельно напрямую у поставщиков.' : 'ТС ПИоТ — оплачивается отдельно напрямую на сайте ao-esp.ru.'

  // Generate engineer checklist
  const checklist: string[] = []
  if (params.kkmCondition === 'new') {
    checklist.push('Зарегистрировать ККТ в ФНС')
    checklist.push('Подключить ОФД')
    checklist.push('Установить ФН')
  }
  if (params.step2Selections.includes('fns_reregistration') || params.kkmCondition === 'old') {
    checklist.push('Перерегистрация в ФНС с признаками маркировки/подакцизные товары')
    checklist.push('Сменить формат ФФД на 1.2')
  }
  if (params.step2Selections.includes('marking_setup')) {
    checklist.push('Настроить ЭДО')
    checklist.push('Настроить Честный ЗНАК')
    checklist.push('Настроить ТС ПИоТ')
    checklist.push('Пробить тестовый маркированный чек')
    if (params.kkmType === 'evotor') {
      checklist.push('Установить приложение «Маркировка» на Эвотор')
      checklist.push('Настроить личный кабинет Эвотор')
      if (params.clientData.sellsExcise) {
        checklist.push('Добавить признак подакцизных товаров')
        checklist.push('Установить УТМ+ на Эвотор')
      }
    }
    // Add excise goods checklist items for any brand
    if (params.clientData.sellsExcise) {
      if (params.kkmType !== 'evotor') {
        checklist.push('Добавить признак подакцизных товаров')
      }
      checklist.push('Настроить УТМ (ЕГАИС) для подакцизных товаров')
    }
    if (params.kkmType === 'atol') {
      checklist.push('Проверить/оформить тариф Сигма (sigma.ru/tarify/)')
    }
    if (params.sigmaHelpChecked) {
      checklist.push('Восстановить доступ к кабинету Сигма')
      checklist.push('Оформить тариф Сигма')
    }
  }
  if (params.step2Selections.includes('partial_marketing_setup')) {
    checklist.push('Проверить все подключения (ЭДО, Честный ЗНАК, ТС ПИоТ)')
    checklist.push('Настроить недостающие модули маркировки')
  }
  if (params.unsureFnsRegistration) {
    checklist.push('Проверить регистрацию ККТ в ФНС — признаки маркировки и ФФД 1.2')
  }
  if (params.scannerChecked) {
    checklist.push('Подключить 2D-сканер')
    checklist.push('Проверить чтение кодов Data Matrix')
  }
  if (params.fnChecked) {
    checklist.push('Установить ФН')
    checklist.push('Проверить активацию ФН')
  }
  if (params.productCardCount > 0) {
    checklist.push(`Создать карточки товаров (${params.productCardCount} шт.)`)
  }
  if (params.step3Selections.includes('ecp_renewal')) {
    checklist.push('Продлить ЭЦП на токене клиента')
  }
  if (params.step3Selections.includes('training')) {
    checklist.push('Провести обучение работе с маркировкой')
  }
  if (params.evotorRestore) {
    checklist.push('Восстановить доступ к ЛК Эвотор')
  }
  if (params.isConsultation) {
    checklist.push('⚠️ ЗАЯВКА НА КОНСУЛЬТАЦИЮ — уточнить у клиента модель кассы и проблему')
    if (params.clientData.kkmModel) {
      checklist.push(`Модель кассы клиента: ${params.clientData.kkmModel}`)
    }
  }
  // ЭЦП — обязательно, уточнить у клиента (не показываем для консультации — не спрашивали)
  if (!params.isConsultation) {
    if (!params.clientData.hasEcp) {
      checklist.push('⚠️ КЛИЕНТ БЕЗ ЭЦП — проконсультировать и помочь оформить (обязательное требование для маркировки)')
    } else {
      checklist.push('У клиента есть ЭЦП — проверить срок действия и тип')
    }
  }

  const checklistHtml = params.includeChecklist !== false && checklist.length > 0
    ? `<div style="margin:16px 0"><h2 style="color:#166534;border-bottom:2px solid #166534;padding-bottom:6px;font-size:15px">📋 Чек-лист для инженера</h2>
<table style="width:100%;border-collapse:collapse;margin:8px 0"><tbody>
${checklist.map(item => `<tr><td style="border:1px solid #bbf7d0;padding:6px 8px;font-size:13px;width:30px;text-align:center">☐</td><td style="border:1px solid #bbf7d0;padding:6px 8px;font-size:13px">${item}</td></tr>`).join('')}
</tbody></table></div>`
    : ''

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Заказ-наряд</title><style>
body{font-family:Arial,Helvetica,sans-serif;padding:20px;max-width:800px;margin:0 auto;color:#1e293b}
h1{text-align:center;margin:0 0 5px}h2{color:#334155;border-bottom:2px solid #1e3a5f;padding-bottom:6px;font-size:15px}
table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left;font-size:13px}th{background:#f1f5f9}
.total{font-size:17px;font-weight:bold;text-align:right;margin:16px 0}
.footer{margin-top:30px;display:flex;justify-content:space-between}
.signature{width:180px;border-top:1px solid #000;padding-top:4px;text-align:center;font-size:13px}
.notice{background:#fef2f2;padding:10px;border-radius:6px;margin:12px 0;font-size:12px}
.info{background:#fffbeb;padding:10px;border-radius:6px;margin:12px 0;font-size:12px}
.correction{background:linear-gradient(135deg,#ff6b35 0%,#f7931e 100%);color:#fff;padding:16px 20px;border-radius:10px;margin:16px 0;text-align:center;font-size:18px;font-weight:bold;letter-spacing:1px;box-shadow:0 4px 15px rgba(255,107,53,0.4)}
.correction-time{font-size:13px;font-weight:normal;margin-top:4px;opacity:0.9}
@media print{body{padding:15px}}
</style></head><body>
${params.isCorrection ? `<div class="correction">⚡ КОРРЕКТИРОВКА ЗАКАЗА<br><span class="correction-time">Повторная отправка от ${new Date().toLocaleString('ru-RU')}</span></div>` : ''}
<div style="text-align:center;margin-bottom:20px"><h1>${params.isCorrection ? 'КОРРЕКТИРОВКА — ЗАКАЗ-НАРЯД' : 'ЗАКАЗ-НАРЯД'}</h1>
<p style="color:#64748b;font-size:12px;margin:2px 0">ООО &quot;Теллур-Интех&quot; | Сервисный центр кассового оборудования</p>
<p style="font-size:16px;font-weight:bold;margin:6px 0">№ ${params.orderNum || orderNum} от ${new Date().toLocaleDateString('ru-RU')}</p></div>
<div style="margin:16px 0"><h2>Клиент</h2>
<p><strong>Наименование:</strong> ${params.clientData.name || 'Не указано'}</p>
<p><strong>ИНН:</strong> ${params.clientData.inn || 'Не указано'}</p>
<p><strong>Телефон:</strong> ${params.clientData.phone || 'Не указано'}</p>
<p><strong>Email:</strong> ${params.clientData.email || 'Не указано'}</p>
<p><strong>Адрес:</strong> ${params.clientData.address || 'Не указано'}</p></div>
<div style="margin:16px 0"><h2>Касса</h2>
<p><strong>Тип:</strong> ${params.effectiveKkmInfo.name}</p>
<p><strong>Состояние:</strong> ${condLabel}</p>
<p><strong>Модель:</strong> ${params.clientData.kkmModel || 'Не указано'}</p>
<p><strong>Заводской номер:</strong> ${params.clientData.kkmNumber || 'Не указано'}</p>
${params.kkmType === 'evotor' ? `<p><strong>Логин ЛК Эвотор:</strong> ${params.clientData.evotorLogin || 'Не указано'}</p>` : ''}
<p><strong>Подакцизные товары:</strong> ${params.clientData.sellsExcise ? 'Да' : 'Нет'}</p>
${!params.isConsultation ? `<p><strong>ЭЦП (электронная подпись):</strong> ${params.clientData.hasEcp ? '<span style="color:#166534;font-weight:bold">✅ Есть</span>' : '<span style="color:#dc2626;font-weight:bold">❌ Нет</span>'}</p>` : ''}</div>
${!params.isConsultation && !params.clientData.hasEcp ? '<div style="background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border:2px solid #f59e0b;border-radius:10px;padding:16px 20px;margin:16px 0;text-align:center"><p style="font-size:16px;font-weight:bold;color:#92400e;margin:0 0 6px">⚠️ У клиента отсутствует ЭЦП</p><p style="font-size:13px;color:#92400e;margin:0 0 4px">ЭЦП (электронная подпись на Рутокен / JaCarta) — <strong>обязательна</strong> для регистрации кассы и работы с маркировкой.</p><p style="font-size:13px;color:#78350f;margin:0"><strong>Действие менеджера:</strong> при звонке клиенту — предупредить об обязательности ЭЦП и помочь подобрать вариант оформления. Мы подскажем, как её можно получить быстро.</p></div>' : ''}
${!params.isConsultation && params.clientData.hasEcp ? '<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:12px 16px;margin:16px 0"><p style="font-size:13px;color:#166534;margin:0">✅ У клиента есть ЭЦП — при звонке уточнить срок действия и тип подписи (КЭП / НЭП).</p></div>' : ''}
<h2>Услуги</h2>
<table><thead><tr><th>№</th><th>Наименование</th><th style="text-align:right">Сумма, руб.</th></tr></thead><tbody>
${params.totalCalc.items.length === 0 ? '<tr><td colspan="3" style="text-align:center;color:#94a3b8">Услуги не выбраны</td></tr>' : params.totalCalc.items.map((item, idx) => `<tr><td>${idx + 1}</td><td>${item.name}</td><td style="text-align:right">${item.price.toLocaleString('ru-RU')}</td></tr>`).join('')}
</tbody></table>
<p class="total">ИТОГО: ${params.totalCalc.total.toLocaleString('ru-RU')} руб.</p>
${checklistHtml}
<p style="font-size:11px;color:#94a3b8;margin-top:12px">* ${sepText}</p>
${params.clientData.comment ? `<div style="margin:16px 0"><h2>Примечания</h2><p>${params.clientData.comment}</p></div>` : ''}
<div class="footer"><div><p><strong>Исполнитель:</strong></p><div class="signature">М.П. Подпись</div></div>
<div><p><strong>Заказчик:</strong></p><div class="signature">Подпись</div></div></div>
</body></html>`
}

// ============================================================================
// ЭКРАН «ГОТОВО»
// ============================================================================

export function DoneScreen({
  effectiveKkmInfo, kkmCondition, clientData, totalCalc,
  onBack, onPrint, onClose, kkmType, effectiveKkm,
  step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked,
  evotorRestore, sigmaHelpChecked, unsureFnsRegistration,
  orderNum, isCorrection,
  isConsultation = false
}: DoneScreenProps) {
  const condLabel = kkmCondition === 'new' ? 'Новая' : kkmCondition === 'used' ? 'Б/у' : 'Текущая (рабочая)'
  const safeOrderNum = orderNum || Date.now().toString().slice(-6)
  const orderDate = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const correctionTime = isCorrection ? new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : null

  const orderHtml = useMemo(() => generateOrderHtml({
    effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc,
    step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration,
    includeChecklist: false,
    isCorrection,
    isConsultation,
    correctionTime,
    orderNum: safeOrderNum
  }), [effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc, step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration, isCorrection, isConsultation, correctionTime, safeOrderNum])

  const handleSaveFile = useCallback(() => {
    const blob = new Blob([orderHtml], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `заказ-наряд-${safeOrderNum}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [orderHtml, safeOrderNum])

  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'sent_fallback' | 'error'>('idle')
  const [sentToEmail, setSentToEmail] = useState<string>('')

  // Автоотправка письма при появлении экрана
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setSendStatus('sending')
      try {
        const correctionLabel = isCorrection && !isConsultation ? ' ⚡ КОРРЕКТИРОВКА' : ''
        const consultationLabel = isConsultation ? ' 📋 КОНСУЛЬТАЦИЯ' : ''
        const subject = `Заказ-наряд №${safeOrderNum} от ${orderDate}${correctionLabel}${consultationLabel} — ${clientData.name || 'клиент'}`
        const engineerHtml = generateOrderHtml({
          effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc,
          step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration,
          includeChecklist: true,
          isCorrection: isCorrection && !isConsultation,
          isConsultation,
          correctionTime,
          orderNum: safeOrderNum
        })
        const res = await fetch('/api/send-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: process.env.NEXT_PUBLIC_ORDER_EMAIL || 'push@tellur.spb.ru',
            subject,
            html: engineerHtml,
            replyTo: clientData.email || undefined,
          })
        })
        if (cancelled) return
        if (!res.ok) throw new Error('Send failed')
        const result = await res.json()
        if (result.sentToFallback) {
          setSentToEmail(result.sentTo)
          setSendStatus('sent_fallback')
        } else {
          setSendStatus('sent')
        }
      } catch (err) {
        if (cancelled) return
        console.error('Email send error:', err)
        setSendStatus('error')
      }
    })()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleWebShare = useCallback(async () => {
    try {
      const blob = new Blob([orderHtml], { type: 'text/html;charset=utf-8' })
      const file = new File([blob], `заказ-наряд-${orderNum}.html`, { type: 'text/html' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Заказ-наряд №${orderNum}`,
          text: `Заказ-наряд от ${orderDate}. Сумма: ${totalCalc.total.toLocaleString('ru-RU')} руб.`,
          files: [file]
        })
      } else {
        handleSaveFile()
      }
    } catch {
      // User cancelled or not supported
      handleSaveFile()
    }
  }, [orderHtml, orderNum, orderDate, totalCalc, handleSaveFile])

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex justify-end -mb-1">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1e3a5f]/10 mb-3">
          <CheckCheck className="w-9 h-9 text-[#1e3a5f]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f]">{isConsultation ? 'Заявка на консультацию!' : isCorrection ? 'Заявка скорректирована!' : 'Заявка сформирована!'}</h2>
        <p className="text-sm text-slate-500 mt-0.5">Заказ-наряд №{safeOrderNum} от {orderDate}</p>
        {isConsultation && (
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Менеджер перезвонит для консультации по вашей кассе</span>
          </div>
        )}
        {isCorrection && (
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-orange-100 border border-orange-300 rounded-full">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-700">Это корректировка предыдущей заявки — номер сохранён</span>
          </div>
        )}
      </div>

      <Card className="border-[#1e3a5f]/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-[#1e3a5f]">
            <CreditCard className="w-5 h-5" />
            Заказ-наряд
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">Клиент</h3>
            <div className="space-y-0.5 text-sm">
              {clientData.name && <p className="font-medium text-slate-700">{clientData.name}</p>}
              {clientData.inn && <p className="text-slate-600">ИНН: {clientData.inn}</p>}
              {clientData.phone && <p className="text-slate-600">Тел: {clientData.phone}</p>}
              {clientData.email && <p className="text-slate-600">Email: {clientData.email}</p>}
              {clientData.address && <p className="text-slate-600">{clientData.address}</p>}
              {!clientData.name && !clientData.inn && <p className="text-slate-400 italic">Контактные данные не указаны</p>}
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">Касса</h3>
            <div className="space-y-0.5 text-sm">
              <p className="font-medium text-slate-700">{effectiveKkmInfo.name} — {condLabel}</p>
              {clientData.kkmModel && <p className="text-slate-600">Модель: {clientData.kkmModel}</p>}
              {clientData.kkmNumber && <p className="text-slate-600">Зав. №: {clientData.kkmNumber}</p>}
              {kkmType === 'evotor' && clientData.evotorLogin && <p className="text-slate-600">ЛК Эвотор: {clientData.evotorLogin}</p>}
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">Услуги</h3>
            {totalCalc.items.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Услуги не выбраны</p>
            ) : (
              <div className="space-y-1">
                {totalCalc.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-2 text-sm">
                    <span className="text-slate-700 min-w-0">{idx + 1}. {item.name}</span>
                    <span className="font-semibold text-slate-800 whitespace-nowrap shrink-0">{item.price.toLocaleString('ru-RU')} руб.</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {totalCalc.items.length > 0 && (
            <>
              <Separator />
              <div className="flex justify-between items-center bg-[#e8a817]/10 py-3 rounded-lg">
                <span className="font-bold text-base sm:text-lg">Итого:</span>
                <span className="font-bold text-xl sm:text-2xl text-[#1e3a5f]">{totalCalc.total.toLocaleString('ru-RU')} руб.</span>
              </div>
            </>
          )}
          {clientData.comment && (
            <><Separator /><div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Примечания</h3>
              <p className="text-sm text-slate-600">{clientData.comment}</p>
            </div></>
          )}
          <div className="p-3 bg-[#e8a817]/10 border border-[#e8a817]/30 rounded-lg">
            <p className="text-xs text-[#1e3a5f]">
              {kkmType === 'evotor' || effectiveKkm === 'sigma'
                ? <>ТС ПИоТ — лицензия оплачивается отдельно на сайте <a href="https://ao-esp.ru" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline font-semibold">ao-esp.ru</a>. Подписка на смарт-терминал (Эвотор, Сигма и др.) оплачивается самостоятельно через магазин производителя.</>
                : <>ТС ПИоТ — лицензия оплачивается отдельно на сайте <a href="https://ao-esp.ru" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline font-semibold">ao-esp.ru</a>.</>
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Уведомление об автоотправке */}
      {sendStatus === 'sent' && (
        <div className="flex items-start gap-2.5 p-3 bg-green-50 border border-green-200 rounded-xl animate-fade-in-up">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-800">Заявка отправлена в Теллур-Интех</p>
            <p className="text-green-700 mt-0.5">Наш специалист свяжется с Вами для уточнения деталей.</p>
          </div>
        </div>
      )}
      {sendStatus === 'sent_fallback' && (
        <div className="flex items-start gap-2.5 p-3 bg-green-50 border border-green-200 rounded-xl animate-fade-in-up">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-800">Заявка отправлена в Теллур-Интех</p>
            <p className="text-green-700 mt-0.5">Наш специалист свяжется с Вами для уточнения деталей.</p>
          </div>
        </div>
      )}
      {sendStatus === 'error' && (
        <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl animate-fade-in-up">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-red-800">Не удалось отправить заявку</p>
            <p className="text-red-700 mt-0.5">Произошёл сбой при автоматической отправке. Сохраните заказ-наряд и отправьте его удобным способом:</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <a href="tel:+78124659457" className="flex items-center gap-1.5 text-red-700 font-medium hover:text-red-900 hover:underline">
                <Phone className="w-3.5 h-3.5" />Позвонить
              </a>
              <button type="button" onClick={() => window.dispatchEvent(new Event('open-chat'))} className="flex items-center gap-1.5 text-red-700 font-medium hover:text-red-900 hover:underline">
                <MessageSquare className="w-3.5 h-3.5" />Написать в чат
              </button>
            </div>
          </div>
        </div>
      )}
      {sendStatus === 'sending' && (
        <div className="flex items-center gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <span className="inline-block w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin shrink-0" />
          <p className="text-sm text-blue-700">Отправляем заявку менеджеру...</p>
        </div>
      )}

      {/* Кнопки сохранения */}
      <Card>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-3.5 text-sm font-semibold"
              size="lg"
              onClick={handleSaveFile}
            >
              <Download className="w-4 h-4 mr-2" />
              Сохранить на устройстве
            </Button>
            <Button variant="outline" className="flex-1 py-3.5 text-sm" onClick={onPrint}>
              <Printer className="w-4 h-4 mr-2" />
              Распечатать
            </Button>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row gap-2 text-sm">
            <a href="tel:+78124659457" className="flex items-center gap-2 justify-center py-2 text-[#1e3a5f] font-medium hover:underline">
              <Phone className="w-4 h-4" />
              {PHONES[0].label}
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-chat'))}
              className="flex items-center gap-2 justify-center py-2 text-[#1e3a5f] font-medium hover:underline">
              <MessageSquare className="w-4 h-4" />
              Написать в чат
            </button>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full py-4 text-sm sm:text-base" size="lg" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        {isConsultation ? 'Новый расчёт' : 'Вернуться к редактированию'}
      </Button>
    </div>
  )
}
