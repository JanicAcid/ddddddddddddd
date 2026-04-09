// ============================================================================
// API: Авторизация менеджера
// POST /api/admin/auth  — логин (login + password + captchaAnswer)
// GET  /api/admin/auth  — проверка сессии
// DELETE /api/admin/auth — выход
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_LOGIN, ADMIN_PASSWORD, ADMIN_JWT_SECRET, ADMIN_SESSION_TTL, ADMIN_COOKIE_NAME } from '@/config/admin'
import { signJWT, verifyJWT } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { login, password, captchaAnswer, captchaCorrect } = body

    // Проверка капчи
    if (!captchaAnswer || !captchaCorrect || parseInt(captchaAnswer) !== parseInt(captchaCorrect)) {
      return NextResponse.json({ error: 'Неверный ответ на капчу' }, { status: 401 })
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

export async function GET(request: NextRequest) {
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

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}
