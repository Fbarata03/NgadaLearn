/* =====================================================
   NGADALEARN — GAME APP
   ===================================================== */

/* ---- DATA ---- */

const COURSES = {
  assimil: {
    id: 'assimil', pk: 'assimil',
    name: 'Assimil', full: 'Assimil — Inglês Sem Esforço',
    icon: '📚', wc: '#6366f1', cls: 'assimil',
    desc: '146 lições progressivas com diálogos do cotidiano.',
    total: 146,
    lessons: range(146, n => ({
      id: n,
      title: `Lição ${n}`,
      audio: `Assimil/Assimil - O Novo Inglês Sem Esforço - Audio/Lição (${n}).mp3`
    }))
  },
  pimsleur: {
    id: 'pimsleur', pk: 'pimsleur',
    name: 'PIMSLEUR', full: 'PIMSLEUR — Inglês Americano',
    icon: '🎧', wc: '#22c55e', cls: 'pimsleur',
    desc: '30 lições principais + 18 leituras. Foco em conversação.',
    total: 48,
    lessons: range(30, n => ({
      id: n,
      title: `Inglês ${z(n)}`,
      audio: `PIMSLEUR/ÁUDIO/Ingles ${z(n)}.mp3`
    })),
    readings: range(18, n => ({
      id: n,
      title: `Leitura ${z(n)}`,
      audio: n === 8
        ? 'PIMSLEUR/ÁUDIO/Lieturas 08.mp3'
        : `PIMSLEUR/ÁUDIO/Leituras ${z(n)}.mp3`
    }))
  }
};

const ACHIEVEMENTS = [
  { id: 'first',    icon: '🌱', name: 'Primeira Lição',   desc: 'Completa a tua primeira lição',         cond: s => s.totalDone >= 1 },
  { id: 'ten',      icon: '⚡', name: '10 Lições',         desc: 'Completa 10 lições',                    cond: s => s.totalDone >= 10 },
  { id: 'streak3',  icon: '🔥', name: 'Em Chamas',         desc: 'Mantém um streak de 3 dias',            cond: s => s.streak >= 3 },
  { id: 'twenty5',  icon: '🎯', name: 'Focado',            desc: 'Completa 25 lições',                    cond: s => s.totalDone >= 25 },
  { id: 'fifty',    icon: '🏅', name: '50 Lições',         desc: 'Completa 50 lições',                    cond: s => s.totalDone >= 50 },
  { id: 'hundred',  icon: '💎', name: '100 Lições',        desc: 'Completa 100 lições',                   cond: s => s.totalDone >= 100 },
  { id: 'assimil',  icon: '👑', name: 'Mestre Assimil',    desc: 'Conclui todo o curso Assimil',          cond: s => s.assimilDone >= 146 },
  { id: 'pimsleur', icon: '🎖️', name: 'Mestre PIMSLEUR',  desc: 'Conclui todo o curso PIMSLEUR',         cond: s => s.pimsleurDone >= 48 },
  { id: 'streak7',  icon: '🌟', name: 'Semana Perfeita',   desc: 'Mantém um streak de 7 dias',            cond: s => s.streak >= 7 },
  { id: 'all',      icon: '🚀', name: 'NgadaLearn 100%',   desc: 'Completa todos os 194 áudios',          cond: s => s.totalDone >= 194 }
];

const TEXTOS = [
  {
    id: 1,
    title: 'Morning Routine',
    level: 'iniciante',
    preview: 'It is morning. People wake up. They get ready for the day...',
    content: [
      { en: 'It is morning.', pt: 'É de manhã.' },
      { en: 'People wake up.', pt: 'As pessoas acordam.' },
      { en: 'They get ready for the day.', pt: 'Elas se preparam para o dia.' },
      { en: 'They eat breakfast.', pt: 'Elas tomam café da manhã.' },
      { en: 'Some people drink coffee.', pt: 'Algumas pessoas bebem café.' },
      { en: 'Then, they go to work or school.', pt: 'Então, elas vão para o trabalho ou escola.' }
    ]
  },
  {
    id: 2,
    title: 'First Day of School',
    level: 'iniciante',
    preview: 'Today is the first day of school. The kids are excited...',
    content: [
      { en: 'Today is the first day of school.', pt: 'Hoje é o primeiro dia de aula.' },
      { en: 'The kids are excited but nervous.', pt: 'As crianças estão animadas, mas nervosas.' },
      { en: 'They meet their new teachers.', pt: 'Elas conhecem seus novos professores.' },
      { en: 'They make new friends.', pt: 'Elas fazem novos amigos.' },
      { en: 'School is fun.', pt: 'A escola é divertida.' }
    ]
  },
  {
    id: 3,
    title: 'Water on the Floor',
    level: 'iniciante',
    preview: 'There is water on the floor. Someone spilled a glass...',
    content: [
      { en: 'There is water on the floor.', pt: 'Tem água no chão.' },
      { en: 'Someone spilled a glass of water.', pt: 'Alguém derramou um copo de água.' },
      { en: 'We need to clean it up.', pt: 'Nós precisamos limpar isso.' },
      { en: 'Get a towel, please.', pt: 'Pegue uma toalha, por favor.' },
      { en: 'Now the floor is dry.', pt: 'Agora o chão está seco.' }
    ]
  },
  {
    id: 4,
    title: 'A Doctor',
    level: 'intermediario',
    preview: 'Dr. Smith works at the hospital. He helps sick people...',
    content: [
      { en: 'Dr. Smith works at the hospital.', pt: 'O Dr. Smith trabalha no hospital.' },
      { en: 'He helps sick people every day.', pt: 'Ele ajuda pessoas doentes todos os dias.' },
      { en: 'He listens to their hearts.', pt: 'Ele escuta os corações delas.' },
      { en: 'He gives them medicine to feel better.', pt: 'Ele dá remédios para elas se sentirem melhor.' },
      { en: 'Being a doctor is a hard job, but it is rewarding.', pt: 'Ser médico é um trabalho difícil, mas é gratificante.' }
    ]
  },
  {
    id: 5,
    title: 'The Weekend',
    level: 'intermediario',
    preview: 'Weekends are for relaxing. On Saturday, I usually go to the park...',
    content: [
      { en: 'Weekends are for relaxing.', pt: 'Os fins de semana são para relaxar.' },
      { en: 'On Saturday, I usually go to the park.', pt: 'No sábado, eu costumo ir ao parque.' },
      { en: 'I like to walk my dog there.', pt: 'Eu gosto de passear com meu cachorro lá.' },
      { en: 'On Sunday, I visit my parents.', pt: 'No domingo, eu visito meus pais.' },
      { en: 'We have a big family dinner.', pt: 'Nós temos um grande jantar em família.' }
    ]
  }
];

