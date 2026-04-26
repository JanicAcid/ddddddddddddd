// ============================================================================
// ПОЛНЫЙ РЕЕСТР ККТ — модели из реестра ФНС, сгруппированные по бренду
// ============================================================================

export interface KkmModel {
  id: string           // уникальный slug (для type и цен)
  brand: string        // бренд для группировки
  name: string         // полное название модели
  short: string        // краткое имя для отображения
  group: string        // группа: 'popular' | 'fiscal' | 'smart' | 'vending' | 'other'
}

export const KKM_REGISTRY: KkmModel[] = [
  // ═══ АТOL ═══
  { id: 'atol',          brand: 'Атол',          name: 'Атол 90Ф',                   short: '90Ф',                  group: 'popular' },
  { id: 'atol_92f',      brand: 'Атол',          name: 'Атол 92Ф',                   short: '92Ф',                  group: 'popular' },
  { id: 'atol_11f',      brand: 'Атол',          name: 'Атол 11Ф',                   short: '11Ф',                  group: 'fiscal' },
  { id: 'atol_15f',      brand: 'Атол',          name: 'Атол 15Ф',                   short: '15Ф',                  group: 'fiscal' },
  { id: 'atol_20f',      brand: 'Атол',          name: 'Атол 20Ф',                   short: '20Ф',                  group: 'fiscal' },
  { id: 'atol_22f',      brand: 'Атол',          name: 'Атол 22Ф',                   short: '22Ф',                  group: 'fiscal' },
  { id: 'atol_25f',      brand: 'Атол',          name: 'Атол 25Ф',                   short: '25Ф',                  group: 'fiscal' },
  { id: 'atol_27f',      brand: 'Атол',          name: 'Атол 27Ф',                   short: '27Ф',                  group: 'fiscal' },
  { id: 'atol_30f',      brand: 'Атол',          name: 'Атол 30Ф',                   short: '30Ф',                  group: 'fiscal' },
  { id: 'atol_42f',      brand: 'Атол',          name: 'Атол 42Ф',                   short: '42Ф',                  group: 'fiscal' },
  { id: 'atol_50f',      brand: 'Атол',          name: 'Атол 50Ф',                   short: '50Ф',                  group: 'fiscal' },
  { id: 'atol_55f',      brand: 'Атол',          name: 'Атол 55Ф',                   short: '55Ф',                  group: 'fiscal' },
  { id: 'atol_77f',      brand: 'Атол',          name: 'Атол 77Ф',                   short: '77Ф',                  group: 'fiscal' },
  { id: 'atol_60f',      brand: 'Атол',          name: 'Атол 60Ф',                   short: '60Ф',                  group: 'fiscal' },
  { id: 'atol_77',       brand: 'Атол',          name: 'Атол 77 (ККМ)',               short: '77 ККМ',               group: 'fiscal' },

  // ═══ СИГМА (Атол) ═══
  { id: 'sigma',         brand: 'Сигма',         name: 'Сигма 10',                   short: 'Сигма 10',             group: 'smart' },
  { id: 'sigma_15',      brand: 'Сигма',         name: 'Сигма 15',                   short: 'Сигма 15',             group: 'smart' },
  { id: 'sigma_50',      brand: 'Сигма',         name: 'Сигма 50',                   short: 'Сигма 50',             group: 'smart' },
  { id: 'sigma_70',      brand: 'Сигма',         name: 'Сигма 70',                   short: 'Сигма 70',             group: 'smart' },
  { id: 'sigma_is',      brand: 'Сигма',         name: 'Сигма ИС',                   short: 'Сигма ИС',             group: 'smart' },
  { id: 'sigma_pro',     brand: 'Сигма',         name: 'Сигма PRO',                  short: 'Сигма PRO',            group: 'smart' },

  // ═══ МЕРКУРИЙ ═══
  { id: 'mercury',       brand: 'Меркурий',      name: 'Меркурий 115Ф',              short: '115Ф',                 group: 'popular' },
  { id: 'mercury_180f',  brand: 'Меркурий',      name: 'Меркурий 180Ф',              short: '180Ф',                 group: 'popular' },
  { id: 'mercury_119f',  brand: 'Меркурий',      name: 'Меркурий 119Ф',              short: '119Ф',                 group: 'fiscal' },
  { id: 'mercury_130f',  brand: 'Меркурий',      name: 'Меркурий 130Ф',              short: '130Ф',                 group: 'fiscal' },
  { id: 'mercury_140f',  brand: 'Меркурий',      name: 'Меркурий 140Ф',              short: '140Ф',                 group: 'fiscal' },
  { id: 'mercury_185f',  brand: 'Меркурий',      name: 'Меркурий 185Ф',              short: '185Ф',                 group: 'fiscal' },

  // ═══ ШТРИХ-М ═══
  { id: 'shuttle',       brand: 'Штрих-М',       name: 'Штрих-М 01Ф',                short: '01Ф',                  group: 'popular' },
  { id: 'shuttle_05f',   brand: 'Штрих-М',       name: 'Штрих-М 05Ф',                short: '05Ф',                  group: 'fiscal' },
  { id: 'shuttle_m',     brand: 'Штрих-М',       name: 'Штрих-М Кассир',             short: 'Кассир',               group: 'fiscal' },
  { id: 'shuttle_lite',  brand: 'Штрих-М',       name: 'Штрих-М Лайт-01Ф',           short: 'Лайт-01Ф',             group: 'fiscal' },
  { id: 'shuttle_mega',  brand: 'Штрих-М',       name: 'Штрих-М Mega',                short: 'Mega',                 group: 'fiscal' },
  { id: 'shuttle_pay',   brand: 'Штрих-М',       name: 'Штрих-М Pay',                 short: 'Pay',                  group: 'vending' },
  { id: 'shuttle_mini',  brand: 'Штрих-М',       name: 'Штрих-М Mini',                short: 'Mini',                 group: 'fiscal' },
  { id: 'shuttle_smart', brand: 'Штрих-М',       name: 'Штрих-М Смарт',              short: 'Смарт',                group: 'smart' },
  { id: 'shuttle_50f',   brand: 'Штрих-М',       name: 'Штрих-М 50Ф',                short: '50Ф',                  group: 'fiscal' },
  { id: 'shuttle_51f',   brand: 'Штрих-М',       name: 'Штрих-М 51Ф',                short: '51Ф',                  group: 'fiscal' },

  // ═══ ЭВОТОР ═══
  { id: 'evotor',        brand: 'Эвотор',        name: 'Эвотор 7.3',                  short: '7.3',                  group: 'popular' },
  { id: 'evotor_5',      brand: 'Эвотор',        name: 'Эвотор 5',                    short: '5',                    group: 'smart' },
  { id: 'evotor_5i',     brand: 'Эвотор',        name: 'Эвотор 5i',                   short: '5i',                   group: 'smart' },
  { id: 'evotor_7',      brand: 'Эвотор',        name: 'Эвотор 7',                    short: '7',                    group: 'smart' },
  { id: 'evotor_7_2',    brand: 'Эвотор',        name: 'Эвотор 7.2',                  short: '7.2',                  group: 'smart' },
  { id: 'evotor_8',      brand: 'Эвотор',        name: 'Эвотор 8',                    short: '8',                    group: 'smart' },
  { id: 'evotor_st2',    brand: 'Эвотор',        name: 'Эвотор Старт 2',              short: 'Старт 2',              group: 'smart' },

  // ═══ AQSI (Аквариус) ═══
  { id: 'aqsi',          brand: 'AQSI',          name: 'AQSI М-02Ф',                  short: 'М-02Ф',                group: 'fiscal' },
  { id: 'aqsi_05f',      brand: 'AQSI',          name: 'AQSI М-05Ф',                  short: 'М-05Ф',                group: 'fiscal' },

  // ═══ ПИОНЕР ═══
  { id: 'pioneer',       brand: 'Пионер',        name: 'Пионер 114Ф',                 short: '114Ф',                 group: 'fiscal' },
  { id: 'pioneer_100f',  brand: 'Пионер',        name: 'Пионер 100Ф',                 short: '100Ф',                 group: 'fiscal' },
  { id: 'pioneer_115f',  brand: 'Пионер',        name: 'Пионер 115Ф',                 short: '115Ф',                 group: 'fiscal' },
  { id: 'pioneer_111f',  brand: 'Пионер',        name: 'Пионер 111Ф',                 short: '111Ф',                 group: 'fiscal' },

  // ═══ ДРУГИЕ БРЕНДЫ ═══
  { id: 'other_dt',      brand: 'Другие',        name: 'Дримкас Т',                   short: 'Дримкас Т',            group: 'smart' },
  { id: 'other_dtmini',  brand: 'Другие',        name: 'Дримкас Т Mini',              short: 'Т Mini',               group: 'smart' },
  { id: 'other_mstar',   brand: 'Другие',        name: 'Мicross MStar-T',             short: 'MStar-T',              group: 'smart' },
  { id: 'other_mstation', brand: 'Другие',       name: 'Мicross MStation',            short: 'MStation',             group: 'smart' },
  { id: 'other_piter',   brand: 'Другие',        name: 'Питер-Ресурс',                short: 'Питер-Ресурс',         group: 'other' },
  { id: 'other_rk',      brand: 'Другие',        name: 'РК-Мобайл',                   short: 'РК-Мобайл',            group: 'other' },
  { id: 'other_els_v',   brand: 'Другие',        name: 'Элвес-МФ (вендовый)',         short: 'Элвес-МФ',            group: 'vending' },
  { id: 'other_oz',      brand: 'Другие',        name: 'Озотакси',                    short: 'Озотакси',             group: 'other' },
  { id: 'other_tmk',     brand: 'Другие',        name: 'Тензор М-ТК',                 short: 'М-ТК',                 group: 'other' },
  { id: 'other_sunny',   brand: 'Другие',        name: 'Санни Сарафан',               short: 'Сарафан',              group: 'fiscal' },
  { id: 'other_vertex',  brand: 'Другие',        name: 'Вертекс',                     short: 'Вертекс',              group: 'other' },
]

