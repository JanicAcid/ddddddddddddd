// ============================================================================
// УСЛУГИ ШАГ 2
// ============================================================================

export interface StepService {
  id: string
  name: string
  description: string
  price: number
  hintKey?: string
  icon?: string
}

export const step2Services: StepService[] = [
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
