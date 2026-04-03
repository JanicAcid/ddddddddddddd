'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
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
  ScanLine, ArrowRight, ArrowLeft,
  HelpCircle, Phone, Mail, ExternalLink, MessageCircle, CheckCheck, ShieldCheck,
  X, Download, Send, Check, CheckCircle
} from 'lucide-react'
import {
  kkmTypes, scannerPrices, firmwareLicensePrices, sigmaSubscriptions,
  type KkmType
} from '@/config/services'
import Image from 'next/image'

// ============================================================================
// ТИПЫ
// ============================================================================

type Step = 1 | 2 | 3 | 4
type KkmCondition = 'new' | 'used' | 'old'
type OfdPeriod = '15' | '36'

// ============================================================================
// КОНТАКТЫ
// ============================================================================

const PHONES = [
  { label: '+7 (812) 465-94-57', href: 'tel:+78124659457' },
  { label: '+7 (812) 451-80-18', href: 'tel:+78124518018' },
  { label: '+7 (812) 321-06-06', href: 'tel:+78123210606' },
]

const MAX_PHONE_DISPLAY = '+7 (921) 932-41-63'
const MAX_PHONE_LINK = '+79219324163'
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
    what: 'Это самая сложная и ответственная часть подключения маркировки. Мы последовательно настраиваем и связываем между собой 6 различных систем: ЭДО (электронный документооборот для приёмки накладных), Честный ЗНАК (государственный реестр маркировки), вашу кассу, ТС ПИоТ (Единый Сервисный Модуль), а также проводим подачу заявления в ФНС со сменой формата ФФД. Для касс Эвотор дополнительно настраиваем личный кабинет. Каждая система имеет свои настройки, ключи доступа и особенности — ошибиться в связывании означает, что касса просто не будет пробивать маркированные чеки.',
    why: 'Ни одна из этих систем по отдельности не обеспечит работу с маркировкой. Все они должны быть связаны в единую цепочку: от поставщика через ЭДО → в Честный ЗНАК → в ТС ПИоТ → на кассу → чек в налоговую. Если хотя бы одно звено настроено неверно — вся цепочка рвётся, и касса не пробьёт чек по маркированному товару.',
    when: 'Обязательно после завершения перерегистрации в ФНС. Без этой настройки ни одна из систем не сможет работать с маркировкой, даже если они установлены.',
    example: 'Поставщик отправляет накладную через ЭДО → вы принимаете её в Честном ЗНАКе (проверка кодов маркировки) → данные синхронизируются в ТС ПИоТ → касса видит весь ассортимент → кассир сканирует код Data Matrix → касса проверяет код через Честный ЗНАК → чек с признаком маркировки уходит в ФНС. Мы настраиваем каждый этап этой цепочки.'
  },
  partial_marketing_setup: {
    what: 'Частичная настройка маркировки — это донастройка отдельных модулей и связей, которые требуются для корректной работы кассы с маркированными товарами. Включает в себя проверку и настройку дополнительных компонентов интеграции между кассой, Честным ЗНАКом и сопутствующими системами.',
    why: 'Если касса уже работала, но часть модулей или связей не была настроена, маркированные чеки могут не пробиваться. Устраняем проблемы в интеграции пошагово.',
    when: 'Когда касса уже зарегистрирована в ФНС и работает, но есть проблемы с пробитием маркированных чеков, или нужно добавить работу с новыми категориями маркированных товаров.',
    example: 'У вас касса работает, но при попытке пробить чек по сигаретам выдаётся ошибка. Мы проверяем все связи — ЭДО, Честный ЗНАК, настройки кассы — и настраиваем недостающие компоненты.'
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
    what: 'Карточки товаров создаются непосредственно на кассовом аппарате — каждая позиция заносится в память кассы: название, артикул, привязка к коду маркировки (Data Matrix), цена и другие поля. Обратите внимание: при массовой заливке карточек средствами ПК (через 1С, Excel или другие программы) могут потребоваться дополнительные приложения от производителя вашей кассы для корректного импорта данных.',
    why: 'Без карточек товаров касса не знает что она продаёт — она не поймёт что за «Winston Blue», не найдёт нужный код маркировки. Каждая позиция должна быть заведена в кассу, чтобы кассир мог выбрать товар и пробить чек.',
    when: 'При первом подключении маркировки или при поступлении новых товаров в ассортимент. Карточки нужны для всех касс, кроме фискальных регистраторов ФР Атол и ФР Штрих-М — они работают от внешней программы (1С и др.), и карточки создаются в ней, а не на самом кассовом аппарате.',
    example: 'Вы дали нам прайс-лист из 200 наименований сигарет. Мы создаём 200 карточек непосредственно на вашей кассе: название бренда, артикул, привязка к коду маркировки, цена. Для массовой заливки через ПК — используем утилиту производителя кассы. Через пару часов всё готово к работе.'
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
  },
  tspiot: {
    what: 'ТС ПИоТ (Единый Сервисный Модуль) — обязательный программный модуль, обеспечивающий защищённое взаимодействие кассы с системой «Честный ЗНАК». Без него касса не сможет пробивать чеки по сигаретам, обуви, воде и другим маркированным группам. Лицензия приобретается на официальном портале ao-esp.ru.',
    why: 'С 1 июля 2026 года продажа маркированных товаров без ТС ПИоТ запрещена статьёй 15.12 КоАП РФ — это штрафы. Без лицензии касса просто перестанет пробивать маркированные чеки.',
    when: 'Обязательно для всех, кто продаёт маркированные товары. Чем раньше приобретёте — тем лучше, чтобы мы успели всё настроить.',
    example: 'Вы выбираете лицензию ТС ПИоТ на ao-esp.ru (стоимость зависит от вида товаров), оплачиваете напрямую. Мы помогаем зарегистрироваться, подключить и настроить ТС ПИоТ под ваш бизнес — от регистрации до первой накладной.'
  },
  fns_registration: {
    what: 'Регистрация контрольно-кассовой техники (ККТ) на сайте ФНС — это обязательная процедура, без которой касса не имеет права работать. Мы подаём заявление о регистрации кассы, подписываем его вашей ЭЦП и сопровождаем до получения подтверждения от налоговой.',
    why: 'Без регистрации в ФНС касса юридически не существует для налоговой — ни один чек не будет принят. Это как открыть магазин без лицензии: всё оборудование есть, но работать нельзя. Без этой процедуры новая касса — просто «кирпич».',
    when: 'Обязательно для всех новых касс. Без регистрации касса не начнёт работу — ни один чек не пройдёт.',
    example: 'Вы купили новую кассу Меркурий-185Ф. Привозите к нам (или мы выезжаем): подготавливаем заявление на сайте ФНС, подписываем ЭЦП, подаём и отслеживаем статус. Через 1-2 дня ФНС подтверждает регистрацию — касса готова к работе.'
  },
  fn_product: {
    what: 'Фискальный накопитель (ФН) — это чип памяти внутри кассы, который хранит все фискальные данные о проведённых платежах. Каждый ФН имеет ограниченный срок службы и подлежит обязательной замене по истечении этого срока или при переполнении памяти.',
    why: 'Без работающего ФН касса не может пробивать чеки и передавать данные в ФНС. Замена ФН — обязательная процедура при перерегистрации или истечении срока действия текущего накопителя.',
    when: 'При регистрации новой кассы, перерегистрации, истечении срока ФН (15 или 36 месяцев), или переполнении памяти накопителя.',
    example: 'ФН на 15 месяцев требуется для магазинов смешанных товаров (общая торговля). ФН на 36 месяцев — для предприятий, продающих подакцизные товары (алкоголь, табачная продукция). Выбор срока зависит от вида вашей деятельности по закону.'
  },
  ofd_takskom: {
    what: 'ОФД (оператор фискальных данных) — это организация, которая принимает, хранит и передаёт в налоговую все фискальные данные с вашей кассы. Без ОФД касса не работает. Мы — официальные партнёры ОФД ТАКСКОМ, поэтому предлагаем выгодные условия с партнёрской скидкой.',
    why: 'Закон требует, чтобы каждая касса была подключена к ОФД. Без договора с ОФД касса не сможет передавать чеки в ФНС — фактически она будет неработоспособна. Договор заключается на 15 или 36 месяцев.',
    when: 'Обязательно при регистрации новой кассы. Для б/у и действующих касс — при необходимости сменить или продлить договор с ОФД.',
    example: 'Вы регистрируете новую кассу. Вместо того чтобы самостоятельно искать ОФД и сравнивать тарифы, мы подключаем вас к ОФД ТАКСКОМ по партнёрской цене — на 500–1000₽ дешевле, чем на сайте напрямую. Договор на 15 месяцев стоит 6 400₽ (вместо 6 900₽ без скидки).'
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
    price: 1500,
    hintKey: 'fns_reregistration'
  },
  {
    id: 'marking_setup',
    name: 'Полная настройка маркировки под ключ',
    description: 'Многоэтапная интеграция 6 разных систем: подача заявления в ФНС, смена формата ФФД, настройка ЭДО, Честного ЗНАКа, кассы и ТС ПИоТ в единую цепочку. Для Эвотора — дополнительно личный кабинет. Малейшая ошибка в настройке — касса не пробьёт чек.',
    price: 3500,
    hintKey: 'marking_setup'
  },
  {
    id: 'partial_marketing_setup',
    name: 'Частичная настройка маркировки (настройка дополнительных модулей)',
    description: 'Настройка отдельных компонентов для работы с маркировкой — дополнительные модули, связи между системами, которые не были настроены ранее',
    price: 1500,
    hintKey: 'partial_marketing_setup'
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
    price: 1300,
    hintKey: 'training'
  },
  {
    id: 'fn_replacement',
    name: 'Замена фискального накопителя (ФН)',
    description: 'Замена чипа памяти кассы с перерегистрацией в налоговой',
    price: 2700,
    hintKey: 'fn_replacement'
  }
]