const FRASES = [
  { id: 1, en: 'How are you doing?', pt: 'Como vai você?' },
  { id: 2, en: 'What time is it?', pt: 'Que horas são?' },
  { id: 3, en: 'Can you help me?', pt: 'Você pode me ajudar?' },
  { id: 4, en: 'I do not understand.', pt: 'Eu não entendo.' },
  { id: 5, en: 'Where is the bathroom?', pt: 'Onde fica o banheiro?' },
  { id: 6, en: 'How much does this cost?', pt: 'Quanto custa isso?' },
  { id: 7, en: 'I am learning English.', pt: 'Eu estou aprendendo inglês.' },
  { id: 8, en: 'Could you speak slower, please?', pt: 'Você poderia falar mais devagar, por favor?' },
  { id: 9, en: 'Nice to meet you.', pt: 'Prazer em conhecê-lo.' },
  { id: 10, en: 'See you tomorrow.', pt: 'Até amanhã.' },
  { id: 11, en: 'Have a good day!', pt: 'Tenha um bom dia!' },
  { id: 12, en: 'What do you do for a living?', pt: 'Com o que você trabalha?' },
  { id: 13, en: 'I am hungry.', pt: 'Estou com fome.' },
  { id: 14, en: 'Where are you from?', pt: 'De onde você é?' },
  { id: 15, en: 'It is a beautiful day.', pt: 'É um dia lindo.' },

  { id: 16, en: 'A few.', pt: 'Alguns.', pron: 'a fiu' },
  { id: 17, en: 'A little.', pt: 'Um pouco.', pron: 'a lirou' },
  { id: 18, en: 'A long time ago.', pt: 'Há muito tempo.', pron: 'a lon taime agou' },
  { id: 19, en: 'A one way ticket.', pt: 'Uma passagem só de ida.', pron: 'a uon uei tiket' },
  { id: 20, en: 'A round trip ticket.', pt: 'Uma passagem ida e volta.', pron: 'a ur-aund turr-ip tiket' },
  { id: 21, en: 'About 300 kilometers.', pt: 'Aproximadamente 300 quilômetros.', pron: 'abaut 300 ki-lômeres' },
  { id: 22, en: 'Across from the post office.', pt: 'Do outro lado do correio.', pron: 'acrós from tha post ófice' },
  { id: 23, en: 'All day.', pt: 'O dia todo.', pron: 'óóu dei' },
  { id: 24, en: 'Am I pronouncing it correctly?', pt: 'Eu estou pronunciando corretamente?', pron: 'em ai pronaucim it cor-urékit?' },
  { id: 25, en: 'Amy is John’s girlfriend.', pt: 'Amy é a namorada do John.', pron: 'êmi is djóm gérlfriend' },
  { id: 26, en: 'And you?', pt: 'E você?', pron: 'end iuu?' },
  { id: 27, en: 'Anything else?', pt: 'Mais alguma coisa?', pron: 'éni-thin élse?' },
  { id: 28, en: 'Are there any concerts?', pt: 'Tem algum show?', pron: 'ár der éni kóncerts?' },
  { id: 29, en: 'Are they coming this evening?', pt: 'Eles estão vindo esta noite?', pron: 'ár deii camim dis ivinin?' },
  { id: 30, en: 'Are they the same?', pt: 'Eles são iguais? / São as mesmas coisas?', pron: 'ár deii tha sêimi?' },
  { id: 31, en: 'Are you afraid?', pt: 'Você está com medo?', pron: 'ár iuu afreid?' },
  { id: 32, en: 'Are you allergic to anything?', pt: 'Você tem alergia a alguma coisa?', pron: 'ár iuu alorjéc tchu éni-thin?' },
  { id: 33, en: 'Are you American?', pt: 'Você é americano?', pron: 'ár iuu amér-ur-ikén?' },
  { id: 34, en: 'Are you busy?', pt: 'Você está ocupado?', pron: 'ár iuu bizi?' },
  { id: 35, en: 'Are you comfortable?', pt: 'Você está confortável?', pron: 'ár iuu comfortebou?' },
  { id: 36, en: 'Are you coming this evening?', pt: 'Você vem esta noite?', pron: 'ár iuu camim dis ivinin?' },

  { id: 37, en: 'Be careful.', pt: 'Cuidado.' },
  { id: 38, en: 'Be careful driving.', pt: 'Cuidado ao dirigir.' },
  { id: 39, en: 'Can you translate this for me?', pt: 'Você pode me traduzir isso?' },
  { id: 40, en: 'Chicago is very different from Boston.', pt: 'Chicago é bem diferente de Boston.' },
  { id: 41, en: 'Don’t worry.', pt: 'Não se preocupe.' },
  { id: 42, en: 'Everyone knows it.', pt: 'Todo mundo sabe isso.' },
  { id: 43, en: 'Everything is ready.', pt: 'Está tudo pronto.' },
  { id: 44, en: 'Excellent.', pt: 'Excelente.' },
  { id: 45, en: 'From time to time.', pt: 'De tempos em tempos.' },
  { id: 46, en: 'Good idea.', pt: 'Boa ideia.' },

  { id: 47, en: 'When is the next bus to Philadelphia?', pt: 'Quando é o próximo ônibus para a Filadélfia?' },
  { id: 48, en: 'When is your birthday?', pt: 'Quando é o teu aniversário?' },
  { id: 49, en: "When I went to the store, they didn't have any apples.", pt: 'Quando eu fui à loja ele não tinham nenhuma maçã.' },
  { id: 50, en: 'When was the last time you talked to your mother?', pt: 'Quando foi a última vez que você falou com tua mãe?' },
  { id: 51, en: 'When will he be back?', pt: 'Quando ele volta?' },
  { id: 52, en: 'When will it be ready?', pt: 'Quando ficará pronto?' },
  { id: 53, en: 'Where are you going to go?', pt: 'Onde você está indo?' },

  { id: 54, en: 'Can we have some more bread please?', pt: 'Posso ter um pouco de pão por favor?' },
  { id: 55, en: 'Do you have any money?', pt: 'Você tem dinheiro?' },
  { id: 56, en: 'For how many nights?', pt: 'Por quantas noites?' },
  { id: 57, en: 'How long will you be staying?', pt: 'Quanto tempo você vai ficar?' },
  { id: 58, en: "I'd like a map of the city.", pt: 'Eu queria um mapa da cidade.' },
  { id: 59, en: "I'd like a non-smoking room.", pt: 'Eu queria um quarto de não fumante.' },
  { id: 60, en: "I'd like a room.", pt: 'Eu queria um quarto.' },
  { id: 61, en: "I'd like a room with two beds please.", pt: 'Eu queria um quarto com duas camas por favor.' },

  { id: 62, en: 'I need a doctor.', pt: 'Eu preciso de um médico.' },
  { id: 63, en: 'Is there a nightclub in town?', pt: 'Tem uma casa noturna/danceteria na cidade?' },
  { id: 64, en: 'Is there a restaurant in the hotel?', pt: 'Tem restaurante no hotel?' },
  { id: 65, en: 'Is there a store near here?', pt: 'Tem uma loja por aqui?' },
  { id: 66, en: "Sorry, we don't have any vacancies.", pt: 'Desculpe, nós não temos vagas.' },
  { id: 67, en: 'Take me to the Marriott Hotel.', pt: 'Leve-me para o Hotel Marriott' },
  { id: 68, en: "What's the charge per night?", pt: 'Qual é a diária? (hotel)' },
  { id: 69, en: 'What time is check out?', pt: 'A que horas é a saída do hotel?' },
  { id: 70, en: 'Where is the airport?', pt: 'Onde fica o aerporto?' },
  { id: 71, en: "Where's the mail box?", pt: 'Onde tem uma caixa de correio?' },

  { id: 72, en: 'Are you here alone?', pt: 'Você vai sozinho?' },
  { id: 73, en: 'Can I bring my friend?', pt: 'Posso trazer meu amigo/minha amiga?' },
  { id: 74, en: 'Can I have a receipt please?', pt: 'Posso ter o recibo por favor?' },
  { id: 75, en: 'Can it be cheaper?', pt: 'Posso ter um desconto?' },
  { id: 76, en: 'Can we have a menu please.', pt: 'Você pode nos trazer o carápio por favor?' },
  { id: 77, en: 'Can you hold this for me?', pt: 'Você pode segurar isso para mim?' },
  { id: 78, en: 'Do you have any children?', pt: 'Você tem filhos?' },
  { id: 79, en: 'Do you know how much it costs?', pt: 'Você sabe quanto custa?' },
  { id: 80, en: 'Have you eaten at that restaurant?', pt: 'Você já comeu num restaurante?' },
  { id: 81, en: 'Have you eaten yet?', pt: 'Você já comeu?' },
  { id: 82, en: 'Have you ever had potato soup?', pt: 'Você já comeu sopa de batata?' },
  { id: 83, en: "He likes juice but he doesn't like milk.", pt: 'Ele gosta de suco mas não gosta de leite.' },
  { id: 84, en: 'Here is your salad.', pt: 'Aqui está sua salada' },
  { id: 85, en: "Here's your order.", pt: 'Aqui está o seu pedido' },
  { id: 86, en: 'How does it taste?', pt: 'Como está o sabor?' },
  { id: 87, en: 'How many people?', pt: 'Para quantas pessoas? (restaurante)' },
  { id: 88, en: 'I agree.', pt: 'Eu concordo.' },
  { id: 89, en: "I'd like a table near the window.", pt: 'Eu queria uma mesa perto da janela.' },
  { id: 90, en: "I'd like to call the United States.", pt: 'Eu gostaria de ligar para os Estados Unidos.' },

  { id: 91, en: "I haven't been there.", pt: 'Eu nunca estive lá' },
  { id: 92, en: "I haven't finished eating.", pt: 'Eu não acabei de comer.' },
  { id: 93, en: 'I like it.', pt: 'Eu gosto.' },
  { id: 94, en: "I'll give you a call.", pt: 'Eu te dou uma ligada.' },
  { id: 95, en: "I'll have a cup of tea please.", pt: 'Eu quero uma xícara de chá por favor.' },
  { id: 96, en: "I'll have a glass of water please.", pt: 'Eu quero um copo com água por favor.' },
  { id: 97, en: "I'm from America.", pt: 'Eu sou dos Estados Unidos.' },
  { id: 98, en: "I'm going to bed.", pt: 'Eu estou indo para a cama.' },
  { id: 99, en: "I'm here on business.", pt: 'Estou aqui a negócios.' },
  { id: 100, en: "I'm sorry.", pt: 'Lamento/Sinto muito.' },

  { id: 101, en: 'I only have 5 dollars.', pt: 'Eu tenho somente 5 dólares.' },
  { id: 102, en: 'I think I need to see a doctor.', pt: 'Eu acho que eu preciso ir ao médico.' },
  { id: 103, en: "It's August 25th.", pt: 'Hoje é 25 de agosto.' },
  { id: 104, en: 'I understand.', pt: 'Eu entendo.' },
  { id: 105, en: 'June 3rd.', pt: '3 de junho.' },
  { id: 106, en: 'The food was delicious.', pt: 'A comida estava deliciosa.' },
  { id: 107, en: 'There are some apples in the refrigerator.', pt: 'Tem algumas maçãs na geladeira.' },
  { id: 108, en: "There's a restaurant near here.", pt: 'Tem um restaurante aqui perto.' },
  { id: 109, en: "There's a restaurant over there, but I don't think it's very good.", pt: 'Tem um restaurante alí mas eu não acho que seja muito bom.' },
  { id: 110, en: 'Waiter!', pt: 'Garçon!' },
  { id: 111, en: 'Waitress!', pt: 'Garçonete!' },
  { id: 112, en: 'We can eat Italian or Chinese food.', pt: 'Nós podemos comer comida italiana ou chinesa.' },
  { id: 113, en: "We'll have two glasses of water please.", pt: 'Nós queremos dois copos com água por favor.' },
  { id: 114, en: 'What are you going to have?', pt: 'O que você vai quere?' },
  { id: 115, en: 'What do you recommend?', pt: 'O que você recomenda?' },
  { id: 116, en: "What's your email address?", pt: 'Qual é o teu endereço eletrônico? (email)' },
  { id: 117, en: 'What would you like to drink?', pt: 'O que você gostaria de beber?' },
  { id: 118, en: 'What would you like to eat?', pt: 'O que você gostaria de comer?' },
  { id: 119, en: 'Where is an ATM?', pt: 'Onde tem um caixa eletrônico?' },
  { id: 120, en: 'Where is there a doctor who speaks English?', pt: 'Onde tem um médico que fale inglês?' },
  { id: 121, en: 'Which one?', pt: 'Qual deles?' },
  { id: 122, en: 'Would you ask him to come here?', pt: 'Você pede a ele para vir aqui?' },
  { id: 123, en: 'Would you like a glass of water?', pt: 'Você gostaria de um copo com água?' },
  { id: 124, en: 'Would you like coffee or tea?', pt: 'Você gostaria de café ou chá?' },
  { id: 125, en: 'Would you like something to drink?', pt: 'Você gostaria de algo para beber?' },
  { id: 126, en: 'Would you like some water?', pt: 'Você gostaria de um pouco de água?' },
  { id: 127, en: 'Would you like some wine?', pt: 'Você gostaria de um pouco de vinho?' },
  { id: 128, en: 'Would you like to go for a walk?', pt: 'Você gostaria de fazer um passeio?' },
  { id: 129, en: 'Would you like to watch TV?', pt: 'Você gostaria de assistir TV?' },

  { id: 130, en: 'Are you free tonight?', pt: 'Você está livre hoje à noite?' },
  { id: 131, en: 'Are you going to take a plane or train?', pt: 'Você vai pegar um avião ou um trem?' },
  { id: 132, en: 'Are you hungry?', pt: 'Você está com fome?' },
  { id: 133, en: 'Are you sure?', pt: 'Você tem certeza?' },
  { id: 134, en: 'Are you working tomorrow?', pt: 'Você vai trabalhar amanhã?' },
  { id: 135, en: 'Business is good.', pt: 'O negócio é bom' },
  { id: 136, en: 'Cheers!', pt: 'Saúde!' },

  { id: 137, en: 'Did it snow yesterday?', pt: 'Nevou ontem?' },
  { id: 138, en: 'Did you get my email?', pt: 'Você recebeu meu email?' },
  { id: 139, en: 'Did you take your medicine?', pt: 'Você tomou seu remédio?' },
  { id: 140, en: 'Do you feel better?', pt: 'Você está melhor?' },
  { id: 141, en: 'Do you go to Florida often?', pt: 'Você vai frequentemente para a Flórida?' },
  { id: 142, en: 'Do you have another one?', pt: 'Você tem um outro?' },
  { id: 143, en: "Do you know where there's a store that sells towels?", pt: 'Você sabe onde tem uma loja que vende toalhas?' },
  { id: 144, en: 'Do you like it here?', pt: 'Você gosta daqui?' },
  { id: 145, en: 'Do you like the book?', pt: 'Você gosta deste livro?' },
  { id: 146, en: 'Do you need anything?', pt: 'Você precisa de alguma coisa?' },
  { id: 147, en: 'Do you play any sports?', pt: 'Você pratica algum esporte?' },
  { id: 148, en: 'Do you sell medicine?', pt: 'Você vende remédios? (store)' },
  { id: 149, en: 'Do you study English?', pt: 'Você estuda inglês?' },
  { id: 150, en: 'Do you want to come with me?', pt: 'Você quer vir comigo?' },
  { id: 151, en: 'Do you want to go with me?', pt: 'Você quer ir comigo?' },
  { id: 152, en: 'Excuse me.', pt: 'Com licença.' },
  { id: 153, en: 'Give me a call.', pt: 'Me telefona' },
  { id: 154, en: 'Has your brother been to California?', pt: 'O teu irmão já foi à Califórnia?' },
  { id: 155, en: 'Have they met her yet?', pt: 'Você já a encontrou?' },
  { id: 156, en: 'Have you done this before?', pt: 'Você já fez isso antes?' }
];

