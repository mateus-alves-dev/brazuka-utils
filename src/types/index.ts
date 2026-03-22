export class BrUtilsError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'BrUtilsError'
    this.code = code
  }
}

export class InvalidInputError extends BrUtilsError {
  constructor(entity: string, value: string) {
    super(`Invalid ${entity}: "${value}"`, 'INVALID_INPUT')
    this.name = 'InvalidInputError'
  }
}

export interface CepData {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  provider: string
}

export interface CepProvider {
  name: string
  fetch(cep: string): Promise<CepData | null>
}

export interface CurrencyFormatOptions {
  showSymbol?: boolean
  symbol?: string
  decimals?: number
}
