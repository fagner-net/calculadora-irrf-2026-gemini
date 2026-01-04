# Calculadora IRRF 2026 (SPA)

## Visão Geral do Projeto

Este projeto é uma **Single Page Application (SPA)** desenvolvida para calcular o Imposto de Renda Retido na Fonte (IRRF) mensal, conforme as novas regras da **Lei nº 15.270/2025** e **Instrução Normativa RFB nº 2.299/2025**.

A aplicação permite comparar o cálculo completo (com deduções legais) e o cálculo simplificado, indicando a opção mais vantajosa para o contribuinte.

## Especificações Técnicas

*   **Framework:** React 18+ (Vite)
*   **Linguagem:** TypeScript
*   **Estilização:** TailwindCSS v4
*   **Infraestrutura:** Docker (Dev)
*   **Deploy Alvo:** Serverless (Google Cloud Storage / Firebase)

## Estrutura do Projeto

```text
/
├── src/
│   ├── components/
│   │   ├── InputGroup.tsx       # Componente de entrada de dados
│   │   └── ResultSection.tsx    # Exibição detalhada dos resultados
│   ├── services/
│   │   └── irrf-calculator.ts   # Lógica de cálculo (Core)
│   ├── App.tsx                  # Componente Principal e Estado
│   └── index.css                # Configuração do Tailwind v4
├── Dockerfile                   # Configuração de imagem Docker
├── docker-compose.yml           # Orquestração local
└── postcss.config.js            # Configuração do PostCSS
```

## Regras de Negócio Implementadas

### 1. Parâmetros de Cálculo
*   **Tabela Progressiva 2026:** Faixas de isenção até 27.5%.
*   **Dedução por Dependente:** R$ 189,59.
*   **Dedução Simplificada:** R$ 607,20.
*   **Isenção 65+:** R$ 1.903,98 (deduzida da base).

### 2. Mecanismo de Redução (Redutor)
*   Implementado conforme Art. 3º da IN RFB 2299/2025:
    *   Rendimentos até R$ 5.000,00: Redutor igual ao imposto devido (Isenção efetiva).
    *   Rendimentos entre R$ 5.000,01 e R$ 7.350,00: Fórmula gradual.
    *   Acima de R$ 7.350,00: Sem redutor.

## Como Executar

### Via Docker (Recomendado)

```bash
docker compose up
```
Acesse em: `http://localhost:5668`

### Via Node.js (Local)

```bash
npm install
npm run dev
```
Acesse em: `http://localhost:5173`

## Comandos Úteis

*   **Build de Produção:** `npm run build`
*   **Lint:** `npm run lint`