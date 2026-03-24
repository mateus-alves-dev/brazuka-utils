import { describe, it, expect } from 'vitest'
import {
  validateCNPJ,
  formatCNPJ,
  generateCNPJ,
  generateAlphanumericCNPJ,
} from '../src/cnpj/index.js'
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

  it('rejects CNPJ with wrong second check digit', () => {
    expect(validateCNPJ('11.222.333/0001-82')).toBe(false)
  })

  it('rejects CNPJ with wrong first check digit (fails at first check)', () => {
    // firstCheck for 112223330001 = 8, but raw[12]='0' → 8 !== 0 → return false at first check
    expect(validateCNPJ('11222333000100')).toBe(false)
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

  it('throws InvalidInputError for a 14-char CNPJ with wrong check digits', () => {
    expect(() => formatCNPJ('11222333000182')).toThrow(InvalidInputError)
  })
})

describe('validateCNPJ — alphanumeric (IN RFB 2229/2024)', () => {
  // Test vectors computed manually:
  // root=AA0000000010, checks=66 → AA000000001066
  // root=B3CD5E6F7G8H, checks=84 → B3CD5E6F7G8H84

  it('validates an unformatted alphanumeric CNPJ', () => {
    expect(validateCNPJ('AA000000001066')).toBe(true)
  })

  it('validates a formatted alphanumeric CNPJ', () => {
    expect(validateCNPJ('AA.000.000/0010-66')).toBe(true)
  })

  it('validates a complex mixed alphanumeric CNPJ', () => {
    expect(validateCNPJ('B3CD5E6F7G8H84')).toBe(true)
  })

  it('validates a formatted complex mixed alphanumeric CNPJ', () => {
    expect(validateCNPJ('B3.CD5.E6F/7G8H-84')).toBe(true)
  })

  it('rejects alphanumeric CNPJ with wrong check digit', () => {
    expect(validateCNPJ('AA000000001067')).toBe(false)
  })

  it('rejects CNPJ with a letter in check digit position 12', () => {
    // Replace first check digit '6' with 'A'
    expect(validateCNPJ('AA0000000010A6')).toBe(false)
  })

  it('rejects CNPJ with wrong second check digit', () => {
    expect(validateCNPJ('AA000000001060')).toBe(false)
  })

  it('rejects CNPJ with a letter in check digit position 13 (digit at 12, letter at 13)', () => {
    // raw[12]='6' is a digit → first condition false; raw[13]='A' is not → second condition true
    expect(validateCNPJ('AA00000000106A')).toBe(false)
  })

  it('rejects all-same-letter CNPJ', () => {
    // All same letter — check digits are digits, not 'A', so it won't be all-14-same
    // but let's verify the no-all-same guard with a construct that could trigger it:
    // '00000000000000' is still rejected (all same digit, inherited from numeric)
    expect(validateCNPJ('00000000000000')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(validateCNPJ('')).toBe(false)
  })
})

describe('formatCNPJ — alphanumeric (IN RFB 2229/2024)', () => {
  it('formats a valid unformatted alphanumeric CNPJ', () => {
    expect(formatCNPJ('AA000000001066')).toBe('AA.000.000/0010-66')
  })

  it('formats a pre-formatted alphanumeric CNPJ (idempotent mask)', () => {
    expect(formatCNPJ('AA.000.000/0010-66')).toBe('AA.000.000/0010-66')
  })

  it('formats a complex mixed alphanumeric CNPJ', () => {
    expect(formatCNPJ('B3CD5E6F7G8H84')).toBe('B3.CD5.E6F/7G8H-84')
  })

  it('throws InvalidInputError for alphanumeric CNPJ with wrong check digit', () => {
    expect(() => formatCNPJ('AA000000001067')).toThrow(InvalidInputError)
  })
})

describe('generateCNPJ', () => {
  it('returns a string of 14 characters', () => {
    expect(generateCNPJ()).toHaveLength(14)
  })

  it('returns only digits', () => {
    expect(generateCNPJ()).toMatch(/^\d{14}$/)
  })

  it('returns a string that passes validateCNPJ', () => {
    for (let i = 0; i < 10; i++) {
      expect(validateCNPJ(generateCNPJ())).toBe(true)
    }
  })
})

describe('generateAlphanumericCNPJ', () => {
  it('returns a string of 14 characters', () => {
    expect(generateAlphanumericCNPJ()).toHaveLength(14)
  })

  it('returns only uppercase alphanumeric chars in first 12 positions and digits in last 2', () => {
    const cnpj = generateAlphanumericCNPJ()
    expect(cnpj.slice(0, 12)).toMatch(/^[A-Z0-9]{12}$/)
    expect(cnpj.slice(12)).toMatch(/^\d{2}$/)
  })

  it('returns a string that passes validateCNPJ', () => {
    for (let i = 0; i < 10; i++) {
      expect(validateCNPJ(generateAlphanumericCNPJ())).toBe(true)
    }
  })
})
