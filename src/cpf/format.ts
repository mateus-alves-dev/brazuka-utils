import { InvalidInputError } from '../types/index.js'

export function formatCPF(value: string): string {
  if (typeof value !== 'string') {
    throw new InvalidInputError('CPF', String(value))
  }

  const digits = value.replace(/\D/g, '')

  if (digits.length !== 11) {
    throw new InvalidInputError('CPF', value)
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}
