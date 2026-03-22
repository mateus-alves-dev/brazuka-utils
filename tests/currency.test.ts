import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../src/currency/index.js'

describe('formatCurrency', () => {
  it('formats a positive value with default options', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00')
  })

  it('formats a negative value', () => {
    expect(formatCurrency(-1234.56)).toBe('R$ -1.234,56')
  })

  it('formats a large number', () => {
    expect(formatCurrency(1000000)).toBe('R$ 1.000.000,00')
  })

  it('formats a small decimal value', () => {
    expect(formatCurrency(0.5)).toBe('R$ 0,50')
  })

  it('formats without symbol when showSymbol is false', () => {
    expect(formatCurrency(1234.56, { showSymbol: false })).toBe('1.234,56')
  })

  it('formats with custom symbol', () => {
    expect(formatCurrency(1234.56, { symbol: 'US$' })).toBe('US$ 1.234,56')
  })

  it('formats with custom decimal places', () => {
    expect(formatCurrency(1234.5, { decimals: 3 })).toBe('R$ 1.234,500')
  })

  it('formats with zero decimal places', () => {
    expect(formatCurrency(1234.56, { decimals: 0 })).toBe('R$ 1.235')
  })

  it('formats integer value', () => {
    expect(formatCurrency(100)).toBe('R$ 100,00')
  })
})
