'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Calculator, Printer, Info, CheckCircle2, AlertCircle,
  ShoppingCart, CreditCard, AlertTriangle,
  ScanLine, ArrowRight, ArrowLeft, CircleDot,
  HelpCircle, Phone, Mail, ExternalLink, MessageCircle, CheckCheck, ShieldCheck
} from 'lucide-react'
import {
  kkmTypes, scannerPrices, firmwareLicensePrices,
  type KkmType
} from '@/config/services'
import Image from 'next/image'

// ============================================================================
// ТИПЫ
// ============================================================================

type Step = 1 | 2 | 3 | 4
type KkmCondition = 'new' | 'used' | 'old'

// ============================================================================
// КОНТАКТЫ
// ============================================================================

const PHONES = [
  { label: '+7 (812) 465-94-57', href: 'tel:+78124659457' },
  { label: '+7 (812) 451-80-18', href: 'tel:+78124518018' },
  { label: '+7 (812) 321-06-06', href: 'tel:+78123210606' },
]

const MAX_PHONE_DISPLAY = '+7 (921) 932-41-63'
const MAX_LINK = 'https://max.ru/+79219324163'

// ============================================================================
// ПОДСКАЗКИ
// ============================================================================

interface HintData {
  what: string
  why: string
  when: string
  example: string
}

const hints: Record<string, HintData> = {
  fns_reregistration: {
    what: 'Перерегистрация — это официальная процедура внесения изменений в карточку кассы на сайте ФНС. Мы подготавливаем и подаём заявление на добавление признаков «маркировка» и/или «подакцизные товары», а также переводим кассу на формат фискальных документов ФФД 1.2 — без этого формата касса не сможет передавать данные о маркированных товарах в налоговую.',
    why: 'Без перерегистрации в ФНС касса юридически не имеет права пробивать чеки по маркированным товарам — каждый такой чек будет отклонён. Это обязательная процедура, и ошибка в заполнении заявления приведёт к отказу, а значит — к простою кассы.',
    when: 'Обязательно при первом подключении маркировки или алкоголя на кассе, которая уже работает. Если касса новая — регистрация проходит иначе.',
    example: 'У вас работает касса Атол. Вы решили продавать сигареты (маркировка). Мы заходим на сайт ФНС, аккуратно заполняем заявление: добавляем признак маркировки, обновляем формат ФФД до версии 1.2, подписываем ЭЦП и подаём. Через 1-2 дня после одобрения ФНС касса получает право работать с маркировкой.'
  },
  marking_setup: {
    what: 'Это самая сложная и ответственная часть подключения маркировки. Мы последовательно настраиваем и связываем между собой 6 различных систем: ЭДО (электронный документооборот для приёмки накладных), Честный ЗНАК (государственный реестр маркировки), вашу кассу, ТС ПИоТ (товароучётная система), а также проводим подачу заявления в ФНС со сменой формата ФФД. Для касс Эвотор дополнительно настраиваем личный кабинет. Каждая система имеет свои настройки, ключи доступа и особенности — ошибиться в связывании означает, что касса просто не будет пробивать маркированные чеки.',
    why: 'Ни одна из этих систем по отдельности не обеспечит работу с маркировкой. Все они должны быть связаны в единую цепочку: от поставщика через ЭДО → в Честный ЗНАК → в ТС ПИоТ → на кассу → чек в налоговую. Если хотя бы одно звено настроено неверно — вся цепочка рвётся, и касса не пробьёт чек по маркированному товару.',
    when: 'Обязательно после завершения перерегистрации в ФНС. Без этой настройки ни одна из систем не сможет работать с маркировкой, даже если они установлены.',
    example: 'Поставщик отправляет накладную через ЭДО → вы принимаете её в Честном ЗНАКе (проверка кодов маркировки) → данные синхронизируются в ТС ПИоТ → касса видит весь ассортимент → кассир сканирует код Data Matrix → касса проверяет код через Честный ЗНАК → чек с признаком маркировки уходит в ФНС. Мы настраиваем каждый этап этой цепочки.'
  },
  scanner_2d: {
    what: 'Специальный сканер, который читает маленькие квадратные коды (Data Matrix, QR) на маркированных товарах. Обычный плоский сканер штрих-кодов (те, что рисуются палочками) такие коды не прочитает — у них другой формат.',
    why: 'Без 2D-сканера кассир не сможет считать код маркировки на пачке сигарет, коробке обуви или бутылке воды. Касса выдаст ошибку и не пробьёт чек.',
    when: 'Обязательно при продаже маркированных товаров. Если у вас уже есть 2D-сканер (имидж-сканер) — можно не покупать.',
    example: 'Кассир берёт пачку сигарет, подносит к сканеру — сканер за долю секунды читает квадратик, касса проверяет через Честный ЗНАК и пробивает чек. Скорость — как обычный товар.'
  },
  ecp_renewal: {
    what: 'Продление квалифицированного сертификата электронной подписи (ЭЦП) на вашем защищённом носителе (Рутокен, JaCarta и др.). ЭЦП — это ваша электронная подпись, которая ставится на документы вместо ручной подписи и печати. У неё есть срок действия, обычно 1 год.',
    why: 'С истёкшей ЭЦП вы не сможете войти в личные кабинеты (Честный ЗНАК, ФНС, ЕСП), подписать документы, принять накладные от поставщиков. Система просто не пустит.',
    when: 'Когда до окончания ЭЦП осталось хотя бы 1 день. Если ЭЦП уже истёк полностью — придётся оформлять новую (это другая процедура, мы не занимаемся).',
    example: 'Ваш Рутокен показывает что срок ЭЦП заканчивается через 3 дня. Приезжаете к нам — за 15 минут продлеваем сертификат. Или скидываете Рутокен через службу доставки.'
  },
  training: {
    what: 'Практическое обучение вас или ваших сотрудников: как правильно сканировать коды маркировки, принимать товар от поставщика, пробивать чек, делать возврат, что делать если код не считывается.',
    why: 'Маркировка — это не просто «отсканируй и продай». Есть множество нюансов: код повреждён, нужен возврат, товар пришёл без кодов, накладная не совпадает. Лучше один раз научиться, чем на каждой проблеме терять время.',
    when: 'Рекомендуем всем, кто впервые сталкивается с маркировкой. Особенно полезно для кассиров.',
    example: 'Приезжаем к вам. За 1 час обучаем: 1) Принимаем тестовую накладную от поставщика, 2) Сканируем код на товаре и пробиваем чек, 3) Имитируем возврат, 4) Показываем что делать если код не читается.'
  },
  fn_replacement: {
    what: 'ФН (фискальный накопитель) — это чип внутри кассы, который хранит все пробитые чеки и передаёт данные в налоговую. У него есть срок службы: 15 или 36 месяцев. Когда срок заканчивается — чип нужно заменить на новый и перерегистрировать кассу.',
    why: 'Когда срок ФН заканчивается, касса блокируется и перестаёт пробивать чеки. Закон запрещает работать с истёкшим ФН. Это как годовой проездной — истёк, надо покупать новый.',
    when: 'Когда подходит срок (обычно за 20-30 дней ОФД или налоговая присылает уведомление).',
    example: 'Вам пришло письмо от ОФД: «ФН заканчивается через 25 дней». Меняем чип на новый, перерегистрируем кассу в ФНС. Касса снова работает.'
  },
  product_cards: {
    what: 'Создание карточек товаров в системе: присваиваем название, привязываем код маркировки (Data Matrix), заполняем необходимые поля по согласованию с вами.',
    why: 'Без карточек товаров касса не знает что она продаёт — она не поймёт что за «Winston Blue», не найдёт нужный код маркировки. Каждая позиция должна быть заведена.',
    when: 'При первом подключении маркировки или при поступлении новых товаров в ассортимент.',
    example: 'Вы дали нам прайс-лист из 200 наименований сигарет. Мы создаём 200 карточек: название бренда, артикул, привязка к коду маркировки, цена. Через пару часов всё готово к работе.'
  },
  firmware_update: {
    what: 'Обновление внутренней программы кассы (прошивки) до версии, которая поддерживает работу с маркировкой и формат ФФД 1.2.',
    why: 'Старые версии прошивок не умеют работать с маркировкой — касса просто не поймёт код на товаре и выдаст ошибку.',
    when: 'Для б/у касс и касс, которые давно не обновлялись.',
    example: 'Купили б/у кассу с прошивкой 2022 года. Обновляем до версии 2024/2025 — теперь касса понимает коды маркировки и умеет с ними работать.'
  },
  kkm_license: {
    what: 'Лицензия на кассовое программное обеспечение. Производители касс (Меркурий, Атол и др.) берут плату за использование своей программы на кассе.',
    why: 'Без лицензии касса может перестать работать или лишиться части функций. Лицензия обычно привязывается к серийному номеру кассы.',
    when: 'Для б/у касс — нужно убедиться что лицензия есть и активна. Если касса перешла к вам от другого владельца — скорее всего нужна новая лицензия.',
    example: 'Вы купили б/у кассу Атол. Предыдущий владелец не передал лицензию. Покупаем новую лицензию, привязываем к серийному номеру вашей кассы — и она работает.'
  },
  evotor_restore: {
    what: 'Восстановление доступа к личному кабинету Эвотор, если вы не помните логин (телефон) или пароль. Мы помогаем через службу поддержки Эвотор.',
    why: 'Без доступа к ЛК Эвотор невозможно управлять кассой, устанавливать и оплачивать приложения. Касса без ЛК — просто планшет.',
    when: 'Если вы не помните данные от ЛК Эвотор или касса досталась от предыдущего владельца без данных.',
    example: 'Вы не помните пароль от ЛК Эвотор. Обращаетесь к нам — мы связываемся с поддержкой Эвотор, восстанавливаем доступ. Вы получаете новые данные для входа.'
  }
}

