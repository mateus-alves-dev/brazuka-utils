import type { CepData, CepProvider } from '../types/index.js'
import { validateCEP } from './validate.js'

const TIMEOUT_MS = 5000

class BrasilAPIProvider implements CepProvider {
  name = 'BrasilAPI'

  async fetch(cep: string): Promise<CepData | null> {
    const url = `https://brasilapi.com.br/api/cep/v2/${cep}`
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })

    if (!response.ok) return null

    const data: unknown = await response.json()
    return this.normalize(data)
  }

  private normalize(data: unknown): CepData | null {
    if (typeof data !== 'object' || data === null) return null

    const record = data as Record<string, unknown>

    return {
      cep: String(record['cep'] ?? ''),
      state: String(record['state'] ?? ''),
      city: String(record['city'] ?? ''),
      neighborhood: String(record['neighborhood'] ?? ''),
      street: String(record['street'] ?? ''),
      provider: this.name,
    }
  }
}

class ViaCEPProvider implements CepProvider {
  name = 'ViaCEP'

  async fetch(cep: string): Promise<CepData | null> {
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })

    if (!response.ok) return null

    const data: unknown = await response.json()

    if (typeof data === 'object' && data !== null && 'erro' in data) {
      return null
    }

    return this.normalize(data)
  }

  private normalize(data: unknown): CepData | null {
    if (typeof data !== 'object' || data === null) return null

    const record = data as Record<string, unknown>

    return {
      cep: String(record['cep'] ?? '').replace(/\D/g, ''),
      state: String(record['uf'] ?? ''),
      city: String(record['localidade'] ?? ''),
      neighborhood: String(record['bairro'] ?? ''),
      street: String(record['logradouro'] ?? ''),
      provider: this.name,
    }
  }
}

const providers: CepProvider[] = [new BrasilAPIProvider(), new ViaCEPProvider()]

export async function lookupCEP(cep: string): Promise<CepData | null> {
  if (!validateCEP(cep)) return null

  const digits = cep.replace(/\D/g, '')

  for (const provider of providers) {
    try {
      const result = await provider.fetch(digits)
      if (result) return result
    } catch {
      // Provider failed, try next
    }
  }

  return null
}
