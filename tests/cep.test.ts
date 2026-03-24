import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateCEP } from '../src/cep/validate.js'
import { lookupCEP } from '../src/cep/lookup.js'

describe('validateCEP', () => {
  it('validates a correctly formatted CEP', () => {
    expect(validateCEP('01001-000')).toBe(true)
  })

  it('validates an unformatted CEP', () => {
    expect(validateCEP('01001000')).toBe(true)
  })

  it('rejects CEP with wrong length', () => {
    expect(validateCEP('0100100')).toBe(false)
    expect(validateCEP('010010001')).toBe(false)
  })

  it('rejects all zeros', () => {
    expect(validateCEP('00000000')).toBe(false)
    expect(validateCEP('00000-000')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(validateCEP('')).toBe(false)
  })

  it('returns false for non-string input', () => {
    expect(validateCEP(null as unknown as string)).toBe(false)
    expect(validateCEP(undefined as unknown as string)).toBe(false)
  })
})

describe('lookupCEP', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns CepData from primary provider (BrasilAPI)', async () => {
    const mockResponse = {
      cep: '01001000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Sé',
      street: 'Praça da Sé',
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    )

    const result = await lookupCEP('01001000')

    expect(result).toEqual({
      cep: '01001000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Sé',
      street: 'Praça da Sé',
      provider: 'BrasilAPI',
    })
  })

  it('falls back to ViaCEP when BrasilAPI fails', async () => {
    const viaCepResponse = {
      cep: '01001-000',
      uf: 'SP',
      localidade: 'São Paulo',
      bairro: 'Sé',
      logradouro: 'Praça da Sé',
    }

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(viaCepResponse),
        }),
    )

    const result = await lookupCEP('01001000')

    expect(result).toEqual({
      cep: '01001000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Sé',
      street: 'Praça da Sé',
      provider: 'ViaCEP',
    })
  })

  it('returns null when both providers fail', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error')),
    )

    const result = await lookupCEP('01001000')
    expect(result).toBeNull()
  })

  it('returns null when primary returns 404 and fallback returns error', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ erro: true }),
        }),
    )

    const result = await lookupCEP('99999999')
    expect(result).toBeNull()
  })

  it('returns null for invalid CEP input', async () => {
    const result = await lookupCEP('invalid')
    expect(result).toBeNull()
  })

  it('returns null for empty CEP', async () => {
    const result = await lookupCEP('')
    expect(result).toBeNull()
  })

  it('returns null for all-zeros CEP', async () => {
    const result = await lookupCEP('00000000')
    expect(result).toBeNull()
  })

  it('handles BrasilAPI returning non-object data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(null),
      }),
    )

    const result = await lookupCEP('01001000')
    // BrasilAPI returns null from normalize, then ViaCEP is not called (no second mock)
    expect(result).toBeNull()
  })

  it('handles BrasilAPI returning not-ok and ViaCEP returning not-ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 500 })
        .mockResolvedValueOnce({ ok: false, status: 500 }),
    )

    const result = await lookupCEP('01001000')
    expect(result).toBeNull()
  })

  it('handles ViaCEP returning non-object data', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(null),
        }),
    )

    const result = await lookupCEP('01001000')
    expect(result).toBeNull()
  })

  it('handles BrasilAPI returning string data from json', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve('not an object'),
      }),
    )

    const result = await lookupCEP('01001000')
    expect(result).toBeNull()
  })

  it('handles BrasilAPI returning object with missing fields (triggers ?? fallbacks)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    )

    const result = await lookupCEP('01001000')
    expect(result).toEqual({
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      street: '',
      provider: 'BrasilAPI',
    })
  })

  it('handles ViaCEP returning object with missing fields (triggers ?? fallbacks)', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        }),
    )

    const result = await lookupCEP('01001000')
    expect(result).toEqual({
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      street: '',
      provider: 'ViaCEP',
    })
  })

  it('accepts formatted CEP with hyphen', async () => {
    const mockResponse = {
      cep: '01001000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Sé',
      street: 'Praça da Sé',
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    )

    const result = await lookupCEP('01001-000')
    expect(result).not.toBeNull()
    expect(result?.provider).toBe('BrasilAPI')
  })
})