// ============================================================================
// УСЛУГИ
// ============================================================================

interface StepService {
  id: string
  name: string
  description: string
  price: number
  hintKey?: string
}

const step2Services: StepService[] = [
  {
    id: 'fns_reregistration',
    name: 'Перерегистрация кассы в ФНС для маркировки и подакцизных товаров',
    description: 'Подготовка, подача и сопровождение заявления в ФНС — добавляем признаки маркировки и подакцизных товаров, переводим кассу на формат ФФД 1.2. Ошибка в заявлении = отказ налоговой = касса не работает',
    price: 2000,
    hintKey: 'fns_reregistration'
  },
  {
    id: 'marking_setup',
    name: 'Полная настройка маркировки под ключ',
    description: 'Многоэтапная интеграция 6 разных систем: подача заявления в ФНС, смена формата ФФД, настройка ЭДО, Честного ЗНАКа, кассы и ТС ПИоТ в единую цепочку. Для Эвотора — дополнительно личный кабинет. Малейшая ошибка в настройке — касса не пробьёт чек.',
    price: 3500,
    hintKey: 'marking_setup'
  }
]

const step3Services: StepService[] = [
  {
    id: 'ecp_renewal',
    name: 'Продление электронной подписи (ЭЦП)',
    description: 'Продление сертификата ЭЦП на Рутокене (если до истечения остался хотя бы 1 день)',
    price: 1000,
    hintKey: 'ecp_renewal'
  },
  {
    id: 'training',
    name: 'Обучение работе с маркировкой',
    description: 'Практическое занятие — сканирование, приём товара, возвраты',
    price: 1500,
    hintKey: 'training'
  },
  {
    id: 'fn_replacement',
    name: 'Замена фискального накопителя (ФН)',
    description: 'Замена чипа памяти кассы с перерегистрацией в налоговой',
    price: 2500,
    hintKey: 'fn_replacement'
  }
]

