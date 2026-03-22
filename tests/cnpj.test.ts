import { describe, it, expect } from 'vitest'
import { validateCNPJ, formatCNPJ } from '../src/cnpj/index.js'
import { InvalidInputError } from '../src/types/index.js'

describe('validateCNPJ', () => {
  it('validates a correctly formatted CNPJ', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true)
  })

  it('validates an unformatted CNPJ', () => {
    expect(validateCNPJ('11222333000181')).toBe(true)
  })

  it('validates another valid CNPJ', () => {
    expect(validateCNPJ('54.550.752/0001-55')).toBe(true)
  })

  it('rejects CNPJ with all same digits', () => {
    expect(validateCNPJ('11.111.111/1111-11')).toBe(false)
    expect(validateCNPJ('00.000.000/0000-00')).toBe(false)
    expect(validateCNPJ('22222222222222')).toBe(false)
  })

  it('rejects CNPJ with wrong check digits', () => {
    expect(validateCNPJ('11.222.333/0001-82')).toBe(false)
  })

  it('rejects CNPJ with wrong length', () => {
    expect(validateCNPJ('1122233300018')).toBe(false)
    expect(validateCNPJ('112223330001811')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(validateCNPJ('')).toBe(false)
  })

  it('returns false for non-string input', () => {
    expect(validateCNPJ(null as unknown as string)).toBe(false)
    expect(validateCNPJ(undefined as unknown as string)).toBe(false)
  })

  it('validates CNPJ where both check digit remainders are < 2 (maps to 0)', () => {
    // CNPJ 00000000003700: both check digit computations yield remainder < 2
    expect(validateCNPJ('00000000003700')).toBe(true)
  })
})

describe('formatCNPJ', () => {
  it('formats a valid unformatted CNPJ', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81')
  })

  it('formats another valid CNPJ', () => {
    expect(formatCNPJ('54550752000155')).toBe('54.550.752/0001-55')
  })

  it('throws InvalidInputError for wrong length', () => {
    expect(() => formatCNPJ('1234567890')).toThrow(InvalidInputError)
  })

  it('throws InvalidInputError for empty string', () => {
    expect(() => formatCNPJ('')).toThrow(InvalidInputError)
  })

  it('throws InvalidInputError for non-string', () => {
    expect(() => formatCNPJ(null as unknown as string)).toThrow(InvalidInputError)
  })

  it('the error has correct code and message', () => {
    try {
      formatCNPJ('invalid')
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidInputError)
      expect((e as InvalidInputError).code).toBe('INVALID_INPUT')
      expect((e as InvalidInputError).message).toContain('CNPJ')
    }
  })
})
