# CLAUDE.md — br-utils

This file guides Claude when working on the `br-utils` project.

-----

## Project Overview

**br-utils** is a modern TypeScript utility library for Brazilian developers.  
It provides validation, formatting, and data lookup for Brazilian-specific formats (CPF, CNPJ, CEP, phone, currency, etc.) with a first-class TypeScript experience, zero dependencies, and tree-shaking support.

-----

## Tech Stack

|Tool                       |Purpose                    |
|---------------------------|---------------------------|
|TypeScript 5+              |Language                   |
|tsup                       |Build (ESM + CJS + `.d.ts`)|
|vitest                     |Unit testing               |
|eslint + @typescript-eslint|Linting                    |
|prettier                   |Formatting                 |
|changesets                 |Versioning & changelog     |
|GitHub Actions             |CI/CD                      |

-----

## Project Structure

```
br-utils/
├── src/
│   ├── cpf/
│   │   ├── index.ts          # Public API exports
│   │   ├── validate.ts
│   │   ├── format.ts
│   │   └── generate.ts       # For testing purposes only
│   ├── cnpj/
│   │   ├── index.ts
│   │   ├── validate.ts
│   │   └── format.ts
│   ├── cep/
│   │   ├── index.ts
│   │   ├── validate.ts
│   │   └── lookup.ts         # Calls external API with fallback
│   ├── phone/
│   │   ├── index.ts
│   │   ├── validate.ts
│   │   └── format.ts
│   ├── currency/
│   │   ├── index.ts
│   │   └── format.ts
│   ├── plate/                # Placa veicular (Mercosul + antiga)
│   │   ├── index.ts
│   │   └── validate.ts
│   ├── types/
│   │   └── index.ts          # Shared types and interfaces
│   └── index.ts              # Root barrel — re-exports everything
├── tests/
│   ├── cpf.test.ts
│   ├── cnpj.test.ts
│   ├── cep.test.ts
│   ├── phone.test.ts
│   ├── currency.test.ts
│   └── plate.test.ts
├── CLAUDE.md
├── README.md
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts
```

-----

## Common Commands

```bash
# Install dependencies
pnpm install

# Run tests (watch mode)
pnpm test

# Run tests (single run + coverage)
pnpm test:ci

# Build the library (ESM + CJS + types)
pnpm build

# Lint
pnpm lint

# Format
pnpm format

# Create a new changeset (before opening a PR)
pnpm changeset

# Bump versions and update CHANGELOG
pnpm changeset version

# Publish to npm
pnpm release
```

-----

## Architecture Principles

### 1. Zero runtime dependencies

Never add dependencies to `dependencies` in `package.json`.  
`devDependencies` are fine. The `peerDependencies` field may only be used if a module targets a specific runtime (e.g. Node.js built-ins).

### 2. Tree-shakeable by design

Each module (`cpf`, `cnpj`, `cep`, etc.) must be independently importable.  
The root `src/index.ts` re-exports all modules but does **not** bundle logic — it only re-exports.

```ts
// ✅ Correct — user can import only what they need
import { validateCPF } from 'br-utils/cpf'

// ✅ Also supported
import { validateCPF, formatCNPJ } from 'br-utils'
```

### 3. Pure functions preferred

Avoid classes and stateful modules. Export plain functions.  
Exception: the CEP lookup module may use a class internally to manage provider fallback logic, but its public API must be a function.

### 4. Strict TypeScript

- `strict: true` is mandatory in `tsconfig.json`
- No use of `any` — use `unknown` and narrow properly
- All public functions must have explicit return types
- All public types must be exported from `src/types/index.ts`

### 5. Sync vs Async

- Validation and formatting functions are **always synchronous**
- Network operations (e.g. CEP lookup) are **always async** and return `Promise<T>`
- Async functions must handle errors gracefully and never throw uncaught

-----

## Module Conventions

### Validation functions

