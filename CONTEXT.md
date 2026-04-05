# Калькулятор маркировки — ООО «Теллур-Интех»

## Репозиторий
- **Путь**: `/home/z/my-project/download/tellur-push`
- **Git submodule** — ВСЕ git-команды через `git -C /home/z/my-project/download/tellur-push`
- **Branch**: `main`
- **Deploy**: `https://tellurmarkirovka.vercel.app/`
- **Стек**: Next.js 15 + React 19 + Tailwind CSS 4 + shadcn/ui + Lucide React

---

## Что сделано

### SEO
- Контент всегда в HTML (схлопнут через CSS `max-h-0` + transition, не conditional render)
- 7 JSON-LD схем: Organization, WebSite, LocalBusiness, WebApplication, FAQPage, BreadcrumbList, Service
- Расширенный SEO-текст (3x), блок преимуществ, 6 описаний услуг, 20+ городов, 8 FAQ
- 41 ключевик в meta
- noscript fallback
- robots.txt с Clean-param для Яндекса
- sitemap обновлён

### Б/у кассы
- Перерегистрация убрана полностью (из доступных и недоступных)
- ОФД только «Такском» для б/у
- Блок «Недоступные для выбора» убран отовсюду

### UI
- «Контактные данные» — заголовок `text-lg sm:text-xl font-extrabold`
- Лого брендов: нормализованы к 3.5:1 (ImageMagick padding), `fill` + `object-contain` в `h-11 sm:h-14`
- Размер шрифта брендов: `text-sm` везде (StepBrands, StepSummary, DoneScreen)
- Меркурий лого: извлечён из референс-картинки, цвет #405776, чистые края (upscale 4x NEAREST → LANCZOS → бинаризация альфы)

---

## Нерешённое
1. **Тряска на странице 4 (мобильная)** — 3 CSS-попытки в прошлой сессии, все отвергнуты
2. **SEO вручную**:
   - заменить `yandex: 'verify'` на реальный код верификации
   - добавить сайт в Yandex.Webmaster и Google Search Console
   - создать OG-изображение (1200x630)

---

## Ключевые файлы

### Компоненты
| Файл | Назначение |
|------|-----------|
| `src/app/page.tsx` | Главная страница калькулятора (~строка 197 — перерегистрация) |
| `src/app/layout.tsx` | Мета-теги (41 ключевик), noscript, OG/Twitter cards |
| `src/app/sitemap.ts` | Sitemap |
| `src/app/robots.txt/route.ts` | robots.txt с Clean-param |
| `src/components/calculator/StepBrands.tsx` | Выбор кассы: бренды, лого, сигма/эвотор, прошивка/лицензия |
| `src/components/calculator/StepServices.tsx` | Услуги, ОФД, фильтр б/у |
| `src/components/calculator/StepContacts.tsx` | Контактные данные |
| `src/components/calculator/StepSummary.tsx` | Итоговая сводка |
| `src/components/calculator/StepECPOpt.tsx` | ЭЦП |
| `src/components/calculator/DoneScreen.tsx` | Экран завершения |
| `src/components/SeoContent.tsx` | SEO-блок (max-h collapse) |
| `src/components/SeoContentInner.tsx` | SEO-текст (преимущества, FAQ, города) |
| `src/components/JsonLd.tsx` | 7 JSON-LD схем |

### Конфиг
| Файл | Назначение |
|------|-----------|
| `src/config/brands.ts` | Бренды, цвета, лого |
| `src/config/kkmTypes.ts` | Типы касс, ОФД (фильтр Такском для б/у) |
| `src/config/services.ts` | Услуги, цены, описания |
| `src/config/steps.ts` | Шаги калькулятора |

### Ассеты
| Файл | Назначение |
|------|-----------|
| `public/brands/*.webp` | Лого брендов (все 3.5:1) |
| `public/brands/mercury.webp` | Меркурий — цвет #405776, извлечён из референса |

---

## Важные технические детали

### Архитектура UI
- Card: `gap-3 rounded-xl border py-3`, CardContent: `px-3 py-2`
- Чекбоксы: CSS 34px, border-radius 8px
- Кастомное событие `open-seo-block` для cross-component communication
- Лого брендов: `<Image src={/brands/${key}.webp} fill className="object-contain opacity-85" quality={100} unoptimized>`

### Цвета
- Основной: `#1e3a5f` (тёмно-синий)
- Акцент: `#e8a817` (жёлтый)
- Меркурий бренд: `#405776` (из референс-картинки)

### Меркурий лого — процесс создания
1. Взят референс от пользователя (844x285 PNG)
2. Извлечён текст через порог по luminance (< 240)
3. Кроп по bbox текста (844x272)
4. Upscale 4x через NEAREST (pixel-perfect)
5. Padding до 3.5:1
6. Downscale до 560x160 через LANCZOS
7. Бинаризация альфы: < 128 = 0, >= 128 = 255

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
