'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import React from 'react'
import { createPortal } from 'react-dom'
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
  CreditCard, AlertTriangle,
  ScanLine, ArrowRight, ArrowLeft,
  HelpCircle, Phone, Mail, ExternalLink, MessageCircle, CheckCheck, ShieldCheck,
  X, Download, Send, Check, CheckCircle,
  FileCheck, Link2, Settings2, KeyRound, GraduationCap, Cpu, FilePlus2, LayoutList,
  Server, Lock, RotateCcw, ClipboardCheck,
  Package, Wine, PackageOpen, Monitor, Sparkles, Repeat, RefreshCw,
  BadgeCheck, Star, Tag, FileSignature, Wrench
} from 'lucide-react'
import {
  kkmTypes, scannerPrices, firmwareLicensePrices, sigmaTariffLink,
  type KkmType
} from '@/config/services'
import Image from 'next/image'

// ============================================================================
// ТИПЫ
// ============================================================================

type Step = 1 | 2 | 3 | 4
type KkmCondition = 'new' | 'used' | 'old' | ''
type OfdPeriod = '15' | '36'

const KKM_BRANDS: Record<string, { color: string; bg: string }> = {
  mercury: { color: '#2563EB', bg: '#2563EB' },
  atol:    { color: '#E8442E', bg: '#E8442E' },
  shuttle: { color: '#1E1E1E', bg: '#1E1E1E' },
  pioneer: { color: '#7A8F80', bg: '#7A8F80' },
  aqsi:    { color: '#2563EB', bg: '#2563EB' },
  evotor:  { color: '#D97706', bg: '#D97706' },
  sigma:   { color: '#0891B2', bg: '#0891B2' },
}

// Логотипы теперь содержат текст бренда — маппинг не нужен

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
const MAX_LINK = 'https://web.max.ru/1456926'

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
    example: 'У Вас работает касса Атол. Вы решили продавать сигареты (маркировка). Мы заходим на сайт ФНС, аккуратно заполняем заявление: добавляем признак маркировки, обновляем формат ФФД до версии 1.2, подписываем ЭЦП и подаём. Через 1-2 дня после одобрения ФНС касса получает право работать с маркировкой.'
  },
  marking_setup: {
    what: 'Это самая сложная и ответственная часть подключения маркировки. Мы последовательно настраиваем и связываем между собой 6 различных систем: ЭДО (электронный документооборот для приёмки накладных), Честный ЗНАК (государственный реестр маркировки), Вашу кассу, ТС ПИоТ (Единый Сервисный Модуль), а также проводим подачу заявления в ФНС со сменой формата ФФД. Для касс Эвотор дополнительно настраиваем личный кабинет. Каждая система имеет свои настройки, ключи доступа и особенности — ошибиться в связывании означает, что касса просто не будет пробивать маркированные чеки.',
    why: 'Ни одна из этих систем по отдельности не обеспечит работу с маркировкой. Все они должны быть связаны в единую цепочку: от поставщика через ЭДО → в Честный ЗНАК → в ТС ПИоТ → на кассу → чек в налоговую. Если хотя бы одно звено настроено неверно — вся цепочка рвётся, и касса не пробьёт чек по маркированному товару.',
    when: 'Обязательно после завершения перерегистрации в ФНС. Без этой настройки ни одна из систем не сможет работать с маркировкой, даже если они установлены.',
    example: 'Поставщик отправляет накладную через ЭДО → Вы принимаете её в Честном ЗНАКе (проверка кодов маркировки) → данные синхронизируются в ТС ПИоТ → касса видит весь ассортимент → кассир сканирует код Data Matrix → касса проверяет код через Честный ЗНАК → чек с признаком маркировки уходит в ФНС. Мы настраиваем каждый этап этой цепочки.'
  },
  partial_marketing_setup: {
    what: 'Частичная настройка маркировки — это донастройка отдельных модулей и связей, которые требуются для корректной работы кассы с маркированными товарами. Включает в себя проверку и настройку дополнительных компонентов интеграции между кассой, Честным ЗНАКом и сопутствующими системами.',
    why: 'Если касса уже работала, но часть модулей или связей не была настроена, маркированные чеки могут не пробиваться. Устраняем проблемы в интеграции пошагово.',
    when: 'Когда касса уже зарегистрирована в ФНС и работает, но есть проблемы с пробитием маркированных чеков, или нужно добавить работу с новыми категориями маркированных товаров.',
    example: 'У Вас касса работает, но при попытке пробить чек по сигаретам выдаётся ошибка. Мы проверяем все связи — ЭДО, Честный ЗНАК, настройки кассы — и настраиваем недостающие компоненты.'
  },
  scanner_2d: {
    what: 'Специальный сканер, который читает маленькие квадратные коды (Data Matrix, QR) на маркированных товарах. Обычный плоский сканер штрих-кодов (те, что рисуются палочками) такие коды не прочитает — у них другой формат.',
    why: 'Без 2D-сканера кассир не сможет считать код маркировки на пачке сигарет, коробке обуви или бутылке воды. Касса выдаст ошибку и не пробьёт чек.',
    when: 'Обязательно при продаже маркированных товаров. Если у Вас уже есть 2D-сканер (имидж-сканер) — можно не покупать.',
    example: 'Кассир берёт пачку сигарет, подносит к сканеру — сканер за долю секунды читает квадратик, касса проверяет через Честный ЗНАК и пробивает чек. Скорость — как обычный товар.'
  },
  ecp_renewal: {
    what: 'Продление квалифицированного сертификата электронной подписи (ЭЦП) на Вашем защищённом носителе (Рутокен, JaCarta и др.). ЭЦП — это Ваша электронная подпись, которая ставится на документы вместо ручной подписи и печати. У неё есть срок действия, обычно 1 год.',
    why: 'С истёкшей ЭЦП Вы не сможете войти в личные кабинеты (Честный ЗНАК, ФНС, ЕСП), подписать документы, принять накладные от поставщиков. Система просто не пустит.',
    when: 'Когда до окончания ЭЦП осталось хотя бы 1 день. Если ЭЦП уже истёк полностью — придётся оформлять новую (это другая процедура, мы не занимаемся).',
    example: 'Ваш Рутокен показывает что срок ЭЦП заканчивается через 3 дня. Приезжаете к нам — за 15 минут продлеваем сертификат. Или скидываете Рутокен через службу доставки.'
  },
  training: {
    what: 'Практическое обучение Вас или Ваших сотрудников: как правильно сканировать коды маркировки, принимать товар от поставщика, пробивать чек, делать возврат, что делать если код не считывается.',
    why: 'Маркировка — это не просто «отсканируй и продай». Есть множество нюансов: код повреждён, нужен возврат, товар пришёл без кодов, накладная не совпадает. Лучше один раз научиться, чем на каждой проблеме терять время.',
    when: 'Рекомендуем всем, кто впервые сталкивается с маркировкой. Особенно полезно для кассиров.',
    example: 'Приезжаем к Вам. За 1 час обучаем: 1) Принимаем тестовую накладную от поставщика, 2) Сканируем код на товаре и пробиваем чек, 3) Имитируем возврат, 4) Показываем что делать если код не читается.'
  },
  fn_replacement: {
    what: 'ФН (фискальный накопитель) — это чип внутри кассы, который хранит все пробитые чеки и передаёт данные в налоговую. У него есть срок службы: 15 или 36 месяцев. Когда срок заканчивается — чип нужно заменить на новый и перерегистрировать кассу.',
    why: 'Когда срок ФН заканчивается, касса блокируется и перестаёт пробивать чеки. Закон запрещает работать с истёкшим ФН. Это как годовой проездной — истёк, надо покупать новый.',
    when: 'Когда подходит срок (обычно за 20-30 дней ОФД или налоговая присылает уведомление).',
    example: 'Вам пришло письмо от ОФД: «ФН заканчивается через 25 дней». Меняем чип на новый, перерегистрируем кассу в ФНС. Касса снова работает.'
  },
  product_cards: {
    what: 'Карточки товаров создаются непосредственно на кассовом аппарате — каждая позиция заносится в память кассы: название, артикул, привязка к коду маркировки (Data Matrix), цена и другие поля. Обратите внимание: при массовой заливке карточек средствами ПК (через 1С, Excel или другие программы) могут потребоваться дополнительные приложения от производителя Вашей кассы для корректного импорта данных.',
    why: 'Без карточек товаров касса не знает что она продаёт — она не поймёт что за «Winston Blue», не найдёт нужный код маркировки. Каждая позиция должна быть заведена в кассу, чтобы кассир мог выбрать товар и пробить чек.',
    when: 'При первом подключении маркировки или при поступлении новых товаров в ассортимент. Карточки нужны для всех касс, кроме фискальных регистраторов ФР Атол и ФР Штрих-М — они работают от внешней программы (1С и др.), и карточки создаются в ней, а не на самом кассовом аппарате.',
    example: 'Вы дали нам прайс-лист из 200 наименований сигарет. Мы создаём 200 карточек непосредственно на Вашей кассе: название бренда, артикул, привязка к коду маркировки, цена. Для массовой заливки через ПК — используем утилиту производителя кассы. Через пару часов всё готово к работе.'
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
    when: 'Для б/у касс — нужно убедиться что лицензия есть и активна. Если касса перешла к Вам от другого владельца — скорее всего нужна новая лицензия.',
    example: 'Вы купили б/у кассу Атол. Предыдущий владелец не передал лицензию. Покупаем новую лицензию, привязываем к серийному номеру Вашей кассы — и она работает.'
  },
  evotor_restore: {
    what: 'Восстановление доступа к личному кабинету Эвотор, если Вы не помните логин (телефон) или пароль. Мы помогаем через службу поддержки Эвотор.',
    why: 'Без доступа к ЛК Эвотор невозможно управлять кассой, устанавливать и оплачивать приложения. Касса без ЛК — просто планшет.',
    when: 'Если Вы не помните данные от ЛК Эвотор или касса досталась от предыдущего владельца без данных.',
    example: 'Вы не помните пароль от ЛК Эвотор. Обращаетесь к нам — мы связываемся с поддержкой Эвотор, восстанавливаем доступ. Вы получаете новые данные для входа.'
  },
  tspiot: {
    what: 'ТС ПИоТ (Единый Сервисный Модуль) — обязательный программный модуль, обеспечивающий защищённое взаимодействие кассы с системой «Честный ЗНАК». Без него касса не сможет пробивать чеки по сигаретам, обуви, воде и другим маркированным группам. Лицензия приобретается на официальном портале ao-esp.ru.',
    why: 'С 1 июля 2026 года продажа маркированных товаров без ТС ПИоТ запрещена статьёй 15.12 КоАП РФ — это штрафы. Без лицензии касса просто перестанет пробивать маркированные чеки.',
    when: 'Обязательно для всех, кто продаёт маркированные товары. Чем раньше приобретёте — тем лучше, чтобы мы успели всё настроить.',
    example: 'Вы выбираете лицензию ТС ПИоТ на ao-esp.ru, оплачиваете напрямую. Мы помогаем зарегистрироваться, подключить и настроить ТС ПИоТ под Ваш бизнес — от регистрации до первой накладной.'
  },
  fns_registration: {
    what: 'Регистрация контрольно-кассовой техники (ККТ) на сайте ФНС — это обязательная процедура, без которой касса не имеет права работать. Мы подаём заявление о регистрации кассы, подписываем его Вашей ЭЦП и сопровождаем до получения подтверждения от налоговой.',
    why: 'Без регистрации в ФНС касса юридически не существует для налоговой — ни один чек не будет принят. Это как открыть магазин без лицензии: всё оборудование есть, но работать нельзя. Без этой процедуры новая касса — просто «кирпич».',
    when: 'Обязательно для всех новых касс. Без регистрации касса не начнёт работу — ни один чек не пройдёт.',
    example: 'Вы купили новую кассу Меркурий-185Ф. Привозите к нам (или мы выезжаем): подготавливаем заявление на сайте ФНС, подписываем ЭЦП, подаём и отслеживаем статус. Через 1-2 дня ФНС подтверждает регистрацию — касса готова к работе.'
  },
  fn_product: {
    what: 'Фискальный накопитель (ФН) — это чип памяти внутри кассы, который хранит все фискальные данные о проведённых платежах. Каждый ФН имеет ограниченный срок службы и подлежит обязательной замене по истечении этого срока или при переполнении памяти.',
    why: 'Без работающего ФН касса не может пробивать чеки и передавать данные в ФНС. Замена ФН — обязательная процедура при перерегистрации или истечении срока действия текущего накопителя.',
    when: 'При регистрации новой кассы, перерегистрации, истечении срока ФН (15 или 36 месяцев), или переполнении памяти накопителя.',
    example: 'ФН на 15 месяцев требуется для магазинов смешанных товаров (общая торговля). ФН на 36 месяцев — для предприятий, продающих подакцизные товары (алкоголь, табачная продукция). Выбор срока зависит от вида Вашей деятельности по закону.'
  },
  ofd_takskom: {
    what: 'ОФД (оператор фискальных данных) — это организация, которая принимает, хранит и передаёт в налоговую все фискальные данные с Вашей кассы. Без ОФД касса не работает. Мы — официальные партнёры ОФД ТАКСКОМ, поэтому предлагаем выгодные условия с партнёрской скидкой.',
    why: 'Закон требует, чтобы каждая касса была подключена к ОФД. Без договора с ОФД касса не сможет передавать чеки в ФНС — фактически она будет неработоспособна. Договор заключается на 15 или 36 месяцев.',
    when: 'Обязательно при регистрации новой кассы. Для б/у и действующих касс — при необходимости сменить или продлить договор с ОФД.',
    example: 'Вы регистрируете новую кассу. Вместо того чтобы самостоятельно искать ОФД и сравнивать тарифы, мы подключаем Вас к ОФД ТАКСКОМ по партнёрской цене — на 500–1000₽ дешевле, чем на сайте напрямую. Договор на 15 месяцев стоит 6 400₽ (вместо 6 900₽ без скидки).'
  },
  service_contract: {
    what: 'Договор обслуживания — это абонентское соглашение на регулярное техническое обслуживание Вашей кассы. Наш инженер будет регулярно приезжать к Вам, проводить ревизию и профилактику оборудования, а также обеспечивать приоритетную поддержку по телефону и на выезде.',
    why: 'Кассовое оборудование требует регулярного обслуживания: чистка-optic, проверка связей, обновление ПО, диагностика. Без обслуживания мелкие проблемы могут привести к простою кассы и потере выручки. С договором Вы получаете приоритет — без очереди и без дополнительной платы за визит.',
    when: 'Рекомендуем заключать договор обслуживания с первого дня работы кассы. Особенно важен для магазинов с высокой проходимостью, где простой кассы означает прямые убытки.',
    example: 'У Вас перестала печатать касса. Без договора — вызываете мастера, ждёте в очереди, платите за выезд и ремонт. С договором — звоните, мастер приезжает в тот же день, бесплатно. Также раз в месяц мастер приезжает сам для профилактики — чистит, проверяет, обновляет.'
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
  icon?: string
}

