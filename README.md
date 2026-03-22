# brazuka-utils

Uma moderna biblioteca de utilitários TypeScript para desenvolvedores brasileiros.  
Validação, formatação e busca de dados para CPF, CNPJ, CEP, telefone, moeda e placas veiculares — com zero dependências e suporte completo a tree-shaking.

## Instalação

```bash
npm install brazuka-utils
# ou
pnpm add brazuka-utils
# ou
yarn add brazuka-utils
```

## Uso

Você pode importar do root ou de módulos individuais para otimizar o tree-shaking:

```ts
// Importar tudo
import { validateCPF, formatCNPJ, lookupCEP } from 'brazuka-utils'

// Ou importar apenas o que precisa (tree-shakeable)
import { validateCPF } from 'brazuka-utils/cpf'
import { formatCNPJ } from 'brazuka-utils/cnpj'
```

## Referência da API

### CPF

```ts
import { validateCPF, formatCPF, generateCPF } from 'brazuka-utils/cpf'

validateCPF('123.456.789-09') // true
validateCPF('12345678909')    // true
validateCPF('111.111.111-11') // false (todos os dígitos iguais)
validateCPF('inválido')       // false

formatCPF('12345678909')      // '123.456.789-09'
formatCPF('inválido')         // lança InvalidInputError

generateCPF()                 // '52998224725' (CPF válido aleatório para testes)
```

### CNPJ

```ts
import { validateCNPJ, formatCNPJ } from 'brazuka-utils/cnpj'

validateCNPJ('11.222.333/0001-81') // true
validateCNPJ('11222333000181')     // true
validateCNPJ('11.111.111/1111-11') // false

formatCNPJ('11222333000181')       // '11.222.333/0001-81'
formatCNPJ('inválido')             // lança InvalidInputError
```

### CEP

```ts
import { validateCEP, lookupCEP } from 'brazuka-utils/cep'

validateCEP('01001-000') // true
validateCEP('01001000')  // true
validateCEP('00000000')  // false

const address = await lookupCEP('01001000')
// {
//   cep: '01001000',
//   state: 'SP',
//   city: 'São Paulo',
//   neighborhood: 'Sé',
//   street: 'Praça da Sé',
//   provider: 'BrasilAPI'
// }

await lookupCEP('99999999') // null (não encontrado)
```

A função `lookupCEP` usa **BrasilAPI** como provedor primário com fallback automático para **ViaCEP**.

### Telefone

```ts
import { validatePhone, formatPhone } from 'brazuka-utils/phone'

validatePhone('(11) 98765-4321') // true (celular)
validatePhone('11987654321')     // true (celular)
validatePhone('(11) 3456-7890')  // true (fixo)
validatePhone('1134567890')      // true (fixo)
validatePhone('10987654321')     // false (DDD inválido)

formatPhone('11987654321')       // '(11) 98765-4321'
formatPhone('1134567890')        // '(11) 3456-7890'
```

### Moeda

```ts
import { formatCurrency } from 'brazuka-utils/currency'

formatCurrency(1234.56)                          // 'R$ 1.234,56'
formatCurrency(1234.56, { showSymbol: false })    // '1.234,56'
formatCurrency(1234.56, { symbol: 'US$' })        // 'US$ 1.234,56'
formatCurrency(1234.56, { decimals: 0 })          // 'R$ 1.235'
```

### Placa Veicular

```ts
import { validatePlate } from 'brazuka-utils/plate'

validatePlate('ABC-1234')  // true (formato antigo)
validatePlate('ABC1234')   // true (formato antigo, sem hífen)
validatePlate('ABC1D23')   // true (formato Mercosul)
validatePlate('abc1d23')   // true (case insensitive)
validatePlate('inválido')  // false
```

## Tratamento de Erros

Todas as funções de formatação lançam `InvalidInputError` para entrada inválida:

```ts
import { InvalidInputError, BrUtilsError } from 'brazuka-utils'

try {
  formatCPF('inválido')
} catch (error) {
  if (error instanceof InvalidInputError) {
    console.log(error.code)    // 'INVALID_INPUT'
    console.log(error.message) // 'Invalid CPF: \"inválido\"'
  }
}
```

## Características

- **Zero dependências** — nenhuma dependência em tempo de execução
- **Tree-shakeable** — importe apenas o que precisa
- **TypeScript-first** — definições de tipo completas incluídas
- **Formato duplo** — builds ESM e CJS
- **Validação rigorosa** — segue algoritmos oficiais (mod-11 para CPF/CNPJ, validação de DDD para telefones)
- **Fallback automático** — busca de CEP com múltiplos provedores

## Requisitos

- Node.js >= 18

## Licença

MIT
