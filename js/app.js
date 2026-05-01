/* ============================================================
   NGADALEARN — APP
   ============================================================ */

/* ---- DATA ---- */

function makeLessons(count, titleFn, audioFn) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: titleFn(i + 1),
    audio: audioFn(i + 1)
  }));
}

const COURSES = {
  assimil: {
    id: 'assimil',
    name: 'Assimil — Inglês Sem Esforço',
    short: 'Assimil',
    icon: '📚',
    color: '#6366f1',
    desc: 'Método natural com 146 lições progressivas em diálogos do cotidiano. Ideal para ouvir e repetir.',
    totalAudio: 146,
    pdf: 'Assimil/Assimil - O Novo Inglês Sem Esforço - PT-EN.pdf',
    lessons: makeLessons(
      146,
      n => `Lição ${n}`,
      n => `Assimil/Assimil - O Novo Inglês Sem Esforço - Audio/Lição (${n}).mp3`
    )
  },
  pimsleur: {
    id: 'pimsleur',
    name: 'PIMSLEUR — Inglês Americano',
    short: 'PIMSLEUR',
    icon: '🎧',
    color: '#f59e0b',
    desc: 'Método áudio-lingual intensivo. 30 lições + 18 leituras. Foco em conversação e pronúncia.',
    totalAudio: 48,
    lessons: makeLessons(
      30,
      n => `Inglês ${pad(n)}`,
      n => `PIMSLEUR/ÁUDIO/Ingles ${pad(n)}.mp3`
    ),
    readings: makeLessons(
      18,
      n => `Leitura ${pad(n)}`,
      n => n === 8
        ? 'PIMSLEUR/ÁUDIO/Lieturas 08.mp3'
        : `PIMSLEUR/ÁUDIO/Leituras ${pad(n)}.mp3`
    ),
    apostilas: [
      { title: 'Apostila Curso FISK', path: 'PIMSLEUR/APOSTILA/APOSTILA CURSO FISK.pdf' },
      { title: 'Guia de Referência das Lições', path: 'PIMSLEUR/APOSTILA/GUIA DE REFERÊNCIA DAS LIÇÕES EM ÁUDIO.pdf' }
    ]
  }
};

const MATERIALS = [
  { id: 'frases',      icon: '💬', title: '1000 Frases Mais Usadas',   desc: 'As frases do cotidiano mais comuns no inglês',        path: 'PDF ENGLISH/1000-frases-mais-usadas-no-ingles.pdf' },
  { id: 'udemy1',      icon: '📄', title: 'Apostila Udemy — Parte 1',  desc: 'Material principal do curso Udemy',                  path: 'Udemy/Apostila+parte+1.pdf' },
  { id: 'udemy2',      icon: '📄', title: 'Apostila Udemy — Parte 2',  desc: 'Continuação do material Udemy',                      path: 'Udemy/Apostila+parte+2.pdf' },
  { id: 'udemy3',      icon: '📝', title: 'Vocabulary Boost — Leituras', desc: 'Atividades de leitura e vocabulário',              path: 'Udemy/Atividades+de+leitura+-+Vocabulary+Boost+2+.pdf' },
  { id: 'udemy4',      icon: '📝', title: 'Texto Complementar',         desc: 'Texto de apoio do curso Udemy',                    path: 'Udemy/texto+parte+1.pdf' },
  { id: 'fisk',        icon: '🏫', title: 'Apostila FISK',             desc: 'Apostila do método PIMSLEUR/Fisk',                   path: 'PIMSLEUR/APOSTILA/APOSTILA CURSO FISK.pdf' },
  { id: 'pimsleur-ref',icon: '📋', title: 'Guia de Referência PIMSLEUR', desc: 'Guia das lições em áudio',                       path: 'PIMSLEUR/APOSTILA/GUIA DE REFERÊNCIA DAS LIÇÕES EM ÁUDIO.pdf' },
  { id: 'assimil-pdf', icon: '📚', title: 'Livro Assimil Completo',    desc: 'Livro texto PT-EN do método Assimil (105 MB)',       path: 'Assimil/Assimil - O Novo Inglês Sem Esforço - PT-EN.pdf' }
];