const CONVERSAS = [
  {
    id: 1,
    title: 'Leaving for work',
    sub: 'Saindo para o trabalho',
    dialogue: [
      { speaker: 'John', en: 'I am leaving for work now.', pt: 'Estou saindo para o trabalho agora.' },
      { speaker: 'Mary', en: 'Have a good day! Do not forget your keys.', pt: 'Tenha um bom dia! Não esqueça suas chaves.' },
      { speaker: 'John', en: 'I have them. See you tonight.', pt: 'Eu estou com elas. Até hoje à noite.' },
      { speaker: 'Mary', en: 'See you! Drive safely.', pt: 'Até mais! Dirija com cuidado.' }
    ]
  },
  {
    id: 2,
    title: 'Shopping at the supermarket',
    sub: 'Compras no supermercado',
    dialogue: [
      { speaker: 'Alex', en: 'Do we need milk?', pt: 'Nós precisamos de leite?' },
      { speaker: 'Sarah', en: 'Yes, and get some eggs too.', pt: 'Sim, e pegue alguns ovos também.' },
      { speaker: 'Alex', en: 'Alright, anything else?', pt: 'Certo, mais alguma coisa?' },
      { speaker: 'Sarah', en: 'Just some apples and bread. That is all.', pt: 'Apenas algumas maçãs e pão. É só isso.' }
    ]
  },
  {
    id: 3,
    title: 'Where are you from?',
    sub: 'De onde você é?',
    dialogue: [
      { speaker: 'Paul', en: 'Hi, I am Paul. What is your name?', pt: 'Oi, eu sou Paul. Qual é o seu nome?' },
      { speaker: 'Anna', en: 'Nice to meet you, Paul. I am Anna.', pt: 'Prazer em conhecê-lo, Paul. Eu sou Anna.' },
      { speaker: 'Paul', en: 'Where are you from, Anna?', pt: 'De onde você é, Anna?' },
      { speaker: 'Anna', en: 'I am from Brazil. And you?', pt: 'Eu sou do Brasil. E você?' },
      { speaker: 'Paul', en: 'I am from Canada.', pt: 'Eu sou do Canadá.' }
    ]
  },
  {
    id: 4,
    title: 'At the Restaurant',
    sub: 'No Restaurante',
    dialogue: [
      { speaker: 'Waiter', en: 'Are you ready to order?', pt: 'Vocês estão prontos para fazer o pedido?' },
      { speaker: 'Customer', en: 'Yes, I will have the chicken salad.', pt: 'Sim, eu vou querer a salada de frango.' },
      { speaker: 'Waiter', en: 'Would you like anything to drink?', pt: 'Gostaria de algo para beber?' },
      { speaker: 'Customer', en: 'Just water, please.', pt: 'Apenas água, por favor.' }
    ]
  },
  {
    id: 5,
    title: 'Who will you vote for?',
    sub: 'Em quem você vai votar?',
    dialogue: [
      { speaker: 'A', en: 'Hey, Jackson! Who will you vote for?', pt: 'Ei, Jackson! Em quem você vai votar?' },
      { speaker: 'B', en: 'Well. To be honest, I don’t know. Things are looking bad.', pt: 'Bem. Para ser honesto, eu não sei. As coisas parecem ruins.' },
      { speaker: 'A', en: 'I’ll vote for Mr. Smith.', pt: 'Eu vou votar no Smith.' },
      { speaker: 'B', en: 'Do you think he will solve our problems?', pt: 'Você acha que ele vai resolver nossos problemas?' },
      { speaker: 'A', en: 'Oh, I heard that he will give us many benefits.', pt: 'Ah, eu ouvi que ele nos dará muitos benefícios.' },
      { speaker: 'B', en: 'Really? What’s benefits?', pt: 'Sério? Quais são os benefícios?' },
      { speaker: 'A', en: 'He will improve security and education.', pt: 'Ele vai melhorar a segurança e educação.' },
      { speaker: 'B', en: 'That’s sounds great!', pt: 'Isso parece ótimo!' },
      { speaker: 'A', en: 'Yeah, it is. Why don’t you vote for him?', pt: 'Sim, é. Por que você não vota nele?' },
      { speaker: 'B', en: 'I’ll do that! Thank you.', pt: 'Eu vou fazer isso! Obrigado.' }
    ]
  },
  {
    id: 6,
    title: 'Something light',
    sub: 'Algo leve',
    dialogue: [
      { speaker: 'A', en: 'Good evening, sir! What would you like to eat?', pt: 'Boa noite, senhor! O que você gostaria de comer?' },
      { speaker: 'B', en: 'I’d like to eat something light.', pt: 'Eu gostaria de comer algo leve.' },
      { speaker: 'A', en: 'A salad for example?', pt: 'Uma salada, por exemplo?' },
      { speaker: 'B', en: 'Yes. What type of salad do you have?', pt: 'Sim. Que tipo de salada você tem?' },
      { speaker: 'A', en: 'We have Salad Express, green salad and special salad.', pt: 'Nós temos salada express, salada verde e salada especial.' },
      { speaker: 'B', en: 'What’s special salad?', pt: 'O que é salada especial?' },
      { speaker: 'A', en: 'It includes vegetables and wine.', pt: 'Inclui legumes e vinho.' },
      { speaker: 'B', en: 'I’d like one.', pt: 'Eu gostaria de uma.' },
      { speaker: 'A', en: 'A moment, please.', pt: 'Um momento, por favor.' },
      { speaker: 'B', en: 'Thanks!', pt: 'Obrigado!' }
    ]
  }
];

