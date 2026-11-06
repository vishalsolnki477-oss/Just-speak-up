export interface DiagnosticQuestion {
  id: number;
  question: string;
  hindiQuestion?: string;
  options: string[];
  correctAnswer: number;
  levelIndicator: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    question: 'Select the correct sentence to introduce yourself:',
    hindiQuestion: 'अपना परिचय देने के लिए सही वाक्य चुनें:',
    options: [
      'Myself Amit from Delhi.',
      'I am Amit and I come from Delhi.',
      'Me name is Amit Delhi.',
      'I are Amit from Delhi.',
    ],
    correctAnswer: 1,
    levelIndicator: 'beginner',
    explanation: '"I am [Name]" is the standard, grammatically correct way to introduce oneself.',
  },
  {
    id: 2,
    question: 'Choose the correct helping verb: "She ___ drinking water right now."',
    hindiQuestion: 'सही सहायक क्रिया चुनें: "She ___ drinking water right now."',
    options: ['is', 'are', 'were', 'am'],
    correctAnswer: 0,
    levelIndicator: 'beginner',
    explanation: 'Singular third-person subject "She" takes "is" in the present continuous tense.',
  },
  {
    id: 3,
    question: 'Fill in the blank with the correct article: "He is ___ honest police officer."',
    hindiQuestion: 'सही आर्टिकल चुनें: "He is ___ honest police officer."',
    options: ['a', 'an', 'the', 'no article'],
    correctAnswer: 1,
    levelIndicator: 'beginner',
    explanation: '"Honest" begins with a vowel sound /ɒ/ (silent h), so we use "an".',
  },
  {
    id: 4,
    question: 'Which sentence correctly describes a daily routine?',
    hindiQuestion: 'दैनिक आदत या दिनचर्या के लिए कौन सा वाक्य सही है?',
    options: [
      'I am going to gym every morning.',
      'I go to the gym every morning.',
      'I was go to gym every morning.',
      'I gone to gym every morning.',
    ],
    correctAnswer: 1,
    levelIndicator: 'beginner',
    explanation: 'Simple present tense ("I go") is used for habits and daily routines.',
  },
  {
    id: 5,
    question: 'Choose the correct preposition: "The team meeting is scheduled ___ 3:00 PM ___ Monday."',
    hindiQuestion: 'सही पूर्वसर्ग चुनें:',
    options: ['at / in', 'on / at', 'at / on', 'in / on'],
    correctAnswer: 2,
    levelIndicator: 'intermediate',
    explanation: 'Use "at" for specific clock times (at 3:00 PM) and "on" for days of the week (on Monday).',
  },
  {
    id: 6,
    question: 'Fill in the blank: "I ___ here for over five years."',
    hindiQuestion: 'समय की अवधि दर्शाने के लिए सही Tense चुनें:',
    options: ['am living', 'have been living', 'lived', 'am live'],
    correctAnswer: 1,
    levelIndicator: 'intermediate',
    explanation: 'Present perfect continuous ("have been living") describes actions that started in the past and continue into the present.',
  },
  {
    id: 7,
    question: 'Subject-Verb Agreement: "Neither of the two candidates ___ qualified for the senior position."',
    hindiQuestion: 'सब्जेक्ट-वर्ब एग्रीमेंट के अनुसार सही क्रिया चुनें:',
    options: ['is', 'are', 'were', 'have been'],
    correctAnswer: 0,
    levelIndicator: 'intermediate',
    explanation: '"Neither" is a singular pronoun and takes the singular verb "is".',
  },
  {
    id: 8,
    question: 'Choose the correct conditional sentence:',
    hindiQuestion: 'सही शर्त वाला वाक्य (Conditional sentence) चुनें:',
    options: [
      'If it will rain tomorrow, I will stay home.',
      'If it rains tomorrow, I will stay home.',
      'If it rain tomorrow, I stay home.',
      'If it had rained tomorrow, I will stay home.',
    ],
    correctAnswer: 1,
    levelIndicator: 'intermediate',
    explanation: 'First conditional structure: "If + present simple (rains), will + base verb (stay)".',
  },
  {
    id: 9,
    question: 'Transform to passive voice: "The cyber team detected the breach within seconds."',
    hindiQuestion: 'कर्मवाच्य (Passive Voice) में सही रूपांतरण चुनें:',
    options: [
      'The breach was detected by the cyber team within seconds.',
      'The breach is detected by the cyber team.',
      'The breach were detected within seconds.',
      'The cyber team was detected by the breach.',
    ],
    correctAnswer: 0,
    levelIndicator: 'advanced',
    explanation: 'Past simple passive uses "was/were + past participle" (was detected).',
  },
  {
    id: 10,
    question: 'In a high-level executive meeting, how do you politely disagree with an unrealistic deadline?',
    hindiQuestion: 'मीटिंग में समय सीमा से विनम्रता व कूटनीति से असहमति कैसे जताएंगे?',
    options: [
      'This deadline is impossible, we won\'t do it.',
      'You are giving us too much pressure.',
      'I appreciate the urgency; however, to maintain quality standards, a phased rollout would be far more pragmatic.',
      'We will not meet this target at all.',
    ],
    correctAnswer: 2,
    levelIndicator: 'advanced',
    explanation: 'Diplomatic corporate phrasing acknowledges the priority while proposing a sensible, solution-oriented alternative.',
  },
];
