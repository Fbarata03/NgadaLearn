/* ════════════════════════════════════════════════════════════════
   NgadaLearn — Textos em Inglês
   Fonte: aulasdeinglesgratis.net + conteúdo próprio
   ════════════════════════════════════════════════════════════════ */

export type TextLevel = "Iniciante" | "Intermediário" | "Avançado";

export interface TextLesson {
  id: string;
  number: number;
  title: string;
  titlePt: string;
  level: TextLevel;
  topic: string;
  paragraphs: { en: string; pt: string }[];
  vocabulary: { word: string; meaning: string }[];
  comprehensionQ?: { question: string; answer: string }[];
  tip: string;
}

export const TEXTS: TextLesson[] = [

  /* ════════ INICIANTE ════════ */

  {
    id: "text-01",
    number: 1,
    title: "Happy Birthday, Ben!",
    titlePt: "Feliz Aniversário, Ben!",
    level: "Iniciante",
    topic: "Rotina e Aniversário",
    paragraphs: [
      {
        en:  "Ben woke up early this morning. It's his tenth birthday today. He got out of bed. He smiled broadly. He did his morning exercises.",
        pt:  "Ben acordou cedo esta manhã. Hoje é seu décimo aniversário. Ele saiu da cama. Ele sorriu amplamente. Ele fez seus exercícios matinais.",
      },
      {
        en:  "He took a warm shower. After the shower he brushed his teeth. He combed his fair hair. Ben put on his white shirt and dark blue trousers.",
        pt:  "Ele tomou um banho quente. Depois do banho escovou os dentes. Ele penteou seu cabelo loiro. Ben colocou sua camisa branca e calças azul-escuro.",
      },
      {
        en:  "Ben went down the stairs and saw his Mom and Dad. They are in the kitchen. Mom made a birthday cake for Ben. Dad laid the table. Mom and Dad gave him a present and kissed him. Ben is happy!",
        pt:  "Ben desceu as escadas e viu sua mãe e seu pai. Eles estavam na cozinha. A mãe fez um bolo de aniversário para Ben. O pai pôs a mesa. Mãe e pai deram-lhe um presente e o beijaram. Ben está feliz!",
      },
    ],
    vocabulary: [
      { word: "woke up", meaning: "acordou" },
      { word: "broadly", meaning: "amplamente / com entusiasmo" },
      { word: "brushed his teeth", meaning: "escovou os dentes" },
      { word: "combed", meaning: "penteou" },
      { word: "fair hair", meaning: "cabelo loiro" },
      { word: "trousers", meaning: "calças" },
      { word: "stairs", meaning: "escadas" },
      { word: "laid the table", meaning: "pôs a mesa" },
    ],
    comprehensionQ: [
      { question: "How old is Ben?", answer: "Ben is ten years old." },
      { question: "What did his mom make?", answer: "His mom made a birthday cake." },
    ],
    tip: "Repara no uso do Simple Past (woke, got, smiled, took, brushed) — é o tempo verbal para descrever ações passadas em sequência.",
  },

  {
    id: "text-02",
    number: 2,
    title: "Lily Goes to School",
    titlePt: "Lily vai à escola",
    level: "Iniciante",
    topic: "Escola e Amizade",
    paragraphs: [
      {
        en:  "Lily is so glad! Today it is her first day of school. She can already write and read. Lily puts on her new green dress. Mom makes sandwiches for Lily. Cucumber sandwiches are her favorite.",
        pt:  "Lily está tão feliz! Hoje é seu primeiro dia de escola. Ela já sabe escrever e ler. Lily coloca seu novo vestido verde. A mãe faz sanduíches para a Lily. Sanduíches de pepino são seus favoritos.",
      },
      {
        en:  "Lily's friend Jim lives around the corner. Jim is also going to school today. Jim's school bag is very heavy. Lily helps Jim carry his bag.",
        pt:  "O amigo de Lily, Jim, mora logo na esquina. Jim também vai à escola hoje. A mochila de Jim é muito pesada. Lily ajuda Jim a carregar sua mochila.",
      },
      {
        en:  "At school there are many children. The teacher's name is Miss Green. She is very kind. Lily and Jim like their new school very much.",
        pt:  "Na escola há muitas crianças. O nome da professora é Miss Green. Ela é muito gentil. Lily e Jim gostam muito da nova escola.",
      },
    ],
    vocabulary: [
      { word: "glad", meaning: "feliz, contente" },
      { word: "dress", meaning: "vestido" },
      { word: "cucumber", meaning: "pepino" },
      { word: "around the corner", meaning: "logo na esquina" },
      { word: "heavy", meaning: "pesado" },
      { word: "kind", meaning: "gentil, amável" },
    ],
    comprehensionQ: [
      { question: "What does Lily wear on her first day?", answer: "She wears a new green dress." },
      { question: "Who is the teacher?", answer: "The teacher's name is Miss Green." },
    ],
    tip: "'Around the corner' = logo ali, na esquina. 'She can already write and read' — 'can' = capacidade; 'already' = já.",
  },

  {
    id: "text-03",
    number: 3,
    title: "The Clumsy Puppy",
    titlePt: "O cachorrinho desastrado",
    level: "Iniciante",
    topic: "Animais de Estimação",
    paragraphs: [
      {
        en:  "Bess is seven years old. She lives in the countryside with her parents. Bess has long dark hair and brown eyes. Bess has a little puppy. Her puppy is fluffy and funny. It has curly fair hair and a short tail.",
        pt:  "Bess tem sete anos. Ela mora no campo com seus pais. Bess tem cabelo escuro comprido e olhos castanhos. Bess tem um cachorrinho. Seu cachorrinho é fofo e engraçado. Tem cabelo loiro crespo e cauda curta.",
      },
      {
        en:  "Bess loves playing with the puppy. Today Bess runs in the living room with her puppy. There is a red vase with yellow flowers on the table.",
        pt:  "Bess adora brincar com o cachorrinho. Hoje Bess corre na sala com seu cachorrinho. Há um vaso vermelho com flores amarelas sobre a mesa.",
      },
      {
        en:  "But Bess is unlucky – she drops the vase. Bess and her puppy see a big puddle of water on the floor. Oh, what a pity!",
        pt:  "Mas Bess não tem sorte — ela derruba o vaso. Bess e seu cachorrinho veem uma grande poça de água no chão. Que pena!",
      },
    ],
    vocabulary: [
      { word: "clumsy", meaning: "desastrado, sem jeito" },
      { word: "puppy", meaning: "cachorrinho / filhote" },
      { word: "fluffy", meaning: "fofo, peludo" },
      { word: "curly", meaning: "crespo, encaracolado" },
      { word: "tail", meaning: "cauda, rabo" },
      { word: "vase", meaning: "vaso" },
      { word: "drops", meaning: "deixa cair" },
      { word: "puddle", meaning: "poça de água" },
      { word: "unlucky", meaning: "sem sorte" },
    ],
    comprehensionQ: [
      { question: "Where does Bess live?", answer: "She lives in the countryside." },
      { question: "What happens to the vase?", answer: "Bess drops the vase and it creates a puddle of water." },
    ],
    tip: "'What a pity!' = Que pena! Expressão comum para demonstrar lamento. 'Clumsy' = desastrado — adjectivo muito útil no dia a dia.",
  },

  {
    id: "text-04",
    number: 4,
    title: "Babysitting",
    titlePt: "Tomando conta de criança",
    level: "Iniciante",
    topic: "Família e Responsabilidade",
    paragraphs: [
      {
        en:  "Nancy is a student. She studies nursery education at college. Nancy is a clever and serious girl. She wants to teach children.",
        pt:  "Nancy é estudante. Ela estuda educação infantil na faculdade. Nancy é uma menina inteligente e séria. Ela quer ensinar crianças.",
      },
      {
        en:  "It is Sunday today. Nancy's parents are at the mall. They are shopping. And Nancy is looking after her little brother. Her brother is three years old. His name is Tommy. Tommy loves to play and run.",
        pt:  "Hoje é domingo. Os pais de Nancy estão no shopping. Estão fazendo compras. E Nancy está cuidando do irmãozinho. Seu irmão tem três anos. O nome dele é Tommy. Tommy adora brincar e correr.",
      },
      {
        en:  "Tommy falls down and cries. Nancy holds him in her arms and sings a song for him. Tommy falls asleep. So Nancy spends all day with Tommy. Nancy feels tired. Babysitting is hard!",
        pt:  "Tommy cai e chora. Nancy o segura nos braços e canta uma música para ele. Tommy adormece. Então Nancy passa o dia todo com Tommy. Nancy se sente cansada. Tomar conta de criança é difícil!",
      },
    ],
    vocabulary: [
      { word: "nursery education", meaning: "educação infantil" },
      { word: "looking after", meaning: "cuidando de" },
      { word: "falls down", meaning: "cai" },
      { word: "holds", meaning: "segura" },
      { word: "falls asleep", meaning: "adormece" },
      { word: "babysitting", meaning: "tomar conta de criança / ser babá" },
      { word: "tired", meaning: "cansada" },
    ],
    comprehensionQ: [
      { question: "Why is Nancy at home on Sunday?", answer: "Her parents are at the mall shopping, so Nancy is looking after Tommy." },
      { question: "What does Nancy do when Tommy cries?", answer: "She holds him and sings a song." },
    ],
    tip: "'Look after' = cuidar de (phrasal verb). 'Fall asleep' = adormecer. 'Spend time' = passar tempo. Estes são phrasal verbs muito comuns na vida quotidiana.",
  },

  {
    id: "text-05",
    number: 5,
    title: "The Dentist",
    titlePt: "O Dentista",
    level: "Iniciante",
    topic: "Saúde e Medicina",
    paragraphs: [
      {
        en:  "Mr. Henderson is a dentist. He has worked at a hospital for twenty years. He has many patients. He loves to treat people.",
        pt:  "O Sr. Henderson é dentista. Ele trabalha num hospital há vinte anos. Tem muitos pacientes. Ele adora tratar pessoas.",
      },
      {
        en:  "Today Mr. Henderson has a special patient. His name is Luke. He is five years old. Luke is afraid of dentists. Luke cries and doesn't let Mr. Henderson look at his tooth.",
        pt:  "Hoje o Sr. Henderson tem um paciente especial. O nome dele é Luke. Ele tem cinco anos. Luke tem medo de dentistas. Luke chora e não deixa o Sr. Henderson olhar para o seu dente.",
      },
      {
        en:  "But Mr. Henderson is a good dentist. He starts talking to little Luke. He tells him a funny story. Luke starts smiling and laughing. Mr. Henderson looks at Luke's tooth. Everything is alright. Luke can go home. Mr. Henderson and Luke shake hands.",
        pt:  "Mas o Sr. Henderson é um bom dentista. Ele começa a conversar com o pequeno Luke. Conta-lhe uma história engraçada. Luke começa a sorrir e a rir. O Sr. Henderson olha para o dente de Luke. Está tudo bem. Luke pode ir para casa. O Sr. Henderson e Luke apertam as mãos.",
      },
    ],
    vocabulary: [
      { word: "dentist", meaning: "dentista" },
      { word: "patient", meaning: "paciente" },
      { word: "treat", meaning: "tratar (médico)" },
      { word: "afraid of", meaning: "com medo de" },
      { word: "tooth", meaning: "dente" },
      { word: "funny story", meaning: "história engraçada" },
      { word: "shake hands", meaning: "apertar as mãos" },
      { word: "alright", meaning: "tudo bem, correcto" },
    ],
    comprehensionQ: [
      { question: "Why is Luke scared?", answer: "Luke is afraid of dentists." },
      { question: "How does Mr. Henderson calm Luke down?", answer: "He tells him a funny story." },
    ],
    tip: "'Afraid of' = com medo de. 'Shake hands' = apertar as mãos (forma de cumprimento formal). 'He has worked for twenty years' = Present Perfect com 'for' (duração).",
  },

  {
    id: "text-06",
    number: 6,
    title: "The Flag of the USA",
    titlePt: "A Bandeira dos EUA",
    level: "Iniciante",
    topic: "Cultura Americana",
    paragraphs: [
      {
        en:  "Jackson Roger lives in the USA. He is 8 years old. He loves his country. He likes painting flags. He loves to paint the USA flag because it has stars.",
        pt:  "Jackson Roger mora nos EUA. Ele tem 8 anos. Ele ama seu país. Ele gosta de pintar bandeiras. Ele adora pintar a bandeira americana porque ela tem estrelas.",
      },
      {
        en:  "It has three colors: red, blue and white. There are 50 stars on the flag. There are 13 stripes, 7 red and 6 white. Jackson has put many flags in his room. His room looks beautiful.",
        pt:  "A bandeira tem três cores: vermelho, azul e branco. Há 50 estrelas na bandeira. Há 13 listras, 7 vermelhas e 6 brancas. Jackson colocou muitas bandeiras em seu quarto. Seu quarto fica lindo.",
      },
      {
        en:  "His friends love to paint flags too. The USA flag looks attractive. Everyone should love their country. A flag is used as a symbol. Jackson likes studying about flags of different countries. He wins many painting competitions. He is appreciated by his parents and teachers.",
        pt:  "Seus amigos também adoram pintar bandeiras. A bandeira americana parece atraente. Todos devem amar seu país. Uma bandeira é usada como símbolo. Jackson gosta de estudar as bandeiras de diferentes países. Ele ganha muitas competições de pintura. Ele é muito apreciado pelos seus pais e professores.",
      },
    ],
    vocabulary: [
      { word: "flag", meaning: "bandeira" },
      { word: "stars", meaning: "estrelas" },
      { word: "stripes", meaning: "listras, riscas" },
      { word: "attractive", meaning: "atraente, bonita" },
      { word: "symbol", meaning: "símbolo" },
      { word: "competition", meaning: "competição" },
      { word: "appreciated", meaning: "apreciado, valorizado" },
    ],
    comprehensionQ: [
      { question: "How many stars are on the USA flag?", answer: "There are 50 stars." },
      { question: "How many stripes does the flag have?", answer: "It has 13 stripes — 7 red and 6 white." },
    ],
    tip: "'There are 50 stars' = existência (there is/are). 'Is used as' = é usado como (voz passiva simples). 'Should' = deveria / deve (obrigação moral).",
  },

  {
    id: "text-07",
    number: 7,
    title: "A Busy Life",
    titlePt: "Uma vida ocupada",
    level: "Iniciante",
    topic: "Rotina e Aniversário Surpresa",
    paragraphs: [
      {
        en:  "Albert came home from the office. He was very tired. He had his dinner. He went to his bed. He was trying to sleep. His friend called him. He didn't want to talk because he was tired. He switched off his phone.",
        pt:  "Albert voltou do escritório. Estava muito cansado. Ele jantou. Foi para a cama. Estava tentando dormir. O amigo dele ligou. Ele não queria falar porque estava cansado. Desligou o telefone.",
      },
      {
        en:  "He tried to sleep again. He got a call on another phone. He was very angry. He didn't answer it. He sat down and had some water.",
        pt:  "Ele tentou dormir novamente. Recebeu uma chamada em outro telefone. Ficou muito zangado. Não atendeu. Sentou e tomou um pouco de água.",
      },
      {
        en:  "Someone knocked on his door. He opened the door. His friends came with cakes and gifts. It was Albert's birthday. He forgot his birthday! He was very happy to see his friends. He said thank you. They had a party. Then Albert went to sleep.",
        pt:  "Alguém bateu na porta. Ele abriu a porta. Seus amigos vieram com bolos e presentes. Era o aniversário de Albert. Ele esqueceu o aniversário! Ficou muito feliz em ver os amigos. Disse obrigado. Fizeram uma festa. Depois Albert foi dormir.",
      },
    ],
    vocabulary: [
      { word: "office", meaning: "escritório" },
      { word: "tired", meaning: "cansado" },
      { word: "switched off", meaning: "desligou" },
      { word: "angry", meaning: "zangado, bravo" },
      { word: "knocked on the door", meaning: "bateu na porta" },
      { word: "gifts", meaning: "presentes" },
      { word: "forgot", meaning: "esqueceu (past of forget)" },
      { word: "party", meaning: "festa" },
    ],
    comprehensionQ: [
      { question: "Why didn't Albert answer the phone?", answer: "He was very tired and angry." },
      { question: "What surprise did Albert get?", answer: "His friends came with cakes and gifts for his birthday." },
    ],
    tip: "Repara nos verbos irregulares: came (come), had (have), went (go), got (get), forgot (forget), sat (sit). São essenciais para o inglês do dia a dia!",
  },

  {
    id: "text-08",
    number: 8,
    title: "A Doctor's Visit",
    titlePt: "Uma visita ao médico",
    level: "Iniciante",
    topic: "Saúde e Corpo",
    paragraphs: [
      {
        en:  "Mary has a headache. She also has a stomachache. She doesn't feel well. She decides to go to the doctor.",
        pt:  "Mary tem dor de cabeça. Ela também tem dor de estômago. Ela não se sente bem. Ela decide ir ao médico.",
      },
      {
        en:  "The doctor's name is Dr. Smith. He is a kind man. He asks Mary many questions. He asks about her diet, her sleep, and her exercise habits.",
        pt:  "O nome do médico é Dr. Smith. Ele é um homem gentil. Ele faz muitas perguntas a Mary. Ele pergunta sobre sua dieta, seu sono e seus hábitos de exercício.",
      },
      {
        en:  "Dr. Smith says Mary needs to drink more water and sleep eight hours a night. He also tells her to eat less junk food. He gives her some vitamins. Mary feels better after the visit. She follows the doctor's advice.",
        pt:  "O Dr. Smith diz que Mary precisa beber mais água e dormir oito horas por noite. Ele também diz para ela comer menos junk food. Dá-lhe algumas vitaminas. Mary se sente melhor depois da consulta. Ela segue o conselho do médico.",
      },
    ],
    vocabulary: [
      { word: "headache", meaning: "dor de cabeça" },
      { word: "stomachache", meaning: "dor de estômago" },
      { word: "kind", meaning: "gentil, amável" },
      { word: "diet", meaning: "dieta, alimentação" },
      { word: "habits", meaning: "hábitos" },
      { word: "junk food", meaning: "comida fast-food / pouco saudável" },
      { word: "vitamins", meaning: "vitaminas" },
      { word: "advice", meaning: "conselho" },
    ],
    comprehensionQ: [
      { question: "What are Mary's symptoms?", answer: "She has a headache and a stomachache." },
      { question: "What does the doctor recommend?", answer: "To drink more water, sleep 8 hours, eat less junk food and take vitamins." },
    ],
    tip: "Palavras de dor em inglês: headache (cabeça), stomachache (estômago), toothache (dente), backache (costas), earache (ouvido). Padrão: [parte do corpo] + ache.",
  },

  /* ════════ INTERMEDIÁRIO ════════ */

  {
    id: "text-09",
    number: 9,
    title: "Jenna Almost Got Late",
    titlePt: "Jenna quase se atrasou",
    level: "Intermediário",
    topic: "Trabalho e Transporte",
    paragraphs: [
      {
        en:  "Jenna is a professional cook and today is her first day in a new restaurant. She is very excited, but also nervous because she doesn't want to be late on her first day.",
        pt:  "Jenna é cozinheira profissional e hoje é seu primeiro dia num restaurante novo. Ela está muito animada, mas também nervosa porque não quer se atrasar no primeiro dia.",
      },
      {
        en:  "Jenna thinks about how to get there. She could drive, but traffic is terrible in the morning. She could take a taxi, but it's expensive. She decides to take the subway.",
        pt:  "Jenna pensa em como chegar lá. Ela poderia ir de carro, mas o trânsito é terrível de manhã. Poderia pegar um táxi, mas é caro. Ela decide pegar o metrô.",
      },
      {
        en:  "The subway is fast, but the station is crowded. Jenna is running out of time. She runs to the platform and gets on the train just before the doors close. She arrives at the restaurant exactly on time. The manager smiles and says: 'Welcome, Jenna!'",
        pt:  "O metrô é rápido, mas a estação está lotada. O tempo de Jenna está se esgotando. Ela corre até a plataforma e entra no trem logo antes de as portas fecharem. Chega ao restaurante exatamente na hora certa. O gerente sorri e diz: 'Bem-vinda, Jenna!'",
      },
    ],
    vocabulary: [
      { word: "professional", meaning: "profissional" },
      { word: "excited", meaning: "animado, entusiasmado" },
      { word: "nervous", meaning: "nervoso" },
      { word: "traffic", meaning: "trânsito" },
      { word: "crowded", meaning: "lotado, cheio de gente" },
      { word: "running out of time", meaning: "o tempo se esgotando" },
      { word: "platform", meaning: "plataforma (metrô/comboio)" },
      { word: "exactly on time", meaning: "exatamente na hora certa" },
    ],
    comprehensionQ: [
      { question: "Why doesn't Jenna drive to work?", answer: "Because traffic is terrible in the morning." },
      { question: "How does she get to the restaurant?", answer: "She takes the subway." },
    ],
    tip: "'Running out of time' = o tempo a esgotar-se. 'Just before' = logo antes de. 'Exactly on time' ≠ 'just in time': on time = no horário previsto; in time = a tempo (antes que seja tarde).",
  },

  {
    id: "text-10",
    number: 10,
    title: "Shopping at the Supermarket",
    titlePt: "Fazendo compras no supermercado",
    level: "Intermediário",
    topic: "Compras e Alimentação",
    paragraphs: [
      {
        en:  "Veronica wants to cook some chicken for dinner tonight, but she doesn't have all the ingredients for the recipe. She decides to go to the supermarket.",
        pt:  "Verônica quer cozinhar frango para o jantar esta noite, mas não tem todos os ingredientes para a receita. Ela decide ir ao supermercado.",
      },
      {
        en:  "At the supermarket, Veronica picks up vegetables, milk, and bread. But when she reaches the meat section, she sees that chicken is very pricey today.",
        pt:  "No supermercado, Verônica pega vegetais, leite e pão. Mas quando chega à seção de carnes, vê que o frango está muito caro hoje.",
      },
      {
        en:  "She decides to make macaroni instead — her husband Max's favorite dish. She finds the pasta and the sauce she needs. She pays at the checkout and goes home happy. Tonight dinner will be a surprise!",
        pt:  "Ela decide fazer macarrão em vez disso — o prato favorito do marido Max. Ela encontra o macarrão e o molho que precisa. Paga no caixa e vai para casa feliz. O jantar desta noite será uma surpresa!",
      },
    ],
    vocabulary: [
      { word: "ingredients", meaning: "ingredientes" },
      { word: "recipe", meaning: "receita" },
      { word: "picks up", meaning: "pega, apanha" },
      { word: "pricey", meaning: "caro (informal)" },
      { word: "instead", meaning: "em vez disso" },
      { word: "pasta", meaning: "macarrão / massa" },
      { word: "sauce", meaning: "molho" },
      { word: "checkout", meaning: "caixa (supermercado)" },
    ],
    comprehensionQ: [
      { question: "Why doesn't Veronica buy chicken?", answer: "Because chicken is very pricey (expensive) today." },
      { question: "What does she decide to cook instead?", answer: "Macaroni (her husband Max's favorite dish)." },
    ],
    tip: "'Instead' = em vez disso (substitui). 'Pricey' = caro (mais informal que 'expensive'). 'Checkout' = caixa de supermercado. 'Dish' = prato (de comida).",
  },

  {
    id: "text-11",
    number: 11,
    title: "Volleyball Turns Monday Better",
    titlePt: "O voleibol torna a segunda-feira melhor",
    level: "Intermediário",
    topic: "Desporto e Rotina",
    paragraphs: [
      {
        en:  "Barbara doesn't like Mondays. She loves the weekends when she can stay at home and enjoy the company of her best friends.",
        pt:  "Barbara não gosta de segundas-feiras. Ela adora os fins de semana, quando pode ficar em casa e aproveitar a companhia dos seus melhores amigos.",
      },
      {
        en:  "On Mondays, Barbara has classes from 8 AM to 11 AM and then again from 6 PM to 9 PM. The afternoon feels long and boring. She feels bored and unmotivated.",
        pt:  "Nas segundas-feiras, Barbara tem aulas das 8h às 11h e novamente das 18h às 21h. A tarde parece longa e entediante. Ela se sente entediada e desmotivada.",
      },
      {
        en:  "But there is one thing that makes Monday special: volleyball! Barbara plays volleyball at the gymnasium every Monday afternoon with her friends. It's the only moment of the week where she has the chance to enjoy some sport. After volleyball, she goes to her evening class with much more energy.",
        pt:  "Mas há uma coisa que torna a segunda-feira especial: voleibol! Barbara joga voleibol no ginásio toda segunda-feira à tarde com seus amigos. É o único momento da semana em que ela tem a chance de fazer algum desporto. Depois do voleibol, ela vai para a aula da noite com muito mais energia.",
      },
    ],
    vocabulary: [
      { word: "weekends", meaning: "fins de semana" },
      { word: "bored", meaning: "entediada" },
      { word: "unmotivated", meaning: "desmotivada" },
      { word: "gymnasium", meaning: "ginásio" },
      { word: "chance", meaning: "oportunidade, chance" },
      { word: "energy", meaning: "energia" },
    ],
    comprehensionQ: [
      { question: "Why doesn't Barbara like Mondays?", answer: "Because she has classes twice a day and the afternoon feels long and boring." },
      { question: "What makes Monday special for Barbara?", answer: "Playing volleyball at the gymnasium with her friends." },
    ],
    tip: "'Bored' = entediado (pessoa), 'boring' = entediante (coisa). 'I'm bored' ✓ / 'The class is boring' ✓. Nunca 'I'm boring' (a menos que você seja chato!).",
  },

  {
    id: "text-12",
    number: 12,
    title: "Being Sick Is Terrible",
    titlePt: "Estar doente é terrível",
    level: "Intermediário",
    topic: "Saúde e Humor",
    paragraphs: [
      {
        en:  "George doesn't like sickness. He never takes medicine. He doesn't like going to the doctor. He does everything he can to avoid catching a disease.",
        pt:  "George não gosta de doenças. Ele nunca toma remédio. Não gosta de ir ao médico. Ele faz tudo o que pode para evitar pegar uma doença.",
      },
      {
        en:  "One day, everyone around him starts getting sick. His friends, his parents, even his neighbors catch a bad flu. George becomes very paranoid. He washes his hands constantly, wears a mask and avoids crowded places. He even stops going to work and starts working from home.",
        pt:  "Um dia, todos ao seu redor começam a ficar doentes. Seus amigos, seus pais, até seus vizinhos pegam uma gripe forte. George fica muito paranoico. Lava as mãos constantemente, usa máscara e evita lugares lotados. Ele até para de ir ao trabalho e começa a trabalhar em casa.",
      },
      {
        en:  "Then one day, Liza — his old crush from high school — sends him a message asking for help. George can't say no to Liza. He invites her over. But when she arrives, she is sneezing non-stop, with watery eyes and a hacking cough. Poor George!",
        pt:  "Então um dia, Liza — sua paixão antiga do colégio — manda-lhe uma mensagem pedindo ajuda. George não consegue dizer não para a Liza. Convida-a para sua casa. Mas quando ela chega, ela está espirrando sem parar, com olhos lacrimejantes e uma tosse seca forte. Pobre George!",
      },
    ],
    vocabulary: [
      { word: "sickness", meaning: "doença, mal-estar" },
      { word: "avoid", meaning: "evitar" },
      { word: "paranoid", meaning: "paranoico" },
      { word: "constantly", meaning: "constantemente" },
      { word: "crowded", meaning: "lotado, com muita gente" },
      { word: "crush", meaning: "paixão / queda por alguém" },
      { word: "sneezing", meaning: "espirrando" },
      { word: "hacking cough", meaning: "tosse seca forte" },
      { word: "watery eyes", meaning: "olhos lacrimejantes" },
    ],
    comprehensionQ: [
      { question: "Why does George start working from home?", answer: "Because he is paranoid about catching the flu from others." },
      { question: "What happens when Liza arrives?", answer: "She is very sick — sneezing, with watery eyes and a cough." },
    ],
    tip: "'Crush' = paixão (informal). 'Non-stop' = sem parar. 'Even' = até, até mesmo (para enfatizar). A ironia do texto mostra um grande uso de humor no inglês cotidiano!",
  },

  /* ════════ AVANÇADO ════════ */

  {
    id: "text-13",
    number: 13,
    title: "Social Media and Loneliness",
    titlePt: "Redes Sociais e Solidão",
    level: "Avançado",
    topic: "Tecnologia e Sociedade",
    paragraphs: [
      {
        en:  "Social media was supposed to connect us. Platforms like Instagram, Twitter, and Facebook allow billions of people to share their lives, thoughts, and experiences with the world. Yet, despite being more connected than ever before, many people report feeling lonelier than any previous generation.",
        pt:  "As redes sociais deveriam nos conectar. Plataformas como Instagram, Twitter e Facebook permitem que bilhões de pessoas compartilhem suas vidas, pensamentos e experiências com o mundo. No entanto, apesar de estarmos mais conectados do que nunca, muitas pessoas relatam se sentir mais solitárias do que qualquer geração anterior.",
      },
      {
        en:  "Researchers suggest that excessive social media use can replace face-to-face interaction. When we scroll through a friend's highlight reel, we often compare our ordinary lives to their curated perfection, leading to feelings of inadequacy and isolation.",
        pt:  "Pesquisadores sugerem que o uso excessivo de redes sociais pode substituir a interação cara a cara. Quando rolamos pelo feed de um amigo, frequentemente comparamos nossas vidas comuns à perfeição curada deles, levando a sentimentos de inadequação e isolamento.",
      },
      {
        en:  "The solution may lie in balance. Using social media intentionally — to strengthen real relationships rather than replace them — can make the difference. Next time you feel lonely, instead of scrolling, consider calling a friend or going for a walk with someone you care about.",
        pt:  "A solução pode estar no equilíbrio. Usar as redes sociais intencionalmente — para fortalecer relações reais em vez de substituí-las — pode fazer a diferença. Na próxima vez que se sentir solitário, em vez de ficar rolando o feed, considere ligar para um amigo ou dar uma caminhada com alguém de quem gosta.",
      },
    ],
    vocabulary: [
      { word: "loneliness", meaning: "solidão" },
      { word: "despite", meaning: "apesar de" },
      { word: "previous generation", meaning: "geração anterior" },
      { word: "excessive", meaning: "excessivo" },
      { word: "highlight reel", meaning: "melhores momentos / o que as pessoas publicam de melhor" },
      { word: "curated", meaning: "curado, selecionado propositalmente" },
      { word: "inadequacy", meaning: "inadequação" },
      { word: "intentionally", meaning: "intencionalmente, de propósito" },
    ],
    comprehensionQ: [
      { question: "What is the irony about social media described in the text?", answer: "We are more connected digitally but feel lonelier than previous generations." },
      { question: "What does the author suggest as a solution?", answer: "Using social media intentionally to strengthen real relationships, and calling friends or spending time in person." },
    ],
    tip: "'Highlight reel' é uma metáfora esportiva — o melhor de cada jogo. Nas redes sociais: as pessoas só publicam o melhor da vida. 'Curated' = selecionado e editado cuidadosamente.",
  },

  {
    id: "text-14",
    number: 14,
    title: "Climate Change: The Urgency",
    titlePt: "Mudanças Climáticas: A Urgência",
    level: "Avançado",
    topic: "Meio Ambiente e Ciência",
    paragraphs: [
      {
        en:  "The scientific consensus is clear: climate change is real, it is happening now, and human activity is the primary driver. Average global temperatures have risen by more than 1°C since the pre-industrial era, and the consequences are already being felt worldwide.",
        pt:  "O consenso científico é claro: as mudanças climáticas são reais, estão acontecendo agora e a atividade humana é o principal motor. As temperaturas médias globais subiram mais de 1°C desde a era pré-industrial, e as consequências já são sentidas em todo o mundo.",
      },
      {
        en:  "Extreme weather events — from hurricanes and wildfires to droughts and floods — are becoming more frequent and more severe. Coastal cities face the threat of rising sea levels. Biodiversity is being lost at an unprecedented rate.",
        pt:  "Eventos climáticos extremos — de furacões e incêndios florestais a secas e enchentes — estão se tornando mais frequentes e mais graves. Cidades costeiras enfrentam a ameaça do aumento do nível do mar. A biodiversidade está sendo perdida a uma taxa sem precedentes.",
      },
      {
        en:  "Addressing climate change requires global cooperation, policy changes, and individual action. Transitioning to renewable energy, reducing waste, and consuming sustainably are steps everyone can take. The decisions made in the next decade will determine the world our children inherit.",
        pt:  "Enfrentar as mudanças climáticas requer cooperação global, mudanças de políticas e ação individual. A transição para energias renováveis, a redução de resíduos e o consumo sustentável são passos que todos podem tomar. As decisões tomadas na próxima década determinarão o mundo que nossos filhos herdarão.",
      },
    ],
    vocabulary: [
      { word: "consensus", meaning: "consenso" },
      { word: "primary driver", meaning: "principal motor / causa principal" },
      { word: "pre-industrial era", meaning: "era pré-industrial" },
      { word: "wildfires", meaning: "incêndios florestais" },
      { word: "droughts", meaning: "secas" },
      { word: "unprecedented", meaning: "sem precedentes" },
      { word: "renewable energy", meaning: "energia renovável" },
      { word: "sustainably", meaning: "de forma sustentável" },
      { word: "inherit", meaning: "herdar" },
    ],
    comprehensionQ: [
      { question: "By how much have global temperatures risen?", answer: "By more than 1°C since the pre-industrial era." },
      { question: "What three actions can individuals take?", answer: "Transition to renewable energy, reduce waste, and consume sustainably." },
    ],
    tip: "'Unprecedented' = sem precedentes (nunca visto antes). 'Transitioning to' = fazer a transição para. No inglês formal e jornalístico, o gerúndio (-ing) é muito usado como sujeito de frases.",
  },
];

export function getTextById(id: string): TextLesson | undefined {
  return TEXTS.find(t => t.id === id);
}

export const BEGINNER_TEXTS  = TEXTS.filter(t => t.level === "Iniciante");
export const INTER_TEXTS     = TEXTS.filter(t => t.level === "Intermediário");
export const ADVANCED_TEXTS  = TEXTS.filter(t => t.level === "Avançado");