const step2Services: StepService[] = [
  {
    id: 'fns_reregistration',
    name: 'Перерегистрация кассы в ФНС для маркировки и подакцизных товаров',
    description: 'Подготовка, подача и сопровождение заявления в ФНС — добавляем признаки маркировки и подакцизных товаров, переводим кассу на формат ФФД 1.2. Ошибка в заявлении = отказ налоговой = касса не работает',
    price: 1500,
    hintKey: 'fns_reregistration',
    icon: '/services/fns_reregistration.webp'
  },
  {
    id: 'marking_setup',
    name: 'Полная настройка маркировки под ключ',
    description: 'Многоэтапная интеграция 6 разных систем: подача заявления в ФНС, смена формата ФФД, настройка ЭДО, Честного ЗНАКа, кассы и ТС ПИоТ в единую цепочку. Для Эвотора — дополнительно личный кабинет. Малейшая ошибка в настройке — касса не пробьёт чек.',
    price: 3500,
    hintKey: 'marking_setup',
    icon: '/services/marking_setup.webp'
  },
  {
    id: 'partial_marketing_setup',
    name: 'Частичная настройка маркировки (настройка дополнительных модулей)',
    description: 'Настройка отдельных компонентов для работы с маркировкой — дополнительные модули, связи между системами, которые не были настроены ранее',
    price: 1500,
    hintKey: 'partial_marketing_setup',
    icon: '/services/partial_marketing.webp'
  }
]