// Recursos de aulasdeinglesgratis.net
const ONLINE_RESOURCES = [
  {
    emoji: '📰',
    label: 'Textos',
    title: 'Textos em Inglês com Áudio',
    desc: '200+ textos em inglês com tradução e áudio — do iniciante ao avançado.',
    url: 'https://aulasdeinglesgratis.net/textos-em-ingles/',
    tags: ['Reading', 'Áudio', 'Tradução']
  },
  {
    emoji: '💬',
    label: 'Frases',
    title: '1000 Frases em Inglês',
    desc: 'Mais de 1000 frases do cotidiano, 200 phrasal verbs e 500 idioms com tradução.',
    url: 'https://aulasdeinglesgratis.net/1000-frases-em-ingles-com-traducao/',
    tags: ['Frases', 'Idioms', 'Phrasal Verbs']
  },
  {
    emoji: '🗣️',
    label: 'Conversação',
    title: 'Conversações em Inglês',
    desc: 'Diálogos e conversas do dia a dia para praticar o inglês falado.',
    url: 'https://aulasdeinglesgratis.net/conversacoes-em-ingles/',
    tags: ['Speaking', 'Diálogos']
  },
  {
    emoji: '✍️',
    label: 'Gramática',
    title: 'Gramática Inglesa',
    desc: 'Regras gramaticais e preparação para exames — explicadas em português.',
    url: 'https://aulasdeinglesgratis.net/gramatica/',
    tags: ['Gramática', 'Exames']
  },
  {
    emoji: '📖',
    label: 'Vocabulário',
    title: 'Lista de Palavras por Tema',
    desc: 'Adjetivos, advérbios, verbos e listas temáticas de vocabulário.',
    url: 'https://aulasdeinglesgratis.net/lista-de-palavras/',
    tags: ['Palavras', 'Temas']
  },
  {
    emoji: '🌱',
    label: 'Iniciante',
    title: 'Textos para Iniciantes',
    desc: 'Textos simples com áudio especialmente para quem está começando.',
    url: 'https://aulasdeinglesgratis.net/textos-em-ingles-para-iniciantes-com-audio/',
    tags: ['Iniciante', 'Áudio']
  },
  {
    emoji: '🚀',
    label: 'Avançado',
    title: 'Textos Intermediário e Avançado',
    desc: '110 textos em inglês intermediário e avançado com áudio e tradução.',
    url: 'https://aulasdeinglesgratis.net/110-textos-em-ingles-intermediario-e-avancado-com-audio-e-traducao/',
    tags: ['Avançado', 'Áudio']
  },
  {
    emoji: '🧚',
    label: 'Contos',
    title: 'Fairy Tales em Inglês',
    desc: 'Contos de fadas clássicos em inglês — leitura leve e envolvente.',
    url: 'https://aulasdeinglesgratis.net/category/fairy-tales-contos-de-fadas/',
    tags: ['Leitura', 'Contos']
  },
  {
    emoji: '📝',
    label: 'Blog',
    title: 'Blog de Inglês',
    desc: 'Artigos e dicas de inglês publicados regularmente.',
    url: 'https://aulasdeinglesgratis.net/pagina-do-blog/',
    tags: ['Dicas', 'Artigos']
  }
];

/* ---- HELPERS ---- */

function pad(n) { return String(n).padStart(2, '0'); }

function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/* ---- STATE ---- */

const state = {
  page: 'home',
  tab: 'lessons',
  courseId: null,
  lesson: null,
  playlist: [],
  playlistCourse: null,
  playIndex: -1,
  progress: loadProgress()
};

function loadProgress() {
  try { return JSON.parse(localStorage.getItem('ngada_v1') || '{}'); }
  catch { return {}; }
}

function saveProgress() {
  localStorage.setItem('ngada_v1', JSON.stringify(state.progress));
  refreshGlobalBar();
}

