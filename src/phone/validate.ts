// Valid Brazilian DDDs (area codes)
const VALID_DDDS = new Set([
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19, // São Paulo
  21,
  22,
  24, // Rio de Janeiro
  27,
  28, // Espírito Santo
  31,
  32,
  33,
  34,
  35,
  37,
  38, // Minas Gerais
  41,
  42,
  43,
  44,
  45,
  46, // Paraná
  47,
  48,
  49, // Santa Catarina
  51,
  53,
  54,
  55, // Rio Grande do Sul
  61, // Distrito Federal
  62,
  64, // Goiás
  63, // Tocantins
  65,
  66, // Mato Grosso
  67, // Mato Grosso do Sul
  68, // Acre
  69, // Rondônia
  71,
  73,
  74,
  75,
  77, // Bahia
  79, // Sergipe
  81,
  87, // Pernambuco
  82, // Alagoas
  83, // Paraíba
  84, // Rio Grande do Norte
  85,
  88, // Ceará
  86,
  89, // Piauí
  91,
  93,
  94, // Pará
  92,
  97, // Amazonas
  95, // Roraima
  96, // Amapá
  98,
  99, // Maranhão
])

export function validatePhone(value: string): boolean {
  if (typeof value !== 'string') return false

  const digits = value.replace(/\D/g, '')

  // Mobile: 11 digits (DD + 9 + 8 digits), Landline: 10 digits (DD + 8 digits)
  if (digits.length !== 10 && digits.length !== 11) return false

  const ddd = parseInt(digits.slice(0, 2), 10)
  if (!VALID_DDDS.has(ddd)) return false

  // Mobile numbers must start with 9 after the DDD
  if (digits.length === 11 && digits.charAt(2) !== '9') return false

  // Landline numbers must start with 2-5 after the DDD
  if (digits.length === 10) {
    const firstDigit = parseInt(digits.charAt(2), 10)
    if (firstDigit < 2 || firstDigit > 5) return false
  }

  return true
}
