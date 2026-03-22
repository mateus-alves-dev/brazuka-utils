import { describe, it, expect } from 'vitest'
import { validatePlate } from '../src/plate/index.js'

describe('validatePlate', () => {
  // Old format: ABC-1234
  it('validates old format with hyphen', () => {
    expect(validatePlate('ABC-1234')).toBe(true)
  })

  it('validates old format without hyphen', () => {
    expect(validatePlate('ABC1234')).toBe(true)
  })

  it('validates old format lowercase (case insensitive)', () => {
    expect(validatePlate('abc-1234')).toBe(true)
  })

  // Mercosul format: ABC1D23
  it('validates Mercosul format', () => {
    expect(validatePlate('ABC1D23')).toBe(true)
  })

  it('validates Mercosul format lowercase', () => {
    expect(validatePlate('abc1d23')).toBe(true)
  })

  it('validates Mercosul format mixed case', () => {
    expect(validatePlate('Abc1D23')).toBe(true)
  })

  // Invalid plates
  it('rejects plate with wrong format', () => {
    expect(validatePlate('12A-1234')).toBe(false)
  })

  it('rejects plate with too few characters', () => {
    expect(validatePlate('AB-123')).toBe(false)
  })

  it('rejects plate with too many characters', () => {
    expect(validatePlate('ABCD-12345')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(validatePlate('')).toBe(false)
  })

  it('rejects non-string input', () => {
    expect(validatePlate(null as unknown as string)).toBe(false)
    expect(validatePlate(undefined as unknown as string)).toBe(false)
  })

  it('rejects all-digit string', () => {
    expect(validatePlate('1234567')).toBe(false)
  })

  it('rejects all-letter string', () => {
    expect(validatePlate('ABCDEFG')).toBe(false)
  })
})
