// Sardonix Verb Database with Examples and Explanations
const verbDatabase = {
    "be": {
        infinitive: "be",
        translation: "ser/estar",
        forms: { base: "be", pastSimple: "was/were", pastParticiple: "been", presentParticiple: "being", thirdPerson: "is" },
        irregular: true,
        tags: ["irregular", "auxiliary", "essential"],
        related: ["become", "exist", "remain"],
        explanation: "O verbo 'be' é o mais importante do inglês. Funciona como verbo principal ('I am happy') e como auxiliar para formar tempos contínuos ('I am working') e voz passiva ('It was made'). Diferente do português, 'be' une 'ser' e 'estar' em um só verbo.",
        examples: [
            { en: "I am a teacher.", pt: "Eu sou professor." },
            { en: "She was tired yesterday.", pt: "Ela estava cansada ontem." },
            { en: "They have been friends for years.", pt: "Eles são amigos há anos." }
        ],
        tenses: {
            simplePresent: { I: "am", you: "are", "he/she/it": "is", we: "are", they: "are" },
            simplePast: { I: "was", you: "were", "he/she/it": "was", we: "were", they: "were" },
            simpleFuture: { I: "will be", you: "will be", "he/she/it": "will be", we: "will be", they: "will be" },
            presentContinuous: { I: "am being", you: "are being", "he/she/it": "is being", we: "are being", they: "are being" },
            pastContinuous: { I: "was being", you: "were being", "he/she/it": "was being", we: "were being", they: "were being" },
            presentPerfect: { I: "have been", you: "have been", "he/she/it": "has been", we: "have been", they: "have been" },
            pastPerfect: { I: "had been", you: "had been", "he/she/it": "had been", we: "had been", they: "had been" },
            futurePerfect: { I: "will have been", you: "will have been", "he/she/it": "will have been", we: "will have been", they: "will have been" }
        }
    },
    "go": {
        infinitive: "go",
        translation: "ir",
        forms: { base: "go", pastSimple: "went", pastParticiple: "gone", presentParticiple: "going", thirdPerson: "goes" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["come", "leave", "arrive", "depart", "travel"],
        explanation: "'Go' indica movimento para longe do falante. É muito usado com 'going to' para expressar futuro planejado ('I'm going to study'). Phrasal verbs comuns: 'go on' (continuar), 'go out' (sair), 'go back' (voltar).",
        examples: [
            { en: "I go to work by bus.", pt: "Eu vou ao trabalho de ônibus." },
            { en: "She went to Paris last summer.", pt: "Ela foi a Paris no verão passado." },
            { en: "We are going to have a party.", pt: "Nós vamos ter uma festa." }
        ],
        tenses: {
            simplePresent: { I: "go", you: "go", "he/she/it": "goes", we: "go", they: "go" },
            simplePast: { I: "went", you: "went", "he/she/it": "went", we: "went", they: "went" },
            simpleFuture: { I: "will go", you: "will go", "he/she/it": "will go", we: "will go", they: "will go" },
            presentContinuous: { I: "am going", you: "are going", "he/she/it": "is going", we: "are going", they: "are going" },
            pastContinuous: { I: "was going", you: "were going", "he/she/it": "was going", we: "were going", they: "were going" },
            presentPerfect: { I: "have gone", you: "have gone", "he/she/it": "has gone", we: "have gone", they: "have gone" },
            pastPerfect: { I: "had gone", you: "had gone", "he/she/it": "had gone", we: "had gone", they: "had gone" },
            futurePerfect: { I: "will have gone", you: "will have gone", "he/she/it": "will have gone", we: "will have gone", they: "will have gone" }
        }
    },
    "have": {
        infinitive: "have",
        translation: "ter",
        forms: { base: "have", pastSimple: "had", pastParticiple: "had", presentParticiple: "having", thirdPerson: "has" },
        irregular: true,
        tags: ["irregular", "auxiliary", "essential"],
        related: ["own", "possess", "hold", "get"],
        explanation: "'Have' funciona como verbo principal (posse) e auxiliar (tempos perfeitos). 'Have to' expressa obrigação ('I have to go'). 'Have got' é comum no inglês britânico para posse ('I've got a car').",
        examples: [
            { en: "I have two brothers.", pt: "Eu tenho dois irmãos." },
            { en: "She has finished her homework.", pt: "Ela terminou o dever de casa." },
            { en: "We had a great time at the party.", pt: "Nós nos divertimos muito na festa." }
        ],
        tenses: {
            simplePresent: { I: "have", you: "have", "he/she/it": "has", we: "have", they: "have" },
            simplePast: { I: "had", you: "had", "he/she/it": "had", we: "had", they: "had" },
            simpleFuture: { I: "will have", you: "will have", "he/she/it": "will have", we: "will have", they: "will have" },
            presentContinuous: { I: "am having", you: "are having", "he/she/it": "is having", we: "are having", they: "are having" },
            pastContinuous: { I: "was having", you: "were having", "he/she/it": "was having", we: "were having", they: "were having" },
            presentPerfect: { I: "have had", you: "have had", "he/she/it": "has had", we: "have had", they: "have had" },
            pastPerfect: { I: "had had", you: "had had", "he/she/it": "had had", we: "had had", they: "had had" },
            futurePerfect: { I: "will have had", you: "will have had", "he/she/it": "will have had", we: "will have had", they: "will have had" }
        }
    },
    "do": {
        infinitive: "do",
        translation: "fazer",
        forms: { base: "do", pastSimple: "did", pastParticiple: "done", presentParticiple: "doing", thirdPerson: "does" },
        irregular: true,
        tags: ["irregular", "auxiliary", "essential"],
        related: ["make", "perform", "act", "execute"],
        explanation: "'Do' é usado como verbo principal (fazer ações) e auxiliar para perguntas e negativas no Simple Present/Past. 'Do' vs 'Make': 'do' para atividades/tarefas ('do homework'), 'make' para criar algo ('make a cake').",
        examples: [
            { en: "What do you do for a living?", pt: "O que você faz da vida?" },
            { en: "I did my best on the test.", pt: "Eu fiz o meu melhor na prova." },
            { en: "She doesn't like coffee.", pt: "Ela não gosta de café." }
        ],
        tenses: {
            simplePresent: { I: "do", you: "do", "he/she/it": "does", we: "do", they: "do" },
            simplePast: { I: "did", you: "did", "he/she/it": "did", we: "did", they: "did" },
            simpleFuture: { I: "will do", you: "will do", "he/she/it": "will do", we: "will do", they: "will do" },
            presentContinuous: { I: "am doing", you: "are doing", "he/she/it": "is doing", we: "are doing", they: "are doing" },
            pastContinuous: { I: "was doing", you: "were doing", "he/she/it": "was doing", we: "were doing", they: "were doing" },
            presentPerfect: { I: "have done", you: "have done", "he/she/it": "has done", we: "have done", they: "have done" },
            pastPerfect: { I: "had done", you: "had done", "he/she/it": "had done", we: "had done", they: "had done" },
            futurePerfect: { I: "will have done", you: "will have done", "he/she/it": "will have done", we: "will have done", they: "will have done" }
        }
    },
    "say": {
        infinitive: "say",
        translation: "dizer",
        forms: { base: "say", pastSimple: "said", pastParticiple: "said", presentParticiple: "saying", thirdPerson: "says" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["tell", "speak", "talk", "express"],
        explanation: "'Say' foca nas palavras ditas, não no ouvinte. Compare: 'say something' vs 'tell someone something'. Use 'say' para citar diretamente ('He said: Hello') ou indiretamente ('He said that...').",
        examples: [
            { en: "What did you say?", pt: "O que você disse?" },
            { en: "She says she is busy.", pt: "Ela diz que está ocupada." },
            { en: "They said goodbye and left.", pt: "Eles disseram adeus e foram embora." }
        ],
        tenses: {
            simplePresent: { I: "say", you: "say", "he/she/it": "says", we: "say", they: "say" },
            simplePast: { I: "said", you: "said", "he/she/it": "said", we: "said", they: "said" },
            simpleFuture: { I: "will say", you: "will say", "he/she/it": "will say", we: "will say", they: "will say" },
            presentContinuous: { I: "am saying", you: "are saying", "he/she/it": "is saying", we: "are saying", they: "are saying" },
            pastContinuous: { I: "was saying", you: "were saying", "he/she/it": "was saying", we: "were saying", they: "were saying" },
            presentPerfect: { I: "have said", you: "have said", "he/she/it": "has said", we: "have said", they: "have said" },
            pastPerfect: { I: "had said", you: "had said", "he/she/it": "had said", we: "had said", they: "had said" },
            futurePerfect: { I: "will have said", you: "will have said", "he/she/it": "will have said", we: "will have said", they: "will have said" }
        }
    },
    "get": {
        infinitive: "get",
        translation: "obter/conseguir",
        forms: { base: "get", pastSimple: "got", pastParticiple: "gotten/got", presentParticiple: "getting", thirdPerson: "gets" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["obtain", "receive", "acquire", "have"],
        explanation: "'Get' é extremamente versátil: obter ('get a job'), receber ('get a gift'), tornar-se ('get angry'), entender ('I get it'). O particípio 'gotten' é americano, 'got' é britânico.",
        examples: [
            { en: "I need to get some groceries.", pt: "Eu preciso comprar mantimentos." },
            { en: "She got a new job last month.", pt: "Ela conseguiu um emprego novo mês passado." },
            { en: "It's getting cold outside.", pt: "Está ficando frio lá fora." }
        ],
        tenses: {
            simplePresent: { I: "get", you: "get", "he/she/it": "gets", we: "get", they: "get" },
            simplePast: { I: "got", you: "got", "he/she/it": "got", we: "got", they: "got" },
            simpleFuture: { I: "will get", you: "will get", "he/she/it": "will get", we: "will get", they: "will get" },
            presentContinuous: { I: "am getting", you: "are getting", "he/she/it": "is getting", we: "are getting", they: "are getting" },
            pastContinuous: { I: "was getting", you: "were getting", "he/she/it": "was getting", we: "were getting", they: "were getting" },
            presentPerfect: { I: "have gotten", you: "have gotten", "he/she/it": "has gotten", we: "have gotten", they: "have gotten" },
            pastPerfect: { I: "had gotten", you: "had gotten", "he/she/it": "had gotten", we: "had gotten", they: "had gotten" },
            futurePerfect: { I: "will have gotten", you: "will have gotten", "he/she/it": "will have gotten", we: "will have gotten", they: "will have gotten" }
        }
    },
    "make": {
        infinitive: "make",
        translation: "fazer/criar",
        forms: { base: "make", pastSimple: "made", pastParticiple: "made", presentParticiple: "making", thirdPerson: "makes" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["do", "create", "build", "produce"],
        explanation: "'Make' indica criar ou produzir algo tangível ('make a cake') ou causar um efeito ('make someone happy'). 'Make' + pessoa + verbo base = obrigar ('She made me do it').",
        examples: [
            { en: "I make coffee every morning.", pt: "Eu faço café toda manhã." },
            { en: "This song makes me happy.", pt: "Essa música me faz feliz." },
            { en: "We made a decision yesterday.", pt: "Nós tomamos uma decisão ontem." }
        ],
        tenses: {
            simplePresent: { I: "make", you: "make", "he/she/it": "makes", we: "make", they: "make" },
            simplePast: { I: "made", you: "made", "he/she/it": "made", we: "made", they: "made" },
            simpleFuture: { I: "will make", you: "will make", "he/she/it": "will make", we: "will make", they: "will make" },
            presentContinuous: { I: "am making", you: "are making", "he/she/it": "is making", we: "are making", they: "are making" },
            pastContinuous: { I: "was making", you: "were making", "he/she/it": "was making", we: "were making", they: "were making" },
            presentPerfect: { I: "have made", you: "have made", "he/she/it": "has made", we: "have made", they: "have made" },
            pastPerfect: { I: "had made", you: "had made", "he/she/it": "had made", we: "had made", they: "had made" },
            futurePerfect: { I: "will have made", you: "will have made", "he/she/it": "will have made", we: "will have made", they: "will have made" }
        }
    },
    "know": {
        infinitive: "know",
        translation: "saber/conhecer",
        forms: { base: "know", pastSimple: "knew", pastParticiple: "known", presentParticiple: "knowing", thirdPerson: "knows" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["understand", "learn", "recognize"],
        explanation: "'Know' cobre tanto 'saber' (informação) quanto 'conhecer' (pessoas/lugares). Não é usado no contínuo normalmente ('I know' não 'I am knowing'). 'Get to know' = conhecer gradualmente.",
        examples: [
            { en: "I know the answer.", pt: "Eu sei a resposta." },
            { en: "Do you know Maria?", pt: "Você conhece a Maria?" },
            { en: "He has known her since childhood.", pt: "Ele a conhece desde a infância." }
        ],
        tenses: {
            simplePresent: { I: "know", you: "know", "he/she/it": "knows", we: "know", they: "know" },
            simplePast: { I: "knew", you: "knew", "he/she/it": "knew", we: "knew", they: "knew" },
            simpleFuture: { I: "will know", you: "will know", "he/she/it": "will know", we: "will know", they: "will know" },
            presentContinuous: { I: "am knowing", you: "are knowing", "he/she/it": "is knowing", we: "are knowing", they: "are knowing" },
            pastContinuous: { I: "was knowing", you: "were knowing", "he/she/it": "was knowing", we: "were knowing", they: "were knowing" },
            presentPerfect: { I: "have known", you: "have known", "he/she/it": "has known", we: "have known", they: "have known" },
            pastPerfect: { I: "had known", you: "had known", "he/she/it": "had known", we: "had known", they: "had known" },
            futurePerfect: { I: "will have known", you: "will have known", "he/she/it": "will have known", we: "will have known", they: "will have known" }
        }
    },
    "think": {
        infinitive: "think",
        translation: "pensar",
        forms: { base: "think", pastSimple: "thought", pastParticiple: "thought", presentParticiple: "thinking", thirdPerson: "thinks" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["believe", "consider", "imagine", "suppose"],
        explanation: "'Think' expressa opinião ('I think it's good'), processo mental ('I'm thinking about it'), ou crença ('I think so'). 'Think of' = lembrar/imaginar. 'Think about' = considerar.",
        examples: [
            { en: "I think you are right.", pt: "Eu acho que você está certo." },
            { en: "What are you thinking about?", pt: "No que você está pensando?" },
            { en: "She thought it was a great idea.", pt: "Ela pensou que era uma ótima ideia." }
        ],
        tenses: {
            simplePresent: { I: "think", you: "think", "he/she/it": "thinks", we: "think", they: "think" },
            simplePast: { I: "thought", you: "thought", "he/she/it": "thought", we: "thought", they: "thought" },
            simpleFuture: { I: "will think", you: "will think", "he/she/it": "will think", we: "will think", they: "will think" },
            presentContinuous: { I: "am thinking", you: "are thinking", "he/she/it": "is thinking", we: "are thinking", they: "are thinking" },
            pastContinuous: { I: "was thinking", you: "were thinking", "he/she/it": "was thinking", we: "were thinking", they: "were thinking" },
            presentPerfect: { I: "have thought", you: "have thought", "he/she/it": "has thought", we: "have thought", they: "have thought" },
            pastPerfect: { I: "had thought", you: "had thought", "he/she/it": "had thought", we: "had thought", they: "had thought" },
            futurePerfect: { I: "will have thought", you: "will have thought", "he/she/it": "will have thought", we: "will have thought", they: "will have thought" }
        }
    },
    "take": {
        infinitive: "take",
        translation: "pegar/levar",
        forms: { base: "take", pastSimple: "took", pastParticiple: "taken", presentParticiple: "taking", thirdPerson: "takes" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["bring", "carry", "get", "grab"],
        explanation: "'Take' indica movimento com algo do ponto atual para outro lugar. Compare: 'take' (levar para lá) vs 'bring' (trazer para cá). Muito usado em expressões: 'take a shower', 'take a photo', 'take time'.",
        examples: [
            { en: "Take your umbrella, it might rain.", pt: "Leve seu guarda-chuva, pode chover." },
            { en: "How long does it take to get there?", pt: "Quanto tempo leva para chegar lá?" },
            { en: "She took a deep breath and smiled.", pt: "Ela respirou fundo e sorriu." }
        ],
        tenses: {
            simplePresent: { I: "take", you: "take", "he/she/it": "takes", we: "take", they: "take" },
            simplePast: { I: "took", you: "took", "he/she/it": "took", we: "took", they: "took" },
            simpleFuture: { I: "will take", you: "will take", "he/she/it": "will take", we: "will take", they: "will take" },
            presentContinuous: { I: "am taking", you: "are taking", "he/she/it": "is taking", we: "are taking", they: "are taking" },
            pastContinuous: { I: "was taking", you: "were taking", "he/she/it": "was taking", we: "were taking", they: "were taking" },
            presentPerfect: { I: "have taken", you: "have taken", "he/she/it": "has taken", we: "have taken", they: "have taken" },
            pastPerfect: { I: "had taken", you: "had taken", "he/she/it": "had taken", we: "had taken", they: "had taken" },
            futurePerfect: { I: "will have taken", you: "will have taken", "he/she/it": "will have taken", we: "will have taken", they: "will have taken" }
        }
    },
    "see": {
        infinitive: "see",
        translation: "ver",
        forms: { base: "see", pastSimple: "saw", pastParticiple: "seen", presentParticiple: "seeing", thirdPerson: "sees" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["look", "watch", "observe", "notice"],
        explanation: "'See' é percepção visual passiva (acontece naturalmente). Compare: 'see' (perceber) vs 'look at' (direcionar olhar) vs 'watch' (assistir atentamente). 'See' também significa entender ('I see what you mean').",
        examples: [
            { en: "I can see the mountains from here.", pt: "Eu consigo ver as montanhas daqui." },
            { en: "Did you see the news last night?", pt: "Você viu as notícias ontem à noite?" },
            { en: "We haven't seen each other in years.", pt: "Não nos vimos há anos." }
        ],
        tenses: {
            simplePresent: { I: "see", you: "see", "he/she/it": "sees", we: "see", they: "see" },
            simplePast: { I: "saw", you: "saw", "he/she/it": "saw", we: "saw", they: "saw" },
            simpleFuture: { I: "will see", you: "will see", "he/she/it": "will see", we: "will see", they: "will see" },
            presentContinuous: { I: "am seeing", you: "are seeing", "he/she/it": "is seeing", we: "are seeing", they: "are seeing" },
            pastContinuous: { I: "was seeing", you: "were seeing", "he/she/it": "was seeing", we: "were seeing", they: "were seeing" },
            presentPerfect: { I: "have seen", you: "have seen", "he/she/it": "has seen", we: "have seen", they: "have seen" },
            pastPerfect: { I: "had seen", you: "had seen", "he/she/it": "had seen", we: "had seen", they: "had seen" },
            futurePerfect: { I: "will have seen", you: "will have seen", "he/she/it": "will have seen", we: "will have seen", they: "will have seen" }
        }
    },
    "come": {
        infinitive: "come",
        translation: "vir",
        forms: { base: "come", pastSimple: "came", pastParticiple: "come", presentParticiple: "coming", thirdPerson: "comes" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["go", "arrive", "approach", "reach"],
        explanation: "'Come' indica movimento em direção ao falante ou a um ponto de referência. Oposto de 'go'. Phrasal verbs comuns: 'come in' (entrar), 'come back' (voltar), 'come from' (vir de).",
        examples: [
            { en: "Come here, please.", pt: "Venha aqui, por favor." },
            { en: "She came to visit us last weekend.", pt: "Ela veio nos visitar no fim de semana passado." },
            { en: "Where do you come from?", pt: "De onde você vem?" }
        ],
        tenses: {
            simplePresent: { I: "come", you: "come", "he/she/it": "comes", we: "come", they: "come" },
            simplePast: { I: "came", you: "came", "he/she/it": "came", we: "came", they: "came" },
            simpleFuture: { I: "will come", you: "will come", "he/she/it": "will come", we: "will come", they: "will come" },
            presentContinuous: { I: "am coming", you: "are coming", "he/she/it": "is coming", we: "are coming", they: "are coming" },
            pastContinuous: { I: "was coming", you: "were coming", "he/she/it": "was coming", we: "were coming", they: "were coming" },
            presentPerfect: { I: "have come", you: "have come", "he/she/it": "has come", we: "have come", they: "have come" },
            pastPerfect: { I: "had come", you: "had come", "he/she/it": "had come", we: "had come", they: "had come" },
            futurePerfect: { I: "will have come", you: "will have come", "he/she/it": "will have come", we: "will have come", they: "will have come" }
        }
    },
    "want": {
        infinitive: "want",
        translation: "querer",
        forms: { base: "want", pastSimple: "wanted", pastParticiple: "wanted", presentParticiple: "wanting", thirdPerson: "wants" },
        irregular: false,
        tags: ["regular", "essential"],
        related: ["need", "desire", "wish", "require"],
        explanation: "'Want' expressa desejo ou necessidade. Seguido de 'to + verbo' ('I want to go') ou objeto ('I want coffee'). 'Would like' é a forma mais educada de 'want' ('Would you like some tea?').",
        examples: [
            { en: "I want to learn English.", pt: "Eu quero aprender inglês." },
            { en: "Do you want some water?", pt: "Você quer um pouco de água?" },
            { en: "She wanted to be a doctor.", pt: "Ela queria ser médica." }
        ],
        tenses: {
            simplePresent: { I: "want", you: "want", "he/she/it": "wants", we: "want", they: "want" },
            simplePast: { I: "wanted", you: "wanted", "he/she/it": "wanted", we: "wanted", they: "wanted" },
            simpleFuture: { I: "will want", you: "will want", "he/she/it": "will want", we: "will want", they: "will want" },
            presentContinuous: { I: "am wanting", you: "are wanting", "he/she/it": "is wanting", we: "are wanting", they: "are wanting" },
            pastContinuous: { I: "was wanting", you: "were wanting", "he/she/it": "was wanting", we: "were wanting", they: "were wanting" },
            presentPerfect: { I: "have wanted", you: "have wanted", "he/she/it": "has wanted", we: "have wanted", they: "have wanted" },
            pastPerfect: { I: "had wanted", you: "had wanted", "he/she/it": "had wanted", we: "had wanted", they: "had wanted" },
            futurePerfect: { I: "will have wanted", you: "will have wanted", "he/she/it": "will have wanted", we: "will have wanted", they: "will have wanted" }
        }
    },
    "give": {
        infinitive: "give",
        translation: "dar",
        forms: { base: "give", pastSimple: "gave", pastParticiple: "given", presentParticiple: "giving", thirdPerson: "gives" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["receive", "take", "offer", "provide"],
        explanation: "'Give' transfere algo para alguém. Estrutura: 'give + pessoa + coisa' ou 'give + coisa + to + pessoa'. Phrasal verbs: 'give up' (desistir), 'give back' (devolver), 'give away' (doar).",
        examples: [
            { en: "Can you give me some advice?", pt: "Você pode me dar um conselho?" },
            { en: "He gave her a beautiful ring.", pt: "Ele deu a ela um anel lindo." },
            { en: "Don't give up on your dreams.", pt: "Não desista dos seus sonhos." }
        ],
        tenses: {
            simplePresent: { I: "give", you: "give", "he/she/it": "gives", we: "give", they: "give" },
            simplePast: { I: "gave", you: "gave", "he/she/it": "gave", we: "gave", they: "gave" },
            simpleFuture: { I: "will give", you: "will give", "he/she/it": "will give", we: "will give", they: "will give" },
            presentContinuous: { I: "am giving", you: "are giving", "he/she/it": "is giving", we: "are giving", they: "are giving" },
            pastContinuous: { I: "was giving", you: "were giving", "he/she/it": "was giving", we: "were giving", they: "were giving" },
            presentPerfect: { I: "have given", you: "have given", "he/she/it": "has given", we: "have given", they: "have given" },
            pastPerfect: { I: "had given", you: "had given", "he/she/it": "had given", we: "had given", they: "had given" },
            futurePerfect: { I: "will have given", you: "will have given", "he/she/it": "will have given", we: "will have given", they: "will have given" }
        }
    },
    "find": {
        infinitive: "find",
        translation: "encontrar",
        forms: { base: "find", pastSimple: "found", pastParticiple: "found", presentParticiple: "finding", thirdPerson: "finds" },
        irregular: true,
        tags: ["irregular", "essential"],
        related: ["discover", "locate", "search", "seek"],
        explanation: "'Find' é descobrir ou localizar algo, seja procurando ou por acaso. 'Find out' = descobrir informação. 'Find' + adjetivo = achar/considerar ('I find it interesting').",
        examples: [
            { en: "I can't find my keys.", pt: "Não consigo achar minhas chaves." },
            { en: "She found a great restaurant downtown.", pt: "Ela encontrou um ótimo restaurante no centro." },
            { en: "Did you find out what happened?", pt: "Você descobriu o que aconteceu?" }
        ],
        tenses: {
            simplePresent: { I: "find", you: "find", "he/she/it": "finds", we: "find", they: "find" },
            simplePast: { I: "found", you: "found", "he/she/it": "found", we: "found", they: "found" },
            simpleFuture: { I: "will find", you: "will find", "he/she/it": "will find", we: "will find", they: "will find" },
            presentContinuous: { I: "am finding", you: "are finding", "he/she/it": "is finding", we: "are finding", they: "are finding" },
            pastContinuous: { I: "was finding", you: "were finding", "he/she/it": "was finding", we: "were finding", they: "were finding" },
            presentPerfect: { I: "have found", you: "have found", "he/she/it": "has found", we: "have found", they: "have found" },
            pastPerfect: { I: "had found", you: "had found", "he/she/it": "had found", we: "had found", they: "had found" },
            futurePerfect: { I: "will have found", you: "will have found", "he/she/it": "will have found", we: "will have found", they: "will have found" }
        }
    }
};

// Tense display names for UI
const tenseNames = {
    simplePresent: "Simple Present",
    simplePast: "Simple Past",
    simpleFuture: "Simple Future",
    presentContinuous: "Present Continuous",
    pastContinuous: "Past Continuous",
    presentPerfect: "Present Perfect",
    pastPerfect: "Past Perfect",
    futurePerfect: "Future Perfect"
};

// Export for use in other modules
window.verbDatabase = verbDatabase;
window.tenseNames = tenseNames;