const LEVELS = [
  'Curioso','Iniciante','Aprendiz','Explorador',
  'Praticante','Fluente','Avançado','Expert','Mestre','Lendário'
];

/* ---- HELPERS ---- */

function range(n, fn) { return Array.from({ length: n }, (_, i) => fn(i + 1)); }
function z(n) { return String(n).padStart(2, '0'); }
function $(id) { return document.getElementById(id); }
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

function encodePath(p) { return p.split('/').map(encodeURIComponent).join('/'); }

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
}

/* ---- PROGRESS / STORAGE ---- */

let prog = load();

function load() {
  try { return JSON.parse(localStorage.getItem('nga2') || '{}'); }
  catch { return {}; }
}

function save() { localStorage.setItem('nga2', JSON.stringify(prog)); }

function isDone(pk, id) { return (prog[pk]?.done || []).includes(id); }

function toggleDone(pk, id) {
  if (!prog[pk]) prog[pk] = { done: [] };
  const arr = prog[pk].done;
  const i = arr.indexOf(id);
  if (i === -1) arr.push(id);
  else arr.splice(i, 1);
  save();
  updateStreak();
}

function countDone(pk) { return (prog[pk]?.done || []).length; }

function assimilDone() { return countDone('assimil'); }
function pimsleurDone() { return countDone('pimsleur') + countDone('pimsleur_r'); }
function textosDone() { return countDone('textos'); }
function frasesDone() { return countDone('frases'); }
function conversasDone() { return countDone('conversas'); }
function totalDone() { return assimilDone() + pimsleurDone() + textosDone() + frasesDone() + conversasDone(); }

