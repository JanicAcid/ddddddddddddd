import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Калькуляторы — Инструменты для маркировки | Теллур-Интех',
  description: 'Онлайн-калькуляторы стоимости подключения маркировки товаров и настройки кассового оборудования.',
  alternates: {
    canonical: 'https://tellurmarkirovka.vercel.app/kalkulyatory',
  },
}

export default function KalkulyatoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
