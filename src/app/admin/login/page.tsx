'use client'

import { useState, useCallback } from 'react'
import { Lock, Eye, EyeOff, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'

function generateCaptcha(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 20) + 1
  const b = Math.floor(Math.random() * 20) + 1
  const ops = ['+', '-']
  const op = ops[Math.floor(Math.random() * ops.length)]
  const answer = op === '+' ? a + b : Math.max(a - b, 0)
  return { question: `${a} ${op} ${b} = ?`, answer }
}

export default function AdminLoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [captcha, setCaptcha] = useState(() => generateCaptcha())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha())
    setCaptchaInput('')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login,
          password,
          captchaAnswer: captchaInput,
          captchaCorrect: String(captcha.answer),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка авторизации')
        refreshCaptcha()
        return
      }

      // Успешный вход — редирект в кабинет
      window.location.href = '/admin'
    } catch {
      setError('Ошибка соединения')
      refreshCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1e3a5f]/10 mb-4">
            <Lock className="w-8 h-8 text-[#1e3a5f]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Кабинет менеджера</h1>
          <p className="text-sm text-slate-500 mt-1">ООО «Теллур-Интех»</p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Логин */}
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-slate-700 mb-1.5">
                Логин
              </label>
              <input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Введите логин"
                required
                autoComplete="username"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-colors"
              />
            </div>

            {/* Пароль */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  required
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Капча */}
            <div>
              <label htmlFor="captcha" className="block text-sm font-medium text-slate-700 mb-1.5">
                Капча
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-semibold text-slate-700 select-none">
                  {captcha.question}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
                  title="Обновить капчу"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <input
                id="captcha"
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Ответ"
                required
                autoComplete="off"
                className="w-full mt-2 px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f] transition-colors"
              />
            </div>

            {/* Ошибка */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Кнопка */}
            <button
              type="submit"
              disabled={loading || !login || !password || !captchaInput}
              className="w-full py-3 text-sm font-semibold text-white rounded-lg bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти в кабинет'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Только для авторизованных сотрудников
        </p>
      </div>
    </div>
  )
}