// ОФД — провайдеры
interface OfdProvider {
  id: string
  name: string
  shortName: string
  periods: Record<OfdPeriod, { price: number; originalPrice: number }>
  partner?: boolean
  lockedForNew?: boolean  // only show for non-new registers
}

const OFD_PROVIDERS: OfdProvider[] = [
  {
    id: 'takskom',
    name: 'ОФД ТАКСКОМ',
    shortName: 'ТАКСКОМ',
    partner: true,
    periods: {
      '15': { price: 6400, originalPrice: 6900 },
      '36': { price: 11000, originalPrice: 12000 }
    }
  },
  {
    id: 'platform_ofd',
    name: 'Платформа ОФД',
    shortName: 'Платформа ОФД',
    periods: {
      '15': { price: 4000, originalPrice: 4500 },
      '36': { price: 8500, originalPrice: 9500 }
    },
    lockedForNew: true
  },
  {
    id: 'first_ofd',
    name: 'ПЕРВЫЙ ОФД',
    shortName: 'ПЕРВЫЙ ОФД',
    periods: {
      '15': { price: 3100, originalPrice: 3600 },
      '36': { price: 6600, originalPrice: 7600 }
    },
    lockedForNew: true
  },
  {
    id: 'sbis_tensor',
    name: 'СБИС ТЕНЗОР',
    shortName: 'СБИС ТЕНЗОР',
    periods: {
      '15': { price: 4000, originalPrice: 4500 },
      '36': { price: 9000, originalPrice: 10000 }
    },
    lockedForNew: true
  }
]

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
// КОМПОНЕНТ ПОДСКАЗКИ (полноэкранный модал для мобильных)
// ============================================================================