function getCompleted(progressKey) {
  return state.progress[progressKey]?.completed || [];
}

function isDone(progressKey, id) {
  return getCompleted(progressKey).includes(id);
}

function toggleDone(progressKey, id) {
  if (!state.progress[progressKey]) state.progress[progressKey] = { completed: [] };
  const arr = state.progress[progressKey].completed;
  const idx = arr.indexOf(id);
  if (idx === -1) arr.push(id);
  else arr.splice(idx, 1);
  saveProgress();
}

function totalDone() {
  const a = getCompleted('assimil').length;
  const p = getCompleted('pimsleur').length;
  const pr = getCompleted('pimsleur_r').length;
  return a + p + pr;
}

function refreshGlobalBar() {
  const done = totalDone();
  const total = 194;
  const pct = Math.round((done / total) * 100);
  const bar = document.getElementById('globalProgress');
  const txt = document.getElementById('globalProgressText');
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = `${done} / ${total} lições`;
}

/* ---- AUDIO ENGINE ---- */

const audio = document.getElementById('audioPlayer');

function playItem(lesson, playlist, index, progressKey, icon, courseName) {
  state.lesson      = lesson;
  state.playlist    = playlist;
  state.playIndex   = index;
  state.playlistCourse = progressKey;

  audio.src = encodePath(lesson.audio);
  audio.playbackRate = parseFloat(sel('speedSelect').value);
  audio.play().catch(() => {});

  sel('playerTitle').textContent  = lesson.title;
  sel('playerCourse').textContent = courseName;
  sel('playerIcon').textContent   = icon;
  sel('playBtn').textContent      = '⏸';

  highlightPlaying();
}

function highlightPlaying() {
  document.querySelectorAll('.lesson-item').forEach(el => el.classList.remove('playing'));
  if (!state.lesson) return;
  const el = document.querySelector(
    `.lesson-item[data-id="${state.lesson.id}"][data-pk="${state.playlistCourse}"]`
  );
  if (el) el.classList.add('playing');
}

audio.addEventListener('timeupdate', () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  sel('playerProgressFill').style.width = pct + '%';
  sel('currentTime').textContent = formatTime(audio.currentTime);
  sel('totalTime').textContent   = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  if (state.playIndex < state.playlist.length - 1) {
    const next = state.playlist[state.playIndex + 1];
    playItem(next, state.playlist, state.playIndex + 1,
      state.playlistCourse,
      sel('playerIcon').textContent,
      sel('playerCourse').textContent);
  } else {
    sel('playBtn').textContent = '▶';
  }
});

audio.addEventListener('pause', () => { sel('playBtn').textContent = '▶'; });
audio.addEventListener('play',  () => { sel('playBtn').textContent = '⏸'; });

/* ---- PLAYER CONTROLS ---- */

sel('playBtn').addEventListener('click', () => {
  if (!audio.src) return;
  audio.paused ? audio.play() : audio.pause();
});

sel('prevBtn').addEventListener('click', () => {
  if (state.playIndex > 0) {
    const p = state.playlist[state.playIndex - 1];
    playItem(p, state.playlist, state.playIndex - 1,
      state.playlistCourse, sel('playerIcon').textContent, sel('playerCourse').textContent);
  } else {
    audio.currentTime = 0;
  }
});

sel('nextBtn').addEventListener('click', () => {
  if (state.playIndex < state.playlist.length - 1) {
    const n = state.playlist[state.playIndex + 1];
    playItem(n, state.playlist, state.playIndex + 1,
      state.playlistCourse, sel('playerIcon').textContent, sel('playerCourse').textContent);
  }
});

sel('playerProgress').addEventListener('click', e => {
  if (!audio.duration) return;
  const r = e.currentTarget.getBoundingClientRect();
  audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});

sel('speedSelect').addEventListener('change', e => { audio.playbackRate = parseFloat(e.target.value); });
sel('volumeSlider').addEventListener('input', e => { audio.volume = parseFloat(e.target.value); });

/* ---- ROUTING ---- */

