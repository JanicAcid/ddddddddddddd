// ============================================================================
// Middleware: защита /admin (редирект на /admin/login если не авторизован)
// ============================================================================
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_JWT_SECRET } from '@/config/admin'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Защищаем /admin (кроме /admin/login)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname === '/admin/login') return NextResponse.next()

    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Проверяем JWT
    try {
      const parts = token.split('.')
      if (parts.length !== 3) throw new Error('Invalid token')

      const headerB64 = parts[0]
      const payloadB64 = parts[1]
      const sigB64 = parts[2]
      const unsigned = `${headerB64}.${payloadB64}`

      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(ADMIN_JWT_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      )

      const sigBytes = Buffer.from(sigB64, 'base64url')
      const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(unsigned))
      if (!valid) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
