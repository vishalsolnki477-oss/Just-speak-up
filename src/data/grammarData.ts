import { GrammarTopic } from '../types/index.ts';

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'grammar_topic_1',
    title: 'Nouns & Pronouns',
    hindiTitle: 'संज्ञा और सर्वनाम (Nouns & Pronouns)',
    level: 'beginner',
    iconName: 'UserCheck',
    simpleExplanation: 'A noun is a naming word for a person, place, thing, or concept. A pronoun replaces a noun so we don\'t repeat the same word over and over.',
    hindiExplanation: 'Noun किसी भी व्यक्ति, वस्तु, स्थान या विचार का नाम है। Pronoun (जैसे He, She, It, They) Noun की जगह आता है ताकि हमें बार-बार एक ही नाम न दोहराना पड़े।',
    englishExamples: [
      { en: 'Rahul is an engineer. He works at Google.', hi: 'राहुल एक इंजीनियर है। वह गूगल में काम करता है।' },
      { en: 'The book is on the table. It is very interesting.', hi: 'किताब मेज पर है। वह बहुत रोचक है।' },
      { en: 'Pooja and Amit are friends. They study together.', hi: 'पूजा और अमित दोस्त हैं। वे एक साथ पढ़ते हैं।' },
    ],
    dailyLifeExamples: [
      { en: 'My phone is ringing. Can you pass it to me?', hi: 'मेरा फोन बज रहा है। क्या आप मुझे दे सकते हैं?' },
      { en: 'I saw my teacher at the market. She was shopping.', hi: 'मैंने अपने शिक्षक को बाजार में देखा। वह खरीदारी कर रही थीं।' },
    ],
    rules: [
      {
        rule: 'Subject Pronouns (I, You, He, She, It, We, They) do the action.',
        hindiRule: 'Subject Pronoun काम करने वाले के लिए प्रयुक्त होते हैं।',
        example: 'She invited us to the party.',
      },
      {
        rule: 'Object Pronouns (Me, You, Him, Her, It, Us, Them) receive the action.',
        hindiRule: 'Object Pronoun उस व्यक्ति या वस्तु के लिए आते हैं जिस पर काम का असर पड़ता है।',
        example: 'Give the keys to him.',
      },
      {
        rule: 'Possessive Pronouns show ownership (Mine, Yours, His, Hers, Ours, Theirs).',
        hindiRule: 'अधिकार या मालिकाना हक दर्शाने के लिए Possessive Pronoun का प्रयोग करें।',
        example: 'This laptop is mine.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'Myself is Amit from Jaipur.',
        correct: 'I am Amit from Jaipur. / My name is Amit.',
        explanation: '"Myself" is a reflexive pronoun and cannot be used as the subject of a sentence in introductions.',
        hindiTip: 'अपना परिचय देते समय कभी भी "Myself" से शुरुआत न करें। "I am" या "My name is" बोलें।',
      },
    ],
    quiz: [
      {
        id: 'q_noun_1',
        question: 'Rohit called me. ___ wanted to borrow my notes.',
        options: ['Him', 'He', 'His', 'Himself'],
        correctAnswer: 1,
        explanation: 'We need a subject pronoun here to refer to Rohit, which is "He".',
        hindiExplanation: 'रोहित विषय (Subject) है, इसलिए "He" का प्रयोग होगा।',
      },
      {
        id: 'q_noun_2',
        question: 'Which of the following is an Object Pronoun?',
        options: ['They', 'We', 'Us', 'She'],
        correctAnswer: 2,
        explanation: '"Us" is the object pronoun form of "We".',
        hindiExplanation: '"Us" एक Object Pronoun है जिसका अर्थ "हमें" होता है।',
      },
    ],
  },
  {
    id: 'grammar_topic_2',
    title: 'Verbs & Adjectives',
    hindiTitle: 'क्रिया और विशेषण (Verbs & Adjectives)',
    level: 'beginner',
    iconName: 'Zap',
    simpleExplanation: 'Verbs express action (run, speak) or state of being (is, seem). Adjectives describe or modify nouns (blue, fast, energetic).',
    hindiExplanation: 'Verb (क्रिया) किसी काम या अवस्था को दर्शाती है (जैसे खाना, पढ़ना, होना)। Adjective (विशेषण) Noun की विशेषता या गुण बताता है (जैसे सुंदर, तेज, पुराना)।',
    englishExamples: [
      { en: 'Ankit drives a modern electric car.', hi: 'अंकित एक आधुनिक इलेक्ट्रिक कार चलाता है।' },
      { en: 'She speaks fluent English.', hi: 'वह धाराप्रवाह अंग्रेजी बोलती है।' },
    ],
    dailyLifeExamples: [
      { en: 'The hot tea burned my tongue.', hi: 'गर्म चाय ने मेरी जीभ जला दी।' },
      { en: 'They bought a comfortable new sofa.', hi: 'उन्होंने एक आरामदायक नया सोफा खरीदा।' },
    ],
    rules: [
      {
        rule: 'Action verbs show physical or mental activities (think, walk, build).',
        hindiRule: 'Action verbs काम करने को दर्शाती हैं।',
        example: 'She practices speaking every morning.',
      },
      {
        rule: 'Adjectives usually come before the noun they describe.',
        hindiRule: 'विशेषण आमतौर पर उस संज्ञा से पहले आता है जिसकी वह विशेषता बताता है।',
        example: 'A bright student.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'He speaks very good.',
        correct: 'He speaks very well.',
        explanation: '"Good" is an adjective; to describe a verb (speaks), use the adverb "well".',
        hindiTip: 'क्रिया की तारीफ करने के लिए "well" का इस्तेमाल करें, "good" का नहीं।',
      },
    ],
    quiz: [
      {
        id: 'q_verb_1',
        question: 'Identify the adjective in: "Priya wore an elegant dress."',
        options: ['Priya', 'wore', 'elegant', 'dress'],
        correctAnswer: 2,
        explanation: '"Elegant" describes the noun "dress", making it the adjective.',
        hindiExplanation: '"Elegant" (सुंदर/सुरुचिपूर्ण) शब्द ड्रेस की विशेषता बता रहा है।',
      },
    ],
  },
  {
    id: 'grammar_topic_3',
    title: 'Articles (A, An, The)',
    hindiTitle: 'आर्टिकल्स (A, An, The का सही नियम)',
    level: 'beginner',
    iconName: 'BookMarked',
    simpleExplanation: 'Articles define whether a noun is specific or unspecific. Use "A" before consonant sounds, "An" before vowel sounds, and "The" for specific nouns.',
    hindiExplanation: 'A और An का उपयोग एकवचन और अनिश्चित चीजों के लिए होता है। An स्वर ध्वनि (अ, आ, इ, ई, ए, ओ) से शुरू होने वाले शब्दों के आगे आता है। The खास या निश्चित चीजों के लिए आता है।',
    englishExamples: [
      { en: 'I saw an eagle in the sky.', hi: 'मैंने आसमान में एक चील देखी।' },
      { en: 'She is a university student.', hi: 'वह एक विश्वविद्यालय की छात्रा है। (University starts with /j/ sound, so "a" is used!)' },
      { en: 'The sun gives us light and warmth.', hi: 'सूरज हमें प्रकाश और गर्माहट देता है।' },
    ],
    dailyLifeExamples: [
      { en: 'Can I have an apple and a glass of milk?', hi: 'क्या मुझे एक सेब और एक गिलास दूध मिल सकता है?' },
      { en: 'Turn off the lights before leaving.', hi: 'जाने से पहले लाइट बंद कर दें।' },
    ],
    rules: [
      {
        rule: 'Sound matters, not the written letter! "An hour" (silent H = vowel sound), but "A European" (sounds like "you").',
        hindiRule: "अक्षर नहीं, बल्कि बोलने की ध्वनि (Sound) देखें! 'Hour' में 'आ' की ध्वनि आती है इसलिए An लगेगा।",
        example: 'He waited for an hour.',
      },
      {
        rule: 'Use "The" when both speaker and listener know which specific item is referred to.',
        hindiRule: 'जब दोनों को पता हो कि किस खास चीज की बात हो रही है, तब "The" लगाएं।',
        example: 'The dog that barked last night is quiet today.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'He is an honest man? No: He is an honest man is correct! Wrong: He is a honest man.',
        correct: 'He is an honest man.',
        explanation: 'The "h" in honest is silent; it begins with an /ɒ/ vowel sound, so use "an".',
        hindiTip: 'Honest में H साइलेंट होता है, इसलिए "An honest" बोला जाता है।',
      },
    ],
    quiz: [
      {
        id: 'q_art_1',
        question: 'Fill in the blank: "It takes ___ hour to reach the airport."',
        options: ['a', 'an', 'the', 'no article needed'],
        correctAnswer: 1,
        explanation: '"Hour" starts with a vowel sound /aʊər/, so "an" is used.',
        hindiExplanation: '"Hour" में H की आवाज नहीं आती, बल्कि अ की आवाज आती है, इसलिए "an" आएगा।',
      },
    ],
  },
  {
    id: 'grammar_topic_4',
    title: 'Prepositions (In, On, At, To, For, With)',
    hindiTitle: 'पूर्वसर्ग (In, On, At, To, For का सटीक प्रयोग)',
    level: 'intermediate',
    iconName: 'Compass',
    simpleExplanation: 'Prepositions show relationships between nouns and other words, usually indicating time, place, direction, or purpose.',
    hindiExplanation: 'Prepositions समय, स्थान और दिशा का संबंध बताते हैं। उदाहरण: At (सटीक समय/जगह), On (सतह या दिन), In (महीने, साल या अंदर)।',
    englishExamples: [
      { en: 'The meeting starts at 4:00 PM on Friday.', hi: 'बैठक शुक्रवार को शाम 4:00 बजे शुरू होगी।' },
      { en: 'She lives in Mumbai.', hi: 'वह मुंबई में रहती है।' },
      { en: 'He was waiting for his friend at the station.', hi: 'वह स्टेशन पर अपने दोस्त का इंतजार कर रहा था।' },
    ],
    dailyLifeExamples: [
      { en: 'I left my keys on the kitchen counter.', hi: 'मैंने अपनी चाबियां रसोई के काउंटर पर छोड़ दीं।' },
      { en: 'We will meet in December.', hi: 'हम दिसंबर में मिलेंगे।' },
    ],
    rules: [
      {
        rule: 'Time: AT for precise time (at 5 PM, at midnight), ON for days & dates (on Monday, on 15th August), IN for months, years, seasons (in July, in 2026).',
        hindiRule: 'समय: At निश्चित समय के लिए, On दिन और तारीख के लिए, In महीने और साल के लिए।',
        example: 'I wake up at 6 AM.',
      },
      {
        rule: 'Place: AT for specific points (at the door), ON for surfaces (on the floor), IN for enclosed spaces or cities (in the room, in India).',
        hindiRule: 'स्थान: At निश्चित बिंदु, On सतह पर, In चारों ओर से घिरी जगह या शहर के लिए।',
        example: 'He is sitting in the cafe.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'I will meet you in Monday at morning.',
        correct: 'I will meet you on Monday in the morning.',
        explanation: 'Days of the week require "on", and parts of the day require "in the morning".',
        hindiTip: 'दिन के लिए "on Monday" और सुबह के लिए "in the morning" कहें।',
      },
    ],
    quiz: [
      {
        id: 'q_prep_1',
        question: 'Fill in the blank: "Our annual conference will be held ___ October."',
        options: ['at', 'on', 'in', 'to'],
        correctAnswer: 2,
        explanation: 'Months take the preposition "in" (in October).',
        hindiExplanation: 'महीनों के नाम के पहले हमेशा "in" का प्रयोग होता है।',
      },
    ],
  },
  {
    id: 'grammar_topic_5',
    title: 'Mastering English Tenses',
    hindiTitle: 'काल (12 Tenses का संपूर्ण खाका)',
    level: 'intermediate',
    iconName: 'Clock',
    simpleExplanation: 'Tenses tell when an action takes place: Past, Present, or Future, each split into Simple, Continuous, Perfect, and Perfect Continuous.',
    hindiExplanation: 'काल बताते हैं कि कोई काम कब हुआ: भूतकाल, वर्तमान काल, या भविष्य काल। इनके मुख्य भेद: Simple (आदत/तथ्य), Continuous (जारी काम), Perfect (पूर्ण काम)।',
    englishExamples: [
      { en: 'Present Simple: I write code everyday.', hi: 'मैं रोज कोड लिखता हूँ।' },
      { en: 'Present Continuous: I am writing code right now.', hi: 'मैं अभी कोड लिख रहा हूँ।' },
      { en: 'Present Perfect: I have already written the code.', hi: 'मैं पहले ही कोड लिख चुका हूँ।' },
    ],
    dailyLifeExamples: [
      { en: 'She has been studying English for two hours.', hi: 'वह दो घंटे से अंग्रेजी पढ़ रही है।' },
      { en: 'We went to the movie yesterday.', hi: 'हम कल फिल्म देखने गए थे।' },
    ],
    rules: [
      {
        rule: 'Present Perfect formula: Subject + have/has + Past Participle (V3).',
        hindiRule: 'Present Perfect में has/have के साथ क्रिया का तीसरा रूप (V3) लगता है।',
        example: 'They have finished their breakfast.',
      },
      {
        rule: 'Use "since" for a specific point in time (since 2020, since morning) and "for" for duration (for 3 years, for 2 hours).',
        hindiRule: '"Since" निश्चित समय बिंदु के लिए, और "For" समय की अवधि (कितने घंटे/साल) के लिए।',
        example: 'I have known him for five years.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'I am living here since 2018.',
        correct: 'I have been living here since 2018.',
        explanation: 'When expressing an action continuing from the past into the present with "since", use Present Perfect Continuous.',
        hindiTip: 'समय के साथ चल रहे काम के लिए "have been living" बोलें, "am living" नहीं।',
      },
    ],
    quiz: [
      {
        id: 'q_tenses_1',
        question: 'Choose the correct form: "She ___ to London three times this year."',
        options: ['goes', 'has gone', 'is going', 'went'],
        correctAnswer: 1,
        explanation: 'Present perfect indicates completed visits in an ongoing time period (this year).',
        hindiExplanation: 'इस वर्ष के दौरान यात्रा पूरी होने के लिए "has gone / has been" प्रयुक्त होता है।',
      },
    ],
  },
  {
    id: 'grammar_topic_6',
    title: 'Modals (Can, Could, Should, Would, May, Might, Must)',
    hindiTitle: 'मोडल्स (Can, Could, Should, Must का सही उपयोग)',
    level: 'intermediate',
    iconName: 'Sparkles',
    simpleExplanation: 'Modal auxiliary verbs express ability (can), permission (may), advice (should), possibility (might), or obligation (must).',
    hindiExplanation: 'Modals सहायक क्रियाएं हैं जो क्षमता (Can), सलाह (Should), संभावना (Might), विनम्र निवेदन (Could/Would) और अनिवार्यता (Must) दर्शाती हैं।',
    englishExamples: [
      { en: 'You should drink more water.', hi: 'आपको अधिक पानी पीना चाहिए। (Advice)' },
      { en: 'Could you please repeat that?', hi: 'क्या आप कृपया उसे दोहरा सकते हैं? (Polite request)' },
      { en: 'It might rain tonight.', hi: 'आज रात बारिश हो सकती है। (Possibility)' },
    ],
    dailyLifeExamples: [
      { en: 'I can speak two languages.', hi: 'मैं दो भाषाएं बोल सकता हूँ।' },
      { en: 'You must wear a helmet while riding a bike.', hi: 'बाइक चलाते समय हेलमेट पहनना अनिवार्य है।' },
    ],
    rules: [
      {
        rule: 'Modal verbs are always followed by the base form of the main verb (V1) without "to".',
        hindiRule: 'Modals के बाद हमेशा क्रिया का पहला रूप (V1) आता है, "to" नहीं लगता।',
        example: 'He can swim (NOT He can to swim).',
      },
    ],
    commonMistakes: [
      {
        wrong: 'He should to apologize.',
        correct: 'He should apologize.',
        explanation: 'Never put "to" directly after modal verbs like should, can, could, must.',
        hindiTip: 'Should के बाद "to" कभी न लगाएं। सीधा "should apologize" बोलें।',
      },
    ],
    quiz: [
      {
        id: 'q_modals_1',
        question: 'Which modal expresses a strong obligation / necessity?',
        options: ['Might', 'Must', 'Could', 'May'],
        correctAnswer: 1,
        explanation: '"Must" indicates absolute necessity or strict obligation.',
        hindiExplanation: '"Must" का अर्थ अनिवार्य या पक्का जरूरी होता है।',
      },
    ],
  },
  {
    id: 'grammar_topic_7',
    title: 'Active & Passive Voice',
    hindiTitle: 'कर्तृवाच्य और कर्मवाच्य (Active & Passive Voice)',
    level: 'intermediate',
    iconName: 'Repeat',
    simpleExplanation: 'In Active Voice, the subject performs the action. In Passive Voice, the subject receives the action, shifting focus onto the result or action itself.',
    hindiExplanation: 'Active Voice में काम करने वाला मुख्य होता है (जैसे "पुलिस ने चोर पकड़ा")। Passive Voice में काम का शिकार या परिणाम मुख्य होता है (जैसे "चोर पकड़ा गया")।',
    englishExamples: [
      { en: 'Active: The chef cooks delicious meals.', hi: 'शेफ स्वादिष्ट भोजन पकाता है।' },
      { en: 'Passive: Delicious meals are cooked by the chef.', hi: 'स्वादिष्ट भोजन शेफ द्वारा पकाया जाता है।' },
    ],
    dailyLifeExamples: [
      { en: 'The flyover was inaugurated yesterday.', hi: 'फ्लाईओवर का उद्घाटन कल किया गया था।' },
      { en: 'Your parcel has been delivered.', hi: 'आपका पार्सल डिलीवर कर दिया गया है।' },
    ],
    rules: [
      {
        rule: 'Passive formula: Form of "be" + Past Participle (V3).',
        hindiRule: 'Passive Voice में हमेशा "Be" (is/am/are/was/were/been) + V3 आता है।',
        example: 'The letter was mailed this morning.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'The car was repair yesterday.',
        correct: 'The car was repaired yesterday.',
        explanation: 'Passive voice strictly requires the past participle (V3) form: repaired.',
        hindiTip: 'Passive voice में हमेशा 3rd form (V3) आती है: "was repaired".',
      },
    ],
    quiz: [
      {
        id: 'q_voice_1',
        question: 'Transform to passive: "They completed the project on time."',
        options: [
          'The project was completed on time by them.',
          'The project is completed on time.',
          'They was completed the project.',
          'The project completed them.',
        ],
        correctAnswer: 0,
        explanation: 'Past simple passive uses was/were + V3: "was completed".',
        hindiExplanation: 'भूतकाल के passive में "was completed" आएगा।',
      },
    ],
  },
  {
    id: 'grammar_topic_8',
    title: 'Direct & Indirect Speech',
    hindiTitle: 'प्रत्यक्ष और अप्रत्यक्ष कथन (Reported Speech)',
    level: 'intermediate',
    iconName: 'MessageSquare',
    simpleExplanation: 'Direct speech quotes the exact words spoken inside quotation marks. Indirect (reported) speech conveys the meaning without quoting word-for-word, usually shifting tense back.',
    hindiExplanation: 'Direct speech में किसी की कही बात हूबहू दोहराते हैं। Indirect speech में हम किसी और को बताते हैं कि उसने क्या कहा था, जिससे Tense और Pronouns बदल जाते हैं।',
    englishExamples: [
      { en: 'Direct: She said, "I am very busy today."', hi: 'उसने कहा, "मैं आज बहुत व्यस्त हूँ।"' },
      { en: 'Indirect: She said that she was very busy that day.', hi: 'उसने कहा कि वह उस दिन बहुत व्यस्त थी।' },
    ],
    dailyLifeExamples: [
      { en: 'My boss told me that the meeting was postponed.', hi: 'मेरे बॉस ने मुझे बताया कि बैठक स्थगित कर दी गई थी।' },
    ],
    rules: [
      {
        rule: 'When the reporting verb is in the past (said/told), present tenses generally shift back to past tenses.',
        hindiRule: 'यदि रिपोर्टिंग वर्ब भूतकाल (said) में हो, तो बात का Tense भी पास्ट में बदल जाता है (am/is -> was).',
        example: 'He said he lived in Pune.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'She told to me that she was leaving.',
        correct: 'She told me that she was leaving. / She said to me that she was leaving.',
        explanation: '"Told" is transitive and takes a direct object without "to".',
        hindiTip: '"Told" के बाद "to" न लगाएं; सीधे "She told me" कहें।',
      },
    ],
    quiz: [
      {
        id: 'q_speech_1',
        question: 'Direct: Amit said, "I have passed the test." What is the reported speech?',
        options: [
          'Amit said that he has passed the test.',
          'Amit said that he had passed the test.',
          'Amit told he pass the test.',
          'Amit said I passed the test.',
        ],
        correctAnswer: 1,
        explanation: 'Present perfect ("have passed") shifts back to past perfect ("had passed").',
        hindiExplanation: 'Present Perfect बदलकर Past Perfect (had passed) बन जाता है।',
      },
    ],
  },
  {
    id: 'grammar_topic_9',
    title: 'Conjunctions (And, But, Because, Although, Unless)',
    hindiTitle: 'योजक शब्द (Conjunctions - वाक्यों को जोड़ना)',
    level: 'intermediate',
    iconName: 'Link2',
    simpleExplanation: 'Conjunctions connect words, phrases, or clauses together, establishing relationships such as addition (and), contrast (but, although), reason (because), or condition (unless).',
    hindiExplanation: 'Conjunctions दो शब्दों या वाक्यों को आपस में जोड़ते हैं। जैसे: And (और), But (लेकिन), Because (क्योंकि), Although (यद्यपि), Unless (जब तक नहीं)।',
    englishExamples: [
      { en: 'I wanted to attend the workshop, but it was already fully booked.', hi: 'मैं कार्यशाला में भाग लेना चाहता था, लेकिन वह पहले से ही भरी हुई थी।' },
      { en: 'You cannot succeed unless you work consistently.', hi: 'आप तब तक सफल नहीं हो सकते जब तक आप लगातार मेहनत न करें।' },
    ],
    dailyLifeExamples: [
      { en: 'Take an umbrella because it looks like rain.', hi: 'छाता ले लो क्योंकि बारिश जैसी संभावना है।' },
    ],
    rules: [
      {
        rule: '"Unless" already means "if not", so do NOT use a negative word inside the unless clause.',
        hindiRule: '"Unless" में पहले से "नहीं" शामिल होता है, इसलिए इसके साथ not न लगाएं।',
        example: 'Unless you leave now, you will miss the train.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'Although he worked hard, but he failed.',
        correct: 'Although he worked hard, he failed. / He worked hard, but he failed.',
        explanation: 'Never use "although" and "but" together in the same sentence; choose one.',
        hindiTip: 'Although और But को एक साथ एक ही वाक्य में कभी न लगाएं।',
      },
    ],
    quiz: [
      {
        id: 'q_conj_1',
        question: 'Fill in the blank: "We won\'t start the meeting ___ our manager arrives."',
        options: ['because', 'unless', 'until', 'although'],
        correctAnswer: 2,
        explanation: '"Until" expresses up to the point in time.',
        hindiExplanation: '"Until" समय सीमा तक प्रतीक्षा को दर्शाता है (जब तक मैनेजर न आ जाएं)।',
      },
    ],
  },
  {
    id: 'grammar_topic_10',
    title: 'Subject-Verb Agreement',
    hindiTitle: 'कर्ता और क्रिया का तालमेल (Subject-Verb Agreement)',
    level: 'intermediate',
    iconName: 'CheckCircle2',
    simpleExplanation: 'Singular subjects take singular verbs, and plural subjects take plural verbs. This is the single most important rule for natural English.',
    hindiExplanation: 'एकवचन कर्ता (Singular Subject) के साथ एकवचन क्रिया (is, has, verb+s/es) और बहुवचन (Plural Subject) के साथ बहुवचन क्रिया (are, have, base verb) आती है।',
    englishExamples: [
      { en: 'The list of items is on the desk. (Subject is "list", singular)', hi: 'वस्तुओं की सूची मेज पर है।' },
      { en: 'Everyone has submitted their feedback.', hi: 'हर किसी ने अपना फीडबैक जमा कर दिया है।' },
    ],
    dailyLifeExamples: [
      { en: 'Neither of the proposals is acceptable.', hi: 'दोनों में से कोई भी प्रस्ताव स्वीकार्य नहीं है।' },
    ],
    rules: [
      {
        rule: 'Words like everyone, someone, nobody, each, either, neither are grammatically singular.',
        hindiRule: 'Everyone, Someone, Each, Neither जैसे शब्द व्याकरण के अनुसार एकवचन होते हैं।',
        example: 'Everyone is excited about the picnic.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'One of my friend live in Canada.',
        correct: 'One of my friends lives in Canada.',
        explanation: '"One of + plural noun" takes a singular verb (lives) because the subject is "One".',
        hindiTip: '"One of my friends" में क्रिया singular होगी: "lives", live नहीं।',
      },
    ],
    quiz: [
      {
        id: 'q_sva_1',
        question: 'Fill in the blank: "Neither the teacher nor the students ___ present."',
        options: ['was', 'were', 'is', 'are not'],
        correctAnswer: 1,
        explanation: 'When subjects are connected by "neither... nor", the verb agrees with the closer subject ("students" = plural = were).',
        hindiExplanation: 'Neither...nor में क्रिया पास वाले कर्ता (students = बहुवचन) के अनुसार "were" होगी।',
      },
    ],
  },
  {
    id: 'grammar_topic_11',
    title: 'Conditional Sentences (Zero, 1st, 2nd, 3rd)',
    hindiTitle: 'शर्त वाले वाक्य (Conditionals: If वाक्यों के 4 प्रकार)',
    level: 'advanced',
    iconName: 'GitFork',
    simpleExplanation: 'Conditionals express hypothetical or real scenarios with "if": Zero (scientific facts), 1st (real future possibilities), 2nd (imaginary present), 3rd (past regrets).',
    hindiExplanation: 'अगर/यदि वाले वाक्य: Type 1 (संभावना: If it rains, I will stay), Type 2 (काल्पनिक वर्तमान: If I were rich, I would travel), Type 3 (बीता हुआ पछतावा: If I had studied, I would have passed)।',
    englishExamples: [
      { en: '1st: If you study hard, you will clear the exam.', hi: 'यदि आप मेहनत करेंगे, तो परीक्षा पास कर लेंगे।' },
      { en: '2nd: If I had wings, I would fly across mountains.', hi: 'यदि मेरे पंख होते, तो मैं पहाड़ों पर उड़ता।' },
      { en: '3rd: If I had left earlier, I would not have missed the flight.', hi: 'अगर मैं पहले निकला होता, तो फ्लाइट नहीं छूटती।' },
    ],
    dailyLifeExamples: [
      { en: 'If you boil water at 100°C, it evaporates.', hi: 'यदि आप 100°C पर पानी उबालते हैं, तो वह वाष्प बन जाता है।' },
    ],
    rules: [
      {
        rule: 'Second conditional uses past simple in the "if" clause and "would + V1" in the main clause.',
        hindiRule: 'काल्पनिक स्थिति (Second conditional) में If के साथ Past Tense और आगे would + V1 आता है।',
        example: 'If I were you, I would accept the offer.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'If I will come tomorrow, I will call you.',
        correct: 'If I come tomorrow, I will call you.',
        explanation: 'In the first conditional, the "if" clause never uses "will"; use simple present.',
        hindiTip: 'If वाले हिस्से में कभी भी "will" का प्रयोग न करें। "If I come" बोलें।',
      },
    ],
    quiz: [
      {
        id: 'q_cond_1',
        question: 'Complete the sentence: "If she had warned me, I ___ the contract."',
        options: [
          'would not sign',
          'would not have signed',
          'will not sign',
          'did not sign',
        ],
        correctAnswer: 1,
        explanation: 'Third conditional pattern: If + had + V3, would have + V3.',
        hindiExplanation: 'Third conditional में "would not have signed" आएगा।',
      },
    ],
  },
  {
    id: 'grammar_topic_12',
    title: 'Sentence Structure (Simple, Compound, Complex)',
    hindiTitle: 'वाक्य संरचना (सरल, संयुक्त और मिश्रित वाक्य)',
    level: 'advanced',
    iconName: 'Layers',
    simpleExplanation: 'Sentence variety makes your English elegant. Learn how to mix independent and dependent clauses to sound natural, persuasive, and sophisticated.',
    hindiExplanation: 'Simple (एक विचार), Compound (दो समान विचारों का जोड़), और Complex (एक मुख्य और एक आश्रित विचार) वाक्यों को मिलाकर बोलने से अंग्रेजी स्वाभाविक और प्रभावशाली बनती है।',
    englishExamples: [
      { en: 'Simple: She loves playing the violin.', hi: 'वह वायलिन बजाना पसंद करती है।' },
      { en: 'Compound: The weather was harsh, yet the team marched forward.', hi: 'मौसम खराब था, फिर भी टीम आगे बढ़ती रही।' },
      { en: 'Complex: Because we initiated the project early, we met all client milestones.', hi: 'क्योंकि हमने प्रोजेक्ट जल्दी शुरू किया था, हमने सारे माइलस्टोन हासिल किए।' },
    ],
    dailyLifeExamples: [
      { en: 'Although he had never spoken in public before, his speech captivated the entire hall.', hi: 'हालाँकि उसने पहले कभी मंच पर नहीं बोला था, उसके भाषण ने पूरे हॉल को मंत्रमुग्ध कर दिया।' },
    ],
    rules: [
      {
        rule: 'Avoid run-on sentences: Two independent clauses must be joined by a comma and conjunction (FANBOYS) or a semicolon.',
        hindiRule: 'दो पूरे वाक्यों को बिना पंक्चुएशन या कंजंक्शन के सीधे न जोड़ें।',
        example: 'I wanted coffee, so I stopped at the cafe.',
      },
    ],
    commonMistakes: [
      {
        wrong: 'I was very tired I went to sleep.',
        correct: 'I was very tired, so I went to sleep. / I was very tired; I went to sleep.',
        explanation: 'This is a run-on sentence. Separate independent thoughts with a coordinating conjunction or punctuation.',
        hindiTip: 'दो पूरे विचारों के बीच ", so" या फुल स्टॉप लगाएं।',
      },
    ],
    quiz: [
      {
        id: 'q_struct_1',
        question: 'Identify the sentence type: "While the students took the exam, the proctor remained silent."',
        options: ['Simple', 'Compound', 'Complex', 'Compound-Complex'],
        correctAnswer: 2,
        explanation: 'It contains one dependent clause ("While the students took the exam") and one independent clause ("the proctor remained silent").',
        hindiExplanation: 'यह एक Complex (मिश्रित) वाक्य है क्योंकि इसमें एक आश्रित उपवाक्य जुड़ा है।',
      },
    ],
  },
];
