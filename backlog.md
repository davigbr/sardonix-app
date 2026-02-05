# Backlog de Funcionalidades - Sardonix

Este arquivo rastreia as próximas funcionalidades e melhorias planejadas para o projeto.

## Funcionalidades Solicitadas

- [x] **Importação/Exportação CSV**
  - Script para exportar verbos para um arquivo CSV (para manipulação em planilhas).
  - Script para importar o CSV e atualizar os arquivos `.json`, com verificação de consistência dos dados.
- [ ] **Verbos Modais e Defectivos**
  - Adicionar tags específicas e tratamento especial na exibição de conjugações para verbos modais e defectivos.

- [x] **Favoritos**
  - Implementar sistema de "favoritar" verbos.
  - Salvar favoritos no `localStorage`.
  - Filtro para exibir apenas favoritos. favoritos.

- [ ] **Novos Filtros**
  - Filtro por **Verbos Irregulares**.
  - Filtro por **Phrasal Verbs**.
  - Filtro por **Favoritos** (como mencionado acima).

- [ ] **Inglês Britânico**
  - Incluir variações de grafia britânica no banco de dados (ex: `analyse` vs `analyze`, `color` vs `colour`).

- [ ] **Expansão e Organização de Tempos Verbais**
  - Reorganizar a tabela de conjugação, agrupando os tempos para melhor visualização.
  - Adicionar tooltips ou uma seção de ajuda com explicações para cada tempo:
    - **Simple Present**: Describes habits, general facts, or actions happening now.
    - **Present Progressive / Continuous**: Describes ongoing actions happening right now.
    - **Present Perfect**: Describes completed actions or experiences that connect the past to the present.
    - **Present Perfect Progressive / Continuous**: Describes ongoing actions that started in the past and continue to the present.
    - **Simple Past**: Describes completed actions in the past.
    - **Past Progressive / Continuous**: Describes ongoing actions in the past.
    - **Past Perfect**: Describes completed actions that occurred before another past action.
    - **Past Perfect Progressive / Continuous**: Describes ongoing actions that started and continued before another past action.
    - **Future Simple**: Describes actions that will happen in the future.
    - **Future Progressive / Continuous**: Describes ongoing actions in the future.
    - **Future Perfect**: Describes actions that will be completed before a specific future time.
    - **Future Perfect Progressive / Continuous**: Describes ongoing actions that will continue until a specific future time.
    - **Conditional**: Describes hypothetical situations or actions dependent on certain conditions.
    - **Conditional Progressive / Continuous**: Describes hypothetical ongoing actions dependent on certain conditions.
    - **Conditional Perfect**: Describes hypothetical completed actions dependent on certain conditions.
    - **Conditional Perfect Progressive / Continuous**: Describes hypothetical ongoing actions that would have continued dependent on certain conditions.

- [ ] **Manutenção**
  - [x] **Limpeza de Arquivos**: Identificar e remover arquivos que não são mais utilizados no projeto.
