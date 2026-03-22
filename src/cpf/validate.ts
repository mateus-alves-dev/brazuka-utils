export function validateCPF(value: string): boolean {
  if (typeof value !== 'string') return false

  const digits = value.replace(/\D/g, '')

  if (digits.length !== 11) return false

  // Reject all same digits (e.g. 111.111.111-11)
  if (/^(\d)\1{10}$/.test(digits)) return false

  // Validate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i), 10) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(digits.charAt(9), 10)) return false

  // Validate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i), 10) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(digits.charAt(10), 10)) return false

  return true
}
