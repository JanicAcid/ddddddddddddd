import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Диагностика маркировки — Проверьте настройку кассы | Теллур-Интех',
  description: 'Бесплатная диагностика настройки маркировки: проверка оборудования, фискальных данных, онлайн-сервисов, документооборота и знаний. 8 вопросов за 2 минуты.',
  alternates: {
    canonical: 'https://tellurmarkirovka.vercel.app/diagnostika',
  },
  openGraph: {
    title: 'Диагностика маркировки — Теллур-Интех',
    description: 'Бесплатная диагностика настройки маркировки: проверка оборудования, фискальных данных, онлайн-сервисов, документооборота и знаний.',
    url: 'https://tellurmarkirovka.vercel.app/diagnostika',
    type: 'website',
  },
}

export default function DiagnostikaLayout({ children }: { children: React.ReactNode }) {
  return children
}
