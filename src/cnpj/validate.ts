export function validateCNPJ(value: string): boolean {
  if (typeof value !== 'string') return false

  const digits = value.replace(/\D/g, '')

  if (digits.length !== 14) return false

  // Reject all same digits
  if (/^(\d)\1{13}$/.test(digits)) return false

  // First check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits.charAt(i), 10) * weights1[i]
  }
  let remainder = sum % 11
  const firstCheck = remainder < 2 ? 0 : 11 - remainder
  if (firstCheck !== parseInt(digits.charAt(12), 10)) return false

  // Second check digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits.charAt(i), 10) * weights2[i]
  }
  remainder = sum % 11
  const secondCheck = remainder < 2 ? 0 : 11 - remainder
  if (secondCheck !== parseInt(digits.charAt(13), 10)) return false

  return true
}
