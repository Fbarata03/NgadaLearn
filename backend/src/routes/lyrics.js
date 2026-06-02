/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Letras Route
   Busca letra + tradução PT no Letras.mus.br
   ════════════════════════════════════════════════════════════════════ */

const router = require("express").Router();

/* ── Converte texto em slug URL (letras.mus.br usa hífens) ─────────── */
function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")   // remove acentos
    .replace(/[^a-z0-9\s]/g, " ")      // remove pontuação
    .trim()
    .replace(/\s+/g, "-");
}

/* ── Extrai texto limpo de um bloco HTML ───────────────────────────── */
function extractText(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ── Extrai secção de letra a partir do HTML ───────────────────────── */
function extractSection(html, marker) {
  const idx = html.indexOf(marker);
  if (idx === -1) return "";

  /* Procura o <article> dentro desta secção */
  const artStart = html.indexOf("<article", idx);
  const artEnd   = html.indexOf("</article>", artStart);
  if (artStart === -1 || artEnd === -1) return "";

  return extractText(html.slice(artStart, artEnd));
}

/* ─────────────────────────────────────────────────────────────────────
   GET /api/lyrics/search?artist=Ed+Sheeran&title=Perfect
   Devolve { en, pt, source } — pt pode estar vazio se não houver tradução
   ───────────────────────────────────────────────────────────────────── */
router.get("/search", async (req, res) => {
  const { artist, title } = req.query;

  if (!artist || !title) {
    return res.status(400).json({ error: "Parâmetros 'artist' e 'title' são obrigatórios." });
  }

  const artistSlug = slugify(artist);
  const titleSlug  = slugify(title);

  /* URL da página com tradução PT */
  const urlTrad   = `https://www.letras.mus.br/${artistSlug}/${titleSlug}/traducao.html`;
  /* URL da página só com letra (sem tradução) */
  const urlSimple = `https://www.letras.mus.br/${artistSlug}/${titleSlug}/`;

  const headers = {
    "User-Agent":      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
    "Accept":          "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    "Cache-Control":   "no-cache",
  };

  try {
    /* ── 1ª tentativa: página com tradução ─────────────────────────── */
    let html = "";
    let usedUrl = urlTrad;

    const r1 = await fetch(urlTrad, {
      headers,
      signal: AbortSignal.timeout(9000),
      redirect: "follow",
    });

    if (r1.ok) {
      html = await r1.text();
    } else {
      /* ── 2ª tentativa: página simples (extrai só EN) ─────────────── */
      const r2 = await fetch(urlSimple, {
        headers,
        signal: AbortSignal.timeout(9000),
        redirect: "follow",
      });
      if (!r2.ok) {
        return res.status(404).json({
          error: `Letra de "${title}" não encontrada no Letras.mus.br.`,
          tried: [urlTrad, urlSimple],
        });
      }
      html    = await r2.text();
      usedUrl = urlSimple;
    }

    /* Verificação mínima de conteúdo */
    if (!html.includes("cnt-letra")) {
      return res.status(404).json({
        error: "Página encontrada mas sem letra. Tenta com o nome exacto do artista e da música.",
        tried: usedUrl,
      });
    }

    const en = extractSection(html, 'class="cnt-letra');
    const pt = extractSection(html, 'class="cnt-letra-translation');

    if (!en) {
      return res.status(404).json({
        error: "Letra encontrada mas não foi possível extrair o texto.",
        tried: usedUrl,
      });
    }

    return res.json({ en, pt: pt || "", source: usedUrl });

  } catch (err) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      return res.status(504).json({ error: "Tempo de espera esgotado ao contactar Letras.mus.br." });
    }
    console.error("[lyrics] Erro:", err.message);
    return res.status(500).json({ error: "Erro interno ao buscar letra." });
  }
});

module.exports = router;
