# CEDOMCA — Frontend

Interface web do acervo digital do Centro de Documentação Musical do Cariri.

## Tecnologias

- React 18
- Material UI (MUI) 5
- React Router 6
- Axios
- React Testing Library

## Pré-requisitos

- Node.js 18+
- npm 9+

## Configuração local

1. Clone o repositório e acesse a pasta:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Copie o arquivo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

   O frontend sobe em [http://localhost:8081](http://localhost:8081).  
   O backend precisa estar rodando em `http://localhost:3000`.

## Scripts disponíveis

| Script | O que faz |
|---|---|
| `npm start` | Sobe o servidor de desenvolvimento na porta 8081 |
| `npm run build` | Gera o build de produção na pasta `build/` |
| `npm test` | Roda os testes em modo watch |
| `npm run test:ci` | Roda os testes uma vez com cobertura (usado no CI) |
| `npm run lint` | Verifica erros de lint no código |
| `npm run format` | Formata o código com Prettier |
| `npm run format:check` | Verifica se o código está formatado |

## Estrutura de pastas

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React (auth, etc.)
├── hooks/          # Hooks customizados
├── pages/          # Páginas da aplicação
└── services/       # Chamadas à API e utilitários
```

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `REACT_APP_API_URL` | URL base da API do backend | `http://localhost:3000` |