function xp() { return totalDone() * 10; }
function level() { return Math.min(Math.floor(xp() / 100), LEVELS.length - 1); }
function levelName() { return LEVELS[level()]; }
function xpInLevel() { return xp() % 100; }

/* ---- STREAK ---- */

function updateStreak() {
  const today = new Date().toDateString();
  if (!prog.streak) prog.streak = { count: 0, last: null };
  if (prog.streak.last === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (prog.streak.last === yesterday) {
    prog.streak.count++;
  } else {
    prog.streak.count = 1;
  }
  prog.streak.last = today;
  save();
}

function streak() { return prog.streak?.count || 0; }

/* ---- UNLOCKED ACHIEVEMENTS ---- */

function getStats() {
  return { totalDone: totalDone(), assimilDone: assimilDone(), pimsleurDone: pimsleurDone(), streak: streak() };
}

function isUnlocked(ach) { return ach.cond(getStats()); }

/* ---- AUDIO ENGINE ---- */

const audio = $('audioEl');
let nowPK    = null;
let nowId    = null;
let playlist = [];
let playIdx  = -1;

function playLesson(lesson, pl, idx, pk, icon, cname) {
  nowPK = pk; nowId = lesson.id;
  playlist = pl; playIdx = idx;

  audio.src = encodePath(lesson.audio);
  audio.playbackRate = parseFloat($('speedSelect').value);
  audio.play().catch(() => {});

  $('playerTitle').textContent  = lesson.title;
  $('playerCourse').textContent = cname;
  $('playerIcon').textContent   = icon;
  $('playBtn').textContent      = '⏸';

  highlightDot();
}

function highlightDot() {
  qsa('.lesson-dot').forEach(el => el.classList.remove('playing'));
  if (!nowId || !nowPK) return;
  const el = qs(`.lesson-dot[data-id="${nowId}"][data-pk="${nowPK}"]`);
  if (el) el.classList.add('playing');
}

audio.addEventListener('timeupdate', () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  $('playerBarFill').style.width = pct + '%';
  $('currentTime').textContent = fmt(audio.currentTime);
  $('totalTime').textContent   = fmt(audio.duration);
});

