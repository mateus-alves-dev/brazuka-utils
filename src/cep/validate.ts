export function validateCEP(value: string): boolean {
  if (typeof value !== 'string') return false

  const digits = value.replace(/\D/g, '')

  if (digits.length !== 8) return false

  // Reject all zeros
  if (/^0{8}$/.test(digits)) return false

  return true
}
