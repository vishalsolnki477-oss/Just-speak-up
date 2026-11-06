import { ListeningExercise } from '../types/index.ts';

export const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'listen_1',
    title: 'Morning Routine & Coffee Order',
    hindiTitle: 'सुबह की दिनचर्या और कैफे में बातचीत',
    level: 'beginner',
    category: 'daily_talk',
    speaker: 'female',
    audioScript:
      'Good morning! Every weekday, I wake up at six-thirty. First, I drink a tall glass of warm water. Then, I go for a twenty-minute jog in the neighborhood park. On my way back, I stop at my favorite cafe and order a hot cappuccino with oat milk. The barista always greets me with a warm smile. It is the best way to kickstart my day with high energy.',
    questions: [
      {
        id: 'q_l1_1',
        question: 'What time does the speaker wake up on weekdays?',
        options: ['6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM'],
        correctAnswer: 1,
        explanation: 'The speaker explicitly states: "Every weekday, I wake up at six-thirty."',
      },
      {
        id: 'q_l1_2',
        question: 'What does the speaker drink first before jogging?',
        options: ['Cold coffee', 'A tall glass of warm water', 'Green tea', 'Orange juice'],
        correctAnswer: 1,
        explanation: 'She says: "First, I drink a tall glass of warm water."',
      },
      {
        id: 'q_l1_3',
        question: 'What type of coffee does she order at the cafe?',
        options: ['Iced espresso', 'Hot cappuccino with oat milk', 'Black tea', 'Caramel latte'],
        correctAnswer: 1,
        explanation: 'She orders a "hot cappuccino with oat milk."',
      },
    ],
    fillInTheBlanks: [
      {
        sentenceWithBlank: 'First, I drink a tall glass of ___ water.',
        missingWord: 'warm',
        hintHi: 'गुनगुना पानी (warm)',
      },
      {
        sentenceWithBlank: 'I go for a twenty-minute ___ in the park.',
        missingWord: 'jog',
        hintHi: 'हल्की दौड़ (jog)',
      },
    ],
  },
  {
    id: 'listen_2',
    title: 'Asking for Directions in the City',
    hindiTitle: 'शहर में रास्ता पूछना',
    level: 'beginner',
    category: 'travel',
    speaker: 'male',
    audioScript:
      'Excuse me, could you please tell me how to get to the central train station? Walk straight down this avenue for two blocks until you see a large blue building on your right. Turn left at the traffic light, and walk past the city library. The station entrance will be directly ahead of you. You cannot miss it.',
    questions: [
      {
        id: 'q_l2_1',
        question: 'Where is the traveler trying to go?',
        options: ['The airport', 'The central train station', 'The city museum', 'The shopping mall'],
        correctAnswer: 1,
        explanation: 'The traveler asks: "how to get to the central train station?"',
      },
      {
        id: 'q_l2_2',
        question: 'What color is the building mentioned after two blocks?',
        options: ['Red', 'Green', 'Blue', 'Yellow'],
        correctAnswer: 2,
        explanation: 'The speaker notes: "a large blue building on your right."',
      },
      {
        id: 'q_l2_3',
        question: 'Which way should the person turn at the traffic light?',
        options: ['Turn right', 'Turn left', 'Keep going straight', 'Make a U-turn'],
        correctAnswer: 1,
        explanation: 'The direction given is "Turn left at the traffic light."',
      },
    ],
    fillInTheBlanks: [
      {
        sentenceWithBlank: 'Walk straight down this avenue for two ___.',
        missingWord: 'blocks',
        hintHi: 'दो चौराहे/ब्लॉक (blocks)',
      },
      {
        sentenceWithBlank: 'Walk past the city ___.',
        missingWord: 'library',
        hintHi: 'पुस्तकालय (library)',
      },
    ],
  },
  {
    id: 'listen_3',
    title: 'The Tech Startup Meeting',
    hindiTitle: 'टेक स्टार्टअप टीम मीटिंग',
    level: 'intermediate',
    category: 'work',
    speaker: 'female',
    audioScript:
      'Welcome everyone to our weekly sprint sync. Over the past sprint, our engineering team resolved ninety-five percent of critical bug reports. Our user retention also spiked by fifteen percent following the latest mobile app redesign. However, our server latency during peak evening hours remains a bottleneck. For next week, our top priority must be optimizing database queries and deploying automated load balancing.',
    questions: [
      {
        id: 'q_l3_1',
        question: 'What percentage of critical bug reports were resolved?',
        options: ['75%', '85%', '95%', '100%'],
        correctAnswer: 2,
        explanation: 'The speaker says: "resolved ninety-five percent of critical bug reports."',
      },
      {
        id: 'q_l3_2',
        question: 'What remained a bottleneck during peak hours?',
        options: ['Server latency', 'Customer support', 'Marketing budget', 'Design approvals'],
        correctAnswer: 0,
        explanation: 'The speaker specifically mentions: "our server latency during peak evening hours remains a bottleneck."',
      },
      {
        id: 'q_l3_3',
        question: 'What is the top priority for next week?',
        options: ['Hiring more interns', 'Optimizing database queries and load balancing', 'Launching a new marketing campaign', 'Changing office location'],
        correctAnswer: 1,
        explanation: 'Priority: "optimizing database queries and deploying automated load balancing."',
      },
    ],
    fillInTheBlanks: [
      {
        sentenceWithBlank: 'Our user retention spiked by fifteen percent following the mobile app ___.',
        missingWord: 'redesign',
        hintHi: 'नया डिजाइन (redesign)',
      },
      {
        sentenceWithBlank: 'Server latency during peak evening hours remains a ___.',
        missingWord: 'bottleneck',
        hintHi: 'रुकावट या बाधा (bottleneck)',
      },
    ],
  },
  {
    id: 'listen_4',
    title: 'Global Economy & Climate Innovation',
    hindiTitle: 'वैश्विक अर्थव्यवस्था और जलवायु नवाचार',
    level: 'advanced',
    category: 'stories',
    speaker: 'male',
    audioScript:
      'Renewable energy is no longer merely an ecological aspiration; it has evolved into an economic powerhouse. In recent fiscal quarters, capital allocations toward solar photovoltaics and wind infrastructure have surpassed investments in conventional fossil fuels across multiple continents. As synthetic grid storage improves, decentralization will dismantle monopolistic power distributors and empower localized microgrids.',
    questions: [
      {
        id: 'q_l4_1',
        question: 'According to the passage, renewable energy has transitioned into what?',
        options: ['A temporary fad', 'An economic powerhouse', 'A localized failure', 'An expensive burden'],
        correctAnswer: 1,
        explanation: 'The speaker describes it as having "evolved into an economic powerhouse."',
      },
      {
        id: 'q_l4_2',
        question: 'What will decentralization achieve as grid storage improves?',
        options: [
          'Dismantle monopolistic power distributors',
          'Increase consumer costs',
          'Reduce solar panel production',
          'Halt wind farm construction',
        ],
        correctAnswer: 0,
        explanation: 'Text says: "decentralization will dismantle monopolistic power distributors and empower localized microgrids."',
      },
    ],
    fillInTheBlanks: [
      {
        sentenceWithBlank: 'Renewable energy is no longer merely an ecological ___.',
        missingWord: 'aspiration',
        hintHi: 'महत्वाकांक्षा या चाह (aspiration)',
      },
      {
        sentenceWithBlank: 'Decentralization will empower localized ___.',
        missingWord: 'microgrids',
        hintHi: 'स्थानीय विद्युत ग्रिड (microgrids)',
      },
    ],
  },
];