audio.addEventListener('ended', () => {
  if (playIdx < playlist.length - 1) {
    const nxt = playlist[playIdx + 1];
    playLesson(nxt, playlist, playIdx + 1, nowPK, $('playerIcon').textContent, $('playerCourse').textContent);
  } else {
    $('playBtn').textContent = '▶';
  }
});

audio.addEventListener('pause', () => { $('playBtn').textContent = '▶'; });
audio.addEventListener('play',  () => { $('playBtn').textContent = '⏸'; });

$('playBtn').addEventListener('click', () => {
  if (!audio.src) return;
  audio.paused ? audio.play() : audio.pause();
});

$('prevBtn').addEventListener('click', () => {
  if (playIdx > 0) {
    const p = playlist[playIdx - 1];
    playLesson(p, playlist, playIdx - 1, nowPK, $('playerIcon').textContent, $('playerCourse').textContent);
  } else { audio.currentTime = 0; }
});

$('nextBtn').addEventListener('click', () => {
  if (playIdx < playlist.length - 1) {
    const n = playlist[playIdx + 1];
    playLesson(n, playlist, playIdx + 1, nowPK, $('playerIcon').textContent, $('playerCourse').textContent);
  }
});

$('playerBar').addEventListener('click', e => {
  if (!audio.duration) return;
  const r = e.currentTarget.getBoundingClientRect();
  audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});

$('speedSelect').addEventListener('change', e => { audio.playbackRate = parseFloat(e.target.value); });
$('volSlider').addEventListener('input',    e => { audio.volume = parseFloat(e.target.value); });

/* ---- XP POP ---- */

function showXPPop() {
  const el = $('xpPop');
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 900);
}

/* ---- SIDEBAR PROFILE ---- */

function renderSidebarProfile() {
  const lv  = level();
  const xpN = xpInLevel();
  const done = totalDone();
  $('sidebarProfile').innerHTML = `
    <div class="sp-row">
      <div class="sp-avatar">
        N
        <div class="sp-lvl">${lv + 1}</div>
      </div>
      <div>
        <div class="sp-name">${levelName()}</div>
        <div class="sp-title">${done} lições · ${streak()}🔥</div>
      </div>
    </div>
    <div class="sp-xp-bar-wrap">
      <div class="sp-xp-bar" style="width:${xpN}%"></div>
    </div>
    <div class="sp-xp-text">${xp()} XP · Nível ${lv + 1}</div>
  `;
}

/* ---- ROUTING ---- */

let currentPage = 'home';

function nav(page) {
  currentPage = page;
  qsa('.nav-item[data-page]').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  const mc = $('mainContent');
  switch (page) {
    case 'home':       mc.innerHTML = renderHome(); break;
    case 'assimil':    mc.innerHTML = renderCourse('assimil', 'lessons'); break;
    case 'pimsleur':   mc.innerHTML = renderCourse('pimsleur', 'lessons'); break;
    case 'textos':     mc.innerHTML = renderTextos(); break;
    case 'frases':     mc.innerHTML = renderFlashcards(); setupFlashcards(); break;
    case 'conversas':  mc.innerHTML = renderConversas(); break;
    case 'conquistas': mc.innerHTML = renderConquistas(); break;
    default:           mc.innerHTML = renderHome();
  }
  renderSidebarProfile();
  highlightDot();
  if (window.innerWidth <= 800) $('sidebar').classList.remove('open');
}

/* ---- RENDER: HOME ---- */

function renderHome() {
  const done   = totalDone();
  const lv     = level();
  const xpN    = xpInLevel();
  const str    = streak();
  const unlocked = ACHIEVEMENTS.filter(isUnlocked).length;

  const lastPlayed = nowId ? `Continuar — ${$('playerTitle')?.textContent || ''}` : 'Começar agora';

  return `
  <div class="page">
    <div class="home-hero">
      <div class="hero-top">
        <div class="hero-avatar">
          🧑
          <div class="hero-level-badge">${lv + 1}</div>
        </div>
        <div class="hero-info">
          <h1>${levelName()}</h1>
          <div class="hero-subtitle">Nível ${lv + 1} — ${done} lições concluídas</div>
        </div>
      </div>

      <div class="hero-xp-wrap">
        <div class="hero-xp-label">
          <span>XP: ${xp()}</span>
          <span>${xpN}/100 para o próximo nível</span>
        </div>
        <div class="hero-xp-bar-outer">
          <div class="hero-xp-bar-inner" style="width:${xpN}%"></div>
        </div>
      </div>

      <div class="hero-chips">
        <span class="chip fire">🔥 ${str} dia${str !== 1 ? 's' : ''} de streak</span>
        <span class="chip xp">⚡ ${xp()} XP total</span>
        <span class="chip gold">🏆 ${unlocked} / ${ACHIEVEMENTS.length} conquistas</span>
      </div>

      <button class="continue-btn" data-nav="${nowId ? currentPage : 'assimil'}">
        ▶ ${lastPlayed}
      </button>
    </div>

    <div class="home-body">
      <div class="section-hd">🌍 Mundos</div>
      <div class="worlds-grid">
        ${worldCard('assimil')}
        ${worldCard('pimsleur')}
      </div>

      <div class="section-hd">🏆 Conquistas recentes</div>
      <div class="ach-row">
        ${ACHIEVEMENTS.map(a => `
          <div class="ach-mini ${isUnlocked(a) ? 'unlocked' : 'locked'}">
            <span class="ach-mini-icon">${a.icon}</span>
            <span class="ach-mini-name">${a.name}</span>
          </div>`).join('')}
        <div class="ach-mini" data-nav="conquistas" style="cursor:pointer;min-width:80px;justify-content:center;gap:4px">
          <span class="ach-mini-icon">→</span>
          <span class="ach-mini-name">Ver todas</span>
        </div>
      </div>
    </div>
  </div>`;
}

function worldCard(cid) {
  const c    = COURSES[cid];
  const done = cid === 'assimil' ? assimilDone() : pimsleurDone();
  const pct  = Math.round((done / c.total) * 100);
  const stars = done === 0 ? '☆☆☆' : done < c.total / 3 ? '★☆☆' : done < (c.total * 2 / 3) ? '★★☆' : '★★★';
  return `
    <div class="world-card ${c.cls}" data-nav="${cid}" style="--wc:${c.wc}">
      <div class="world-stars">${stars}</div>
      <span class="world-emoji">${c.icon}</span>
      <div class="world-name">${c.name}</div>
      <div class="world-sub">${c.desc}</div>
      <div class="world-prog-bar">
        <div class="world-prog-fill" style="width:${pct}%"></div>
      </div>
      <div class="world-prog-text">${done} / ${c.total} lições · ${pct}%</div>
    </div>`;
}

