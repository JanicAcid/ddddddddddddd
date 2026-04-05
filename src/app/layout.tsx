import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { YandexMetrika } from "@/components/YandexMetrika";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const SITE_URL = 'https://tellurmarkirovka.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Подключение маркировки в Санкт-Петербурге и ЛО | Калькулятор стоимости — Теллур-Интех',
  description: 'Подключение маркировки товаров под ключ в Санкт-Петербурге и Ленинградской области. Бесплатный онлайн-калькулятор стоимости: Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI. Честный ЗНАК, ЭДО, ТС ПИоТ, ФНС, ОФД. Расчёт за 2 минуты. Офисы: СПб, Пушкин, Гатчина. Удалённая настройка.',
  keywords: ['маркировка Санкт-Петербург', 'калькулятор маркировки', 'подключение маркировки', 'подключение маркировки под ключ', 'маркировка под ключ СПб', 'Честный ЗНАК', 'ТС ПИоТ', 'ККТ', 'касса', 'ЭЦП', 'ЭДО', 'регистрация ККТ', 'перерегистрация ККТ', 'Меркурий', 'Атол', 'Эвотор', 'Штрих-М', 'Пионер', 'Сигма', 'AQSI', 'кассовое оборудование Пушкино', 'сервисный центр касс Гатчина', 'маркировка Ленинградская область', 'маркировка Колпино', 'маркировка Всеволожск', 'настройка кассы маркировка', 'ОФД подключение', 'ОФД Такском', 'ФН замена', 'фискальный накопитель', 'ФФД 1.2', 'Data Matrix', 'маркировка сигарет', 'маркировка обуви', 'маркировка одежды', 'маркировка молочной продукции', 'маркировка воды', 'штраф за маркировку', 'сервисный центр кассового оборудования', 'ремонт касс СПб', 'настройка ЭДО', 'Контур Диадок', 'СБИС', 'удалённая настройка маркировки'],
  authors: [{ name: 'Теллур-Интех' }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Подключение маркировки в СПб и ЛО | Калькулятор — Теллур-Интех',
    description: 'Рассчитайте стоимость подключения маркировки: Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI. Честный ЗНАК, ЭДО, ТС ПИоТ, ФНС. Офисы: СПб, Пушкин, Гатчина. Расчёт за 2 минуты.',
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
    title: 'Подключение маркировки в СПб и ЛО | Калькулятор — Теллур-Интех',
    description: 'Подключение маркировки товаров под ключ. Меркурий, Атол, Эвотор, Сигма, Штрих-М, Пионер, AQSI. Честный ЗНАК, ЭДО, ТС ПИоТ. Офисы: СПб, Пушкин, Гатчина.',
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
    yandex: '108406091',
    google: 'google6d0854c5f9ec794a.html',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <JsonLd />
        <YandexMetrika />
        {children}
        <noscript>
          <div style={{ padding: '16px', maxWidth: '768px', margin: '0 auto', fontFamily: 'sans-serif', fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '12px' }}>
              Калькулятор маркировки — Теллур-Интех
            </h1>
            <p>Бесплатный онлайн-калькулятор стоимости подключения маркировки товаров в Санкт-Петербурге и Ленинградской области. Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI. Честный ЗНАК, ЭДО, ТС ПИоТ, ФНС, ОФД.</p>
            <p>ООО «Теллур-Интех» — сервисный центр кассового оборудования с 1995 года. Офисы: Санкт-Петербург (ул. Заслонова 32-34), Пушкин (Октябрьский бульвар 50/30), Гатчина (ул. Хохлова 6). Тел: +7 (812) 321-06-06, +7 (812) 465-94-57, +7 (813) 714-08-95.</p>
            <p>Для расчёта стоимости включите JavaScript в настройках браузера.</p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
