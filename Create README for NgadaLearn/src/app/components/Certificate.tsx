import { useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../hooks/useProgress";

const CERT_STYLE = `
@media print {
  body * { visibility: hidden !important; }
  #cert-root, #cert-root * { visibility: visible !important; }
  #cert-root { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 9999 !important; }
  #cert-no-print { display: none !important; }
}
`;

function formatDate(d: Date) {
  return d.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
}

export function Certificate() {
  const { user } = useAuth();
  const { totalCompleted, totalMinutes } = useProgress();
  const certRef = useRef<HTMLDivElement>(null);

  const completionDate = formatDate(new Date());
  const hours = Math.floor(totalMinutes / 60);
  const mins  = totalMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}min` : `${mins} minutos`;

  function handlePrint() { window.print(); }

  return (
    <>
      <style>{CERT_STYLE}</style>

      {/* ── Barra de ação ── */}
      <div id="cert-no-print" className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white border-b shadow-sm px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <Link to="/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Voltar
          </Link>
          <div className="flex-1" />
          <span className="text-xs text-gray-400 hidden sm:block">Pré-visualização do certificado</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2m2 4h6a2 2 0 0 0 2-2v-4H7v4a2 2 0 0 0 2 2zm1-12V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1"/></svg>
            Imprimir / Guardar PDF
          </button>
        </div>

        {/* ── Área de pré-visualização ── */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center">
          <div ref={certRef} id="cert-root"
            style={{
              width: "100%", maxWidth: 900,
              background: "#fff",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              boxShadow: "0 20px 60px rgba(0,0,0,.18)",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
            }}>

            {/* ══ Borda externa decorativa ══ */}
            <div style={{
              position: "absolute", inset: 10,
              border: "2px solid rgba(109,40,217,.25)",
              borderRadius: 2,
              pointerEvents: "none",
              zIndex: 1,
            }} />
            <div style={{
              position: "absolute", inset: 14,
              border: "1px solid rgba(109,40,217,.12)",
              borderRadius: 1,
              pointerEvents: "none",
              zIndex: 1,
            }} />

            {/* ══ Fundo decorativo ══ */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `
                radial-gradient(ellipse at 15% 20%, rgba(109,40,217,.04) 0%, transparent 55%),
                radial-gradient(ellipse at 85% 80%, rgba(109,40,217,.04) 0%, transparent 55%)
              `,
              pointerEvents: "none",
            }} />

            {/* ══ HEADER GRADIENTE ══ */}
            <div style={{
              background: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #4338ca 100%)",
              padding: "32px 48px 28px",
              textAlign: "center",
              position: "relative",
            }}>
              {/* Cantos decorativos */}
              {[
                {top:8,left:8}, {top:8,right:8},
                {bottom:8,left:8}, {bottom:8,right:8}
              ].map((pos, i) => (
                <div key={i} style={{
                  position:"absolute", ...pos,
                  width:20, height:20,
                  borderTop: i<2 ? "2px solid rgba(255,255,255,.35)" : undefined,
                  borderBottom: i>=2 ? "2px solid rgba(255,255,255,.35)" : undefined,
                  borderLeft: (i===0||i===2) ? "2px solid rgba(255,255,255,.35)" : undefined,
                  borderRight: (i===1||i===3) ? "2px solid rgba(255,255,255,.35)" : undefined,
                }} />
              ))}

              {/* Logo */}
              <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:10}}>
                <span style={{fontSize:28}}>🎓</span>
                <span style={{fontSize:22, fontWeight:900, color:"#fff", letterSpacing:"0.04em", fontFamily:"system-ui, sans-serif"}}>
                  NgadaLearn
                </span>
              </div>
              <div style={{width:60, height:2, background:"rgba(255,255,255,.4)", margin:"0 auto 10px"}} />
              <p style={{color:"rgba(221,214,254,.85)", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", fontFamily:"system-ui, sans-serif"}}>
                Plataforma de Aprendizagem de Inglês
              </p>
            </div>

            {/* ══ CORPO ══ */}
            <div style={{padding:"36px 56px 32px", textAlign:"center", position:"relative", zIndex:2}}>

              {/* Título */}
              <p style={{
                fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase",
                color:"#6d28d9", fontFamily:"system-ui, sans-serif", fontWeight:700,
                marginBottom:8,
              }}>
                Certificado de Conclusão
              </p>
              <div style={{width:48, height:2, background:"linear-gradient(90deg,#7c3aed,#4338ca)", margin:"0 auto 20px", borderRadius:2}} />

              {/* Texto */}
              <p style={{fontSize:15, color:"#4b5563", fontStyle:"italic", marginBottom:14, lineHeight:1.5}}>
                Certificamos que
              </p>

              {/* Nome do aluno */}
              <div style={{
                fontSize:"clamp(26px, 4vw, 38px)", fontWeight:700,
                color:"#1e1b4b",
                letterSpacing:"0.01em",
                lineHeight:1.2,
                padding:"10px 24px",
                borderBottom:"2px solid #7c3aed",
                display:"inline-block",
                marginBottom:20,
                minWidth:280,
              }}>
                {user?.name || "Estudante"}
              </div>

              {/* Texto continuação */}
              <p style={{fontSize:14, color:"#4b5563", lineHeight:1.8, marginTop:18, marginBottom:24}}>
                concluiu com êxito o programa de estudos do curso
              </p>

              {/* Nome do curso */}
              <div style={{
                background:"linear-gradient(135deg,#f5f3ff,#ede9fe)",
                border:"1px solid #c4b5fd",
                borderRadius:8,
                padding:"14px 32px",
                display:"inline-block",
                marginBottom:28,
              }}>
                <p style={{
                  fontSize:"clamp(15px, 2.5vw, 20px)", fontWeight:700,
                  color:"#4c1d95", margin:0,
                  letterSpacing:"0.02em",
                }}>
                  Inglês com Músicas, Filmes e Conversação
                </p>
                <p style={{fontSize:11, color:"#7c3aed", margin:"4px 0 0", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"system-ui, sans-serif"}}>
                  NgadaLearn — Inglês Imersivo
                </p>
              </div>

              {/* Stats */}
              <div style={{display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap", marginBottom:28}}>
                {[
                  { icon:"📚", label:"Lições Concluídas", value: totalCompleted > 0 ? String(totalCompleted) : "Curso" },
                  { icon:"⏱️", label:"Tempo de Estudo",   value: totalMinutes > 0 ? timeStr : "—" },
                  { icon:"📅", label:"Data de Conclusão", value: completionDate },
                ].map(s => (
                  <div key={s.label} style={{
                    background:"#fafafa", border:"1px solid #e5e7eb",
                    borderRadius:8, padding:"10px 16px", textAlign:"center", minWidth:140,
                  }}>
                    <p style={{fontSize:18, margin:"0 0 4px"}}>{s.icon}</p>
                    <p style={{fontSize:10, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 2px", fontFamily:"system-ui, sans-serif"}}>{s.label}</p>
                    <p style={{fontSize:13, fontWeight:700, color:"#1f2937", margin:0, fontFamily:"system-ui, sans-serif"}}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Divisor */}
              <div style={{width:"80%", height:1, background:"linear-gradient(90deg,transparent,#e5e7eb,transparent)", margin:"0 auto 24px"}} />

              {/* Assinatura */}
              <div style={{display:"flex", justifyContent:"center", gap:48, flexWrap:"wrap"}}>
                <div style={{textAlign:"center", minWidth:160}}>
                  <div style={{
                    fontSize:24, fontFamily:"'Brush Script MT', cursive",
                    color:"#4c1d95", marginBottom:4, letterSpacing:"0.02em",
                  }}>
                    NgadaLearn
                  </div>
                  <div style={{width:"100%", height:1, background:"#d1d5db", marginBottom:6}} />
                  <p style={{fontSize:10, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.1em", margin:0, fontFamily:"system-ui, sans-serif"}}>
                    Direcção Pedagógica
                  </p>
                </div>

                {/* Selo */}
                <div style={{
                  width:80, height:80,
                  border:"2px solid #7c3aed",
                  borderRadius:"50%",
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  background:"linear-gradient(135deg,#f5f3ff,#ede9fe)",
                  boxShadow:"inset 0 0 0 4px rgba(109,40,217,.1)",
                }}>
                  <span style={{fontSize:20}}>🎓</span>
                  <span style={{fontSize:7, color:"#6d28d9", fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase", fontFamily:"system-ui, sans-serif", marginTop:2}}>
                    CERTIFICADO
                  </span>
                </div>
              </div>
            </div>

            {/* ══ FOOTER ══ */}
            <div style={{
              background:"linear-gradient(135deg,#f5f3ff,#ede9fe)",
              borderTop:"1px solid #c4b5fd",
              padding:"10px 48px",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              flexWrap:"wrap", gap:8,
            }}>
              <p style={{fontSize:10, color:"#7c3aed", margin:0, fontFamily:"system-ui, sans-serif"}}>
                🌐 www.ngadalearn.pt
              </p>
              <p style={{fontSize:10, color:"#9ca3af", margin:0, fontFamily:"system-ui, sans-serif"}}>
                Certificado emitido em {completionDate}
              </p>
              <p style={{fontSize:10, color:"#7c3aed", margin:0, fontFamily:"system-ui, sans-serif"}}>
                © {new Date().getFullYear()} NgadaLearn
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
