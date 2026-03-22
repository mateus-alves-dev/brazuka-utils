import { describe, it, expect } from 'vitest'
import { validatePhone, formatPhone } from '../src/phone/index.js'
import { InvalidInputError } from '../src/types/index.js'

describe('validatePhone', () => {
  it('validates a formatted mobile number', () => {
    expect(validatePhone('(11) 98765-4321')).toBe(true)
  })

  it('validates an unformatted mobile number', () => {
    expect(validatePhone('11987654321')).toBe(true)
  })

  it('validates a formatted landline number', () => {
    expect(validatePhone('(11) 3456-7890')).toBe(true)
  })

  it('validates an unformatted landline number', () => {
    expect(validatePhone('1134567890')).toBe(true)
  })

  it('validates with different valid DDDs', () => {
    expect(validatePhone('21987654321')).toBe(true) // RJ
    expect(validatePhone('31987654321')).toBe(true) // MG
    expect(validatePhone('61987654321')).toBe(true) // DF
    expect(validatePhone('71987654321')).toBe(true) // BA
    expect(validatePhone('92987654321')).toBe(true) // AM
  })

  it('rejects invalid DDD', () => {
    expect(validatePhone('10987654321')).toBe(false)
    expect(validatePhone('20987654321')).toBe(false)
    expect(validatePhone('23987654321')).toBe(false)
    expect(validatePhone('00987654321')).toBe(false)
  })

  it('rejects mobile without leading 9', () => {
    expect(validatePhone('11887654321')).toBe(false)
  })

  it('rejects landline with invalid first digit', () => {
    expect(validatePhone('1194567890')).toBe(false) // starts with 9, only 10 digits
    expect(validatePhone('1164567890')).toBe(false) // starts with 6
  })

  it('rejects wrong length', () => {
    expect(validatePhone('119876543')).toBe(false) // 9 digits
    expect(validatePhone('119876543211')).toBe(false) // 12 digits
  })

  it('returns false for empty string', () => {
    expect(validatePhone('')).toBe(false)
  })

  it('returns false for non-string input', () => {
    expect(validatePhone(null as unknown as string)).toBe(false)
    expect(validatePhone(undefined as unknown as string)).toBe(false)
  })
})

describe('formatPhone', () => {
  it('formats a mobile number', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321')
  })

  it('formats a landline number', () => {
    expect(formatPhone('1134567890')).toBe('(11) 3456-7890')
  })

  it('formats a number with existing formatting', () => {
    expect(formatPhone('(21) 98765-4321')).toBe('(21) 98765-4321')
  })

  it('throws InvalidInputError for wrong length', () => {
    expect(() => formatPhone('119876543')).toThrow(InvalidInputError)
  })

  it('throws InvalidInputError for empty string', () => {
    expect(() => formatPhone('')).toThrow(InvalidInputError)
  })

  it('throws InvalidInputError for non-string', () => {
    expect(() => formatPhone(null as unknown as string)).toThrow(InvalidInputError)
  })
})
