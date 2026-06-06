import { Link } from "react-router";

const SECTIONS = [
  {
    title: "1. Responsável pelo Tratamento",
    content: `A NgadaLearn é responsável pelo tratamento dos dados pessoais recolhidos através da plataforma disponível em www.ngadalearn.pt. Para qualquer questão relacionada com privacidade, pode contactar-nos através de suporte@ngadalearn.pt.`,
  },
  {
    title: "2. Dados que Recolhemos",
    content: `Recolhemos apenas os dados estritamente necessários para a prestação do Serviço:\n\n• Nome completo e endereço de e-mail (no registo)\n• Senha (armazenada de forma encriptada — nunca em texto simples)\n• Dados de pagamento: processados directamente pela Stripe, Inc. A NgadaLearn não armazena números de cartão de crédito\n• Dados de progresso: aulas concluídas, tempo de estudo, sequências de dias\n• Dados técnicos: endereço IP, tipo de browser e sistema operativo (para segurança e diagnóstico)`,
  },
  {
    title: "3. Como Utilizamos os seus Dados",
    content: `Os dados pessoais recolhidos são utilizados exclusivamente para:\n\n• Criar e gerir a sua conta de utilizador\n• Processar pagamentos e emitir comprovativos\n• Personalizar a experiência de aprendizagem e acompanhar o progresso\n• Enviar comunicações importantes sobre o Serviço (actualizações, manutenções)\n• Gerar o certificado de conclusão personalizado\n• Garantir a segurança da plataforma e prevenir acessos não autorizados`,
  },
  {
    title: "4. Base Legal para o Tratamento",
    content: `O tratamento dos seus dados assenta nas seguintes bases legais (RGPD):\n\n• Execução de contrato: para prestar o Serviço contratado\n• Consentimento: para comunicações de marketing (pode revogar a qualquer momento)\n• Interesse legítimo: para segurança da plataforma e prevenção de fraude`,
  },
  {
    title: "5. Partilha de Dados com Terceiros",
    content: `Não vendemos, alugamos nem partilhamos os seus dados pessoais com terceiros para fins comerciais. Os dados podem ser partilhados apenas com:\n\n• Stripe, Inc.: para processamento seguro de pagamentos (PCI DSS certificada)\n• Neon / PostgreSQL: base de dados hospedada com encriptação em repouso\n• Render.com: infraestrutura de servidor com protocolos de segurança padrão da indústria\n\nTodos os prestadores são vinculados por acordos de confidencialidade e tratam os dados exclusivamente nas nossas instruções.`,
  },
  {
    title: "6. Segurança dos Dados",
    content: `Adoptamos medidas técnicas e organizativas adequadas para proteger os seus dados:\n\n• Comunicações encriptadas via HTTPS/TLS\n• Senhas encriptadas com algoritmos de hash seguros (bcrypt)\n• Autenticação via tokens JWT com expiração\n• Acesso restrito aos dados por princípio de menor privilégio\n• Monitorização de acessos suspeitos`,
  },
  {
    title: "7. Retenção de Dados",
    content: `Conservamos os seus dados pelo tempo necessário à prestação do Serviço e cumprimento de obrigações legais:\n\n• Dados de conta: enquanto a conta estiver activa\n• Dados de pagamento (registos): 5 anos (obrigação fiscal)\n• Dados de progresso: eliminados 30 dias após o encerramento da conta\n\nPode solicitar a eliminação da conta em qualquer momento através de suporte@ngadalearn.pt.`,
  },
  {
    title: "8. Os seus Direitos (RGPD)",
    content: `Como titular dos dados, tem os seguintes direitos:\n\n• Acesso: saber que dados temos sobre si\n• Rectificação: corrigir dados incorrectos ou incompletos\n• Eliminação: solicitar o apagamento dos seus dados ("direito ao esquecimento")\n• Portabilidade: receber os seus dados num formato legível por máquina\n• Oposição: opor-se ao tratamento com base no interesse legítimo\n• Limitação: restringir o tratamento em determinadas circunstâncias\n\nPara exercer qualquer destes direitos, contacte-nos em suporte@ngadalearn.pt. Respondemos em até 30 dias.`,
  },
  {
    title: "9. Cookies e Tecnologias Semelhantes",
    content: `Utilizamos cookies essenciais para o funcionamento da plataforma (autenticação, sessão). Não utilizamos cookies de rastreamento publicitário nem partilhamos dados com redes de publicidade. Pode gerir as preferências de cookies nas definições do seu browser, embora a desativação de cookies essenciais possa impedir o funcionamento correcto da plataforma.`,
  },
  {
    title: "10. Transferências Internacionais",
    content: `Os dados podem ser processados em servidores localizados nos Estados Unidos (Stripe, Render) e na União Europeia (Neon). Quando ocorrem transferências para países terceiros, garantimos que estão em conformidade com o RGPD através de Cláusulas Contratuais Padrão ou certificações equivalentes.`,
  },
  {
    title: "11. Menores de Idade",
    content: `A NgadaLearn não é destinada a menores de 16 anos. Não recolhemos intencionalmente dados de crianças. Se tomarmos conhecimento de que um menor nos forneceu dados pessoais, eliminaremos esses dados imediatamente.`,
  },
  {
    title: "12. Alterações à Política",
    content: `Podemos actualizar esta Política de Privacidade periodicamente. Notificaremos os utilizadores registados por e-mail em caso de alterações significativas, com pelo menos 15 dias de antecedência. A data de última actualização é sempre indicada no topo do documento.`,
  },
  {
    title: "13. Reclamações",
    content: `Se considerar que o tratamento dos seus dados viola o RGPD, tem o direito de apresentar uma reclamação junto da autoridade de supervisão competente:\n\nCNPD — Comissão Nacional de Protecção de Dados\nwww.cnpd.pt | geral@cnpd.pt\nRua de São Bento, 148-3º, 1200-821 Lisboa`,
  },
  {
    title: "14. Contacto",
    content: `Para qualquer questão relacionada com privacidade ou protecção de dados:\n\nE-mail: suporte@ngadalearn.pt\nResposta em até 5 dias úteis.`,
  },
];