/** Маппинг модели из реестра → base kkmType (для цен, логики)
 *
 * Правила:
 * - Известные бренды (Атол, Меркурий, Штрих-М, Эвотор, AQSI, Пионер, Сигма) → свой тип
 * - ФР (фискальные регистраторы) / vending → логика Атол (цены, услуги, прошивки)
 * - Смарт-терминалы → логика Меркурия (подписки, приложения, облако)
 * - Остальные → Атол (дефолт)
 */
export function getBaseKkm(modelId: string): string {
  // Известные бренды — по префиксу
  if (modelId.startsWith('sigma')) return 'sigma'
  if (modelId.startsWith('atol')) return 'atol'
  if (modelId.startsWith('mercury')) return 'mercury'
  if (modelId.startsWith('shuttle')) return 'shuttle'
  if (modelId.startsWith('evotor')) return 'evotor'
  if (modelId.startsWith('aqsi')) return 'aqsi'
  if (modelId.startsWith('pioneer')) return 'pioneer'

  // Ищем модель в реестре по group
  const model = KKM_REGISTRY.find(m => m.id === modelId)
  if (model) {
    // ФР, вендовые, ККМ → логика Атол
    if (model.group === 'fiscal' || model.group === 'vending') return 'atol'
    // Смарт-терминалы → логика Меркурия (подписки, приложения)
    if (model.group === 'smart') return 'mercury'
    // Остальное → Атол по умолчанию
    return 'atol'
  }

  return 'atol'
}

/** Получить базовый тип по бренду (для BrandQuickSelect подсветки) */
export function getBaseKkmByBrand(brand: string): string {
  const map: Record<string, string> = {
    'Атол': 'atol',
    'Сигма': 'sigma',
    'Меркурий': 'mercury',
    'Штрих-М': 'shuttle',
    'Эвотор': 'evotor',
    'AQSI': 'aqsi',
    'Пионер': 'pioneer',
  }
  return map[brand] || ''
}

/** Список брендов для фильтрации */
export const KKM_BRANDS_LIST = [...new Set(KKM_REGISTRY.map(m => m.brand))]
