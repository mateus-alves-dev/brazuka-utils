import type { CurrencyFormatOptions } from '../types/index.js'

export function formatCurrency(value: number, options?: CurrencyFormatOptions): string {
  const showSymbol = options?.showSymbol ?? true
  const symbol = options?.symbol ?? 'R$'
  const decimals = options?.decimals ?? 2

  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)

  if (showSymbol) {
    return `${symbol} ${formatted}`
  }

  return formatted
}
