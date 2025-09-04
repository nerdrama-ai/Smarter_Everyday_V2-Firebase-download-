export type Medal = 'bronze' | 'silver' | 'gold' | 'platinum' | 'emerald';

export interface QuizAttempt {
  date: string; // YYYY-MM-DD
  medal: Medal | null;
}

export interface User {
  id: string;
  mobileNumber: string;
  pin: string;
  name: string;
  avatarUrl: string;
  weeklyProgress: (Medal | null)[]; // Array of 7 medals/nulls for the week
  quizHistory: QuizAttempt[];
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
  explanation?: string;
}

export interface Quiz {
  id:string;
  date: string; // YYYY-MM-DD
  topic: string;
  timer: number; // in minutes
  questions: Question[];
  megaQuizQuestions?: Question[];
  dailyScores?: number[]; // Mock scores for percentile calculation
}