export function Privacy() {
  return (
    <div style={{ minHeight: "100vh", background: "#f9f8ff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#07070f,#1e1b4b)", padding: "48px 24px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(167,139,250,.15)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 99, padding: "5px 16px", marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 700 }}>Documento legal · RGPD</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            Política de Privacidade
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.5)", margin: 0 }}>
            Última actualização: Junho de 2026 · NgadaLearn
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Intro */}
        <div style={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: 20, padding: "24px 28px", marginBottom: 32, borderLeft: "4px solid #7c3aed" }}>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: "0 0 12px" }}>
            A <strong>NgadaLearn</strong> respeita a sua privacidade e está comprometida com a protecção dos seus dados pessoais. Esta Política descreve como recolhemos, usamos e protegemos as informações que nos fornece ao utilizar a nossa plataforma.
          </p>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.75, margin: 0 }}>
            Esta política está em conformidade com o <strong>Regulamento Geral sobre a Protecção de Dados (RGPD)</strong> — Regulamento (UE) 2016/679 — e a legislação portuguesa aplicável.
          </p>
        </div>

        {/* Secções */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {SECTIONS.map(({ title, content }) => (
            <div key={title} style={{ background: "#fff", border: "1px solid #f0eeff", borderRadius: 18, padding: "24px 28px" }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111", margin: "0 0 12px", letterSpacing: "-0.2px" }}>{title}</h2>
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.85, margin: 0, whiteSpace: "pre-line" }}>{content}</p>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div style={{ marginTop: 48, padding: "24px", background: "#f5f3ff", borderRadius: 18, border: "1px solid #ede9fe", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 12px" }}>
            Os seus dados estão seguros connosco. Tratamo-los com respeito e transparência.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/terms" style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
              Termos de Uso
            </Link>
            <span style={{ color: "#d1d5db" }}>|</span>
            <a href="mailto:suporte@ngadalearn.pt" style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
              suporte@ngadalearn.pt
            </a>
            <span style={{ color: "#d1d5db" }}>|</span>
            <Link to="/" style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
