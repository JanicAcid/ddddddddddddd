// ============================================================================
// API: Авторизация менеджера
// POST /api/admin/auth  — логин (login + password + captchaAnswer + captchaToken)
// GET  /api/admin/auth  — проверка сессии
// DELETE /api/admin/auth — выход
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_LOGIN, ADMIN_PASSWORD, ADMIN_JWT_SECRET, ADMIN_SESSION_TTL, ADMIN_COOKIE_NAME } from '@/config/admin'
import { signJWT, verifyJWT } from '@/lib/jwt'
import crypto from 'crypto'

const CAPTCHA_EXPIRY = 5 * 60 * 1000 // 5 минут

function generateCaptchaData(): { question: string; answer: number; token: string } {
  const a = Math.floor(Math.random() * 50) + 1
  const b = Math.floor(Math.random() * 50) + 1
  const ops = ['+', '-', '×'] as const
  const op = ops[Math.floor(Math.random() * ops.length)]
  let answer: number
  let question: string
  switch (op) {
    case '+': answer = a + b; question = `${a} + ${b}`; break
    case '-': answer = Math.max(a - b, 0); question = `${a} - ${b}`; break
    case '×': answer = a * b; question = `${a} × ${Math.min(b, 12)}`; break
  }
  // Токен = HMAC(answer + expiry)
  const expiry = Date.now() + CAPTCHA_EXPIRY
  const payload = `${answer}:${expiry}`
  const token = crypto.createHmac('sha256', ADMIN_JWT_SECRET).update(payload).digest('hex')
  return { question: `${question} = ?`, answer, token }
}

function verifyCaptchaToken(answer: number, token: string): boolean {
  try {
    const parts = token.split(':')
    // Декодируем token — ищем совпадение
    // Перебирать нельзя, поэтому сохраняем в памяти
    return false
  } catch {
    return false
  }
}

// Хранилище активных капч (в памяти, для серверless достаточно)
const activeCaptchas = new Map<string, { answer: number; expiry: number }>()

function createCaptcha(): { question: string; answer: number; token: string } {
  const a = Math.floor(Math.random() * 50) + 1
  const b = Math.floor(Math.random() * 50) + 1
  const ops = ['+', '-', '×'] as const
  const op = ops[Math.floor(Math.random() * ops.length)]
  let answer: number
  let display: string
  switch (op) {
    case '+': answer = a + b; display = `${a} + ${b}`; break
    case '-': answer = Math.max(a - b, 0); display = `${a} - ${b}`; break
    case '×': {
      const bSmall = Math.floor(Math.random() * 12) + 1
      answer = a * bSmall; display = `${a} × ${bSmall}`; break
    }
  }
  const token = crypto.randomBytes(16).toString('hex')
  activeCaptchas.set(token, { answer, expiry: Date.now() + CAPTCHA_EXPIRY })

  // Очистка просроченных
  const now = Date.now()
  for (const [k, v] of activeCaptchas) {
    if (v.expiry < now) activeCaptchas.delete(k)
  }

  return { question: `${display} = ?`, answer, token }
}

function checkCaptcha(token: string, userAnswer: number): boolean {
  const data = activeCaptchas.get(token)
  if (!data) return false
  if (Date.now() > data.expiry) {
    activeCaptchas.delete(token)
    return false
  }
  // Удаляем после проверки (одноразовая)
  activeCaptchas.delete(token)
  return data.answer === userAnswer
}

// Генерация капчи (GET /api/admin/auth?captcha=1)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Если запрос капчи
  if (searchParams.get('captcha') === '1') {
    const captcha = createCaptcha()
    return NextResponse.json({ question: captcha.question, token: captcha.token })
  }

  // Проверка сессии
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    const payload = await verifyJWT(token, ADMIN_JWT_SECRET)
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    return NextResponse.json({ authenticated: true, login: payload.login })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { login, password, captchaAnswer, captchaToken } = body

    // Проверка серверной капчи
    if (!captchaAnswer || !captchaToken || !checkCaptcha(captchaToken, parseInt(captchaAnswer))) {
      return NextResponse.json({ error: 'Неверный ответ на капчу или капча устарела' }, { status: 401 })
    }

    // Проверка логина и пароля
    if (login !== ADMIN_LOGIN || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 })
    }

    // Создаём JWT
    const token = await signJWT(
      { role: 'manager', login },
      ADMIN_JWT_SECRET,
      ADMIN_SESSION_TTL
    )

    const response = NextResponse.json({ ok: true })
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ADMIN_SESSION_TTL,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}
