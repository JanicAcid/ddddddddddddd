// ============================================================================
// JWT helpers для admin-сессии (server-side, без внешних зависимостей)
// ============================================================================

export async function signJWT(payload: Record<string, unknown>, secret: string, ttlSeconds: number): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const data = { ...payload, iat: now, exp: now + ttlSeconds }

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url')
  const payloadB64 = Buffer.from(JSON.stringify(data)).toString('base64url')
  const unsigned = `${headerB64}.${payloadB64}`

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(unsigned))
  const sigB64 = Buffer.from(new Uint8Array(signature)).toString('base64url')

  return `${unsigned}.${sigB64}`
}

export async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const headerB64 = parts[0]
    const payloadB64 = parts[1]
    const sigB64 = parts[2]
    const unsigned = `${headerB64}.${payloadB64}`

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const sigBytes = Buffer.from(sigB64, 'base64url')
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(unsigned))
    if (!valid) return null

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch {
    return null
  }
}
