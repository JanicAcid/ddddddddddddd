import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Калькулятор маркировки | Теллур-Интех",
  description: "Рассчитайте стоимость подключения маркировки для вашего бизнеса. Меркурий, Атол, Сигма, Штрих-М, Пионер, AQSI, Эвотор. Регистрация в Честном ЗНАКе, ЭДО, ЭЦП, настройка кассы.",
  keywords: ["маркировка", "Честный ЗНАК", "ККМ", "касса", "ЭЦП", "ЭДО", "ТС ПИоТ", "регистрация ККТ", "Меркурий", "Атол", "Эвотор", "Штрих-М", "Пионер", "калькулятор маркировки"],
  authors: [{ name: "Теллур-Интех" }],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
        {children}
      </body>
    </html>
  );
}