const step3Services: StepService[] = [
  {
    id: 'ecp_renewal',
    name: 'Продление электронной подписи (ЭЦП)',
    description: 'Продление сертификата ЭЦП на Рутокене (если до истечения остался хотя бы 1 день)',
    price: 1000,
    hintKey: 'ecp_renewal',
    icon: '/services/ecp_renewal.webp'
  },
  {
    id: 'training',
    name: 'Обучение работе с маркировкой',
    description: 'Практическое занятие — сканирование, приём товара, возвраты',
    price: 1300,
    hintKey: 'training',
    icon: '/services/training.webp'
  },
  {
    id: 'fn_replacement',
    name: 'Замена фискального накопителя (ФН)',
    description: 'Замена чипа памяти кассы с перерегистрацией в налоговой',
    price: 2700,
    hintKey: 'fn_replacement',
    icon: '/services/fn_replacement.webp'
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
// КОМПОНЕНТ ПОДСКАЗКИ (полноэкранный модал — единое активное состояние)
// ============================================================================

function HintButton({ hintKey, activeHint, onHintOpen, onHintClose }: { hintKey: string; activeHint: string | null; onHintOpen: (key: string) => void; onHintClose: () => void }) {
  const hint = hints[hintKey]
  const isOpen = activeHint === hintKey
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!hint) return null
  const modal = isOpen && mounted ? createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={(e) => { e.stopPropagation(); onHintClose() }} />
      <div className="relative z-10 w-full max-w-md max-h-[75vh] flex flex-col bg-white border-2 border-amber-200 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-amber-200 shrink-0">
          <span className="font-bold text-amber-700 text-xs uppercase tracking-wide">Подсказка</span>
          <button
            type="button"
            onClick={() => onHintClose()}
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
            onClick={() => onHintClose()}
            className="w-full py-2.5 rounded-lg bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-800 font-medium text-sm transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onHintOpen(hintKey) }}
        className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-700 hover:text-amber-800 transition-colors shrink-0"
        aria-label="Подсказка"
      >
        <span className="text-xs sm:text-sm font-bold">?</span>
      </button>
      {modal}
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
  step2Selections: string[]
  step3Selections: string[]
  scannerChecked: boolean
  fnChecked: boolean
  productCardCount: number
  serviceContractChecked: boolean
  evotorRestore: boolean
  sigmaHelpChecked: boolean
  unsureFnsRegistration: boolean
  includeChecklist?: boolean
}): string {
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

function DoneScreen({
  effectiveKkmInfo, kkmCondition, clientData, totalCalc,
  onBack, onPrint, onClose, kkmType, effectiveKkm,
  step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked,
  evotorRestore, sigmaHelpChecked, unsureFnsRegistration
}: {
  effectiveKkmInfo: { name: string }
  kkmCondition: string
  clientData: { name: string; inn: string; phone: string; email: string; address: string; kkmModel: string; kkmNumber: string; comment: string; evotorLogin: string; sellsExcise: boolean }
  totalCalc: { items: { name: string; price: number }[]; total: number }
  onBack: () => void
  onPrint: () => void
  onClose: () => void
  kkmType: string
  effectiveKkm: string
  step2Selections: string[]
  step3Selections: string[]
  scannerChecked: boolean
  fnChecked: boolean
  productCardCount: number
  serviceContractChecked: boolean
  evotorRestore: boolean
  sigmaHelpChecked: boolean
  unsureFnsRegistration: boolean
}) {
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

      // Письмо инженерам — с чеклистом
      const engineerHtml = generateOrderHtml({
        effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc,
        step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration,
        includeChecklist: true
      })
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'push@tellur.spb.ru',
          subject,
          html: engineerHtml,
          replyTo: clientData.email || undefined,
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Send failed')
      }

      // Письмо менеджеру — janicacid@ (с чеклистом)
      fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'janicacid@gmail.com', subject, html: engineerHtml, replyTo: clientData.email || undefined })
      })

      // Письмо клиенту — без чеклиста
      if (clientData.email) {
        const clientHtml = generateOrderHtml({
          effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc,
          step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration,
          includeChecklist: false
        })
        fetch('/api/send-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: clientData.email, subject, html: clientHtml })
        })
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
        <CardContent className="pt-5 space-y-3">
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
            <a href={MAX_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center py-2 text-[#1e3a5f] font-medium hover:underline">
              <Image src="/max-logo.webp" alt="Макс" width={20} height={20} className="w-5 h-5 rounded" />
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
  const mainRef = useRef<HTMLDivElement>(null)
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
  const [ofdPeriod, setOfdPeriod] = useState<OfdPeriod>('15')
  const [ofdProvider, setOfdProvider] = useState('takskom')
  const [fnChecked, setFnChecked] = useState(false)
  const [fnPeriod, setFnPeriod] = useState<'15' | '36'>('15')
  const [fnActivityType, setFnActivityType] = useState('general')
  // Сигма — 3 тарифа, оплачиваются отдельно на sigma.ru/tarify/
  const [sigmaHelpChecked, setSigmaHelpChecked] = useState(false)
  const [unsureFnsRegistration, setUnsureFnsRegistration] = useState(false)
  const [serviceContractChecked, setServiceContractChecked] = useState(false)
  const [serviceContractPeriod, setServiceContractPeriod] = useState<'month' | 'year'>('month')

  const [clientData, setClientData] = useState({
    name: '', inn: '', phone: '', email: '', address: '',
    kkmModel: '', kkmNumber: '', fnNumber: '', comment: '',
    evotorLogin: '', evotorPassword: '', hasEcp: false,
    fnActivityType: '', sellsExcise: false
  })

  const [showBanner, setShowBanner] = useState(true)
  const [activeHint, setActiveHint] = useState<string | null>(null)
  const handleHintOpen = useCallback((key: string) => setActiveHint(key), [])
  const handleHintClose = useCallback(() => setActiveHint(null), [])

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
  const ofdLocked = kkmCondition === 'new'
  const ofdEffective = ofdLocked || ofdChecked

  // Валидация
  const contactValid = clientData.phone.trim() !== ''
  const ecpChecked = clientData.hasEcp
  // Для Эвотор/Сигма (новый/бу): можно идти дальше если выбрано чем торгует ИЛИ выбрано хотя бы одно приложение/подписка
  const smartTerminalNeedsTrade = (kkmType === 'evotor' || effectiveKkm === 'sigma') && (kkmCondition === 'new' || kkmCondition === 'used')
  const evotorTradeOrAppsReady = smartTerminalNeedsTrade
    ? (evotorTradeType !== 'none' || evotorAppsSelected.size > 0)
    : true
  const canGoStep2 = kkmType !== '' && kkmCondition !== '' && ecpChecked && evotorTradeOrAppsReady
  const canGoStep3 = step2Selections.length > 0

  // --- Синхронизация торгового типа и приложений Эвотор ---
  const handleEvotorTradeType = useCallback((tradeType: 'marking' | 'alcohol' | 'both') => {
    setEvotorTradeType(tradeType)
    const apps = new Set<string>()
    if (tradeType === 'marking' || tradeType === 'both') apps.add('marking')
    if (tradeType === 'alcohol' || tradeType === 'both') apps.add('utm')
    setEvotorAppsSelected(apps)
  }, [])

  const handleEvotorAppToggle = useCallback((appId: string) => {
    setEvotorAppsSelected(prev => {
      const next = new Set(prev)
      if (next.has(appId)) next.delete(appId)
      else next.add(appId)
      // Автоопределение типа торговли по выбранным приложениям
      const hasMarking = next.has('marking')
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

    // Определяем наличие маркировки и алкоголя
    let hasMarking = false
    let hasAlcohol = false
    if (isSmartTerminal) {
      hasMarking = evotorTradeType === 'marking' || evotorTradeType === 'both' || evotorAppsSelected.has('marking')
      hasAlcohol = evotorTradeType === 'alcohol' || evotorTradeType === 'both' || evotorAppsSelected.has('utm')
    }
    // Для не-смарт терминалов (Атол, Меркурий и др.): sellsExcise — единственный показатель алкоголя
    if (!isSmartTerminal) {
      hasAlcohol = clientData.sellsExcise
    }

    // Авто-установка sellsExcise при выборе алкоголя на смарт-терминале
    if (isSmartTerminal && hasAlcohol && !clientData.sellsExcise) {
      setClientData(prev => ({ ...prev, sellsExcise: true }))
    }

    // Не-смарт терминал без маркировки/алкоголя — не ставим ничего автоматически
    if (!isSmartTerminal && !hasMarking && !hasAlcohol && kkmCondition !== 'old') return

    setStep2Selections(prev => {
      const next = new Set(prev)

      // ====== СТАРАЯ КАССА (любой бренд) ======
      if (kkmCondition === 'old') {
        // Всегда частичная настройка — клиент уже работает с маркировкой
        next.delete('marking_setup')
        if (!next.has('partial_marketing_setup')) next.add('partial_marketing_setup')

        if (hasAlcohol) {
          // Добавление алкоголя → нужна перерегистрация
          if (!next.has('fns_reregistration')) next.add('fns_reregistration')
        } else {
          // Только маркировка, без алкоголя → перерегистрация не нужна
          next.delete('fns_reregistration')
        }
        return [...next]
      }

      // ====== НОВАЯ / Б/У КАССА ======
      if (isSmartTerminal) {
        if (hasMarking) {
          if (!next.has('marking_setup') && !next.has('partial_marketing_setup')) next.add('marking_setup')
        }
        if (hasAlcohol && !next.has('fns_reregistration') && kkmCondition !== 'new') {
          next.add('fns_reregistration')
        }
      }

      return [...next]
    })
  }, [kkmType, effectiveKkm, evotorTradeType, evotorAppsSelected, kkmCondition, clientData.sellsExcise])

  const markingDesc = useMemo(() => {
    if (kkmType === 'evotor') return 'Связываем ЭДО, Честный ЗНАК, кассу Эвотор, ТС ПИоТ и личный кабинет Эвотор в единую цепочку — от приёмки товара до пробития чека'
    return 'Связываем ЭДО, Честный ЗНАК, Вашу кассу и ТС ПИоТ в единую цепочку — от приёмки товара до пробития чека'
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
  useMemo(() => {
    setEvotorTradeType('none')
    setEvotorAppsSelected(new Set())
    setEvotorHasSubscription(false)
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

  // ===================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e8ecf2] flex flex-col">
        <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; opacity: 0; }
[data-slot=checkbox]{width:22px;height:22px;min-width:22px;min-height:22px;border:2px solid #475569;border-radius:5px;cursor:pointer;transition:all .15s ease}
[data-slot=checkbox]:hover{border-color:#1e3a5f;box-shadow:0 0 0 3px rgba(30,58,95,.12)}
[data-slot=checkbox][data-state=checked]{background-color:#1e3a5f;border-color:#1e3a5f}
[data-slot=checkbox][data-state=checked]:hover{background-color:#162d4a}
.space-y-5 .flex.items-start.gap-3,.space-y-7 .flex.items-start.gap-3,.space-y-6 .flex.items-start.gap-3{flex-wrap:wrap}`}</style>
        {/* HEADER */}
        <header className="bg-white shadow-sm border-b border-[#1e3a5f]/10">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-2.5 sm:gap-3 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Вернуться на главную"
                onClick={() => { setCurrentStep(1); setIsDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrentStep(1); setIsDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
              >
                <Image src="/logo.webp" alt="Теллур-Интех" width={88} height={72} className="w-11 h-9 sm:w-[88px] sm:h-[72px]" quality={100} />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e3a5f] truncate">Калькулятор маркировки</h1>
              </div>
              <a href="tel:+79219324163" title="+7 921 932 41 63" className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:inline-flex sm:gap-1.5 sm:px-3 sm:py-1.5 bg-[#e8a817] hover:bg-[#d49a12] text-white text-sm font-semibold rounded-full sm:rounded-lg transition-colors shrink-0">
                <Phone className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Позвонить менеджеру</span>
              </a>
            </div>
          </div>
        </header>



        <main ref={mainRef} className="flex-1 max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full">

          <div className="mt-2 sm:mt-4">
            {/* Уведомление об ЭЦП */}
            {!ecpChecked && (
              <div className="animate-fade-in-up p-3 sm:p-4 rounded-xl border border-amber-300 bg-amber-50">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="ecp_check_top"
                        checked={false}
                        onCheckedChange={() => setClientData(prev => ({ ...prev, hasEcp: true }))}
                        className="shrink-0"
                      />
                      <Label htmlFor="ecp_check_top" className="cursor-pointer text-base sm:text-lg font-medium text-amber-800">
                        У меня есть ЭЦП
                      </Label>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-700 mt-1 ml-[22px]">ЭЦП — это электронная подпись, хранящаяся на специальной флэшке (Рутокен, JaCarta). Без неё нельзя войти в ФНС, Честный ЗНАК и подписывать документы. Если Вы не знаете, что такое ЭЦП — скорее всего она у Вас есть, уточните у бухгалтера.</p>
                  </div>
                </div>
              </div>
            )}


            {/* STEP INDICATOR */}
            <div className="max-w-lg mx-auto mb-5 sm:mb-7">
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
              <div className={ecpChecked ? '' : 'opacity-50 pointer-events-none relative'}>
              <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
                <Card>
                  <CardContent className="pt-5 sm:pt-6 space-y-5">
                    <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f]">Состояние кассы</h3>
                    {/* Состояние кассы */}
                    <div>
                      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                        <div
                          onClick={() => { setKkmCondition('old'); setScannerChecked(false) }}
                          className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${kkmCondition === 'old' ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-[#1e3a5f]/5 shrink-0">
                            <BadgeCheck className="w-7 h-7 sm:w-9 sm:h-9 text-[#1e3a5f]" />
                          </div>
                          <Label className={`cursor-pointer text-xs sm:text-sm font-bold text-center leading-tight ${kkmCondition === 'old' ? 'text-[#1e3a5f]' : 'text-slate-700'}`}>Текущая</Label>
                          <span className="text-[10px] sm:text-xs text-slate-400 text-center leading-tight">Работаю на ней</span>
                        </div>
                        <div
                          onClick={() => { setKkmCondition('new'); setScannerChecked(true) }}
                          className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${kkmCondition === 'new' ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-[#e8a817]/10 shrink-0">
                            <Star className="w-7 h-7 sm:w-9 sm:h-9 text-[#e8a817]" />
                          </div>
                          <Label htmlFor="cond_new" className={`cursor-pointer text-xs sm:text-sm font-bold text-center leading-tight ${kkmCondition === 'new' ? 'text-[#1e3a5f]' : 'text-slate-700'}`}>Новая</Label>
                          <span className="text-[10px] sm:text-xs text-slate-400 text-center leading-tight">Только что купленная</span>
                        </div>
                        <div
                          onClick={() => { setKkmCondition('used'); setScannerChecked(true) }}
                          className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${kkmCondition === 'used' ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-[#1e3a5f]/5 shrink-0">
                            <Tag className="w-7 h-7 sm:w-9 sm:h-9 text-[#1e3a5f]" />
                          </div>
                          <Label className={`cursor-pointer text-xs sm:text-sm font-bold text-center leading-tight ${kkmCondition === 'used' ? 'text-[#1e3a5f]' : 'text-slate-700'}`}>Б/у</Label>
                          <span className="text-[10px] sm:text-xs text-slate-400 text-center leading-tight">Купил с рук</span>
                        </div>
                      </div>
                    </div>

                    {kkmCondition === 'new' && (
                      <div className="p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-[#1e3a5f]">
                          <Info className="w-4 h-4 shrink-0" />
                          <span className="font-medium">Для новой кассы обязательны: регистрация в ФНС и подключение ОФД — учтены ниже в расчёте</span>
                        </div>
                      </div>
                    )}

                    {/* Разделитель */}
                    <Separator />

                    {/* Заголовок перед брендами */}
                    <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f]">Выберите Вашу кассу</h3>

                    {/* Сетка касс */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                      {visibleKkmTypes.map(([key, kkm]) => {
                        const brand = KKM_BRANDS[key] || { color: '#64748b', bg: '#64748b' }
                        const isSelected = kkmType === key
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => { setKkmType(key as KkmType); if (key !== 'atol') { setSigmaSelected(false); setSigmaHelpChecked(false) } }}
                            className={`flex items-center justify-center p-1.5 sm:p-2 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${isSelected ? 'bg-white' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            style={isSelected ? { borderColor: brand.color } : undefined}
                          >
                            <Image src={`/brands/${key}.webp`} alt={kkm.shortName} width={400} height={80} className="max-w-full h-auto object-contain" quality={100} unoptimized />
                          </button>
                        )
                      })}
                    </div>

                    {kkmType === 'atol' && (
                      <div className="p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Checkbox id="sigmaCheck" checked={sigmaSelected} onCheckedChange={(c) => setSigmaSelected(c as boolean)} className="w-7 h-7 shrink-0" />
                          <div className="min-w-0">
                            <Label htmlFor="sigmaCheck" className="cursor-pointer font-medium text-[#1e3a5f] text-sm">У меня касса Сигма (производство Атол)</Label>
                            <p className="text-xs text-slate-500 mt-0.5">Смарт-терминалы под брендом Сигма выпускаются компанией Атол</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ============================================================================ */}
                    {/* СИГМА — чем торгуете + подписки Атол */}
                    {/* ============================================================================ */}
                    {showSigmaSubs && (
                      <>
                        {/* Для новых и б/у — выбор чем торгуете */}
                        {(kkmCondition === 'new' || kkmCondition === 'used') && (
                          <div className="p-3 sm:p-4 bg-[#e8a817]/5 border border-[#e8a817]/30 rounded-lg space-y-3">
                            <div className="flex items-center gap-2">
                              <ScanLine className="w-5 h-5 text-[#e8a817] shrink-0" />
                              <p className="font-semibold text-[#1e3a5f] text-sm">Чем Вы планируете торговать?</p>
                            </div>
                            <p className="text-xs text-slate-500">Выберите категорию — это поможет нам подобрать нужные настройки.</p>
                            <RadioGroup value={evotorTradeType === 'none' ? '' : evotorTradeType} onValueChange={(v) => handleEvotorTradeType(v as 'marking' | 'alcohol' | 'both')} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="marking" id="sigma_trade_marking" />
                                <Package className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                <Label htmlFor="sigma_trade_marking" className="cursor-pointer text-sm">Маркированные товары (сигареты, обувь, вода и т.д.)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="alcohol" id="sigma_trade_alcohol" />
                                <Wine className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                <Label htmlFor="sigma_trade_alcohol" className="cursor-pointer text-sm">Алкоголь (пиво, вино, крепкий алкоголь)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="both" id="sigma_trade_both" />
                                <PackageOpen className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                <Label htmlFor="sigma_trade_both" className="cursor-pointer text-sm">Маркированные товары + алкоголь</Label>
                              </div>
                            </RadioGroup>
                            {evotorTradeType === 'none' && evotorAppsSelected.size === 0 && (
                              <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />Выберите категорию торговли, чтобы продолжить</p>
                            )}
                          </div>
                        )}

                        {/* Для действующей — галочка «имеется подписка» */}
                        {kkmCondition === 'old' && (
                          <div className="p-3 sm:p-4 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg space-y-3">
                            <p className="font-medium text-[#1e3a5f] text-sm">Что нужно подключить на действующей кассе?</p>
                            <div className="flex items-start gap-3 p-3 bg-white rounded border border-[#1e3a5f]/10">
                              <Checkbox id="sigma_has_sub" checked={evotorHasSubscription}
                                onCheckedChange={(c) => {
                                  const checked = c as boolean
                                  setEvotorHasSubscription(checked)
                                  if (checked) {
                                    setEvotorTradeType('marking')
                                    setEvotorAppsSelected(new Set(['marking']))
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
                                <p className="text-xs text-slate-500 mt-1">Отметьте, если на кассе Сигма уже оформлен тариф. Мы настроим связь с Честным ЗНАК, ЭДО и ТС ПИоТ.</p>
                              </div>
                            </div>
                            {!evotorHasSubscription && (
                              <div className="space-y-2">
                                <p className="text-xs text-slate-500 font-medium">Нужен новый тариф. Выберите категорию:</p>
                                <RadioGroup value={evotorTradeType === 'none' ? '' : evotorTradeType} onValueChange={(v) => handleEvotorTradeType(v as 'marking' | 'alcohol' | 'both')} className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="marking" id="sigma_trade_marking_old" />
                                    <Package className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                    <Label htmlFor="sigma_trade_marking_old" className="cursor-pointer text-sm">Маркированные товары</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="alcohol" id="sigma_trade_alcohol_old" />
                                    <Wine className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                    <Label htmlFor="sigma_trade_alcohol_old" className="cursor-pointer text-sm">Алкоголь</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="both" id="sigma_trade_both_old" />
                                    <PackageOpen className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                    <Label htmlFor="sigma_trade_both_old" className="cursor-pointer text-sm">Маркированные товары + алкоголь</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            )}
                          </div>
                        )}

                        {!evotorHasSubscription && (
                        <div className="p-3 sm:p-4 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg space-y-3">
                          <p className="font-medium text-[#1e3a5f] text-sm">Подписка на Сигма оформляется на официальном сайте</p>
                          <p className="text-sm text-slate-600">Для работы кассы Сигма необходимо оформить один из трёх тарифов на <a href={sigmaTariffLink} target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] underline hover:no-underline font-medium">sigma.ru</a>. Подписка оплачивается напрямую у Сигма и включает автообновление.</p>
                          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#1e3a5f]/10">
                            <Checkbox id="sigma_help" checked={sigmaHelpChecked}
                              onCheckedChange={(c) => setSigmaHelpChecked(c as boolean)}
                              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <Label htmlFor="sigma_help" className="cursor-pointer font-medium text-[#1e3a5f] text-sm leading-snug">
                                Помощь с оформлением тарифа + восстановление доступа к кабинету Сигма
                              </Label>
                              <p className="text-xs text-slate-500 mt-1">Если нет доступа к личному кабинету Сигма — восстановим логин/пароль и поможем подобрать и оформить подходящий тариф.</p>
                              <span className="text-sm font-bold text-[#1e3a5f]">500 руб.</span>
                            </div>
                          </div>
                        </div>
                        )}
                      </>
                    )}

                    {/* ============================================================================ */}
                    {/* ЭВOTOR — чем торгуете + приложения */}
                    {/* ============================================================================ */}
                    {kkmType === 'evotor' && currentKkmInfo.specialNote?.apps && (
                      <>
                        {/* Для новых и б/у — выбор чем торгуете */}
                        {(kkmCondition === 'new' || kkmCondition === 'used') && (
                          <div className="p-3 sm:p-4 bg-[#e8a817]/5 border border-[#e8a817]/30 rounded-lg space-y-3">
                            <div className="flex items-center gap-2">
                              <ScanLine className="w-5 h-5 text-[#e8a817] shrink-0" />
                              <p className="font-semibold text-[#1e3a5f] text-sm">Чем Вы планируете торговать?</p>
                            </div>
                            <p className="text-xs text-slate-500">Выберите категорию — нужные приложения Эвотор подставятся автоматически. Или выберите приложения вручную ниже.</p>
                            <RadioGroup value={evotorTradeType === 'none' ? '' : evotorTradeType} onValueChange={(v) => handleEvotorTradeType(v as 'marking' | 'alcohol' | 'both')} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="marking" id="trade_marking" />
                                <Package className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                <Label htmlFor="trade_marking" className="cursor-pointer text-sm">Маркированные товары (сигареты, обувь, вода и т.д.)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="alcohol" id="trade_alcohol" />
                                <Wine className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                <Label htmlFor="trade_alcohol" className="cursor-pointer text-sm">Алкоголь (пиво, вино, крепкий алкоголь)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="both" id="trade_both" />
                                <PackageOpen className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                <Label htmlFor="trade_both" className="cursor-pointer text-sm">Маркированные товары + алкоголь</Label>
                              </div>
                            </RadioGroup>
                            {evotorTradeType === 'none' && evotorAppsSelected.size === 0 && (
                              <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />Выберите категорию или хотя бы одно приложение ниже, чтобы продолжить</p>
                            )}
                          </div>
                        )}

                        {/* Для действующей — галочка «имеется подписка» */}
                        {kkmCondition === 'old' && (
                          <div className="p-3 sm:p-4 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg space-y-3">
                            <p className="font-medium text-[#1e3a5f] text-sm">Что нужно подключить на действующей кассе?</p>
                            <div className="flex items-start gap-3 p-3 bg-white rounded border border-[#1e3a5f]/10">
                              <Checkbox id="evotor_has_sub" checked={evotorHasSubscription}
                                onCheckedChange={(c) => {
                                  const checked = c as boolean
                                  setEvotorHasSubscription(checked)
                                  if (checked) {
                                    setEvotorTradeType('marking')
                                    setEvotorAppsSelected(new Set(['marking']))
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
                                <p className="text-xs text-slate-500 mt-1">Отметьте, если на кассе уже установлено и оплачено приложение «Маркировка». Мы настроим связь с Честным ЗНАК, ЭДО и ТС ПИоТ.</p>
                              </div>
                            </div>
                            {!evotorHasSubscription && (
                              <div className="space-y-2">
                                <p className="text-xs text-slate-500 font-medium">Нужна новая подписка. Выберите категорию:</p>
                                <RadioGroup value={evotorTradeType === 'none' ? '' : evotorTradeType} onValueChange={(v) => handleEvotorTradeType(v as 'marking' | 'alcohol' | 'both')} className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="marking" id="trade_marking_old" />
                                    <Package className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                    <Label htmlFor="trade_marking_old" className="cursor-pointer text-sm">Маркированные товары</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="alcohol" id="trade_alcohol_old" />
                                    <Wine className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                    <Label htmlFor="trade_alcohol_old" className="cursor-pointer text-sm">Алкоголь</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="both" id="trade_both_old" />
                                    <PackageOpen className="w-5 h-5 shrink-0 text-[#1e3a5f]" />
                                    <Label htmlFor="trade_both_old" className="cursor-pointer text-sm">Маркированные товары + алкоголь</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            )}
                            {evotorHasSubscription && (
                              <div className="flex items-center gap-2 mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                                <button type="button" onClick={(e) => { e.stopPropagation(); handleHintOpen('tspiot') }}
                                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-200/60 text-amber-800 text-xs font-bold shrink-0">?</button>
                                <span className="text-xs text-amber-700">Могут потребоваться и другие приложения — уточните у менеджера!</span>
                              </div>
                            )}
                          </div>
                        )}

                        {!evotorHasSubscription && (
                        <div className="p-3 sm:p-4 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-lg space-y-3">
                          <p className="font-medium text-[#1e3a5f] text-sm">{currentKkmInfo.specialNote.title}</p>
                          <p className="text-sm text-slate-600">{currentKkmInfo.specialNote.content}</p>
                          {currentKkmInfo.specialNote.apps.map((app, idx) => {
                            const appKey = app.name.includes('\u041c\u0430\u0440\u043a\u0438\u0440\u043e\u0432\u043a\u0430') ? 'marking' : app.name.includes('\u0423\u0422\u041c') ? 'utm' : `opt_${idx}`
                            const isSelected = evotorAppsSelected.has(appKey)
                            const canToggle = !evotorHasSubscription
                            return (
                              <div key={idx} className={`p-3 sm:p-4 bg-white rounded-lg border ${isSelected ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'} ${canToggle ? 'cursor-pointer hover:border-slate-300 transition-colors' : ''}`} style={{ animationDelay: `${idx * 50}ms` }}
                                onClick={() => canToggle ? handleEvotorAppToggle(appKey) : undefined}>
                                <div className="flex items-start gap-3">
                                  {canToggle && (
                                    <Checkbox checked={isSelected} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" onCheckedChange={() => handleEvotorAppToggle(appKey)} />
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
                      <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
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
                      <div className="p-3 sm:p-4 bg-[#e8a817]/10 border border-[#e8a817]/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-[#e8a817] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1e3a5f] text-sm">Для {kkmCondition === 'used' ? 'б/у' : 'старой'} кассы {effectiveKkmInfo.name} могут потребоваться:</p>
                            <div className="mt-2 space-y-1.5 text-sm text-slate-700">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 p-2 bg-white rounded border border-[#e8a817]/20">
                                <div className="flex items-center gap-2">
                                  <HintButton hintKey="firmware_update" activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />
                                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                                  </div>
                                  <Checkbox id="firmware_chk" checked={firmwareChecked} onCheckedChange={(c) => setFirmwareChecked(c as boolean)} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                                  <Label htmlFor="firmware_chk" className="cursor-pointer text-sm sm:text-base font-medium">Обновление программы (прошивка)</Label>
                                </div>
                                <span className="font-semibold text-[#1e3a5f] sm:whitespace-nowrap sm:ml-auto">{fwPrices.firmware.toLocaleString('ru-RU')} руб.</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 p-2 bg-white rounded border border-[#e8a817]/20">
                                <div className="flex items-center gap-2">
                                  <HintButton hintKey="kkm_license" activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />
                                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                                  </div>
                                  <Checkbox id="license_chk" checked={licenseChecked} onCheckedChange={(c) => setLicenseChecked(c as boolean)} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                                  <Label htmlFor="license_chk" className="cursor-pointer text-sm sm:text-base font-medium">Лицензия на ПО кассы</Label>
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
            )}

            {/* ============================================================ */}
            {/* УСЛУГИ */}
            {/* ============================================================ */}
            {currentStep === 2 && !isDone && (
              <div className="max-w-2xl mx-auto space-y-5 sm:space-y-7">

                {/* Подакцизные товары — выше всех */}
                {(step2Selections.includes('fns_reregistration') || kkmCondition === 'new' || kkmCondition === 'old') && (
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardContent className="pt-5 sm:pt-6">
                      <div className="flex items-start gap-3">
                        <Checkbox id="excise_check"
                          checked={clientData.sellsExcise}
                          onCheckedChange={(c) => {
                            const val = !!c
                            setClientData(prev => ({ ...prev, sellsExcise: val }))
                            // Для старой кассы — автовыбор перерегистрации при включении подакцизных
                            if (kkmCondition === 'old' && val) {
                              setStep2Selections(prev => {
                                if (prev.includes('fns_reregistration')) return prev
                                return [...prev, 'fns_reregistration']
                              })
                            }
                            // Для старой кассы — убрать перерегистрацию при снятии подакцизных (если нет галочки "не уверен")
                            if (kkmCondition === 'old' && !val && !unsureFnsRegistration) {
                              setStep2Selections(prev => prev.filter(x => x !== 'fns_reregistration'))
                            }
                          }}
                          className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
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

                {/* Активные (доступные для выбора) услуги */}
                {step2Services.filter(s => {
                  if (s.id === 'partial_marketing_setup' && kkmCondition !== 'old') return false
                  // Полная настройка недоступна для старой кассы (уже работает с маркировкой)
                  if (s.id === 'marking_setup' && kkmCondition === 'old') return false
                  const isLocked = kkmCondition === 'new' && s.id === 'fns_reregistration'
                  const isMutuallyDisabled = (
                    (s.id === 'partial_marketing_setup' && step2Selections.includes('marking_setup')) ||
                    (s.id === 'marking_setup' && step2Selections.includes('partial_marketing_setup'))
                  )
                  // Перерегистрация для старой кассы — только при подакцизных или галочке "не уверен"
                  const isFnsBlockedForOld = kkmCondition === 'old' && s.id === 'fns_reregistration' &&
                    !clientData.sellsExcise && !unsureFnsRegistration
                  return !isLocked && !isMutuallyDisabled && !isFnsBlockedForOld
                }).map((service, idx) => {
                  const desc = service.id === 'marking_setup' ? markingDesc : service.description
                  const selected = step2Selections.includes(service.id)
                  const ServiceIcon = service.id === 'fns_reregistration' ? FileSignature : service.id === 'marking_setup' ? Settings2 : Wrench
                  return (
                    <Card key={service.id} className={selected ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
                      <CardContent className="pt-5 sm:pt-6 animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="flex items-start gap-3">
                          {service.hintKey && <HintButton hintKey={service.hintKey} activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />}
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                            <ServiceIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                          </div>
                          <Checkbox id={service.id} checked={selected}
                            onCheckedChange={() => {
                              const mutuallyExclusive = service.id === 'marking_setup' ? 'partial_marketing_setup' : service.id === 'partial_marketing_setup' ? 'marking_setup' : null
                              setStep2Selections(prev => {
                                const without = mutuallyExclusive ? prev.filter(x => x !== mutuallyExclusive) : prev
                                const isNowSelected = !without.includes(service.id)
                                const next = isNowSelected ? [...without, service.id] : without.filter(x => x !== service.id)
                                // При выборе частичной настройки — убрать перерегистрацию (клиент уже работает с маркировкой)
                                // Но НЕ убирать если есть алкоголь (перерегистрация нужна для подакцизных товаров)
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
                              <Label htmlFor={service.id} className="font-bold text-base leading-snug cursor-pointer">{service.name}</Label>
                              <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">{service.price.toLocaleString('ru-RU')} руб.</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">{desc}</p>
                            {service.id === 'partial_marketing_setup' && selected && (
                              <div className="mt-3 space-y-2.5">
                                <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-lg">
                                  <p className="text-xs text-orange-700 font-medium">⚠ Перерегистрация кассы в ФНС не включена — ответственность за корректность регистрации на Вас. Если касса уже зарегистрирована с признаками маркировки и форматом ФФД 1.2 — всё в порядке.</p>
                                </div>
                                <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200">
                                  <Checkbox id="unsure_fns_reg"
                                    checked={unsureFnsRegistration}
                                    onCheckedChange={(c) => {
                                      const val = c as boolean
                                      setUnsureFnsRegistration(val)
                                      if (val) {
                                        // Автовыбор перерегистрации
                                        setStep2Selections(prev => {
                                          if (prev.includes('fns_reregistration')) return prev
                                          return [...prev, 'fns_reregistration']
                                        })
                                      } else if (!clientData.sellsExcise) {
                                        // Снять перерегистрацию если нет алкоголя
                                        setStep2Selections(prev => prev.filter(x => x !== 'fns_reregistration'))
                                      }
                                    }}
                                    className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                                  <Label htmlFor="unsure_fns_reg" className="cursor-pointer text-sm leading-snug">
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

                {/* Компактная секция: недоступные для выбора услуги */}
                {(() => {
                  const unavailable = step2Services.filter(s => {
                    if (s.id === 'partial_marketing_setup' && kkmCondition !== 'old') return false
                    // Полная настройка недоступна для старой кассы
                    const isMarkingLockedForOld = kkmCondition === 'old' && s.id === 'marking_setup'
                    const isLocked = kkmCondition === 'new' && s.id === 'fns_reregistration'
                    const isMutuallyDisabled = (
                      (s.id === 'partial_marketing_setup' && step2Selections.includes('marking_setup')) ||
                      (s.id === 'marking_setup' && step2Selections.includes('partial_marketing_setup'))
                    )
                    const isFnsBlockedForOld = kkmCondition === 'old' && s.id === 'fns_reregistration' &&
                      !clientData.sellsExcise && !unsureFnsRegistration
                    return isMarkingLockedForOld || isLocked || isMutuallyDisabled || isFnsBlockedForOld
                  })
                  if (unavailable.length === 0) return null
                  return (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Недоступные для выбора:</p>
                      {unavailable.map(s => {
                        const isMarkingLockedForOld = kkmCondition === 'old' && s.id === 'marking_setup'
                        const isLocked = kkmCondition === 'new' && s.id === 'fns_reregistration'
                        const isFnsBlockedForOld = kkmCondition === 'old' && s.id === 'fns_reregistration' &&
                          !clientData.sellsExcise && !unsureFnsRegistration
                        const reason = isMarkingLockedForOld
                          ? 'касса уже работает с маркировкой — доступна только частичная настройка'
                          : isLocked ? 'включено автоматически'
                          : isFnsBlockedForOld ? 'отметьте «Подакцизные товары» или «Не уверен» ниже чтобы открыть'
                          : 'взаимоисключает выбранную услугу'
                        return (
                          <p key={s.id} className="text-xs text-slate-400">
                            <span className="line-through">{s.name}</span>
                            <span className="ml-1.5">— {reason}</span>
                          </p>
                        )
                      })}
                    </div>
                  )
                })()}

                {/* ОФД */}
                {(() => {
                  const visibleProviders = OFD_PROVIDERS.filter(p => !p.lockedForNew || kkmCondition !== 'new')
                  const selectedProvider = OFD_PROVIDERS.find(p => p.id === ofdProvider) || OFD_PROVIDERS[0]
                  return (
                    <Card className={ofdEffective ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
                      <CardContent className="pt-5 sm:pt-6">
                        <div className="flex items-start gap-3">
                          <HintButton hintKey="ofd_takskom" activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />

                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                            <Server className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                          </div>                          <Checkbox id="ofd_check"
                            checked={ofdEffective}
                            disabled={ofdLocked}
                            onCheckedChange={(c) => setOfdChecked(c as boolean)}
                            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                                <Label htmlFor="ofd_check" className={`font-bold text-base cursor-pointer leading-snug ${ofdLocked ? 'text-[#1e3a5f]' : ''}`}>
                                  ОФД (оператор фискальных данных)
                                </Label>
                                {selectedProvider.partner && <Badge className="bg-[#e8a817]/20 text-[#1e3a5f] text-xs shrink-0">Партнёр</Badge>}
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                              ОФД — обязательное подключение для работы кассы. Мы также продлеваем подписки на ОФД.{ofdLocked && ' Для новой кассы подключение обязательно.'}
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
                                          <span className="ml-2 inline-flex items-center gap-1.5 flex-wrap">
                                            <span className="font-bold text-[#1e3a5f] text-sm sm:text-base">{info.price.toLocaleString('ru-RU')} ₽</span>
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

                {/* ТС ПИоТ — инфо */}
                <Card className="border-[#e8a817]/30 bg-[#e8a817]/5">
                  <CardContent className="pt-5 sm:pt-6">
                    <div className="flex items-start gap-3">
                      <HintButton hintKey="tspiot" activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />

                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                      </div>                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1e3a5f] text-sm">Подробнее о ТС ПИоТ</h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                          ТС ПИоТ (Единый Сервисный Модуль) — обязательный программный модуль для маркировки. Без него касса не пробьёт чеки по маркированным товарам. Лицензия приобретается на сайте <a href="https://ao-esp.ru" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] underline hover:no-underline font-medium">ao-esp.ru</a>.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 py-5 sm:py-6 text-base sm:text-lg font-bold" size="lg" onClick={() => { setCurrentStep(1); setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }}><ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> Назад</Button>
                  <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-5 sm:py-6 text-base sm:text-lg font-bold" size="lg" onClick={() => goToStep(3)} disabled={!canGoStep3}>Далее <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" /></Button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* ДОПОЛНИТЕЛЬНО */}
            {/* ============================================================ */}
            {currentStep === 3 && !isDone && (
              <div className="max-w-3xl mx-auto space-y-5 sm:space-y-7">

                    {/* ФН — фискальный накопитель */}
                    <Card className={fnChecked ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
                      <CardContent className="pt-5 sm:pt-6">
                        <div className="flex items-start gap-3">
                          <HintButton hintKey="fn_product" activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />

                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                          </div>                          <Checkbox id="fn_product" checked={fnChecked}
                            onCheckedChange={(c) => { setFnChecked(c as boolean); if (c) { setFnActivityType(fnPeriod === '36' ? 'excise' : 'general') } }}
                            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <Label htmlFor="fn_product" className="font-bold text-sm cursor-pointer leading-snug">Фискальный накопитель (ФН)</Label>
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
                    <Card className={scannerChecked ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
                      <CardContent className="pt-5 sm:pt-6">
                        <div className="flex items-start gap-3">
                          <HintButton hintKey="scanner_2d" activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />

                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                            <ScanLine className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                          </div>                          <Checkbox id="scanner" checked={scannerChecked} onCheckedChange={(c) => setScannerChecked(c as boolean)} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <Label htmlFor="scanner" className="font-bold text-base cursor-pointer leading-snug">Сканер 2D для считывания кодов маркировки</Label>
                              <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">{scannerPrices[effectiveKkm].toLocaleString('ru-RU')} руб.</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Читает квадратные коды (Data Matrix) на маркированных товарах. Обычный сканер не подойдёт.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Регистрация ККТ в ФНС — только для новых касс, заблокировано */}
                    {kkmCondition === 'new' && (
                      <Card className="border-[#1e3a5f] bg-[#1e3a5f]/[0.03]">
                        <CardContent className="pt-5 sm:pt-6">
                          <div className="flex items-start gap-3">
                            <HintButton hintKey="fns_registration" activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />

                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                              <FilePlus2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                            </div>                            <Checkbox id="fns_reg" checked={true} disabled={true} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <Label htmlFor="fns_reg" className="font-bold text-sm text-[#1e3a5f] leading-snug cursor-default">Регистрация ККТ в ФНС</Label>
                                <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">1 500 руб.</span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-500 mt-1">Подача заявления о регистрации кассы на сайте ФНС, подписание ЭЦП, сопровождение до подтверждения — обязательно для новой кассы</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Карточки товаров */}
                    <Card className={productCardCount > 0 ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
                      <CardContent className="pt-5 sm:pt-6">
                        <div className="flex items-start gap-3">
                          <HintButton hintKey="product_cards" activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />

                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                            <LayoutList className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                          </div>                          <Checkbox id="product_cards" checked={productCardCount > 0} onCheckedChange={(c) => setProductCardCount(c ? 1 : 0)} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <Label htmlFor="product_cards" className="font-bold text-base cursor-pointer leading-snug">Создание карточек товаров</Label>
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
                    {step3Services.map((service, idx) => {
                      const selected = step3Selections.includes(service.id)
                      return (
                        <Card key={service.id} className={selected ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
                          <CardContent className="pt-5 sm:pt-6">
                            <div className="flex items-start gap-3">
                              {service.hintKey && <HintButton hintKey={service.hintKey} activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />}
                              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                                {(() => { const ServiceIcon = service.id === 'training' ? GraduationCap : service.id === 'fn_replacement' ? RefreshCw : KeyRound; return <ServiceIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" /> })()}
                              </div>
                              <Checkbox id={service.id} checked={selected}
                                onCheckedChange={() => setStep3Selections(prev => prev.includes(service.id) ? prev.filter(x => x !== service.id) : [...prev, service.id])}
                                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <Label htmlFor={service.id} className="font-bold text-base cursor-pointer leading-snug">{service.name}</Label>
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

                    {/* Договор обслуживания */}
                    <Card className={serviceContractChecked ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
                      <CardContent className="pt-5 sm:pt-6">
                        <div className="flex items-start gap-3">
                          <HintButton hintKey="service_contract" activeHint={activeHint} onHintOpen={handleHintOpen} onHintClose={handleHintClose} />

                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                            <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                          </div>                          <Checkbox id="service_contract" checked={serviceContractChecked}
                            onCheckedChange={(c) => setServiceContractChecked(c as boolean)}
                            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <Label htmlFor="service_contract" className="font-bold text-base cursor-pointer leading-snug">Договор обслуживания</Label>
                              <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">1 000 руб./мес.</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Регулярное обслуживание кассы — визиты мастера, профилактика, приоритетная поддержка</p>
                            {serviceContractChecked && (
                              <div className="mt-3 space-y-3">
                                <RadioGroup value={serviceContractPeriod} onValueChange={(v) => setServiceContractPeriod(v as 'month' | 'year')} className="space-y-2">
                                  <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#1e3a5f]/10">
                                    <RadioGroupItem value="month" id="sc_month" />
                                    <Label htmlFor="sc_month" className="flex-1 cursor-pointer text-sm">
                                      <span className="font-medium text-[#1e3a5f]">Помесячная оплата</span>
                                      <span className="ml-2 font-bold text-[#1e3a5f]">1 000 ₽/мес.</span>
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-green-200">
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
                                <div className="p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-lg space-y-1.5">
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
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2"><Info className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f] shrink-0" />Контактные данные</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm">Наименование (юрлицо / ИП) <span className="text-red-500">*</span></Label>
                          <Input value={clientData.name} onChange={(e) => setClientData({...clientData, name: e.target.value})} placeholder="ООО «Ромашка»" className="mt-1" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">Телефон <span className="text-red-500">*</span></Label>
                            <Input type="tel" value={clientData.phone} onChange={(e) => setClientData({...clientData, phone: e.target.value})} placeholder="+7" className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm">Электронная почта</Label>
                            <Input type="email" value={clientData.email} onChange={(e) => setClientData({...clientData, email: e.target.value})} className="mt-1" />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">ИНН <span className="text-red-500">*</span></Label>
                            <Input value={clientData.inn} onChange={(e) => setClientData({...clientData, inn: e.target.value})} className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm">Адрес установки кассы</Label>
                            <Input list="ru-addresses" value={clientData.address} onChange={(e) => setClientData({...clientData, address: e.target.value})} className="mt-1" />
                            <datalist id="ru-addresses">
                              <option value="г. Москва" /><option value="г. Санкт-Петербург" /><option value="г. Новосибирск" /><option value="г. Екатеринбург" /><option value="г. Казань" /><option value="г. Нижний Новгород" /><option value="г. Челябинск" /><option value="г. Самара" /><option value="г. Омск" /><option value="г. Ростов-на-Дону" /><option value="г. Уфа" /><option value="г. Красноярск" /><option value="г. Воронеж" /><option value="г. Пермь" /><option value="г. Волгоград" /><option value="г. Краснодар" /><option value="г. Саратов" /><option value="г. Тюмень" /><option value="г. Тольятти" /><option value="г. Ижевск" /><option value="г. Барнаул" /><option value="г. Ульяновск" /><option value="г. Иркутск" /><option value="г. Хабаровск" /><option value="г. Ярославль" /><option value="г. Владивосток" /><option value="г. Махачкала" /><option value="г. Томск" /><option value="г. Оренбург" /><option value="г. Кемерово" /><option value="г. Рязань" /><option value="г. Астрахань" /><option value="г. Набережные Челны" /><option value="г. Пенза" /><option value="г. Липецк" /><option value="г. Тула" /><option value="г. Калининград" /><option value="г. Балашиха" /><option value="г. Курск" /><option value="г. Ставрополь" /><option value="г. Улан-Удэ" /><option value="г. Тверь" /><option value="г. Белгород" /><option value="г. Сочи" /><option value="г. Нижний Тагил" /><option value="г. Архангельск" /><option value="г. Волжский" /><option value="г. Калуга" /><option value="г. Сургут" /><option value="г. Чебоксары" /><option value="г. Ковров" /><option value="г. Иваново" /><option value="г. Брянск" /><option value="г. Смоленск" /><option value="г. Вологда" /><option value="г. Орёл" /><option value="г. Владимир" /><option value="г. Мурманск" /><option value="г. Череповец" /><option value="г. Тамбов" /><option value="г. Петрозаводск" /><option value="г. Кострома" /><option value="г. Новороссийск" /><option value="г. Таганрог" /><option value="г. Сыктывкар" /><option value="г. Комсомольск-на-Амуре" /><option value="г. Нальчик" /><option value="г. Йошкар-Ола" /><option value="г. Грозный" /><option value="г. Дзержинск" /><option value="г. Шахты" /><option value="г. Братск" /><option value="г. Псков" /><option value="г. Ангарск" /><option value="г. Нижневартовск" /><option value="г. Бийск" /><option value="г. Курган" /><option value="г. Прокопьевск" /><option value="г. Рыбинск" /><option value="г. Севастополь" /><option value="г. Симферополь" /><option value="г. Краснодарский край" /><option value="г. Ленинградская область" /><option value="г. Московская область" /><option value="Республика Татарстан" /><option value="Республика Башкортостан" /><option value="Краснодарский край" /><option value="Ставропольский край" /><option value="Республика Крым" />
                            </datalist>
                          </div>
                        </div>
                        {/* Данные кассы — внутри контактов */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">Модель кассы <span className="text-slate-400 font-normal">(указан на самой кассе и в любом кассовом чеке)</span></Label>
                            <Input value={clientData.kkmModel} onChange={(e) => setClientData({...clientData, kkmModel: e.target.value})} className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm">Заводской номер</Label>
                            <Input value={clientData.kkmNumber} onChange={(e) => setClientData({...clientData, kkmNumber: e.target.value})} className="mt-1" />
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
                                <Input type="tel" value={clientData.evotorLogin} onChange={(e) => setClientData({...clientData, evotorLogin: e.target.value})} className="mt-1" />
                              </div>
                              <div>
                                <Label className="text-sm">Пароль</Label>
                                <Input type="password" value={clientData.evotorPassword} onChange={(e) => setClientData({...clientData, evotorPassword: e.target.value})} className="mt-1" />
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 bg-[#e8a817]/10 border border-[#e8a817]/30 rounded-lg">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg shrink-0 flex items-center justify-center bg-[#1e3a5f]/10">
                                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" />
                              </div>
                              <Checkbox id="evotor_restore_r" checked={evotorRestore} onCheckedChange={(c) => setEvotorRestore(c as boolean)} className="w-5 h-5 shrink-0" />
                              <Label htmlFor="evotor_restore_r" className="cursor-pointer text-xs text-[#1e3a5f]">Нет данных ЛК — помощь с восстановлением <span className="font-semibold">500 руб.</span></Label>
                            </div>
                          </div>
                        )}
                        <div>
                          <Label className="text-sm">Примечания</Label>
                          <Input value={clientData.comment} onChange={(e) => setClientData({...clientData, comment: e.target.value})} placeholder="Дополнительная информация" className="mt-1" />
                        </div>
                        <p className="text-xs text-red-500 font-medium">* Название, телефон и ИНН обязательны</p>
                      </CardContent>
                    </Card>

                    {/* Кнопка Готово — под контактами в центре */}
                    <Button className="w-full bg-[#e8a817] hover:bg-[#d49a12] py-5 sm:py-6 text-lg sm:text-xl font-bold" size="lg" disabled={!clientData.name.trim() || !clientData.phone.trim() || !clientData.inn.trim()} onClick={async () => {
                      const orderNum = Date.now().toString().slice(-6)
                      const orderDate = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      try {
                        const engineerHtml = generateOrderHtml({
                          effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc,
                          step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration,
                          includeChecklist: true
                        })
                        const clientHtml = generateOrderHtml({
                          effectiveKkmInfo, kkmCondition, kkmType, clientData, totalCalc,
                          step2Selections, step3Selections, scannerChecked, fnChecked, productCardCount, serviceContractChecked, evotorRestore, sigmaHelpChecked, unsureFnsRegistration,
                          includeChecklist: false
                        })
                        const subject = `Заказ-наряд №${orderNum} от ${orderDate} — ${clientData.name}`
                        // Письмо инженерам — push@ (с чеклистом)
                        fetch('/api/send-order', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ to: 'push@tellur.spb.ru', subject, html: engineerHtml, replyTo: clientData.email || undefined })
                        })
                        // Письмо менеджеру — janicacid@ (с чеклистом)
                        fetch('/api/send-order', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ to: 'janicacid@gmail.com', subject, html: engineerHtml, replyTo: clientData.email || undefined })
                        })
                        // Письмо клиенту (без чеклиста)
                        if (clientData.email) {
                          fetch('/api/send-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ to: clientData.email, subject, html: clientHtml })
                          })
                        }
                      } catch { /* silent */ }
                      setIsDone(true); setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
                    }}>
                      <CheckCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Готово
                    </Button>
                    {kkmType === 'atol' && effectiveKkm !== 'sigma' && (
                      <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                    <Button variant="outline" className="w-full text-sm" onClick={() => {
                      setStep2Selections([]); setStep3Selections([]); setScannerChecked(false); setProductCardCount(0); setTrainingHours(1); setFirmwareChecked(false); setLicenseChecked(false); setEvotorRestore(false); setSigmaHelpChecked(false); setOfdChecked(false); setServiceContractChecked(false); setServiceContractPeriod('month'); setFnChecked(false); setCurrentStep(1); setIsDone(false); window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}>Сбросить всё</Button>

                  {/* ИТОГО */}
                  <Card className="border-[#1e3a5f]/20 bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-[#1e3a5f] text-sm sm:text-base"><CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />Расчёт стоимости</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {totalCalc.items.length === 0 ? (
                          <p className="text-sm text-slate-500 italic">Отметьте услуги</p>
                        ) : totalCalc.items.map((item, idx) => (
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
                        {effectiveKkm === 'sigma' || kkmType === 'evotor'
                          ? 'ТС ПИоТ — отдельно. Подписка на смарт-терминале — у производителя'
                          : 'ТС ПИоТ — оплачивается отдельно'
                        }
                      </p>
                    </CardContent>
                  </Card>

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
                onClose={() => { setCurrentStep(1); setIsDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
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

        <footer className="bg-white border-t border-[#1e3a5f]/10 mt-auto mb-2 pb-2">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
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
