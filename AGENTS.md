# Prompt para Geração de SPA de Cálculo de IRRF 2026 (Frontend Only)

## Objetivo

Gerar o código-fonte completo de uma **Single Page Application (SPA)**, utilizando o *scaffold* `web-static` (Vite + React + TypeScript + TailwindCSS), para realizar o cálculo detalhado do Imposto de Renda Retido na Fonte (IRRF) mensal, conforme as novas regras estabelecidas pela **Lei nº 15.270/2025** e a **Instrução Normativa RFB nº 2.299, de 17 de dezembro de 2025**.

A aplicação deve ser estritamente *frontend-only* e projetada para futura hospedagem em ambiente *serverless* (ex: Google Cloud Storage ou Firebase Hosting).

## Especificações Técnicas e de Projeto

### 1. Estrutura do Projeto

*   **Tecnologias:** Vite + React + TypeScript + TailwindCSS.
*   **Repositório Remoto:** O código deve ser inicializado e estruturado para ser enviado para o repositório `https://github.com/fagner-net/calculadora-irrf-2026-gemini`.
*   **Desenvolvimento Local (Docker):**
    *   A aplicação deve ser configurada para rodar em um contêiner Docker.
    *   A porta padrão do servidor de desenvolvimento (ex: 5173 do Vite) deve ser mapeada para a porta `[PORTA_PADRÃO] + 495` no host (ex: 5173 + 495 = 5668). O `Dockerfile` e o `docker-compose.yml` devem refletir essa configuração.

### 2. Funcionalidades da Interface (UI/UX)

*   **Design:** Utilizar TailwindCSS para um design moderno, responsivo e limpo, focado na usabilidade.
*   **Campos de Entrada:**
    *   `Remuneração Bruta (R$)`: Campo obrigatório.
    *   `Dedução por Dependentes (Nº)`: Número de dependentes.
    *   `Pensão Alimentícia (R$)`: Valor mensal.
    *   `Previdência Oficial (INSS) (R$)`: Valor mensal.
    *   `Outras Deduções (R$)`: Valor mensal (ex: Previdência Privada, FAPI, etc.).
*   **Botão de Opção (Toggle):**
    *   `Aposentado/Pensionista com 65 anos ou mais`: Um *toggle* ou *checkbox* que, quando ativado, aplica a isenção adicional.
*   **Exibição de Resultados:** Os resultados devem ser exibidos em duas colunas lado a lado, comparando o **Cálculo Completo (Deduções Legais)** com o **Cálculo Simplificado**.

### 3. Regras de Cálculo (IRRF Mensal 2026)

O cálculo deve ser baseado na **Tabela Progressiva Mensal** e no **Mecanismo de Redução (Redutor)**, conforme a legislação de 2026.

#### 3.1. Variáveis de Cálculo

1.  **Rendimentos Tributáveis (RT):** `Remuneração Bruta` - `Previdência Oficial (INSS)` - `Outras Deduções`.
2.  **Deduções Legais (DL):** `Pensão Alimentícia` + (`Nº de Dependentes` * `Valor por Dependente`).
    *   **Valor por Dependente:** R$ 189,59 (Manter este valor, que é o último conhecido e amplamente utilizado).
3.  **Base de Cálculo (BC):** `RT` - `DL`.

#### 3.2. Tabela Progressiva Mensal (Base para o Cálculo Bruto)

| Faixa da Base de Cálculo (BC) | Alíquota (%) | Parcela a Deduzir (R$) |
| :---------------------------- | :----------- | :--------------------- |
| Até R$ 2.428,80               | 0,0%         | R$ 0,00                |
| De R$ 2.428,81 a R$ 2.826,65  | 7,5%         | R$ 182,16              |
| De R$ 2.826,66 a R$ 3.751,05  | 15,0%        | R$ 394,16              |
| De R$ 3.751,06 a R$ 4.664,68  | 22,5%        | R$ 675,48              |
| Acima de R$ 4.664,68          | 27,5%        | R$ 908,72              |

#### 3.3. Cálculo do Imposto Bruto (IB)

Aplicar a Tabela Progressiva (3.2) sobre a **Base de Cálculo (BC)**.

#### 3.4. Mecanismo de Redução (Redutor)

O valor da redução (`Redutor`) deve ser subtraído do `Imposto Bruto (IB)`.

*   **Se RT ≤ R$ 5.000,00:** `Redutor` = `IB` (O imposto final deve ser zero, limitado a R$ 312,89).
*   **Se R$ 5.000,01 ≤ RT ≤ R$ 7.350,00:**
    `Redutor` = R$ 978,62 - (0,133145 * RT)
    *   *Nota:* O `Redutor` é limitado ao valor do `Imposto Bruto (IB)`.
*   **Se RT > R$ 7.350,00:** `Redutor` = R$ 0,00.

#### 3.5. Imposto a Reter (IRRF)

`IRRF` = `Imposto Bruto (IB)` - `Redutor`.

#### 3.6. Isenção para Maiores de 65 Anos

Se o *toggle* for ativado, a parcela isenta é de **R$ 1.903,98**. Este valor deve ser subtraído dos `Rendimentos Tributáveis (RT)` antes de calcular a `Base de Cálculo (BC)`.

#### 3.7. Cálculo Simplificado

1.  **Dedução Simplificada (DS):** R$ 607,20.
2.  **Base de Cálculo Simplificada (BCS):** `RT` - `DS`.
3.  **Cálculo do Imposto Simplificado:** Aplicar as regras (3.2 a 3.5) sobre a `BCS` e o `RT` (para o Redutor).

### 4. Detalhamento do Cálculo (Foco Principal)

A aplicação deve exibir um detalhamento minucioso, similar ao simulador da RFB, para ambos os métodos de cálculo:

1.  **Demonstrativo das Variáveis:** Exibir claramente os valores de `Remuneração Bruta`, `Rendimentos Tributáveis (RT)`, `Deduções Legais (DL)` ou `Dedução Simplificada (DS)`, e `Base de Cálculo (BC)`.
2.  **Demonstrativo da Apuração do Imposto (Alocação por Faixas):**
    *   Para a `Base de Cálculo (BC)` encontrada, detalhar como o valor foi distribuído nas 5 faixas da Tabela Progressiva (3.2).
    *   Exibir a tabela com as colunas: `Faixa da Base de Cálculo`, `Valor Alocado na Faixa`, `Alíquota (%)`, `Valor do Imposto na Faixa`.
    *   Totalizar o `Valor do Imposto na Faixa` para obter o `Imposto Bruto (IB)`.
3.  **Detalhe do Redutor:**
    *   Explicar a aplicação do Mecanismo de Redução (3.4).
    *   Mostrar o valor do `Redutor` calculado e o `IRRF` final.
4.  **Escolha Vantajosa:** Ao final, a aplicação deve indicar qual dos dois métodos (`Cálculo Completo` ou `Cálculo Simplificado`) resultou no menor `IRRF` a reter, destacando o valor final.

## Estrutura do Código

O código deve ser modular, com a lógica de cálculo isolada em um arquivo de serviço (`src/services/irrf-calculator.ts`) e os componentes React focados na apresentação.

---
*Fim do Prompt.*
