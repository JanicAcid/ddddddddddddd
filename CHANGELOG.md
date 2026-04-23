# CHANGELOG — Реестр корректировок проекта kassa-cto.ru

> Формат: даты в UTC, все изменения документируются.

---

## [2026-04-23] — Починка мобильных устройств + CF оптимизация

**Автор:** Super Z (AI-агент)

### Изменения Cloudflare:

| Настройка | Было | Стало | Причина |
|-----------|------|-------|---------|
| `browser_cache_ttl` | 0 (нет кеша) | 14400 (4 часа) | Мобильные устройства загружали 154KB HTML при каждом запросе |
| `always_online` | off | on | Fallback при недоступности CF Pages |

### Изменения кода:

| Файл | Изменение | Причина |
|------|-----------|---------|
| `src/app/layout.tsx` | Убраны `maximumScale: 1` и `userScalable: false` из viewport | `user-scalable=no` блокирует рендер на некоторых мобильных браузерах |

### Задачи:

- [x] CF browser_cache_ttl → 14400
- [x] CF always_online → on
- [x] Viewport: убран user-scalable=no
- [ ] Деплой коммита 1fac7df (API-миграция в CF Functions) на CF Pages
- [ ] Проверка работоспособности с мобильных устройств

### Примечания:

- SSL режим остаётся `full` (норма для CF Pages — CF управляет сертификатом оригинала)
- `full_strict` недоступен для CF Pages зон
- HTML размер 154KB — аномально большой, рекомендуется рассмотреть разбиение на чанки в будущем

---

## [2026-04-17] — Миграция API в Cloudflare Pages Functions

**Автор:** предыдущий AI-агент (сессия "касса цто")

### Изменения кода:

- Удалены все Next.js API routes из `src/app/api/`
- Создан единый `functions/api/[[path]].ts` — Cloudflare Pages Function
- Обновлены URL в `src/components/calculator/DoneScreen.tsx` для CF Functions
- Обновлены канонические URL на всех страницах: `tellurmarkirovka.vercel.app` → `kassa-cto.ru`

### Примечания:

- Коммит `1fac7df` создан, но НЕ задеплоен на CF Pages (последний деплой: `13e723a`)

---

## [2026-04-14] — Миграция на Cloudflare Pages + смена домена

**Автор:** предыдущий AI-агент (сессия "касса цто")

### Инфраструктура:

- Создан проект Cloudflare Pages: `kassa-cto`
- DNS: CNAME `kassa-cto.ru` → `kassa-cto.pages.dev` (proxied)
- DNS: CNAME `www.kassa-cto.ru` → `kassa-cto.pages.dev` (proxied)
- SSL: активирован (сертификат Let's Encrypt через CF)
- Домены: `kassa-cto.ru`, `www.kassa-cto.ru`, `kassa-cto.pages.dev`

### Изменения кода:

- Все URL: `tellurmarkirovka.vercel.app` → `kassa-cto.ru`
- `next.config.ts`: добавлен 301-редирект со старого домена
- `robots.txt`: обновлён Host и Sitemap
- `sitemap.ts`: baseUrl = `https://kassa-cto.ru`
- Все canonical, OG, Schema обновлены

---

## [2026-04-09] — Создание бекапа

**Автор:** предыдущий AI-агент

- Создан приватный репозиторий `JanicAcid/tellur-markirovka-backup`
- Полная копия проекта (состояние на момент создания)
- Описание: "АрХИВНАЯ КОПИЯ — tellurmarkirovka.vercel.app — НЕ РЕДАКТИРОВАТЬ"

---

## [2026-04-05 ~ 2026-04-09] — Основная разработка

**Автор:** предыдущий AI-агент (сессия "касса цто")

### Реализовано:

- Полный сайт ООО «Теллур-Интех» на Next.js 15.5 + React 19 + Tailwind CSS 4
- Калькулятор маркировки (4-шаговый wizard)
- Telegram-чат виджет (бот @spbmarkirovka_bot)
- SEO-лендинги: настройка кассы, Честный ЗНАК, интеграция 1С
- Страницы по категориям: маркировка обуви, одежды, табака
- Диагностика ФНС и ОФД
- Справочник касс + интерактивная консультация
- SEO: JSON-LD, sitemap, мета-теги, верификация Яндекса/Google
- Безопасность: HSTS, CSP, X-Frame-Options
- Yandex Metrika (ID: 108406091)
- PROJECT_GUIDE.md — руководство для AI-агентов
