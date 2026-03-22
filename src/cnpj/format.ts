import { InvalidInputError } from '../types/index.js'

export function formatCNPJ(value: string): string {
  if (typeof value !== 'string') {
    throw new InvalidInputError('CNPJ', String(value))
  }

  const digits = value.replace(/\D/g, '')

  if (digits.length !== 14) {
    throw new InvalidInputError('CNPJ', value)
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
}
