import { LearningLevel } from '../types/index.ts';

export interface CurriculumLesson {
  id: string;
  title: string;
  hindiTitle: string;
  level: LearningLevel;
  durationMin: number;
  description: string;
  hindiDescription: string;
  keyPoints: { en: string; hi: string }[];
  practiceSentences: { en: string; hi: string; audioTip?: string }[];
  miniQuiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
}

export const CURRICULUM_DATA: Record<LearningLevel, CurriculumLesson[]> = {
  beginner: [
    {
      id: 'beg_lesson_1',
      title: 'English Alphabet & Phonics Sounds',
      hindiTitle: 'वर्णमाला और सही उच्चारण',
      level: 'beginner',
      durationMin: 10,
      description: 'Master the 26 letters, 5 vowels (A, E, I, O, U), and core phonetic sounds to pronounce any word accurately.',
      hindiDescription: '26 अक्षर, 5 स्वर और उनके सही उच्चारण सीखें ताकि आप किसी भी शब्द को सही बोल सकें।',
      keyPoints: [
        { en: 'English has 26 letters with 44 distinct sounds (phonemes).', hi: 'अंग्रेजी में 26 अक्षर होते हैं लेकिन 44 ध्वनियां होती हैं।' },
        { en: 'Vowels (A, E, I, O, U) give voice to every English word.', hi: 'स्वर (Vowels) हर शब्द को आवाज देते हैं।' },
        { en: 'Pronounce "C" as /k/ before a, o, u (Cat) and as /s/ before e, i, y (City).', hi: '"C" का उच्चारण कैट (Cat) या सिटी (City) जैसा होता है।' },
      ],
      practiceSentences: [
        { en: 'A apple is on the table.', hi: 'सेब मेज पर है।' },
        { en: 'Sun rises in the east.', hi: 'सूरज पूर्व में उगता है।' },
        { en: 'The cat sits on the mat.', hi: 'बिल्ली चटाई पर बैठी है।' },
      ],
      miniQuiz: [
        {
          question: 'Which of the following is NOT an English vowel?',
          options: ['A', 'E', 'B', 'O'],
          answer: 2,
          explanation: 'B is a consonant. The 5 vowels are A, E, I, O, and U.',
        },
        {
          question: 'How do you pronounce "P-H" in "Phone"?',
          options: ['Like /p/', 'Like /f/', 'Like /b/', 'Like /h/'],
          answer: 1,
          explanation: '"PH" usually sounds like /f/, as in Phone, Photo, Elephant.',
        },
      ],
    },
    {
      id: 'beg_lesson_2',
      title: 'Basic Vocabulary (Everyday Objects & Family)',
      hindiTitle: 'दैनिक उपयोग के शब्द और रिश्ते',
      level: 'beginner',
      durationMin: 12,
      description: 'Build your foundation with 30 essential words for home, food, time, and family members.',
      hindiDescription: 'घर, भोजन, समय और परिवार के आवश्यक 30 बुनियादी शब्द सीखें।',
      keyPoints: [
        { en: 'Family: Father (पिता), Mother (माता), Brother (भाई), Sister (बहन).', hi: 'परिवार के सदस्यों के नाम अंग्रेजी में।' },
        { en: 'Home: Door (दरवाजा), Window (खिड़की), Kitchen (रसोई), Bed (बिस्तर).', hi: 'घर की जरूरी चीजों के नाम।' },
        { en: 'Time: Morning (सुबह), Afternoon (दोपहर), Evening (शाम), Night (रात).', hi: 'दिन के पहर के नाम।' },
      ],
      practiceSentences: [
        { en: 'This is my family.', hi: 'यह मेरा परिवार है।' },
        { en: 'Please open the door.', hi: 'कृपया दरवाजा खोलें।' },
        { en: 'Good morning, have a nice day!', hi: 'शुभ प्रभात, आपका दिन शुभ हो!' },
      ],
      miniQuiz: [
        {
          question: 'What is the English word for "रसोई"?',
          options: ['Bedroom', 'Kitchen', 'Balcony', 'Basement'],
          answer: 1,
          explanation: 'Kitchen means रसोई where food is prepared.',
        },
      ],
    },
    {
      id: 'beg_lesson_3',
      title: 'Daily-Use English Sentences',
      hindiTitle: 'रोजमर्रा में बोले जाने वाले वाक्य',
      level: 'beginner',
      durationMin: 15,
      description: 'Learn instant spoken sentences for greetings, polite requests, apologies, and basic reactions.',
      hindiDescription: 'नमस्ते, अनुरोध, माफी और बातचीत शुरू करने के तैयार वाक्य सीखें।',
      keyPoints: [
        { en: 'Use "Excuse me" to get someone\'s attention politely.', hi: 'ध्यान आकर्षित करने के लिए "Excuse me" कहें।' },
        { en: 'Say "How are you doing?" instead of just "Hello".', hi: 'हाल-चाल पूछने के लिए "How are you doing?" का प्रयोग करें।' },
        { en: 'Use "Could you please help me?" for polite requests.', hi: 'विनम्रता से मदद मांगने के लिए "Could you please..." कहें।' },
      ],
      practiceSentences: [
        { en: 'Nice to meet you!', hi: 'आपसे मिलकर बहुत खुशी हुई!' },
        { en: 'How much does this cost?', hi: 'इसकी कीमत कितनी है?' },
        { en: 'Where is the nearest bus stop?', hi: 'नजदीकी बस स्टॉप कहाँ है?' },
        { en: 'Thank you so much for your help.', hi: 'आपकी मदद के लिए बहुत-बहुत धन्यवाद।' },
      ],
      miniQuiz: [
        {
          question: 'When someone says "Thank you", what is the best polite reply?',
          options: ['No problem / You\'re welcome', 'Why thank you?', 'Yes okay', 'Go ahead'],
          answer: 0,
          explanation: '"You\'re welcome" or "No problem" is the natural, courteous response.',
        },
      ],
    },
    {
      id: 'beg_lesson_4',
      title: 'Basic Sentence Formation (Subject + Verb + Object)',
      hindiTitle: 'बुनियादी वाक्य रचना (S + V + O नियम)',
      level: 'beginner',
      durationMin: 15,
      description: 'Understand the fundamental golden rule of English sentences and how it differs from Hindi (SOV vs SVO).',
      hindiDescription: 'अंग्रेजी में पहले कर्ता (Subject), फिर क्रिया (Verb), फिर कर्म (Object) आता है।',
      keyPoints: [
        { en: 'Hindi order is Subject + Object + Verb (मैं चाय पीता हूँ).', hi: 'हिंदी में क्रिया अंत में आती है।' },
        { en: 'English order is Subject + Verb + Object (I drink tea).', hi: 'अंग्रेजी में क्रिया बीच में आती है।' },
        { en: 'Never omit the verb: "I happy" is wrong, "I am happy" is correct.', hi: 'सहायक क्रिया (am, is, are) कभी न छोड़ें।' },
      ],
      practiceSentences: [
        { en: 'I read books.', hi: 'मैं किताबें पढ़ता हूँ।' },
        { en: 'She speaks English.', hi: 'वह अंग्रेजी बोलती है।' },
        { en: 'They play football.', hi: 'वे फुटबॉल खेलते हैं।' },
      ],
      miniQuiz: [
        {
          question: 'Which sentence follows the correct English S+V+O order?',
          options: ['I football play', 'I play football', 'Football I play', 'Play I football'],
          answer: 1,
          explanation: 'Subject (I) + Verb (play) + Object (football).',
        },
      ],
    },
    {
      id: 'beg_lesson_5',
      title: 'Introduction to Is, Am, Are & Was, Were',
      hindiTitle: 'Is, Am, Are और Was, Were का सही प्रयोग',
      level: 'beginner',
      durationMin: 15,
      description: 'Master helping verbs to describe states, identities, professions, and emotions without hesitation.',
      hindiDescription: 'वर्तमान और भूतकाल में अवस्था या पहचान बताने के लिए सही सहायक क्रिया का प्रयोग।',
      keyPoints: [
        { en: 'I -> am (I am a student).', hi: 'I के साथ am लगेगा।' },
        { en: 'He / She / It / Singular -> is (She is busy).', hi: 'एकवचन के साथ is लगेगा।' },
        { en: 'You / We / They / Plural -> are (We are ready).', hi: 'बहुवचन और You के साथ are लगेगा।' },
        { en: 'Past: Was (I, He, She, It) / Were (You, We, They).', hi: 'भूतकाल में Was और Were का नियम।' },
      ],
      practiceSentences: [
        { en: 'I am ready to learn English.', hi: 'मैं अंग्रेजी सीखने के लिए तैयार हूँ।' },
        { en: 'They were very happy yesterday.', hi: 'वे कल बहुत खुश थे।' },
        { en: 'He is my best friend.', hi: 'वह मेरा सबसे अच्छा दोस्त है।' },
      ],
      miniQuiz: [
        {
          question: 'Fill in the blank: "They ___ late for the meeting today."',
          options: ['is', 'are', 'am', 'was'],
          answer: 1,
          explanation: '"They" is plural, so we use "are" in the present tense.',
        },
      ],
    },
    {
      id: 'beg_lesson_6',
      title: 'Simple Conversations (Greetings, Ordering Food, Shopping)',
      hindiTitle: 'सरल बातचीत (दुकान पर, होटल में, परिचय)',
      level: 'beginner',
      durationMin: 15,
      description: 'Real-life scripted dialogues you can practice right away in everyday situations.',
      hindiDescription: 'दुकानदार से बात करना, खाना ऑर्डर करना और नए लोगों से हाथ मिलाना।',
      keyPoints: [
        { en: 'At a cafe: "Can I please have a cup of black coffee?"', hi: 'कैफे में ऑर्डर करने का तरीका।' },
        { en: 'In a store: "Do you have this in a medium size?"', hi: 'साइज या रंग पूछने का तरीका।' },
        { en: 'Paying: "Can I pay by card or UPI?"', hi: 'भुगतान के साधन पूछना।' },
      ],
      practiceSentences: [
        { en: 'Hello, I would like to order two teas, please.', hi: 'नमस्ते, मुझे दो चाय चाहिए कृपया।' },
        { en: 'Where can I find mineral water?', hi: 'मुझे मिनरल वाटर कहाँ मिलेगा?' },
        { en: 'Keep the change, thank you.', hi: 'बाकी पैसे आप रख लीजिए, धन्यवाद।' },
      ],
      miniQuiz: [
        {
          question: 'How do you politely ask for the bill at a restaurant?',
          options: ['Give me money', 'Could we have the bill, please?', 'Bill now', 'Finish food'],
          answer: 1,
          explanation: '"Could we have the bill, please?" is the most polite and natural way.',
        },
      ],
    },
    {
      id: 'beg_lesson_7',
      title: 'Basic Question & Answer Practice (Wh- Questions)',
      hindiTitle: 'प्रश्न पूछना और उत्तर देना (What, Where, When, Who, Why, How)',
      level: 'beginner',
      durationMin: 15,
      description: 'Unlock 80% of daily communication by asking and answering questions smoothly.',
      hindiDescription: 'क्या, कहाँ, कब, कौन, क्यों और कैसे - सही प्रश्न पूछने के नियम।',
      keyPoints: [
        { en: 'What: for things or actions (What are you doing?).', hi: 'What का अर्थ "क्या" होता है।' },
        { en: 'Where: for places (Where do you live?).', hi: 'Where का अर्थ "कहाँ" होता है।' },
        { en: 'When: for time (When does the train arrive?).', hi: 'When का अर्थ "कब" होता है।' },
        { en: 'Why: for reasons (Why are you laughing?).', hi: 'Why का अर्थ "क्यों" होता है।' },
        { en: 'How: for manner or condition (How do you feel?).', hi: 'How का अर्थ "कैसे" होता है।' },
      ],
      practiceSentences: [
        { en: 'Where are you from? - I am from Mumbai.', hi: 'आप कहाँ से हैं? - मैं मुंबई से हूँ।' },
        { en: 'What time is it now? - It is 4 o\'clock.', hi: 'अभी क्या समय हुआ है? - 4 बजे हैं।' },
        { en: 'How can I reach the railway station?', hi: 'मैं रेलवे स्टेशन कैसे पहुँच सकता हूँ?' },
      ],
      miniQuiz: [
        {
          question: 'Which question word asks about a specific PLACE?',
          options: ['Why', 'When', 'Where', 'Who'],
          answer: 2,
          explanation: '"Where" asks about locations or places.',
        },
      ],
    },
  ],

  intermediate: [
    {
      id: 'int_lesson_1',
      title: 'Mastering English Tenses (Present, Past, Future)',
      hindiTitle: 'सभी मुख्य काल (Tenses) का संपूर्ण ज्ञान',
      level: 'intermediate',
      durationMin: 20,
      description: 'Stop getting confused between Simple, Continuous, and Perfect tenses. Speak with flawless time accuracy.',
      hindiDescription: 'Simple, Continuous और Perfect tenses के बीच का अंतर समझें और बिना झिझक बोलें।',
      keyPoints: [
        { en: 'Simple Present: Facts & Habits (I work in IT).', hi: 'आदतें और सार्वभौमिक सत्य।' },
        { en: 'Present Continuous: Happening right now (I am working now).', hi: 'जो अभी इस पल हो रहा है।' },
        { en: 'Present Perfect: Past action with present relevance (I have completed the work).', hi: 'जो काम अभी-अभी पूरा हुआ है।' },
        { en: 'Simple Past: Completed at a specific time (I worked yesterday).', hi: 'बीते समय में खत्म हुआ काम।' },
      ],
      practiceSentences: [
        { en: 'I have been living in Delhi for five years.', hi: 'मैं पांच साल से दिल्ली में रह रहा हूँ।' },
        { en: 'She had already left before I called.', hi: 'मेरे फोन करने से पहले ही वह निकल चुकी थी।' },
        { en: 'We will meet you tomorrow morning.', hi: 'हम आपसे कल सुबह मिलेंगे।' },
      ],
      miniQuiz: [
        {
          question: 'Identify the correct sentence: "I ___ this movie three times."',
          options: ['have seen', 'am seeing', 'was saw', 'has seen'],
          answer: 0,
          explanation: 'Present perfect ("have seen") is used for life experiences up to now.',
        },
      ],
    },
    {
      id: 'int_lesson_2',
      title: 'Complex Sentences & Connectors (Although, However, Because)',
      hindiTitle: 'जटिल वाक्य रचना और विचार जोड़ना',
      level: 'intermediate',
      durationMin: 18,
      description: 'Move beyond short robotic sentences. Connect contrasting and causal ideas like a fluent speaker.',
      hindiDescription: 'छोटे-छोटे वाक्यों के बजाय विचारों को खूबसूरती से जोड़कर लंबा और प्रभावशाली वाक्य बनाएं।',
      keyPoints: [
        { en: 'Use "Although" or "Even though" to show contrast (Although it rained, we went out).', hi: 'विपरीत बात कहने के लिए Although का प्रयोग।' },
        { en: 'Use "Therefore" or "As a result" to show logical consequences.', hi: 'परिणाम दर्शाने के लिए Therefore का प्रयोग।' },
        { en: 'Use "In addition" or "Furthermore" to add extra strong points.', hi: 'और बात जोड़ने के लिए Furthermore का प्रयोग।' },
      ],
      practiceSentences: [
        { en: 'Although he was tired, he finished his assignment on time.', hi: 'हालाँकि वह थका हुआ था, फिर भी उसने काम समय पर पूरा किया।' },
        { en: 'The traffic was heavy; therefore, I arrived slightly late.', hi: 'ट्रैफिक बहुत था, इसलिए मैं थोड़ी देर से पहुँचा।' },
      ],
      miniQuiz: [
        {
          question: 'Choose the correct connector: "He worked hard; ___, he achieved great success."',
          options: ['consequently', 'although', 'despite', 'unless'],
          answer: 0,
          explanation: '"Consequently" means "as a result", perfectly fitting the causal link.',
        },
      ],
    },
    {
      id: 'int_lesson_3',
      title: 'Daily-Life Situational Conversations (Doctor, Bank, Travel)',
      hindiTitle: 'दैनिक जीवन की व्यावहारिक बातचीत (डॉक्टर, बैंक, यात्रा)',
      level: 'intermediate',
      durationMin: 18,
      description: 'Navigate essential real-world appointments and customer service interactions with ease.',
      hindiDescription: 'डॉक्टर को लक्षण बताना, बैंक में चेक या खाता संभालना, और टिकट बुक करना।',
      keyPoints: [
        { en: 'At the doctor: "I have had a throbbing headache and mild fever since yesterday."', hi: 'लक्षण विस्तार से समझाना।' },
        { en: 'At the bank: "I would like to update my registered phone number and enable net banking."', hi: 'बैंक में काम की बात करना।' },
        { en: 'At travel: "Is this the direct train or do I need to change at the junction?"', hi: 'यात्रा पूछताछ।' },
      ],
      practiceSentences: [
        { en: 'Could you prescribe medicine for a sore throat?', hi: 'क्या आप गले में खराश के लिए दवा लिख सकते हैं?' },
        { en: 'What is the processing fee for this transaction?', hi: 'इस लेनदेन के लिए प्रोसेसिंग शुल्क क्या है?' },
      ],
      miniQuiz: [
        {
          question: 'What is the most natural way to tell a doctor you have had stomach pain since Monday?',
          options: [
            'My stomach is hurting since Monday.',
            'I have had stomach pain since Monday.',
            'Stomach pain was there from Monday.',
            'I am having stomach pain from Monday.',
          ],
          answer: 1,
          explanation: '"I have had... since Monday" correctly uses the present perfect for ongoing durations.',
        },
      ],
    },
    {
      id: 'int_lesson_4',
      title: 'Phrasal Verbs & Idioms for Natural Speech',
      hindiTitle: 'Phrasal Verbs और मुहावरे जो आपको Natural बनाते हैं',
      level: 'intermediate',
      durationMin: 20,
      description: 'Sound like a native speaker with high-frequency phrasal verbs (figure out, call off, catch up) and idioms.',
      hindiDescription: 'अंग्रेज रोजमर्रा में phrasal verbs का सबसे ज्यादा इस्तेमाल करते हैं।',
      keyPoints: [
        { en: '"Call off" = Cancel (They called off the match due to rain).', hi: 'Call off का मतलब रद्द करना है।' },
        { en: '"Figure out" = Understand / solve (Let\'s figure out a solution).', hi: 'Figure out का मतलब समाधान ढूंढना है।' },
        { en: '"Catch up" = Meet and talk after a while (Let\'s catch up this weekend).', hi: 'Catch up का मतलब हाल-चाल साझा करना है।' },
      ],
      practiceSentences: [
        { en: 'Don\'t give up on your goals so easily.', hi: 'इतनी आसानी से अपने लक्ष्यों से हार मत मानो।' },
        { en: 'We need to look into this matter immediately.', hi: 'हमें तुरंत इस मामले की जांच करनी होगी।' },
      ],
      miniQuiz: [
        {
          question: 'What does "Put off" mean in "Don\'t put off until tomorrow what you can do today"?',
          options: ['Wear clothes', 'Postpone / Delay', 'Extinguish fire', 'Turn off'],
          answer: 1,
          explanation: '"Put off" means to delay or postpone something.',
        },
      ],
    },
  ],

  advanced: [
    {
      id: 'adv_lesson_1',
      title: 'Professional Corporate Communication & Email Etiquette',
      hindiTitle: 'पेशेवर कॉर्पोरेट संवाद और ईमेल शिष्टाचार',
      level: 'advanced',
      durationMin: 22,
      description: 'Write crisp, diplomatic, and executive-level business emails and master workplace diplomacy.',
      hindiDescription: 'प्रभावशाली पेशेवर ईमेल लिखना और सहकर्मियों व उच्चाधिकारियों से कूटनीतिक संवाद करना।',
      keyPoints: [
        { en: 'Replace blunt phrases: "Do this today" -> "Could you kindly share an update by EOD?"', hi: 'सख्त भाषा को विनम्र और असरदार बनाना।' },
        { en: 'Use diplomatic disagreement: "I see your point, however, another angle to consider is..."', hi: 'सहमति और असहमति को गरिमा से व्यक्त करना।' },
        { en: 'Email structure: Context -> Action Item -> Timeline -> Appreciation.', hi: 'ईमेल का 4-चरणीय ढांचा।' },
      ],
      practiceSentences: [
        { en: 'I am writing to follow up on our discussion regarding the Q3 roadmap.', hi: 'मैं Q3 रोडमैप पर हमारी चर्चा के संदर्भ में लिख रहा हूँ।' },
        { en: 'Please let me know if you require any further clarification.', hi: 'यदि आपको किसी और स्पष्टीकरण की आवश्यकता हो तो अवश्य बताएं।' },
      ],
      miniQuiz: [
        {
          question: 'Which phrase is the most professional when nudging a colleague for a delayed report?',
          options: [
            'Why haven\'t you sent the report yet?',
            'Just gently following up on the report when you have a moment.',
            'Send report ASAP.',
            'You forgot my report again.',
          ],
          answer: 1,
          explanation: '"Just gently following up on the report when you have a moment" is professional and courteous.',
        },
      ],
    },
    {
      id: 'adv_lesson_2',
      title: 'Job Interview Simulation & The STAR Method',
      hindiTitle: 'जॉब इंटरव्यू की तैयारी और STAR तकनीक',
      level: 'advanced',
      durationMin: 25,
      description: 'Ace tough behavioral interview questions with Situation, Task, Action, and Result structured storytelling.',
      hindiDescription: 'कठिन इंटरव्यू सवालों का प्रभावशाली उत्तर STAR पद्धति से देना।',
      keyPoints: [
        { en: 'S - Situation: Set the scene and context in 2 sentences.', hi: 'स्थिति की पृष्ठभूमि बताएं।' },
        { en: 'T - Task: What was your specific responsibility or problem?', hi: 'आपकी जिम्मेदारी क्या थी।' },
        { en: 'A - Action: What decisive steps did YOU take?', hi: 'आपने क्या ठोस कदम उठाए।' },
        { en: 'R - Result: Measurable outcome (e.g. improved performance by 30%).', hi: 'ठोस और मापने योग्य परिणाम।' },
      ],
      practiceSentences: [
        { en: 'When faced with a tight deadline, I prioritized high-impact tasks and automated data entry.', hi: 'जब समय सीमा कम थी, मैंने मुख्य कार्यों को प्राथमिकता दी।' },
        { en: 'As a result, our team delivered the product two days ahead of schedule.', hi: 'परिणामस्वरूप, हमारी टीम ने उत्पाद दो दिन पहले सौंप दिया।' },
      ],
      miniQuiz: [
        {
          question: 'What does "R" represent in the interview STAR method?',
          options: ['Reaction', 'Result', 'Review', 'Reason'],
          answer: 1,
          explanation: '"Result" shows the measurable positive outcome of your action.',
        },
      ],
    },
    {
      id: 'adv_lesson_3',
      title: 'Public Speaking, Rhetoric & Presentation Mastery',
      hindiTitle: 'मंच पर बोलना, वक्तृत्व कला और आत्मविश्वास',
      level: 'advanced',
      durationMin: 22,
      description: 'Harness pause timing, vocal pitch modulation, and signposting language to command any audience.',
      hindiDescription: 'ऑडियंस को बांधकर रखना, सही ठहराव (Pauses) लेना और आत्मविश्वास से प्रस्तुत करना।',
      keyPoints: [
        { en: 'Signposting language guides listeners: "First, let us examine...", "Turning our attention to..."', hi: 'श्रोताओं को दिशा दिखाने वाले शब्द।' },
        { en: 'The Power of the Pause: Never fill silence with "um" or "ah"; pause for 2 seconds.', hi: 'मौन (Silence) की शक्ति का प्रयोग करें।' },
        { en: 'Rule of Three: People remember ideas presented in triads.', hi: 'तीन बातों का समूह याद रहता है।' },
      ],
      practiceSentences: [
        { en: 'Today, I invite you to imagine a world where technology empowers every voice.', hi: 'आज, मैं आपको ऐसी दुनिया की कल्पना करने के लिए आमंत्रित करता हूँ जहाँ तकनीक हर आवाज को सशक्त बनाती है।' },
      ],
      miniQuiz: [
        {
          question: 'What is "signposting" in presentations?',
          options: [
            'Showing road signs on slides',
            'Phrases that indicate where you are in the presentation structure',
            'Speaking without notes',
            'Using louder volume',
          ],
          answer: 1,
          explanation: 'Signposts (e.g., "To summarize", "Moving to our next point") guide the audience through your structure.',
        },
      ],
    },
  ],
};
