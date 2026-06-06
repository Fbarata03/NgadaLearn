import { Link } from "react-router";
import { GraduationCap, ArrowLeft } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Aceitação dos Termos",
    content: `Ao aceder ou utilizar a plataforma NgadaLearn ("Serviço"), o utilizador ("você") concorda em ficar vinculado a estes Termos de Uso. Se não concordar com algum ponto, não deverá utilizar o Serviço. Estes termos aplicam-se a todos os visitantes, utilizadores registados e compradores.`,
  },
  {
    title: "2. Descrição do Serviço",
    content: `A NgadaLearn é uma plataforma de aprendizagem de inglês online que oferece aulas de conversação, áudio com falantes nativos (NgadaFlow), exercícios práticos e certificado de conclusão. O acesso ao conteúdo está condicionado à aquisição de um plano (mensal ou vitalício).`,
  },
  {
    title: "3. Registo de Conta",
    content: `Para aceder ao conteúdo do curso, deve criar uma conta com nome completo, endereço de e-mail válido e senha segura. É da sua responsabilidade manter as credenciais em segurança e notificar-nos imediatamente em caso de acesso não autorizado. Uma conta é pessoal e intransmissível — não pode ser partilhada com terceiros.`,
  },
  {
    title: "4. Planos e Pagamentos",
    content: `Oferecemos dois planos de acesso:\n\n• Plano Mensal (US$ 15/mês): acesso completo por 30 dias, renovável. O acesso é suspenso automaticamente caso a renovação não seja efectuada dentro do prazo.\n\n• Plano Vitalício (US$ 150, pagamento único): acesso permanente a todo o conteúdo, incluindo atualizações futuras, sem quaisquer custos adicionais.\n\nTodos os pagamentos são processados de forma segura através da Stripe, Inc. Ao efectuar um pagamento, concorda também com os termos de serviço da Stripe.`,
  },
  {
    title: "5. Política de Reembolso",
    content: `Dado o carácter digital e imediato do acesso ao conteúdo, não são concedidos reembolsos após a ativação da conta. Em caso de problemas técnicos ou situações excepcionais, pode contactar-nos através de suporte@ngadalearn.pt — analisaremos cada caso individualmente.`,
  },
  {
    title: "6. Propriedade Intelectual",
    content: `Todo o conteúdo disponível na plataforma — incluindo textos, áudios, vídeos, exercícios, design e código — é propriedade exclusiva da NgadaLearn e está protegido por legislação de direitos de autor. É expressamente proibido copiar, redistribuir, revender ou publicar qualquer conteúdo sem autorização escrita prévia.`,
  },
  {
    title: "7. Conduta do Utilizador",
    content: `Ao utilizar o Serviço, compromete-se a não:\n\n• Partilhar as suas credenciais de acesso com terceiros\n• Tentar aceder a áreas restritas da plataforma\n• Reproduzir ou distribuir conteúdo protegido\n• Utilizar o Serviço para fins ilegais ou prejudiciais\n• Interferir com o funcionamento técnico da plataforma\n\nA violação destas regras pode resultar na suspensão imediata da conta sem reembolso.`,
  },
  {
    title: "8. Disponibilidade do Serviço",
    content: `Empreendemos esforços razoáveis para garantir a disponibilidade contínua da plataforma, mas não podemos garantir 100% de uptime. Podem ocorrer interrupções temporárias para manutenção ou por razões técnicas fora do nosso controlo. Não nos responsabilizamos por perdas decorrentes de indisponibilidade temporária do Serviço.`,
  },
  {
    title: "9. Limitação de Responsabilidade",
    content: `A NgadaLearn não garante que o Serviço satisfará todas as suas expectativas ou que os resultados de aprendizagem serão atingidos num prazo específico, uma vez que dependem do empenho e dedicação individual de cada utilizador. A nossa responsabilidade total, em qualquer circunstância, não poderá exceder o valor pago pelo plano adquirido.`,
  },
  {
    title: "10. Alterações aos Termos",
    content: `Reservamo-nos o direito de alterar estes Termos em qualquer momento. Notificaremos os utilizadores registados por e-mail com pelo menos 15 dias de antecedência em caso de alterações significativas. A continuação do uso do Serviço após a notificação implica a aceitação dos novos termos.`,
  },
  {
    title: "11. Lei Aplicável e Jurisdição",
    content: `Estes Termos são regidos pela lei portuguesa. Qualquer litígio decorrente da utilização do Serviço será submetido à jurisdição dos tribunais portugueses, sem prejuízo do direito do consumidor de recorrer a meios alternativos de resolução de conflitos.`,
  },
  {
    title: "12. Contacto",
    content: `Para questões relacionadas com estes Termos de Uso, contacte-nos:\n\nE-mail: suporte@ngadalearn.pt\nResposta habitual em até 2 dias úteis.`,
  },
];

export function Terms() {
  return (
    <div style={{ minHeight: "100vh", background: "#f9f8ff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#07070f,#1e1b4b)", padding: "48px 24px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(167,139,250,.15)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 99, padding: "5px 16px", marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 700 }}>Documento legal</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            Termos de Uso
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
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0 }}>
            Estes Termos de Uso regulam a relação entre a <strong>NgadaLearn</strong> e os utilizadores da plataforma de aprendizagem de inglês disponível em <strong>www.ngadalearn.pt</strong>. Leia atentamente antes de utilizar o Serviço.
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
            Ao utilizar a NgadaLearn, confirma que leu e compreendeu estes Termos de Uso.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/privacy" style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
              Política de Privacidade
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
