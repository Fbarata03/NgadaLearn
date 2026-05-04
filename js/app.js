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
      audio: `Assimil/Assimil - O Novo Inglês Sem Esforço - Audio/Lição  (${n}).mp3`
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
  { id: 156, en: 'Have you done this before?', pt: 'Você já fez isso antes?' },

  { id: 157, en: 'How long have you been here?', pt: 'Há quanto tempo você está aqui?' },
  { id: 158, en: 'How long have you been in America?', pt: 'Há quanto tempo você está na América?' },
  { id: 159, en: 'How long have you lived here?', pt: 'Há quanto tempo você vive aqui?' },
  { id: 160, en: 'How many children do you have?', pt: 'Quantos filhos você tem?' },
  { id: 161, en: 'How many languages do you speak?', pt: 'Quantos idiomas você fala?' },
  { id: 162, en: 'How many people do you have in your family?', pt: 'Quantas pessoas tem na tua família?' },
  { id: 163, en: 'How much would you like?', pt: 'Quanto você gostaria?' },
  { id: 164, en: 'How old are you?', pt: 'Quantos anos você tem?' },
  { id: 165, en: 'I bought a shirt yesterday.', pt: 'Eu comprei uma camisa ontem.' },
  { id: 166, en: "I don't feel well.", pt: 'Eu não me sinto bem.' },
  { id: 167, en: 'I have pain in my arm.', pt: 'Eu tenho dor no meu braço.' },
  { id: 168, en: 'I have to wash my clothes.', pt: 'Eu tenho que lavar minhas roupas.' },
  { id: 169, en: 'I have two sisters.', pt: 'Eu tenho duas irmãs.' },
  { id: 170, en: "I'll tell him you called.", pt: 'Eu direi a ele que você ligou.' },
  { id: 171, en: "I'm 32.", pt: 'Eu tenho 32.' },
  { id: 172, en: "I'm 6'2\".", pt: 'Eu meço 6\'2" (1.87m)' },
  { id: 173, en: "I'm allergic to seafood.", pt: 'Eu sou alérgico a frutos do mar.' },
  { id: 174, en: "I'm American.", pt: 'Eu sou americano.' },
  { id: 175, en: "I'm a size 8.", pt: 'Meu tamanho é 8 (38)' },
  { id: 176, en: "I'm fine, and you?", pt: 'Eu estou bem, e você?' },
  { id: 177, en: "I'm not afraid.", pt: 'Eu não estou com medo.' },
  { id: 178, en: "I'm sick.", pt: 'Eu estou doente.' },
  { id: 179, en: 'I remember.', pt: 'Eu me lembro.' },
  { id: 180, en: 'I speak a little English.', pt: 'Eu falo um pouco de inglês.' },
  { id: 181, en: 'Is your house like this one?', pt: 'A tua casa é como esta?' },
  { id: 182, en: 'Is your husband also from Boston?', pt: 'O teu marido também é de Boston?' },
  { id: 183, en: "It's not very expensive.", pt: 'Não é muito caro.' },
  { id: 184, en: "I've been there.", pt: 'Eu já estive lá.' },
  { id: 185, en: "Let's share.", pt: 'Vamos dividir.' },
  { id: 186, en: 'My daughter is here.', pt: 'Minha filha está aqui.' },
  { id: 187, en: 'My father has been there.', pt: 'Meu pai já esteve lá.' },
  { id: 188, en: 'My father is a lawyer.', pt: 'Meu pai é advogado.' },
  { id: 189, en: 'My grandmother passed away last year.', pt: 'Meu/Minha avô/avó morreu no ano passado.' },
  { id: 190, en: 'My name is John Smith.', pt: 'Meu nome é John Smith.' },
  { id: 191, en: 'My son.', pt: 'Meu filho.' },
  { id: 192, en: 'My son studies computers.', pt: 'Me filho estuda computação.' },
  { id: 193, en: "No, I'm American.", pt: 'Não, eu sou americano.' },
  { id: 194, en: 'No, this is the first time.', pt: 'Não, esta é a primeira vez.' },
  { id: 195, en: 'Our children are in America.', pt: 'Nossos filhos estão nos Estados Unidos.' },
  { id: 196, en: "She's an expert.", pt: 'Ela é uma especialista/perita.' },
  { id: 197, en: "She's older than me.", pt: 'Ela é mais velha que eu.' },
  { id: 198, en: 'That car is similar to my car.', pt: 'Aquele carro parece o meu.' },
  { id: 199, en: 'This is Mrs. Smith.', pt: 'Esta é a Sra. Smith.' },
  { id: 200, en: 'This is my mother.', pt: 'Esta é a minha mãe.' },
  { id: 201, en: "This is the first time I've been here.", pt: 'Esta é a primeira vez que eu venho aqui.' },
  { id: 202, en: 'We have two boys and one girl.', pt: 'Nós temos dois garotos e uma garota.' },
  { id: 203, en: 'What are you going to do tonight?', pt: 'O que você vai fazer hoje à noite?' },
  { id: 204, en: 'What are your hobbies?', pt: 'Quais são os teus passsatempos?' },
  { id: 205, en: 'What do you study?', pt: 'O que você estuda?' },
  { id: 206, en: 'What do you want to do?', pt: 'O que você quer fazer?' },
  { id: 207, en: 'What school did you go to?', pt: 'Em que escola você foi?' },
  { id: 208, en: "What's your favorite movie?", pt: 'Qual é o teu filme favorito?' },
  { id: 209, en: "What's your last name?", pt: 'Qual é o teu sobrenome?' },
  { id: 210, en: "What's your name?", pt: 'Qual é o teu nome?' },
  { id: 211, en: 'Where are the t-shirts?', pt: 'Onde estão as camisetas?' },
  { id: 212, en: 'Where did you go?', pt: 'Onde você foi?' },
  { id: 213, en: 'Where did you learn English?', pt: 'Onde você aprendeu inglês?' },
  { id: 214, en: 'Where did you work before you worked here?', pt: 'Onde você trabalhou antes daqui?' },
  { id: 215, en: 'Where do you live?', pt: 'Onde você mora?' },
  { id: 216, en: 'Where were you?', pt: 'Onde você estava?' },
  { id: 217, en: 'Who sent this letter?', pt: 'Quem mandou esta carta?' },
  { id: 218, en: 'Would you like to buy this?', pt: 'Você gostaria de comprar isto?' },
  { id: 219, en: 'Your children are very well behaved.', pt: 'Teus filhos se comportam muito bem.' },
  { id: 220, en: 'Your daughter.', pt: 'Sua filha.' },
  { id: 221, en: "You're smarter than him.", pt: 'Você é mais esperto/a que ele.' },
  { id: 222, en: 'You speak English very well.', pt: 'Você fala inglês muito bem.' },

  { id: 223, en: 'Do you want to go to the movies?', pt: 'Você quer ir ao cinema?' },
  { id: 224, en: 'Have you seen this movie?', pt: 'Você já assistiu este filme?' },
  { id: 225, en: 'He said you like to watch movies.', pt: 'Ele disse que você gosta de assistir filmes.' },
  { id: 226, en: 'How tall are you?', pt: 'Quanto você mede?' },
  { id: 227, en: 'Is the bank far?', pt: 'O banco é longe?' },
  { id: 228, en: 'Is there a movie theater nearby?', pt: 'Tem um cinema por aqui?' },
  { id: 229, en: 'What do people usually do in the summer in Los Angeles?', pt: 'O que as pessoas geralmente fazerm no verão em Los Angeles?' },
  { id: 230, en: 'What kind of music do you like?', pt: 'Que tipo de música voce gosta?' },
  { id: 231, en: "What's your favorite food?", pt: 'Qual é a tua comida favorita?' },
  { id: 232, en: 'What time does the movie start?', pt: 'A que horas o filme começa?' },
  { id: 233, en: 'Who was your teacher?', pt: 'Quer foi teu professor/tua professora?' },
  { id: 234, en: 'Would you like to have dinner with me?', pt: 'Você gostaria de jantar comigo?' },
  { id: 235, en: 'Would you like to rent a movie?', pt: 'Você gostaria de alugar um filme?' },

  { id: 236, en: 'Can I have a glass of water please?', pt: 'Posso ter um copo com água por favor?' },
  { id: 237, en: 'Can I use your phone?', pt: 'Posso usar teu telefone?' },
  { id: 238, en: 'Do you have any vacancies?', pt: 'Você tem férias?' },
  { id: 239, en: 'Do you have the number for a taxi?', pt: 'Você tem um telefone de um táxi?' },
  { id: 240, en: 'Do you know her?', pt: 'Você a conhece?' },
  { id: 241, en: 'Do you know where she is?', pt: 'Você sabe onde ela está?' },
  { id: 242, en: 'Do you play basketball?', pt: 'Você joga basquete?' },
  { id: 243, en: 'Fill it up, please.', pt: 'Encha o tanque por favor. (gas station)' },
  { id: 244, en: 'He needs some new clothes.', pt: 'Ele precisa de roupas novas.' },
  { id: 245, en: 'How much is that?', pt: 'Quanto custa isso?' },
  { id: 246, en: 'How much is this?', pt: 'Quanto custa isto?' },
  { id: 247, en: 'I believe you.', pt: 'Eu acredito em você.' },
  { id: 248, en: "I'd like the number for the Hilton Hotel please.", pt: 'Eu gostaria do telefone do Hotel Hilton, por favor.' },
  { id: 249, en: "I'd like to buy a phone card please.", pt: 'Eu gostaria de comprar um cartão telefônico, por favor.' },
  { id: 250, en: "I'd like to go home.", pt: 'Eu gostaria de ir para casa.' },
  { id: 251, en: "I'd like to go shopping.", pt: 'Eu gostaria de ir às compras.' },
  { id: 252, en: 'If you like it I can buy more.', pt: 'Se você gosta eu posso comprar mais.' },
  { id: 253, en: "I'm a beginner.", pt: 'Eu sou iniciante.' },
  { id: 254, en: "I'm full.", pt: 'Eu estou satisfeito.' },
  { id: 255, en: "I'm just kidding.", pt: 'Estou só brincando.' },
  { id: 256, en: "I'm single.", pt: 'Eu sou solteiro.' },
  { id: 257, en: 'I speak two languages.', pt: 'Eu falo dois idiomas.' },
  { id: 258, en: 'I thought he said something else.', pt: 'Eu pensei que ele disse outra coisa.' },
  { id: 259, en: "It's not too far.", pt: 'Não é muito longe.' },
  { id: 260, en: 'I usually drink coffee at breakfast.', pt: 'Eu geralmente tomo um cafezinho no café da manhã.' },
  { id: 261, en: "Sorry, we don't have any.", pt: 'Desculpe, nós não temos nenhum/a' },
  { id: 262, en: 'The books are expensive.', pt: 'Os livros são caros.' },
  { id: 263, en: 'Try it on.', pt: 'Prove-o.' },
  { id: 264, en: 'What do you want to buy?', pt: 'O que você quer comprar?' },
  { id: 265, en: 'What size?', pt: 'Que tamanho?' },
  { id: 266, en: 'What time does the store open?', pt: 'A que horas a loja abre?' },
  { id: 267, en: 'When does the plane arrive?', pt: 'Quando chega o avião?' },
  { id: 268, en: 'Where are you?', pt: 'Onde estã você?' },
  { id: 269, en: 'Would you like something to eat?', pt: 'Você gostaria de algo para comer?' },

  { id: 270, en: 'Can you do me a favor?', pt: 'Você pode me fazer um favor?' },
  { id: 271, en: 'Can you please say that again?', pt: 'Você pode dizer isso novamente por favor?' },
  { id: 272, en: 'Can you show me?', pt: 'Você pode me mostar?' },
  { id: 273, en: 'Can you throw that away for me?', pt: 'Você pode jagar isso fora pra mim?' },
  { id: 274, en: 'Does anyone here speak English?', pt: 'Alguém fala inglês?' },
  { id: 275, en: "Don't do that.", pt: 'Não faça isso.' },
  { id: 276, en: 'Do you believe that?', pt: 'Você acredita nisso?' },
  { id: 277, en: 'Do you have a pencil?', pt: 'Você tem um lápis?' },
  { id: 278, en: 'Do you smoke?', pt: 'Você fuma?' },
  { id: 279, en: 'Do you speak English?', pt: 'Você fala inglês?' },
  { id: 280, en: 'Excuse me, what did you say?', pt: 'Desculpe-me, o que voce disse?' },
  { id: 281, en: 'Forget it.', pt: 'Esquece.' },
  { id: 282, en: 'How do you pronounce that?', pt: 'Como você pronuncia isso?' },
  { id: 283, en: 'How do you say it in English?', pt: 'Como você diz isso em inglês?' },
  { id: 284, en: 'How do you spell it?', pt: 'Como você soletra isso?' },
  { id: 285, en: 'How do you spell the word "Seattle?"', pt: 'Como você soletra a palavra "Seattle"?' },
  { id: 286, en: 'I can swim.', pt: 'Eu sei nadar.' },
  { id: 287, en: "I can't hear you clearly.", pt: 'Eu não consigo te ouvir claramente.' },
  { id: 288, en: "I don't mind.", pt: 'Eu não me importo.' },
  { id: 289, en: "I don't speak English very well.", pt: 'Eu não falo inglês muito bem.' },
  { id: 290, en: "I don't think so.", pt: 'Eu acho que não.' },
  { id: 291, en: "I don't understand what you're saying.", pt: 'Eu não entendo o que você está dizendo.' },
  { id: 292, en: 'Is there air conditioning in the room?', pt: 'Tem ar condicionado neste quarto?' },
  { id: 293, en: 'I think you have too many clothes.', pt: 'Eu acho que você tem muitas roupas.' },
  { id: 294, en: 'I trust you.', pt: 'Eu confio em você' },
  { id: 295, en: 'I understand now.', pt: 'Eu compreendo agora.' },
  { id: 296, en: "Let's meet in front of the hotel.", pt: 'Vamos nos encontrar em frente ao hotel.' },
  { id: 297, en: 'Please sit down.', pt: 'Por favor, sente-se' },
  { id: 298, en: 'Please speak English.', pt: 'Por favor, fale inglês.' },
  { id: 299, en: 'Please speak more slowly.', pt: 'Por favor, fale mais devagar.' },
  { id: 300, en: "Sorry, I didn't hear clearly.", pt: 'Desculpe, eu não ouvi claramente.' },
  { id: 301, en: 'That means friend.', pt: 'Isso significa amigo.' },
  { id: 302, en: "That's wrong.", pt: 'Está errado' },
  { id: 303, en: 'Try to say it.', pt: 'Tente dizê-lo.' },
  { id: 304, en: 'What does this mean?', pt: 'O que isso significa?' },
  { id: 305, en: 'What does this say?', pt: 'O que isso diz?' },
  { id: 306, en: 'What does this word mean?', pt: 'O que significa esta palavra?' },
  { id: 307, en: "What's the exchange rate?", pt: 'Qual é a taxa de conversão?' },
  { id: 308, en: 'Whose book is that?', pt: 'De quem é esse livro?' },
  { id: 309, en: "Why aren't you going?", pt: 'Por que você não está indo?' },
  { id: 310, en: 'Why are you laughing?', pt: 'Por que você está rindo?' },
  { id: 311, en: 'Why did you do that?', pt: 'Por que você fez isso?' },

  { id: 312, en: 'Are you ready?', pt: 'Você está pronto/a?' },
  { id: 313, en: 'Call me.', pt: 'Me telefona' },
  { id: 314, en: 'Did you send me flowers?', pt: 'Você me mandou flores?' },
  { id: 315, en: 'Do you sell batteries?', pt: 'Você vende pilhas?' },
  { id: 316, en: "I don't care.", pt: 'Eu não me importo.' },
  { id: 317, en: 'I give up.', pt: 'Eu desisto.' },
  { id: 318, en: 'I got in an accident.', pt: 'Eu sofrí um acidente.' },
  { id: 319, en: 'I have a cold.', pt: 'Eu estou gripado.' },
  { id: 320, en: 'I have one in my car.', pt: 'Eu tenho um/uma no meu carro.' },
  { id: 321, en: 'I made this cake.', pt: 'Eu fiz este bolo.' },
  { id: 322, en: "I'm a teacher.", pt: 'Eu sou professor/a.' },
  { id: 323, en: "I'm self-employed.", pt: 'Eu tenho meu próprio negócio.' },
  { id: 324, en: 'I still have a lot to do.', pt: 'Eu ainda tenho muito que fazer.' },
  { id: 325, en: "I still haven't decided.", pt: 'Eu ainda não decidí.' },
  { id: 326, en: 'It depends on the weather.', pt: 'Depende do tempo.' },
  { id: 327, en: "It's very cold today.", pt: 'Está muito frio hoje.' },
  { id: 328, en: 'My luggage is missing.', pt: 'Minha bagagem está perdida.' },
  { id: 329, en: 'My stomach hurts.', pt: 'Meu estômago dói.' },
  { id: 330, en: 'My throat is sore.', pt: 'Minha garganta está inflamada.' },
  { id: 331, en: 'My watch has been stolen.', pt: 'Meu relógio foi roubado.' },
  { id: 332, en: 'Take this medicine.', pt: 'Tome este remédio.' },
  { id: 333, en: 'The accident happened at the intersection.', pt: 'O acidente aconteceu no cruzamento.' },
  { id: 334, en: 'There has been a car accident.', pt: 'Houve um acidente de carro.' },
  { id: 335, en: 'Where can I exchange U.S. dollars?', pt: 'Onde posso trocar dólares?' },
  { id: 336, en: 'Where do you work?', pt: 'Onde você trabalha?' },
  { id: 337, en: "Where's the nearest hospital?", pt: 'Onde fica o hospital mais próximo?' },
  { id: 338, en: "Where's the post office?", pt: 'Onde fica o correio?' },

  { id: 339, en: 'Are you going to attend their wedding?', pt: 'Você vai ao casamento deles?' },
  { id: 340, en: 'Are you married?', pt: 'Você é casado?' },
  { id: 341, en: 'Are you okay?', pt: 'Você está bem?' },
  { id: 342, en: 'Are you sick?', pt: 'Você está doente?' },
  { id: 343, en: 'Behind the bank.', pt: 'Atrás do banco' },
  { id: 344, en: 'Can I borrow some money?', pt: 'Posso emprestar algum dinheiro?' },
  { id: 345, en: 'Can I have the bill please?', pt: 'Pode me dar a conta por favor?' },
  { id: 346, en: 'Can you call back later?', pt: 'Você poderia ligar mais tarde?' },
  { id: 347, en: 'Can you call me back later?', pt: 'Você poderia me ligar mais tarde?' },
  { id: 348, en: 'Can you carry this for me?', pt: 'Você pode carregarr isso pra mim?' },
  { id: 349, en: 'Can you fix this?', pt: 'Você pode consertar isso?' },
  { id: 350, en: 'Can you give me an example?', pt: 'Você pode me dar um exemplo?' },
  { id: 351, en: 'Can you speak louder please?', pt: 'Você poderia falar mais alto por favor?' },
  { id: 352, en: 'Can you swim?', pt: 'Você sabe nadar?' },
  { id: 353, en: 'Does he like the school?', pt: 'Ele gosta da escola?' },
  { id: 354, en: 'Do you accept U.S. dollars?', pt: 'Você aceita dólares?' },
  { id: 355, en: 'Do you have a girlfriend?', pt: 'Você tem namorada?' },
  { id: 356, en: 'Do you have an appointment?', pt: 'Você tem compromisso?' },
  { id: 357, en: 'Do you have a problem?', pt: 'Você está com um problema?' },
  { id: 358, en: 'Do you hear that?', pt: 'Você ouviu isso?' },
  { id: 359, en: 'Do you know how to get to the Marriott Hotel?', pt: 'Você sabe como chegar no Hotel Marriott?' },
  { id: 360, en: 'Do you know what this means?', pt: 'Você sabe o que isso significa?' },
  { id: 361, en: 'Do you know where I can get a taxi?', pt: 'Você sabe onde posso pegar um táxi?' },
  { id: 362, en: 'Do you know where my glasses are?', pt: 'Você sabe onde estão os meus óculos?' },
  { id: 363, en: 'Do you like your co-workers?', pt: 'Você gosta dos teus colegas de trabalho?' },
  { id: 364, en: 'Do you need anything else?', pt: 'Você precisa de mais alguma coisa?' },
  { id: 365, en: 'Do you understand?', pt: 'Você entende?' },
  { id: 366, en: 'Give me the pen.', pt: 'Me dê a caneta.' },
  { id: 367, en: 'How do you know?', pt: 'Como você sabe?' },
  { id: 368, en: 'How is she?', pt: 'Como ela está?' },
  { id: 369, en: 'How long is it?', pt: 'Quanto tempo demora?' },
  { id: 370, en: 'How many?', pt: 'Quantos/quantas' },
  { id: 371, en: 'How much is it?', pt: 'Quanto custa?' },
  { id: 372, en: 'I have a lot of things to do.', pt: 'Eu tenho um monte de coisas pra fazer.' },
  { id: 373, en: 'In 30 minutes.', pt: 'Em 30 minutos.' },
  { id: 374, en: 'Is anyone else coming?', pt: 'Alguém mais está vindo?' },
  { id: 375, en: 'Is everything ok?', pt: 'Está tudo OK?' },
  { id: 376, en: 'Is it cold outside?', pt: 'Está frio lá fora?' },
  { id: 377, en: 'Is it far from here?', pt: 'É longe daqui?' },
  { id: 378, en: 'Is it hot?', pt: 'Está quente?' },
  { id: 379, en: 'Is it raining?', pt: 'Está chovendo?' },
  { id: 380, en: 'Is there anything cheaper?', pt: 'Tem algo mais barato?' },
  { id: 381, en: 'Is your son here?', pt: 'O teu filho está aqui?' },
  { id: 382, en: 'Should I wait?', pt: 'Eu deveria esperar?' },
  { id: 383, en: 'The big one or the small one?', pt: 'O grande ou o pequeno?' },
  { id: 384, en: 'The cars are American.', pt: 'Os carros são americanos.' },
  { id: 385, en: 'Were there any problems?', pt: 'Houve algum problema?' },
  { id: 386, en: 'Were you at the library last night?', pt: 'Você estava na biblioteca ontem à noite?' },
  { id: 387, en: 'What are you doing?', pt: 'O que você está fazendo?' },
  { id: 388, en: 'What are you thinking about?', pt: 'No que você está pensando?' },
  { id: 389, en: 'What are you two talking about?', pt: 'Sobre o que vocês dois estão falando?' },
  { id: 390, en: 'What did you do last night?', pt: 'O que você fez ontem à noite?' },
  { id: 391, en: 'What did you do yesterday?', pt: 'O que você fez ontem?' },
  { id: 392, en: 'What did you think?', pt: 'O que você achou?' },
  { id: 393, en: 'What do they study?', pt: 'O que eles estudam?' },
  { id: 394, en: 'What do you have?', pt: 'O que você tem?' },
  { id: 395, en: 'What do you think?', pt: 'O que você acha?' },
  { id: 396, en: 'What happened?', pt: 'O que aconteceu?' },
  { id: 397, en: 'What is it?', pt: 'O que é?' },
  { id: 398, en: 'What is that?', pt: 'O que é isso?' },
  { id: 399, en: 'What should I wear?', pt: 'O que eu deveria vestir?' },
  { id: 400, en: "What's in it?", pt: 'O que tem nisso?' },
  { id: 401, en: "What's the temperature?", pt: 'Qual é a temperatura?' },
  { id: 402, en: "What's this?", pt: 'O que é isto?' },
  { id: 403, en: "What's up?", pt: 'O que se passa?/O que está acontecendo?' },
  { id: 404, en: 'Where can I rent a car?', pt: 'Onde posso alugar um carro?' },
  { id: 405, en: 'Where did it happen?', pt: 'Onde aconteceu?' },
  { id: 406, en: 'Where did you learn it?', pt: 'Onde você aprendeu?' },
  { id: 407, en: 'Where is he?', pt: 'Onde ele está?' },
  { id: 408, en: 'Where is he from?', pt: 'De onde ele é?' },
  { id: 409, en: 'Which is better, the spaghetti or chicken salad?', pt: 'Qual é melhor o espaguete ou a salada de frango?' },
  { id: 410, en: 'Which one do you want?', pt: 'Qual você quer?' },
  { id: 411, en: 'Which one is cheaper?', pt: 'Qual é mais barato?' },
  { id: 412, en: 'Which one is the best?', pt: 'Qual é o/a melhor?' },
  { id: 413, en: 'Which school does he go to?', pt: 'Em qual escola ele vai?' },
  { id: 414, en: 'Who are they?', pt: 'Quem são eles?' },
  { id: 415, en: 'Who are you looking for?', pt: 'Quem você está procurando?' },
  { id: 416, en: 'Who is it?', pt: 'Quem fala? (perguntando quem está no telefone)' },
  { id: 417, en: "Who's calling?", pt: 'Quem fala?' },
  { id: 418, en: "Who's that man over there?", pt: 'Que é aquele homem alí?' },
  { id: 419, en: 'Who taught you that?', pt: 'Quem te ensinou isso?' },
  { id: 420, en: 'Why did you say that?', pt: 'Por que você disse isso?' },
  { id: 421, en: 'Will you pass me the salt please?', pt: 'Você me passa o sal por favor?' },
  { id: 422, en: 'Will you put this in the car for me?', pt: 'Você poria isso no carro pra mim?' },
  { id: 423, en: 'Would you ask him to call me back please?', pt: 'Você pede a ele pra me ligar de volta por favor?' },
  { id: 424, en: 'Yes.', pt: 'Sim.' },
  { id: 425, en: 'You have a very nice car.', pt: 'Você tem um carro legal.' },

  { id: 426, en: '6 dollars per hour.', pt: '6 dólares por hora' },
  { id: 427, en: 'Are you waiting for someone?', pt: 'Você está esperando alguém?' },
  { id: 428, en: 'Are you working today?', pt: 'Você trabalha hoje?' },
  { id: 429, en: 'Bring me my shirt please.', pt: 'Me traga a minha camisa por favor' },
  { id: 430, en: 'Do you like to watch TV?', pt: 'Você gosta de assistir TV?' },
  { id: 431, en: 'Do you like your boss?', pt: 'Você gosta do teu chefe?' },
  { id: 432, en: 'Have you finished studying?', pt: 'Você já acabou de estudar?' },
  { id: 433, en: "He's an engineer.", pt: 'Ele é engenheiro' },
  { id: 434, en: "He's very hard working.", pt: 'Ele é um trabalhador duro.' },
  { id: 435, en: 'He works at a computer company in New York.', pt: 'Ele trabalha numa empresa em Nova Iorque.' },
  { id: 436, en: 'How long have you worked here?', pt: 'Há quanto tempo você trabalha aqui?' },
  { id: 437, en: 'How many hours a week do you work?', pt: 'Quantas horas por semana voce trabalha?' },
  { id: 438, en: 'How much money do you have?', pt: 'Quanto dinheiro você tem?' },
  { id: 439, en: "How's the weather?", pt: 'Como está o tempo?' },
  { id: 440, en: 'How was the trip?', pt: 'Como foi a viagem?' },
  { id: 441, en: 'I forget.', pt: 'Eu esqueço.' },
  { id: 442, en: "I'm good.", pt: 'Estou bem.' },
  { id: 443, en: "I'm ready.", pt: 'Estou pronto.' },
  { id: 444, en: 'I still have a lot of things to buy.', pt: 'Eu ainda tenho muitas coisas pra comprar.' },
  { id: 445, en: "I've seen it.", pt: 'Eu já vi.' },
  { id: 446, en: 'What does he do for work?', pt: 'No que ele trabalha?' },
  { id: 447, en: 'What does your father do for work?', pt: 'No que teu pai trabalha?' },
  { id: 448, en: 'What do you do for work?', pt: 'No que você trabalha?' },
  { id: 449, en: 'What do your parents do for work?', pt: 'No que teus pais trabalham?' },
  { id: 450, en: "What's the matter?", pt: 'Qual é o problema?' },
  { id: 451, en: 'What time do you go to work everyday?', pt: 'A que horas você vai para o trabalho todos os dias?' },
  { id: 452, en: 'When do you arrive in the U.S.?', pt: 'Quando você chega nos EUA?' },
  { id: 453, en: 'When do you get off work?', pt: 'Quando você sai do trabalho?' },
  { id: 454, en: 'Where did you put it?', pt: 'Onde você colocou?' },
  { id: 455, en: 'Where does it hurt?', pt: 'Onde doi?' },
  { id: 456, en: 'Where do you want to go?', pt: 'Onde você quer ir?' },

  { id: 457, en: 'Come here.', pt: 'Venha aqui.' },
  { id: 458, en: 'Does it often snow in the winter in Massachusetts?', pt: 'Geralmente neva em Massachussetts?' },
  { id: 459, en: "Do you think it'll rain today?", pt: 'Você acha que vai chover hoje?' },
  { id: 460, en: "Do you think it's going to rain tomorrow?", pt: 'Você acha que vai chover amanhã?' },
  { id: 461, en: "How's business?", pt: 'Como estão os negócios?' },
  { id: 462, en: 'Is it closed?', pt: 'Está fechado?' },
  { id: 463, en: 'Is it possible?', pt: 'É possível?' },
  { id: 464, en: 'Is it ready?', pt: 'Está pronto?' },
  { id: 465, en: 'It costs 20 dollars per hour.', pt: 'Custa 20 dólares por hora.' },
  { id: 466, en: 'It hurts here.', pt: 'Dói aqui.' },
  { id: 467, en: "It's going to be hot today.", pt: 'Vai ser quente hoje.' },
  { id: 468, en: "It's north of here.", pt: 'Fica ao norte daqui.' },
  { id: 469, en: "It's over there.", pt: 'É ali pra cima.' },
  { id: 470, en: "It's too late.", pt: 'É muito tarde/Tarde demais.' },
  { id: 471, en: "It's very important.", pt: 'É muito importante.' },
  { id: 472, en: 'It will arrive shortly.', pt: 'Vai chegar logo.' },
  { id: 473, en: 'The roads are slippery.', pt: 'As estradas estão escorregadias.' },
  { id: 474, en: "What's the room rate?", pt: 'Qual é a diária? (hotel)' },
  { id: 475, en: 'What will the weather be like tomorrow?', pt: 'Como vai estar o tempo amanhã?' }
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
  },
  {
    id: 7,
    title: 'Renting a car',
    sub: 'Alugando um carro',
    dialogue: [
      { speaker: 'A', en: 'Hello!', pt: 'Olá!' },
      { speaker: 'B', en: 'Hi, can I help you?', pt: 'Olá, posso ajudá-lo?' },
      { speaker: 'A', en: 'Sure, I’d like to go to San Francisco. And I need to rent a car.', pt: 'Claro, eu gostaria de ir para São Francisco. E eu preciso alugar um carro.' },
      { speaker: 'B', en: 'Sure, what’s your full name?', pt: 'Claro, qual é o seu nome completo?' },
      { speaker: 'A', en: 'Johnson Smith.', pt: 'Johnson Smith.' },
      { speaker: 'B', en: 'What’s your address?', pt: 'Qual é o seu endereço?' },
      { speaker: 'A', en: 'Ritch Main Street, 41, Florida.', pt: 'Rua Ritch Main, 41, Flórida' },
      { speaker: 'B', en: 'How many days?', pt: 'Quantos dias?' },
      { speaker: 'A', en: '2 weeks.', pt: '2 semanas' },
      { speaker: 'B', en: '$2,000 dollars.', pt: '$ 2.000 Dolares.' }
    ]
  },
  {
    id: 8,
    title: 'Demotivated at work',
    sub: 'Desmotivado no trabalho',
    dialogue: [
      { speaker: 'A', en: "I don’t like to work here.", pt: 'Eu não gosto de trabalhar aqui.' },
      { speaker: 'B', en: 'Sorry, what do you mean?', pt: 'Desculpe, o que você quer dizer?' },
      { speaker: 'A', en: 'I don’t like to work here in this company!', pt: 'Eu não gosto de trabalhar aqui nesta empresa!' },
      { speaker: 'B', en: "Why not? What’s bothering you?", pt: 'Por que não? O que está te incomodando?' },
      { speaker: 'A', en: 'They pay us a very small salary.', pt: 'Eles nos pagam um salário muito pequeno.' },
      { speaker: 'B', en: 'Is this why you are demotivated?', pt: 'É por isso que você está desmotivado?' },
      { speaker: 'A', en: "Yeah, I don’t know what to do.", pt: 'Sim, eu não sei o que fazer.' },
      { speaker: 'B', en: 'Why don’t you get out of here?', pt: 'Por que você não sai daqui?' },
      { speaker: 'A', en: "I’m really thinking about that.", pt: 'Eu realmente estou pensando nisso.' },
      { speaker: 'B', en: 'I think you should work with what you like to do.', pt: 'Eu acho que você deve trabalhar com o que você gosta de fazer.' }
    ]
  },
  {
    id: 9,
    title: 'Hotel vs Motel',
    sub: 'Procurando hotel',
    dialogue: [
      { speaker: 'A', en: 'Hi!', pt: 'Oi!' },
      { speaker: 'B', en: 'Hello.', pt: 'Olá.' },
      { speaker: 'A', en: 'I’m from France. I don’t speak English very well. Do you speak French?', pt: 'Eu sou da França. Eu não falo inglês muito bem. Você fala francês?' },
      { speaker: 'B', en: 'No, I don’t. But what do you want?', pt: 'Não, eu não. Mas o que você quer?' },
      { speaker: 'A', en: 'I’m looking for a hotel.', pt: 'Estou procurando um hotel.' },
      { speaker: 'B', en: "No problem, there’s a lot of hotels here.", pt: 'Não há problema, há muitos hotéis aqui.' },
      { speaker: 'A', en: 'Where? I can’t find one.', pt: 'Onde? Não consigo encontrar um.' },
      { speaker: 'B', en: 'Really? How is it possible?', pt: 'Sério? Como isso é possível?' },
      { speaker: 'A', en: 'I only see “Motel” and not “Hotel”.', pt: 'Eu apenas vejo “Motel” e não “Hotel”.' },
      { speaker: 'B', en: "Heheheh, yeah, it’s almost the same. Don’t worry. I’ll show you.", pt: 'Heheheh, sim, é quase o mesmo. Não se preocupe. Eu vou te mostrar.' }
    ]
  },
  {
    id: 10,
    title: 'Graduated',
    sub: 'Formado e procurando emprego',
    dialogue: [
      { speaker: 'A', en: 'Thank God!', pt: 'Graças a Deus!' },
      { speaker: 'B', en: 'Why are you so excited?', pt: 'Por que você está tão animado?' },
      { speaker: 'A', en: 'Finally, I graduated!', pt: 'Finalmente, eu me formei!' },
      { speaker: 'B', en: 'Wow! Congrats!', pt: 'Uau! Parabéns!' },
      { speaker: 'A', en: 'Thank you.', pt: 'Obrigado.' },
      { speaker: 'B', en: 'Are you already working in your area?', pt: 'Você já está trabalhando em sua área?' },
      { speaker: 'A', en: "No, I’m looking for a job.", pt: 'Não, estou procurando um emprego.' },
      { speaker: 'B', en: 'You will find one. This city needs engineers.', pt: 'Você vai encontrar um. Esta cidade precisa de engenheiros.' },
      { speaker: 'A', en: 'Yeah, this city is increasing every year.', pt: 'Sim, esta cidade está aumentando a cada ano.' },
      { speaker: 'B', en: 'You’re right.', pt: 'Você está certo.' }
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

let ttsVoices = [];
let ttsToken = 0;

function refreshTTSVoices() {
  try {
    ttsVoices = window.speechSynthesis?.getVoices?.() || [];
  } catch {
    ttsVoices = [];
  }
}

refreshTTSVoices();
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = refreshTTSVoices;
}

const TTS_SETTINGS = {
  en: { langs: ['en-US', 'en-GB', 'en'], rate: 1, pitch: 1 },
  pt: { langs: ['pt-BR', 'pt-PT', 'pt'], rate: 1, pitch: 1 }
};

const TTS_PREFERRED_VOICE_PATTERNS = {
  en: [
    'google us english',
    'google uk english female',
    'google uk english male',
    'microsoft aria online',
    'microsoft jenny online',
    'microsoft guy online',
    'microsoft ryan online',
    'microsoft',
    'online (natural)',
    'neural'
  ],
  pt: [
    'google português do brasil',
    'google portuguese (brazil)',
    'google português',
    'google portuguese',
    'microsoft francisca online',
    'microsoft antonio online',
    'microsoft',
    'online (natural)',
    'neural'
  ]
};

function voiceLangMatches(v, langs) {
  const vl = String(v?.lang || '').toLowerCase();
  return (langs || []).some(l => {
    const t = String(l || '').toLowerCase();
    if (!t) return false;
    if (vl === t) return true;
    const base = t.split('-')[0];
    return base && vl.startsWith(base);
  });
}

function findPreferredVoice(tag, langs) {
  if (!ttsVoices.length) return null;
  const patterns = TTS_PREFERRED_VOICE_PATTERNS[tag] || [];
  const pool = ttsVoices.filter(v => voiceLangMatches(v, langs));
  if (!pool.length) return null;

  for (const p of patterns) {
    const target = String(p || '').toLowerCase().trim();
    if (!target) continue;
    const v = pool.find(x => String(x.name || '').toLowerCase().includes(target));
    if (v) return v;
  }
  return null;
}

function ensureTTSVoicesLoaded(waitMs = 900) {
  if (!window.speechSynthesis) return Promise.resolve();
  refreshTTSVoices();
  if (ttsVoices.length) return Promise.resolve();

  return new Promise(resolve => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };

    const prev = window.speechSynthesis.onvoiceschanged;
    window.speechSynthesis.onvoiceschanged = () => {
      try { prev?.(); } catch {}
      refreshTTSVoices();
      if (ttsVoices.length) finish();
    };

    setTimeout(() => {
      refreshTTSVoices();
      finish();
    }, waitMs);
  });
}

