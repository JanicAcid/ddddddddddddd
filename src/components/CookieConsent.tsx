'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Cookie, X, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react'

const CONSENT_KEY = 'cookie-consent-accepted'
const CONSENT_EVENT = 'cookie-consent-changed'

interface ConsentData {
  accepted: boolean
  timestamp: string
  categories: {
    necessary: boolean
    analytics_yandex: boolean
    analytics_google: boolean
  }
}

const DEFAULT_CONSENT: ConsentData = {
  accepted: false,
  timestamp: '',
  categories: {
    necessary: true,
    analytics_yandex: false,
    analytics_google: false,
  },
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [analytics, setAnalytics] = useState({
    yandex: true,
    google: true,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (!stored) {
        setVisible(true)
      }
    } catch {
      // localStorage unavailable — show banner anyway
      setVisible(true)
    }
  }, [])

  const saveConsent = useCallback((categories: ConsentData['categories']) => {
    const data: ConsentData = {
      accepted: true,
      timestamp: new Date().toISOString(),
      categories,
    }
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(data))
    } catch {
      // ignore
    }
    setVisible(false)
    // Уведомляем компоненты аналитики о изменении согласия
    try {
      window.dispatchEvent(new CustomEvent(CONSENT_EVENT))
    } catch {
      // ignore
    }
  }, [])

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics_yandex: true,
      analytics_google: true,
    })
  }

  const rejectOptional = () => {
    saveConsent({
      necessary: true,
      analytics_yandex: false,
      analytics_google: false,
    })
  }

  const saveCustom = () => {
    saveConsent({
      necessary: true,
      analytics_yandex: analytics.yandex,
      analytics_google: analytics.google,
    })
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300"
      role="dialog"
      aria-label="Настройки файлов cookie"
    >
      {/* Semi-transparent backdrop */}
      <div className="bg-black/20 backdrop-blur-sm" />

      {/* Banner content */}
      <div className="relative bg-white border-t border-slate-200 shadow-2xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
          <div className="flex flex-col gap-4">
            {/* Header row */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#e8a817]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-[#e8a817]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#1e3a5f] mb-1">
                  Мы используем файлы cookie
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Сайт использует файлы cookie для работы веб-аналитики
                  (Яндекс Метрика, Google Analytics), а также для запоминания ваших предпочтений
                  и обеспечения корректной работы сайта. Подробнее — в{' '}
                  <Link
                    href="/politika-konfidentsialnosti"
                    className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#e8a817] transition-colors"
                  >
                    Политике конфиденциальности
                  </Link>{' '}
                  и{' '}
                  <Link
                    href="/polzovatelskoe-soglashenie"
                    className="text-[#1e3a5f] underline underline-offset-2 hover:text-[#e8a817] transition-colors"
                  >
                    Пользовательском соглашении
                  </Link>.
                </p>
              </div>
              <button
                onClick={() => saveConsent(DEFAULT_CONSENT.categories)}
                className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Settings panel */}
            {showSettings && (
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 ml-0 sm:ml-12 space-y-3">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Выберите, какие cookie разрешить
                </p>

                {/* Necessary — always on */}
                <label className="flex items-start gap-3 cursor-not-allowed opacity-70">
                  <div className="w-5 h-5 rounded border-2 border-[#1e3a5f] bg-[#1e3a5f] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#1e3a5f]">Необходимые</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Обязательные cookie для работы сайта. Нельзя отключить.
                    </p>
                  </div>
                </label>

                {/* Yandex Metrika */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics.yandex}
                    onChange={e => setAnalytics(a => ({ ...a, yandex: e.target.checked }))}
                    className="w-5 h-5 rounded border-2 border-slate-300 text-[#e8a817] focus:ring-[#e8a817] mt-0.5 shrink-0 accent-[#e8a817]"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-700">Аналитика (Яндекс Метрика)</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Сбор данных о посещении сайта для улучшения сервиса.
                    </p>
                  </div>
                </label>

                {/* Google Analytics */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics.google}
                    onChange={e => setAnalytics(a => ({ ...a, google: e.target.checked }))}
                    className="w-5 h-5 rounded border-2 border-slate-300 text-[#e8a817] focus:ring-[#e8a817] mt-0.5 shrink-0 accent-[#e8a817]"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-700">Аналитика (Google Analytics)</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Сбор данных о поведении пользователей для анализа трафика.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ml-0 sm:ml-12">
              <button
                onClick={acceptAll}
                className="px-5 py-2.5 bg-[#e8a817] hover:bg-[#d49a12] text-white text-sm font-bold rounded-lg transition-colors"
              >
                Принять все
              </button>
              <button
                onClick={rejectOptional}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                Только необходимые
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-5 py-2.5 text-[#1e3a5f] text-sm font-medium hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {showSettings ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Скрыть настройки
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Настройки
                  </>
                )}
              </button>
              {showSettings && (
                <button
                  onClick={saveCustom}
                  className="px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#16304f] text-white text-sm font-bold rounded-lg transition-colors sm:ml-auto"
                >
                  Сохранить выбор
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
