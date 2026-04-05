// ============================================================================
// SEO ТЕКСТОВЫЙ БЛОК — рендерится на сервере (NO 'use client')
// Содержит ключевые слова для поисковых роботов и полезную информацию для людей
// ============================================================================

import { PHONES } from '@/config/contacts'
import { BRANCHES } from '@/config/contacts'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'

export function SeoContentInner() {
  return (
    <section className="mb-4 sm:mb-6 space-y-4" aria-label="Информация о компании">
      {/* ===== О компании ===== */}
      <div className="bg-white rounded-xl border border-[#1e3a5f]/10 p-4 sm:p-5">
        <p className="text-sm text-slate-600 leading-relaxed mb-2">
          <strong className="text-slate-700">Компания ТЕЛЛУР</strong> работает на&nbsp;рынке торгового, офисного и&nbsp;банковского оборудования с&nbsp;1995&nbsp;года. Осуществляем продажу, установку и&nbsp;обслуживание кассового оборудования. Основная деятельность — предоставление комплексных сервисных услуг: ремонт, техническая поддержка и&nbsp;полное решение технических задач «из&nbsp;одних рук». ООО «Теллур-Интех» — сервисный центр кассового оборудования с&nbsp;офисами в&nbsp;Санкт-Петербурге, Пушкине и&nbsp;Гатчине.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mb-2">
          Мы&nbsp;специализируемся на&nbsp;подключении маркировки для малого и&nbsp;среднего бизнеса: от&nbsp;продуктовых магазинов и&nbsp;аптек до&nbsp;розничных точек продаж сигарет, обуви, одежды, воды и&nbsp;других маркированных товаров. Обслуживаем все основные бренды кассового оборудования: <strong>Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI</strong>.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mb-2">
          Используйте наш <strong>бесплатный калькулятор маркировки</strong> для расчёта стоимости подключения. Укажите модель кассы, её&nbsp;состояние и&nbsp;необходимые услуги — и&nbsp;получите точную сумму за&nbsp;2&nbsp;минуты. Никаких скрытых платежей: вы&nbsp;видите полную смету до&nbsp;обращения к&nbsp;менеджеру.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Работаем по&nbsp;всей Ленинградской области: Пушкин, Гатчина, Павловск, Колпино, Красное Село, Ломоносов, Петергоф, Всеволожск, Выборг, Тосно, Кировск и&nbsp;другие города. Возможен выезд инженера на&nbsp;территорию клиента.
        </p>
      </div>

      {/* ===== Филиалы ===== */}
      <div className="bg-white rounded-xl border border-[#1e3a5f]/10 p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f] mb-3">
          Наши офисы
        </h3>
        <div className="space-y-4">
          {BRANCHES.map((branch) => (
            <div key={branch.name} className="p-3 bg-[#1e3a5f]/[0.03] rounded-lg border border-[#1e3a5f]/10">
              <p className="font-bold text-[#1e3a5f] text-sm mb-2">&laquo;{branch.name}&raquo;</p>
              <div className="space-y-1.5 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#e8a817] shrink-0 mt-0.5" />
                  <span className="leading-snug">{branch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#e8a817] shrink-0" />
                  <a href={`mailto:${branch.email}`} className="text-[#1e3a5f] hover:underline">{branch.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#e8a817] shrink-0" />
                  <span>{branch.phones.map((phone, i) => {
                    const href = 'tel:+7' + phone.replace(/[^0-9]/g, '')
                    return (
                      <a key={i} href={href} className="text-[#1e3a5f] hover:underline">{phone}</a>
                    )
                  }).reduce((prev, cur, i) => i > 0 ? <>{prev}, {cur}</> : prev, null)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#e8a817] shrink-0" />
                  <span>{branch.schedule}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Городские страницы-анкоры ===== */}
      <div className="bg-white rounded-xl border border-[#1e3a5f]/10 p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f] mb-3">
          Наши услуги в&nbsp;Вашем городе
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {[
            { city: 'Санкт-Петербург', query: 'маркировка в Санкт-Петербурге' },
            { city: 'Пушкин', query: 'подключение маркировки Пушкин' },
            { city: 'Гатчина', query: 'кассовое оборудование Гатчина' },
            { city: 'Павловск', query: 'обслуживание касс Павловск' },
            { city: 'Колпино', query: 'маркировка Колпино' },
            { city: 'Красное Село', query: 'настройка кассы Красное Село' },
            { city: 'Ломоносов', query: 'ККТ Ломоносов' },
            { city: 'Всеволожск', query: 'маркировка Всеволожск' },
            { city: 'Тосно', query: 'обслуживание касс Тосно' },
            { city: 'Петергоф', query: 'кассовое оборудование Петергоф' },
            { city: 'Выборг', query: 'маркировка Выборг' },
            { city: 'Кировск', query: 'ККТ Кировск ЛО' },
          ].map(({ city }) => (
            <a
              key={city}
              href={`tel:${PHONES[0].href.replace('tel:', '')}`}
              className="flex items-center gap-1.5 p-2 rounded-lg bg-[#1e3a5f]/5 hover:bg-[#1e3a5f]/10 transition-colors text-slate-700 hover:text-[#1e3a5f]"
            >
              <svg className="w-3.5 h-3.5 text-[#e8a817] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {city}
            </a>
          ))}
        </div>
      </div>

      {/* ===== FAQ ===== */}
      <div className="bg-white rounded-xl border border-[#1e3a5f]/10 p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f] mb-3">
          Часто задаваемые вопросы о&nbsp;маркировке
        </h3>
        <div className="space-y-4 text-sm text-slate-600">
          <div>
            <h4 className="font-semibold text-[#1e3a5f] mb-1">Что такое маркировка товаров?</h4>
            <p className="leading-relaxed">
              Маркировка — это система прослеживаемости товаров, при которой каждая единица продукции получает уникальный код Data&nbsp;Matrix. Код наносится на упаковку производителем и&nbsp;заносится в&nbsp;государственную систему «Честный ЗНАК». При продаже кассир сканирует код, и&nbsp;информация о&nbsp;продаже передаётся в&nbsp;ФНС. Маркировка обязательна для сигарет, обуви, одежды, воды, пива и&nbsp;других категорий товаров. С&nbsp;2025 года перечень маркируемых товаров расширяется.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1e3a5f] mb-1">Что нужно для подключения маркировки?</h4>
            <p className="leading-relaxed">
              Для подключения маркировки потребуется: кассовое оборудование с&nbsp;поддержкой ФФД&nbsp;1.2 (Меркурий, Атол, Эвотор, Штрих-М и&nbsp;др.), электронная цифровая подпись (ЭЦП) на&nbsp;Рутокене или JaCarta, учётная запись в&nbsp;системе «Честный ЗНАК», подключённый оператор фискальных данных (ОФД), лицензия ТС&nbsp;ПИоТ, а&nbsp;также настроенный электронный документооборот (ЭДО) для приёмки накладных от&nbsp;поставщиков. Наш калькулятор поможет рассчитать точную стоимость всех услуг.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1e3a5f] mb-1">Как долго длится настройка маркировки?</h4>
            <p className="leading-relaxed">
              Полная настройка маркировки под ключ занимает от&nbsp;1 до&nbsp;3&nbsp;рабочих дней в&nbsp;зависимости от&nbsp;сложности. Регистрация в&nbsp;ФНС занимает 1-2&nbsp;дня. Настройка всех систем (ЭДО, Честный ЗНАК, ТС&nbsp;ПИоТ, касса) — 1&nbsp;день при наличии ЭЦП и&nbsp;доступов. Для б/у&nbsp;касс может потребоваться обновление прошивки и&nbsp;оформление лицензии — это добавляет ещё 1&nbsp;день. Мы&nbsp;работаем быстро и&nbsp;гарантируем результат.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1e3a5f] mb-1">Какие кассы подходят для маркировки?</h4>
            <p className="leading-relaxed">
              Для маркировки подойдет любая касса, поддерживающая формат фискальных документов ФФД&nbsp;1.2. Это все современные модели Меркурий, Атол (включая Сигма), Эвотор, Штрих-М, Пионер, AQSI. Если у&nbsp;Вас старая касса — мы&nbsp;обновим прошивку и&nbsp;при необходимости заменим фискальный накопитель. Для старых касс, не&nbsp;поддерживающих ФФД&nbsp;1.2, рекомендуем замену на&nbsp;современную модель.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1e3a5f] mb-1">Чем отличаются услуги для новой и&nbsp;старой кассы?</h4>
            <p className="leading-relaxed">
              Для новой кассы требуется регистрация ККТ в&nbsp;ФНС, подключение ОФД, установка фискального накопителя и&nbsp;полная настройка маркировки с&nbsp;нуля. Для действующей кассы, которая уже работает — частичная настройка: добавление признаков маркировки, перерегистрация в&nbsp;ФНС и&nbsp;настройка связей с&nbsp;Честным ЗНАКом. Для б/у&nbsp;касс дополнительно может понадобиться обновление прошивки, оформление лицензии и&nbsp;замена ФН. Укажите состояние кассы в&nbsp;калькуляторе для точного расчёта.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
