# PROJECT_GUIDE.md — Руководство для AI-агентов

> **ОБЯЗАТЕЛЬНО ПРОЧИТАЙ ЭТОТ ФАЙЛ ПЕРЕД ЛЮБЫМИ ДЕЙСТВИЯМИ С ПРОЕКТОМ**

---

## 1. Что это за проект

Сайт ООО **«Теллур-Интех»** — Центр технического обслуживания кассового оборудования (СПб, с 1995 года).
Основная функция — **онлайн-калькулятор стоимости подключения маркировки товаров** (Честный ЗНАК, ЭДО, ТС ПИоТ, ФНС, ОФД).

- **Продакшен URL**: https://tellurmarkirovka.vercel.app/
- **GitHub (рабочий)**: `JanicAcid/ddddddddddddd` (публичный)
- **GitHub (архив)**: `JanicAcid/tellur-markirovka-backup` (приватный, НЕ РЕДАКТИРОВАТЬ)
- **Деплой**: Vercel auto-deploy из `origin/main` → `tellurmarkirovka.vercel.app`
- **Телефон**: +7 (812) 465-94-57 (основной)
- **Email**: push@tellur.spb.ru

---

## 2. Технологический стек

| Технология | Версия |
|---|---|
| Next.js (App Router) | 15.5.x |
| React | 19.x |
| TypeScript | 5.x |
| Tailwind CSS | 4.x (via @tailwindcss/postcss) |
| shadcn/ui | Radix UI primitives |
| Аналитика | Yandex Metrika (ID: 108406091) |

---

## 3. Структура проекта

```
src/
├── app/
│   ├── page.tsx                          # Главная — калькулятор маркировки
│   ├── layout.tsx                        # Root layout (мета, шрифты, виджеты)
│   ├── globals.css                       # Глобальные стили Tailwind
│   ├── sitemap.ts                        # Динамический sitemap.xml
│   │
│   ├── nastroyka-kassy-markirovka/       # SEO-лендинг: настройка кассы
│   │   └── page.tsx
│   ├── podklyuchenie-chestnyy-znak/      # SEO-лендинг: подключение Честный ЗНАК
│   │   └── page.tsx
│   ├── integraciya-1c/                   # SEO-лендинг: интеграция 1С
│   │   └── page.tsx
│   │
│   ├── instructions/                     # Инструкции (динамические)
│   │   ├── page.tsx                      # Список инструкций
│   │   ├── layout.tsx                    # Layout инструкций
│   │   └── [slug]/page.tsx               # Отдельная инструкция
│   │
│   ├── faq/page.tsx                      # FAQ
│   ├── services/page.tsx                 # Услуги
│   ├── about/page.tsx                    # О компании
│   ├── contacts/page.tsx                 # Контакты + карта филиалов
│   │
│   └── api/
│       ├── chat/send/route.ts            # Отправка сообщения в Telegram
│       ├── chat/poll/route.ts            # Long-poll чата
│       ├── chat/file/[fileId]/route.ts   # Файлы чата
│       ├── send-order/route.ts           # Отправка заказа (Google Sheets + email)
│       └── log-order/route.ts            # Логирование заказа
│
├── components/
│   ├── Navbar.tsx                        # Навигация (grid 3-колоночный layout)
│   ├── SiteFooter.tsx                    # Подвал сайта
│   ├── ChatWidget.tsx                    # Telegram чат-виджет
│   ├── FaqWidget.tsx                     # FAQ плавающий виджет
│   ├── ScrollToTopButton.tsx             # Кнопка наверх
│   ├── YandexMetrika.tsx                 # Счётчик Я.Метрики
│   ├── JsonLd.tsx                        # Структурированные данные (Organization + LocalBusiness)
│   ├── SeoContent.tsx                    # SEO-текстовый блок на главной
│   ├── SeoContentInner.tsx               # FAQ-аккордеон + филиалы на главной
│   │
│   ├── calculator/                       # Шаги калькулятора
│   │   ├── types.ts                      # Типы данных калькулятора
│   │   ├── StepBrands.tsx                # Шаг 1: выбор бренда кассы
│   │   ├── StepServices.tsx              # Шаг 2: выбор услуг
│   │   ├── StepExtra.tsx                 # Шаг 3: доп. услуги (ОФД, ТС ПИоТ)
│   │   ├── StepSummary.tsx               # Шаг 4: итог + форма заказа
│   │   ├── DoneScreen.tsx                # Экран завершения
│   │   └── HintButton.tsx                # Подсказки по услугам
│   │
│   ├── instructions/                     # Компоненты инструкций
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleJsonLd.tsx
│   │   └── TableOfContents.tsx
│   │
│   └── ui/                               # shadcn/ui компоненты
│       ├── badge.tsx, button.tsx, card.tsx, checkbox.tsx
│       ├── input.tsx, label.tsx, radio-group.tsx, separator.tsx
│
├── config/                               # КОНФИГУРАЦИЯ (важно!)
│   ├── telegram.ts                       # Токен бота и Chat ID (process.env только!)
│   ├── contacts.ts                       # Телефоны, филиалы, email
│   ├── services.ts                       # Услуги калькулятора (пошаговые)
│   ├── services-step2.ts                 # Услуги шага 2
│   ├── services-step3.ts                 # Услуги шага 3
│   ├── brands.ts                         # Бренды касс (Меркурий, Атол, и т.д.)
│   ├── ofd.ts                            # Провайдеры ОФД (ТАКСКОМ, Платформа, и т.д.)
│   ├── hints.ts                          # Подсказки к услугам
│   ├── articles.ts                       # Статьи-инструкции
│   ├── product-cards.ts                  # Карточки товаров
│   └── google-sheets.ts                  # Google Sheets логирование заказов
│
└── lib/
    ├── utils.ts                          # cn() утилита Tailwind
    └── phone.ts                          # Форматирование телефонов

public/
├── logo.webp, logo@2x.webp               # Логотип
├── og-image.png                          # Open Graph изображение
├── favicon.ico, favicon-*.png            # Фавиконки
├── apple-touch-icon.png
├── manifest.json                         # PWA манифест
├── robots.txt                            # Правила для поисковиков
├── google*.html, yandex_*.html           # Верификация поисковиков
├── chestnyznak.png                       # Логотип Честного ЗНАКа
├── engineer-bg.webp                      # Фон секции
├── soglasiye-atol.pdf                    # Согласие Атол
├── brands/*.webp                         # Логотипы брендов касс
├── services/*.webp                       # Иконки услуг
└── instructions/*.svg                    # SVG для инструкций
```

