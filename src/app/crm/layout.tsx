import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CRM — Управление заявками | Теллур-Интех',
  description: 'Панель управления заявками CRM: просмотр, фильтрация и статистика заявок с сайта.',
  robots: { index: false, follow: false },
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return children
}
