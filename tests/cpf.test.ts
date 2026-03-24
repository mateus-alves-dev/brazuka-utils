import { describe, it, expect, vi } from 'vitest'
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

  it('rejects CPF with wrong check digits (fails at second check digit)', () => {
    expect(validateCPF('123.456.789-00')).toBe(false)
  })

  it('rejects CPF with wrong first check digit (fails at first check digit)', () => {
    // 529.982.247 → computed first digit = 2, but providing 0 → fails at line 18
    expect(validateCPF('52998224700')).toBe(false)
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

  it('handles first check digit remainder === 10', () => {
    // Mock to force digits that yield remainder 10 for first check
    // Using vi.stubGlobal to control Math.random
    let callCount = 0
    const mockRandom = vi.fn(() => {
      // digits = [0,0,0,0,0,0,0,4,0]
      // sum = 4*3 = 12
      // (12 * 10) % 11 = 120 % 11 = 10 ✓ → remainder becomes 0
      const values = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.4, 0.0]
      const result = callCount < 9 ? values[callCount] : 0.5
      callCount++
      return result
    })
    vi.stubGlobal('Math', {
      ...Math,
      random: mockRandom,
      floor: Math.floor,
    })
    try {
      const cpf = generateCPF()
      expect(cpf).toHaveLength(11)
      expect(validateCPF(cpf)).toBe(true)
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('handles second check digit remainder === 10', () => {
    // Mock to force digits that yield remainder 10 for second check
    let callCount = 0
    const mockRandom = vi.fn(() => {
      // Returns sequence that makes first digit calculation, then second gives remainder 10
      const values = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.8]
      const result = callCount < 9 ? values[callCount] : 0.5
      callCount++
      return result
    })
    vi.stubGlobal('Math', {
      ...Math,
      random: mockRandom,
      floor: Math.floor,
    })
    try {
      const cpf = generateCPF()
      expect(cpf).toHaveLength(11)
      expect(validateCPF(cpf)).toBe(true)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
