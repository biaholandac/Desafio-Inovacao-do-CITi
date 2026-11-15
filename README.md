# LegaCITi

**A memória coletiva do CITi.** O LegaCITi junta a experiência de todas as gerações que passaram pela empresa, encontra padrões que nenhuma pessoa sozinha conseguiria ver e entrega isso de volta para quem está fazendo o trabalho agora.

Projeto desenvolvido por Beatriz para o desafio de Inovação do Processo Seletivo do CITi 2026.2.

> **Dados simulados.** Todos os personagens, clientes e casos usados na demonstração são fictícios.

## Status

Em construção. Base do projeto criada e dados da simulação carregados.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `src/app` | Páginas do LegaCITi (Next.js) |
| `src/data` | Dados da simulação usados pelo produto: 115 casos de 83 personagens |
| `simulacao` | Versões legíveis dos personagens, casos e retratos das gestões |

## Como rodar

```bash
npm install
npm run dev
```

Depois, abra http://localhost:3000.

## Tecnologias

- Next.js (JavaScript)
- Gemini API, no plano gratuito, para a IA dentro do produto
- Vercel, para colocar o produto no ar
