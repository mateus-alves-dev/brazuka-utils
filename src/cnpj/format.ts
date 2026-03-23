import { InvalidInputError } from '../types/index.js'
import { validateCNPJ } from './validate.js'

export function formatCNPJ(value: string): string {
  if (typeof value !== 'string') {
    throw new InvalidInputError('CNPJ', String(value))
  }

  const raw = value.replace(/[^A-Z0-9]/gi, '').toUpperCase()

  if (raw.length !== 14 || !validateCNPJ(raw)) {
    throw new InvalidInputError('CNPJ', value)
  }

  return `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}/${raw.slice(8, 12)}-${raw.slice(12, 14)}`
}
