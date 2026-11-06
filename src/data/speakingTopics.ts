import { SpeakingScenario } from '../types/index.ts';

export const SPEAKING_SCENARIOS: SpeakingScenario[] = [
  {
    id: 'speak_intro_1',
    title: 'Self-Introduction (The Golden Elevator Pitch)',
    hindiTitle: 'अपना प्रभावशाली परिचय (Self-Introduction)',
    level: 'beginner',
    category: 'intro',
    icon: 'User',
    description: 'Learn to confidently introduce your name, background, hometown, and career aspirations without hesitating.',
    starterPrompt: 'Hello! I am excited to meet you. Could you please introduce yourself? Tell me your name, what you currently do, and what you enjoy doing in your free time.',
    targetKeywords: ['name', 'originally from', 'currently working', 'passionate about', 'spare time'],
    sampleResponses: [
      {
        en: 'Hello! My name is Ananya. I am originally from Jaipur and currently working as a software analyst in Bengaluru. In my spare time, I love reading non-fiction books and exploring new cities.',
        hi: 'नमस्ते! मेरा नाम अनन्या है। मैं मूल रूप से जयपुर से हूँ और वर्तमान में बेंगलुरु में सॉफ्टवेयर एनालिस्ट के रूप में काम कर रही हूँ। खाली समय में मुझे किताबें पढ़ना पसंद है।',
      },
    ],
    guidingQuestions: [
      'What is your name and where are you from?',
      'What is your current occupation or study field?',
      'What are your hobbies or key interests?',
    ],
  },
  {
    id: 'speak_interview_1',
    title: 'Job Interview: "Tell Me About Yourself"',
    hindiTitle: 'जॉब इंटरव्यू: "अपने बारे में बताएं"',
    level: 'intermediate',
    category: 'interview',
    icon: 'Briefcase',
    description: 'Simulate a real HR interview. Answer the iconic icebreaker question using the Past-Present-Future structure.',
    starterPrompt: 'Welcome to this interview. We are delighted to have you today. To start things off, could you walk me through your background and what brought you to this role?',
    targetKeywords: ['graduated with', 'specialized in', 'proven track record', 'eager to contribute'],
    sampleResponses: [
      {
        en: 'Thank you for this opportunity. I graduated with a degree in Computer Science, and over the past three years, I have specialized in building customer-centric web applications. I noticed your company is expanding its digital presence, and I am eager to contribute my technical and problem-solving skills to your team.',
        hi: 'इस अवसर के लिए धन्यवाद। मैंने कंप्यूटर साइंस में डिग्री हासिल की है और पिछले तीन वर्षों में वेब ऐप्लिकेशन बनाने में विशेषज्ञता प्राप्त की है।',
      },
    ],
    guidingQuestions: [
      'Where did you study or what is your recent experience?',
      'What are 1-2 key accomplishments you are proud of?',
      'Why is this specific company the right next step for you?',
    ],
  },
  {
    id: 'speak_interview_2',
    title: 'Job Interview: "Handling a Difficult Challenge"',
    hindiTitle: 'जॉब इंटरव्यू: "कठिन चुनौती से निपटना"',
    level: 'advanced',
    category: 'interview',
    icon: 'Award',
    description: 'Use the STAR technique (Situation, Task, Action, Result) to narrate a high-stakes workplace achievement.',
    starterPrompt: 'Can you describe a time when you faced an unexpected roadblock or conflict at work, and how you resolved it?',
    targetKeywords: ['tight deadline', 'unforeseen obstacle', 'collaborated with stakeholders', 'delivered successfully'],
    sampleResponses: [
      {
        en: 'During a major product launch, a critical third-party API failed twenty-four hours before our deadline. I immediately convened an emergency huddle, built an offline fallback cache with my team, and communicated transparently with our executive stakeholders. As a result, the launch proceeded without downtime.',
        hi: 'एक बड़े उत्पाद लॉन्च के दौरान जब 24 घंटे पहले API बंद हो गया, तो हमने तुरंत एक इमरजेंसी फॉलबैक बनाया और समय पर डिलीवरी की।',
      },
    ],
    guidingQuestions: [
      'What was the high-pressure situation?',
      'What action did you personally take to solve it?',
      'What was the positive measurable outcome?',
    ],
  },
  {
    id: 'speak_office_1',
    title: 'Office Communication: Requesting Leave Politely',
    hindiTitle: 'ऑफिस बातचीत: छुट्टी के लिए विनम्र अनुरोध',
    level: 'beginner',
    category: 'office',
    icon: 'Calendar',
    description: 'Practice speaking to your team lead or manager to ask for planned leave while ensuring smooth handovers.',
    starterPrompt: 'Hi, you wanted to speak with me about your schedule for next week. What can I do for you?',
    targetKeywords: ['request two days off', 'family function', 'handover document', 'reachable via email'],
    sampleResponses: [
      {
        en: 'Hi boss, I would like to request two days of personal leave next Thursday and Friday due to a family wedding. I have prepared a comprehensive handover sheet and Rahul has kindly agreed to cover my critical tickets.',
        hi: 'नमस्ते सर, मैं पारिवारिक शादी के कारण अगले गुरुवार और शुक्रवार को दो दिन की छुट्टी का अनुरोध करना चाहता हूँ। मैंने सारा काम टीम के साथ साझा कर दिया है।',
      },
    ],
    guidingQuestions: [
      'Which dates do you need off and what is the reason?',
      'How have you planned coverage for your ongoing responsibilities?',
    ],
  },
  {
    id: 'speak_office_2',
    title: 'Office Communication: Constructive Disagreement in a Meeting',
    hindiTitle: 'ऑफिस बातचीत: मीटिंग में विनम्रता से असहमति जताना',
    level: 'advanced',
    category: 'office',
    icon: 'MessageCircle',
    description: 'Master diplomatic disagreement without sounding defensive or aggressive in corporate discussions.',
    starterPrompt: 'The team believes we should delay the feature release until next quarter. Do you agree with this plan?',
    targetKeywords: ['I understand the concern', 'alternative perspective', 'phased rollout', 'mitigate risk'],
    sampleResponses: [
      {
        en: 'I completely understand the concern regarding testing bandwidth. However, another perspective to consider is a phased beta rollout to ten percent of active users. That would allow us to gather real telemetry while mitigating systemic risks.',
        hi: 'मैं टेस्टिंग को लेकर आपकी चिंता समझता हूँ, लेकिन हम 10% यूजर्स के लिए सीमित बीटा लॉन्च कर सकते हैं जिससे जोखिम कम रहे।',
      },
    ],
    guidingQuestions: [
      'Acknowledge the other person\'s point first.',
      'Introduce your counterpoint diplomatically.',
      'Propose a constructive compromise or test.',
    ],
  },
  {
    id: 'speak_roleplay_1',
    title: 'Roleplay: Hotel Check-In & Room Preference',
    hindiTitle: 'रोल-प्ले: होटल चेक-इन और रूम वरीयता',
    level: 'beginner',
    category: 'roleplay',
    icon: 'Coffee',
    description: 'Simulate checking into an international hotel, confirming booking details, and asking for a quiet room on a high floor.',
    starterPrompt: 'Welcome to Grand Hyatt! Are you checking in with us today? May I please have your reservation name or confirmation code?',
    targetKeywords: ['booking under the name of', 'high floor', 'quiet room', 'breakfast included'],
    sampleResponses: [
      {
        en: 'Good afternoon! Yes, I have a reservation under the name of Sharma. If possible, could I please request a quiet room on a higher floor with a city view? Also, could you confirm if breakfast is included in my booking?',
        hi: 'शुभ दोपहर! हाँ, मेरा आरक्षण शर्मा के नाम पर है। यदि संभव हो तो क्या मुझे ऊंची मंजिल पर शांत कमरा मिल सकता है?',
      },
    ],
    guidingQuestions: [
      'State your booking name clearly.',
      'Politely request room preferences (high floor, quiet, non-smoking).',
      'Ask about amenities like Wi-Fi or breakfast hours.',
    ],
  },
  {
    id: 'speak_daily_1',
    title: 'Daily Topic: My Dream Vacation & Travel Memories',
    hindiTitle: 'दैनिक विषय: मेरा सपनों का सफर',
    level: 'intermediate',
    category: 'daily',
    icon: 'Compass',
    description: 'Talk freely about your favorite travel destination, the local cuisine, and why exploring new places enriches your life.',
    starterPrompt: 'If you had an all-expenses-paid ticket to travel anywhere in the world tomorrow, where would you go and what would you do first?',
    targetKeywords: ['breathtaking scenery', 'immerse in local culture', 'authentic cuisine', 'unforgettable experience'],
    sampleResponses: [
      {
        en: 'I would definitely travel to Switzerland. I have always dreamed of riding the scenic trains through the snow-capped Alps, savoring authentic Swiss fondue, and hiking around Lake Geneva.',
        hi: 'मैं निश्चित रूप से स्विट्जरलैंड जाना पसंद करूँगा। बर्फ से ढकी पहाड़ियों के बीच ट्रेन यात्रा और स्थानीय व्यंजनों का आनंद लेना मेरा सपना रहा है।',
      },
    ],
    guidingQuestions: [
      'Where would you travel?',
      'Who would you take along or would you travel solo?',
      'What unique food or activity would you try?',
    ],
  },
];