---

## 4. Переменные окружения (Vercel)

Эти переменные установлены **ТОЛЬКО в Vercel Environment Variables**. Нигде в коде нет fallback'ов.

| Переменная | Назначение |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен Telegram-бота |
| `OPERATOR_CHAT_ID` | Chat ID оператора для получения сообщений |
| `GOOGLE_SHEETS_ID` | ID Google Таблицы для заказов |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON-ключ сервисного аккаунта Google |
| `ORDER_EMAIL` | Email для отправки заказов (fallback) |

**КРИТИЧЕСКИЕ ПРАВИЛА БЕЗОПАСНОСТИ:**
- **НИКОГДА** не добавлять fallback'ы с реальными значениями в код
- **НИКОГДА** не коммитить `.env` файлы (в `.gitignore` есть `.env*`)
- **НИКОГДА** не использовать `NEXT_PUBLIC_` для секретов
- **НИКОГДА** не логировать токены, chat ID, или другие секреты

---

## 5. Калькулятор маркировки — логика

Калькулятор — 4-шаговый wizard:

1. **Шаг 1 — Бренд кассы**: Пользователь выбирает бренд (Меркурий, Атол, Сигма, Эвотор, Штрих-М, Пионер, AQSI). Каждый бренд имеет базовую цену.
2. **Шаг 2 — Услуги**: В зависимости от бренда показываются доступные услуги (настройка маркировки, перерегистрация ФНС, 2D-сканер, обновление прошивки, и т.д.). **Важно**: если выбрана «полная настройка маркировки» (`marking_setup`), опция «перерегистрация ФНС» (`fns_reregistration`) **скрывается** — она включена в стоимость.
3. **Шаг 3 — Доп. услуги**: ОФД (выбор провайдера + срок 15/36 мес), ТС ПИоТ, ЭЦП, обучение, договор обслуживания.
4. **Шаг 4 — Итого + заказ**: Суммарная стоимость + форма для отправки заказа через Telegram-чат или Google Sheets.

