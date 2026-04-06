# Калькулятор маркировки — ООО «Теллур-Интех»

## Репозиторий
- **Путь**: `/home/z/my-project/download/tellur-push`
- **Git submodule** — ВСЕ git-команды через `git -C /home/z/my-project/download/tellur-push`
- **Branch**: `main`
- **Deploy**: `https://tellurmarkirovka.vercel.app/`
- **Стек**: Next.js 15 + React 19 + Tailwind CSS 4 + shadcn/ui + Lucide React
- **Vercel**: только один проект, новых не создавать

---

## Что сделано

### SEO
- Контент всегда в HTML (схлопнут через CSS `max-h-0` + transition, не conditional render)
- 7 JSON-LD схем: Organization, WebSite, LocalBusiness, WebApplication, FAQPage, BreadcrumbList, Service
- Расширенный SEO-текст (3x), блок преимуществ, 6 описаний услуг, 20+ городов, 8 FAQ
- 41 ключевик в meta
- noscript fallback
- robots.txt (статика в `public/robots.txt`) с Clean-param для Яндекса
- sitemap.ts — динамическая генерация
- OG-изображение `public/og-image.png` (1200x630)

### Б/у кассы
- Перерегистрация убрана полностью (из доступных и недоступных)
- ОФД только «Такском» для б/у
- Блок «Недоступные для выбора» убран отовсюду

### UI
- «Контактные данные» — заголовок `text-lg sm:text-xl font-extrabold`
- Лого брендов: нормализованы к 3.5:1 (ImageMagick padding), `fill` + `object-contain` в `h-11 sm:h-14`
- Размер шрифта брендов: `text-sm` везде (StepBrands, StepSummary, DoneScreen)
- Меркурий лого: извлечён из референс-картинки, цвет #405776, чистые края (upscale 4x NEAREST → LANCZOS → бинаризация альфы)

### Почта (Resend)
- API-ключ через `process.env.RESEND_API_KEY` (не хардкод)
- Email получателя через `process.env.NEXT_PUBLIC_ORDER_EMAIL` (fallback: push@tellur.spb.ru)
- Sender домен через `process.env.RESEND_FROM_EMAIL` (fallback: onboarding@resend.dev)
- Автоотправка заказ-наряда при появлении экрана DoneScreen

### Баг-фиксы (2026-04-05)
- Duplicate `id="contacts-section"` — SEO-блок переименован в `id="seo-section"`
- og-image.png — сгенерирован и добавлен
- `useMemo` → `useEffect` для side effects (сброс состояния кассы)
- API-ключ Resend убран из исходника
- Email получателя вынесен в env
- Sender домен Resend вынесен в env

---

## Нерешённое
1. **Тряска на странице 4 (мобильная)** — 3 CSS-попытки в прошлой сессии, все отвергнуты
2. **SEO вручную**:
   - заменить `yandex: 'verify'` на реальный код верификации
   - добавить сайт в Yandex.Webmaster и Google Search Console
3. **Resend sender домен** — нужно подтвердить домен в Resend и заменить env
4. **Resend API-ключ** — добавить `RESEND_API_KEY` в Vercel Environment Variables

---

## Ключевые файлы

### Компоненты
| Файл | Назначение |
|------|-----------|
| `src/app/page.tsx` | Главная страница калькулятора (все шаги, state, валидация) |
| `src/app/layout.tsx` | Мета-теги (41 ключевик), noscript, OG/Twitter cards, Yandex verify |
| `src/app/sitemap.ts` | Sitemap (динамическая генерация) |
| `src/app/globals.css` | Глобальные стили, Tailwind |
| `src/app/api/send-order/route.ts` | API endpoint отправки заказа на email (Resend) |
| `src/components/calculator/StepBrands.tsx` | Шаг 1: выбор кассы, бренды, лого, сигма/эвотор, прошивка/лицензия |
| `src/components/calculator/StepServices.tsx` | Шаг 2: услуги, ОФД, фильтр б/у, подакцизные |
| `src/components/calculator/StepExtra.tsx` | Шаг 3: доп. услуги, ФН, сканер, карточки товаров, контактные данные |
| `src/components/calculator/StepSummary.tsx` | Итоговая сводка + контакты |
| `src/components/calculator/DoneScreen.tsx` | Экран завершения, заказ-наряд, печать, автоотправка email |
| `src/components/calculator/HintButton.tsx` | Кнопка подсказки |
| `src/components/calculator/types.ts` | Shared types |
| `src/components/SeoContent.tsx` | SEO-блок обёртка (max-h collapse), id="seo-section" |
| `src/components/SeoContentInner.tsx` | SEO-текст (преимущества, FAQ, города, филиалы) |
| `src/components/JsonLd.tsx` | 7 JSON-LD схем |