function navigate(page, opts = {}) {
  if (page !== state.page) state.tab = 'lessons';
  if (opts.tab) state.tab = opts.tab;
  state.page = page;

  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  const mc = sel('mainContent');

  switch (page) {
    case 'home':      mc.innerHTML = renderHome(); break;
    case 'assimil':   mc.innerHTML = renderCourse('assimil'); break;
    case 'pimsleur':  mc.innerHTML = renderCourse('pimsleur'); break;
    case 'udemy':     mc.innerHTML = renderUdemy(); break;
    case 'frases':    mc.innerHTML = renderFullPDF('PDF ENGLISH/1000-frases-mais-usadas-no-ingles.pdf', '1000 Frases Mais Usadas em Inglês'); break;
    case 'apostilas': mc.innerHTML = renderApostilas(); break;
    case 'online':    mc.innerHTML = renderOnline(); break;
    default:          mc.innerHTML = renderHome();
  }

  highlightPlaying();

  if (window.innerWidth <= 720) {
    sel('sidebar').classList.remove('open');
  }
}

/* ---- RENDER: HOME ---- */

function renderHome() {
  const done  = totalDone();
  const total = 194;
  const pct   = Math.round((done / total) * 100);

  return `
    <div class="page-content">
      ${fileWarning()}
      <div class="page-header">
        <h1>🌍 NgadaLearn</h1>
        <p>Fluência em inglês com alma, ritmo e tecnologia — gratuito e sem anúncios</p>
      </div>
      <div class="page-body">

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div><div class="stat-value">${pct}%</div><div class="stat-label">Progresso geral</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div><div class="stat-value">${done}</div><div class="stat-label">Lições concluídas</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎵</div>
            <div><div class="stat-value">${total}</div><div class="stat-label">Total de lições de áudio</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📄</div>
            <div><div class="stat-value">8</div><div class="stat-label">Materiais em PDF</div></div>
          </div>
        </div>

        <div class="section-title">Cursos de Áudio</div>
        <div class="courses-grid">
          ${courseCard('assimil')}
          ${courseCard('pimsleur')}
        </div>

        <div class="section-title">Materiais e Apostilas</div>
        <div class="courses-grid">
          <div class="course-card" data-nav="frases" style="--card-color:#06b6d4">
            <div class="course-card-header">
              <div class="course-card-icon">💬</div>
              <div>
                <div class="course-card-title">1000 Frases Essenciais</div>
                <div class="course-card-desc">As frases mais usadas no inglês do dia a dia — guia de referência rápida.</div>
              </div>
            </div>
            <div class="course-card-tags"><span class="tag">📄 PDF</span><span class="tag">💬 Frases</span></div>
          </div>
          <div class="course-card" data-nav="udemy" style="--card-color:#22c55e">
            <div class="course-card-header">
              <div class="course-card-icon">🎓</div>
              <div>
                <div class="course-card-title">Materiais Udemy</div>
                <div class="course-card-desc">Apostilas, textos e atividades de Vocabulary Boost do curso Udemy.</div>
              </div>
            </div>
            <div class="course-card-tags"><span class="tag">📄 4 PDFs</span><span class="tag">📝 Leitura</span></div>
          </div>
        </div>

        <div class="section-title">Recursos Online Gratuitos</div>
        <div class="resource-grid">
          ${ONLINE_RESOURCES.slice(0, 3).map(r => resourceCard(r)).join('')}
        </div>
        <div style="margin-top:10px">
          <span class="btn btn-ghost" data-nav="online" style="cursor:pointer">Ver todos os recursos online →</span>
        </div>

      </div>
    </div>`;
}

/* ---- RENDER: COURSE ---- */

