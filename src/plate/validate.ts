// Old format: ABC-1234 (3 letters + 4 digits)
const OLD_PLATE_REGEX = /^[A-Z]{3}-?\d{4}$/

// Mercosul format: ABC1D23 (3 letters + 1 digit + 1 letter + 2 digits)
const MERCOSUL_PLATE_REGEX = /^[A-Z]{3}\d[A-Z]\d{2}$/

export function validatePlate(value: string): boolean {
  if (typeof value !== 'string') return false

  const normalized = value.toUpperCase().trim()

  if (normalized.length === 0) return false

  return OLD_PLATE_REGEX.test(normalized) || MERCOSUL_PLATE_REGEX.test(normalized)
}