function HintButton({ hintKey }: { hintKey: string }) {
  const hint = hints[hintKey]
  const [open, setOpen] = useState(false)
  if (!hint) return null
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(true) }}
        className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-700 hover:text-amber-800 transition-colors shrink-0"
        aria-label="Подсказка"
      >
        <span className="text-xs sm:text-sm font-bold">?</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setOpen(false) }} />
          <div className="relative z-10 w-full max-w-md max-h-[85vh] flex flex-col bg-white border-2 border-amber-200 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-amber-200 shrink-0">
              <span className="font-bold text-amber-700 text-xs uppercase tracking-wide">Подсказка</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-200/60 hover:bg-amber-300 active:bg-amber-400 text-amber-800 hover:text-amber-900 transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              <p><strong className="text-amber-700">Что это:</strong> {hint.what}</p>
              <p><strong className="text-amber-700">Зачем:</strong> {hint.why}</p>
              <p><strong className="text-amber-700">Когда:</strong> {hint.when}</p>
              <p className="text-slate-500 text-xs pt-3 border-t border-slate-200"><em>Пример: {hint.example}</em></p>
            </div>
            <div className="px-4 py-3 border-t border-amber-200 bg-amber-50/50 shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full py-2 rounded-lg bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-800 font-medium text-sm transition-colors"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ============================================================================
// ГЕНЕРАЦИЯ HTML ЗАКАЗ-НАРЯДА
// ============================================================================