function renderCourse(cid) {
  const c    = COURSES[cid];
  const done = courseDone(cid);
  const pct  = Math.round((done / c.totalAudio) * 100);
  const tabs = cid === 'pimsleur'
    ? ['lessons', 'readings', 'pdf']
    : ['lessons', 'pdf'];
  const tabLabel = { lessons: 'Lições', readings: 'Leituras', pdf: 'Apostila' };

  return `
    <div class="page-content">
      <div class="course-header">
        <div class="course-header-icon">${c.icon}</div>
        <div>
          <h1>${c.name}</h1>
          <p>${c.desc}</p>
          <div class="header-stats">
            <span class="hstat"><strong>${done}</strong> de <strong>${c.totalAudio}</strong> concluídas</span>
            <span class="hstat"><strong>${pct}%</strong> completo</span>
          </div>
        </div>
      </div>

      <div class="tabs">
        ${tabs.map(t => `
          <button class="tab-btn ${state.tab === t ? 'active' : ''}" data-tab="${t}" data-course="${cid}">
            ${tabLabel[t]}
          </button>`).join('')}
      </div>

      <div id="tabPanel">
        ${renderTab(cid)}
      </div>
    </div>`;
}

function renderTab(cid) {
  const c = COURSES[cid];
  if (state.tab === 'lessons') {
    return `
      <div class="lesson-area">
        <div class="search-wrap">
          <input class="search-input" id="searchInput" placeholder="Buscar lição..." autocomplete="off">
        </div>
        ${renderLessonList(c.lessons, cid, c.icon, c.short)}
      </div>`;
  }
  if (state.tab === 'readings' && cid === 'pimsleur') {
    return `
      <div class="lesson-area">
        ${renderLessonList(c.readings, 'pimsleur_r', c.icon, 'PIMSLEUR Leituras')}
      </div>`;
  }
  if (state.tab === 'pdf') {
    if (cid === 'pimsleur') {
      return `
        <div class="lesson-area">
          <div class="section-title" style="margin-bottom:12px">Apostilas PIMSLEUR</div>
          <div class="materials-grid">
            ${c.apostilas.map(a => materialItem(a.icon || '📄', a.title, 'Clique para abrir', a.path)).join('')}
          </div>
        </div>`;
    }
    if (c.pdf) {
      return `<iframe src="${encodePath(c.pdf)}" class="pdf-frame" style="height:calc(100vh - var(--player-h) - 220px)"></iframe>`;
    }
  }
  return `<div class="empty"><div class="empty-icon">📂</div><p>Nenhum conteúdo nesta aba.</p></div>`;
}

function renderLessonList(lessons, progressKey, icon, courseName) {
  return lessons.map((l, i) => {
    const done    = isDone(progressKey, l.id);
    const playing = state.lesson?.id === l.id && state.playlistCourse === progressKey;
    return `
      <div class="lesson-item ${done ? 'completed' : ''} ${playing ? 'playing' : ''}"
           data-id="${l.id}" data-pk="${progressKey}" data-i="${i}"
           data-audio="${l.audio}" data-icon="${icon}" data-cname="${courseName}">
        <div class="lesson-num-wrap">${playing ? '♫' : (done ? '✓' : l.id)}</div>
        <div class="lesson-title">${l.title}</div>
        <button class="mark-btn" data-id="${l.id}" data-pk="${progressKey}">
          ${done ? '✓ Feito' : 'Marcar'}
        </button>
        <span class="play-dot">▶</span>
      </div>`;
  }).join('');
}

/* ---- RENDER: UDEMY ---- */

function renderUdemy() {
  const items = MATERIALS.filter(m => m.id.startsWith('udemy'));
  return `
    <div class="page-content">
      <div class="page-header">
        <h1>🎓 Materiais Udemy</h1>
        <p>Apostilas e atividades do curso de inglês</p>
      </div>
      <div class="page-body">
        <div class="materials-grid">
          ${items.map(m => materialItem(m.icon, m.title, m.desc, m.path)).join('')}
        </div>
      </div>
    </div>`;
}

/* ---- RENDER: APOSTILAS ---- */

