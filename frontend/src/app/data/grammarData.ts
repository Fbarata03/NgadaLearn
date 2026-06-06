/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Dados de Gramática
   10 tópicos completos com regras, exemplos e quiz
   ════════════════════════════════════════════════════════════════════ */

export interface GrammarExample {
  en: string;
  pt: string;
}

export interface GrammarRule {
  title: string;
  explanation: string;
  examples: GrammarExample[];
}

export interface GrammarLesson {
  id: string;
  number: number;
  title: string;
  titlePt: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  topic: string;
  icon: string;
  intro: string;
  rules: GrammarRule[];
  tip: string;
  quickQuiz?: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: "grammar-01",
    number: 1,
    title: "Simple Present",
    titlePt: "Presente Simples",
    level: "Iniciante",
    topic: "Tempos Verbais",
    icon: "🕐",
    intro:
      "O Simple Present (Presente Simples) é o tempo verbal mais usado em inglês. Usamo-lo para falar de hábitos, rotinas, verdades gerais e factos permanentes. É o primeiro tempo que deves dominar.",
    rules: [
      {
        title: "Forma Afirmativa",
        explanation:
          "Para I, you, we, they: usa o verbo na forma base. Para he, she, it: acrescenta -s ou -es ao verbo. Verbos terminados em -ch, -sh, -x, -o recebem -es. Verbos terminados em consoante + y mudam para -ies.",
        examples: [
          { en: "I work every day.", pt: "Eu trabalho todos os dias." },
          { en: "She works at a hospital.", pt: "Ela trabalha num hospital." },
          { en: "He watches TV after dinner.", pt: "Ele vê televisão depois do jantar." },
          { en: "They study English on Mondays.", pt: "Eles estudam inglês às segundas-feiras." },
          { en: "The sun rises in the east.", pt: "O sol nasce a este." },
        ],
      },
      {
        title: "Forma Negativa",
        explanation:
          "Usa do not (don't) para I, you, we, they. Usa does not (doesn't) para he, she, it. O verbo principal fica sempre na forma base após o auxiliar.",
        examples: [
          { en: "I don't drink coffee.", pt: "Eu não bebo café." },
          { en: "She doesn't like spicy food.", pt: "Ela não gosta de comida picante." },
          { en: "We don't live in London.", pt: "Nós não vivemos em Londres." },
          { en: "He doesn't understand Portuguese.", pt: "Ele não percebe português." },
        ],
      },
      {
        title: "Forma Interrogativa",
        explanation:
          "Para perguntas, coloca Do no início da frase para I, you, we, they. Usa Does para he, she, it. O verbo principal fica na forma base.",
        examples: [
          { en: "Do you speak English?", pt: "Fala inglês?" },
          { en: "Does he live here?", pt: "Ele vive aqui?" },
          { en: "Do they have a car?", pt: "Eles têm um carro?" },
          { en: "Does she work on weekends?", pt: "Ela trabalha aos fins de semana?" },
        ],
      },
      {
        title: "Usos Principais",
        explanation:
          "Usa o Simple Present para: 1) Hábitos e rotinas (com always, usually, often, sometimes, rarely, never). 2) Factos e verdades gerais. 3) Horários e programas fixos. 4) Instruções e direcções.",
        examples: [
          { en: "I always brush my teeth before bed.", pt: "Eu escovo sempre os dentes antes de dormir." },
          { en: "Water boils at 100 degrees Celsius.", pt: "A água ferve a 100 graus Celsius." },
          { en: "The train leaves at 8 o'clock.", pt: "O comboio parte às 8 horas." },
          { en: "You turn left at the traffic lights.", pt: "Vira à esquerda nos semáforos." },
        ],
      },
    ],
    tip: "Lembra-te do -s para he/she/it! É o erro mais comum dos falantes de português. Diz sempre: 'He workS', 'She likeS', 'It rainS'.",
    quickQuiz: [
      {
        question: "Which sentence is correct?",
        options: [
          "She work at a bank.",
          "She works at a bank.",
          "She is work at a bank.",
          "She working at a bank.",
        ],
        correct: 1,
        explanation: "Com 'she' (3ª pessoa do singular), o verbo recebe -s: 'works'.",
      },
      {
        question: "How do you make the negative of 'He plays football'?",
        options: [
          "He not plays football.",
          "He doesn't plays football.",
          "He doesn't play football.",
          "He don't play football.",
        ],
        correct: 2,
        explanation: "Com 'he', usamos 'doesn't' e o verbo fica na forma base: 'play' (sem -s).",
      },
      {
        question: "Which adverb goes with Simple Present?",
        options: ["Yesterday", "Tomorrow", "Every day", "Right now"],
        correct: 2,
        explanation: "'Every day' indica hábito/rotina, que é o uso principal do Simple Present.",
      },
    ],
  },
  {
    id: "grammar-02",
    number: 2,
    title: "Simple Past",
    titlePt: "Passado Simples",
    level: "Iniciante",
    topic: "Tempos Verbais",
    icon: "📅",
    intro:
      "O Simple Past (Passado Simples) é usado para falar de acções que aconteceram e terminaram no passado. É essencial para contar histórias, descrever experiências e falar de eventos passados.",
    rules: [
      {
        title: "Verbos Regulares – Afirmativa",
        explanation:
          "A maioria dos verbos forma o passado acrescentando -ed. Verbos terminados em -e recebem apenas -d. Verbos terminados em consoante + y mudam para -ied. Verbos curtos com vogal + consoante dobram a consoante final.",
        examples: [
          { en: "I worked late yesterday.", pt: "Eu trabalhei até tarde ontem." },
          { en: "She called me this morning.", pt: "Ela telefonou-me esta manhã." },
          { en: "We played football last Saturday.", pt: "Jogámos futebol no sábado passado." },
          { en: "He stopped the car suddenly.", pt: "Ele parou o carro de repente." },
          { en: "They tried their best.", pt: "Eles tentaram o seu melhor." },
        ],
      },
      {
        title: "Verbos Irregulares – Afirmativa",
        explanation:
          "Muitos verbos comuns são irregulares e têm formas de passado próprias que tens de memorizar. Os mais comuns são: go→went, have→had, be→was/were, do→did, get→got, make→made, take→took, come→came, see→saw, know→knew.",
        examples: [
          { en: "I went to the supermarket.", pt: "Fui ao supermercado." },
          { en: "She had a great time.", pt: "Ela divertiu-se muito." },
          { en: "We saw a good film last night.", pt: "Vimos um bom filme ontem à noite." },
          { en: "He made breakfast for everyone.", pt: "Ele fez o pequeno-almoço para todos." },
          { en: "They came home very late.", pt: "Eles chegaram a casa muito tarde." },
        ],
      },
      {
        title: "Forma Negativa",
        explanation:
          "Usa did not (didn't) + verbo na forma base para todas as pessoas. Nota: o verbo principal NÃO recebe -ed na negativa.",
        examples: [
          { en: "I didn't go to school yesterday.", pt: "Não fui à escola ontem." },
          { en: "She didn't call me back.", pt: "Ela não me ligou de volta." },
          { en: "We didn't have enough time.", pt: "Não tivemos tempo suficiente." },
          { en: "He didn't understand the question.", pt: "Ele não percebeu a pergunta." },
        ],
      },
      {
        title: "Forma Interrogativa",
        explanation:
          "Coloca Did no início da frase + sujeito + verbo na forma base. Para perguntas com question words (where, when, why, what, who), a question word vem antes do Did.",
        examples: [
          { en: "Did you sleep well?", pt: "Dormiste bem?" },
          { en: "Did she finish the project?", pt: "Ela terminou o projecto?" },
          { en: "Where did you go last weekend?", pt: "Onde foste no fim de semana passado?" },
          { en: "What did he say?", pt: "O que é que ele disse?" },
        ],
      },
    ],
    tip: "As expressões de tempo mais comuns com Simple Past: yesterday, last night/week/month/year, ago (two days ago), in + year (in 2020). Quando vires estas palavras, usa o passado simples!",
    quickQuiz: [
      {
        question: "What is the past tense of 'go'?",
        options: ["goed", "gone", "went", "goes"],
        correct: 2,
        explanation: "'Go' é irregular. O seu passado simples é 'went'.",
      },
      {
        question: "Which sentence is in Simple Past?",
        options: [
          "I am eating lunch.",
          "I eat lunch every day.",
          "I ate lunch an hour ago.",
          "I will eat lunch later.",
        ],
        correct: 2,
        explanation: "'Ate' é o passado de 'eat' e 'an hour ago' indica um tempo passado específico.",
      },
      {
        question: "How do you ask 'Did she go to the party?' in negative?",
        options: [
          "She didn't went to the party.",
          "She didn't go to the party.",
          "She not go to the party.",
          "She doesn't go to the party.",
        ],
        correct: 1,
        explanation: "Na negativa do passado, usa-se 'didn't' + verbo na forma base: 'go' (não 'went').",
      },
    ],
  },
  {
    id: "grammar-03",
    number: 3,
    title: "Present Perfect",
    titlePt: "Pretérito Perfeito Composto",
    level: "Intermediário",
    topic: "Tempos Verbais",
    icon: "✅",
    intro:
      "O Present Perfect liga o passado ao presente. Usamo-lo para falar de experiências de vida, acções com resultado no presente, e situações que começaram no passado e continuam. É formado com have/has + particípio passado.",
    rules: [
      {
        title: "Estrutura: have/has + Past Participle",
        explanation:
          "Para I, you, we, they: have + particípio. Para he, she, it: has + particípio. O particípio dos verbos regulares é igual ao Simple Past (-ed). Os irregulares têm formas próprias: go→gone, eat→eaten, see→seen, do→done, write→written.",
        examples: [
          { en: "I have lived here for five years.", pt: "Vivo aqui há cinco anos." },
          { en: "She has finished her homework.", pt: "Ela acabou os trabalhos de casa (e já está feito)." },
          { en: "We have visited Paris twice.", pt: "Visitámos Paris duas vezes (na nossa vida)." },
          { en: "He has never eaten sushi.", pt: "Ele nunca comeu sushi." },
          { en: "They have just arrived.", pt: "Eles acabaram de chegar." },
        ],
      },
      {
        title: "Usos: Experiências de Vida",
        explanation:
          "Usa o Present Perfect para falar de experiências ao longo da vida sem especificar quando aconteceram. As palavras-chave são: ever, never, before, once, twice, many times.",
        examples: [
          { en: "Have you ever been to London?", pt: "Já foste a Londres?" },
          { en: "I have never tried skydiving.", pt: "Nunca experimentei paraquedismo." },
          { en: "She has seen this film before.", pt: "Ela já viu este filme antes." },
          { en: "I have met him once.", pt: "Conheci-o uma vez." },
        ],
      },
      {
        title: "For e Since",
        explanation:
          "Usa FOR para indicar um período de tempo (for two hours, for a week, for years). Usa SINCE para indicar o ponto de início de uma situação (since Monday, since 2018, since I was a child).",
        examples: [
          { en: "I have known him for ten years.", pt: "Conheço-o há dez anos." },
          { en: "She has worked here since 2019.", pt: "Ela trabalha aqui desde 2019." },
          { en: "We haven't spoken for months.", pt: "Não falamos há meses." },
          { en: "He has been sick since last Tuesday.", pt: "Ele está doente desde a última terça-feira." },
        ],
      },
      {
        title: "Just, Already, Yet",
        explanation:
          "JUST = há pouco tempo (afirmativa). ALREADY = antes do esperado (afirmativa). YET = até agora (negativa e interrogativa, vai no final da frase).",
        examples: [
          { en: "I have just made coffee. Do you want some?", pt: "Acabei de fazer café. Queres?" },
          { en: "She has already left.", pt: "Ela já saiu (mais cedo do que esperávamos)." },
          { en: "Have you done your homework yet?", pt: "Já fizeste os trabalhos de casa?" },
          { en: "I haven't finished yet.", pt: "Ainda não terminei." },
        ],
      },
    ],
    tip: "A diferença crucial: 'I have seen that film' (experiência de vida, sem data) vs. 'I saw that film last week' (momento específico no passado). Se mencionas QUANDO, usa Simple Past. Se não importa QUANDO, usa Present Perfect.",
    quickQuiz: [
      {
        question: "Choose the correct sentence:",
        options: [
          "I have seen him yesterday.",
          "I saw him yesterday.",
          "I have saw him yesterday.",
          "I see him yesterday.",
        ],
        correct: 1,
        explanation: "'Yesterday' é um tempo passado específico, por isso usa-se o Simple Past 'saw', não o Present Perfect.",
      },
      {
        question: "Fill in: She _____ here for three years.",
        options: ["live", "lived", "has lived", "is living"],
        correct: 2,
        explanation: "'For three years' com uma situação ainda activa pede Present Perfect: 'has lived'.",
      },
      {
        question: "Which word goes with Present Perfect in the negative?",
        options: ["yesterday", "ago", "yet", "last week"],
        correct: 2,
        explanation: "'Yet' é usado com Present Perfect em frases negativas e interrogativas.",
      },
    ],
  },
  {
    id: "grammar-04",
    number: 4,
    title: "Future: Will vs Going To",
    titlePt: "Futuro: Will vs Going To",
    level: "Iniciante",
    topic: "Tempos Verbais",
    icon: "🔮",
    intro:
      "Em inglês, há duas formas principais de expressar o futuro: 'will' e 'going to'. Embora ambas se refiram ao futuro, têm usos distintos que é importante conhecer para comunicar com precisão.",
    rules: [
      {
        title: "Will – Decisões Espontâneas e Previsões",
        explanation:
          "Usa WILL para: 1) Decisões tomadas no momento da fala. 2) Previsões sem evidência concreta. 3) Ofertas, promessas e pedidos educados. Estrutura: will + forma base do verbo (igual para todas as pessoas). Negativa: won't (will not).",
        examples: [
          { en: "The phone is ringing. I'll get it!", pt: "O telefone está a tocar. Eu atendo!" },
          { en: "I think it will rain tomorrow.", pt: "Acho que vai chover amanhã." },
          { en: "I promise I won't be late.", pt: "Prometo que não me vou atrasar." },
          { en: "Will you help me with this?", pt: "Ajudas-me com isto?" },
          { en: "She'll probably be here by noon.", pt: "Ela provavelmente estará aqui ao meio-dia." },
        ],
      },
      {
        title: "Going To – Planos e Intenções",
        explanation:
          "Usa GOING TO para: 1) Planos e intenções já decididos antes do momento da fala. 2) Previsões baseadas em evidência visível. Estrutura: am/is/are + going to + forma base do verbo.",
        examples: [
          { en: "We're going to visit my parents next weekend.", pt: "Vamos visitar os meus pais no próximo fim de semana. (já está planeado)" },
          { en: "I'm going to study medicine. I've already applied.", pt: "Vou estudar medicina. Já me inscrevi." },
          { en: "Look at those clouds! It's going to rain.", pt: "Olha para aquelas nuvens! Vai chover. (evidência visual)" },
          { en: "She's going to have a baby!", pt: "Ela vai ter um bebé!" },
        ],
      },
      {
        title: "Diferenças em Contexto",
        explanation:
          "A distinção mais prática: se a decisão foi tomada antes de falar, usa 'going to'. Se foi tomada agora, usa 'will'. Para previsões com evidência (podes ver/sentir), usa 'going to'. Sem evidência concreta, usa 'will'.",
        examples: [
          { en: "A: We have no milk. B: Don't worry, I'll buy some. (decision now)", pt: "A: Não temos leite. B: Não te preocupes, eu compro. (decisão agora)" },
          { en: "A: Are you free tonight? B: No, I'm going to the gym. (plan made before)", pt: "A: Estás livre esta noite? B: Não, vou ao ginásio. (já estava planeado)" },
          { en: "The sky is very dark. It's going to storm. (evidence)", pt: "O céu está muito escuro. Vai haver tempestade. (evidência)" },
          { en: "I think robots will do most jobs in the future. (prediction)", pt: "Acho que os robôs farão a maioria dos trabalhos no futuro. (previsão)" },
        ],
      },
    ],
    tip: "Um truque simples: se disseste 'I'm going to...' antes, usa 'going to'. Se acabaste de decidir neste momento, usa 'will'. Na prática, os falantes nativos usam ambos com alguma flexibilidade, mas saber a distinção formal evita erros.",
    quickQuiz: [
      {
        question: "Your friend looks very pale and is sweating. You say:",
        options: [
          "She will faint.",
          "She is going to faint.",
          "She faints.",
          "She would faint.",
        ],
        correct: 1,
        explanation: "Há evidência visível (palidez, suor), por isso usamos 'going to' para previsão baseada em factos concretos.",
      },
      {
        question: "You are at a restaurant and the waiter asks what you want. You decide on the spot:",
        options: [
          "I'm going to have the pasta.",
          "I will have the pasta.",
          "I have the pasta.",
          "I had the pasta.",
        ],
        correct: 1,
        explanation: "Decisão tomada no momento → 'will'. (Embora 'going to' seja aceite na prática, 'will' é a forma mais correcta aqui.)",
      },
      {
        question: "Which sentence describes a pre-made plan?",
        options: [
          "I'll call you later.",
          "I think she'll like the gift.",
          "We're going to move to a new flat next month.",
          "Look out! You'll fall!",
        ],
        correct: 2,
        explanation: "'Going to move' indica um plano já definido antes do momento da fala.",
      },
    ],
  },
  {
    id: "grammar-05",
    number: 5,
    title: "Comparatives & Superlatives",
    titlePt: "Comparativos e Superlativos",
    level: "Iniciante",
    topic: "Adjectivos",
    icon: "📊",
    intro:
      "Os comparativos e superlativos permitem-te comparar pessoas, coisas e situações. Em inglês, a formação depende do número de sílabas do adjectivo. Dominar esta estrutura é essencial para descrições e opiniões.",
    rules: [
      {
        title: "Comparativo de Adjectivos Curtos (1 sílaba)",
        explanation:
          "Adjectivos curtos (1 sílaba): adiciona -er + than. Adjectivos terminados em consoante simples precedida de vogal simples: dobra a consoante final + er (big→bigger, hot→hotter, thin→thinner). Terminados em -e: só -r (nice→nicer, large→larger).",
        examples: [
          { en: "This car is faster than mine.", pt: "Este carro é mais rápido do que o meu." },
          { en: "She is taller than her sister.", pt: "Ela é mais alta do que a sua irmã." },
          { en: "Today is hotter than yesterday.", pt: "Hoje está mais quente do que ontem." },
          { en: "This hotel is nicer than the last one.", pt: "Este hotel é mais agradável do que o anterior." },
        ],
      },
      {
        title: "Comparativo de Adjectivos Longos (2+ sílabas)",
        explanation:
          "Adjectivos com 2 ou mais sílabas: usa more + adjectivo + than. Excepções: adjectivos de 2 sílabas terminados em -y mudam para -ier (happy→happier, easy→easier, funny→funnier).",
        examples: [
          { en: "English is more difficult than Portuguese.", pt: "O inglês é mais difícil do que o português." },
          { en: "This exercise is more interesting than the last.", pt: "Este exercício é mais interessante do que o último." },
          { en: "She is happier now than before.", pt: "Ela está mais feliz agora do que antes." },
          { en: "The new version is more expensive.", pt: "A nova versão é mais cara." },
        ],
      },
      {
        title: "Superlativo de Adjectivos Curtos",
        explanation:
          "Usa the + adjectivo + -est. As mesmas regras de ortografia aplicam-se: dobrar consoante final, etc. O superlativo indica o extremo dentro de um grupo.",
        examples: [
          { en: "Mount Everest is the highest mountain in the world.", pt: "O Monte Evereste é a montanha mais alta do mundo." },
          { en: "This is the cheapest restaurant in town.", pt: "Este é o restaurante mais barato da cidade." },
          { en: "He is the youngest student in the class.", pt: "Ele é o aluno mais novo da turma." },
          { en: "It was the biggest mistake of my life.", pt: "Foi o maior erro da minha vida." },
        ],
      },
      {
        title: "Superlativo de Adjectivos Longos e Irregulares",
        explanation:
          "Usa the most + adjectivo. Adjectivos irregulares: good→better→the best | bad→worse→the worst | far→further→the furthest | little→less→the least | much/many→more→the most.",
        examples: [
          { en: "This is the most beautiful city I have ever visited.", pt: "Esta é a cidade mais bela que já visitei." },
          { en: "She is the best student in the school.", pt: "Ela é a melhor aluna da escola." },
          { en: "That was the worst film I have ever seen.", pt: "Esse foi o pior filme que já vi." },
          { en: "He is the most talented musician I know.", pt: "Ele é o músico mais talentoso que conheço." },
        ],
      },
    ],
    tip: "Regra geral: 1 sílaba → -er/-est. 2+ sílabas → more/most. Mas cuidado com as excepções como 'good/better/best' e 'bad/worse/worst'. São as mais usadas no dia a dia!",
    quickQuiz: [
      {
        question: "What is the comparative of 'expensive'?",
        options: ["expensiver", "more expensive", "most expensive", "expensiver than"],
        correct: 1,
        explanation: "'Expensive' tem 3 sílabas, por isso usa 'more expensive'.",
      },
      {
        question: "Which is correct?",
        options: [
          "She is more tall than her brother.",
          "She is taller than her brother.",
          "She is the tallest than her brother.",
          "She is tall more than her brother.",
        ],
        correct: 1,
        explanation: "'Tall' é um adjectivo de 1 sílaba, logo usa -er: 'taller than'.",
      },
      {
        question: "What is the superlative of 'good'?",
        options: ["the goodest", "the most good", "the better", "the best"],
        correct: 3,
        explanation: "'Good' é irregular: good → better → the best.",
      },
    ],
  },
  {
    id: "grammar-06",
    number: 6,
    title: "Articles: a, an, the",
    titlePt: "Artigos: a, an, the",
    level: "Iniciante",
    topic: "Artigos",
    icon: "📝",
    intro:
      "Os artigos são pequenas palavras que acompanham os substantivos. Em inglês existem apenas três: 'a', 'an' (artigos indefinidos) e 'the' (artigo definido). O uso correcto dos artigos é um dos maiores desafios para falantes de português.",
    rules: [
      {
        title: "A / An – Artigos Indefinidos",
        explanation:
          "Usa A antes de palavras que começam com som de consoante. Usa AN antes de palavras que começam com som de vogal (a, e, i, o, u). Atenção: o que conta é o SOM, não a letra. 'Hour' começa por vogal (h mudo). 'University' começa por som de /j/ (consoante).",
        examples: [
          { en: "I need a pen.", pt: "Preciso de uma caneta." },
          { en: "She ate an apple.", pt: "Ela comeu uma maçã." },
          { en: "It was an honour to meet you.", pt: "Foi uma honra conhecê-lo." },
          { en: "He is a university student.", pt: "Ele é um estudante universitário." },
          { en: "I waited for an hour.", pt: "Esperei uma hora." },
        ],
      },
      {
        title: "Quando Usar A/An",
        explanation:
          "Usa A/AN: 1) Quando mencionas algo pela primeira vez. 2) Quando te referes a um de muitos (qualquer um). 3) Em profissões. 4) Com 'what a...!' em exclamações.",
        examples: [
          { en: "I saw a cat in the garden. The cat was black.", pt: "Vi um gato no jardim. O gato era preto. (1ª menção: a; 2ª menção: the)" },
          { en: "She is a doctor.", pt: "Ela é médica." },
          { en: "What a beautiful day!", pt: "Que dia lindo!" },
          { en: "Can I have a glass of water?", pt: "Posso ter um copo de água?" },
        ],
      },
      {
        title: "The – Artigo Definido",
        explanation:
          "Usa THE quando: 1) Ambos sabem de que se fala (já foi mencionado ou é óbvio). 2) Há apenas um de algo (the sun, the moon, the president). 3) Com superlativos. 4) Com nomes de rios, oceanos, cadeias montanhosas, países plurais.",
        examples: [
          { en: "The sun rises in the east.", pt: "O sol nasce a este." },
          { en: "The Amazon is the longest river in South America.", pt: "O Amazonas é o rio mais longo da América do Sul." },
          { en: "She is the best student in the class.", pt: "Ela é a melhor aluna da turma." },
          { en: "Can you close the door?", pt: "Podes fechar a porta?" },
          { en: "I visited the Eiffel Tower in Paris.", pt: "Visitei a Torre Eiffel em Paris." },
        ],
      },
      {
        title: "Sem Artigo – Zero Article",
        explanation:
          "Não usa artigo com: 1) Substantivos incontáveis em sentido geral (I love music). 2) Substantivos contáveis no plural em sentido geral (Dogs are loyal). 3) Nomes de línguas, desportos, refeições, anos, meses, dias. 4) Nomes de países na forma singular (Portugal, Brazil, France).",
        examples: [
          { en: "I love music.", pt: "Adoro música. (em geral)" },
          { en: "Cats are independent animals.", pt: "Os gatos são animais independentes. (em geral)" },
          { en: "She speaks French.", pt: "Ela fala francês." },
          { en: "I play football on Sundays.", pt: "Jogo futebol aos domingos." },
          { en: "He visited France last year.", pt: "Ele visitou França no ano passado." },
        ],
      },
    ],
    tip: "O erro mais comum é usar 'the' com substantivos em sentido geral. 'I love the music' está errado se falarmos de música em geral. 'I love music' é o correcto. Só usa 'the' quando é algo específico!",
    quickQuiz: [
      {
        question: "Which is correct?",
        options: [
          "She is an nurse.",
          "She is a nurse.",
          "She is the nurse.",
          "She is nurse.",
        ],
        correct: 1,
        explanation: "'Nurse' começa com som de consoante /n/, por isso usa-se 'a nurse'.",
      },
      {
        question: "Fill in: I saw ___ dog in the park. ___ dog was very friendly.",
        options: ["the / a", "a / the", "a / a", "the / the"],
        correct: 1,
        explanation: "Primeira menção: 'a dog' (indefinido). Segunda menção do mesmo cão: 'the dog' (já sabemos de qual se trata).",
      },
      {
        question: "Which sentence needs NO article?",
        options: [
          "___ Nile is a long river.",
          "I drink ___ coffee every morning.",
          "He is ___ honest man.",
          "___ book on the table is mine.",
        ],
        correct: 1,
        explanation: "'Coffee' é um substantivo incontável em sentido geral (hábito), por isso não precisa de artigo.",
      },
    ],
  },
  {
    id: "grammar-07",
    number: 7,
    title: "Prepositions",
    titlePt: "Preposições de Lugar e Tempo",
    level: "Iniciante",
    topic: "Preposições",
    icon: "📍",
    intro:
      "As preposições são palavras que indicam relações de lugar, tempo, modo e outros. Em inglês, as preposições mais importantes são: in, on, at, by, for, to, with. O seu uso não é sempre idêntico ao do português, por isso é preciso praticar.",
    rules: [
      {
        title: "In, On, At – Tempo",
        explanation:
          "AT: horas específicas, festas (at 3 o'clock, at Christmas, at night). ON: dias e datas específicos (on Monday, on 5th March, on my birthday). IN: períodos maiores – meses, anos, estações, partes do dia excepto night (in January, in 2020, in the morning, in summer).",
        examples: [
          { en: "The meeting is at 3 o'clock.", pt: "A reunião é às 3 horas." },
          { en: "I was born on the 15th of April.", pt: "Nasci no dia 15 de Abril." },
          { en: "We go on holiday in August.", pt: "Vamos de férias em Agosto." },
          { en: "She studies in the morning.", pt: "Ela estuda de manhã." },
          { en: "The shop closes at night.", pt: "A loja fecha à noite." },
        ],
      },
      {
        title: "In, On, At – Lugar",
        explanation:
          "AT: lugar específico como ponto (at the bus stop, at work, at school, at home). ON: superfície, transporte público (on the table, on the bus, on the floor, on the wall). IN: espaço fechado, cidade, país (in the room, in London, in Portugal, in the car).",
        examples: [
          { en: "She is at the airport.", pt: "Ela está no aeroporto." },
          { en: "The keys are on the table.", pt: "As chaves estão em cima da mesa." },
          { en: "He lives in Paris.", pt: "Ele vive em Paris." },
          { en: "I left my phone in the car.", pt: "Deixei o telemóvel no carro." },
          { en: "They are waiting at the station.", pt: "Estão à espera na estação." },
        ],
      },
      {
        title: "By, For, To, With",
        explanation:
          "BY: prazo (by Friday), modo de transporte (by car, by train, by plane), próximo de (I sit by the window), agente passivo (written by Shakespeare). FOR: duração (for two hours), destinatário (a gift for you), objetivo (I did it for you). TO: direção/destino (go to school), até (from 9 to 5). WITH: companhia (with my friends), instrumento (cut with a knife).",
        examples: [
          { en: "Please send it by Monday.", pt: "Por favor envia até segunda-feira." },
          { en: "We travelled by train.", pt: "Viajámos de comboio." },
          { en: "I bought these flowers for you.", pt: "Comprei estas flores para ti." },
          { en: "She walked to the station.", pt: "Ela foi a pé até à estação." },
          { en: "I came with my brother.", pt: "Vim com o meu irmão." },
        ],
      },
      {
        title: "Expressões Fixas com Preposições",
        explanation:
          "Muitas expressões em inglês têm preposições fixas que são diferentes do português. É melhor memorizá-las como unidades.",
        examples: [
          { en: "I'm interested in music.", pt: "Estou interessado em música." },
          { en: "She is good at maths.", pt: "Ela é boa a matemática." },
          { en: "He is afraid of spiders.", pt: "Ele tem medo de aranhas." },
          { en: "We are proud of you.", pt: "Estamos orgulhosos de ti." },
          { en: "I depend on my salary.", pt: "Dependo do meu salário." },
          { en: "She is looking forward to the holiday.", pt: "Ela está a aguardar com expectativa as férias." },
        ],
      },
    ],
    tip: "Memoriza: AT para pontos precisos, ON para superfícies e dias, IN para espaços e períodos. Quando estiveres a dúvida, lembra desta regra. Para expressões fixas (good AT, interested IN, afraid OF), tens de as memorizar uma a uma.",
    quickQuiz: [
      {
        question: "She was born ___ 1995.",
        options: ["at", "on", "in", "by"],
        correct: 2,
        explanation: "Com anos, usa-se 'in': 'born in 1995'.",
      },
      {
        question: "I'll see you ___ Monday.",
        options: ["in", "at", "on", "by"],
        correct: 2,
        explanation: "Com dias da semana, usa-se 'on': 'on Monday'.",
      },
      {
        question: "She is very good ___ cooking.",
        options: ["in", "at", "on", "for"],
        correct: 1,
        explanation: "'Good at' é uma expressão fixa: She is good at cooking.",
      },
    ],
  },
  {
    id: "grammar-08",
    number: 8,
    title: "Common Mistakes",
    titlePt: "Erros Comuns em Inglês",
    level: "Intermediário",
    topic: "Vocabulário",
    icon: "⚠️",
    intro:
      "Certos erros são muito comuns entre falantes de português que aprendem inglês. Esta lição cobre os pares de palavras e expressões que mais geram confusão, com explicações claras para os evitar.",
    rules: [
      {
        title: "Some / Any",
        explanation:
          "SOME: usado em frases afirmativas e em ofertas/pedidos (Would you like some...?). ANY: usado em frases negativas e interrogativas.",
        examples: [
          { en: "I have some money.", pt: "Tenho algum dinheiro. (afirmativa)" },
          { en: "Do you have any money?", pt: "Tens algum dinheiro? (interrogativa)" },
          { en: "I don't have any money.", pt: "Não tenho dinheiro. (negativa)" },
          { en: "Would you like some tea?", pt: "Queres chá? (oferta → some)" },
        ],
      },
      {
        title: "Much / Many / A lot of",
        explanation:
          "MUCH: com substantivos incontáveis (much water, much time, much money). MANY: com substantivos contáveis no plural (many people, many books, many cars). A LOT OF / LOTS OF: pode ser usado com ambos, especialmente em frases afirmativas.",
        examples: [
          { en: "How much time do we have?", pt: "Quanto tempo temos?" },
          { en: "How many students are there?", pt: "Quantos alunos há?" },
          { en: "There isn't much traffic today.", pt: "Não há muito trânsito hoje." },
          { en: "There aren't many cars in the car park.", pt: "Não há muitos carros no parque." },
          { en: "I have a lot of friends.", pt: "Tenho muitos amigos." },
        ],
      },
      {
        title: "Lend / Borrow",
        explanation:
          "LEND: dar emprestado (do lado de quem empresta). BORROW: pedir emprestado (do lado de quem recebe). Em português usamos 'emprestar' para ambos, mas em inglês são palavras diferentes!",
        examples: [
          { en: "Can you lend me your pen?", pt: "Podes emprestar-me a tua caneta? (tu dás, eu recebo)" },
          { en: "Can I borrow your pen?", pt: "Posso pedir a tua caneta emprestada? (eu recebo)" },
          { en: "She lent him €50.", pt: "Ela emprestou-lhe 50€. (ela deu)" },
          { en: "He borrowed €50 from her.", pt: "Ele pediu 50€ emprestados a ela. (ele recebeu)" },
        ],
      },
      {
        title: "Say / Tell",
        explanation:
          "SAY: dizer algo (não precisa de objeto pessoa directo). TELL: dizer a alguém (precisa sempre de objeto pessoa). Expressões fixas: tell a story, tell the truth, tell a lie, tell the time. SAY goodbye, say something, say a word.",
        examples: [
          { en: "She said that she was tired.", pt: "Ela disse que estava cansada." },
          { en: "He told me a secret.", pt: "Ele contou-me um segredo." },
          { en: "Don't tell lies!", pt: "Não digas mentiras!" },
          { en: "What did she say?", pt: "O que é que ela disse?" },
          { en: "Can you tell me the time?", pt: "Pode dizer-me as horas?" },
        ],
      },
      {
        title: "Yet / Still / Already",
        explanation:
          "STILL: algo que continua a acontecer (meio da frase, antes do verbo). YET: negativa – algo que não aconteceu mas que se espera; interrogativa – se já aconteceu (fim da frase). ALREADY: algo que aconteceu antes do esperado (meio da frase ou fim).",
        examples: [
          { en: "Are you still here?", pt: "Ainda estás aqui?" },
          { en: "I haven't finished yet.", pt: "Ainda não terminei." },
          { en: "Have you eaten yet?", pt: "Já comeste?" },
          { en: "I've already done it!", pt: "Já o fiz! (mais cedo do que esperavas)" },
          { en: "She still loves him.", pt: "Ela ainda o ama." },
        ],
      },
      {
        title: "Too / Very",
        explanation:
          "VERY: simplesmente intensifica o adjectivo. TOO: intensifica com sentido negativo ou excessivo – implica que há um problema.",
        examples: [
          { en: "This soup is very hot – delicious!", pt: "Esta sopa está muito quente – deliciosa!" },
          { en: "This soup is too hot – I can't eat it.", pt: "Esta sopa está quente demais – não consigo comê-la." },
          { en: "She is very tired but she will finish.", pt: "Ela está muito cansada mas vai acabar." },
          { en: "I'm too tired to go out.", pt: "Estou cansado demais para sair." },
        ],
      },
    ],
    tip: "O par lend/borrow e say/tell são os erros mais frequentes. Lembra: LEND (dar), BORROW (receber). TELL precisa de pessoa (tell me, tell him). SAY não precisa (she said...).",
    quickQuiz: [
      {
        question: "Which is correct? 'Can you ___ me the truth?'",
        options: ["say", "tell", "speak", "talk"],
        correct: 1,
        explanation: "'Tell' é usado antes de uma pessoa: 'tell me the truth'. 'Tell the truth' é uma expressão fixa.",
      },
      {
        question: "'The coffee is ___ hot to drink.'",
        options: ["very", "so", "too", "much"],
        correct: 2,
        explanation: "'Too hot' implica que é excessivo e que há um problema (não consigo beber).",
      },
      {
        question: "I need ___ help with the exercise.",
        options: ["any", "many", "much", "some"],
        correct: 3,
        explanation: "Em frases afirmativas, usa-se 'some'. 'Help' é incontável, por isso não pode usar 'many'.",
      },
    ],
  },
  {
    id: "grammar-09",
    number: 9,
    title: "Common Questions",
    titlePt: "Perguntas Essenciais em Inglês",
    level: "Iniciante",
    topic: "Perguntas",
    icon: "❓",
    intro:
      "Saber fazer e responder a perguntas é fundamental em inglês. Esta lição cobre as question words (what, where, when, who, why, how) e as estruturas mais usadas para formar perguntas correctamente.",
    rules: [
      {
        title: "Question Words – Palavras de Pergunta",
        explanation:
          "WHAT: o quê / qual. WHERE: onde. WHEN: quando. WHO: quem. WHY: porquê / por que razão. HOW: como. WHICH: qual (entre opções). WHOSE: de quem. HOW MUCH/MANY: quanto/quantos. HOW LONG: quanto tempo / há quanto tempo. HOW OFTEN: com que frequência.",
        examples: [
          { en: "What is your name?", pt: "Qual é o teu nome?" },
          { en: "Where do you live?", pt: "Onde moras?" },
          { en: "When does the film start?", pt: "Quando começa o filme?" },
          { en: "Who is your teacher?", pt: "Quem é o teu professor?" },
          { en: "Why are you late?", pt: "Porque é que estás atrasado?" },
          { en: "How do you spell that?", pt: "Como se escreve isso?" },
        ],
      },
      {
        title: "Estrutura das Perguntas",
        explanation:
          "Ordem: Question Word + Auxiliar (do/does/did/am/is/are/will) + Sujeito + Verbo Principal. Nota: quando WHO é o sujeito da pergunta, não precisa de auxiliar.",
        examples: [
          { en: "Where does she work?", pt: "Onde é que ela trabalha?" },
          { en: "What did you eat for lunch?", pt: "O que comeste ao almoço?" },
          { en: "How long have you been waiting?", pt: "Há quanto tempo estás à espera?" },
          { en: "Who called you? (WHO = sujeito)", pt: "Quem te telefonou? (sem auxiliar)" },
          { en: "Why didn't you tell me?", pt: "Porque é que não me disseste?" },
        ],
      },
      {
        title: "Perguntas com How",
        explanation:
          "HOW é muito versátil e combina com adjectivos e advérbios para criar muitas perguntas úteis.",
        examples: [
          { en: "How old are you?", pt: "Quantos anos tens?" },
          { en: "How far is the station?", pt: "A que distância fica a estação?" },
          { en: "How often do you exercise?", pt: "Com que frequência fazes exercício?" },
          { en: "How long does it take?", pt: "Quanto tempo demora?" },
          { en: "How much does this cost?", pt: "Quanto custa isto?" },
          { en: "How many people are coming?", pt: "Quantas pessoas vêm?" },
        ],
      },
      {
        title: "Perguntas Indirectas / Educadas",
        explanation:
          "Para perguntas mais educadas ou formais, usa estruturas indirectas. A ordem das palavras muda: depois de 'Could you tell me / Do you know / I was wondering...', a frase fica na ordem afirmativa (não invertida).",
        examples: [
          { en: "Direct: Where is the bank?", pt: "Directa: Onde é o banco?" },
          { en: "Indirect: Could you tell me where the bank is?", pt: "Indirecta: Poderia dizer-me onde é o banco?" },
          { en: "Do you know what time it is?", pt: "Sabe que horas são?" },
          { en: "I was wondering if you could help me.", pt: "Perguntava-me se me podia ajudar." },
          { en: "Would you mind telling me your name?", pt: "Importar-se-ia de me dizer o seu nome?" },
        ],
      },
    ],
    tip: "Lembra-te: em perguntas directas, o auxiliar vem antes do sujeito ('Do you...?', 'Where does she...?'). Em perguntas indirectas, usa a ordem normal da frase ('Could you tell me where she works?'). Este é um dos erros mais comuns!",
    quickQuiz: [
      {
        question: "Which question is correct?",
        options: [
          "Where you live?",
          "Where do you live?",
          "Where does you live?",
          "Where lives you?",
        ],
        correct: 1,
        explanation: "A estrutura correcta é Question Word + auxiliar + sujeito + verbo: 'Where do you live?'",
      },
      {
        question: "Ask about frequency: '___ do you go to the gym?'",
        options: ["How much", "How many", "How often", "How long"],
        correct: 2,
        explanation: "'How often' pergunta sobre a frequência de uma acção.",
      },
      {
        question: "Which indirect question is correct?",
        options: [
          "Do you know where is the hotel?",
          "Do you know where the hotel is?",
          "Do you know where the hotel be?",
          "Do you know where does the hotel?",
        ],
        correct: 1,
        explanation: "Em perguntas indirectas, a ordem é normal (sujeito + verbo): 'where the hotel is'.",
      },
    ],
  },
  {
    id: "grammar-10",
    number: 10,
    title: "Phrasal Verbs",
    titlePt: "Verbos Frasais",
    level: "Intermediário",
    topic: "Vocabulário",
    icon: "🔗",
    intro:
      "Os phrasal verbs são combinações de verbo + preposição ou advérbio que formam um significado novo, muitas vezes diferente do verbo original. São extremamente comuns no inglês falado e escrito informal. Conhecer os 30 mais usados vai mudar a tua fluência.",
    rules: [
      {
        title: "Phrasal Verbs de Rotina Diária",
        explanation:
          "Estes phrasal verbs são usados para descrever acções do dia a dia: get up, wake up, get dressed, go out, come back, turn on/off, pick up, put down.",
        examples: [
          { en: "I get up at 7 every morning.", pt: "Levanto-me às 7 todas as manhãs." },
          { en: "She woke up late today.", pt: "Ela acordou tarde hoje." },
          { en: "Turn off the lights when you leave.", pt: "Apaga as luzes quando saíres." },
          { en: "He picked up his daughter from school.", pt: "Ele foi buscar a filha à escola." },
          { en: "I'll be back. Don't go out.", pt: "Já volto. Não saias." },
        ],
      },
      {
        title: "Phrasal Verbs de Progressão e Mudança",
        explanation:
          "Estes expressam movimento, progressão, interrupção ou mudança: carry on, give up, move on, break down, set up, take over, grow up, break up.",
        examples: [
          { en: "Don't give up! You're almost there.", pt: "Não desistas! Estás quase lá." },
          { en: "They broke up after two years.", pt: "Eles separaram-se depois de dois anos." },
          { en: "My car broke down on the motorway.", pt: "O meu carro avariou na auto-estrada." },
          { en: "She grew up in a small town.", pt: "Ela cresceu numa cidade pequena." },
          { en: "Let's move on to the next topic.", pt: "Passemos ao próximo tópico." },
        ],
      },
      {
        title: "Phrasal Verbs de Comunicação e Relações",
        explanation:
          "Usados em contextos sociais e de comunicação: look for, find out, bring up, get along, call back, look after, check in, look forward to.",
        examples: [
          { en: "I'm looking for my keys.", pt: "Estou à procura das minhas chaves." },
          { en: "I need to find out what time the shop closes.", pt: "Preciso de descobrir a que horas a loja fecha." },
          { en: "She looks after her elderly parents.", pt: "Ela toma conta dos pais idosos." },
          { en: "Do you get along with your boss?", pt: "Dás-te bem com o teu chefe?" },
          { en: "I'll call you back in five minutes.", pt: "Ligo-te de volta em cinco minutos." },
        ],
      },
      {
        title: "Phrasal Verbs de Acção e Gestão",
        explanation:
          "Usados para acções concretas e gestão de situações: put off, take on, work out, sort out, run out of, fill in, hand in, make up.",
        examples: [
          { en: "Don't put off until tomorrow what you can do today.", pt: "Não adie para amanhã o que podes fazer hoje." },
          { en: "We've run out of coffee.", pt: "Ficámos sem café." },
          { en: "Please fill in this form.", pt: "Por favor preenche este formulário." },
          { en: "You need to hand in your assignment by Friday.", pt: "Tens de entregar o trabalho até sexta." },
          { en: "She works out every evening.", pt: "Ela faz exercício todas as noites." },
        ],
      },
    ],
    tip: "A melhor forma de aprender phrasal verbs é em contexto – não os decorar em listas isoladas. Quando encontrares um phrasal verb novo, anota a frase completa. Muitos têm vários significados dependendo do contexto (e.g., 'take off' = descolar / tirar a roupa).",
    quickQuiz: [
      {
        question: "What does 'give up' mean?",
        options: ["Dar um presente", "Desistir", "Levantar algo", "Ir embora"],
        correct: 1,
        explanation: "'Give up' significa desistir / deixar de tentar.",
      },
      {
        question: "'We've run ___ of milk.' Complete with the correct preposition.",
        options: ["away", "over", "out", "up"],
        correct: 2,
        explanation: "'Run out of' significa ficar sem / esgotar: 'We've run out of milk.'",
      },
      {
        question: "Which phrasal verb means 'to search for'?",
        options: ["look after", "look forward to", "look for", "look out"],
        correct: 2,
        explanation: "'Look for' = procurar. 'Look after' = tomar conta. 'Look forward to' = aguardar com expectativa.",
      },
    ],
  },
];

export function getGrammarById(id: string): GrammarLesson | undefined {
  return GRAMMAR_LESSONS.find((lesson) => lesson.id === id);
}
