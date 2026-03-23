const ALPHANUMERIC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function computeCheckDigits(root: string): string {
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(root[i], 36) * weights1[i]
  }
  let remainder = sum % 11
  const first = remainder < 2 ? 0 : 11 - remainder

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  const withFirst = root + String(first)
  for (let i = 0; i < 13; i++) {
    sum += parseInt(withFirst[i], 36) * weights2[i]
  }
  remainder = sum % 11
  const second = remainder < 2 ? 0 : 11 - remainder

  return String(first) + String(second)
}

/** Generates a random valid numeric CNPJ string (14 digits). For testing purposes only. */
export function generateCNPJ(): string {
  let root: string
  do {
    root = Array.from({ length: 12 }, () => String(Math.floor(Math.random() * 10))).join('')
  } while (/^(.)\1{11}$/.test(root))
  return root + computeCheckDigits(root)
}

/**
 * Generates a random valid alphanumeric CNPJ string (12 alphanumeric chars + 2 numeric check digits).
 * Follows IN RFB nº 2229/2024 — new format effective July 2026. For testing purposes only.
 */
export function generateAlphanumericCNPJ(): string {
  let root: string
  do {
    root = Array.from(
      { length: 12 },
      () => ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)],
    ).join('')
  } while (/^(.)\1{11}$/.test(root))
  return root + computeCheckDigits(root)
}
