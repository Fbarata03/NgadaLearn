# NgadaLearn — Backend API

API REST para o sistema NgadaLearn. Responsável por autenticação, gestão de utilizadores e controlo de acesso.

## Tecnologias

- **Node.js** + **Express** — servidor HTTP
- **bcryptjs** — hash de passwords
- **jsonwebtoken** — autenticação JWT
- **Persistência** — ficheiro JSON local (`src/data/users.json`)

## Instalar e iniciar

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar o .env com os teus valores

# Criar utilizador admin inicial
npm run seed

# Iniciar em desenvolvimento (com nodemon)
npm run dev

# Iniciar em produção
npm start
```

O servidor fica disponível em **http://localhost:3001**

## Endpoints

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Registar novo utilizador |
| POST | `/api/auth/login` | Login (retorna JWT) |
| GET | `/api/auth/me` | Perfil do utilizador logado |
| POST | `/api/auth/change-password` | Alterar password |

### Gestão de utilizadores (Admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/users` | Listar todos os utilizadores |
| POST | `/api/users` | Criar utilizador |
| GET | `/api/users/:id` | Detalhe de um utilizador |
| PATCH | `/api/users/:id` | Actualizar utilizador |
| DELETE | `/api/users/:id` | Apagar utilizador |
| POST | `/api/users/:id/access` | Conceder/revogar acesso |

### Utilitários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Estado da API |

## Autenticação

Todas as rotas protegidas requerem o header:

```
Authorization: Bearer <token_jwt>
```

O token é obtido no login e válido por 7 dias.

## Exemplos de pedidos

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"Fbarata03@gmail.com","password":"marias66s3"}'
```

### Conceder 30 dias de acesso
```bash
curl -X POST http://localhost:3001/api/users/<id>/access \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"days":30}'
```

## Estrutura de ficheiros

```
backend/
├── src/
│   ├── server.js              # Ponto de entrada
│   ├── routes/
│   │   ├── auth.js            # Rotas de autenticação
│   │   └── users.js           # Rotas de gestão (admin)
│   ├── middleware/
│   │   └── authMiddleware.js  # Verificação JWT
│   ├── utils/
│   │   └── dataStore.js       # Persistência JSON
│   ├── scripts/
│   │   └── seed.js            # Criar admin inicial
│   └── data/
│       └── users.json         # Base de dados (gitignored)
├── .env                       # Variáveis de ambiente (gitignored)
├── .env.example               # Exemplo de configuração
├── .gitignore
├── package.json
└── README.md
```
