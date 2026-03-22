import { describe, it, expect } from 'vitest'
import { validateCPF, formatCPF, generateCPF } from '../src/cpf/index.js'
import { InvalidInputError } from '../src/types/index.js'

describe('validateCPF', () => {
  it('validates a correctly formatted CPF', () => {
    expect(validateCPF('123.456.789-09')).toBe(true)
  })

  it('validates an unformatted CPF', () => {
    expect(validateCPF('12345678909')).toBe(true)
  })

  it('validates another valid CPF', () => {
    expect(validateCPF('529.982.247-25')).toBe(true)
  })

  it('validates unformatted valid CPF', () => {
    expect(validateCPF('52998224725')).toBe(true)
  })

  it('rejects CPF with all same digits', () => {
    expect(validateCPF('111.111.111-11')).toBe(false)
    expect(validateCPF('000.000.000-00')).toBe(false)
    expect(validateCPF('222.222.222-22')).toBe(false)
    expect(validateCPF('99999999999')).toBe(false)
  })

  it('rejects CPF with wrong check digits', () => {
    expect(validateCPF('123.456.789-00')).toBe(false)
  })

  it('rejects CPF with wrong length', () => {
    expect(validateCPF('1234567890')).toBe(false)
    expect(validateCPF('123456789012')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(validateCPF('')).toBe(false)
  })

  it('returns false for non-string input', () => {
    expect(validateCPF(null as unknown as string)).toBe(false)
    expect(validateCPF(undefined as unknown as string)).toBe(false)
    expect(validateCPF(123 as unknown as string)).toBe(false)
  })

  it('validates CPF where first check digit remainder equals 10 (maps to 0)', () => {
    // CPF 00000030007: first check digit computation yields remainder 10 → 0
    expect(validateCPF('00000030007')).toBe(true)
  })

  it('validates CPF where second check digit remainder equals 10 (maps to 0)', () => {
    // CPF 00000001830: second check digit computation yields remainder 10 → 0
    expect(validateCPF('00000001830')).toBe(true)
  })
})

describe('formatCPF', () => {
  it('formats a valid unformatted CPF', () => {
    expect(formatCPF('12345678909')).toBe('123.456.789-09')
  })

  it('formats another valid CPF', () => {
    expect(formatCPF('52998224725')).toBe('529.982.247-25')
  })

  it('throws InvalidInputError for wrong length', () => {
    expect(() => formatCPF('1234567890')).toThrow(InvalidInputError)
  })

  it('throws InvalidInputError for empty string', () => {
    expect(() => formatCPF('')).toThrow(InvalidInputError)
  })

  it('throws InvalidInputError for non-string', () => {
    expect(() => formatCPF(null as unknown as string)).toThrow(InvalidInputError)
  })

  it('the error has correct code', () => {
    try {
      formatCPF('invalid')
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidInputError)
      expect((e as InvalidInputError).code).toBe('INVALID_INPUT')
    }
  })
})

describe('generateCPF', () => {
  it('generates a valid CPF', () => {
    const cpf = generateCPF()
    expect(cpf).toHaveLength(11)
    expect(validateCPF(cpf)).toBe(true)
  })

  it('generates different CPFs on multiple calls', () => {
    const cpfs = new Set<string>()
    for (let i = 0; i < 10; i++) {
      cpfs.add(generateCPF())
    }
    // At least 2 unique values (extremely unlikely to get all same)
    expect(cpfs.size).toBeGreaterThan(1)
  })
})