/* ---- RENDER: COURSE ---- */

let courseTab = 'lessons';

function renderCourse(cid, tab) {
  if (tab) courseTab = tab;
  const c    = COURSES[cid];
  const done = cid === 'assimil' ? assimilDone() : pimsleurDone();
  const pct  = Math.round((done / c.total) * 100);

  const hasTabs = cid === 'pimsleur';
  const tabs = hasTabs ? ['lessons','readings'] : ['lessons'];
  const tabNames = { lessons: `Lições (${c.lessons.length})`, readings: `Leituras (${c.readings?.length || 0})` };

  return `
  <div class="page">
    <div class="course-hero">
      <div class="course-hero-top">
        <div class="course-big-icon">${c.icon}</div>
        <div>
          <h1>${c.full}</h1>
          <p>${c.desc}</p>
          <div class="course-chips">
            <span class="c-chip">✅ ${done} feitas</span>
            <span class="c-chip">🎯 ${pct}% completo</span>
            <span class="c-chip">⚡ ${done * 10} XP ganho</span>
          </div>
        </div>
      </div>
    </div>

    ${hasTabs ? `
    <div class="tabs">
      ${tabs.map(t => `
        <button class="tab-btn ${courseTab === t ? 'active' : ''}" data-tab="${t}" data-cid="${cid}">
          ${tabNames[t]}
        </button>`).join('')}
    </div>` : ''}

    <div class="lesson-grid-area" id="lessonArea">
      ${courseTab === 'readings' && cid === 'pimsleur'
        ? lessonGrid(c.readings, 'pimsleur_r', c.icon, 'PIMSLEUR Leituras')
        : lessonGrid(c.lessons, c.pk, c.icon, c.name)}
    </div>
  </div>`;
}

