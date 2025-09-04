import type { User, Quiz } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    mobileNumber: '9876543210',
    pin: '1234',
    name: 'Alex Doe',
    avatarUrl: 'https://picsum.photos/100/100',
    weeklyProgress: ['gold', 'silver', null, 'bronze', null, null, null],
    quizHistory: [
      { date: '2024-07-22', medal: 'gold' },
      { date: '2024-07-21', medal: 'silver' },
      { date: '2024-07-19', medal: 'bronze' },
    ],
  },
];

const generateQuestions = (count: number, prefix: string) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-q${i + 1}`,
    questionText: `This is ${prefix} question number ${i + 1}. What is the correct answer?`,
    options: ['Option A', 'Option B', 'Option C', 'Correct Answer'],
    correctAnswer: 'Correct Answer',
    hint: `This is a hint for ${prefix} question ${i + 1}.`,
    explanation: `This is the explanation for ${prefix} question ${i + 1}. The correct answer is what it is because of reasons.`
  }));
};

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generatePastQuiz = (date: Date): Quiz => {
    const dateStr = getLocalDateString(date);
    return {
        id: `quiz-${dateStr}`,
        date: dateStr,
        topic: 'General Knowledge',
        timer: 5,
        questions: generateQuestions(10, `daily-${dateStr}`),
        dailyScores: Array.from({ length: 50 }, () => Math.floor(Math.random() * 11)),
    }
}

const pastQuizzes: Quiz[] = [];
const today = new Date();
for (let i = 1; i <= 5; i++) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    pastQuizzes.push(generatePastQuiz(pastDate));
}

const futureQuizzes: Quiz[] = [];
for (let i = 1; i <= 5; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);
    futureQuizzes.push(generatePastQuiz(futureDate));
}


export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    date: getLocalDateString(new Date()), // Today's date
    topic: 'Science & Nature',
    timer: 5,
    questions: generateQuestions(10, 'daily'),
    megaQuizQuestions: generateQuestions(10, 'mega'),
    dailyScores: Array.from({ length: 50 }, () => Math.floor(Math.random() * 11)),
  },
  ...pastQuizzes,
  ...futureQuizzes
];