- Name: `validate{Entity}(value: string): boolean`
- Must accept formatted and unformatted strings
- Must return `false` (not throw) for invalid input

```ts
// ✅ Good
validateCPF('123.456.789-09') // true
validateCPF('12345678909')    // true
validateCPF('')               // false
validateCPF(null as any)      // false
```

### Format functions

- Name: `format{Entity}(value: string): string`
- Must throw `InvalidInputError` if the input is not a valid raw string
- Must return the formatted string with the canonical mask

```ts
// ✅ Good
formatCPF('12345678909') // '123.456.789-09'
```

### Lookup functions (async)

- Name: `lookup{Entity}(value: string): Promise<{Entity}Data | null>`
- Returns `null` if not found
- Never throws for 404s — only throws for unrecoverable errors

-----

## CEP Lookup — Provider Strategy

The `lookupCEP` function uses multiple providers with automatic fallback:

1. **BrasilAPI** (primary) — `https://brasilapi.com.br/api/cep/v2/{cep}`
1. **ViaCEP** (fallback) — `https://viacep.com.br/ws/{cep}/json/`

If the primary provider fails (network error or 404), the fallback is tried automatically.  
Both providers are abstracted behind a `CepProvider` interface so new ones can be added easily.

```ts
export interface CepProvider {
  name: string
  fetch(cep: string): Promise<CepData | null>
}
```

-----

## Error Handling

All custom errors extend `BrUtilsError`:

```ts
class BrUtilsError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'BrUtilsError'
  }
}

class InvalidInputError extends BrUtilsError {
  constructor(entity: string, value: string) {
    super(`Invalid ${entity}: "${value}"`, 'INVALID_INPUT')
  }
}
```

Export all error classes from `src/types/index.ts`.

-----

## Testing Guidelines

- Every public function must have unit tests in `tests/`
- Tests must cover: valid inputs, invalid inputs, edge cases, and formatted vs unformatted strings
- Use `vitest` — no Jest
- Mock all HTTP calls in CEP tests using `vi.mock` or MSW
- Aim for **100% coverage** on validation and format modules
- Coverage for lookup modules should be ≥ 90%

```ts
// Example pattern
describe('validateCPF', () => {
  it('validates a correctly formatted CPF', () => {
    expect(validateCPF('123.456.789-09')).toBe(true)
  })

  it('validates an unformatted CPF', () => {
    expect(validateCPF('12345678909')).toBe(true)
  })

  it('rejects invalid CPF', () => {
    expect(validateCPF('111.111.111-11')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(validateCPF('')).toBe(false)
  })
})
```

-----

## Build Output

`tsup` produces three artifacts in `dist/`:

```
dist/
├── index.js        # CJS
├── index.mjs       # ESM
└── index.d.ts      # TypeScript declarations
```

Each sub-module also gets its own entry point:

```
dist/
├── cpf/
│   ├── index.js
│   ├── index.mjs
│   └── index.d.ts
├── cnpj/
│   └── ...
```

The `package.json` must have correct `exports` map:

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./cpf": {
      "import": "./dist/cpf/index.mjs",
      "require": "./dist/cpf/index.js",
      "types": "./dist/cpf/index.d.ts"
    }
  }
}
```

-----

## Versioning & Publishing

This project uses [Changesets](https://github.com/changesets/changesets).

- **patch** — bug fixes, internal refactors
- **minor** — new functions, new modules
- **major** — breaking API changes

Every PR that changes public API **must** include a changeset file.  
Publishing is automated via GitHub Actions on merge to `main`.

-----

## What Claude Should NOT Do

- Do not add runtime `dependencies` to `package.json`
- Do not use `any` type — use `unknown` and narrow
- Do not use `class` in public API — use functions
- Do not add logic to `src/index.ts` — it is a barrel file only
- Do not write tests that make real HTTP requests — always mock
- Do not publish to npm manually — use the CI pipeline
- Do not skip changeset for PRs that touch `src/`