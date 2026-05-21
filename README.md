# ✅ TaskManager API

API REST para gerenciamento de usuários, times, membros e tarefas.

Este projeto foi desenvolvido como um **desafio prático da Rocketseat** 🚀.

> [!NOTE]
> Este projeto foi feito **95% na mão**, sem depender de IA durante a maior parte do desenvolvimento.
> A ideia foi treinar mais o raciocínio, tomada de decisão e entendimento real da implementação.
> A IA foi usada apenas nos momentos em que o progresso travou por muito tempo — e, mesmo assim, com foco em **explicação** do que estava sendo feito, não em simplesmente gerar código.

## 📌 Tecnologias

- `Node.js`
- `TypeScript`
- `Express`
- `Prisma ORM`
- `PostgreSQL`
- `Zod`
- `JWT`
- `Jest`
- `Supertest`

## ✨ Funcionalidades

- Cadastro e listagem de usuários
- Login com autenticação via JWT
- CRUD de times
- Adição, remoção e listagem de membros em times
- CRUD de tarefas
- Atribuição de tarefas para usuários
- Atualização de status com histórico
- Controle de permissões para `admin` e `member`
- Testes automatizados com `Jest` + `Supertest`

## 🔐 Regras de acesso

- `admin`
  - gerencia usuários, times e tarefas livremente
  - pode visualizar logs de alteração de status

- `member`
  - visualiza e gerencia apenas as próprias tarefas
  - só pode criar tarefas em times dos quais faz parte
  - só pode atribuir tarefas a usuários que pertencem ao mesmo time

## 📁 Estrutura

```txt
src/
  configs/
  controllers/
  middlewares/
  routes/
  utils/
  libs/
  generated/
tests/
prisma/
```

## ⚙️ Como rodar localmente

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Use o arquivo `.env.example` como base:

```env
PORT=3333
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dbname?schema=public"
JWT_SECRET=
```

### 3. Rode as migrations

```bash
npm run prisma:migrate -- --name init
```

### 4. Gere o Prisma Client

```bash
npm run prisma:generate
```

### 5. Rode o projeto em desenvolvimento

```bash
npm run dev
```

API disponível em:

```txt
http://localhost:3333
```

Health check:

```txt
GET /health
```

## 🧪 Testes

Rodar a suíte:

```bash
npm test
```

Modo watch:

```bash
npm run test:watch
```

Cobertura:

```bash
npm run test:coverage
```

## 📚 Endpoints

### Health

- `GET /health`

### Users

- `POST /users`
- `GET /users`

### Sessions

- `POST /sessions`

### Teams

- `POST /teams`
- `GET /teams`
- `PATCH /teams/:id`
- `DELETE /teams/:id`

### Team Members

- `POST /teams/:teamId/members`
- `GET /teams/:teamId/members`
- `DELETE /teams/:teamId/members/:userId`

### Tasks

- `POST /tasks/teams/:teamId`
- `GET /tasks`
- `PUT /tasks/:taskId`
- `DELETE /tasks/:taskId`
- `PATCH /tasks/:taskId/assignee`
- `PATCH /tasks/:taskId/status`
- `GET /tasks/:taskId/logs`

## 🔎 Filtros disponíveis

No endpoint `GET /tasks`, é possível filtrar por:

- `status`
- `priority`

Exemplo:

```txt
GET /tasks?status=pending&priority=high
```

## 🚀 Build e produção

Build:

```bash
npm run build
```

Start de produção:

```bash
npm run start
```

Deploy com Prisma:

```bash
npm run prisma:migrate:deploy
```

## 🌐 Deploy

Deploy publicado em:

```txt
https://taskmanager-production-32e6.up.railway.app/health
```

## 🧠 Aprendizados

Este projeto foi importante para praticar:

- modelagem relacional com Prisma
- autenticação e autorização
- regras de negócio por papel de usuário
- validação com Zod
- testes de endpoints críticos
- preparação de build e deploy

## 📷 Contexto do desafio

Algumas das entregas desse desafio incluíam:

- criar README com passos locais
- documentar endpoints
- adicionar link de deploy
- explicar como rodar os testes

Este README cobre esses pontos e reflete o estado atual da API. 🛠️
