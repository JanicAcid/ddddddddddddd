// Cloudflare Pages Function — ALL API routes for kassa-cto.ru
// Handles: auth, orders, captcha, send-order, log-order, chat

interface Env {
  ADMIN_LOGIN: string;
  ADMIN_PASSWORD: string;
  ADMIN_JWT_SECRET: string;
  GOOGLE_SA_EMAIL: string;
  GOOGLE_SHEETS_ID: string;
  GOOGLE_SA_PRIVATE_KEY: string;
  TELEGRAM_BOT_TOKEN: string;
  OPERATOR_CHAT_ID: string;
}

// ========== HELPERS ==========

function jsonResponse(data: unknown, status = 200, setCookieHeader?: string): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
  };
  if (setCookieHeader) {
    headers['Set-Cookie'] = setCookieHeader;
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function errorResponse(msg: string, status = 400): Response {
  return jsonResponse({ error: msg }, status);
}

function getCookie(request: Request, name: string): string | undefined {
  const cookies = request.headers.get('Cookie') || '';
  const match = cookies.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(name: string, value: string, maxAge = 86400): string {
  const proto = 'https';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function deleteCookie(name: string): string {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

// Simple JWT for admin auth (HS256)
async function createJWT(payload: object, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + 86400 };
  
  const enc = (obj: unknown) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const h = enc(header);
  const p = enc(fullPayload);
  const data = `${h}.${p}`;
  
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const s = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  return `${data}.${s}`;
}

async function verifyJWT(token: string, secret: string): Promise<object | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [h, p, s] = parts;
    const data = `${h}.${p}`;
    
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    
    const sig = Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(data));
    
    if (!valid) return null;
    
    const payload = JSON.parse(atob(p.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    
    return payload;
  } catch {
    return null;
  }
}

async function requireAuth(request: Request, env: Env): Promise<{ authorized: boolean; response?: Response }> {
  const token = getCookie(request, 'admin_token');
  if (!token) return { authorized: false };
  
  const payload = await verifyJWT(token, env.ADMIN_JWT_SECRET);
  if (!payload) return { authorized: false };
  
  return { authorized: true };
}

// ========== GOOGLE SHEETS ==========

async function getGoogleAccessToken(env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: env.GOOGLE_SA_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  
  const enc = (obj: unknown) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const h = enc(header);
  const p = enc(payload);
  const data = `${h}.${p}`;
  
  // Parse PEM key
  const pemKey = env.GOOGLE_SA_PRIVATE_KEY
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  
  const keyData = Uint8Array.from(atob(pemKey), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8', keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
  );
  
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(data));
  const s = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const jwt = `${data}.${s}`;
  
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  
  const result = await resp.json();
  if (!result.access_token) throw new Error('Failed to get Google access token: ' + JSON.stringify(result));
  return result.access_token;
}

async function appendToSheet(env: Env, values: unknown[]): Promise<void> {
  const token = await getGoogleAccessToken(env);
  
  const resp = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEETS_ID}/values/Sheet1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [values] }),
    }
  );
  
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Google Sheets API error: ${resp.status} ${err}`);
  }
}

async function readSheet(env: Env, range = 'Sheet1'): Promise<unknown[][]> {
  const token = await getGoogleAccessToken(env);
  
  const resp = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEETS_ID}/values/${range}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );
  
  if (!resp.ok) throw new Error(`Google Sheets read error: ${resp.status}`);
  const data = await resp.json();
  return data.values || [];
}

// ========== TELEGRAM ==========

async function sendTelegramMessage(env: Env, text: string): Promise<void> {
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.OPERATOR_CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  });
}

async function sendTelegramDocument(env: Env, html: string, subject: string): Promise<void> {
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const body = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="chat_id"`,
    '',
    env.OPERATOR_CHAT_ID,
    `--${boundary}`,
    `Content-Disposition: form-data; name="document"; filename="${subject}.html"`,
    'Content-Type: text/html',
    '',
    html,
    `--${boundary}--`,
  ].join('\r\n');
  
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendDocument`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body,
  });
}

// ========== CAPTCHA ==========

function generateCaptcha(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const ops = ['+', '-', '×'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  
  let answer: number;
  let question: string;
  
  switch (op) {
    case '+':
      answer = a + b;
      question = `${a} + ${b} = ?`;
      break;
    case '-':
      answer = a - b;
      question = `${a} - ${b} = ?`;
      break;
    case '×':
      answer = a * b;
      question = `${a} × ${b} = ?`;
      break;
  }
  
  return { question, answer };
}

// ========== HANDLERS ==========

async function handleCaptcha(): Promise<Response> {
  const { question, answer } = generateCaptcha();
  const captchaId = Math.random().toString(36).slice(2, 10);
  
  // Store captcha answer in a simple way (for stateless Workers, we encode it)
  // In production, use KV or D1. For now, encode answer in the captchaId
  const encoded = btoa(JSON.stringify({ answer, ts: Date.now() }));
  
  return jsonResponse({
    id: captchaId,
    question,
    token: encoded,
  });
}

async function handleAdminAuthPost(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { login?: string; password?: string };
    
    if (body.login !== env.ADMIN_LOGIN || body.password !== env.ADMIN_PASSWORD) {
      return errorResponse('Неверный логин или пароль', 401);
    }
    
    const token = await createJWT({ role: 'admin', login: body.login }, env.ADMIN_JWT_SECRET);
    const cookie = setCookie('admin_token', token);
    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Set-Cookie': cookie },
    });
  } catch {
    return errorResponse('Ошибка запроса', 400);
  }
}

async function handleAdminAuthDelete(): Promise<Response> {
  const cookie = deleteCookie('admin_token');
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Set-Cookie': cookie },
  });
}

async function handleAdminOrders(request: Request, env: Env): Promise<Response> {
  const auth = await requireAuth(request, env);
  if (!auth.authorized) return errorResponse('Не авторизован', 401);
  
  try {
    const rows = await readSheet(env);
    if (rows.length <= 1) return jsonResponse({ orders: [], headers: rows[0] || [] });
    
    const headers = rows[0];
    const orders = rows.slice(1).map((row, i) => {
      const obj: Record<string, unknown> = { _row: i + 2 };
      headers.forEach((h: string, j: number) => {
        obj[h] = row[j] || '';
      });
      return obj;
    });
    
    return jsonResponse({ orders, headers });
  } catch (e) {
    return errorResponse('Ошибка чтения таблицы: ' + (e as Error).message, 500);
  }
}

async function handleSendOrder(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { subject?: string; html?: string };
    
    if (!body.subject || !body.html) {
      return errorResponse('Missing fields');
    }
    
    await sendTelegramDocument(env, body.html, body.subject);
    
    return jsonResponse({ success: true, sentTo: 'telegram' });
  } catch (e) {
    return errorResponse('Ошибка отправки: ' + (e as Error).message, 500);
  }
}

async function handleLogOrder(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as Record<string, unknown>;
    
    if (!body.orderNum || !body.clientName) {
      return errorResponse('Missing fields');
    }
    
    const now = new Date();
    const dateStr = now.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    
    const row = [
      dateStr,
      body.orderNum,
      body.clientName,
      body.phone || '',
      body.email || '',
      body.kkmType || '',
      body.kkmCondition || '',
      Array.isArray(body.services) ? body.services.join(', ') : '',
      body.total || 0,
      body.comment || '',
      'Новая',
      '',
      body.orderHtml || '',
    ];
    
    await appendToSheet(env, row);
    
    return jsonResponse({ success: true, logged: true });
  } catch (e) {
    return errorResponse('Ошибка логирования: ' + (e as Error).message, 500);
  }
}

// ========== MAIN ROUTER ==========

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  
  // CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Cache-Control': 'no-store, no-cache',
      },
    });
  }
  
  try {
    // Admin auth
    if (path === '/api/admin/auth' && method === 'POST') {
      return handleAdminAuthPost(request, env);
    }
    if (path === '/api/admin/auth' && method === 'DELETE') {
      return handleAdminAuthDelete();
    }
    
    // Admin orders
    if (path === '/api/admin/orders' && method === 'GET') {
      return handleAdminOrders(request, env);
    }
    
    // Captcha
    if (path === '/api/captcha' && method === 'GET') {
      return handleCaptcha();
    }
    
    // Send order to Telegram
    if (path === '/api/send-order' && method === 'POST') {
      return handleSendOrder(request, env);
    }
    
    // Log order to Google Sheets
    if (path === '/api/log-order' && method === 'POST') {
      return handleLogOrder(request, env);
    }
    
    // Chat endpoints (stub)
    if (path === '/api/chat/send' && method === 'POST') {
      return jsonResponse({ success: true });
    }
    if (path === '/api/chat/poll' && method === 'GET') {
      return jsonResponse({ messages: [] });
    }
    
    return errorResponse('Not Found', 404);
  } catch (e) {
    return errorResponse('Internal Server Error: ' + (e as Error).message, 500);
  }
};