// Эвотор — доп. услуга (показывается только при выборе Эвотора)
const evotorAppInstallService: StepService = {
  id: 'evotor_app_install',
  name: 'Помощь с установкой приложений Эвотор',
  description: 'Установка и настройка приложений «Маркировка», «УТМ+», «Управление ассортиментом» и других на кассе Эвотор',
  price: 1500
}

// ============================================================================
// ЦЕНЫ КАРТОЧЕК ТОВАРОВ
// ============================================================================

function getProductCardPrice(count: number): number {
  if (count <= 100) return 80
  if (count <= 500) return 60
  return 40
}

function getProductCardPriceLabel(count: number): string {
  if (count <= 100) return '80 руб./шт.'
  if (count <= 500) return '60 руб./шт.'
  return '40 руб./шт.'
}

// ============================================================================
// КОМПОНЕНТ ПОДСКАЗКИ (click-to-toggle для мобильных)
// ============================================================================

function HintButton({ hintKey }: { hintKey: string }) {
  const hint = hints[hintKey]
  const [open, setOpen] = useState(false)
  if (!hint) return null
  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-700 hover:text-amber-800 transition-colors shrink-0"
        aria-label="Подсказка"
      >
        <span className="text-xs sm:text-sm font-bold">?</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false) }} />
          <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[280px] sm:w-80 p-3 bg-white border-2 border-amber-200 rounded-lg shadow-xl text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-700 text-xs uppercase tracking-wide">Подсказка</span>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none ml-2">×</button>
            </div>
            <div className="space-y-1.5">
              <p><strong className="text-amber-700">Что это:</strong> {hint.what}</p>
              <p><strong className="text-amber-700">Зачем:</strong> {hint.why}</p>
              <p><strong className="text-amber-700">Когда:</strong> {hint.when}</p>
              <p className="text-slate-500 text-xs mt-2 pt-2 border-t border-slate-200"><em>Пример: {hint.example}</em></p>
            </div>
            <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-amber-200 rotate-45" />
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// ШАГ-ИНДИКАТОР
// ============================================================================

