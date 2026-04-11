import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Калькулятор маркировки — Рассчитайте стоимость настройки | Теллур-Интех',
  description: 'Бесплатный онлайн-калькулятор стоимости подключения маркировки. Расчёт за 2 минуты для любой кассы: Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI.',
  alternates: {
    canonical: 'https://tellurmarkirovka.vercel.app/kalkulyatory/markirovka',
  },
  openGraph: {
    title: 'Калькулятор маркировки — Теллур-Интех',
    description: 'Бесплатный онлайн-калькулятор стоимости подключения маркировки. Расчёт за 2 минуты.',
    url: 'https://tellurmarkirovka.vercel.app/kalkulyatory/markirovka',
    type: 'website',
  },
}

export default function CalcLayout({ children }: { children: React.ReactNode }) {
  return children
}
