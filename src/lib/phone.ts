/**
 * Маска телефона: +7 (XXX) XXX-XX-XX
 * Принимает только цифры, автоматически форматирует
 */

const PHONE_DIGITS = 11 // +7 + 9 цифр

/** Форматирует строку цифр в маску +7 (XXX) XXX-XX-XX */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 0) return ''

  // Если начинается с 8 — заменяем на 7
  let d = digits
  if (d[0] === '8') d = '7' + d.slice(1)
  // Если начинается не с 7 — добавляем 7
  if (d[0] !== '7') d = '7' + d

  const max = d.slice(0, PHONE_DIGITS)
  const parts: string[] = ['+7']
  if (max.length > 1) parts.push(` (${max.slice(1, 4)}`)
  if (max.length > 4) parts.push(`) ${max.slice(4, 7)}`)
  if (max.length > 7) parts.push(`-${max.slice(7, 9)}`)
  if (max.length > 9) parts.push(`-${max.slice(9, 11)}`)

  return parts.join('')
}

/** Проверяет, что номер полностью заполнен (11 цифр) */
export function isPhoneValid(formatted: string): boolean {
  const digits = formatted.replace(/\D/g, '')
  return digits.length === PHONE_DIGITS
}

/** Возвращает номер в формате для tel: ссылки */
export function phoneToHref(formatted: string): string {
  const digits = formatted.replace(/\D/g, '')
  if (digits.length < 10) return ''
  return `tel:+${digits}`
}
