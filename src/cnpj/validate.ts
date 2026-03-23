export function validateCNPJ(value: string): boolean {
  if (typeof value !== 'string') return false

  // Strip formatting characters; accept alphanumeric (A-Z, 0-9) per IN RFB 2229/2024
  const raw = value.replace(/[^A-Z0-9]/gi, '').toUpperCase()

  if (raw.length !== 14) return false

  // Reject all same characters
  if (/^(.)\1{13}$/.test(raw)) return false

  // Check digits (positions 12 and 13) must be numeric per the specification
  if (!/^\d$/.test(raw[12]) || !/^\d$/.test(raw[13])) return false

  // Characters are mapped to their base-36 values (A=10…Z=35); digits stay the same
  // First check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(raw[i], 36) * weights1[i]
  }
  let remainder = sum % 11
  const firstCheck = remainder < 2 ? 0 : 11 - remainder
  if (firstCheck !== parseInt(raw[12], 10)) return false

  // Second check digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(raw[i], 36) * weights2[i]
  }
  remainder = sum % 11
  const secondCheck = remainder < 2 ? 0 : 11 - remainder
  if (secondCheck !== parseInt(raw[13], 10)) return false

  return true
}