function lessonGrid(lessons, pk, icon, cname) {
  const chapters = [];
  for (let i = 0; i < lessons.length; i += 10) {
    chapters.push(lessons.slice(i, i + 10));
  }

  return chapters.map((ch, ci) => {
    const chStart = ci * 10 + 1;
    const chEnd   = Math.min(chStart + ch.length - 1, lessons.length);
    const chDone  = ch.filter(l => isDone(pk, l.id)).length;

    return `
      <div class="chapter-block">
        <div class="chapter-title">Capítulo ${ci + 1} &nbsp;·&nbsp; Lições ${chStart}–${chEnd} &nbsp;·&nbsp; ${chDone}/${ch.length}</div>
        <div class="lesson-grid">
          ${ch.map(l => {
            const done    = isDone(pk, l.id);
            const playing = nowId === l.id && nowPK === pk;
            const cls     = playing ? 'playing' : done ? 'done' : 'idle';
            return `
              <div class="lesson-dot ${cls}" data-id="${l.id}" data-pk="${pk}"
                   data-audio="${l.audio}" data-icon="${icon}" data-cname="${cname}"
                   title="${l.title}">
                ${playing ? '♫' : l.id}
              </div>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');
}

/* ---- RENDER: CONQUISTAS ---- */

function renderConquistas() {
  const stats = getStats();
  return `
  <div class="page">
    <div class="page-hd">
      <h1>🏆 Conquistas</h1>
      <p>${ACHIEVEMENTS.filter(isUnlocked).length} de ${ACHIEVEMENTS.length} desbloqueadas</p>
    </div>
    <div class="ach-page">
      <div class="ach-grid">
        ${ACHIEVEMENTS.map(a => {
          const ok = isUnlocked(a);
          return `
            <div class="ach-card ${ok ? 'unlocked' : 'locked'}">
              ${ok ? '<div class="ach-badge">✓</div>' : ''}
              <span class="ach-icon">${a.icon}</span>
              <div class="ach-name">${a.name}</div>
              <div class="ach-desc">${a.desc}</div>
            </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

/* ---- RENDER: TEXTOS ---- */

function renderTextos() {
  return `
  <div class="page">
    <div class="page-hd">
      <h1>📖 Textos</h1>
      <p>Pratique leitura com textos do iniciante ao avançado.</p>
    </div>
    <div class="textos-grid">
      ${TEXTOS.map(t => {
        const read = isDone('textos', t.id);
        return `
          <div class="texto-card ${read ? 'read' : ''}" data-tid="${t.id}">
            <div class="texto-level ${t.level}">${t.level}</div>
            <div class="texto-title">${t.title}</div>
            <div class="texto-preview">${t.preview}</div>
          </div>
        `;
      }).join('')}
    </div>
  </div>`;
}

/* ---- RENDER: CONVERSAS ---- */

function renderConversas() {
  return `
  <div class="page">
    <div class="page-hd">
      <h1>🗣️ Conversas</h1>
      <p>Diálogos do dia a dia para praticar o inglês falado.</p>
    </div>
    <div class="conversas-list">
      ${CONVERSAS.map(c => {
        const done = isDone('conversas', c.id);
        return `
          <div class="conversa-card ${done ? 'done' : ''}" data-cid="${c.id}">
            <div class="conversa-num">${c.id}</div>
            <div style="flex:1">
              <div class="conversa-title">${c.title}</div>
              <div class="conversa-sub">${c.sub}</div>
            </div>
            ${done ? '<div class="conversa-done">✓ Concluído</div>' : ''}
          </div>
        `;
      }).join('')}
    </div>
  </div>`;
}

/* ---- FLASHCARDS LOGIC ---- */

let fcIndex = 0;
let fcCurrent = null;

function renderFlashcards() {
  return `
  <div class="page">
    <div class="page-hd">
      <h1>⚡ Flashcards</h1>
      <p>Treine frases e expressões comuns em inglês.</p>
    </div>
    <div class="fc-arena" id="fcArena"></div>
  </div>`;
}

function setupFlashcards() {
  fcIndex = 0;
  nextFlashcard();
}

function nextFlashcard() {
  if (fcIndex >= FRASES.length) fcIndex = 0;
  fcCurrent = FRASES[fcIndex];
  
  const total = FRASES.length;
  const pct = ((fcIndex) / total) * 100;

  $('fcArena').innerHTML = `
    <div class="fc-progress">
      <div class="fc-count">${fcIndex + 1} / ${total}</div>
      <div class="fc-pb-wrap"><div class="fc-pb" style="width:${pct}%"></div></div>
    </div>
    <div class="flashcard-wrap" id="fcCard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="fc-face fc-front">
          <div class="fc-label">FRENTE (INGLÊS)</div>
          <div class="fc-phrase">${fcCurrent.en}</div>
          ${fcCurrent.pron ? `<div class="fc-pron">${fcCurrent.pron}</div>` : ''}
          <div class="fc-hint">Clique no card para revelar a tradução</div>
        </div>
        <div class="fc-face fc-back">
          <div class="fc-label">VERSO (PORTUGUÊS)</div>
          <div class="fc-phrase">${fcCurrent.pt}</div>
          <div class="fc-hint">Clique para voltar</div>
        </div>
      </div>
    </div>
    <div class="fc-actions">
      <button class="btn btn-primary" style="padding:12px 24px; font-size:14px" onclick="goNextFC()">Próximo ➔</button>
    </div>
  `;
}

window.goNextFC = function() {
  if (!isDone('frases', fcCurrent.id)) {
    toggleDone('frases', fcCurrent.id);
  }
  fcIndex++;
  if (fcIndex >= FRASES.length) {
    $('fcArena').innerHTML = `
      <div class="fc-done">
        <div class="fc-done-icon">🎉</div>
        <h2>Parabéns!</h2>
        <p>Você revisou todos os flashcards disponíveis hoje.</p>
        <button class="btn btn-primary" onclick="setupFlashcards()">Recomeçar</button>
      </div>`;
    showXPPop();
  } else {
    nextFlashcard();
  }
}

/* ---- MODALS ---- */

function openModalTexto(id) {
  const t = TEXTOS.find(x => x.id === id);
  if (!t) return;
  $('modal').innerHTML = `
    <div class="modal-header">
      <div class="modal-title">${t.title}</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-text">
        ${t.content.map(p => `
          <p style="margin-bottom:16px;">
            <strong style="color:var(--text);font-size:15px">${p.en}</strong><br>
            <span style="color:var(--text2);font-size:13px">${p.pt}</span>
          </p>
        `).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" onclick="markDoneAndClose('textos', ${t.id})" style="width:100%">✓ Marcar como Lido</button>
    </div>
  `;
  $('overlay').classList.add('show');
  $('modal').classList.add('show');
}

function openModalConversa(id) {
  const c = CONVERSAS.find(x => x.id === id);
  if (!c) return;
  $('modal').innerHTML = `
    <div class="modal-header">
      <div class="modal-title">${c.title}</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="dialogue">
        ${c.dialogue.map(l => `
          <div class="dialog-line">
            <div class="dl-speaker">${l.speaker}</div>
            <div class="dl-content">
              <div class="dl-en">${l.en}</div>
              <div class="dl-pt">${l.pt}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" onclick="markDoneAndClose('conversas', ${c.id})" style="width:100%">✓ Marcar como Concluído</button>
    </div>
  `;
  $('overlay').classList.add('show');
  $('modal').classList.add('show');
}

window.closeModal = function() {
  $('overlay').classList.remove('show');
  $('modal').classList.remove('show');
}

window.markDoneAndClose = function(pk, id) {
  if (!isDone(pk, id)) {
    toggleDone(pk, id);
    showXPPop();
  }
  closeModal();
  nav(currentPage); // refresh view
}

/* ---- EVENT DELEGATION ---- */

$('mainContent').addEventListener('click', e => {
  // Tab
  const tab = e.target.closest('.tab-btn[data-tab]');
  if (tab) {
    courseTab = tab.dataset.tab;
    const cid = tab.dataset.cid;
    $('mainContent').innerHTML = renderCourse(cid);
    highlightDot();
    return;
  }

  // Texto card
  const txtCard = e.target.closest('.texto-card');
  if (txtCard) {
    openModalTexto(parseInt(txtCard.dataset.tid));
    return;
  }

  // Conversa card
  const convCard = e.target.closest('.conversa-card');
  if (convCard) {
    openModalConversa(parseInt(convCard.dataset.cid));
    return;
  }

  // nav card / button
  const navEl = e.target.closest('[data-nav]');
  if (navEl) { nav(navEl.dataset.nav); return; }

  // lesson dot
  const dot = e.target.closest('.lesson-dot');
  if (dot) {
    const id    = parseInt(dot.dataset.id);
    const pk    = dot.dataset.pk;
    const apath = dot.dataset.audio;
    const icon  = dot.dataset.icon;
    const cname = dot.dataset.cname;

    const allDots = qsa(`.lesson-dot[data-pk="${pk}"]`);
    const pl = allDots.map(el => ({
      id:    parseInt(el.dataset.id),
      title: `Lição ${el.dataset.id}`,
      audio: el.dataset.audio
    }));
    const idx = allDots.findIndex(el => parseInt(el.dataset.id) === id);

    // right-click or long-press: toggle done
    if (e.target.closest('.lesson-dot.done') && e.shiftKey) {
      toggleDone(pk, id);
      refreshDot(dot, pk, id);
      renderSidebarProfile();
      return;
    }

    playLesson({ id, title: `Lição ${id}`, audio: apath }, pl, idx, pk, icon, cname);
    return;
  }
});

// Double-click dot = mark done
$('mainContent').addEventListener('dblclick', e => {
  const dot = e.target.closest('.lesson-dot');
  if (!dot) return;
  const id = parseInt(dot.dataset.id);
  const pk = dot.dataset.pk;
  toggleDone(pk, id);
  refreshDot(dot, pk, id);
  renderSidebarProfile();
  if (isDone(pk, id)) showXPPop();
});

function refreshDot(dot, pk, id) {
  const done    = isDone(pk, id);
  const playing = nowId === id && nowPK === pk;
  dot.className = `lesson-dot ${playing ? 'playing' : done ? 'done' : 'idle'}`;
  if (!playing) dot.textContent = id;
}

/* ---- SIDEBAR NAV ---- */

qsa('.nav-item[data-page]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); nav(el.dataset.page); });
});

$('sidebarToggle').addEventListener('click', () => {
  $('sidebar').classList.toggle('open');
});

function updateNavBadges() {
  if($('badgeTextos')) $('badgeTextos').textContent = TEXTOS.length;
  if($('badgeFrases')) $('badgeFrases').textContent = FRASES.length;
  if($('badgeConversas')) $('badgeConversas').textContent = CONVERSAS.length;
}

/* ---- BOOT ---- */

updateStreak();
updateNavBadges();
renderSidebarProfile();
nav('home');
