'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockQuizzes } from '@/lib/mock-data';
import type { Question, Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock, Wand2, X, RotateCw, Play, BrainCircuit } from 'lucide-react';
import { QuizResultModal } from './QuizResultModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';


function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

interface SavedProgress {
    quizId: string;
    currentQuestionIndex: number;
    answers: string[];
    timeLeft: number;
    questions: Question[];
    isMegaQuizUnlocked: boolean;
}

// Function to get YYYY-MM-DD from a local date
const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function QuizComponent() {
  const router = useRouter();
  const [quizState, setQuizState] = useState<'not_started' | 'in_progress' | 'finished'>('not_started');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizTimer, setQuizTimer] = useState(300);
  const [savedProgress, setSavedProgress] = useState<SavedProgress | null>(null);
  
  // For Sunday Mega Quiz
  const [isMegaQuiz, setIsMegaQuiz] = useState(false);
  const [isMegaQuizUnlocked, setIsMegaQuizUnlocked] = useState(false);
  const [todayQuizDate, setTodayQuizDate] = useState('');

  useEffect(() => {
    const today = new Date();
    setTodayQuizDate(getLocalDateString(today));
    // Sunday is 0
    if (today.getDay() === 0) {
      setIsMegaQuiz(true);
    }
    
    // Check for saved progress
    const savedProgressRaw = localStorage.getItem('quizProgress');
    const todayQuiz = mockQuizzes.find(q => q.date === getLocalDateString(today));

    if (savedProgressRaw) {
        const saved: SavedProgress = JSON.parse(savedProgressRaw);
        if (saved.quizId === todayQuiz?.id) {
            setSavedProgress(saved);
        } else {
            // Clear progress if it's for a different day's quiz
            localStorage.removeItem('quizProgress');
        }
    }
  }, []);

  useEffect(() => {
    if (quizState === 'in_progress' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && quizState === 'in_progress') {
        finishQuiz();
    }
  }, [quizState, timeLeft]);
  
   useEffect(() => {
    // Save progress whenever it changes during the quiz
    if (quizState === 'in_progress' && activeQuiz) {
      const progress: SavedProgress = {
        quizId: activeQuiz.id,
        currentQuestionIndex,
        answers,
        timeLeft,
        questions,
        isMegaQuizUnlocked
      };
      localStorage.setItem('quizProgress', JSON.stringify(progress));
    }
  }, [currentQuestionIndex, answers, timeLeft, quizState, activeQuiz, questions, isMegaQuizUnlocked]);

  const startQuiz = (isContinuing = false) => {
    const todayQuiz = mockQuizzes.find(q => q.date === todayQuizDate);
    if (!todayQuiz) return; 

    setActiveQuiz(todayQuiz);
    
    if (isContinuing && savedProgress) {
        setQuestions(savedProgress.questions);
        setAnswers(savedProgress.answers);
        setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
        setTimeLeft(savedProgress.timeLeft);
        setQuizTimer(todayQuiz.timer * 60);
        setIsMegaQuizUnlocked(savedProgress.isMegaQuizUnlocked);
    } else {
        const randomizedQuestions = shuffleArray(todayQuiz.questions);
        setQuestions(randomizedQuestions);
        setAnswers(new Array(randomizedQuestions.length).fill(''));
        setCurrentQuestionIndex(0);
        setQuizTimer(todayQuiz.timer * 60);
        setTimeLeft(todayQuiz.timer * 60);
        setIsMegaQuizUnlocked(false);
        localStorage.removeItem('quizProgress'); // Clear old progress on fresh start
    }
    setQuizState('in_progress');
  };

  const unlockMegaQuiz = () => {
    if (activeQuiz?.megaQuizQuestions) {
        const randomizedMegaQuestions = shuffleArray(activeQuiz.megaQuizQuestions);
        const newQuestions = [...questions, ...randomizedMegaQuestions];
        setQuestions(newQuestions);
        setAnswers(new Array(newQuestions.length).fill(''));
        setIsMegaQuizUnlocked(true);
        // Resetting index to continue quiz
        setCurrentQuestionIndex(questions.length);
        setQuizState('in_progress');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };
  
  const handleExit = () => {
    setQuizState('not_started');
    const saved = localStorage.getItem('quizProgress');
    if (saved) {
        setSavedProgress(JSON.parse(saved));
    }
  }

  const finishQuiz = () => {
    let finalScore = 0;
    questions.forEach((q, i) => {
      if (q.correctAnswer === answers[i]) {
        finalScore++;
      }
    });

    const results = {
        quizId: activeQuiz?.id,
        score: finalScore,
        totalQuestions: questions.length,
        answers,
        questions,
        isMega: isMegaQuizUnlocked
    };

    localStorage.setItem('lastQuizResult', JSON.stringify(results));
    localStorage.removeItem('quizProgress'); // Clear progress on finish
    setQuizState('finished');
    router.push('/results');
  };
  
  const todayQuiz = mockQuizzes.find(q => q.date === todayQuizDate);

  if (quizState === 'not_started') {
    if (!todayQuiz) {
        return (
             <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl sm:text-3xl">No Quiz Today!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Check back tomorrow for a new challenge.</p>
                </CardContent>
            </Card>
        )
    }
    
    if (savedProgress) {
        return (
            <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl sm:text-3xl">Welcome Back!</CardTitle>
                    <CardDescription>You have a quiz in progress for {todayQuiz.topic}.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                     <p>You left off at question {savedProgress.currentQuestionIndex + 1} with {Math.floor(savedProgress.timeLeft / 60)}:{(savedProgress.timeLeft % 60).toString().padStart(2, '0')} remaining.</p>
                  </div>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row gap-2">
                    <Button onClick={() => startQuiz(true)} size="lg" className="w-full">
                        <Play className="mr-2 h-4 w-4" /> Continue Quiz
                    </Button>
                     <Button onClick={() => { localStorage.removeItem('quizProgress'); setSavedProgress(null); startQuiz(); }} size="lg" variant="outline" className="w-full">
                        <RotateCw className="mr-2 h-4 w-4" /> Start Over
                    </Button>
                </CardFooter>
            </Card>
        )
    }
    
    return (
       <Card className="w-full max-w-xl shadow-lg overflow-hidden border-2 border-primary/20">
        <div className="p-6 flex flex-col justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">Daily Challenge</Badge>
              <CardTitle className="font-headline text-2xl sm:text-3xl">
                {todayQuiz.topic}
              </CardTitle>
              <CardDescription className="mt-2">
                Ready to test your knowledge and build your streak?
              </CardDescription>
            </div>
            <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <span>{todayQuiz.questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{todayQuiz.timer} minutes</span>
                  </div>
                </div>
                <Button
                  onClick={() => startQuiz()}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Zap className="mr-2 h-4 w-4" /> Start Quiz
                </Button>
            </div>
          </div>
      </Card>
    );
  }

  if (quizState === 'in_progress' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const timeProgress = (timeLeft / quizTimer) * 100;

    return (
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <CardTitle className="font-headline text-xl sm:text-2xl">Question {currentQuestionIndex + 1}/{questions.length}</CardTitle>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Clock className="h-5 w-5" />
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="icon">
                            <X className="h-4 w-4"/>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your progress will be saved, and you can resume the quiz later. The timer will continue from where you left off.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Stay in Quiz</AlertDialogCancel>
                        <AlertDialogAction onClick={handleExit}>Exit and Save</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <Progress value={timeProgress} className="h-1 mt-2" colorClass="bg-accent" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-start justify-between gap-2">
                <p className="text-lg sm:text-xl font-semibold text-center min-h-[8rem] flex items-center justify-center flex-grow">{currentQuestion.questionText}</p>
                {currentQuestion.hint && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Wand2 className="h-4 w-4 text-accent" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                               <p>{currentQuestion.hint}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={answers[currentQuestionIndex] === option ? 'default' : 'outline'}
                className="text-base sm:text-lg h-auto min-h-[5rem] py-3 whitespace-normal"
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleNext} size="lg" className="w-full">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // QuizResultModal is now handled by the results page
  // This part of the code is effectively deprecated but kept for safety
  if (quizState === 'finished' && isMegaQuiz && !isMegaQuizUnlocked) {
    // Special case for mega quiz unlock flow if we decide to use a modal again
    return (
        <QuizResultModal
            isOpen={true}
            onClose={() => router.push('/dashboard')}
            score={0} // dummy values
            totalQuestions={0}
            isMegaQuiz={true}
            onUnlockMegaQuiz={unlockMegaQuiz}
            onRestart={() => setQuizState('not_started')}
        />
    )
  }

  return null;
}
