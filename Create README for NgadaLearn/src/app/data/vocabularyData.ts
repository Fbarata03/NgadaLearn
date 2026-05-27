/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Dados de Vocabulário
   Adjectivos, Advérbios, Verbos Irregulares, Verbos Regulares, Expressões Idiomáticas
   ════════════════════════════════════════════════════════════════════ */

export interface VocabWord {
  en: string;
  pt: string;
  example?: string;
  examplePt?: string;
}

export interface VocabSection {
  id: string;
  title: string;
  titlePt: string;
  icon: string;
  color: string;
  words: VocabWord[];
}

export interface IrregularVerb {
  base: string;
  past: string;
  participle: string;
  pt: string;
}

export interface Idiom {
  expression: string;
  meaning: string;
  example: string;
  examplePt: string;
}

export interface VocabData {
  adjectives: VocabSection;
  adverbs: VocabSection;
  irregularVerbs: IrregularVerb[];
  regularVerbs: VocabSection;
  idioms: Idiom[];
}

export const VOCABULARY: VocabData = {
  adjectives: {
    id: "adjectives",
    title: "Common Adjectives",
    titlePt: "Adjectivos Comuns",
    icon: "🎨",
    color: "bg-violet-600",
    words: [
      { en: "beautiful", pt: "bonito/a", example: "She has a beautiful smile.", examplePt: "Ela tem um sorriso bonito." },
      { en: "ugly", pt: "feio/a", example: "That building is really ugly.", examplePt: "Aquele edifício é mesmo feio." },
      { en: "big", pt: "grande", example: "They live in a big house.", examplePt: "Eles vivem numa casa grande." },
      { en: "small", pt: "pequeno/a", example: "He drives a small car.", examplePt: "Ele conduz um carro pequeno." },
      { en: "fast", pt: "rápido/a", example: "She is a very fast runner.", examplePt: "Ela é uma corredora muito rápida." },
      { en: "slow", pt: "lento/a", example: "The internet connection is too slow.", examplePt: "A ligação à internet é demasiado lenta." },
      { en: "hot", pt: "quente", example: "Be careful, the plate is hot.", examplePt: "Cuidado, o prato está quente." },
      { en: "cold", pt: "frio/a", example: "It's very cold outside today.", examplePt: "Está muito frio lá fora hoje." },
      { en: "happy", pt: "feliz", example: "I feel very happy today.", examplePt: "Sinto-me muito feliz hoje." },
      { en: "sad", pt: "triste", example: "She looked sad after the news.", examplePt: "Ela ficou triste depois das notícias." },
      { en: "angry", pt: "zangado/a", example: "He was angry about the delay.", examplePt: "Ele estava zangado com o atraso." },
      { en: "tired", pt: "cansado/a", example: "I'm too tired to go out tonight.", examplePt: "Estou cansado demais para sair esta noite." },
      { en: "hungry", pt: "com fome", example: "Are you hungry? Let's eat.", examplePt: "Tens fome? Vamos comer." },
      { en: "thirsty", pt: "com sede", example: "I'm thirsty. Can I have some water?", examplePt: "Tenho sede. Posso ter um pouco de água?" },
      { en: "expensive", pt: "caro/a", example: "This restaurant is too expensive.", examplePt: "Este restaurante é demasiado caro." },
      { en: "cheap", pt: "barato/a", example: "I found a cheap flight to London.", examplePt: "Encontrei um voo barato para Londres." },
      { en: "easy", pt: "fácil", example: "The test was quite easy.", examplePt: "O teste foi bastante fácil." },
      { en: "difficult", pt: "difícil", example: "Learning Japanese is very difficult.", examplePt: "Aprender japonês é muito difícil." },
      { en: "new", pt: "novo/a", example: "I bought a new phone.", examplePt: "Comprei um telefone novo." },
      { en: "old", pt: "velho/a / antigo/a", example: "This is an old building.", examplePt: "Este é um edifício antigo." },
      { en: "young", pt: "jovem", example: "She is young but very talented.", examplePt: "Ela é jovem mas muito talentosa." },
      { en: "tall", pt: "alto/a", example: "My brother is very tall.", examplePt: "O meu irmão é muito alto." },
      { en: "short", pt: "baixo/a / curto/a", example: "The film was quite short.", examplePt: "O filme foi bastante curto." },
      { en: "long", pt: "longo/a", example: "It was a very long journey.", examplePt: "Foi uma viagem muito longa." },
      { en: "clean", pt: "limpo/a", example: "Keep your room clean.", examplePt: "Mantém o teu quarto limpo." },
      { en: "dirty", pt: "sujo/a", example: "His shoes are dirty.", examplePt: "Os sapatos dele estão sujos." },
      { en: "strong", pt: "forte", example: "You need to be strong.", examplePt: "Precisas de ser forte." },
      { en: "weak", pt: "fraco/a", example: "The signal is too weak here.", examplePt: "O sinal é demasiado fraco aqui." },
      { en: "loud", pt: "barulhento/a / alto/a", example: "The music is too loud.", examplePt: "A música está demasiado alta." },
      { en: "quiet", pt: "silencioso/a / calmo/a", example: "Can you be quiet please?", examplePt: "Podes estar quieto por favor?" },
      { en: "funny", pt: "engraçado/a", example: "He tells very funny jokes.", examplePt: "Ele conta piadas muito engraçadas." },
      { en: "boring", pt: "aborrecido/a", example: "The lecture was really boring.", examplePt: "A conferência foi muito aborrecida." },
      { en: "interesting", pt: "interessante", example: "That is a very interesting idea.", examplePt: "Essa é uma ideia muito interessante." },
      { en: "important", pt: "importante", example: "This is a very important decision.", examplePt: "Esta é uma decisão muito importante." },
      { en: "busy", pt: "ocupado/a", example: "I'm very busy this week.", examplePt: "Estou muito ocupado esta semana." },
      { en: "free", pt: "livre / grátis", example: "Are you free tomorrow evening?", examplePt: "Estás livre amanhã à noite?" },
      { en: "right", pt: "certo/a / correcto/a", example: "You are absolutely right.", examplePt: "Tens completamente razão." },
      { en: "wrong", pt: "errado/a", example: "I think you have the wrong number.", examplePt: "Acho que tem o número errado." },
      { en: "safe", pt: "seguro/a", example: "Is this neighbourhood safe?", examplePt: "Este bairro é seguro?" },
      { en: "dangerous", pt: "perigoso/a", example: "That road is very dangerous at night.", examplePt: "Aquela estrada é muito perigosa à noite." },
      { en: "useful", pt: "útil", example: "This app is really useful.", examplePt: "Esta aplicação é muito útil." },
      { en: "friendly", pt: "simpático/a / amigável", example: "The staff were very friendly.", examplePt: "Os funcionários foram muito simpáticos." },
      { en: "polite", pt: "educado/a", example: "She is always very polite.", examplePt: "Ela é sempre muito educada." },
      { en: "rude", pt: "mal-educado/a", example: "It was rude to leave without saying goodbye.", examplePt: "Foi mal-educado sair sem se despedir." },
      { en: "clever", pt: "esperto/a / inteligente", example: "What a clever idea!", examplePt: "Que ideia esperta!" },
      { en: "brave", pt: "corajoso/a", example: "She was very brave to speak in public.", examplePt: "Ela foi muito corajosa ao falar em público." },
      { en: "kind", pt: "gentil / amável", example: "It was kind of you to help.", examplePt: "Foi muito gentil da tua parte ajudar." },
      { en: "lazy", pt: "preguiçoso/a", example: "Don't be lazy, get up!", examplePt: "Não sejas preguiçoso, levanta-te!" },
      { en: "hard-working", pt: "trabalhador/a", example: "She is the most hard-working person I know.", examplePt: "Ela é a pessoa mais trabalhadora que conheço." },
      { en: "nervous", pt: "nervoso/a", example: "I always get nervous before exams.", examplePt: "Fico sempre nervoso antes dos exames." },
      { en: "worried", pt: "preocupado/a", example: "I'm worried about the results.", examplePt: "Estou preocupado com os resultados." },
      { en: "surprised", pt: "surpreendido/a", example: "I was surprised to see him there.", examplePt: "Fiquei surpreendido ao vê-lo lá." },
      { en: "excited", pt: "entusiasmado/a / animado/a", example: "She was excited about the trip.", examplePt: "Ela estava animada com a viagem." },
      { en: "bored", pt: "entediado/a", example: "The kids are bored.", examplePt: "As crianças estão entediadas." },
      { en: "comfortable", pt: "confortável", example: "This sofa is very comfortable.", examplePt: "Este sofá é muito confortável." },
      { en: "comfortable", pt: "confortável", example: "Are you comfortable?", examplePt: "Estás confortável?" },
      { en: "confident", pt: "confiante", example: "She gave a confident presentation.", examplePt: "Ela fez uma apresentação confiante." },
      { en: "popular", pt: "popular", example: "That show is very popular.", examplePt: "Esse programa é muito popular." },
      { en: "famous", pt: "famoso/a", example: "He is a very famous actor.", examplePt: "Ele é um actor muito famoso." },
      { en: "healthy", pt: "saudável", example: "It's important to eat healthy food.", examplePt: "É importante comer comida saudável." },
      { en: "sick", pt: "doente", example: "She stayed home because she was sick.", examplePt: "Ela ficou em casa porque estava doente." },
      { en: "lucky", pt: "com sorte / sortudo/a", example: "You're lucky to live so close to the beach.", examplePt: "Tens sorte em viver tão perto da praia." },
    ],
  },

  adverbs: {
    id: "adverbs",
    title: "Common Adverbs",
    titlePt: "Advérbios Comuns",
    icon: "⚡",
    color: "bg-amber-500",
    words: [
      { en: "always", pt: "sempre", example: "I always drink water in the morning.", examplePt: "Bebo sempre água de manhã." },
      { en: "usually", pt: "geralmente / normalmente", example: "I usually wake up at 7.", examplePt: "Normalmente acordo às 7." },
      { en: "often", pt: "muitas vezes / frequentemente", example: "We often go for walks.", examplePt: "Costumamos ir passear muitas vezes." },
      { en: "sometimes", pt: "às vezes", example: "Sometimes I cook at home.", examplePt: "Às vezes cozinho em casa." },
      { en: "rarely", pt: "raramente", example: "She rarely eats meat.", examplePt: "Ela raramente come carne." },
      { en: "never", pt: "nunca", example: "I never drink alcohol.", examplePt: "Nunca bebo álcool." },
      { en: "already", pt: "já (antes do esperado)", example: "I've already finished.", examplePt: "Já terminei." },
      { en: "yet", pt: "ainda (negativa/interrogativa)", example: "Has she arrived yet?", examplePt: "Ela já chegou?" },
      { en: "still", pt: "ainda (a continuar)", example: "Are you still working?", examplePt: "Ainda estás a trabalhar?" },
      { en: "just", pt: "acabar de / só / exactamente", example: "I've just had lunch.", examplePt: "Acabei de almoçar." },
      { en: "soon", pt: "em breve / logo", example: "I'll be ready soon.", examplePt: "Estarei pronto em breve." },
      { en: "now", pt: "agora", example: "I'm busy now.", examplePt: "Estou ocupado agora." },
      { en: "then", pt: "então / depois", example: "We had dinner and then went for a walk.", examplePt: "Jantar e depois fomos passear." },
      { en: "here", pt: "aqui", example: "Please sit here.", examplePt: "Por favor senta aqui." },
      { en: "there", pt: "ali / lá", example: "Put the box there.", examplePt: "Põe a caixa ali." },
      { en: "everywhere", pt: "em todo o lado", example: "I've looked everywhere for my keys.", examplePt: "Procurei as chaves em todo o lado." },
      { en: "nowhere", pt: "em lado nenhum", example: "There's nowhere to sit.", examplePt: "Não há onde sentar." },
      { en: "very", pt: "muito (intensificador)", example: "She is very intelligent.", examplePt: "Ela é muito inteligente." },
      { en: "quite", pt: "bastante / razoavelmente", example: "The hotel was quite nice.", examplePt: "O hotel era bastante agradável." },
      { en: "really", pt: "realmente / mesmo", example: "That was really interesting.", examplePt: "Isso foi mesmo interessante." },
      { en: "too", pt: "demasiado / também", example: "It's too hot today.", examplePt: "Está demasiado quente hoje." },
      { en: "enough", pt: "suficientemente / suficiente", example: "I didn't sleep enough last night.", examplePt: "Não dormi suficiente na noite passada." },
      { en: "almost", pt: "quase", example: "I'm almost ready.", examplePt: "Estou quase pronto." },
      { en: "nearly", pt: "quase / perto de", example: "We nearly missed the train.", examplePt: "Quase perdemos o comboio." },
      { en: "finally", pt: "finalmente", example: "We finally arrived after six hours.", examplePt: "Finalmente chegámos depois de seis horas." },
      { en: "suddenly", pt: "de repente / subitamente", example: "The lights suddenly went out.", examplePt: "As luzes apagaram-se de repente." },
      { en: "immediately", pt: "imediatamente / de imediato", example: "Please reply immediately.", examplePt: "Por favor responde de imediato." },
      { en: "quickly", pt: "rapidamente / depressa", example: "She finished the test quickly.", examplePt: "Ela terminou o teste rapidamente." },
      { en: "slowly", pt: "devagar / lentamente", example: "Please speak slowly.", examplePt: "Por favor fala devagar." },
      { en: "carefully", pt: "cuidadosamente / com cuidado", example: "Drive carefully in the rain.", examplePt: "Conduz com cuidado quando chove." },
      { en: "easily", pt: "facilmente", example: "She solved the problem easily.", examplePt: "Ela resolveu o problema facilmente." },
      { en: "badly", pt: "mal", example: "He speaks English badly.", examplePt: "Ele fala inglês mal." },
      { en: "well", pt: "bem", example: "She sings really well.", examplePt: "Ela canta mesmo bem." },
      { en: "hard", pt: "muito / arduamente", example: "He works very hard.", examplePt: "Ele trabalha muito arduamente." },
      { en: "hardly", pt: "mal / quase não", example: "I can hardly hear you.", examplePt: "Mal te consigo ouvir." },
      { en: "exactly", pt: "exactamente", example: "That's exactly what I meant.", examplePt: "É exactamente o que quis dizer." },
      { en: "probably", pt: "provavelmente", example: "It will probably rain tonight.", examplePt: "Provavelmente vai chover esta noite." },
      { en: "perhaps", pt: "talvez / quiçá", example: "Perhaps we should leave earlier.", examplePt: "Talvez devêssemos partir mais cedo." },
      { en: "definitely", pt: "definitivamente / com certeza", example: "I'll definitely be there.", examplePt: "Com certeza estou lá." },
      { en: "fortunately", pt: "felizmente", example: "Fortunately, nobody was hurt.", examplePt: "Felizmente ninguém se magoou." },
    ],
  },

  irregularVerbs: [
    { base: "be", past: "was/were", participle: "been", pt: "ser / estar" },
    { base: "have", past: "had", participle: "had", pt: "ter" },
    { base: "do", past: "did", participle: "done", pt: "fazer" },
    { base: "go", past: "went", participle: "gone", pt: "ir" },
    { base: "get", past: "got", participle: "got/gotten", pt: "obter / ficar" },
    { base: "make", past: "made", participle: "made", pt: "fazer / fabricar" },
    { base: "say", past: "said", participle: "said", pt: "dizer" },
    { base: "see", past: "saw", participle: "seen", pt: "ver" },
    { base: "know", past: "knew", participle: "known", pt: "saber / conhecer" },
    { base: "think", past: "thought", participle: "thought", pt: "pensar" },
    { base: "come", past: "came", participle: "come", pt: "vir" },
    { base: "take", past: "took", participle: "taken", pt: "levar / tirar" },
    { base: "find", past: "found", participle: "found", pt: "encontrar" },
    { base: "give", past: "gave", participle: "given", pt: "dar" },
    { base: "tell", past: "told", participle: "told", pt: "dizer / contar" },
    { base: "put", past: "put", participle: "put", pt: "pôr / colocar" },
    { base: "mean", past: "meant", participle: "meant", pt: "significar / querer dizer" },
    { base: "become", past: "became", participle: "become", pt: "tornar-se / ficar" },
    { base: "leave", past: "left", participle: "left", pt: "partir / deixar" },
    { base: "feel", past: "felt", participle: "felt", pt: "sentir" },
    { base: "bring", past: "brought", participle: "brought", pt: "trazer" },
    { base: "begin", past: "began", participle: "begun", pt: "começar" },
    { base: "keep", past: "kept", participle: "kept", pt: "guardar / continuar" },
    { base: "hold", past: "held", participle: "held", pt: "segurar / manter" },
    { base: "write", past: "wrote", participle: "written", pt: "escrever" },
    { base: "stand", past: "stood", participle: "stood", pt: "estar de pé" },
    { base: "hear", past: "heard", participle: "heard", pt: "ouvir" },
    { base: "let", past: "let", participle: "let", pt: "deixar / permitir" },
    { base: "meet", past: "met", participle: "met", pt: "conhecer / encontrar" },
    { base: "sit", past: "sat", participle: "sat", pt: "sentar" },
    { base: "run", past: "ran", participle: "run", pt: "correr" },
    { base: "read", past: "read", participle: "read", pt: "ler" },
    { base: "spend", past: "spent", participle: "spent", pt: "gastar / passar (tempo)" },
    { base: "send", past: "sent", participle: "sent", pt: "enviar" },
    { base: "buy", past: "bought", participle: "bought", pt: "comprar" },
    { base: "pay", past: "paid", participle: "paid", pt: "pagar" },
    { base: "cut", past: "cut", participle: "cut", pt: "cortar" },
    { base: "drive", past: "drove", participle: "driven", pt: "conduzir" },
    { base: "speak", past: "spoke", participle: "spoken", pt: "falar" },
    { base: "eat", past: "ate", participle: "eaten", pt: "comer" },
    { base: "drink", past: "drank", participle: "drunk", pt: "beber" },
    { base: "sleep", past: "slept", participle: "slept", pt: "dormir" },
    { base: "wake", past: "woke", participle: "woken", pt: "acordar" },
    { base: "fall", past: "fell", participle: "fallen", pt: "cair" },
    { base: "break", past: "broke", participle: "broken", pt: "partir / quebrar" },
    { base: "build", past: "built", participle: "built", pt: "construir" },
    { base: "choose", past: "chose", participle: "chosen", pt: "escolher" },
    { base: "grow", past: "grew", participle: "grown", pt: "crescer / cultivar" },
    { base: "lose", past: "lost", participle: "lost", pt: "perder" },
    { base: "win", past: "won", participle: "won", pt: "ganhar / vencer" },
  ],

  regularVerbs: {
    id: "regularVerbs",
    title: "Regular Verbs",
    titlePt: "Verbos Regulares",
    icon: "📋",
    color: "bg-emerald-600",
    words: [
      { en: "work (worked)", pt: "trabalhar", example: "She worked until midnight.", examplePt: "Ela trabalhou até à meia-noite." },
      { en: "like (liked)", pt: "gostar", example: "He liked the film.", examplePt: "Ele gostou do filme." },
      { en: "love (loved)", pt: "amar / adorar", example: "I loved every minute of it.", examplePt: "Adorei cada minuto." },
      { en: "hate (hated)", pt: "odiar / detestar", example: "She hated waiting.", examplePt: "Ela detestava esperar." },
      { en: "want (wanted)", pt: "querer", example: "I wanted to tell you something.", examplePt: "Queria dizer-te uma coisa." },
      { en: "need (needed)", pt: "precisar", example: "We needed more time.", examplePt: "Precisávamos de mais tempo." },
      { en: "help (helped)", pt: "ajudar", example: "He helped me carry the bags.", examplePt: "Ele ajudou-me a carregar os sacos." },
      { en: "ask (asked)", pt: "perguntar / pedir", example: "She asked for help.", examplePt: "Ela pediu ajuda." },
      { en: "answer (answered)", pt: "responder", example: "He answered all the questions.", examplePt: "Ele respondeu a todas as perguntas." },
      { en: "call (called)", pt: "ligar / chamar", example: "I called you three times.", examplePt: "Liguei-te três vezes." },
      { en: "talk (talked)", pt: "falar / conversar", example: "We talked for hours.", examplePt: "Conversámos durante horas." },
      { en: "walk (walked)", pt: "andar / caminhar", example: "We walked to the park.", examplePt: "Andámos até ao parque." },
      { en: "live (lived)", pt: "viver / morar", example: "They lived in Spain for two years.", examplePt: "Viveram em Espanha durante dois anos." },
      { en: "arrive (arrived)", pt: "chegar", example: "She arrived late.", examplePt: "Ela chegou tarde." },
      { en: "start (started)", pt: "começar", example: "The film started at 8.", examplePt: "O filme começou às 8." },
      { en: "finish (finished)", pt: "terminar / acabar", example: "I finished the book yesterday.", examplePt: "Terminei o livro ontem." },
      { en: "try (tried)", pt: "tentar / experimentar", example: "Have you tried this dish?", examplePt: "Já experimentaste este prato?" },
      { en: "use (used)", pt: "usar / utilizar", example: "Can I use your phone?", examplePt: "Posso usar o teu telemóvel?" },
      { en: "open (opened)", pt: "abrir", example: "She opened the window.", examplePt: "Ela abriu a janela." },
      { en: "close (closed)", pt: "fechar", example: "Please close the door.", examplePt: "Por favor fecha a porta." },
      { en: "wait (waited)", pt: "esperar", example: "We waited for an hour.", examplePt: "Esperámos uma hora." },
      { en: "watch (watched)", pt: "ver / observar", example: "I watched a documentary.", examplePt: "Vi um documentário." },
      { en: "listen (listened)", pt: "ouvir / escutar", example: "She listened carefully.", examplePt: "Ela ouviu com atenção." },
      { en: "learn (learned)", pt: "aprender", example: "I learned a lot today.", examplePt: "Aprendi muito hoje." },
      { en: "play (played)", pt: "jogar / tocar (instrumento)", example: "He played guitar at the party.", examplePt: "Ele tocou guitarra na festa." },
      { en: "study (studied)", pt: "estudar", example: "She studied all night.", examplePt: "Ela estudou a noite toda." },
      { en: "visit (visited)", pt: "visitar", example: "We visited Rome last summer.", examplePt: "Visitámos Roma no verão passado." },
      { en: "travel (travelled)", pt: "viajar", example: "He travelled to ten countries.", examplePt: "Ele viajou por dez países." },
      { en: "cook (cooked)", pt: "cozinhar", example: "I cooked dinner for everyone.", examplePt: "Cozinhei o jantar para todos." },
      { en: "clean (cleaned)", pt: "limpar", example: "She cleaned the whole house.", examplePt: "Ela limpou a casa toda." },
    ],
  },

  idioms: [
    {
      expression: "Break a leg!",
      meaning: "Boa sorte! (especialmente antes de uma actuação)",
      example: "You're going on stage in five minutes – break a leg!",
      examplePt: "Vais ao palco em cinco minutos – boa sorte!",
    },
    {
      expression: "Hit the nail on the head",
      meaning: "Acertar em cheio / dizer exactamente o que está certo",
      example: "You hit the nail on the head when you said the problem was communication.",
      examplePt: "Acertaste em cheio quando disseste que o problema era a comunicação.",
    },
    {
      expression: "Bite the bullet",
      meaning: "Aguentar / enfrentar algo difícil com coragem",
      example: "I didn't want to go to the dentist, but I bit the bullet.",
      examplePt: "Não queria ir ao dentista, mas enfrentei a situação.",
    },
    {
      expression: "Bite off more than you can chew",
      meaning: "Assumir mais responsabilidades do que se consegue gerir",
      example: "She accepted five projects at once and bit off more than she could chew.",
      examplePt: "Ela aceitou cinco projectos de uma vez e assumiu mais do que conseguia.",
    },
    {
      expression: "Beat around the bush",
      meaning: "Estar com rodeios / não ir directo ao assunto",
      example: "Stop beating around the bush and tell me what happened.",
      examplePt: "Pára de estar com rodeios e diz-me o que aconteceu.",
    },
    {
      expression: "The ball is in your court",
      meaning: "A decisão agora é tua",
      example: "I've made my offer. The ball is in your court.",
      examplePt: "Fiz a minha oferta. Agora a decisão é tua.",
    },
    {
      expression: "Kill two birds with one stone",
      meaning: "Resolver dois problemas com uma só acção",
      example: "I'll go shopping on the way to the gym – kill two birds with one stone.",
      examplePt: "Vou às compras a caminho do ginásio – matar dois coelhos de uma cajadada.",
    },
    {
      expression: "Cost an arm and a leg",
      meaning: "Ser muito caro",
      example: "The repairs cost an arm and a leg.",
      examplePt: "As reparações custaram uma fortuna.",
    },
    {
      expression: "Once in a blue moon",
      meaning: "Muito raramente / de vez em quando",
      example: "He only visits us once in a blue moon.",
      examplePt: "Ele só nos visita muito raramente.",
    },
    {
      expression: "Spill the beans",
      meaning: "Revelar um segredo / contar tudo",
      example: "Come on, spill the beans! What did he say?",
      examplePt: "Vá lá, conta tudo! O que é que ele disse?",
    },
    {
      expression: "Barking up the wrong tree",
      meaning: "Estar enganado / no caminho errado",
      example: "If you think I took the money, you're barking up the wrong tree.",
      examplePt: "Se achas que fui eu a pegar no dinheiro, estás enganado.",
    },
    {
      expression: "A blessing in disguise",
      meaning: "Uma boa coisa que parecia má a princípio",
      example: "Losing that job was a blessing in disguise – I found a much better one.",
      examplePt: "Perder aquele emprego foi uma bênção disfarçada – encontrei um muito melhor.",
    },
    {
      expression: "Under the weather",
      meaning: "Sentir-se mal / indisposto",
      example: "I'm feeling a bit under the weather today.",
      examplePt: "Estou a sentir-me um pouco indisposto hoje.",
    },
    {
      expression: "Let the cat out of the bag",
      meaning: "Revelar um segredo acidentalmente",
      example: "She let the cat out of the bag about the surprise party.",
      examplePt: "Ela revelou acidentalmente a festa surpresa.",
    },
    {
      expression: "Hit the sack",
      meaning: "Ir dormir",
      example: "I'm exhausted. I'm going to hit the sack.",
      examplePt: "Estou exausto. Vou dormir.",
    },
    {
      expression: "On the same page",
      meaning: "Estar de acordo / ter o mesmo entendimento",
      example: "Let's make sure we're all on the same page before the meeting.",
      examplePt: "Vamos certificar-nos de que estamos todos de acordo antes da reunião.",
    },
    {
      expression: "Get out of hand",
      meaning: "Sair do controlo",
      example: "The situation is getting out of hand.",
      examplePt: "A situação está a sair do controlo.",
    },
    {
      expression: "Pull someone's leg",
      meaning: "Estar a gozar / a brincar com alguém",
      example: "You got promoted? Are you pulling my leg?",
      examplePt: "Foste promovido? Estás a gozar comigo?",
    },
    {
      expression: "Add fuel to the fire",
      meaning: "Piorar uma situação já má",
      example: "His comment just added fuel to the fire.",
      examplePt: "O comentário dele só veio piorar as coisas.",
    },
    {
      expression: "Burn bridges",
      meaning: "Destruir relações / cortar ligações de forma irreversível",
      example: "Be careful what you say – you don't want to burn bridges.",
      examplePt: "Tem cuidado com o que dizes – não queres cortar relações.",
    },
    {
      expression: "Miss the boat",
      meaning: "Perder uma oportunidade",
      example: "You should have applied earlier – you missed the boat.",
      examplePt: "Devias ter-te candidatado mais cedo – perdeste a oportunidade.",
    },
    {
      expression: "Think outside the box",
      meaning: "Pensar de forma criativa / fora do convencional",
      example: "We need to think outside the box to solve this problem.",
      examplePt: "Precisamos de pensar de forma criativa para resolver este problema.",
    },
    {
      expression: "The last straw",
      meaning: "O último limite / a gota que faz transbordar o copo",
      example: "That was the last straw. I'm leaving.",
      examplePt: "Esta foi a gota que fez transbordar o copo. Vou-me embora.",
    },
    {
      expression: "Wrap your head around something",
      meaning: "Conseguir perceber / compreender algo difícil",
      example: "I can't wrap my head around this problem.",
      examplePt: "Não consigo perceber este problema.",
    },
    {
      expression: "Cut corners",
      meaning: "Fazer algo de forma rápida e descuidada para poupar tempo/dinheiro",
      example: "Don't cut corners on safety – it's too important.",
      examplePt: "Não sacrifiques a segurança por atalhos – é demasiado importante.",
    },
  ],
};
