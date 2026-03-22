import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cpf/index.ts',
    'src/cnpj/index.ts',
    'src/cep/index.ts',
    'src/phone/index.ts',
    'src/currency/index.ts',
    'src/plate/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
})