function StepIndicator({ current, onClick, isDone }: { current: Step; onClick: (s: Step) => void; isDone: boolean }) {
  if (isDone) return null
  const steps = [
    { num: 1 as Step, label: 'Касса' },
    { num: 2 as Step, label: 'Услуги' },
    { num: 3 as Step, label: 'Дополнительно' }
  ]
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-4 py-2">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onClick(s.num)}
            disabled={s.num > current + 1}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3 rounded-lg transition-colors text-xs sm:text-sm font-medium ${
              s.num === current ? 'bg-[#1e3a5f] text-white shadow-md'
                : s.num < current ? 'bg-[#1e3a5f]/10 text-[#1e3a5f] hover:bg-[#1e3a5f]/20 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {s.num < current ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <CircleDot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">{s.label}</span>
            <span className="sm:hidden">{s.num}</span>
          </button>
          {i < steps.length - 1 && <div className={`w-4 sm:w-6 h-0.5 ${s.num < current ? 'bg-[#1e3a5f]/30' : 'bg-slate-200'}`} />}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// ЭКРАН «ГОТОВО»
// ============================================================================

function DoneScreen({
  effectiveKkmInfo, kkmCondition, clientData, totalCalc,
  onBack, onPrint, kkmType
}: {
  effectiveKkmInfo: { name: string }
  kkmCondition: string
  clientData: { name: string; inn: string; phone: string; email: string; address: string; kkmModel: string; kkmNumber: string; comment: string; evotorLogin: string }
  totalCalc: { items: { name: string; price: number }[]; total: number }
  onBack: () => void
  onPrint: () => void
  kkmType: string
}) {
  const condLabel = kkmCondition === 'new' ? 'Новая' : kkmCondition === 'used' ? 'Б/у' : 'Старая (рабочая)'
  const orderNum = Date.now().toString().slice(-6)
  const orderDate = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1e3a5f]/10 mb-3">
          <CheckCheck className="w-9 h-9 text-[#1e3a5f]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a5f]">Заявка сформирована!</h2>
        <p className="text-sm text-slate-500 mt-1">Заказ-наряд №{orderNum} от {orderDate}</p>
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
              <strong>ТС ПИоТ</strong> — лицензия оплачивается отдельно напрямую на сайте <strong>ao-esp.ru</strong>. Приложения Эвотор — через личный кабинет Эвотор.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки связи */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#1e3a5f]" />
            Свяжитесь с нами
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Позвонить</p>
            <div className="flex flex-col sm:flex-row gap-2">
              {PHONES.map((ph) => (
                <a key={ph.href} href={ph.href}
                  className="flex items-center gap-2 justify-center px-4 py-3 rounded-lg bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 active:bg-[#1e3a5f]/80 text-white font-medium text-sm transition-colors shadow-sm">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{ph.label}</span>
                </a>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Написать в Макс</p>
            <a href={MAX_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center px-4 py-3 rounded-lg bg-[#e8a817] hover:bg-[#d49a12] active:bg-[#c08e0e] text-white font-medium text-sm transition-colors shadow-sm">
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Написать в Макс</span>
            </a>
            <p className="text-xs text-slate-400 text-center">Номер: {MAX_PHONE_DISPLAY}</p>
          </div>
          <Separator />
          <a href="mailto:push@tellur.spb.ru"
            className="flex items-center gap-2 justify-center px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium text-sm transition-colors">
            <Mail className="w-4 h-4 shrink-0" />
            <span>push@tellur.spb.ru</span>
          </a>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-4 text-sm sm:text-base" size="lg" onClick={onPrint}>
          <Printer className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Распечатать заказ-наряд
        </Button>
        <Button variant="outline" className="flex-1 py-4 text-sm sm:text-base" size="lg" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Вернуться к редактированию
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================================================

export default function TellurServiceCalculator() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isDone, setIsDone] = useState(false)
  const [kkmType, setKkmType] = useState<KkmType>('mercury')
  const [kkmCondition, setKkmCondition] = useState<KkmCondition>('new')
  const [sigmaSelected, setSigmaSelected] = useState(false)
  const [step2Selections, setStep2Selections] = useState<string[]>([])
  const [step3Selections, setStep3Selections] = useState<string[]>([])
  const [trainingHours, setTrainingHours] = useState(1)
  const [productCardCount, setProductCardCount] = useState(0)
  const [scannerChecked, setScannerChecked] = useState(false)
  const [firmwareChecked, setFirmwareChecked] = useState(false)
  const [licenseChecked, setLicenseChecked] = useState(false)
  const [evotorRestore, setEvotorRestore] = useState(false)

  const [clientData, setClientData] = useState({
    name: '', inn: '', phone: '', email: '', address: '',
    kkmModel: '', kkmNumber: '', fnNumber: '', comment: '',
    evotorLogin: '', evotorPassword: '', hasEcp: false
  })

  const [showBanner, setShowBanner] = useState(true)

  const effectiveKkm: KkmType = (kkmType === 'atol' && sigmaSelected) ? 'sigma' : kkmType
  const currentKkmInfo = kkmTypes[kkmType]
  const effectiveKkmInfo = kkmTypes[effectiveKkm]
  const visibleKkmTypes = Object.entries(kkmTypes).filter(([_, kkm]) => !kkm.hidden)

  const needsFirmwareOrLicense = kkmCondition !== 'new' && kkmType !== 'evotor'
  const fwPrices = firmwareLicensePrices[effectiveKkm]

  // Валидация
  const contactValid = clientData.name.trim() !== '' && clientData.phone.trim() !== ''
  const ecpChecked = clientData.hasEcp
  const canGoStep2 = kkmType !== '' && kkmCondition !== '' && contactValid && ecpChecked
  const canGoStep3 = step2Selections.length > 0

  const markingDesc = useMemo(() => {
    if (kkmType === 'evotor') return 'Связываем ЭДО, Честный ЗНАК, кассу Эвотор, ТС ПИоТ и личный кабинет Эвотор в единую цепочку — от приёмки товара до пробития чека'
    return 'Связываем ЭДО, Честный ЗНАК, вашу кассу и ТС ПИоТ в единую цепочку — от приёмки товара до пробития чека'
  }, [kkmType])

  const totalCalc = useMemo(() => {
    const items: { name: string; price: number }[] = []

    step2Services.forEach(s => {
      if (step2Selections.includes(s.id)) items.push({ name: s.name, price: s.price })
    })

    step3Services.forEach(s => {
      if (step3Selections.includes(s.id)) {
        if (s.id === 'training') items.push({ name: s.name, price: s.price * trainingHours })
        else items.push({ name: s.name, price: s.price })
      }
    })

    if (scannerChecked) items.push({ name: 'Сканер 2D для считывания кодов маркировки', price: scannerPrices[effectiveKkm] })
    if (firmwareChecked) items.push({ name: 'Обновление программного обеспечения кассы', price: fwPrices.firmware })
    if (licenseChecked) items.push({ name: 'Лицензия на ПО кассы', price: fwPrices.license })
    if (evotorRestore) items.push({ name: 'Восстановление доступа к ЛК Эвотор', price: 500 })

    if (productCardCount > 0) {
      const p = getProductCardPrice(productCardCount)
      items.push({ name: `Создание карточек товаров (${productCardCount} шт.)`, price: p * productCardCount })
    }

    return { items, total: items.reduce((sum, i) => sum + i.price, 0) }
  }, [step2Selections, step3Selections, scannerChecked, firmwareChecked, licenseChecked, evotorRestore, productCardCount, trainingHours, effectiveKkm, fwPrices])

  const goToStep = (step: Step) => {
    if (step === 2 && !canGoStep2) return
    if (step === 3 && !canGoStep3) return
    setCurrentStep(step)
    setIsDone(false)
  }

  // ---- Печать ----
  const handlePrint = () => {
    const condLabel = kkmCondition === 'new' ? 'Новая' : kkmCondition === 'used' ? 'Б/у' : 'Старая (работающая)'
    const orderNum = Date.now().toString().slice(-6)
    const printContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Заказ-наряд</title><style>
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
<div class="notice"><strong>Внимание:</strong> Статья 15.12 КоАП РФ — продажа маркированных товаров без модуля ТС ПИоТ влечёт административную ответственность (штраф). Лицензия ТС ПИоТ оплачивается клиентом напрямую в ЕСП (ao-esp.ru).</div>
<div style="margin:16px 0"><h2>Клиент</h2>
<p><strong>Наименование:</strong> ${clientData.name || 'Не указано'}</p>
<p><strong>ИНН:</strong> ${clientData.inn || 'Не указано'}</p>
<p><strong>Телефон:</strong> ${clientData.phone || 'Не указано'}</p>
<p><strong>Email:</strong> ${clientData.email || 'Не указано'}</p>
<p><strong>Адрес:</strong> ${clientData.address || 'Не указано'}</p></div>
<div style="margin:16px 0"><h2>Касса</h2>
<p><strong>Тип:</strong> ${effectiveKkmInfo.name}</p>
<p><strong>Состояние:</strong> ${condLabel}</p>
<p><strong>Модель:</strong> ${clientData.kkmModel || 'Не указано'}</p>
<p><strong>Заводской номер:</strong> ${clientData.kkmNumber || 'Не указано'}</p>
${kkmType === 'evotor' ? `<p><strong>Логин ЛК Эвотор:</strong> ${clientData.evotorLogin || 'Не указано'}</p>` : ''}</div>
<h2>Услуги</h2>
<table><thead><tr><th>№</th><th>Наименование</th><th style="text-align:right">Сумма, руб.</th></tr></thead><tbody>
${totalCalc.items.length === 0 ? '<tr><td colspan="3" style="text-align:center;color:#94a3b8">Услуги не выбраны</td></tr>' : totalCalc.items.map((item, idx) => `<tr><td>${idx + 1}</td><td>${item.name}</td><td style="text-align:right">${item.price.toLocaleString('ru-RU')}</td></tr>`).join('')}
</tbody></table>
<p class="total">ИТОГО: ${totalCalc.total.toLocaleString('ru-RU')} руб.</p>
<div class="info"><strong>ТС ПИоТ:</strong> Лицензия ТС ПИоТ оплачивается клиентом напрямую на сайте ao-esp.ru. Стоимость зависит от вида товаров.</div>
<p style="font-size:11px;color:#94a3b8;margin-top:12px">* Лицензия ТС ПИоТ, приложения Эвотор, подписки — оплачиваются отдельно напрямую у поставщиков.</p>
${clientData.comment ? `<div style="margin:16px 0"><h2>Примечания</h2><p>${clientData.comment}</p></div>` : ''}
<div class="footer"><div><p><strong>Исполнитель:</strong></p><div class="signature">М.П. Подпись</div></div>
<div><p><strong>Заказчик:</strong></p><div class="signature">Подпись</div></div></div>
<script>window.print();</script></body></html>`

    const w = window.open('', '_blank')
    if (w) { w.document.write(printContent); w.document.close() }
  }

  // ===================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e8ecf2] flex flex-col">
        {/* HEADER */}
        <header className="bg-white shadow-sm border-b border-[#1e3a5f]/10">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Image src="/logo.webp" alt="Теллур-Интех" width={88} height={72} className="w-11 h-9 sm:w-[88px] sm:h-[72px]" quality={100} />
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-[#1e3a5f] truncate">Калькулятор маркировки</h1>
                  <p className="text-xs sm:text-sm text-slate-500 truncate">Рассчитайте стоимость подключения маркировки</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[#1e3a5f] border-[#1e3a5f]/30 hidden sm:inline-flex shrink-0">ООО &quot;Теллур-Интех&quot;</Badge>
            </div>
          </div>
        </header>

        {/* БАННЕР */}
        {showBanner && !isDone && (
          <div className="bg-[#e8a817]/10 border-b border-[#e8a817]/30">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-[#e8a817] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1e3a5f] text-sm sm:text-[15px]">
                    С 1 июля 2026 года продажа маркированных товаров без модуля ТС ПИоТ запрещена
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    <strong>Статья 15.12 КоАП РФ</strong> — нарушение влечёт административную ответственность (штраф).
                    Лицензия ТС ПИоТ приобретается вами напрямую на сайте <strong>ao-esp.ru</strong>.
                  </p>
                </div>
                <button onClick={() => setShowBanner(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none shrink-0 ml-1" aria-label="Закрыть">×</button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full">
          <StepIndicator current={currentStep} onClick={goToStep} isDone={isDone} />

          <div className="mt-4 sm:mt-6">
            {/* ============================================================ */}
            {/* ШАГ 1 */}
            {/* ============================================================ */}
            {currentStep === 1 && !isDone && (
              <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <ShoppingCart className="w-5 h-5 text-[#1e3a5f] shrink-0" />
                      Шаг 1. Выберите вашу кассу
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={kkmType}
                      onValueChange={(v) => { setKkmType(v as KkmType); if (v !== 'atol') setSigmaSelected(false) }}
                      className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3"
                    >
                      {visibleKkmTypes.map(([key, kkm]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <RadioGroupItem value={key} id={key} />
                          <Label htmlFor={key} className="cursor-pointer font-medium text-sm">{kkm.shortName}</Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {kkmType === 'atol' && (
                      <div className="p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Checkbox id="sigmaCheck" checked={sigmaSelected} onCheckedChange={(c) => setSigmaSelected(c as boolean)} className="w-5 h-5" />
                          <div className="min-w-0">
                            <Label htmlFor="sigmaCheck" className="cursor-pointer font-medium text-[#1e3a5f] text-sm">У меня касса Сигма (производство Атол)</Label>
                            <p className="text-xs text-slate-500 mt-0.5">Смарт-терминалы под брендом Сигма выпускаются компанией Атол</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-[#1e3a5f]/5 rounded-lg">
                      <p className="font-medium text-slate-700 text-sm">{currentKkmInfo.description}</p>
                      <ul className="mt-2 text-sm text-slate-600 space-y-1">
                        {currentKkmInfo.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#1e3a5f] shrink-0 mt-0.5" />{f}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Эвотор — приложения */}
                    {currentKkmInfo.specialNote?.apps && (
                      <div className="p-3 sm:p-4 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg space-y-3">
                        <p className="font-medium text-[#1e3a5f] text-sm">{currentKkmInfo.specialNote.title}</p>
                        <p className="text-sm text-slate-600">{currentKkmInfo.specialNote.content}</p>
                        {currentKkmInfo.specialNote.apps.map((app, idx) => (
                          <div key={idx} className="p-3 bg-white rounded border border-[#1e3a5f]/10">
                            <div className="flex items-start gap-2">
                              <div className="pt-0.5 shrink-0">
                                {app.required
                                  ? <Badge className="bg-[#e8a817]/20 text-[#1e3a5f] text-xs">Обязательно</Badge>
                                  : <Badge variant="outline" className="text-slate-500 text-xs">Опционально</Badge>
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#1e3a5f] text-sm">{app.name}</p>
                                <p className="text-sm text-slate-600 mt-0.5">{app.purpose}</p>
                                {app.condition && <p className="text-xs text-slate-500 mt-0.5">({app.condition})</p>}
                                <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1e3a5f] flex items-center gap-1 mt-1 hover:underline">
                                  <ExternalLink className="w-3 h-3 shrink-0" /><span className="break-all">Страница приложения в магазине Эвотор</span>
                                </a>
                                {app.price != null && (
                                  <p className="text-sm font-semibold text-[#1e3a5f] mt-1">{app.price.toLocaleString('ru-RU')} руб.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Состояние кассы */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Состояние кассы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={kkmCondition} onValueChange={(v) => setKkmCondition(v as KkmCondition)} className="space-y-2.5">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="new" id="cond_new" />
                        <Label htmlFor="cond_new" className="cursor-pointer text-sm">Новая (только что купленная)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="used" id="cond_used" />
                        <Label htmlFor="cond_used" className="cursor-pointer text-sm">Б/у (бывшая в употреблении)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="old" id="cond_old" />
                        <Label htmlFor="cond_old" className="cursor-pointer text-sm">Старая (уже работает, нужно добавить маркировку)</Label>
                      </div>
                    </RadioGroup>

                    {needsFirmwareOrLicense && (
                      <div className="mt-4 p-3 sm:p-4 bg-[#e8a817]/10 border border-[#e8a817]/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-[#e8a817] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1e3a5f] text-sm">Для {kkmCondition === 'used' ? 'б/у' : 'старой'} кассы {effectiveKkmInfo.name} могут потребоваться:</p>
                            <div className="mt-2 space-y-1.5 text-sm text-slate-700">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 p-2 bg-white rounded border border-[#e8a817]/20">
                                <div className="flex items-center gap-2">
                                  <Checkbox id="firmware_chk" checked={firmwareChecked} onCheckedChange={(c) => setFirmwareChecked(c as boolean)} className="w-4 h-4 shrink-0" />
                                  <Label htmlFor="firmware_chk" className="cursor-pointer text-sm">Обновление программы (прошивка)</Label>
                                  <HintButton hintKey="firmware_update" />
                                </div>
                                <span className="font-semibold text-[#1e3a5f] sm:whitespace-nowrap sm:ml-auto">{fwPrices.firmware.toLocaleString('ru-RU')} руб.</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 p-2 bg-white rounded border border-[#e8a817]/20">
                                <div className="flex items-center gap-2">
                                  <Checkbox id="license_chk" checked={licenseChecked} onCheckedChange={(c) => setLicenseChecked(c as boolean)} className="w-4 h-4 shrink-0" />
                                  <Label htmlFor="license_chk" className="cursor-pointer text-sm">Лицензия на ПО кассы</Label>
                                  <HintButton hintKey="kkm_license" />
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

                {/* Контактные данные */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Info className="w-5 h-5 text-[#1e3a5f] shrink-0" />
                      Ваши контактные данные
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label className="text-sm">Наименование / ФИО <span className="text-red-500">*</span></Label>
                        <Input value={clientData.name} onChange={(e) => setClientData({...clientData, name: e.target.value})} placeholder="ООО Ромашка" className="mt-1" />
                        {clientData.name.trim() === '' && <p className="text-xs text-red-500 mt-0.5">Обязательное поле</p>}
                      </div>
                      <div>
                        <Label className="text-sm">Телефон <span className="text-red-500">*</span></Label>
                        <Input value={clientData.phone} onChange={(e) => setClientData({...clientData, phone: e.target.value})} placeholder="+7 (999) 123-45-67" className="mt-1" />
                        {clientData.phone.trim() === '' && <p className="text-xs text-red-500 mt-0.5">Обязательное поле</p>}
                      </div>
                      <div><Label className="text-sm">Электронная почта <span className="text-red-500">*</span></Label><Input type="email" value={clientData.email} onChange={(e) => setClientData({...clientData, email: e.target.value})} placeholder="info@company.ru" className="mt-1" /></div>
                      <div><Label className="text-sm">ИНН</Label><Input value={clientData.inn} onChange={(e) => setClientData({...clientData, inn: e.target.value})} placeholder="1234567890" className="mt-1" /></div>
                    </div>
                    <div><Label className="text-sm">Адрес</Label><Input value={clientData.address} onChange={(e) => setClientData({...clientData, address: e.target.value})} placeholder="г. Москва, ул. Примерная, д. 1" className="mt-1" /></div>
                  </CardContent>
                </Card>

                {/* ЭЦП */}
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3 p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg">
                      <Checkbox id="ecp_check" checked={clientData.hasEcp} onCheckedChange={(c) => setClientData({...clientData, hasEcp: c as boolean})} className="w-5 h-5 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <Label htmlFor="ecp_check" className="cursor-pointer font-medium text-[#1e3a5f] text-sm leading-snug">
                          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 shrink-0" /> У меня есть ЭЦП или доступ к ПК, на котором установлена ЭЦП</span>
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">Для настройки маркировки потребуется электронная подпись. Если её нет — мы поможем оформить.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-4 sm:py-5 text-sm sm:text-base" size="lg" onClick={() => goToStep(2)} disabled={!canGoStep2}>
                  Далее — выбор услуг <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* ============================================================ */}
            {/* ШАГ 2 */}
            {/* ============================================================ */}
            {currentStep === 2 && !isDone && (
              <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
                <div className="p-2.5 sm:p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-lg text-xs sm:text-sm">
                  <p className="text-[#1e3a5f]"><strong>Касса:</strong> {effectiveKkmInfo.name} ({kkmCondition === 'new' ? 'новая' : kkmCondition === 'used' ? 'б/у' : 'рабочая'})</p>
                </div>

                {step2Services.map(service => {
                  const desc = service.id === 'marking_setup' ? markingDesc : service.description
                  const selected = step2Selections.includes(service.id)
                  return (
                    <Card key={service.id} className={selected ? 'border-[#1e3a5f]/30 bg-[#1e3a5f]/5' : ''}>
                      <CardContent className="pt-4 sm:pt-5">
                        <div className="flex items-start gap-3">
                          <Checkbox id={service.id} checked={selected}
                            onCheckedChange={() => setStep2Selections(prev => prev.includes(service.id) ? prev.filter(x => x !== service.id) : [...prev, service.id])}
                            className="w-5 h-5 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Label htmlFor={service.id} className="font-semibold text-sm cursor-pointer leading-snug">{service.name}</Label>
                                {service.hintKey && <HintButton hintKey={service.hintKey} />}
                              </div>
                              <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">{service.price.toLocaleString('ru-RU')} руб.</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">{desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                <Card className="border-[#e8a817]/30 bg-[#e8a817]/5">
                  <CardContent className="pt-4 sm:pt-5">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 sm:w-6 sm:h-6 text-[#e8a817] shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-[#1e3a5f] text-sm">Лицензия ТС ПИоТ — оплачивается вами напрямую</h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                          Лицензия на товароучётную систему продаётся через официальный портал <strong>ao-esp.ru</strong>.
                          Стоимость зависит от вида ваших товаров. Мы не продаём эту лицензию — помогаем подключить и настроить.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 py-4 sm:py-5 text-sm sm:text-base" size="lg" onClick={() => setCurrentStep(1)}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Назад</Button>
                  <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-4 sm:py-5 text-sm sm:text-base" size="lg" onClick={() => goToStep(3)} disabled={!canGoStep3}>Далее <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" /></Button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* ШАГ 3 */}
            {/* ============================================================ */}
            {currentStep === 3 && !isDone && (
              <div className="max-w-3xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                    <div className="p-2.5 sm:p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-lg text-xs sm:text-sm">
                      <p className="text-[#1e3a5f]"><strong>Касса:</strong> {effectiveKkmInfo.name} | <strong>Основные услуги:</strong> {step2Selections.length} шт.</p>
                    </div>

                    {/* Сканер */}
                    <Card className={scannerChecked ? 'border-[#1e3a5f]/30 bg-[#1e3a5f]/5' : ''}>
                      <CardContent className="pt-4 sm:pt-5">
                        <div className="flex items-start gap-3">
                          <Checkbox id="scanner" checked={scannerChecked} onCheckedChange={(c) => setScannerChecked(c as boolean)} className="w-5 h-5 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Label htmlFor="scanner" className="font-semibold text-sm cursor-pointer leading-snug">Сканер 2D для считывания кодов маркировки</Label>
                                <HintButton hintKey="scanner_2d" />
                              </div>
                              <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">{scannerPrices[effectiveKkm].toLocaleString('ru-RU')} руб.</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Читает квадратные коды (Data Matrix) на маркированных товарах. Обычный сканер не подойдёт.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Карточки товаров */}
                    <Card className={productCardCount > 0 ? 'border-[#1e3a5f]/30 bg-[#1e3a5f]/5' : ''}>
                      <CardContent className="pt-4 sm:pt-5">
                        <div className="flex items-start gap-3">
                          <Checkbox id="product_cards" checked={productCardCount > 0} onCheckedChange={(c) => setProductCardCount(c ? 1 : 0)} className="w-5 h-5 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Label htmlFor="product_cards" className="font-semibold text-sm cursor-pointer leading-snug">Создание карточек товаров</Label>
                                <HintButton hintKey="product_cards" />
                              </div>
                              <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">
                                {productCardCount > 0 ? `${(getProductCardPrice(productCardCount) * productCardCount).toLocaleString('ru-RU')} руб.` : ''}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Название, привязка кода маркировки (DM), заполнение полей</p>
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
                    {step3Services.map(service => {
                      const selected = step3Selections.includes(service.id)
                      return (
                        <Card key={service.id} className={selected ? 'border-[#1e3a5f]/30 bg-[#1e3a5f]/5' : ''}>
                          <CardContent className="pt-4 sm:pt-5">
                            <div className="flex items-start gap-3">
                              <Checkbox id={service.id} checked={selected}
                                onCheckedChange={() => setStep3Selections(prev => prev.includes(service.id) ? prev.filter(x => x !== service.id) : [...prev, service.id])}
                                className="w-5 h-5 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Label htmlFor={service.id} className="font-semibold text-sm cursor-pointer leading-snug">{service.name}</Label>
                                    {service.hintKey && <HintButton hintKey={service.hintKey} />}
                                  </div>
                                  <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">{service.price.toLocaleString('ru-RU')} руб.</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">{service.description}</p>
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

                    {/* Помощь с установкой приложений Эвотор */}
                    {kkmType === 'evotor' && (() => {
                      const service = evotorAppInstallService
                      const selected = step3Selections.includes(service.id)
                      return (
                        <Card key={service.id} className={selected ? 'border-[#1e3a5f]/30 bg-[#1e3a5f]/5' : ''}>
                          <CardContent className="pt-4 sm:pt-5">
                            <div className="flex items-start gap-3">
                              <Checkbox id={service.id} checked={selected}
                                onCheckedChange={() => setStep3Selections(prev => prev.includes(service.id) ? prev.filter(x => x !== service.id) : [...prev, service.id])}
                                className="w-5 h-5 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <Label htmlFor={service.id} className="font-semibold text-sm cursor-pointer leading-snug">{service.name}</Label>
                                  <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">{service.price.toLocaleString('ru-RU')} руб.</span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">{service.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })()}

                    {/* Данные кассы */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2"><Info className="w-5 h-5 text-[#1e3a5f] shrink-0" />Информация о кассе</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                          <div><Label className="text-sm">Модель</Label><Input value={clientData.kkmModel} onChange={(e) => setClientData({...clientData, kkmModel: e.target.value})} placeholder="Меркурий-185Ф" className="mt-1" /></div>
                          <div><Label className="text-sm">Заводской номер</Label><Input value={clientData.kkmNumber} onChange={(e) => setClientData({...clientData, kkmNumber: e.target.value})} placeholder="На корпусе" className="mt-1" /></div>
                          <div><Label className="text-sm">Номер ФН</Label><Input value={clientData.fnNumber} onChange={(e) => setClientData({...clientData, fnNumber: e.target.value})} placeholder="Если знаете" className="mt-1" /></div>
                        </div>

                        {kkmType === 'evotor' && (
                          <>
                            <Separator />
                            <div className="p-3 bg-[#1e3a5f]/5 rounded-lg">
                              <p className="text-sm text-[#1e3a5f] font-medium flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" />Нужны данные от личного кабинета Эвотор
                              </p>
                              <p className="text-xs text-slate-500 mt-1 ml-6">Логин — номер телефона, к которому привязана касса</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <Label className="text-sm">Логин ЛК Эвотор (телефон)</Label>
                                <Input type="tel" value={clientData.evotorLogin} onChange={(e) => setClientData({...clientData, evotorLogin: e.target.value})} placeholder="+7 (999) 123-45-67" className="mt-1" />
                              </div>
                              <div>
                                <Label className="text-sm">Пароль ЛК Эвотор</Label>
                                <Input type="password" value={clientData.evotorPassword} onChange={(e) => setClientData({...clientData, evotorPassword: e.target.value})} placeholder="Пароль" className="mt-1" />
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-[#e8a817]/10 border border-[#e8a817]/30 rounded-lg">
                              <Checkbox id="evotor_restore" checked={evotorRestore} onCheckedChange={(c) => setEvotorRestore(c as boolean)} className="w-5 h-5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <Label htmlFor="evotor_restore" className="cursor-pointer font-medium text-[#1e3a5f] text-sm">Данные от ЛК Эвотор неизвестны — нужна помощь с восстановлением</Label>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <HintButton hintKey="evotor_restore" />
                                  <span className="text-sm font-semibold text-[#1e3a5f]">500 руб.</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div>
                          <Label className="text-sm">Примечания</Label>
                          <Input value={clientData.comment} onChange={(e) => setClientData({...clientData, comment: e.target.value})} placeholder="Дополнительная информация" className="mt-1" />
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 py-4 sm:py-5 text-sm sm:text-base" size="lg" onClick={() => setCurrentStep(2)}><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Назад</Button>
                    </div>
                  </div>

                  {/* ===== ПРАВАЯ КОЛОНКА ===== */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-4 sm:top-6 space-y-4 sm:space-y-5">
                      <Card className="border-[#1e3a5f]/20 bg-white">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-[#1e3a5f] text-sm sm:text-base"><CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />Расчёт стоимости</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 mb-4">
                            {totalCalc.items.length === 0 ? <p className="text-sm text-slate-500 italic">Отметьте услуги</p>
                              : totalCalc.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs sm:text-sm gap-2">
                                  <span className="text-slate-600 leading-snug">{item.name}</span>
                                  <span className="font-medium whitespace-nowrap shrink-0">{item.price.toLocaleString('ru-RU')} ₽</span>
                                </div>
                              ))}
                          </div>
                          <Separator className="my-3" />
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-base sm:text-lg">Итого:</span>
                            <span className="font-bold text-xl sm:text-2xl text-[#1e3a5f]">{totalCalc.total.toLocaleString('ru-RU')} ₽</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">Касса: {effectiveKkmInfo.name}</p>
                          <p className="text-xs text-slate-400">ТС ПИоТ, приложения Эвотор — отдельно</p>
                        </CardContent>
                      </Card>

                      <Button className="w-full bg-[#e8a817] hover:bg-[#d49a12] py-4 sm:py-5 text-sm sm:text-base font-semibold" size="lg" onClick={() => setIsDone(true)}>
                        <CheckCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Готово
                      </Button>
                      <Button variant="outline" className="w-full text-sm" onClick={() => {
                        setStep2Selections([]); setStep3Selections([]); setScannerChecked(false); setProductCardCount(0); setTrainingHours(1); setFirmwareChecked(false); setLicenseChecked(false); setEvotorRestore(false)
                      }}>Сбросить всё</Button>

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
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ГОТОВО */}
            {isDone && (
              <DoneScreen
                effectiveKkmInfo={effectiveKkmInfo}
                kkmCondition={kkmCondition}
                clientData={clientData}
                totalCalc={totalCalc}
                onBack={() => setIsDone(false)}
                onPrint={handlePrint}
                kkmType={kkmType}
              />
            )}
          </div>
        </main>

        <footer className="bg-white border-t border-[#1e3a5f]/10 mt-auto">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex items-center justify-center gap-3">
            <Image src="/logo.webp" alt="Теллур-Интех" width={56} height={46} className="w-7 h-[23px] sm:w-[56px] sm:h-[46px]" quality={100} />
            <p className="text-xs sm:text-sm text-slate-500">ООО &quot;Теллур-Интех&quot; — сервисный центр кассового оборудования</p>
          </div>
        </footer>
      </div>
  )
}
