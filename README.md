# Frontend - Olho no Verde

Este é o projeto de frontend da startup guarani, que visa criar uma plataforma para compra e venda de creditos de carbono

## Visão Geral da Arquitetura

O projeto foi estruturado para ser escalável e de fácil manutenção. As principais decisões de arquitetura estão nos diretórios dentro de `src/`:

-   `src/api`: **(Endpoints da API)** Centraliza toda a comunicação com a API backend.
    -   `index.js`: Configuração central do cliente Axios, incluindo interceptors para injeção de token JWT.
    -   **Arquivos por recurso** (`projects.js`, `users.js`, `auth.js`, etc.): Cada arquivo agrupa os endpoints relacionados a um recurso específico da API (ex: todas as chamadas para `/projects/*` estão em `projects.js`).

-   `src/assets`: Para arquivos estáticos como imagens, fontes e ícones.

-   `src/components`: Contém componentes Vue reutilizáveis (ex: botões, modais, cards).

-   `src/router`: Contém a configuração do `vue-router`. O arquivo `index.js` define todas as rotas da aplicação.

-   `src/store`: Contém as "stores" do Pinia para gerenciamento de estado global.
    -   `auth.js`: Gerencia o estado de autenticação, incluindo o token JWT e informações do usuário.

-   `src/styles`: Para arquivos de estilização globais (CSS).

-   `src/utils`: Para funções auxiliares e utilitários JavaScript que podem ser usados em qualquer parte da aplicação.

-   `src/views`: Contém os componentes de página, que são renderizados pelo `vue-router`. Cada arquivo aqui representa uma página da aplicação (ex: `Home.vue`, `Login.vue`).

## Como Começar

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18.x ou superior)
-   [NPM](https://www.npmjs.com/) (geralmente vem com o Node.js)

### 1. Instalação

Clone o repositório e instale as dependências:

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências do projeto
npm install
```

### 2. Variáveis de Ambiente

Este projeto precisa de uma variável de ambiente para se comunicar com a API.

1.  Crie um arquivo chamado `.env` na raiz da pasta `frontend`.
2.  Adicione a seguinte linha a ele, substituindo pela URL da sua API se for diferente:

```
VITE_API_URL=http://localhost:8000/api
```

### 3. Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5173` (ou outra porta, se a 5173 estiver em uso).

## Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento com Hot-Reload.
-   `npm run build`: Compila e minifica o projeto para produção na pasta `dist/`.
-   `npm run preview`: Inicia um servidor local para visualizar a versão de produção (após executar `npm run build`).