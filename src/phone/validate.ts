// Valid Brazilian DDDs (area codes)
const VALID_DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
  21, 22, 24, 27, 28,                  // RJ, ES
  31, 32, 33, 34, 35, 37, 38,          // MG
  41, 42, 43, 44, 45, 46,              // PR
  47, 48, 49,                          // SC
  51, 53, 54, 55,                      // RS
  61, 62, 63, 64, 65, 66, 67, 68, 69,  // DF, GO, TO, MT, MS, AC, RO
  71, 73, 74, 75, 77, 79,              // BA, SE
  81, 82, 83, 84, 85, 86, 87, 88, 89,  // PE, AL, PB, RN, CE, PI
  91, 92, 93, 94, 95, 96, 97, 98, 99,  // PA, AM, RR, AP, MA
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
