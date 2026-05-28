/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Gerador de Certificado (Canvas API)
   Produz um PNG 1600×1130 (proporção A4 paisagem)
   ════════════════════════════════════════════════════════════════════ */

export interface CertificateData {
  name: string;
  level: string;
  totalCompleted: number;
  totalAll: number;
  totalMinutes: number;
  issueDate?: string; // ISO string ou undefined → usa hoje
}

/* Texto centrado com quebra de linha automática */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, currentY);
  return currentY;
}

/* Desenha uma estrela de 5 pontas */
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const innerAngle = angle + (2 * Math.PI) / 10;
    if (i === 0) ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    else ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    ctx.lineTo(cx + (r * 0.4) * Math.cos(innerAngle), cy + (r * 0.4) * Math.sin(innerAngle));
  }
  ctx.closePath();
  ctx.fill();
}

export function generateCertificate(data: CertificateData): HTMLCanvasElement {
  const W = 1600;
  const H = 1130;

  const canvas = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  /* ── Fundo degradê roxo/índigo ───────────────────────────────── */
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,   "#0f0a1e");
  bg.addColorStop(0.4, "#1e1050");
  bg.addColorStop(1,   "#2d1b69");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* ── Círculo decorativo de fundo (grande, translúcido) ──────── */
  const glow = ctx.createRadialGradient(W * 0.7, H * 0.3, 0, W * 0.7, H * 0.3, 500);
  glow.addColorStop(0, "rgba(139,92,246,0.25)");
  glow.addColorStop(1, "rgba(139,92,246,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  /* ── Bordas ──────────────────────────────────────────────────── */
  // Externa dourada
  ctx.strokeStyle = "#c4b5fd";
  ctx.lineWidth = 10;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  // Interna fina
  ctx.strokeStyle = "rgba(196,181,253,0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, W - 96, H - 96);

  /* ── Ornamentos nas esquinas ─────────────────────────────────── */
  const corners = [[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]];
  ctx.fillStyle = "#a78bfa";
  for (const [cx, cy] of corners) {
    drawStar(ctx, cx, cy, 18);
  }

  /* ── Linha decorativa horizontal ─────────────────────────────── */
  const lineGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
  lineGrad.addColorStop(0, "transparent");
  lineGrad.addColorStop(0.2, "#a78bfa");
  lineGrad.addColorStop(0.8, "#a78bfa");
  lineGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(100, 210); ctx.lineTo(W - 100, 210); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(100, H - 210); ctx.lineTo(W - 100, H - 210); ctx.stroke();

  /* ── Logo / nome da escola ───────────────────────────────────── */
  ctx.textAlign = "center";
  ctx.fillStyle = "#ddd6fe";
  ctx.font = "bold 36px Georgia, serif";
  ctx.fillText("NgadaLearn", W / 2, 130);

  ctx.fillStyle = "rgba(196,181,253,0.6)";
  ctx.font = "20px Georgia, serif";
  ctx.fillText("Escola de Inglês Online", W / 2, 172);

  /* ── Título principal ────────────────────────────────────────── */
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 76px Georgia, serif";
  ctx.shadowColor = "rgba(139,92,246,0.8)";
  ctx.shadowBlur  = 30;
  ctx.fillText("CERTIFICADO DE CONCLUSÃO", W / 2, 320);
  ctx.shadowBlur = 0;

  /* ── Subtítulo ───────────────────────────────────────────────── */
  ctx.fillStyle = "#c4b5fd";
  ctx.font = "italic 30px Georgia, serif";
  ctx.fillText("Certificamos que", W / 2, 400);

  /* ── Nome do aluno ───────────────────────────────────────────── */
  const nameText = data.name || "Aluno NgadaLearn";
  ctx.fillStyle = "#facc15"; // amarelo dourado
  ctx.font = `bold 72px Georgia, serif`;
  ctx.shadowColor = "rgba(250,204,21,0.5)";
  ctx.shadowBlur  = 20;

  // Ajustar tamanho se o nome for muito longo
  const nameWidth = ctx.measureText(nameText).width;
  if (nameWidth > W - 200) {
    ctx.font = "bold 52px Georgia, serif";
  }
  ctx.fillText(nameText, W / 2, 500);
  ctx.shadowBlur = 0;

  /* ── Linha sob o nome ────────────────────────────────────────── */
  const nameMeasure = Math.min(ctx.measureText(nameText).width + 80, W - 200);
  const nameLineGrad = ctx.createLinearGradient(
    W / 2 - nameMeasure / 2, 0,
    W / 2 + nameMeasure / 2, 0,
  );
  nameLineGrad.addColorStop(0, "transparent");
  nameLineGrad.addColorStop(0.2, "#facc15");
  nameLineGrad.addColorStop(0.8, "#facc15");
  nameLineGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = nameLineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - nameMeasure / 2, 520);
  ctx.lineTo(W / 2 + nameMeasure / 2, 520);
  ctx.stroke();

  /* ── Texto de conclusão ──────────────────────────────────────── */
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "28px Georgia, serif";
  const conclusionText =
    `concluiu com sucesso o curso de Inglês no NgadaLearn, atingindo o nível ${data.level}.`;
  wrapText(ctx, conclusionText, W / 2, 580, W - 300, 44);

  /* ── Bloco de estatísticas ───────────────────────────────────── */
  const statsY = 680;
  const stats = [
    { emoji: "📚", label: "Lições Concluídas", value: `${data.totalCompleted} de ${data.totalAll}` },
    { emoji: "⏱️", label: "Horas de Estudo",   value: `${Math.round(data.totalMinutes / 60)}h ${data.totalMinutes % 60}min` },
    { emoji: "🏆", label: "Nível Alcançado",   value: data.level },
  ];

  const blockW = 340;
  const blockH = 120;
  const gap    = 60;
  const totalW = stats.length * blockW + (stats.length - 1) * gap;
  const startX = (W - totalW) / 2;

  stats.forEach((stat, i) => {
    const bx = startX + i * (blockW + gap);

    // Fundo semi-transparente
    ctx.fillStyle = "rgba(139,92,246,0.25)";
    ctx.beginPath();
    ctx.roundRect(bx, statsY, blockW, blockH, 16);
    ctx.fill();

    ctx.strokeStyle = "rgba(196,181,253,0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Emoji
    ctx.font = "36px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(stat.emoji, bx + blockW / 2, statsY + 44);

    // Valor
    ctx.font = "bold 24px Georgia, serif";
    ctx.fillStyle = "#facc15";
    ctx.fillText(stat.value, bx + blockW / 2, statsY + 78);

    // Label
    ctx.font = "16px Georgia, serif";
    ctx.fillStyle = "#c4b5fd";
    ctx.fillText(stat.label, bx + blockW / 2, statsY + 104);
  });

  /* ── Data de emissão ─────────────────────────────────────────── */
  const dateStr = data.issueDate
    ? new Date(data.issueDate).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" });

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(196,181,253,0.7)";
  ctx.font = "20px Georgia, serif";
  ctx.fillText(`Emitido em ${dateStr}`, W / 2, H - 155);

  /* ── Assinatura / rodapé ─────────────────────────────────────── */
  // Linha de assinatura
  ctx.strokeStyle = "rgba(196,181,253,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W / 2 - 200, H - 125); ctx.lineTo(W / 2 + 200, H - 125); ctx.stroke();

  ctx.fillStyle = "#ddd6fe";
  ctx.font = "bold 22px Georgia, serif";
  ctx.fillText("NgadaLearn", W / 2, H - 100);

  ctx.fillStyle = "rgba(196,181,253,0.6)";
  ctx.font = "16px Georgia, serif";
  ctx.fillText("Escola de Inglês Online · ngadalearn.pt", W / 2, H - 72);

  /* ── Selos de autenticidade ──────────────────────────────────── */
  ctx.fillStyle = "rgba(250,204,21,0.12)";
  ctx.beginPath();
  ctx.arc(W - 140, H - 145, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#facc15";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("✓ VERIFICADO", W - 140, H - 152);
  ctx.font = "13px sans-serif";
  ctx.fillStyle = "#fde68a";
  ctx.fillText("NgadaLearn", W - 140, H - 132);
  ctx.fillText("2026", W - 140, H - 114);

  return canvas;
}

export function downloadCertificate(data: CertificateData): void {
  const canvas = generateCertificate(data);
  const link   = document.createElement("a");
  const safeName = (data.name || "aluno").replace(/\s+/g, "-").toLowerCase();
  link.download = `certificado-ngadalearn-${safeName}.png`;
  link.href     = canvas.toDataURL("image/png");
  link.click();
}
