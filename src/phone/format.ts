import { InvalidInputError } from '../types/index.js'

export function formatPhone(value: string): string {
  if (typeof value !== 'string') {
    throw new InvalidInputError('Phone', String(value))
  }

  const digits = value.replace(/\D/g, '')

  if (digits.length === 11) {
    // Mobile: (XX) 9XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  if (digits.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`
  }

  throw new InvalidInputError('Phone', value)
}
