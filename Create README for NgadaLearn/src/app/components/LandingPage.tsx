import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check, Headphones, MessageCircle, TrendingUp, Globe, Zap, Award } from "lucide-react";

export function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-4">
            🌍 Fluência Global Acessível
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Fluência em Inglês
            <br />
            com Alma e Ritmo
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Aprenda inglês de verdade, com conversação realista e metodologia moderna.
            Tudo por menos que o preço de um café.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/subscribe">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg">
                Começar Agora - US$ 5/mês
              </Button>
            </Link>
            <Link to="/lessons">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Ver Demonstração
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            ✓ Cancele quando quiser • ✓ Sem anúncios • ✓ Acesso completo
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Por que NgadaLearn?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <MessageCircle className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Conversação Realista</h3>
            <p className="text-gray-600">
              Exercícios focados no inglês falado no dia a dia, fugindo da gramática robótica.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Headphones className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">NgadaFlow (Áudio)</h3>
            <p className="text-gray-600">
              Treinamento de listening com diferentes sotaques e ritmos do inglês global.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Progresso Visual</h3>
            <p className="text-gray-600">
              Dashboard completo para acompanhar sua evolução e manter a motivação.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Globe className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Acesso Global</h3>
            <p className="text-gray-600">
              Aprenda de qualquer lugar, em qualquer dispositivo. Mobile, tablet ou desktop.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Zap className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Sem Anúncios</h3>
            <p className="text-gray-600">
              Experiência premium pura. Você paga pelo ensino, não para ver propagandas.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Award className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Certificação</h3>
            <p className="text-gray-600">
              Conquiste certificados conforme avança e comprove sua fluência.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl my-20">
        <div className="max-w-4xl mx-auto text-center text-white space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Apenas US$ 5 por mês
          </h2>

          <p className="text-xl md:text-2xl opacity-90">
            O preço de um café expresso para 30 dias de fluência contínua
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left max-w-3xl mx-auto my-12">
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Acessibilidade Global</h4>
                <p className="text-sm opacity-90">
                  Valor justo para estudantes em todo o mundo
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Recursos Completos</h4>
                <p className="text-sm opacity-90">
                  Acesso total a todas as funcionalidades
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Cancele Quando Quiser</h4>
                <p className="text-sm opacity-90">
                  Sem contratos ou taxas escondidas
                </p>
              </div>
            </div>
          </div>

          <Link to="/subscribe">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-lg font-bold"
            >
              Começar Minha Jornada Agora
            </Button>
          </Link>

          <p className="text-sm opacity-75 mt-4">
            Pagamento seguro via Stripe • Dados 100% protegidos
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          O que nossos alunos dizem
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              "Finalmente um app que ensina inglês de verdade, não só gramática chata. E por US$ 5? Imperdível!"
            </p>
            <p className="font-bold">Maria Silva</p>
            <p className="text-sm text-gray-500">São Paulo, Brasil</p>
          </Card>

          <Card className="p-6">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              "O NgadaFlow mudou meu listening completamente. Agora entendo filmes sem legenda!"
            </p>
            <p className="font-bold">João Costa</p>
            <p className="text-sm text-gray-500">Lisboa, Portugal</p>
          </Card>

          <Card className="p-6">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              "Melhor custo-benefício do mercado. Aprendo no celular durante o trajeto pro trabalho."
            </p>
            <p className="font-bold">Carlos Mendes</p>
            <p className="text-sm text-gray-500">Luanda, Angola</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
