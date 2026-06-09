# NgadaLearn — Aprende Inglês com Música, Netflix e Conversação

> Plataforma web progressiva (PWA) para aprender inglês de forma natural — música, vídeos YouTube curados e exercícios reais.

![Deploy](https://img.shields.io/badge/Deploy-GitHub_Pages-blue)
![Stack](https://img.shields.io/badge/Stack-React_19_+_TypeScript-purple)
![PWA](https://img.shields.io/badge/PWA-iOS_%2F_Android-green)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 · TypeScript · Vite · TailwindCSS v4 |
| Routing | React Router v7 |
| UI | Radix UI · Lucide Icons · Framer Motion |
| PWA | Vite PWA (Workbox) — instalável em iOS/Android |
| Backend | Node.js + Express — `ngadalearn-api.onrender.com` |
| Auth | JWT via backend |
| Deploy | GitHub Pages — CI/CD automático via GitHub Actions |

---

## Funcionalidades

### 🎵 Music Player (`/music`)
- Pesquisa músicas no YouTube
- Karaoke sincronizado com tradução PT por baixo de cada linha
- Modo Quiz — preenche a palavra em falta
- Iframe direto no mobile (compatível iOS/Android PWA)
- Timeout + fallback para quando o backend demora a arrancar

### 🎬 Netflix do Inglês (`/netflix`)
6 canais curados por nível CEFR com player integrado:

| Canal | Nível |
|---|---|
| 🟢 English Easy Practice | A1–A2 |
| 🔵 English with Lucy | A2–B1 |
| 🔴 BBC Learning English | A2–B2 |
| 🟠 Learn English with TV Series | B1–B2 |
| 🟣 VOA Learning English | B1–C1 |
| 🟡 English Addict — Mr. Duncan | B2–C1 |

### 📚 Conteúdo do Curso (`/lessons`)

| Módulo | Conteúdo |
|---|---|
| Assimil | 146 lições áudio com progressão gradual |
| Pimsleur | 30 lições de fala e compreensão oral |
| Leituras | 18 textos com vocabulário em contexto |
| Conversações | 30 diálogos reais com áudio TTS |
| Textos | 14 textos do iniciante ao avançado |
| Gramática | 10 lições estruturadas |
| Frases | 1000+ frases em 17 categorias |
| Vocabulário | Adjetivos, verbos, expressões idiomáticas |

### 📊 Dashboard (`/dashboard`)
- Progresso por módulo com barras visuais
- Streak de dias consecutivos

### 🏆 Certificado (`/certificate`)
- Geração de certificado PDF personalizável

---

## Estrutura

```
NgadaLearn/
├── frontend/
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── RootLayout.tsx          ← Header + bottom nav + footer
│   │   │   ├── LandingPage.tsx         ← Página pública
│   │   │   ├── Lessons.tsx             ← Hub de conteúdo
│   │   │   ├── MusicPlayer.tsx         ← Player YouTube + karaoke
│   │   │   ├── NetflixEnglish.tsx      ← Netflix do Inglês
│   │   │   ├── Dashboard.tsx           ← Progresso
│   │   │   ├── LessonPlayer.tsx
│   │   │   ├── ConversationPlayer.tsx
│   │   │   ├── GrammarPlayer.tsx
│   │   │   ├── PhrasesViewer.tsx
│   │   │   ├── VocabularyViewer.tsx
│   │   │   ├── Certificate.tsx
│   │   │   └── Admin.tsx
│   │   ├── data/                       ← Conteúdo estático
│   │   ├── context/AuthContext.tsx
│   │   ├── hooks/useProgress.ts
│   │   └── routes.tsx
│   ├── public/audio/assimil/           ← Áudio MP3 das lições
│   └── vite.config.ts                  ← PWA + Tailwind + base "/"
│
└── .github/workflows/deploy.yml        ← Deploy automático GitHub Pages
```

---

## Rotas

| Rota | Componente | Acesso |
|---|---|---|
| `/` | LandingPage | Público |
| `/demo` | Demo | Público |
| `/subscribe` | Subscribe | Público |
| `/login` | Login | Público |
| `/lessons` | Lessons | Auth + Plano |
| `/music` | MusicPlayer | Auth + Plano |
| `/netflix` | NetflixEnglish | Auth + Plano |
| `/dashboard` | Dashboard | Auth + Plano |
| `/grammar/:id` | GrammarPlayer | Auth + Plano |
| `/conversations/:id` | ConversationPlayer | Auth + Plano |
| `/texts/:id` | TextPlayer | Auth + Plano |
| `/phrases` | PhrasesViewer | Auth + Plano |
| `/vocabulary` | VocabularyViewer | Auth + Plano |
| `/certificate` | Certificate | Auth + Plano |
| `/admin` | Admin | Auth + Admin |

---

## Desenvolvimento local

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # Build de produção
```

### Variáveis de ambiente (`frontend/.env.local`)

```
VITE_API_URL=https://ngadalearn-api.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

---

## Deploy

Push para `main` → GitHub Actions faz build automático → publica em GitHub Pages.

---

© 2026 NgadaLearn · Todos os direitos reservados