function renderApostilas() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h1>📄 Apostilas e Materiais</h1>
        <p>Todos os PDFs disponíveis no NgadaLearn</p>
      </div>
      <div class="page-body">
        <div class="materials-grid">
          ${MATERIALS.map(m => materialItem(m.icon, m.title, m.desc, m.path)).join('')}
        </div>
      </div>
    </div>`;
}

/* ---- RENDER: FULL PDF PAGE ---- */

function renderFullPDF(path, title) {
  return `
    <div class="page-content">
      <div class="page-header">
        <h1>💬 ${title}</h1>
        <p>Use Ctrl+F para buscar frases específicas</p>
      </div>
      <iframe src="${encodePath(path)}" class="pdf-frame"
        style="height:calc(100vh - var(--player-h) - 110px)"></iframe>
    </div>`;
}

/* ---- RENDER: ONLINE ---- */

function renderOnline() {
  return `
    <div class="page-content">
      <div class="page-header">
        <h1>🌐 Aulas de Inglês Grátis Online</h1>
        <p>Recursos gratuitos de <strong>aulasdeinglesgratis.net</strong> — conteúdo organizado por categoria</p>
      </div>
      <div class="page-body">

        <div class="online-section">
          <div class="section-title">Categorias Principais</div>
          <div class="resource-grid">
            ${ONLINE_RESOURCES.map(r => resourceCard(r)).join('')}
          </div>
        </div>

        <div class="online-section">
          <div class="section-title">Navegar no Site Completo</div>
          <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;">
            <div style="padding:10px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
              <span style="font-size:13px;font-weight:600;">aulasdeinglesgratis.net</span>
              <a href="https://aulasdeinglesgratis.net" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:11px;padding:5px 12px;">↗ Abrir em nova aba</a>
            </div>
            <iframe
              src="https://aulasdeinglesgratis.net"
              style="width:100%;height:calc(100vh - var(--player-h) - 320px);border:none;min-height:400px;"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy">
            </iframe>
          </div>
        </div>

      </div>
    </div>`;
}

/* ---- RENDER HELPERS ---- */

function courseCard(cid) {
  const c    = COURSES[cid];
  const done = courseDone(cid);
  const pct  = Math.round((done / c.totalAudio) * 100);
  return `
    <div class="course-card" data-nav="${cid}" style="--card-color:${c.color}">
      <div class="course-card-header">
        <div class="course-card-icon">${c.icon}</div>
        <div>
          <div class="course-card-title">${c.name}</div>
          <div class="course-card-desc">${c.desc}</div>
        </div>
      </div>
      <div class="course-card-tags">
        <span class="tag">🎵 ${c.totalAudio} lições</span>
        <span class="tag">🎧 Áudio</span>
      </div>
      <div class="course-progress-bar-wrap">
        <div class="course-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="course-progress-text">${done} / ${c.totalAudio} concluídas</div>
    </div>`;
}

function materialItem(icon, title, desc, path) {
  return `
    <div class="material-card" data-pdf="${path}" data-title="${title}">
      <div class="material-icon">${icon}</div>
      <div>
        <div class="material-title">${title}</div>
        <div class="material-desc">${desc}</div>
      </div>
    </div>`;
}

function resourceCard(r) {
  return `
    <a class="resource-card" href="${r.url}" target="_blank" rel="noopener">
      <div class="resource-card-header">
        <span class="resource-emoji">${r.emoji}</span>
        <span class="resource-label">${r.label}</span>
      </div>
      <div class="resource-title">${r.title}</div>
      <div class="resource-desc">${r.desc}</div>
      <div class="resource-footer">
        ${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        <span class="ext-link-badge">↗ abrir</span>
      </div>
    </a>`;
}

function courseDone(cid) {
  if (cid === 'assimil')  return getCompleted('assimil').length;
  if (cid === 'pimsleur') return getCompleted('pimsleur').length + getCompleted('pimsleur_r').length;
  return 0;
}

function fileWarning() {
  if (location.protocol !== 'file:') return '';
  return `
    <div class="notice-banner">
      ⚠️ <strong>Dica:</strong> Para reproduzir os áudios, abra este arquivo com um servidor local.
      Execute no terminal: <code style="background:rgba(0,0,0,.3);padding:1px 6px;border-radius:4px;">npx serve .</code>
      ou <code style="background:rgba(0,0,0,.3);padding:1px 6px;border-radius:4px;">python -m http.server</code>
    </div>`;
}

/* ---- PDF MODAL ---- */

function openPDF(path, title) {
  closePDF();
  const m = document.createElement('div');
  m.id = 'pdfModal';
  m.className = 'pdf-modal';
  m.innerHTML = `
    <div class="pdf-modal-bar">
      <span class="pdf-modal-title">📄 ${title}</span>
      <div class="pdf-modal-actions">
        <a href="${encodePath(path)}" target="_blank" class="btn btn-primary">↗ Nova aba</a>
        <button class="btn btn-ghost" onclick="closePDF()">✕ Fechar</button>
      </div>
    </div>
    <iframe src="${encodePath(path)}" class="pdf-frame" style="flex:1;height:0;min-height:0"></iframe>`;
  document.body.appendChild(m);
}

function closePDF() {
  const m = document.getElementById('pdfModal');
  if (m) m.remove();
}

/* ---- EVENT DELEGATION ---- */

sel('mainContent').addEventListener('click', e => {
  // Tab button
  const tab = e.target.closest('.tab-btn');
  if (tab) {
    state.tab = tab.dataset.tab;
    navigate(state.page);
    return;
  }

  // Mark done button
  const mark = e.target.closest('.mark-btn');
  if (mark) {
    e.stopPropagation();
    const id = parseInt(mark.dataset.id);
    const pk = mark.dataset.pk;
    toggleDone(pk, id);
    const item = mark.closest('.lesson-item');
    if (item) {
      item.classList.toggle('completed', isDone(pk, id));
      mark.textContent = isDone(pk, id) ? '✓ Feito' : 'Marcar';
      const numWrap = item.querySelector('.lesson-num-wrap');
      if (numWrap && !item.classList.contains('playing')) {
        numWrap.textContent = isDone(pk, id) ? '✓' : parseInt(item.dataset.id);
      }
    }
    return;
  }

  // Lesson item → play
  const lessonEl = e.target.closest('.lesson-item');
  if (lessonEl) {
    const id    = parseInt(lessonEl.dataset.id);
    const pk    = lessonEl.dataset.pk;
    const audio = lessonEl.dataset.audio;
    const icon  = lessonEl.dataset.icon;
    const cname = lessonEl.dataset.cname;

    const allItems = [...document.querySelectorAll(`.lesson-item[data-pk="${pk}"]`)];
    const playlist = allItems.map(el => ({
      id:    parseInt(el.dataset.id),
      title: el.querySelector('.lesson-title').textContent,
      audio: el.dataset.audio
    }));
    const playIdx = allItems.findIndex(el => parseInt(el.dataset.id) === id);

    playItem({ id, title: lessonEl.querySelector('.lesson-title').textContent, audio }, playlist, playIdx, pk, icon, cname);
    return;
  }

  // Nav card (course-card or resource card with data-nav)
  const navEl = e.target.closest('[data-nav]');
  if (navEl) {
    navigate(navEl.dataset.nav);
    return;
  }

  // Material card → open PDF modal
  const matCard = e.target.closest('.material-card[data-pdf]');
  if (matCard) {
    openPDF(matCard.dataset.pdf, matCard.dataset.title);
    return;
  }
});

// Search filter
sel('mainContent').addEventListener('input', e => {
  if (e.target.id !== 'searchInput') return;
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('.lesson-item').forEach(el => {
    const match = el.querySelector('.lesson-title').textContent.toLowerCase().includes(q);
    el.style.display = match ? '' : 'none';
  });
});

/* ---- SIDEBAR NAV ---- */

document.querySelectorAll('.nav-item[data-page]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); navigate(el.dataset.page); });
});

sel('sidebarToggle').addEventListener('click', () => {
  sel('sidebar').classList.toggle('open');
});

/* ---- UTILITY ---- */

function sel(id) { return document.getElementById(id); }

/* ---- BOOT ---- */

refreshGlobalBar();
navigate('home');
