import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Инструкции по настройке маркировки и касс | Теллур-Интех',
  description: 'Пошаговые инструкции по подключению маркировки, настройке кассы, Честного ЗНАК, ЭДО и ТС ПИоТ. Обзоры моделей кассового оборудования.',
  alternates: {
    canonical: 'https://tellurmarkirovka.vercel.app/instructions',
  },
  openGraph: {
    title: 'Инструкции по настройке маркировки — Теллур-Интех',
    description: 'Пошаговые инструкции по подключению маркировки, настройке кассы и работы с Честным ЗНАКом.',
    url: 'https://tellurmarkirovka.vercel.app/instructions',
    type: 'website',
  },
}

export default function InstructionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
