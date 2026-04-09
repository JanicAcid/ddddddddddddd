import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Калькуляторы стоимости — Теллур-Интех',
  description: 'Бесплатные онлайн-калькуляторы: маркировка товаров, интеграция 1С, расчёт ОФД. Точная стоимость за 2 минуты.',
  keywords: ['калькулятор маркировки', 'калькулятор 1с', 'калькулятор офд', 'расчёт стоимости маркировки'],
  alternates: { canonical: 'https://tellurmarkirovka.vercel.app/kalkulyatory' },
  openGraph: {
    title: 'Калькуляторы стоимости — Теллур-Интех',
    description: 'Бесплатные онлайн-калькуляторы для расчёта стоимости услуг.',
    url: 'https://tellurmarkirovka.vercel.app/kalkulyatory',
    siteName: 'Теллур-Интех',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function KalkulyatoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
