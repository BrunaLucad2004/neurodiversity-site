# CEDOMCA API

API REST do acervo digital do Centro de Documentação Musical do Cariri, desenvolvida com NestJS.

## Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://docs.docker.com/engine/install/) e [Docker Compose](https://docs.docker.com/compose/install/)

## Iniciando a aplicação

```bash
# Suba o Redis local
docker compose up -d

# Clone o repositório e acesse a pasta
cd backend

# Copie o arquivo de variáveis de ambiente
cp .env.example .env

# Instale as dependências
npm install

# Inicie em modo desenvolvimento
npm run start:dev
```

Acesse `http://localhost:3000/swagger` para explorar a documentação da API.

## Scripts disponíveis

| Script | Descrição |
| :--- | :--- |
| `start` | Inicia a aplicação sem watch mode |
| `start:dev` | Inicia a aplicação em watch mode |
| `start:prod` | Inicia a aplicação em modo produção |
| `build` | Gera o build de produção |
| `test` | Roda os testes unitários |
| `test:ci` | Roda os testes em ambiente CI |
| `test:cov` | Roda os testes com cobertura |
| `test:e2e` | Roda os testes end-to-end |
| `format` | Formata o código com Prettier |
| `format:check` | Verifica a formatação sem alterar |
| `lint` | Analisa e corrige o código com ESLint |
| `seed` | Popula o banco com dados predefinidos |

## Variáveis de ambiente

Consulte o arquivo `.env.example` na raiz do projeto — cada variável está documentada com sua descrição.

## Produção

| | |
| :--- | :--- |
| **Banco de dados** | MongoDB Atlas |
| **Cache/Sessão** | Redis (Render) |