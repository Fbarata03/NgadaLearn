const nodemailer = require("nodemailer");

let _transporter = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST || "smtp.gmail.com",
      port:   parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return _transporter;
}

async function sendReceipt({ to, name, plan, amount, paymentIntentId }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  EMAIL_USER/EMAIL_PASS não configurados — recibo não enviado.");
    return false;
  }

  const planLabel = plan === "lifetime" ? "Plano Vitalício" : "Plano Mensal";
  const validity  = plan === "lifetime" ? "Acesso para sempre" : "Acesso por 30 dias";
  const date = new Date().toLocaleDateString("pt-PT", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const features = [
    "50+ horas de conteúdo em vídeo e áudio",
    "Método Assimil + Pimsleur adaptados",
    "NgadaFlow — áudio com falantes nativos",
    "Exercícios interactivos e vocabulário",
    "Certificado de conclusão",
  ];

  const html = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed 0%,#2563eb 100%);padding:36px 48px;text-align:center;">
            <h1 style="color:#ffffff;margin:0 0 6px;font-size:28px;font-weight:900;letter-spacing:-0.5px;">NgadaLearn</h1>
            <p style="color:#c4b5fd;margin:0;font-size:14px;letter-spacing:0.5px;">COMPROVATIVO DE PAGAMENTO</p>
          </td>
        </tr>

        <tr>
          <td style="padding:40px 48px;">
            <h2 style="color:#111827;margin:0 0 8px;font-size:22px;font-weight:800;">Pagamento confirmado! 🎉</h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Olá <strong>${name}</strong>, o seu pagamento foi processado com sucesso.
              O acesso completo ao curso foi activado na sua conta.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:28px;">
              <tr style="background:#f9fafb;">
                <td colspan="2" style="padding:12px 20px;border-bottom:1px solid #e5e7eb;">
                  <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#6b7280;">Detalhes da Compra</span>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 20px;color:#6b7280;font-size:14px;border-bottom:1px solid #f3f4f6;">Plano adquirido</td>
                <td style="padding:14px 20px;color:#111827;font-weight:700;font-size:14px;text-align:right;border-bottom:1px solid #f3f4f6;">${planLabel}</td>
              </tr>
              <tr>
                <td style="padding:14px 20px;color:#6b7280;font-size:14px;border-bottom:1px solid #f3f4f6;">Validade</td>
                <td style="padding:14px 20px;color:#111827;font-size:14px;text-align:right;border-bottom:1px solid #f3f4f6;">${validity}</td>
              </tr>
              <tr>
                <td style="padding:14px 20px;color:#6b7280;font-size:14px;border-bottom:1px solid #f3f4f6;">Data do pagamento</td>
                <td style="padding:14px 20px;color:#111827;font-size:14px;text-align:right;border-bottom:1px solid #f3f4f6;">${date}</td>
              </tr>
              <tr>
                <td style="padding:12px 20px;color:#9ca3af;font-size:11px;border-bottom:1px solid #f3f4f6;">Referência Stripe</td>
                <td style="padding:12px 20px;color:#9ca3af;font-size:11px;font-family:monospace;text-align:right;border-bottom:1px solid #f3f4f6;">${paymentIntentId}</td>
              </tr>
              <tr style="background:#faf5ff;">
                <td style="padding:18px 20px;color:#4c1d95;font-weight:900;font-size:16px;">Total pago</td>
                <td style="padding:18px 20px;color:#7c3aed;font-weight:900;font-size:22px;text-align:right;">US$ ${amount}</td>
              </tr>
            </table>

            <div style="text-align:center;margin:0 0 32px;">
              <a href="https://www.ngadalearn.pt/dashboard"
                 style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:15px 40px;border-radius:10px;font-weight:800;font-size:16px;">
                Aceder ao Curso →
              </a>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;padding:20px;margin-bottom:24px;">
              <tr><td>
                <p style="margin:0 0 10px;font-weight:700;font-size:13px;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">Incluído no seu plano:</p>
                ${features.map(f => `<p style="margin:0 0 6px;font-size:13px;color:#4b5563;">✅ &nbsp;${f}</p>`).join("")}
              </td></tr>
            </table>

            <p style="color:#9ca3af;font-size:12px;text-align:center;line-height:1.8;margin:0;">
              Guarde este email como comprovativo do pagamento.<br>
              Questões? Contacte-nos em <a href="mailto:${process.env.EMAIL_USER}" style="color:#7c3aed;text-decoration:none;">${process.env.EMAIL_USER}</a>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#f9fafb;padding:20px 48px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:11px;margin:0;line-height:1.8;">
              © ${new Date().getFullYear()} NgadaLearn &nbsp;·&nbsp;
              <a href="https://www.ngadalearn.pt" style="color:#7c3aed;text-decoration:none;">www.ngadalearn.pt</a><br>
              Pagamento processado em segurança por <strong>Stripe</strong> — PCI DSS Nível 1
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await getTransporter().sendMail({
    from:    `"NgadaLearn" <${process.env.EMAIL_USER}>`,
    to,
    subject: `✅ Comprovativo NgadaLearn — ${planLabel}`,
    html,
  });

  return true;
}

async function sendPasswordReset({ to, name, resetUrl }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  EMAIL_USER/EMAIL_PASS não configurados — email de reset não enviado.");
    return false;
  }

  const html = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed 0%,#2563eb 100%);padding:36px 48px;text-align:center;">
            <h1 style="color:#ffffff;margin:0 0 6px;font-size:28px;font-weight:900;">NgadaLearn</h1>
            <p style="color:#c4b5fd;margin:0;font-size:14px;">RECUPERAÇÃO DE SENHA</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 48px;">
            <h2 style="color:#111827;margin:0 0 8px;font-size:22px;font-weight:800;">Redefinir a sua senha 🔒</h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Olá <strong>${name}</strong>, recebemos um pedido para redefinir a senha da sua conta NgadaLearn.
              Este link é válido por <strong>1 hora</strong>.
            </p>
            <div style="text-align:center;margin:0 0 32px;">
              <a href="${resetUrl}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:15px 40px;border-radius:10px;font-weight:800;font-size:16px;">
                Redefinir Senha →
              </a>
            </div>
            <p style="color:#9ca3af;font-size:13px;line-height:1.6;margin:0 0 8px;">
              Se não solicitou a recuperação de senha, ignore este email. A sua senha permanece inalterada.
            </p>
            <p style="color:#9ca3af;font-size:11px;margin:0;">
              Ou aceda directamente: <a href="${resetUrl}" style="color:#7c3aed;">${resetUrl}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 48px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:11px;margin:0;">
              © ${new Date().getFullYear()} NgadaLearn &nbsp;·&nbsp;
              <a href="https://www.ngadalearn.pt" style="color:#7c3aed;text-decoration:none;">www.ngadalearn.pt</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await getTransporter().sendMail({
    from:    `"NgadaLearn" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔒 Recuperação de senha — NgadaLearn",
    html,
  });

  return true;
}

module.exports = { sendReceipt, sendPasswordReset };
