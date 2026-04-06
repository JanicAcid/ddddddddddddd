// ============================================================================
// УСЛУГИ ШАГ 3
// ============================================================================

import type { StepService } from './services-step2'

export const step3Services: StepService[] = [
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
  // fn_replacement убран — ФНС-зависимая услуга, регистрация/перерегистрация только на шаге 2
]
