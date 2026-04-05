'use client'

import { useMemo, useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  CheckCheck, CreditCard, AlertCircle, Printer,
  Phone, MessageCircle, Send, X, ArrowLeft
} from 'lucide-react'
import { MAX_PHONE_DISPLAY, MAX_PHONE_LINK, MAX_INTENT, MAX_WEB } from '@/config/contacts'
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
@media print{body{padding:15px}}
</style></head><body>
<div style="text-align:center;margin-bottom:20px"><h1>ЗАКАЗ-НАРЯД</h1>
<p style="color:#64748b;font-size:12px;margin:2px 0">ООО &quot;Теллур-Интех&quot; | Сервисный центр кассового оборудования</p>
<p style="font-size:16px;font-weight:bold;margin:6px 0">№ ${orderNum} от ${new Date().toLocaleDateString('ru-RU')}</p></div>
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
<p><strong>Подакцизные товары:</strong> ${params.clientData.sellsExcise ? 'Да' : 'Нет'}</p></div>
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
  evotorRestore, sigmaHelpChecked, unsureFnsRegistration
}: DoneScreenProps) {
  const condLabel = kkmCondition === 'new' ? 'Новая' : kkmCondition === 'used' ? 'Б/у' : 'Текущая (рабочая)'
  const orderNum = Date.now().toString().slice(-6)
  const orderDate = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const orderHtml = useMemo(() => generateOrderHtml({
    effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc,
    step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration,
    includeChecklist: false
  }), [effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc, step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration])

  const handleSaveFile = useCallback(() => {
    const blob = new Blob([orderHtml], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `заказ-наряд-${orderNum}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [orderHtml, orderNum])

  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSendEmail = useCallback(async () => {
    setSendStatus('sending')
    try {
      const subject = `Заказ-наряд №${orderNum} от ${orderDate} — ${clientData.name || 'клиент'}`

      // Письмо на janicacid@ — с чеклистом
      const engineerHtml = generateOrderHtml({
        effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc,
        step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration,
        includeChecklist: true
      })
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'janicacid@gmail.com',
          subject,
          html: engineerHtml,
          replyTo: clientData.email || undefined,
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Send failed')
      }

      setSendStatus('sent')
    } catch (err) {
      console.error('Email send error:', err)
      setSendStatus('error')
    }
  }, [orderNum, orderDate, clientData, effectiveKkmInfo, kkmCondition, totalCalc, kkmType, step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration])

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
    <div className="max-w-2xl mx-auto space-y-5 relative">
      <button
        type="button"
        onClick={onClose}
        className="absolute -top-2 -right-2 sm:top-0 sm:right-0 w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
        aria-label="Закрыть"
      >
        <X className="w-4 h-4" strokeWidth={2.5} />
      </button>
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1e3a5f]/10 mb-3">
          <CheckCheck className="w-9 h-9 text-[#1e3a5f]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f]">Заявка сформирована!</h2>
        <p className="text-sm text-slate-500 mt-0.5">Заказ-наряд №{orderNum} от {orderDate}</p>
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
                    <span className="text-slate-700">{idx + 1}. {item.name}</span>
                    <span className="font-semibold text-slate-800 whitespace-nowrap">{item.price.toLocaleString('ru-RU')} руб.</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {totalCalc.items.length > 0 && (
            <>
              <Separator />
              <div className="flex justify-between items-center bg-[#e8a817]/10 -mx-6 px-6 py-3 rounded-lg">
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

      {/* Отправка */}
      <Card>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-3.5 text-sm font-semibold disabled:opacity-60"
              size="lg"
              onClick={handleSendEmail}
              disabled={sendStatus === 'sending' || sendStatus === 'sent'}
            >
              {sendStatus === 'sending' ? (
                <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Отправка...</>
              ) : sendStatus === 'sent' ? (
                <><CheckCheck className="w-4 h-4 mr-2" />Отправлено!</>
              ) : sendStatus === 'error' ? (
                <><AlertCircle className="w-4 h-4 mr-2" />Ошибка — повторить</>
              ) : (
                <><Send className="w-4 h-4 mr-2" />Отправить</>
              )}
            </Button>
            <Button variant="outline" className="flex-1 py-3.5 text-sm" onClick={onPrint}>
              <Printer className="w-4 h-4 mr-2" />
              Распечатать
            </Button>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row gap-2 text-sm">
            <a href={`tel:${MAX_PHONE_LINK}`} className="flex items-center gap-2 justify-center py-2 text-[#1e3a5f] font-medium hover:underline">
              <Phone className="w-4 h-4" />
              {MAX_PHONE_DISPLAY}
            </a>
            <a
              href={typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent) ? MAX_INTENT : MAX_WEB}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center py-2 text-[#1e3a5f] font-medium hover:underline">
              <MessageCircle className="w-4 h-4" />
              Написать в мессенджер
            </a>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full py-4 text-sm sm:text-base" size="lg" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Вернуться к редактированию
      </Button>
    </div>
  )
}
