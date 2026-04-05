import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

const SITE_URL = 'https://tellurmarkirovka.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Калькулятор маркировки в Санкт-Петербурге | Теллур-Интех — сервисный центр кассового оборудования',
  description: 'Бесплатный калькулятор стоимости подключения маркировки в Санкт-Петербурге и Ленинградской области. Пушкино, Гатчина, юг СПб. Меркурий, Атол, Сигма, Штрих-М, Пионер, Эвотор. Честный ЗНАК, ЭДО, ЭЦП, ТС ПИоТ, ФНС, ОФД. Расчёт за 2 минуты.',
  keywords: ['маркировка Санкт-Петербург', 'калькулятор маркировки', 'подключение маркировки', 'Честный ЗНАК', 'ТС ПИоТ', 'ККТ', 'касса', 'ЭЦП', 'ЭДО', 'регистрация ККТ', 'Меркурий', 'Атол', 'Эвотор', 'Штрих-М', 'Пионер', 'Сигма', 'кассовое оборудование Пушкино', 'сервисный центр касс Гатчина', 'маркировка Ленинградская область', 'настройка кассы маркировка', 'ОФД подключение', 'ФН замена', 'ФФД 1.2', 'ЕГАИС', 'Data Matrix'],
  authors: [{ name: 'Теллур-Интех' }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Калькулятор маркировки | Теллур-Интех — Санкт-Петербург',
    description: 'Рассчитайте стоимость подключения маркировки для кассы: Меркурий, Атол, Эвотор, Штрих-М, Пионер, Сигма. Честный ЗНАК, ЭДО, ТС ПИоТ. Бесплатный расчёт за 2 минуты.',
    url: SITE_URL,
    siteName: 'Теллур-Интех',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Калькулятор маркировки — Теллур-Интех, Санкт-Петербург',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Калькулятор маркировки | Теллур-Интех',
    description: 'Бесплатный расчёт стоимости подключения маркировки в СПб и ЛО. Меркурий, Атол, Эвотор, Штрих-М, Пионер, Сигма.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    yandex: 'verify',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className="overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