### Конфиг
| Файл | Назначение |
|------|-----------|
| `src/config/brands.ts` | Бренды → цветовые схемы (KKM_BRANDS) |
| `src/config/services.ts` | Типы касс (kkmTypes), цены сканеров, прошивки/лицензии, тариф Сигма |
| `src/config/ofd.ts` | ОФД провайдеры (Такском, Платформа, ПЕРВЫЙ, СБИС ТЕНЗОР) |
| `src/config/services-step2.ts` | Услуги шага 2 (перерегистрация, полная/частичная настройка) |
| `src/config/services-step3.ts` | Услуги шага 3 (ЭЦП, обучение, замена ФН) |
| `src/config/hints.ts` | Подсказки ко всем услугам (what/why/when/example) |
| `src/config/contacts.ts` | Телефоны, филиалы (СПб, Пушкин, Гатчина) |
| `src/config/product-cards.ts` | Цены карточек товаров (80/60/40 руб.) |

### UI компоненты (shadcn)
| Файл | Назначение |
|------|-----------|
| `src/components/ui/button.tsx` | Кнопка |
| `src/components/ui/card.tsx` | Карточка |
| `src/components/ui/checkbox.tsx` | Чекбокс (34px, radius 8px) |
| `src/components/ui/input.tsx` | Текстовый ввод |
| `src/components/ui/label.tsx` | Лейбл |
| `src/components/ui/badge.tsx` | Бейдж |
| `src/components/ui/radio-group.tsx` | Радиокнопки |
| `src/components/ui/separator.tsx` | Разделитель |

### Ассеты
| Файл | Назначение |
|------|-----------|
| `public/og-image.png` | OG-изображение для соцсетей (1200x630) |
| `public/logo.webp` | Логотип Теллур-Интех |
| `public/brands/mercury.webp` | Меркурий — цвет #405776, извлечён из референса |
| `public/brands/atol.webp` | Атол |
| `public/brands/shuttle.webp` | Штрих-М |
| `public/brands/pioneer.webp` | Пионер |
| `public/brands/aqsi.webp` | AQSI |
| `public/brands/evotor.webp` | Эвотор |
| `public/services/*.webp` | Иконки услуг |
| `public/soglasiye-atol.pdf` | Согласие для партнёрского кабинета Атол |
| `public/favicon.ico` | Favicon |
| `public/favicon-16x16.png` | Favicon 16px |
| `public/favicon-32x32.png` | Favicon 32px |
| `public/apple-touch-icon.png` | Apple touch icon |

---

## Важные технические детали

### Архитектура UI
- 4 шага: Касса → Услуги → Дополнительно → Готово
- Card: `gap-3 rounded-xl border py-3`, CardContent: `px-3 py-2`
- Чекбоксы: CSS 34px, border-radius 8px
- Кастомное событие `scroll-to-contacts` для scroll к контактам из header
- Лого брендов: `<Image src={/brands/${key}.webp} fill className="object-contain opacity-85" quality={100} unoptimized>`
- Кнопка «Контакты» в header → dispatch `scroll-to-contacts` → скролл к `#contacts-section` (StepExtra)

### Состояние кассы
- `new` — новая, обязательны ФНС-регистрация и ОФД
- `used` — б/у, ОФД только Такском, возможны прошивка/лицензия
- `old` — текущая, доступна «частичная настройка» и «уже работает с маркировкой»

### Цвета
- Основной: `#1e3a5f` (тёмно-синий)
- Акцент: `#e8a817` (жёлтый)
- Меркурий бренд: `#405776` (из референс-картинки)

### Env-переменные (Vercel)
| Переменная | Назначение |
|-----------|-----------|
| `RESEND_API_KEY` | API-ключ Resend для отправки email |
| `NEXT_PUBLIC_ORDER_EMAIL` | Email получателя заказов (fallback: push@tellur.spb.ru) |
| `RESEND_FROM_EMAIL` | Sender домен Resend (fallback: onboarding@resend.dev) |

---

## Предыдущие попытки (отвергнутые)

### Тряска на странице 4 (мобильная)
- Попытка 1: `overflow-y: auto` на контейнере — нет
- Попытка 2: `position: fixed` для заголовка — нет
- Попытка 3: `scroll-behavior: smooth` — нет
- Причина: видимо, клавиатура на мобильном выталкивает контент

### Меркурий лого
- ImageMagick `convert -fuzz 10% -fill "#1e3a5f" -opaque "white"` — артефакты
- ImageMagick `convert -fuzz 10% -fill "#1e3a5f" -opaque "white"` второй раз — тоже
- Нужен был цвет #405776 (не #1e3a5f) — уточнено по референсу
