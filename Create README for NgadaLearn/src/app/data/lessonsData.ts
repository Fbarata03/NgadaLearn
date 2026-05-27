/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Dados de todas as aulas
   Assimil (146 lições) · Pimsleur (30 lições) · Leituras (18 lições)
   ════════════════════════════════════════════════════════════════════ */

export type LessonCategory = "assimil" | "pimsleur" | "leituras";
export type LessonLevel    = "Iniciante" | "Intermediário" | "Avançado";

export interface MCExercise {
  type: "mc";
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface ListenExercise {
  type: "listen";
  english: string;
  portuguese: string;
  tip?: string;
}

export interface FillExercise {
  type: "fill";
  before: string;
  after: string;
  options: string[];
  correct: number;
  portuguese: string;
}

export type Exercise = MCExercise | ListenExercise | FillExercise;

export interface Lesson {
  id: string;
  category: LessonCategory;
  number: number;
  unit: number;
  title: string;
  subtitle: string;
  description: string;
  audioSrc: string;
  level: LessonLevel;
  durationMin: number;
  exercises: Exercise[];
  vocab: { en: string; pt: string }[];
}

/* ─────────────────────────────────────────────────────
   ASSIMIL — 21 unidades (lições 1-146)
   ───────────────────────────────────────────────────── */

interface AssimilUnit {
  title: string;
  description: string;
  from: number;
  to: number;
  vocab: { en: string; pt: string }[];
  exercises: Exercise[];
}

const ASSIMIL_UNITS: AssimilUnit[] = [
  /* ── Unidade 1 ── */
  {
    from: 1, to: 7,
    title: "Primeiros Contatos",
    description: "Primeiros passos no inglês: pronúncia, cumprimentos e apresentações.",
    vocab: [
      { en: "Hello / Hi", pt: "Olá / Oi" },
      { en: "Good morning", pt: "Bom dia" },
      { en: "Good afternoon", pt: "Boa tarde" },
      { en: "My name is...", pt: "Meu nome é..." },
      { en: "Nice to meet you", pt: "Prazer em conhecê-lo" },
    ],
    exercises: [
      { type: "mc", question: "Como se diz 'Prazer em conhecê-lo' em inglês?", options: ["Good morning!", "Nice to meet you!", "See you later!", "How are you?"], correct: 1, explanation: "'Nice to meet you' é a expressão padrão ao ser apresentado a alguém." },
      { type: "listen", english: "Hello! My name is John. Nice to meet you.", portuguese: "Olá! Meu nome é John. Prazer em conhecê-lo.", tip: "Repita em voz alta prestando atenção na entoação." },
      { type: "fill", before: "Good", after: ", nice to meet you!", options: ["morning", "night", "bye", "later"], correct: 0, portuguese: "Bom dia, prazer em conhecê-lo!" },
      { type: "mc", question: "O que significa 'How are you?'", options: ["Onde está você?", "Como você está?", "O que você faz?", "Quando você vai?"], correct: 1, explanation: "'How are you?' é a forma mais comum de perguntar 'Como vai?' em inglês." },
    ],
  },

  /* ── Unidade 2 ── */
  {
    from: 8, to: 14,
    title: "Identidade e Origens",
    description: "Apresente-se, fale sobre sua nacionalidade e aprenda a perguntar de onde as pessoas são.",
    vocab: [
      { en: "I'm from...", pt: "Sou de..." },
      { en: "Where are you from?", pt: "De onde você é?" },
      { en: "American / Brazilian", pt: "Americano / Brasileiro" },
      { en: "What do you do?", pt: "O que você faz?" },
      { en: "I'm a student", pt: "Sou estudante" },
    ],
    exercises: [
      { type: "mc", question: "Como se pergunta 'De onde você é?' em inglês?", options: ["Who are you?", "Where are you from?", "How old are you?", "What is your job?"], correct: 1, explanation: "'Where are you from?' é a forma correta de perguntar a origem de alguém." },
      { type: "listen", english: "I'm Brazilian. I'm from São Paulo. And you, where are you from?", portuguese: "Sou brasileiro. Sou de São Paulo. E você, de onde é?", tip: "Note como 'and you?' pede reciprocidade na conversa." },
      { type: "fill", before: "I'm", after: "Brazil.", options: ["from", "at", "in", "of"], correct: 0, portuguese: "Sou do Brasil." },
      { type: "mc", question: "O que responder a 'What do you do?'", options: ["I do fine, thanks.", "I'm an engineer.", "I do it tomorrow.", "What do you mean?"], correct: 1, explanation: "'What do you do?' pergunta sua profissão. Responda com 'I'm a + profissão'." },
    ],
  },

  /* ── Unidade 3 ── */
  {
    from: 15, to: 21,
    title: "Números e Cotidiano",
    description: "Números, horas, dias da semana e frases do dia a dia.",
    vocab: [
      { en: "One, two, three...", pt: "Um, dois, três..." },
      { en: "What time is it?", pt: "Que horas são?" },
      { en: "It's two o'clock", pt: "São duas horas" },
      { en: "Today / Tomorrow", pt: "Hoje / Amanhã" },
      { en: "Please / Thank you", pt: "Por favor / Obrigado" },
    ],
    exercises: [
      { type: "mc", question: "Como se diz 'São três horas' em inglês?", options: ["It's three o'clock.", "Three hours it is.", "The clock is three.", "Time is three."], correct: 0, explanation: "'It's [número] o'clock' é a forma padrão de dizer as horas exatas." },
      { type: "listen", english: "Excuse me, what time is it? It's half past two.", portuguese: "Com licença, que horas são? São duas e meia.", tip: "'Half past' significa 'e meia'. 'Quarter past' é 'e quinze'." },
      { type: "fill", before: "Thank", after: "very much!", options: ["you", "me", "us", "him"], correct: 0, portuguese: "Muito obrigado!" },
      { type: "mc", question: "Como se diz 'Amanhã' em inglês?", options: ["Yesterday", "Today", "Tomorrow", "Later"], correct: 2, explanation: "'Tomorrow' = amanhã. 'Yesterday' = ontem. 'Today' = hoje." },
    ],
  },

  /* ── Unidade 4 ── */
  {
    from: 22, to: 28,
    title: "Família e Casa",
    description: "Fale sobre sua família, descreva sua casa e aprenda o vocabulário doméstico.",
    vocab: [
      { en: "My family", pt: "Minha família" },
      { en: "Wife / Husband", pt: "Esposa / Marido" },
      { en: "Children / Kids", pt: "Filhos / Crianças" },
      { en: "I live in a house", pt: "Moro numa casa" },
      { en: "Room / Bedroom", pt: "Quarto / Dormitório" },
    ],
    exercises: [
      { type: "mc", question: "Como se diz 'Tenho dois filhos' em inglês?", options: ["I have two children.", "I own two kids.", "Two children I have.", "My two sons."], correct: 0, explanation: "'I have two children' usa o verbo 'have' para expressar posse." },
      { type: "listen", english: "This is my wife, Sarah. We have three kids. We live in a house downtown.", portuguese: "Esta é minha esposa, Sarah. Temos três filhos. Moramos numa casa no centro.", tip: "'Downtown' significa 'no centro da cidade'." },
      { type: "fill", before: "We", after: "in New York.", options: ["live", "lives", "lived", "living"], correct: 0, portuguese: "Moramos em Nova Iorque." },
      { type: "mc", question: "O que significa 'bedroom'?", options: ["Sala de estar", "Cozinha", "Quarto", "Banheiro"], correct: 2, explanation: "'Bedroom' = quarto. 'Living room' = sala. 'Kitchen' = cozinha. 'Bathroom' = banheiro." },
    ],
  },

  /* ── Unidade 5 ── */
  {
    from: 29, to: 35,
    title: "Compras e Preços",
    description: "Vocabulário para fazer compras, perguntar preços e negociar.",
    vocab: [
      { en: "How much is this?", pt: "Quanto custa isso?" },
      { en: "It's too expensive", pt: "Está muito caro" },
      { en: "I'd like to buy...", pt: "Gostaria de comprar..." },
      { en: "Do you have...?", pt: "Tem...?" },
      { en: "Can I pay by card?", pt: "Posso pagar com cartão?" },
    ],
    exercises: [
      { type: "mc", question: "Como se pergunta o preço de algo?", options: ["How old is this?", "How much is this?", "How many is this?", "How long is this?"], correct: 1, explanation: "'How much is this/that?' é a forma padrão de perguntar o preço." },
      { type: "listen", english: "Excuse me, how much is this jacket? It's forty-five dollars. Do you accept credit cards?", portuguese: "Com licença, quanto custa esta jaqueta? São quarenta e cinco dólares. Aceitam cartão de crédito?", tip: "Note 'Do you accept...?' = Vocês aceitam...?" },
      { type: "fill", before: "I'd like to", after: "this, please.", options: ["buy", "buying", "bought", "buys"], correct: 0, portuguese: "Gostaria de comprar isto, por favor." },
      { type: "mc", question: "O que significa 'It's on sale'?", options: ["Está vendido", "Está em promoção", "Está à venda", "Custou caro"], correct: 1, explanation: "'On sale' significa em promoção/desconto. 'For sale' = à venda (sem necessariamente desconto)." },
    ],
  },

  /* ── Unidade 6 ── */
  {
    from: 36, to: 42,
    title: "No Restaurante",
    description: "Peça comida e bebida, entenda o cardápio e interaja com o garçom em inglês.",
    vocab: [
      { en: "I'd like to order", pt: "Gostaria de pedir" },
      { en: "The menu, please", pt: "O cardápio, por favor" },
      { en: "What do you recommend?", pt: "O que você recomenda?" },
      { en: "The bill, please", pt: "A conta, por favor" },
      { en: "It's delicious!", pt: "Está delicioso!" },
    ],
    exercises: [
      { type: "mc", question: "Como se pede a conta no restaurante?", options: ["Give me the money!", "The bill, please.", "I want to pay!", "Check, waiter!"], correct: 1, explanation: "'The bill, please' é a forma educada de pedir a conta em inglês britânico. 'Check, please' é mais americano." },
      { type: "listen", english: "Good evening! Table for two? Here's the menu. What would you like to order?", portuguese: "Boa noite! Mesa para dois? Aqui está o cardápio. O que gostariam de pedir?", tip: "'Table for two' = mesa para dois. Aprenda a dizer o número de pessoas." },
      { type: "fill", before: "I'd like the", after: ", please.", options: ["steak", "steaks", "a steak", "some steaks"], correct: 0, portuguese: "Gostaria do bife, por favor." },
      { type: "mc", question: "O que significa 'medium rare'?", options: ["Bem passado", "Mal passado", "Ao ponto para mal passado", "Cru"], correct: 2, explanation: "Ponto do bife: 'rare' = mal passado, 'medium rare' = ao ponto pra mal passado, 'medium' = ao ponto, 'well done' = bem passado." },
    ],
  },

  /* ── Unidade 7 ── */
  {
    from: 43, to: 49,
    title: "Transporte e Viagens",
    description: "Como usar transporte público, pedir táxi, e frases essenciais para viagens.",
    vocab: [
      { en: "Where is the bus stop?", pt: "Onde é o ponto de ônibus?" },
      { en: "How do I get to...?", pt: "Como chego a...?" },
      { en: "Take the subway", pt: "Pegue o metrô" },
      { en: "One-way / Round trip", pt: "Só ida / Ida e volta" },
      { en: "Departure / Arrival", pt: "Partida / Chegada" },
    ],
    exercises: [
      { type: "mc", question: "Como se pergunta 'Como chego ao aeroporto?'", options: ["How I get to airport?", "How do I get to the airport?", "Where is airport?", "Airport is where?"], correct: 1, explanation: "'How do I get to...?' é a forma correta de pedir direções." },
      { type: "listen", english: "Excuse me, is there a subway station nearby? Yes, turn left and walk two blocks.", portuguese: "Com licença, há uma estação de metrô por perto? Sim, vire à esquerda e ande dois quarteirões.", tip: "'Nearby' = por perto. 'Block' = quarteirão." },
      { type: "fill", before: "I'd like a", after: "ticket to London, please.", options: ["round trip", "turn trip", "round travel", "full trip"], correct: 0, portuguese: "Gostaria de uma passagem de ida e volta para Londres, por favor." },
      { type: "mc", question: "O que significa 'The flight is delayed'?", options: ["O voo foi cancelado", "O voo está atrasado", "O voo partiu", "O voo chegou"], correct: 1, explanation: "'Delayed' = atrasado. 'Cancelled' = cancelado. 'On time' = no horário." },
    ],
  },

  /* ── Unidade 8 ── */
  {
    from: 50, to: 56,
    title: "Saúde e Corpo",
    description: "Vocabulário médico essencial, sintomas, e como comunicar problemas de saúde.",
    vocab: [
      { en: "I don't feel well", pt: "Não me sinto bem" },
      { en: "I have a headache", pt: "Tenho dor de cabeça" },
      { en: "Call a doctor", pt: "Chame um médico" },
      { en: "Take this medicine", pt: "Tome este remédio" },
      { en: "I'm allergic to...", pt: "Sou alérgico a..." },
    ],
    exercises: [
      { type: "mc", question: "Como se diz 'Estou com febre' em inglês?", options: ["I have a fever.", "I feel cold.", "My head hurts.", "I am sick of it."], correct: 0, explanation: "'I have a fever' = estou com febre. 'Fever' não é só calor — é temperatura elevada." },
      { type: "listen", english: "Doctor, I have a sore throat and I've had a fever since yesterday. I'm also very tired.", portuguese: "Médico, estou com dor de garganta e febre desde ontem. Também estou muito cansado.", tip: "'Sore throat' = dor de garganta. 'Since yesterday' = desde ontem." },
      { type: "fill", before: "I'm", after: "to penicillin.", options: ["allergic", "alergy", "allergyed", "allergen"], correct: 0, portuguese: "Sou alérgico à penicilina." },
      { type: "mc", question: "O que significa 'Take two pills twice a day'?", options: ["Tome 2 comprimidos uma vez ao dia", "Tome 2 comprimidos duas vezes ao dia", "Tome 4 comprimidos por dia", "Tome um comprimido às 2h"], correct: 1, explanation: "'Twice a day' = duas vezes por dia. 'Once' = uma vez, 'twice' = duas vezes, 'three times' = três vezes." },
    ],
  },

  /* ── Unidade 9 ── */
  {
    from: 57, to: 63,
    title: "Trabalho e Escritório",
    description: "Inglês profissional: reuniões, e-mails, apresentações e vocabulário corporativo.",
    vocab: [
      { en: "I have a meeting", pt: "Tenho uma reunião" },
      { en: "Could you send me...?", pt: "Poderia me enviar...?" },
      { en: "I'm in charge of...", pt: "Sou responsável por..." },
      { en: "Deadline", pt: "Prazo de entrega" },
      { en: "Let's schedule a call", pt: "Vamos agendar uma ligação" },
    ],
    exercises: [
      { type: "mc", question: "Como se diz educadamente 'Poderia você me enviar o relatório?'", options: ["Send me the report!", "Could you please send me the report?", "I want the report.", "Report, now please."], correct: 1, explanation: "'Could you please + verbo' é a forma mais educada de fazer pedidos formais no trabalho." },
      { type: "listen", english: "Good morning everyone. Let's get started. Today's agenda has three items: the quarterly report, budget updates, and next steps.", portuguese: "Bom dia a todos. Vamos começar. A agenda de hoje tem três itens: o relatório trimestral, atualizações de orçamento e próximos passos.", tip: "'Let's get started' = vamos começar. 'Agenda' = pauta da reunião." },
      { type: "fill", before: "The project", after: "is next Friday.", options: ["deadline", "deadline's", "deadlines", "deadline at"], correct: 0, portuguese: "O prazo do projeto é sexta-feira que vem." },
      { type: "mc", question: "O que significa 'I'll follow up on that'?", options: ["Vou desistir disso", "Vou acompanhar / dar seguimento a isso", "Vou fazer agora", "Não entendi"], correct: 1, explanation: "'Follow up' = dar seguimento, acompanhar. É muito usado em e-mails e reuniões corporativas." },
    ],
  },

  /* ── Unidade 10 ── */
  {
    from: 64, to: 70,
    title: "Lazer e Entretenimento",
    description: "Atividades de fim de semana, cinema, esportes e vida social.",
    vocab: [
      { en: "What do you like to do?", pt: "O que você gosta de fazer?" },
      { en: "I enjoy watching movies", pt: "Gosto de assistir filmes" },
      { en: "Let's go out tonight", pt: "Vamos sair hoje à noite" },
      { en: "What's on TV?", pt: "O que está passando na TV?" },
      { en: "My hobby is...", pt: "Meu hobby é..." },
    ],
    exercises: [
      { type: "mc", question: "Como se convida alguém para sair?", options: ["You must come with me!", "Would you like to go out tonight?", "Go out now!", "I'm going out."], correct: 1, explanation: "'Would you like to...?' é a forma mais educada de fazer convites." },
      { type: "listen", english: "What do you usually do on weekends? I like playing tennis and reading. Sometimes I go to the movies.", portuguese: "O que você geralmente faz nos fins de semana? Gosto de jogar tênis e ler. Às vezes vou ao cinema.", tip: "'Usually' = geralmente. 'Sometimes' = às vezes. 'Often' = frequentemente." },
      { type: "fill", before: "I'm really into", after: "music.", options: ["jazz", "jazzy", "the jazz", "a jazz"], correct: 0, portuguese: "Gosto muito de música jazz." },
      { type: "mc", question: "O que significa 'It's a blockbuster'?", options: ["É um fracasso de bilheteria", "É um grande sucesso de bilheteria", "É um filme de ação", "É um filme antigo"], correct: 1, explanation: "'Blockbuster' é um grande sucesso de bilheteria. Originou-se com filmes que faziam filas enormes nos cinemas." },
    ],
  },

  /* ── Unidade 11 ── */
  {
    from: 71, to: 77,
    title: "Telefone e Comunicação",
    description: "Conversas ao telefone, deixar recados e comunicação à distância.",
    vocab: [
      { en: "May I speak to...?", pt: "Posso falar com...?" },
      { en: "Hold on, please", pt: "Aguarde, por favor" },
      { en: "Can I take a message?", pt: "Posso anotar um recado?" },
      { en: "I'll call you back", pt: "Vou te ligar de volta" },
      { en: "The line is busy", pt: "A linha está ocupada" },
    ],
    exercises: [
      { type: "mc", question: "Como se pede para falar com alguém ao telefone?", options: ["I want to talk to John!", "May I speak to John, please?", "Is John there?", "Call John for me."], correct: 1, explanation: "'May I speak to...?' é a forma mais educada de se dirigir ao atendente por telefone." },
      { type: "listen", english: "Hello, this is Sarah calling from XYZ Company. May I speak to Mr. Johnson? He's not available. May I take a message?", portuguese: "Olá, aqui é Sarah ligando da Empresa XYZ. Posso falar com o Sr. Johnson? Ele não está disponível. Posso anotar um recado?", tip: "'This is [nome] calling' = aqui é [nome] ligando. Sempre se identifique ao ligar." },
      { type: "fill", before: "I'll", after: "you back in five minutes.", options: ["call", "calls", "calling", "called"], correct: 0, portuguese: "Vou te ligar de volta em cinco minutos." },
      { type: "mc", question: "O que significa 'Leave a voicemail'?", options: ["Ligar de volta", "Desligar o telefone", "Deixar uma mensagem de voz", "Mudar o número"], correct: 2, explanation: "'Voicemail' = correio de voz. 'Leave a voicemail' = deixar uma mensagem de voz." },
    ],
  },

  /* ── Unidade 12 ── */
  {
    from: 78, to: 84,
    title: "Hotel e Hospedagem",
    description: "Check-in, check-out, quarto, serviços do hotel e reclamações.",
    vocab: [
      { en: "I have a reservation", pt: "Tenho uma reserva" },
      { en: "A room for two nights", pt: "Um quarto para duas noites" },
      { en: "Is breakfast included?", pt: "O café da manhã está incluído?" },
      { en: "Wake-up call", pt: "Chamada para acordar" },
      { en: "Room service", pt: "Serviço de quarto" },
    ],
    exercises: [
      { type: "mc", question: "Como se faz check-in num hotel?", options: ["Hi, I want a bed!", "Hi, I have a reservation under [nome].", "Give me my key!", "Room, please."], correct: 1, explanation: "'I have a reservation under [name]' = tenho uma reserva no nome de [nome]. É sempre assim que se faz check-in." },
      { type: "listen", english: "Welcome to Grand Hotel. Do you have a reservation? Yes, under Smith. Here's your key card. Check-out is at noon.", portuguese: "Bem-vindo ao Grand Hotel. Tem reserva? Sim, em nome de Smith. Aqui está seu cartão-chave. O check-out é ao meio-dia.", tip: "'Key card' = cartão magnético de abertura. 'Noon' = meio-dia." },
      { type: "fill", before: "Could you please give me a", after: "call at 7 AM?", options: ["wake-up", "morning", "alarm", "phone"], correct: 0, portuguese: "Poderia me dar uma chamada para acordar às 7h?" },
      { type: "mc", question: "O que é 'continental breakfast'?", options: ["Café da manhã completo com ovos e bacon", "Café da manhã simples com pão, frutas e café/suco", "Almoço servido de manhã", "Café da manhã brasileiro"], correct: 1, explanation: "'Continental breakfast' é um café da manhã simples (europeu): pães, croissants, frutas, café. O 'full English breakfast' é o completo com ovos, bacon etc." },
    ],
  },

  /* ── Unidade 13 ── */
  {
    from: 85, to: 91,
    title: "Banco e Serviços",
    description: "Vocabulário bancário, câmbio, correios e serviços essenciais.",
    vocab: [
      { en: "I'd like to exchange money", pt: "Gostaria de trocar dinheiro" },
      { en: "What's the exchange rate?", pt: "Qual é a taxa de câmbio?" },
      { en: "ATM / Cash machine", pt: "Caixa eletrônico" },
      { en: "Can I open an account?", pt: "Posso abrir uma conta?" },
      { en: "Wire transfer", pt: "Transferência bancária" },
    ],
    exercises: [
      { type: "mc", question: "Como se pergunta a taxa de câmbio?", options: ["How much is the dollar?", "What's the exchange rate for the dollar?", "Is dollar expensive?", "Dollar now how much?"], correct: 1, explanation: "'What's the exchange rate?' é a forma profissional de perguntar a taxa de câmbio." },
      { type: "listen", english: "Good afternoon. I'd like to exchange 500 dollars into euros, please. The rate today is 1.08. Would you like to proceed?", portuguese: "Boa tarde. Gostaria de trocar 500 dólares em euros, por favor. A taxa hoje é 1,08. Deseja prosseguir?", tip: "'Would you like to proceed?' = deseja prosseguir? Uma pergunta formal de confirmação." },
      { type: "fill", before: "I'd like to", after: "my account balance, please.", options: ["check", "see", "look", "verify"], correct: 0, portuguese: "Gostaria de verificar o saldo da minha conta, por favor." },
      { type: "mc", question: "O que significa 'overdraft'?", options: ["Saldo positivo alto", "Saldo negativo / cheque especial", "Juros altos", "Tarifa bancária"], correct: 1, explanation: "'Overdraft' = quando o saldo da conta fica negativo (cheque especial). 'Interest' = juros. 'Fee' = tarifa." },
    ],
  },

  /* ── Unidade 14 ── */
  {
    from: 92, to: 98,
    title: "Cultura e Entretenimento",
    description: "Arte, museus, teatro, música e conversas sobre preferências culturais.",
    vocab: [
      { en: "I love art / music", pt: "Adoro arte / música" },
      { en: "Have you ever been to...?", pt: "Você já foi a...?" },
      { en: "It's worth seeing", pt: "Vale a pena ver" },
      { en: "I'd rather...", pt: "Prefiro..." },
      { en: "What a performance!", pt: "Que apresentação!" },
    ],
    exercises: [
      { type: "mc", question: "Como se recomenda algo cultural a alguém?", options: ["You must go there!", "It's worth visiting — you'll love it.", "Just go already.", "Don't miss it or else."], correct: 1, explanation: "'It's worth + gerúndio' = vale a pena + infinitivo. É uma forma natural de recomendar algo." },
      { type: "listen", english: "Have you ever visited the Metropolitan Museum? No, not yet. It's worth seeing — the impressionist collection is breathtaking.", portuguese: "Você já visitou o Metropolitan Museum? Não, ainda não. Vale a pena — a coleção impressionista é de tirar o fôlego.", tip: "'Breathtaking' = de tirar o fôlego (impressionante). 'Not yet' = ainda não." },
      { type: "fill", before: "I'd", after: "go to the theater than watch TV.", options: ["rather", "better", "prefer", "more"], correct: 0, portuguese: "Prefiro ir ao teatro do que assistir TV." },
      { type: "mc", question: "O que significa 'The show must go on'?", options: ["O show deve começar", "O show continua aconteça o que acontecer", "O show foi cancelado", "O show foi ao ar"], correct: 1, explanation: "Expressão famosa que significa que, independente dos problemas, o espetáculo deve continuar. Muito usado em contextos artísticos e de negócios." },
    ],
  },

  /* ── Unidade 15 ── */
  {
    from: 99, to: 105,
    title: "Natureza e Meio Ambiente",
    description: "Vocabulário sobre natureza, clima, meio ambiente e viagens ao ar livre.",
    vocab: [
      { en: "What's the weather like?", pt: "Como está o tempo?" },
      { en: "It's raining / snowing", pt: "Está chovendo / nevando" },
      { en: "Climate change", pt: "Mudança climática" },
      { en: "Renewable energy", pt: "Energia renovável" },
      { en: "Endangered species", pt: "Espécies em extinção" },
    ],
    exercises: [
      { type: "mc", question: "Como se pergunta sobre o tempo?", options: ["How is the climate?", "What's the weather like?", "Is it good weather?", "Weather today?"], correct: 1, explanation: "'What's the weather like?' é a forma correta de perguntar sobre o clima do dia. 'Climate' refere-se ao clima de uma região em geral." },
      { type: "listen", english: "The forecast says it'll rain tomorrow, so bring an umbrella. Last week we had record high temperatures because of climate change.", portuguese: "A previsão diz que vai chover amanhã, então traga um guarda-chuva. Na semana passada tivemos temperaturas recordes por causa das mudanças climáticas.", tip: "'Forecast' = previsão do tempo. 'Record high' = recorde histórico de temperatura." },
      { type: "fill", before: "We need to protect", after: "species from extinction.", options: ["endangered", "endanger", "endangering", "in danger"], correct: 0, portuguese: "Precisamos proteger espécies em extinção." },
      { type: "mc", question: "O que significa 'carbon footprint'?", options: ["Pegada de carbono / impacto ambiental individual", "Tipo de combustível", "Floresta de carbono", "Taxa ambiental"], correct: 0, explanation: "'Carbon footprint' = pegada de carbono, ou seja, a quantidade de CO₂ que cada pessoa/empresa emite." },
    ],
  },

  /* ── Unidade 16 ── */
  {
    from: 106, to: 112,
    title: "Conversas Avançadas",
    description: "Expressões idiomáticas, phrasal verbs e conversas em ritmo natural.",
    vocab: [
      { en: "I'm up to date on...", pt: "Estou atualizado sobre..." },
      { en: "To be on the same page", pt: "Estar alinhado / de acordo" },
      { en: "To look forward to", pt: "Estar animado para / ansiar por" },
      { en: "To bring up a topic", pt: "Levantar um assunto" },
      { en: "At any rate", pt: "De qualquer forma / De todo modo" },
    ],
    exercises: [
      { type: "mc", question: "O que significa 'We're on the same page'?", options: ["Estamos no mesmo livro", "Estamos lendo juntos", "Estamos alinhados / de acordo", "Estamos na mesma reunião"], correct: 2, explanation: "'On the same page' é um idiom que significa estar de acordo, ter o mesmo entendimento sobre algo." },
      { type: "listen", english: "I'm looking forward to the presentation. Let's make sure we're on the same page about the key points before we begin.", portuguese: "Estou animado para a apresentação. Vamos garantir que estamos alinhados sobre os pontos principais antes de começar.", tip: "'Looking forward to' = antecipar com prazer. Note que é seguido de substantivo ou gerúndio, não de infinitivo." },
      { type: "fill", before: "I'm really looking", after: "to meeting you in person.", options: ["forward", "ahead", "up", "into"], correct: 0, portuguese: "Estou muito animado para te conhecer pessoalmente." },
      { type: "mc", question: "O que significa 'to bring something up'?", options: ["Subir algo", "Levantar um assunto / mencionar algo", "Vomitar", "Aumentar o volume"], correct: 1, explanation: "'To bring up' = levantar um assunto, mencionar. 'He brought up an interesting point' = ele levantou um ponto interessante." },
    ],
  },

  /* ── Unidade 17 ── */
  {
    from: 113, to: 119,
    title: "Negócios e Negociações",
    description: "Inglês de negócios: negociações, contratos, apresentações e networking.",
    vocab: [
      { en: "Let's cut to the chase", pt: "Vamos direto ao ponto" },
      { en: "We have a deal", pt: "Temos um acordo" },
      { en: "Market share", pt: "Participação de mercado" },
      { en: "Bottom line", pt: "Resultado final / lucro líquido" },
      { en: "Win-win situation", pt: "Situação vantajosa para ambos" },
    ],
    exercises: [
      { type: "mc", question: "Como se propõe um acordo numa negociação?", options: ["Accept this or nothing!", "What if we tried a win-win approach?", "I want more money.", "Deal now!"], correct: 1, explanation: "'Win-win' é muito valorizado em negociações em inglês — propor benefício para ambos lados é profissional." },
      { type: "listen", english: "Let's cut to the chase. Our proposal offers you a 15% discount in exchange for a two-year contract. What do you think?", portuguese: "Vamos direto ao ponto. Nossa proposta oferece um desconto de 15% em troca de um contrato de dois anos. O que acha?", tip: "'Cut to the chase' = ir direto ao ponto (sem rodeios). Muito usado em negociações." },
      { type: "fill", before: "The bottom", after: "is we need to increase revenue by 20%.", options: ["line", "line's", "lines", "lined"], correct: 0, portuguese: "O resultado final é que precisamos aumentar a receita em 20%." },
      { type: "mc", question: "O que significa 'We need to table this discussion'?", options: ["Precisamos sentar à mesa", "Precisamos adiar esta discussão (AmEng)", "Precisamos discutir agora (BrEng)", "Ambos estão corretos dependendo do contexto"], correct: 3, explanation: "Atenção! 'Table a discussion' tem significados OPOSTOS: em inglês americano = adiar; em inglês britânico = colocar em pauta para discussão." },
    ],
  },

  /* ── Unidade 18 ── */
  {
    from: 120, to: 126,
    title: "Notícias e Atualidades",
    description: "Discuta notícias, eventos atuais e expresse opiniões em inglês.",
    vocab: [
      { en: "In my opinion...", pt: "Na minha opinião..." },
      { en: "According to the news", pt: "De acordo com as notícias" },
      { en: "It's controversial", pt: "É controverso" },
      { en: "On the other hand", pt: "Por outro lado" },
      { en: "To be fair...", pt: "Para ser justo..." },
    ],
    exercises: [
      { type: "mc", question: "Como se expressa uma opinião educadamente?", options: ["I think that, obviously...", "In my opinion, it seems that...", "Everyone knows that...", "Clearly you're wrong about..."], correct: 1, explanation: "'In my opinion' / 'I think' / 'I believe' são formas respeitosas de expressar opinião sem impor o ponto de vista." },
      { type: "listen", english: "In my opinion, the new policy is controversial. On one hand, it could reduce costs. On the other hand, it might hurt employees.", portuguese: "Na minha opinião, a nova política é controversa. Por um lado, pode reduzir custos. Por outro lado, pode prejudicar os funcionários.", tip: "'On one hand... on the other hand' = por um lado... por outro lado. Essencial para argumentação equilibrada." },
      { type: "fill", before: "According to recent", after: ", unemployment has decreased.", options: ["reports", "report", "reporting", "reporter"], correct: 0, portuguese: "De acordo com relatórios recentes, o desemprego diminuiu." },
      { type: "mc", question: "O que significa 'to play devil's advocate'?", options: ["Defender o diabo", "Argumentar contra para explorar todos os lados", "Ser advogado em tribunal", "Fazer papel de vilão"], correct: 1, explanation: "'Play devil's advocate' = levantar argumentos contrários propositalmente para analisar todos os ângulos de uma questão." },
    ],
  },

  /* ── Unidade 19 ── */
  {
    from: 127, to: 133,
    title: "Literatura e Artes",
    description: "Discuta livros, filmes, arte e expresse preferências culturais com fluência.",
    vocab: [
      { en: "I highly recommend...", pt: "Recomendo muito..." },
      { en: "It's a masterpiece", pt: "É uma obra-prima" },
      { en: "The plot is...", pt: "O enredo é..." },
      { en: "The main character", pt: "O personagem principal" },
      { en: "It left me speechless", pt: "Me deixou sem palavras" },
    ],
    exercises: [
      { type: "mc", question: "Como se resume o enredo de um livro?", options: ["The book is very big.", "The plot follows a young woman who discovers...", "I liked the book a lot.", "It's a good story."], correct: 1, explanation: "'The plot follows/revolves around...' é a forma padrão de resumir o enredo de um livro ou filme." },
      { type: "listen", english: "I just finished reading 'One Hundred Years of Solitude'. It's a masterpiece. The plot spans multiple generations and the main character is unforgettable.", portuguese: "Acabei de ler 'Cem Anos de Solidão'. É uma obra-prima. O enredo abrange várias gerações e o personagem principal é inesquecível.", tip: "'Span' = abranger. 'Multiple generations' = várias gerações." },
      { type: "fill", before: "The ending", after: "me speechless — I didn't see it coming.", options: ["left", "leave", "leaving", "left me"], correct: 0, portuguese: "O final me deixou sem palavras — não esperava por isso." },
      { type: "mc", question: "O que significa 'a page-turner'?", options: ["Um livro chato e difícil", "Um livro impossível de parar de ler", "Uma virada de página na história", "Um livro com muitas páginas"], correct: 1, explanation: "'Page-turner' = livro de tirar o fôlego, impossível de parar de ler. 'I couldn't put it down' = não conseguia largar o livro." },
    ],
  },

  /* ── Unidade 20 ── */
  {
    from: 134, to: 140,
    title: "Conversas Complexas",
    description: "Discussões filosóficas, argumentação elaborada e vocabulário sofisticado.",
    vocab: [
      { en: "To a certain extent", pt: "Até certo ponto" },
      { en: "It's a double-edged sword", pt: "É uma faca de dois gumes" },
      { en: "All things considered", pt: "Considerando tudo" },
      { en: "I stand by my position", pt: "Mantenho minha posição" },
      { en: "That's beside the point", pt: "Isso não vem ao caso" },
    ],
    exercises: [
      { type: "mc", question: "O que significa 'a double-edged sword'?", options: ["Uma espada com dois gumes", "Algo que tem tanto vantagens quanto desvantagens", "Um argumento muito forte", "Uma situação perigosa"], correct: 1, explanation: "'Double-edged sword' = algo que tem dois lados, vantagens e desvantagens ao mesmo tempo. Equivale ao português 'faca de dois gumes'." },
      { type: "listen", english: "To a certain extent, technology is a double-edged sword. All things considered, the benefits outweigh the risks, but we must be cautious.", portuguese: "Até certo ponto, a tecnologia é uma faca de dois gumes. Considerando tudo, os benefícios superam os riscos, mas devemos ser cautelosos.", tip: "'Outweigh' = superar em peso/importância. Muito usado em argumentação acadêmica." },
      { type: "fill", before: "That argument is", after: "the point — we need to focus on solutions.", options: ["beside", "next to", "away from", "beyond"], correct: 0, portuguese: "Esse argumento não vem ao caso — precisamos nos focar nas soluções." },
      { type: "mc", question: "O que significa 'I beg to differ'?", options: ["Peço para diferir", "Discordo respeitosamente", "Concordo plenamente", "Não entendi"], correct: 1, explanation: "'I beg to differ' é uma forma sofisticada e educada de discordar. Equivale a 'Permitam-me discordar' em português." },
    ],
  },

  /* ── Unidade 21 ── */
  {
    from: 141, to: 146,
    title: "Revisão Final e Fluência",
    description: "Revisão de todos os conteúdos, expressões avançadas e consolidação da fluência.",
    vocab: [
      { en: "Fluency / Fluent", pt: "Fluência / Fluente" },
      { en: "Native-like speaker", pt: "Falante com nível nativo" },
      { en: "To master a language", pt: "Dominar um idioma" },
      { en: "I'm proud of my progress", pt: "Estou orgulhoso do meu progresso" },
      { en: "Keep it up!", pt: "Continue assim!" },
    ],
    exercises: [
      { type: "mc", question: "O que é 'collocational knowledge' em inglês?", options: ["Saber gramática perfeita", "Saber quais palavras naturalmente se juntam", "Ter sotaque americano", "Conhecer muitas gírias"], correct: 1, explanation: "'Collocation' é o conhecimento de quais palavras naturalmente andam juntas em inglês, como 'make a decision' (não 'do a decision') ou 'heavy rain' (não 'strong rain')." },
      { type: "listen", english: "Congratulations on completing the Assimil course! You've worked hard and your dedication has paid off. Keep practicing and you'll achieve fluency.", portuguese: "Parabéns por completar o curso Assimil! Você trabalhou muito e sua dedicação valeu a pena. Continue praticando e alcançará a fluência.", tip: "Parabéns! Você chegou ao fim do curso Assimil. Agora pratique diariamente para manter e expandir o que aprendeu." },
      { type: "fill", before: "I'm proud of the", after: "I've made in English.", options: ["progress", "progresses", "progression", "progressive"], correct: 0, portuguese: "Estou orgulhoso do progresso que fiz em inglês." },
      { type: "mc", question: "Qual é a melhor forma de manter e aumentar seu nível de inglês?", options: ["Fazer apenas exercícios escritos", "Consumir conteúdo autêntico diariamente e praticar speaking", "Decorar listas de vocabulário", "Traduzir textos palavra por palavra"], correct: 1, explanation: "A melhor forma de manter e aumentar o nível é consumir conteúdo autêntico (filmes, séries, podcasts, livros) e praticar speaking regularmente." },
    ],
  },
];

/* ─────────────────────────────────────────────────────
   PIMSLEUR — 30 lições individuais
   ───────────────────────────────────────────────────── */

interface PimsleurLesson {
  number: number;
  title: string;
  description: string;
  keyPhrases: string[];
  exercises: Exercise[];
  vocab: { en: string; pt: string }[];
}

const PIMSLEUR_LESSONS: PimsleurLesson[] = [
  { number: 1, title: "Primeiras Palavras", description: "Com licença — você entende inglês? Um pouco. Eu sou americano(a).", keyPhrases: ["Excuse me", "Do you understand English?", "I understand a little", "I'm American"], exercises: [{ type: "mc", question: "Como se diz 'Com licença' em inglês?", options: ["Please", "Excuse me", "Sorry me", "Pardon please"], correct: 1, explanation: "'Excuse me' = com licença (para chamar atenção). 'Sorry' = desculpe (por erro cometido)." }, { type: "listen", english: "Excuse me, do you understand English? I understand a little.", portuguese: "Com licença, a senhora entende inglês? Eu entendo um pouco." }, { type: "fill", before: "I'm", after: ".", options: ["American", "from American", "in America", "at America"], correct: 0, portuguese: "Sou americano." }], vocab: [{ en: "Excuse me", pt: "Com licença" }, { en: "A little", pt: "Um pouco" }] },

  { number: 2, title: "Sou Americano?", description: "Identidade e origem — sou / não sou americano. Você é americano?", keyPhrases: ["Are you American?", "I'm not American", "I'm Brazilian", "Yes / No"], exercises: [{ type: "mc", question: "Como se nega ser de algum lugar?", options: ["I'm not American.", "I no American.", "Not I American.", "I don't American."], correct: 0, explanation: "Em inglês, a negação é: I'm not + adjetivo/nacionalidade. Não se usa 'don't' com o verbo to be." }, { type: "listen", english: "Are you American? No, I'm not American. I'm Brazilian.", portuguese: "Você é americano? Não, não sou americano. Sou brasileiro." }, { type: "fill", before: "I'm", after: "American.", options: ["not", "no", "don't", "isn't"], correct: 0, portuguese: "Não sou americano." }], vocab: [{ en: "American", pt: "Americano" }, { en: "Brazilian", pt: "Brasileiro" }] },

  { number: 3, title: "Quero Comer", description: "Expressar fome, querer comer e beber. Vocabulário de restaurante básico.", keyPhrases: ["I'd like to eat", "I'm hungry", "Do you want to eat?", "Something to eat"], exercises: [{ type: "mc", question: "Como se diz 'Estou com fome' em inglês?", options: ["I want food.", "I'm hungry.", "I have hunger.", "Feed me."], correct: 1, explanation: "'I'm hungry' = estou com fome. Em inglês usa-se 'I'm' (ser/estar), nunca 'I have hunger'." }, { type: "listen", english: "I'm hungry. I'd like to eat something. Do you want to eat too?", portuguese: "Estou com fome. Gostaria de comer algo. Você também quer comer?" }, { type: "fill", before: "I'd", after: "to eat, please.", options: ["like", "want", "need", "love"], correct: 0, portuguese: "Gostaria de comer, por favor." }], vocab: [{ en: "I'm hungry", pt: "Estou com fome" }, { en: "I'd like to eat", pt: "Gostaria de comer" }] },

  { number: 4, title: "Beber Algo", description: "Bebidas, preferências e como pedir algo para beber.", keyPhrases: ["Something to drink", "I'd like water", "Wine / Beer", "What would you like?"], exercises: [{ type: "mc", question: "Como se pede água num restaurante?", options: ["Give water!", "I'd like some water, please.", "Water for me.", "Bring water."], correct: 1, explanation: "'I'd like + o que quer + please' é sempre a forma mais educada de pedir algo." }, { type: "listen", english: "Would you like something to drink? Yes, I'd like water, please. Still or sparkling?", portuguese: "Gostaria de beber algo? Sim, gostaria de água, por favor. Com ou sem gás?" }, { type: "fill", before: "I'd like a glass of", after: ", please.", options: ["wine", "wines", "the wine", "winery"], correct: 0, portuguese: "Gostaria de uma taça de vinho, por favor." }], vocab: [{ en: "Water", pt: "Água" }, { en: "Still / Sparkling", pt: "Sem gás / Com gás" }] },

  { number: 5, title: "Quanto Custa?", description: "Números de 1 a 10, perguntar preços e fazer transações simples.", keyPhrases: ["How much?", "One, two, three...", "Five dollars", "Here you go"], exercises: [{ type: "mc", question: "Como se diz 'Quanto custa?' em inglês?", options: ["How many?", "How much?", "How expensive?", "What price?"], correct: 1, explanation: "'How much?' é usado para quantidades incontáveis ou preços. 'How many?' é para quantidades de itens contáveis." }, { type: "listen", english: "How much is it? It's ten dollars. Here's twenty. Keep the change.", portuguese: "Quanto custa? São dez dólares. Aqui estão vinte. Fique com o troco." }, { type: "fill", before: "It's", after: "dollars.", options: ["five", "fived", "the five", "fives"], correct: 0, portuguese: "São cinco dólares." }], vocab: [{ en: "How much?", pt: "Quanto custa?" }, { en: "Keep the change", pt: "Fique com o troco" }] },

  { number: 6, title: "Não Estou com Fome", description: "Expressões negativas, recusar educadamente e expressar estado físico.", keyPhrases: ["I'm not hungry", "No, thank you", "I don't want to", "Maybe later"], exercises: [{ type: "mc", question: "Como se recusa algo educadamente?", options: ["No!", "No, thank you. I'm fine.", "I don't want it.", "Stop offering."], correct: 1, explanation: "'No, thank you' + explicação é a forma mais educada de recusar em inglês." }, { type: "listen", english: "Would you like dessert? No, thank you. I'm not hungry anymore. I'm full.", portuguese: "Gostaria de sobremesa? Não, obrigado. Já não estou mais com fome. Estou cheio." }, { type: "fill", before: "I'm", after: ", thank you.", options: ["full", "complete", "done eating", "finished"], correct: 0, portuguese: "Estou cheio, obrigado." }], vocab: [{ en: "I'm full", pt: "Estou cheio" }, { en: "No, thank you", pt: "Não, obrigado" }] },

  { number: 7, title: "Que Horas São?", description: "Horas, números maiores e expressões de tempo.", keyPhrases: ["What time is it?", "It's three o'clock", "In the morning", "At noon"], exercises: [{ type: "mc", question: "Como se diz '3:30' em inglês?", options: ["Three thirty", "Half past three", "Both are correct", "Three and half"], correct: 2, explanation: "'Three thirty' e 'half past three' são ambas corretas para 3:30. 'Half past' é mais britânico." }, { type: "listen", english: "What time is it? It's half past three in the afternoon. Thank you.", portuguese: "Que horas são? São três e meia da tarde. Obrigado." }, { type: "fill", before: "The meeting is at", after: "o'clock sharp.", options: ["nine", "ninth", "nine the", "nines"], correct: 0, portuguese: "A reunião é às nove em ponto." }], vocab: [{ en: "O'clock", pt: "Em ponto (horas exatas)" }, { en: "Half past", pt: "E meia" }] },

  { number: 8, title: "Para Onde Vai?", description: "Destinos, direções e perguntar sobre planos.", keyPhrases: ["Where are you going?", "I'm going to the hotel", "To the airport", "Let's go"], exercises: [{ type: "mc", question: "Como se pergunta 'Para onde você vai?'", options: ["Where do you go?", "Where are you going?", "Where will you go?", "To where going?"], correct: 1, explanation: "'Where are you going?' usa o presente contínuo para perguntar sobre planos imediatos/atuais." }, { type: "listen", english: "Where are you going? I'm going to the hotel. How far is it from here?", portuguese: "Para onde você vai? Vou ao hotel. Fica longe daqui?" }, { type: "fill", before: "I'm going", after: "the restaurant.", options: ["to", "at", "in", "for"], correct: 0, portuguese: "Vou ao restaurante." }], vocab: [{ en: "I'm going to...", pt: "Vou a/para..." }, { en: "How far?", pt: "Fica longe?" }] },

  { number: 9, title: "Fica Longe?", description: "Distâncias, pedir e dar direções básicas.", keyPhrases: ["It's not far", "Turn left / right", "Straight ahead", "About ten minutes"], exercises: [{ type: "mc", question: "Como se diz 'Siga em frente' em inglês?", options: ["Go forward", "Straight ahead", "Keep front", "Drive straight forward"], correct: 1, explanation: "'Straight ahead' = siga em frente. 'Turn left' = vire à esquerda. 'Turn right' = vire à direita." }, { type: "listen", english: "Excuse me, is the museum far from here? It's not far. Go straight ahead, then turn left at the traffic lights.", portuguese: "Com licença, o museu fica longe daqui? Não é longe. Vá em frente e vire à esquerda no semáforo." }, { type: "fill", before: "It's about", after: "minutes walk from here.", options: ["ten", "tenth", "the ten", "ten's"], correct: 0, portuguese: "Fica a cerca de dez minutos a pé daqui." }], vocab: [{ en: "Straight ahead", pt: "Siga em frente" }, { en: "Traffic lights", pt: "Semáforo" }] },

  { number: 10, title: "Moro Aqui", description: "Falar sobre onde mora, sua cidade e vizinhança.", keyPhrases: ["I live here", "Where do you live?", "I live in...", "In a neighborhood called..."], exercises: [{ type: "mc", question: "Como se pergunta onde alguém mora?", options: ["Where are you?", "Where do you live?", "Where is your house?", "Your home where?"], correct: 1, explanation: "'Where do you live?' usa o presente simples porque morar é um estado contínuo, não uma ação temporária." }, { type: "listen", english: "Where do you live? I live in São Paulo, in a neighborhood called Pinheiros. It's a great area, close to restaurants and parks.", portuguese: "Onde você mora? Moro em São Paulo, num bairro chamado Pinheiros. É uma ótima área, perto de restaurantes e parques." }, { type: "fill", before: "I've been living here", after: "five years.", options: ["for", "since", "during", "from"], correct: 0, portuguese: "Moro aqui há cinco anos." }], vocab: [{ en: "Neighborhood", pt: "Bairro" }, { en: "Close to", pt: "Perto de" }] },

  { number: 11, title: "O Que Você Quer?", description: "Expressões de desejo, pedidos e preferências.", keyPhrases: ["What do you want?", "I want to go", "I'd prefer", "Would you like...?"], exercises: [{ type: "mc", question: "Qual é a forma mais educada de pedir algo?", options: ["I want this.", "Give me this.", "I'd like this, please.", "This one, I want."], correct: 2, explanation: "'I'd like' (I would like) é mais educado que 'I want'. Use sempre 'please' em pedidos formais." }, { type: "listen", english: "What would you like for breakfast? I'd like scrambled eggs and toast, please. Anything to drink? Coffee, please.", portuguese: "O que gostaria no café da manhã? Gostaria de ovos mexidos e torrada, por favor. Algo para beber? Café, por favor." }, { type: "fill", before: "I'd", after: "a window seat, please.", options: ["prefer", "preferring", "preferred", "preference"], correct: 0, portuguese: "Prefiro um assento na janela, por favor." }], vocab: [{ en: "Scrambled eggs", pt: "Ovos mexidos" }, { en: "Toast", pt: "Torrada" }] },

  { number: 12, title: "Encontros Marcados", description: "Marcar encontros, confirmar horários e locais.", keyPhrases: ["Let's meet at...", "What time works for you?", "I'll be there at...", "See you then!"], exercises: [{ type: "mc", question: "Como se propõe um horário de encontro?", options: ["Meet me!", "What about meeting at 3 PM?", "3 PM, be there.", "You come at 3."], correct: 1, explanation: "'What about + gerúndio?' é uma forma natural de propor algo. 'What about meeting at 3?' = Que tal nos encontrarmos às 3?" }, { type: "listen", english: "Let's meet for lunch tomorrow. What time works for you? How about one o'clock? Perfect, I'll be there.", portuguese: "Vamos nos encontrar para almoçar amanhã. Que horário funciona para você? Que tal à uma? Perfeito, estarei lá." }, { type: "fill", before: "See you", after: "!", options: ["then", "than", "there then", "soon then"], correct: 0, portuguese: "Até lá!" }], vocab: [{ en: "What time works?", pt: "Que horário funciona?" }, { en: "I'll be there", pt: "Estarei lá" }] },

  { number: 13, title: "Tenho de Ir", description: "Expressões de obrigação, necessidade e despedidas.", keyPhrases: ["I have to go", "I need to...", "I must leave now", "It was nice meeting you"], exercises: [{ type: "mc", question: "Qual das frases expressa obrigação?", options: ["I go now.", "I have to go now.", "I'm going now.", "I want to go now."], correct: 1, explanation: "'Have to' e 'must' expressam obrigação. 'I have to go' = preciso ir / tenho que ir." }, { type: "listen", english: "I'm sorry, but I have to go. I have a meeting in thirty minutes. It was great seeing you!", portuguese: "Desculpe, mas preciso ir. Tenho uma reunião em trinta minutos. Foi ótimo te ver!" }, { type: "fill", before: "It was nice", after: "you!", options: ["meeting", "meet", "to meet", "met"], correct: 0, portuguese: "Foi um prazer conhecê-lo!" }], vocab: [{ en: "I have to go", pt: "Tenho que ir" }, { en: "It was nice meeting you", pt: "Foi um prazer conhecê-lo" }] },

  { number: 14, title: "Você Fala Inglês?", description: "Línguas, níveis de fluência e comunicação cross-cultural.", keyPhrases: ["Do you speak English?", "Fluently / A little", "Could you speak more slowly?", "Could you repeat that?"], exercises: [{ type: "mc", question: "Como pedir para alguém falar mais devagar?", options: ["Speak slow!", "Could you speak more slowly, please?", "Slower you speak!", "Talk slowly now."], correct: 1, explanation: "'Could you...? please' é a forma mais educada de fazer pedidos em inglês." }, { type: "listen", english: "Do you speak English? Yes, but not very well. Could you speak more slowly, please? Of course! Take your time.", portuguese: "Você fala inglês? Sim, mas não muito bem. Poderia falar mais devagar, por favor? Claro! Fique à vontade." }, { type: "fill", before: "I speak English", after: ".", options: ["fluently", "fluent", "in fluently", "with fluent"], correct: 0, portuguese: "Falo inglês com fluência." }], vocab: [{ en: "Fluently", pt: "Com fluência" }, { en: "Could you repeat that?", pt: "Poderia repetir?" }] },

  { number: 15, title: "Comer Fora", description: "Vocabulário de restaurante completo: pedir, reclamar, pagar.", keyPhrases: ["May I see the menu?", "I'm ready to order", "Could I have...?", "This is not what I ordered"], exercises: [{ type: "mc", question: "Como se chama o garçom educadamente?", options: ["Hey you!", "Excuse me!", "Waiter, come here!", "OI!"], correct: 1, explanation: "'Excuse me!' é a forma correta de chamar o garçom. 'Waiter!' sozinho pode soar rude em contextos modernos." }, { type: "listen", english: "Excuse me, I'm ready to order. I'd like the grilled salmon with vegetables. And could I have still water?", portuguese: "Com licença, estou pronto para pedir. Gostaria do salmão grelhado com legumes. E poderia me trazer água sem gás?" }, { type: "fill", before: "Could I have", after: "bill, please?", options: ["the", "a", "my", "that"], correct: 0, portuguese: "Poderia me trazer a conta, por favor?" }], vocab: [{ en: "Grilled", pt: "Grelhado" }, { en: "The bill", pt: "A conta" }] },

  { number: 16, title: "Fazer Planos", description: "Planos futuros, previsões e expressões de intenção.", keyPhrases: ["I'm going to...", "I plan to...", "What are you going to do?", "This weekend..."], exercises: [{ type: "mc", question: "Como se fala sobre um plano já decidido?", options: ["I will maybe go.", "I'm going to visit my family.", "I visit family.", "Family visit I will."], correct: 1, explanation: "'Going to' expressa planos já decididos com antecedência. 'Will' é mais para decisões espontâneas feitas no momento." }, { type: "listen", english: "What are you going to do this weekend? I'm going to visit my family. We're planning a barbecue if the weather is good.", portuguese: "O que vai fazer neste fim de semana? Vou visitar minha família. Estamos planejando um churrasco se o tempo estiver bom." }, { type: "fill", before: "I'm planning", after: "travel to Europe next year.", options: ["to", "for", "on", "about"], correct: 0, portuguese: "Estou planejando viajar para a Europa no próximo ano." }], vocab: [{ en: "I'm going to...", pt: "Vou (plano decidido)" }, { en: "If the weather is good", pt: "Se o tempo estiver bom" }] },

  { number: 17, title: "O Passado", description: "Contar sobre eventos passados usando o Simple Past.", keyPhrases: ["I went to...", "I saw / I ate", "Last week / Yesterday", "It was great!"], exercises: [{ type: "mc", question: "Qual é o passado do verbo 'go'?", options: ["Goed", "Went", "Going", "Gone"], correct: 1, explanation: "'Go' é irregular: go → went → gone. 'I went' = eu fui. Memorize os verbos irregulares mais comuns." }, { type: "listen", english: "Last weekend I went to the beach. I saw a beautiful sunset and ate fresh seafood. It was absolutely wonderful!", portuguese: "No fim de semana passado fui à praia. Vi um pôr do sol lindo e comi frutos do mar frescos. Foi absolutamente maravilhoso!" }, { type: "fill", before: "I", after: "a great movie last night.", options: ["watched", "watch", "watching", "have watch"], correct: 0, portuguese: "Assisti a um ótimo filme ontem à noite." }], vocab: [{ en: "Last weekend", pt: "No fim de semana passado" }, { en: "I saw", pt: "Eu vi" }] },

  { number: 18, title: "Pedir Ajuda", description: "Pedir e oferecer ajuda com naturalidade e educação.", keyPhrases: ["Could you help me?", "Of course!", "Would you mind...?", "Don't hesitate to ask"], exercises: [{ type: "mc", question: "Qual é a forma mais educada de pedir ajuda?", options: ["Help me!", "Could you help me with this, please?", "I need help now.", "Do help me."], correct: 1, explanation: "'Could you...?' é sempre mais educado que 'Can you...?' para pedidos formais." }, { type: "listen", english: "Excuse me, could you help me? I'm lost. Of course! Where are you trying to go? I'm looking for the central station.", portuguese: "Com licença, poderia me ajudar? Estou perdido. Claro! Para onde você está tentando ir? Estou procurando a estação central." }, { type: "fill", before: "Would you", after: "helping me with the bags?", options: ["mind", "care", "want", "like"], correct: 0, portuguese: "Você se importaria de me ajudar com as malas?" }], vocab: [{ en: "Would you mind?", pt: "Você se importaria?" }, { en: "I'm lost", pt: "Estou perdido" }] },

  { number: 19, title: "Gostos e Desgostos", description: "Expressões para falar sobre o que gosta, não gosta e preferências.", keyPhrases: ["I love / I hate", "I prefer...", "I'm into...", "It's not for me"], exercises: [{ type: "mc", question: "Qual expressão significa 'não é para mim / não gosto muito'?", options: ["I hate it.", "It's not really my thing.", "I dislike it extremely.", "No way!"], correct: 1, explanation: "'It's not my thing' ou 'It's not really for me' é uma forma educada de dizer que não gosta sem ser rude." }, { type: "listen", english: "What kind of music do you like? I'm really into jazz and classical music. I can't stand pop music, to be honest.", portuguese: "Que tipo de música você gosta? Gosto muito de jazz e música clássica. Não suporto música pop, para ser honesto." }, { type: "fill", before: "I'm really", after: "hiking and outdoor activities.", options: ["into", "in", "at", "about"], correct: 0, portuguese: "Gosto muito de caminhadas e atividades ao ar livre." }], vocab: [{ en: "I'm into...", pt: "Gosto muito de..." }, { en: "I can't stand", pt: "Não suporto" }] },

  { number: 20, title: "Experiências de Vida", description: "Present Perfect para falar sobre experiências de vida.", keyPhrases: ["Have you ever...?", "I've never...", "I've been to...", "It was my first time"], exercises: [{ type: "mc", question: "Qual frase usa o Present Perfect corretamente?", options: ["I have visited Paris last year.", "I visited Paris.", "I've visited Paris before.", "I was visit Paris."], correct: 2, explanation: "'Have you ever...?' / 'I've + particípio' expressam experiências de vida sem mencionar quando. Não use Present Perfect com 'last year', 'yesterday' etc." }, { type: "listen", english: "Have you ever been to Japan? Yes, I've been there twice! I've never tried sushi in Japan though. I'd love to go back.", portuguese: "Você já foi ao Japão? Sim, estive lá duas vezes! Mas nunca provei sushi no Japão. Adoraria voltar." }, { type: "fill", before: "I've", after: "skydiving before.", options: ["never tried", "not tried", "never try", "didn't try"], correct: 0, portuguese: "Nunca tentei paraquedismo." }], vocab: [{ en: "Have you ever...?", pt: "Você já...?" }, { en: "I've been to...", pt: "Já estive em..." }] },

  { number: 21, title: "Dar Opiniões", description: "Expressar e debater opiniões de forma estruturada.", keyPhrases: ["In my view...", "I strongly believe...", "I agree / I disagree", "That's a good point"], exercises: [{ type: "mc", question: "Como se concorda com uma opinião?", options: ["Yes, you are right about this matter.", "Absolutely, I couldn't agree more!", "I am in accordance with your view.", "You have the correct opinion."], correct: 1, explanation: "'I couldn't agree more' = concordo plenamente (literalmente: 'não poderia concordar mais'). É muito natural em inglês." }, { type: "listen", english: "In my view, remote work is the future. That's a great point. I agree that it offers more flexibility, but I think in-person collaboration is still valuable.", portuguese: "Na minha opinião, o trabalho remoto é o futuro. Ótimo ponto. Concordo que oferece mais flexibilidade, mas acho que a colaboração presencial ainda é valiosa." }, { type: "fill", before: "I see your point,", after: "I'm not sure I agree.", options: ["but", "and", "so", "because"], correct: 0, portuguese: "Entendo seu ponto, mas não tenho certeza se concordo." }], vocab: [{ en: "In my view", pt: "Na minha opinião" }, { en: "That's a good point", pt: "Ótimo ponto" }] },

  { number: 22, title: "Notícias e Atualizações", description: "Vocabulário para discutir notícias, eventos e dar atualizações.", keyPhrases: ["Have you heard?", "Apparently...", "According to...", "I read that..."], exercises: [{ type: "mc", question: "Como se compartilha uma notícia de forma neutra?", options: ["I heard a rumor that...", "According to the report...", "Everyone says that...", "It is a fact that..."], correct: 1, explanation: "'According to' = de acordo com. É neutro e indica fonte. Use-o para compartilhar informações sem assumir responsabilidade pela veracidade." }, { type: "listen", english: "Have you heard the news? Apparently the company is expanding to Europe. According to the CEO, they'll open offices in three countries next year.", portuguese: "Você ouviu as notícias? Aparentemente a empresa está se expandindo para a Europa. De acordo com o CEO, abrirão escritórios em três países no próximo ano." }, { type: "fill", before: "I read that the new law will", after: "effect next month.", options: ["take", "make", "do", "get"], correct: 0, portuguese: "Li que a nova lei entrará em vigor no próximo mês." }], vocab: [{ en: "Apparently", pt: "Aparentemente" }, { en: "According to", pt: "De acordo com" }] },

  { number: 23, title: "Fazer Comparações", description: "Comparar pessoas, lugares e situações em inglês.", keyPhrases: ["...is bigger than...", "The most...in the world", "Not as...as", "Compared to..."], exercises: [{ type: "mc", question: "Como se faz uma comparação de superioridade com adjetivo longo?", options: ["São Paulo is more big than Rio.", "São Paulo is bigger than Rio.", "São Paulo is more bigger than Rio.", "São Paulo bigger is than Rio."], correct: 1, explanation: "Para adjetivos curtos (1-2 sílabas): adicione -er. Para longos (3+ sílabas): use 'more'. 'Big' é curto: bigger." }, { type: "listen", english: "The Amazon is the largest river in the world. It's much bigger than the Nile. Compared to other rainforests, the Amazon is unparalleled.", portuguese: "O Amazonas é o maior rio do mundo. É muito maior que o Nilo. Comparado a outras florestas tropicais, o Amazonas não tem paralelo." }, { type: "fill", before: "This is", after: "the best decision I've ever made.", options: ["definitely", "definite", "definition", "definitively"], correct: 0, portuguesa: "Esta é definitivamente a melhor decisão que já tomei." }], vocab: [{ en: "The largest", pt: "O maior" }, { en: "Compared to", pt: "Comparado a" }] },

  { number: 24, title: "Tecnologia no Dia a Dia", description: "Vocabulário de tecnologia, internet e comunicação digital.", keyPhrases: ["Download / Upload", "Can you send me the link?", "My phone died", "I need WiFi"], exercises: [{ type: "mc", question: "O que significa 'My phone is dead'?", options: ["Meu telefone está quebrado", "Meu telefone acabou a bateria", "Meu telefone foi roubado", "Meu telefone é ruim"], correct: 1, explanation: "'My phone is dead' = meu celular acabou a bateria (descarregou). 'My phone is broken' = meu celular está quebrado." }, { type: "listen", english: "Do you have WiFi here? Yes, the password is on the table. My phone is almost dead. Can I use your charger?", portuguese: "Vocês têm WiFi aqui? Sim, a senha está na mesa. Meu celular está quase sem bateria. Posso usar o seu carregador?" }, { type: "fill", before: "Could you", after: "this document to me?", options: ["send", "forward", "email", "any of the above"], correct: 3, portuguese: "Poderia enviar este documento para mim?" }], vocab: [{ en: "My phone is dead", pt: "Meu celular está sem bateria" }, { en: "Charger", pt: "Carregador" }] },

  { number: 25, title: "Sentimentos e Emoções", description: "Expressar emoções, como você se sente e perguntar sobre o bem-estar.", keyPhrases: ["I feel excited", "I'm worried about...", "I'm so relieved!", "Don't worry"], exercises: [{ type: "mc", question: "Como se expressa alívio em inglês?", options: ["I'm so sad!", "What a relief!", "I feel nothing.", "I am relieved completely."], correct: 1, explanation: "'What a relief!' = Que alívio! É uma exclamação natural. Também pode dizer 'I'm so relieved' como adjetivo." }, { type: "listen", english: "I'm really excited about the trip. Are you nervous? A little. But I'm sure it'll be amazing. Don't worry!", portuguese: "Estou muito animado com a viagem. Você está nervoso? Um pouco. Mas tenho certeza que será incrível. Não se preocupe!" }, { type: "fill", before: "I'm", after: "about the exam tomorrow.", options: ["worried", "worry", "worrying", "worrisome"], correct: 0, portuguese: "Estou preocupado com a prova amanhã." }], vocab: [{ en: "Excited", pt: "Animado / Empolgado" }, { en: "Worried", pt: "Preocupado" }] },

  { number: 26, title: "Casa e Bairro", description: "Descrição de casas, bairros e conversas com vizinhos.", keyPhrases: ["I just moved in", "The neighborhood is...", "Neighbors", "Utilities included"], exercises: [{ type: "mc", question: "Como se diz 'acabei de me mudar' em inglês?", options: ["I moved just.", "I just moved in.", "I have been moving.", "New I am here."], correct: 1, explanation: "'I just moved in' = acabei de me mudar (para cá). 'Move in' é um phrasal verb que significa mudar-se para um lugar." }, { type: "listen", english: "Hi, I'm your new neighbor! I just moved in last week. Nice to meet you! The neighborhood is very quiet and safe, you'll love it here.", portuguese: "Oi, sou seu novo vizinho! Acabei de me mudar na semana passada. Prazer! O bairro é muito tranquilo e seguro, você vai adorar aqui." }, { type: "fill", before: "The apartment comes with", after: "included.", options: ["utilities", "utility", "utilitys", "all utility"], correct: 0, portuguese: "O apartamento vem com contas inclusas." }], vocab: [{ en: "Neighbor", pt: "Vizinho" }, { en: "Utilities", pt: "Contas de água e luz" }] },

  { number: 27, title: "No Trabalho", description: "Situações profissionais: promoções, demissões, reuniões e feedbacks.", keyPhrases: ["I got promoted!", "Performance review", "I quit my job", "Working from home"], exercises: [{ type: "mc", question: "Como se diz 'Fui promovido' em inglês?", options: ["I was promoted!", "I promoted myself.", "They promoted at me.", "I got a promotion!"], correct: 3, explanation: "Tanto 'I was promoted' quanto 'I got a promotion' são corretas. 'Got a promotion' é mais informal e coloquial." }, { type: "listen", english: "Congratulations! I heard you got promoted. Thank you! I've been working towards this for two years. The raise is great too.", portuguese: "Parabéns! Ouvi que foi promovido. Obrigado! Trabalhei para isso por dois anos. O aumento também é ótimo." }, { type: "fill", before: "I've been", after: "from home for three years now.", options: ["working", "work", "worked", "worker"], correct: 0, portuguese: "Tenho trabalhado de casa há três anos." }], vocab: [{ en: "Promotion", pt: "Promoção (cargo)" }, { en: "Raise", pt: "Aumento de salário" }] },

  { number: 28, title: "Educação e Aprendizado", description: "Vocabulário de escola, faculdade e aprendizado ao longo da vida.", keyPhrases: ["I'm studying...", "I have a degree in...", "I'm taking a course", "Lifelong learning"], exercises: [{ type: "mc", question: "Como se diz 'Tenho graduação em engenharia'?", options: ["I have a degree in engineering.", "I am degree engineer.", "My study was engineering.", "I studied engineer."], correct: 0, explanation: "'Have a degree in + área' = ter graduação em. 'I'm majoring in' (ainda na faculdade) ou 'I majored in' (já formado)." }, { type: "listen", english: "What are you studying? I'm studying computer science at university. And after that? I plan to do a Master's degree in artificial intelligence.", portuguese: "O que você está estudando? Estudo ciência da computação na faculdade. E depois? Planejo fazer mestrado em inteligência artificial." }, { type: "fill", before: "I'm taking an online", after: "to improve my English.", options: ["course", "class", "both are correct", "lesson"], correct: 2, portuguese: "Estou fazendo um curso online para melhorar meu inglês." }], vocab: [{ en: "Degree", pt: "Graduação / Diploma" }, { en: "Master's", pt: "Mestrado" }] },

  { number: 29, title: "Viagem de Negócios", description: "Conversas de negócios internacionais: reuniões, apresentações e jantares corporativos.", keyPhrases: ["Business trip", "Sales pitch", "Let's seal the deal", "Our Q3 results..."], exercises: [{ type: "mc", question: "O que significa 'Let's seal the deal'?", options: ["Vamos fechar o negócio", "Vamos assinar o contrato agora", "Vamos discutir os termos", "Ambas A e B são corretas"], correct: 3, explanation: "'Seal the deal' = fechar o negócio definitivamente, geralmente com assinatura de contrato. A e B são praticamente sinônimos neste contexto." }, { type: "listen", english: "Our Q3 results exceeded expectations. We grew 23% year-over-year. The board is very pleased and we're looking to expand into new markets.", portuguese: "Nossos resultados do 3º trimestre superaram as expectativas. Crescemos 23% em relação ao ano anterior. O conselho está muito satisfeito e queremos expandir para novos mercados." }, { type: "fill", before: "We need to", after: "our strategy for next year.", options: ["revisit", "review", "both work", "re-think"], correct: 2, portuguese: "Precisamos reavaliar nossa estratégia para o próximo ano." }], vocab: [{ en: "Year-over-year", pt: "Em relação ao ano anterior" }, { en: "Board", pt: "Conselho administrativo" }] },

  { number: 30, title: "Conquista Final", description: "Revisão completa do Pimsleur. Conversas naturais em todos os contextos aprendidos.", keyPhrases: ["I can speak English!", "I've come a long way", "Practice makes perfect", "Keep going!"], exercises: [{ type: "mc", question: "Qual expressão significa 'a prática leva à perfeição'?", options: ["Training is the key.", "Practice makes perfect.", "Do it more times.", "Repetition is good."], correct: 1, explanation: "'Practice makes perfect' é um provérbio clássico em inglês, equivalente ao 'A prática leva à perfeição' em português." }, { type: "listen", english: "Congratulations on completing all 30 Pimsleur lessons! You've come a long way. Keep practicing every day and you'll be speaking English naturally in no time.", portuguese: "Parabéns por completar todas as 30 lições do Pimsleur! Você foi muito longe. Continue praticando todos os dias e em breve falará inglês de forma natural." }, { type: "fill", before: "I've", after: "a long way in my English journey.", options: ["come", "went", "been", "gone"], correct: 0, portuguese: "Percorri um longo caminho na minha jornada com o inglês." }], vocab: [{ en: "Practice makes perfect", pt: "A prática leva à perfeição" }, { en: "I've come a long way", pt: "Percorri um longo caminho" }] },
];

/* ─────────────────────────────────────────────────────
   LEITURAS — 18 lições de leitura em áudio
   ───────────────────────────────────────────────────── */

const LEITURAS_TITLES = [
  "A Manhã em Nova Iorque",
  "No Aeroporto Internacional",
  "Uma Visita ao Museu",
  "Conversas no Café",
  "A Reunião de Negócios",
  "Fim de Semana na Praia",
  "O Primeiro Dia de Trabalho",
  "Fazendo Compras no Shopping",
  "Uma Noite no Teatro",
  "Viagem de Trem",
  "No Médico",
  "Alugando um Apartamento",
  "O Jantar em Família",
  "Aula de Inglês",
  "Um Passeio pelo Parque",
  "Planejando Férias",
  "A Entrevista de Emprego",
  "De Volta para Casa",
];

/* ════════════════════════════════════════════════════════════
   GERAÇÃO DAS LIÇÕES COMPLETAS
   ════════════════════════════════════════════════════════════ */

function buildAssimil(): Lesson[] {
  const lessons: Lesson[] = [];
  ASSIMIL_UNITS.forEach((unit, uIdx) => {
    const unitNum = uIdx + 1;
    for (let n = unit.from; n <= unit.to; n++) {
      const level: LessonLevel = n <= 49 ? "Iniciante" : n <= 98 ? "Intermediário" : "Avançado";
      lessons.push({
        id: `assimil-${String(n).padStart(3, "0")}`,
        category: "assimil",
        number: n,
        unit: unitNum,
        title: `Lição ${n}`,
        subtitle: unit.title,
        description: unit.description,
        audioSrc: `/audio/assimil/${String(n).padStart(3, "0")}.mp3`,
        level,
        durationMin: 25,
        exercises: unit.exercises,
        vocab: unit.vocab,
      });
    }
  });
  return lessons;
}

function buildPimsleur(): Lesson[] {
  return PIMSLEUR_LESSONS.map((p) => ({
    id: `pimsleur-${String(p.number).padStart(2, "0")}`,
    category: "pimsleur" as LessonCategory,
    number: p.number,
    unit: Math.ceil(p.number / 5),
    title: `Lição ${p.number}`,
    subtitle: p.title,
    description: p.description,
    audioSrc: `/audio/pimsleur/ingles-${String(p.number).padStart(2, "0")}.mp3`,
    level: (p.number <= 10 ? "Iniciante" : p.number <= 20 ? "Intermediário" : "Avançado") as LessonLevel,
    durationMin: 30,
    exercises: p.exercises,
    vocab: p.vocab,
  }));
}

function buildLeituras(): Lesson[] {
  return Array.from({ length: 18 }, (_, i) => {
    const n = i + 1;
    const level: LessonLevel = n <= 6 ? "Iniciante" : n <= 12 ? "Intermediário" : "Avançado";
    return {
      id: `leitura-${String(n).padStart(2, "0")}`,
      category: "leituras" as LessonCategory,
      number: n,
      unit: Math.ceil(n / 3),
      title: `Leitura ${n}`,
      subtitle: LEITURAS_TITLES[i],
      description: `Texto de leitura em inglês com narração em áudio — prática de listening e compreensão. Tema: ${LEITURAS_TITLES[i]}.`,
      audioSrc: `/audio/leituras/${String(n).padStart(2, "0")}.mp3`,
      level,
      durationMin: 15,
      exercises: [
        { type: "mc", question: "Qual é o melhor jeito de usar esta lição?", options: ["Ouvir sem ler", "Ler junto enquanto ouve", "Ouvir, depois ler, depois ouvir novamente", "Apenas ler em silêncio"], correct: 2, explanation: "O método mais eficaz: 1) Ouça sem ler (compreensão auditiva) 2) Leia enquanto ouve (associação) 3) Ouça novamente sem ler (confirmação da compreensão)." },
        { type: "listen", english: `${LEITURAS_TITLES[i]}. Listen carefully and try to understand the main ideas before reading.`, portuguese: `${LEITURAS_TITLES[i]}. Ouça com atenção e tente entender as ideias principais antes de ler.`, tip: "Concentre-se no ritmo e na pronúncia naturais do inglês." },
        { type: "fill", before: "After listening, I can", after: "the main idea.", options: ["understand", "comprehend", "grasp", "all of the above"], correct: 3, portuguese: "Depois de ouvir, consigo entender a ideia principal." },
      ],
      vocab: [
        { en: "Comprehension", pt: "Compreensão" },
        { en: "Context clues", pt: "Pistas de contexto" },
      ],
    };
  });
}

/* ── Exports finais ── */
export const ALL_LESSONS: Lesson[] = [
  ...buildAssimil(),
  ...buildPimsleur(),
  ...buildLeituras(),
];

export const ASSIMIL_LESSONS = ALL_LESSONS.filter((l) => l.category === "assimil");
export const PIMSLEUR_LESSONS_LIST = ALL_LESSONS.filter((l) => l.category === "pimsleur");
export const LEITURAS_LIST = ALL_LESSONS.filter((l) => l.category === "leituras");

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}