Цены хранятся в `src/config/services.ts`, `services-step2.ts`, `services-step3.ts`.
Подсказки — в `src/config/hints.ts`.

---

## 6. Telegram-чат виджет

Реализован через API routes (server-side):
- `/api/chat/send` — отправка сообщения от пользователя → Telegram Bot API
- `/api/chat/poll` — long-poll для получения ответа от оператора
- `/api/chat/file/[fileId]` — проксирование файлов из Telegram

Чат привязан к конкретному боту `@spbmarkirovka_bot`. Сообщения уходят в указанный `OPERATOR_CHAT_ID`.

---

## 7. SEO-структура

### Страницы и их цели
| URL | Назначение | Приоритет |
|---|---|---|
| `/` | Главная — калькулятор (H1: «Калькулятор маркировки») | 1.0 |
| `/nastroyka-kassy-markirovka` | Лендинг: настройка кассы под маркировку | 0.9 |
| `/podklyuchenie-chestnyy-znak` | Лендинг: подключение Честного ЗНАК | 0.9 |
| `/integraciya-1c` | Лендинг: интеграция с 1С | 0.8 |
| `/instructions` | Список инструкций | 0.9 |
| `/instructions/[slug]` | Отдельная инструкция | 0.8 |
| `/faq` | FAQ | 0.8 |
| `/services` | Услуги | 0.8 |
| `/about` | О компании | 0.7 |
| `/contacts` | Контакты | 0.7 |

### Структурированные данные (JSON-LD)
- `Organization` — данные ООО «Теллур-Интех»
- `LocalBusiness` — адреса филиалов

### Мета-теги
- Title: «Калькулятор маркировки: цена под ключ в СПб — Теллур-Интех»
- Description: содержит «цена от 3 000 ₽», «за 1 день», «СПб»
- Canonical: `https://tellurmarkirovka.vercel.app`

---

## 8. Навигация и верстка

- **Навигация**: `grid grid-cols-[1fr_auto_1fr]` — true centering (не flex!)
- **Шапка на ПК**: логотип + текст максимально влево (`pl-1 sm:pl-2`)
- **Филиалы**: 3 офиса (Теллур-Центр, Теллур-Пушкин, Теллур-Гатчина)
- **Фон**: engineer-bg.webp в секции «Наши филиалы»

---

## 9. Известные задачи и TODO

### Выполнено
- [x] Безопасность: удалены навыки (skills/), убран fallback chat ID
- [x] Навигация по центру через grid-layout
- [x] Шапка: лого+текст максимально влево на ПК
- [x] SEO: 3 лендинга, мета-теги, sitemap, JSON-LD
- [x] Калькулятор: скрытие перерегистрации при полной маркировке

### В очереди
- [ ] Телефон: исправить на +7(812)465-94-57 (основной)
- [ ] Мобильная версия: показать текст в шапке, увеличить иконки 1.5x
- [ ] GitHub PAT в remote URL (нужна ротация — ручная задача пользователя)
- [ ] Хранение заказов: перейти на Google Sheets (Telegram заблокирован в РФ)
- [ ] FAQ-виджет: адаптация под мобильные устройства
- [ ] Реструктуризация: разделение на страницы с навигацией

---

## 10. Правила работы с проектом для AI-агентов

1. **ВСЕГДА** читай этот файл перед началом работы
2. **НЕ** создавай файлы в корне проекта (кроме конфигурации)
3. **НЕ** добавляй fallback'ы с секретами в код
4. **НЕ** коммить файлы `skills/`, `upload/`, `.env*`
5. Деплой: `git push origin main` → Vercel автоматически деплоит
6. Тестируй визуально: `git push origin main` и проверяй на https://tellurmarkirovka.vercel.app/
7. Все изменения через pull/push — никаких прямых правок в Vercel
8. При добавлении страниц — обновлять `sitemap.ts`
9. Сохраняй существующий стиль (Tailwind CSS 4, shadcn/ui)
10. Контакты и цены — только в `src/config/` (не хардкодить в компонентах)

---

*Последнее обновление: 2026-04-09*
