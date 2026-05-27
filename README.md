# 🌍 NgadaLearn

> **Fluência em Inglês Acessível com Alma, Ritmo e Tecnologia.**

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue)
![Pricing](https://img.shields.io/badge/Preço-US$_5/mês-success)
![License](https://img.shields.io/badge/Licença-Proprietária-red)

---

## 📖 Sobre o Projecto

O **NgadaLearn** é uma plataforma web de aprendizagem de inglês completa e acessível.  
Combina metodologias comprovadas (Assimil, Pimsleur) com tecnologia moderna — áudio TTS, música do YouTube, conversações reais e muito mais.

---

## 🏗️ Estrutura do Projecto

```
NgadaLearn/
├── frontend/                     ← App React (pasta: "Create README for NgadaLearn")
│   ├── src/app/
│   │   ├── components/           ← Todos os ecrãs e players
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Lessons.tsx
│   │   │   ├── LessonPlayer.tsx
│   │   │   ├── ConversationPlayer.tsx
│   │   │   ├── TextPlayer.tsx
│   │   │   ├── GrammarPlayer.tsx
│   │   │   ├── PhrasesViewer.tsx
│   │   │   ├── VocabularyViewer.tsx
│   │   │   ├── MusicPlayer.tsx   ← YouTube API v3 + player
│   │   │   └── Admin.tsx
│   │   ├── data/                 ← Conteúdo estático
│   │   │   ├── lessonsData.ts    ← 146+ lições Assimil/Pimsleur
│   │   │   ├── conversationsData.ts ← 30 conversações
│   │   │   ├── textsData.ts      ← 14 textos
│   │   │   ├── grammarData.ts    ← 10 lições gramática
│   │   │   ├── phrasesData.ts    ← 700+ frases / 17 categorias
│   │   │   └── vocabularyData.ts
│   │   ├── context/AuthContext.tsx
│   │   ├── hooks/useProgress.ts
│   │   └── routes.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      ← API REST (Node.js + Express)
│   ├── src/
│   │   ├── server.js             ← Ponto de entrada
│   │   ├── routes/
│   │   │   ├── auth.js           ← POST /api/auth/login, register, me
│   │   │   └── users.js          ← GET/POST/PATCH/DELETE /api/users (admin)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js ← Verificação JWT
│   │   ├── utils/
│   │   │   └── dataStore.js      ← Persistência JSON
│   │   └── scripts/
│   │       └── seed.js           ← Criar admin inicial
│   ├── .env.example
│   └── package.json
│
├── assets/                       ← Build do frontend (deploy Live Server)
├── index.html                    ← Entrada do deploy
└── README.md
```

---

## ✨ Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| 🏠 Landing Page | Apresentação e subscrição |
| 📚 Assimil | 146 lições — método natural |
| 🎧 Pimsleur | 30 lições de áudio |
| 📖 Leituras | 18 leituras em áudio |
| 💬 Conversações | 30 diálogos com áudio TTS |
| 📝 Textos | 14 textos com tradução |
| 📐 Gramática | 10 lições de gramática |
| 🗣️ Frases | **700+ frases em 17 categorias** |
| 📦 Vocabulário | Adjectivos, verbos, expressões |
| 🎵 Música | Player YouTube + velocidade + letras + notas |
| 👤 Admin | Gestão de utilizadores e acessos |

---

## 🛠️ Tecnologias

**Frontend:** React 19 · TypeScript · Vite · TailwindCSS · shadcn/ui · React Router v7  
**Backend:** Node.js · Express · bcryptjs · jsonwebtoken · UUID  
**APIs:** YouTube Data API v3 · Web Speech API (TTS)

---

## 🚀 Desenvolvimento Local

### Frontend

```bash
cd "Create README for NgadaLearn"
npm install
npm run dev     # http://localhost:5173
```

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Editar com os teus valores
npm run seed            # Criar utilizador admin
npm run dev             # http://localhost:3001
```

### Build e Deploy

```bash
# Frontend
cd "Create README for NgadaLearn"
npm run build

# Copiar para raiz (deploy Live Server)
copy dist\index.html ..\index.html
xcopy /E /Y dist\assets ..\assets\
```

---

## 💸 Modelo de Negócio

- **US$ 5/mês** — acesso completo à plataforma
- Sem anúncios · Sem venda de dados
- Pagamento simples, cancelamento a qualquer momento

---

## 🔐 Credenciais de Administrador

| Tipo | Email | Password |
|------|-------|----------|
| Admin | `Fbarata03@gmail.com` | `marias66s3` |

> ⚠️ Mudar a password em produção!