function generateOrderHtml(params: {
  effectiveKkmInfo: { name: string }
  kkmCondition: string
  kkmType: string
  clientData: { name: string; inn: string; phone: string; email: string; address: string; kkmModel: string; kkmNumber: string; comment: string; evotorLogin: string; sellsExcise: boolean }
  totalCalc: { items: { name: string; price: number }[]; total: number }
}): string {
  const condLabel = params.kkmCondition === 'new' ? 'Новая' : params.kkmCondition === 'used' ? 'Б/у' : 'Старая (работающая)'
  const orderNum = Date.now().toString().slice(-6)
  const sepText = params.kkmType === 'evotor' ? 'ТС ПИоТ, приложения Эвотор — оплачиваются отдельно напрямую у поставщиков.' : params.kkmType === 'atol' ? 'ТС ПИоТ, подписки Сигма — оплачиваются отдельно напрямую у поставщиков.' : 'ТС ПИоТ, подписки — оплачиваются отдельно напрямую у поставщиков.'
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
<div class="notice"><strong>Внимание:</strong> Статья 15.12 КоАП РФ — продажа маркированных товаров без модуля ТС ПИоТ влечёт административную ответственность (штраф). Лицензия ТС ПИоТ оплачивается клиентом напрямую в ЕСП (ao-esp.ru).</div>
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
<div class="info"><strong>ТС ПИоТ:</strong> Лицензия ТС ПИоТ оплачивается клиентом напрямую на сайте ao-esp.ru. Стоимость зависит от вида товаров.</div>
<p style="font-size:11px;color:#94a3b8;margin-top:12px">* ${sepText}</p>
${params.clientData.comment ? `<div style="margin:16px 0"><h2>Примечания</h2><p>${params.clientData.comment}</p></div>` : ''}
<div class="footer"><div><p><strong>Исполнитель:</strong></p><div class="signature">М.П. Подпись</div></div>
<div><p><strong>Заказчик:</strong></p><div class="signature">Подпись</div></div></div>
</body></html>`
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
  clientData: { name: string; inn: string; phone: string; email: string; address: string; kkmModel: string; kkmNumber: string; comment: string; evotorLogin: string; sellsExcise: boolean }
  totalCalc: { items: { name: string; price: number }[]; total: number }
  onBack: () => void
  onPrint: () => void
  kkmType: string
}) {
  const condLabel = kkmCondition === 'new' ? 'Новая' : kkmCondition === 'used' ? 'Б/у' : 'Старая (рабочая)'
  const orderNum = Date.now().toString().slice(-6)
  const orderDate = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const orderHtml = useMemo(() => generateOrderHtml({
    effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc
  }), [effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc])

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

  const handleSendEmail = useCallback(() => {
    handleSaveFile()
    const subject = encodeURIComponent(`Заказ-наряд №${orderNum} от ${orderDate} — ${clientData.name || 'клиент'}`)
    const body = encodeURIComponent(
      `Добрый день!\n\nФормирую заказ-наряд №${orderNum} от ${orderDate}.\n\nКлиент: ${clientData.name || 'Не указано'}\nКасса: ${effectiveKkmInfo.name} (${condLabel})\nСумма: ${totalCalc.total.toLocaleString('ru-RU')} руб.\n\nФайл заказ-наряда прикреплю отдельным сообщением.\n\nС уважением,\n${clientData.name || ''}${clientData.phone ? ', ' + clientData.phone : ''}`
    )
    window.open(`mailto:push@tellur.spb.ru?subject=${subject}&body=${body}`, '_self')
  }, [orderNum, orderDate, clientData, effectiveKkmInfo, condLabel, totalCalc, handleSaveFile])

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
              <strong>ТС ПИоТ</strong> — лицензия оплачивается отдельно напрямую на сайте <strong>ao-esp.ru</strong>.{kkmType === 'evotor' ? ' Приложения Эвотор — через личный кабинет Эвотор.' : kkmType === 'atol' ? ' Подписки Сигма — напрямую у Атол.' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Отправка */}
      <Card>
        <CardContent className="pt-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-3.5 text-sm font-semibold" size="lg" onClick={handleWebShare}>
              <Send className="w-4 h-4 mr-2" />
              Отправить
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
            <a href={MAX_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center py-2 text-[#1e3a5f] font-medium hover:underline">
              <MessageCircle className="w-4 h-4" />
              Написать в Макс
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
  const [ofdChecked, setOfdChecked] = useState(false)
  const [ofdPeriod, setOfdPeriod] = useState<OfdPeriod>('15')
  const [ofdProvider, setOfdProvider] = useState('takskom')
  const [fnChecked, setFnChecked] = useState(false)
  const [fnPeriod, setFnPeriod] = useState<'15' | '36'>('15')
  const [fnActivityType, setFnActivityType] = useState('general')
  const [sigmaSubSelections, setSigmaSubSelections] = useState<string[]>(['sigma_marking'])
  const [sigmaSubPeriod, setSigmaSubPeriod] = useState<'month' | 'year'>('month')

  const [clientData, setClientData] = useState({
    name: '', inn: '', phone: '', email: '', address: '',
    kkmModel: '', kkmNumber: '', fnNumber: '', comment: '',
    evotorLogin: '', evotorPassword: '', hasEcp: false,
    fnActivityType: '', sellsExcise: false
  })

  const [showBanner, setShowBanner] = useState(true)

  // Авто-скрытие баннера ТС ПИоТ через 1 минуту
  useEffect(() => {
    if (!showBanner) return
    const timer = setTimeout(() => setShowBanner(false), 60000)
    return () => clearTimeout(timer)
  }, [showBanner])

  const effectiveKkm: KkmType = (kkmType === 'atol' && sigmaSelected) ? 'sigma' : kkmType
  const currentKkmInfo = kkmTypes[kkmType]
  const effectiveKkmInfo = kkmTypes[effectiveKkm]
  const visibleKkmTypes = Object.entries(kkmTypes).filter(([_, kkm]) => !kkm.hidden)

  const needsFirmwareOrLicense = kkmCondition !== 'new' && kkmType !== 'evotor'
  const fwPrices = firmwareLicensePrices[effectiveKkm]

  // Сигма подписки: обязательна для новых касс, опциональна для старых/БУ
  const sigmaSubsLocked = effectiveKkm === 'sigma' && kkmCondition === 'new'
  const showSigmaSubs = effectiveKkm === 'sigma'

  // Новая касса: ОФД обязательно, б/у и старые: по умолчанию включено, можно снять
  const ofdLocked = kkmCondition === 'new'
  const ofdEffective = ofdLocked || ofdChecked

  // Валидация
  const contactValid = clientData.phone.trim() !== ''
  const ecpChecked = clientData.hasEcp
  const canGoStep2 = kkmType !== '' && kkmCondition !== '' && contactValid && ecpChecked
  const canGoStep3 = step2Selections.length > 0

  const markingDesc = useMemo(() => {
    if (kkmType === 'evotor') return 'Связываем ЭДО, Честный ЗНАК, кассу Эвотор, ТС ПИоТ и личный кабинет Эвотор в единую цепочку — от приёмки товара до пробития чека'
    return 'Связываем ЭДО, Честный ЗНАК, вашу кассу и ТС ПИоТ в единую цепочку — от приёмки товара до пробития чека'
  }, [kkmType])

  const totalCalc = useMemo(() => {
    const items: { name: string; price: number }[] = []

    // Услуга регистрации ККТ в ФНС для новых касс
    if (kkmCondition === 'new') {
      items.push({ name: 'Регистрация ККТ в ФНС', price: 1500 })
    }

    step2Services.forEach(s => {
      if (step2Selections.includes(s.id)) items.push({ name: s.name, price: s.price })
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

    // Сигма подписки — информационная строка (не в цену, т.к. оплачивается отдельно)
    if (effectiveKkm === 'sigma' && sigmaSubSelections.length > 0) {
      const subPeriodLabel = sigmaSubPeriod === 'year' ? '/год' : '/мес'
      sigmaSubSelections.forEach(subId => {
        const sub = sigmaSubscriptions.find(s => s.id === subId)
        if (sub) {
          const price = sigmaSubPeriod === 'year' ? sub.pricePerYear : sub.pricePerMonth
          items.push({ name: `${sub.name} — ${price.toLocaleString('ru-RU')} ₽${subPeriodLabel} (оплачивается у Атол)`, price: 0 })
        }
      })
    }

    return { items, total: items.reduce((sum, i) => sum + i.price, 0) }
  }, [step2Selections, step3Selections, scannerChecked, firmwareChecked, licenseChecked, evotorRestore, productCardCount, trainingHours, effectiveKkm, fwPrices, kkmCondition, ofdEffective, ofdPeriod, ofdProvider, fnChecked, fnPeriod, fnActivityType, sigmaSubSelections, sigmaSubPeriod])

  const goToStep = (step: Step) => {
    if (step === 2 && !canGoStep2) return
    if (step === 3 && !canGoStep3) return
    setCurrentStep(step)
    setIsDone(false)
  }

  // ---- Печать ----
  const handlePrint = () => {
    const printContent = generateOrderHtml({
      effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc
    })
    const printWithScript = printContent.replace('</body>', '<script>window.print();</script></body>')
    const w = window.open('', '_blank')
    if (w) { w.document.write(printWithScript); w.document.close() }
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

          <div className="mt-2 sm:mt-4">
            {/* Уведомление об ЭЦП */}
            {!ecpChecked && (
              <Card className="border-amber-300 bg-amber-50">
                <CardContent className="pt-4 sm:pt-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-amber-800 text-sm sm:text-base">Наличие электронной подписи (ЭЦП)</h3>
                      <p className="text-xs sm:text-sm text-amber-700 mt-1">Для работы с маркировкой требуется ЭЦП. Если у вас нет ЭЦП — оформите её заранее через удостоверяющий центр.</p>
                      <div className="mt-3">
                        <Button
                          type="button"
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                          onClick={() => setClientData(prev => ({ ...prev, hasEcp: true }))}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          У меня есть ЭЦП
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}


            {/* ============================================================ */}
            {/* ВЫБОР КАССЫ */}
            {/* ============================================================ */}
            {currentStep === 1 && !isDone && (
              <div className={ecpChecked ? '' : 'opacity-50 pointer-events-none relative'}>
              <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <ShoppingCart className="w-5 h-5 text-[#1e3a5f] shrink-0" />
                      Выберите вашу кассу
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

                    {/* Атол — согласие для действующих касс */}
                    {kkmType === 'atol' && kkmCondition === 'old' && (
                      <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-blue-800 text-sm">Согласие для добавления в партнёрский кабинет Атол</p>
                            <p className="text-xs text-blue-600 mt-1">Для обслуживания вашей кассы Атол нам нужно добавить её в наш партнёрский кабинет. Для этого требуется ваше согласие — скачайте, заполните и подпишите. Можете подготовить заранее или наш инженер поможет при обращении.</p>
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

                    <div className="p-3 bg-[#1e3a5f]/5 rounded-lg">
                      <p className="font-medium text-slate-700 text-sm">{currentKkmInfo.description}</p>
                      <ul className="mt-2 text-sm text-slate-600 space-y-1">
                        {currentKkmInfo.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#1e3a5f] shrink-0 mt-0.5" />{f}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Сигма — подписки Атол */}
                    {showSigmaSubs && (
                      <div className="p-3 sm:p-4 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg space-y-3">
                        <p className="font-medium text-[#1e3a5f] text-sm">{currentKkmInfo.specialNote?.title}</p>
                        <p className="text-sm text-slate-600">{currentKkmInfo.specialNote?.content}</p>
                        {sigmaSubscriptions.map((sub, idx) => {
                          const isSelected = sigmaSubSelections.includes(sub.id)
                          const isLocked = sigmaSubsLocked && sub.required
                          const isDisabled = isLocked ? false : (sigmaSubsLocked ? false : false)
                          const price = sigmaSubPeriod === 'year' ? sub.pricePerYear : sub.pricePerMonth
                          const periodLabel = sigmaSubPeriod === 'year' ? '/год' : '/мес'
                          return (
                            <div key={idx} className="p-3 bg-white rounded border border-[#1e3a5f]/10">
                              <div className="flex items-start gap-2">
                                <div className="pt-0.5 shrink-0">
                                  <Checkbox
                                    id={`sigma_sub_${sub.id}`}
                                    checked={isSelected}
                                    disabled={isLocked}
                                    onCheckedChange={(c) => setSigmaSubSelections(prev =>
                                      c ? [...prev, sub.id] : prev.filter(x => x !== sub.id)
                                    )}
                                    className="w-4 h-4 mt-0.5"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <Label htmlFor={`sigma_sub_${sub.id}`} className="font-medium text-[#1e3a5f] text-sm cursor-pointer">{sub.name}</Label>
                                    {sub.required
                                      ? <Badge className="bg-[#e8a817]/20 text-[#1e3a5f] text-xs">Обязательно</Badge>
                                      : <Badge variant="outline" className="text-slate-500 text-xs">Опционально</Badge>
                                    }
                                  </div>
                                  <p className="text-sm text-slate-600 mt-0.5">{sub.purpose}</p>
                                  {sub.condition && <p className="text-xs text-slate-500 mt-0.5">({sub.condition})</p>}
                                  <a href={sub.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1e3a5f] flex items-center gap-1 mt-1 hover:underline">
                                    <ExternalLink className="w-3 h-3 shrink-0" /><span className="break-all">Страница подписки на сайте Атол</span>
                                  </a>
                                  {isSelected && (
                                    <p className="text-sm font-semibold text-[#1e3a5f] mt-1">{price.toLocaleString('ru-RU')} ₽{periodLabel} — оплачивается напрямую у Атол</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {/* Период подписки */}
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-[#1e3a5f]/10">
                          <Label className="text-sm font-medium text-slate-600 shrink-0">Период оплаты:</Label>
                          <RadioGroup value={sigmaSubPeriod} onValueChange={(v) => setSigmaSubPeriod(v as 'month' | 'year')} className="flex gap-2">
                            <div className="flex items-center gap-1.5">
                              <RadioGroupItem value="month" id="sigma_month" />
                              <Label htmlFor="sigma_month" className="text-sm cursor-pointer">Ежемесячно</Label>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <RadioGroupItem value="year" id="sigma_year" />
                              <Label htmlFor="sigma_year" className="text-sm cursor-pointer">Раз в год <span className="text-xs text-green-600 font-medium">выгоднее</span></Label>
                            </div>
                          </RadioGroup>
                        </div>
                        {/* Предупреждение о доп. подписках */}
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">
                              <strong>Внимание:</strong> помимо указанных подписок, для работы кассы Сигма могут потребоваться: подписка «Облачная касса» (для удалённого управления) и другие сервисы Атол. Точный набор зависит от ваших задач — уточните у менеджера.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentKkmInfo.specialNote?.apps && effectiveKkm !== 'sigma' && (
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
                    <RadioGroup value={kkmCondition} onValueChange={(v) => {
                      setKkmCondition(v as KkmCondition)
                      // При новой или б/у кассе — автопоставить галочку 2D-сканера, при действующей — снять
                      if (v === 'new' || v === 'used') {
                        setScannerChecked(true)
                      } else if (v === 'old') {
                        setScannerChecked(false)
                      }
                    }} className="space-y-2.5">
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

                    {/* Напоминание о регистрационных услугах для новой кассы */}
                    {kkmCondition === 'new' && (
                      <div className="mt-4 p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-[#1e3a5f]">
                          <Info className="w-4 h-4 shrink-0" />
                          <span className="font-medium">Для новой кассы обязательны: регистрация в ФНС и подключение ОФД — учтены ниже в расчёте</span>
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
                        <Label className="text-sm">Наименование / ФИО</Label>
                        <Input value={clientData.name} onChange={(e) => setClientData({...clientData, name: e.target.value})} placeholder="ООО Ромашка" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">Телефон <span className="text-red-500">*</span></Label>
                        <Input value={clientData.phone} onChange={(e) => setClientData({...clientData, phone: e.target.value})} placeholder="+7 (999) 123-45-67" className="mt-1" />
                        {clientData.phone.trim() === '' && <p className="text-xs text-red-500 mt-0.5">Обязательное поле</p>}
                      </div>
                      <div><Label className="text-sm">Электронная почта</Label><Input type="email" value={clientData.email} onChange={(e) => setClientData({...clientData, email: e.target.value})} placeholder="info@company.ru" className="mt-1" /></div>
                      <div><Label className="text-sm">ИНН</Label><Input value={clientData.inn} onChange={(e) => setClientData({...clientData, inn: e.target.value})} placeholder="1234567890" className="mt-1" /></div>
                    </div>
                    <div><Label className="text-sm">Адрес</Label><Input value={clientData.address} onChange={(e) => setClientData({...clientData, address: e.target.value})} placeholder="г. Москва, ул. Примерная, д. 1" className="mt-1" /></div>
                  </CardContent>
                </Card>

                <Button className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-4 sm:py-5 text-sm sm:text-base" size="lg" onClick={() => goToStep(2)} disabled={!canGoStep2}>
                  Далее — выбор услуг <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* УСЛУГИ */}
            {/* ============================================================ */}
            {currentStep === 2 && !isDone && (
              <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
                <div className="p-2.5 sm:p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-lg text-xs sm:text-sm">
                  <p className="text-[#1e3a5f]"><strong>Касса:</strong> {effectiveKkmInfo.name} ({kkmCondition === 'new' ? 'новая' : kkmCondition === 'used' ? 'б/у' : 'рабочая'})</p>
                </div>

                {step2Services.filter(s => !(s.id === 'partial_marketing_setup' && kkmCondition !== 'old')).map(service => {
                  const desc = service.id === 'marking_setup' ? markingDesc : service.description
                  const selected = step2Selections.includes(service.id)
                  // Для новых касс перерегистрация недоступна (регистрация — автоматически на шаге 3)
                  const isLocked = kkmCondition === 'new' && service.id === 'fns_reregistration'
                  // Взаимоисключающие услуги: Полная vs Частичная настройка маркировки
                  const isMutuallyDisabled = (
                    (service.id === 'partial_marketing_setup' && step2Selections.includes('marking_setup')) ||
                    (service.id === 'marking_setup' && step2Selections.includes('partial_marketing_setup'))
                  )
                  const mutuallyExclusiveId = service.id === 'partial_marketing_setup' ? 'Полная настройка маркировки' : 'Частичная настройка маркировки'
                  const disabled = isLocked || isMutuallyDisabled
                  return (
                    <Card key={service.id} className={selected ? 'border-[#1e3a5f]/30 bg-[#1e3a5f]/5' : ''}>
                      <CardContent className="pt-4 sm:pt-5">
                        <div className="flex items-start gap-3">
                          <Checkbox id={service.id} checked={selected}
                            disabled={disabled}
                            onCheckedChange={() => {
                              const mutuallyExclusive = service.id === 'marking_setup' ? 'partial_marketing_setup' : service.id === 'partial_marketing_setup' ? 'marking_setup' : null
                              setStep2Selections(prev => {
                                const without = mutuallyExclusive ? prev.filter(x => x !== mutuallyExclusive) : prev
                                return without.includes(service.id) ? without.filter(x => x !== service.id) : [...without, service.id]
                              })
                            }}
                            className="w-5 h-5 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Label htmlFor={service.id} className={`font-semibold text-sm leading-snug ${disabled ? 'text-slate-400 cursor-not-allowed' : 'cursor-pointer'}`}>{service.name}</Label>
                                {service.hintKey && <HintButton hintKey={service.hintKey} />}
                              </div>
                              <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">{service.price.toLocaleString('ru-RU')} руб.</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">{desc}</p>
                            {isLocked && <p className="text-xs text-[#1e3a5f] font-medium mt-1">Для новой кассы недоступно — регистрация ККТ включена автоматически на следующем шаге</p>}
                            {isMutuallyDisabled && <p className="text-xs text-amber-600 font-medium mt-1">Невозможно выбрать одновременно с «{mutuallyExclusiveId}»</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {/* Подакцизные товары */}
                {(step2Selections.includes('fns_reregistration') || kkmCondition === 'new') && (
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="pt-4 sm:pt-5">
                      <div className="flex items-start gap-3">
                        <Checkbox id="excise_check"
                          checked={clientData.sellsExcise}
                          onCheckedChange={(c) => setClientData(prev => ({ ...prev, sellsExcise: !!c }))}
                          className="w-5 h-5 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Label htmlFor="excise_check" className="font-semibold text-sm cursor-pointer leading-snug text-orange-800">
                            Планируете продавать подакцизные товары?
                          </Label>
                          <p className="text-xs sm:text-sm text-orange-600 mt-1">Алкоголь, табачная продукция, пиво — если да, это повлияет на выбор ФН и настройки</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ОФД */}
                {(() => {
                  const visibleProviders = OFD_PROVIDERS.filter(p => !p.lockedForNew || kkmCondition !== 'new')
                  const selectedProvider = OFD_PROVIDERS.find(p => p.id === ofdProvider) || OFD_PROVIDERS[0]
                  return (
                    <Card className={ofdEffective ? 'border-[#1e3a5f]/30 bg-[#1e3a5f]/5' : ''}>
                      <CardContent className="pt-4 sm:pt-5">
                        <div className="flex items-start gap-3">
                          <Checkbox id="ofd_check"
                            checked={ofdEffective}
                            disabled={ofdLocked}
                            onCheckedChange={(c) => setOfdChecked(c as boolean)}
                            className="w-5 h-5 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Label htmlFor="ofd_check" className={`font-semibold text-sm cursor-pointer leading-snug ${ofdLocked ? 'text-[#1e3a5f]' : ''}`}>
                                  ОФД (оператор фискальных данных)
                                </Label>
                                {selectedProvider.partner && <Badge className="bg-[#e8a817]/20 text-[#1e3a5f] text-xs shrink-0">Партнёр</Badge>}
                                <HintButton hintKey="ofd_takskom" />
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                              Оператор фискальных данных — обязательное подключение для работы кассы.
                              {ofdLocked && <span className="font-medium text-[#1e3a5f]"> Для новой кассы подключение ОФД обязательно.</span>}
                            </p>
                            {ofdEffective && (
                              <div className="mt-3 space-y-3">
                                {/* Provider selection (only for non-new registers with multiple providers) */}
                                {visibleProviders.length > 1 && (
                                  <div className="space-y-2">
                                    <RadioGroup value={ofdProvider} onValueChange={setOfdProvider} className="space-y-2">
                                      {visibleProviders.map(provider => (
                                        <div key={provider.id} className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#1e3a5f]/10">
                                          <RadioGroupItem value={provider.id} id={`ofd_${provider.id}`} />
                                          <Label htmlFor={`ofd_${provider.id}`} className="flex-1 cursor-pointer text-sm">
                                            <span className="font-medium text-[#1e3a5f]">{provider.name}</span>
                                            {provider.partner && <Badge className="bg-[#e8a817]/20 text-[#1e3a5f] text-xs ml-2">Партнёр</Badge>}
                                          </Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                )}
                                {/* Period selection */}
                                <RadioGroup value={ofdPeriod} onValueChange={(v) => setOfdPeriod(v as OfdPeriod)} className="space-y-2">
                                  {(['15', '36'] as const).map(period => {
                                    const info = selectedProvider.periods[period]
                                    return (
                                      <div key={period} className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#1e3a5f]/10">
                                        <RadioGroupItem value={period} id={`ofd_period_${period}`} />
                                        <Label htmlFor={`ofd_period_${period}`} className="flex-1 cursor-pointer text-sm">
                                          <span className="font-medium text-[#1e3a5f]">Договор на {period === '15' ? '15' : '36'} месяцев</span>
                                          <span className="ml-2 inline-flex items-center gap-1.5">
                                            <span className="font-bold text-[#1e3a5f] text-base">{info.price.toLocaleString('ru-RU')} ₽</span>
                                            <span className="text-slate-400 line-through text-xs">{info.originalPrice.toLocaleString('ru-RU')} ₽</span>
                                          </span>
                                          <span className="ml-1.5 text-xs text-green-600 font-medium">скидка</span>
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

                {/* ТС ПИоТ — инфо */}
                <Card className="border-[#e8a817]/30 bg-[#e8a817]/5">
                  <CardContent className="pt-4 sm:pt-5">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 sm:w-6 sm:h-6 text-[#e8a817] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-[#1e3a5f] text-sm">Лицензия ТС ПИоТ — оплачивается вами напрямую</h3>
                          <HintButton hintKey="tspiot" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                          Единый Сервисный Модуль (ТС ПИоТ) — обязательный программный модуль для защищённого взаимодействия кассы с системой «Честный ЗНАК». Лицензия продаётся через официальный портал <strong>ao-esp.ru</strong>.
                          Стоимость зависит от вида ваших товаров.
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
            {/* ДОПОЛНИТЕЛЬНО */}
            {/* ============================================================ */}
            {currentStep === 3 && !isDone && (
              <div className="max-w-3xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                    <div className="p-2.5 sm:p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-lg text-xs sm:text-sm">
                      <p className="text-[#1e3a5f]"><strong>Касса:</strong> {effectiveKkmInfo.name} | <strong>Основные услуги:</strong> {step2Selections.length} шт.</p>
                    </div>

                    {/* ФН — фискальный накопитель */}
                    <Card className={fnChecked ? 'border-[#1e3a5f]/30 bg-[#1e3a5f]/5' : ''}>
                      <CardContent className="pt-4 sm:pt-5">
                        <div className="flex items-start gap-3">
                          <Checkbox id="fn_product" checked={fnChecked}
                            onCheckedChange={(c) => { setFnChecked(c as boolean); if (c) { setFnActivityType(fnPeriod === '36' ? 'excise' : 'general') } }}
                            className="w-5 h-5 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Label htmlFor="fn_product" className="font-semibold text-sm cursor-pointer leading-snug">Фискальный накопитель (ФН)</Label>
                                <HintButton hintKey="fn_product" />
                              </div>
                              <span className="text-xs text-slate-400 shrink-0">цена уточняется</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Обязательный чип памяти кассы. Срок зависит от вида деятельности</p>
                            {fnChecked && (
                              <div className="mt-3 space-y-3">
                                {/* Вид деятельности */}
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Вид деятельности</Label>
                                  <RadioGroup value={fnActivityType} onValueChange={(v) => {
                                    setFnActivityType(v as string)
                                    setFnPeriod(v === 'excise' ? '36' : '15')
                                  }} className="space-y-2">
                                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#1e3a5f]/10">
                                      <RadioGroupItem value="general" id="fn_general" />
                                      <Label htmlFor="fn_general" className="flex-1 cursor-pointer text-sm">
                                        <span className="font-medium">Общая торговля</span>
                                        <span className="ml-2 text-xs text-slate-400">— ФН на 15 месяцев</span>
                                      </Label>
                                    </div>
                                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#1e3a5f]/10">
                                      <RadioGroupItem value="excise" id="fn_excise" />
                                      <Label htmlFor="fn_excise" className="flex-1 cursor-pointer text-sm">
                                        <span className="font-medium">Подакцизная продукция</span>
                                        <span className="ml-2 text-xs text-slate-400">— ФН на 36 месяцев (алкоголь, табак)</span>
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
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

                    {/* Регистрация ККТ в ФНС — только для новых касс, заблокировано */}
                    {kkmCondition === 'new' && (
                      <Card className="border-[#1e3a5f]/30 bg-[#1e3a5f]/5">
                        <CardContent className="pt-4 sm:pt-5">
                          <div className="flex items-start gap-3">
                            <Checkbox id="fns_reg" checked={true} disabled={true} className="w-5 h-5 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Label htmlFor="fns_reg" className="font-semibold text-sm text-[#1e3a5f] leading-snug cursor-default">Регистрация ККТ в ФНС</Label>
                                  <HintButton hintKey="fns_registration" />
                                </div>
                                <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">1 500 руб.</span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-500 mt-1">Подача заявления о регистрации кассы на сайте ФНС, подписание ЭЦП, сопровождение до подтверждения — обязательно для новой кассы</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

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
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Карточки создаются на кассовом аппарате. При массовой заливке через ПК могут потребоваться доп. приложения от производителя. Не применяется для ФР Атол и ФР Штрих-М.</p>
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
                          <p className="text-xs text-slate-400">
                            {kkmType === 'evotor' ? 'ТС ПИоТ, приложения Эвотор — отдельно' : effectiveKkm === 'sigma' ? 'ТС ПИоТ, подписки Сигма — отдельно' : 'ТС ПИоТ — оплачивается отдельно'}
                          </p>
                        </CardContent>
                      </Card>

                      <Button className="w-full bg-[#e8a817] hover:bg-[#d49a12] py-4 sm:py-5 text-sm sm:text-base font-semibold" size="lg" onClick={() => setIsDone(true)}>
                        <CheckCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Готово
                      </Button>
                      <Button variant="outline" className="w-full text-sm" onClick={() => {
                        setStep2Selections([]); setStep3Selections([]); setScannerChecked(false); setProductCardCount(0); setTrainingHours(1); setFirmwareChecked(false); setLicenseChecked(false); setEvotorRestore(false); setOfdChecked(false)
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

        {/* Напоминалка об ЭЦП — после подтверждения */}
        {ecpChecked && !isDone && (
          <div className="border-t border-[#1e3a5f]/10 bg-[#f0fdf4]">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-xs text-green-700">ЭЦП подтверждена — настройка возможна при наличии ЭЦП или доступе к ПК с установленной подписью</span>
              <button
                type="button"
                onClick={() => setClientData(prev => ({ ...prev, hasEcp: false }))}
                className="ml-auto text-xs text-slate-400 hover:text-slate-600 shrink-0"
              >
                изменить
              </button>
            </div>
          </div>
        )}

        <footer className="bg-white border-t border-[#1e3a5f]/10 mt-auto">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex items-center justify-center gap-3">
            <Image src="/logo.webp" alt="Теллур-Интех" width={56} height={46} className="w-7 h-[23px] sm:w-[56px] sm:h-[46px]" quality={100} />
            <p className="text-xs sm:text-sm text-slate-500">ООО &quot;Теллур-Интех&quot; — сервисный центр кассового оборудования</p>
          </div>
        </footer>
      </div>
  )
}