function normalizeTTSText(t) {
  return String(t || '')
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitTTSChunks(text, maxLen = 160) {
  const t = normalizeTTSText(text);
  if (!t) return [];
  if (t.length <= maxLen) return [t];

  const parts = t
    .replace(/([.!?;:])\s+/g, '$1|')
    .replace(/,\s+/g, ',|')
    .split('|')
    .map(x => x.trim())
    .filter(Boolean);

  const out = [];
  let cur = '';
  for (const p of parts) {
    if (!cur) {
      cur = p;
      continue;
    }
    if ((cur + ' ' + p).length <= maxLen) cur = cur + ' ' + p;
    else {
      out.push(cur);
      cur = p;
    }
  }
  if (cur) out.push(cur);

  const final = [];
  for (const c of out) {
    if (c.length <= maxLen) final.push(c);
    else {
      for (let i = 0; i < c.length; i += maxLen) final.push(c.slice(i, i + maxLen));
    }
  }
  return final;
}

function voiceScore(v, lang) {
  const vlang = (v.lang || '').toLowerCase();
  const target = lang.toLowerCase();
  const base = target.split('-')[0];
  const name = (v.name || '').toLowerCase();
  let s = 0;

  if (vlang === target) s += 120;
  else if (vlang.startsWith(base)) s += 70;
  else return 0;

  if (name.includes('neural') || name.includes('natural')) s += 45;
  if (name.includes('enhanced')) s += 25;
  if (name.includes('google')) s += 90;
  if (name.includes('microsoft')) s += 70;
  if (name.includes('online')) s += 35;

  if (v.localService === false) s += 8;
  return s;
}

function pickBestVoice(langs) {
  if (!ttsVoices.length) return null;
  const candidates = langs.flatMap(l => ttsVoices.map(v => ({ v, score: voiceScore(v, l) })));
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.score > 0 ? candidates[0].v : null;
}

async function speakText(text, tag) {
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
  const cfg = TTS_SETTINGS[tag] || TTS_SETTINGS.en;
  const chunks = splitTTSChunks(text);
  if (!chunks.length) return;

  ttsToken += 1;
  const myToken = ttsToken;
  window.speechSynthesis.cancel();

  await ensureTTSVoicesLoaded(900);
  if (myToken !== ttsToken) return;

  const v = findPreferredVoice(tag, cfg.langs) || pickBestVoice(cfg.langs);
  const lang = (v?.lang) || cfg.langs[0];

  const speakNext = (i) => {
    if (myToken !== ttsToken) return;
    const part = chunks[i];
    if (!part) return;

    const u = new SpeechSynthesisUtterance(part);
    u.lang = lang;
    if (v) u.voice = v;
    u.rate = cfg.rate;
    u.pitch = cfg.pitch;
    u.volume = 1;
    u.onend = () => speakNext(i + 1);
    window.speechSynthesis.speak(u);
  };

  speakNext(0);
}

function ttsLang(tag) {
  return tag === 'pt' ? 'pt' : 'en';
}

function resolveTTSText(scope, id, idx, field) {
  if (scope === 'texto') {
    const t = TEXTOS.find(x => x.id === id);
    const p = t?.content?.[idx];
    return p?.[field] || '';
  }

  if (scope === 'conversa') {
    const c = CONVERSAS.find(x => x.id === id);
    const l = c?.dialogue?.[idx];
    return l?.[field] || '';
  }

  if (scope === 'fc') {
    return fcCurrent?.[field] || '';
  }

  return '';
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
          <div class="hero-lvl">${lv + 1}</div>
        </div>
        <div class="hero-info">
          <h1>${levelName()}</h1>
          <div class="hero-sub">Nível ${lv + 1} — ${done} lições concluídas</div>
        </div>
      </div>

      <div class="hero-xp-label">
        <span>XP: ${xp()}</span>
        <span>${xpN}/100 para o próximo nível</span>
      </div>
      <div class="hero-xp-outer">
        <div class="hero-xp-inner" style="width:${xpN}%"></div>
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
      <div class="section-hd">📊 Progresso</div>
      <div class="home-stats">
        <div class="stat-card">
          <div class="stat-val">${assimilDone()}</div>
          <div class="stat-label">📚 Assimil</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${pimsleurDone()}</div>
          <div class="stat-label">🎧 PIMSLEUR</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${frasesDone()}</div>
          <div class="stat-label">⚡ Flashcards</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">${conversasDone()}</div>
          <div class="stat-label">🗣️ Conversas</div>
        </div>
      </div>

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
      <div class="world-pb">
        <div class="world-pf" style="width:${pct}%"></div>
      </div>
      <div class="world-pt">${done} / ${c.total} lições · ${pct}%</div>
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
          <div class="course-hero-prog">
            <div class="course-hero-prog-fill" style="width:${pct}%"></div>
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
    <div class="tts-row tts-row-center">
      <button class="tts-btn" data-tts="1" data-scope="fc" data-lang="en" data-field="en">🔊 EN</button>
      <button class="tts-btn" data-tts="1" data-scope="fc" data-lang="pt" data-field="pt">🔊 PT</button>
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
    <div class="fc-shortcuts">
      <span class="fc-shortcut-item"><span class="kbd">Space</span> virar</span>
      <span class="fc-shortcut-item"><span class="kbd">→</span> próximo</span>
      <span class="fc-shortcut-item"><span class="kbd">←</span> anterior</span>
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
        ${t.content.map((p, idx) => `
          <div style="margin-bottom:16px;">
            <strong style="color:var(--text);font-size:15px">${p.en}</strong><br>
            <span style="color:var(--text2);font-size:13px">${p.pt}</span>
            <div class="tts-row">
              <button class="tts-btn" data-tts="1" data-scope="texto" data-id="${t.id}" data-idx="${idx}" data-lang="en" data-field="en">🔊 EN</button>
              <button class="tts-btn" data-tts="1" data-scope="texto" data-id="${t.id}" data-idx="${idx}" data-lang="pt" data-field="pt">🔊 PT</button>
            </div>
          </div>
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
  const speakers = [...new Set(c.dialogue.map(l => l.speaker))];
  $('modal').innerHTML = `
    <div class="modal-header">
      <div>
        <div class="modal-title">${c.title}</div>
        <div style="font-size:12px;color:var(--text2);margin-top:2px">${c.sub}</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="dialogue" style="gap:14px">
        ${c.dialogue.map((l, idx) => {
          const side = l.speaker === speakers[0] ? 'left' : 'right';
          return `
          <div class="chat-msg ${side}">
            <div class="chat-speaker">${l.speaker}</div>
            <div class="chat-bubble">
              <div class="chat-en">${l.en}</div>
              <div class="chat-pt">${l.pt}</div>
              <div class="chat-tts">
                <button class="tts-btn" data-tts="1" data-scope="conversa" data-id="${c.id}" data-idx="${idx}" data-lang="en" data-field="en">🔊 EN</button>
                <button class="tts-btn" data-tts="1" data-scope="conversa" data-id="${c.id}" data-idx="${idx}" data-lang="pt" data-field="pt">🔊 PT</button>
              </div>
            </div>
          </div>`;
        }).join('')}
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

function handleTTSClick(e) {
  const btn = e.target.closest('.tts-btn[data-tts]');
  if (!btn) return false;

  e.preventDefault();
  e.stopPropagation();

  const scope = btn.dataset.scope;
  const id = btn.dataset.id ? parseInt(btn.dataset.id) : null;
  const idx = btn.dataset.idx ? parseInt(btn.dataset.idx) : null;
  const field = btn.dataset.field;
  const lang = ttsLang(btn.dataset.lang);
  const text = resolveTTSText(scope, id, idx, field);
  speakText(text, lang);
  return true;
}

$('modal').addEventListener('click', e => {
  handleTTSClick(e);
});

$('mainContent').addEventListener('click', e => {
  if (handleTTSClick(e)) return;

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

document.addEventListener('click', e => {
  const navEl = e.target.closest('[data-nav]');
  if (!navEl) return;
  if (navEl.closest('#mainContent')) return;
  e.preventDefault();
  nav(navEl.dataset.nav);
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

/* ---- DARK MODE ---- */

function applyTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode === 'dark' ? 'dark' : '');
  const btn = $('themeToggle');
  if (btn) btn.textContent = mode === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('nga_theme', mode);
}

function initTheme() {
  const saved = localStorage.getItem('nga_theme');
  if (saved === 'dark') applyTheme('dark');
}

$('themeToggle')?.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(isDark ? 'light' : 'dark');
});

/* ---- KEYBOARD SHORTCUTS (Flashcards) ---- */

document.addEventListener('keydown', e => {
  if (currentPage !== 'frases') return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault();
    $('fcCard')?.classList.toggle('flipped');
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'Enter') {
    e.preventDefault();
    window.goNextFC?.();
    return;
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (fcIndex > 1) { fcIndex -= 2; nextFlashcard(); }
    return;
  }
});

/* ---- BOOT ---- */

updateStreak();
updateNavBadges();
renderSidebarProfile();
initTheme();
nav('home');
