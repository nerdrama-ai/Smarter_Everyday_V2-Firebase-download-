'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockQuizzes, mockUsers } from '@/lib/mock-data';
import type { Quiz, Question, Medal, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, BarChart, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Award, Crown, Gem, Medal as MedalIcon } from 'lucide-react';
import { getDay } from 'date-fns';

interface ResultData {
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: string[];
  questions: Question[];
}

const medalConfig: { [key in Medal]: { name: string; color: string; icon: React.ElementType } } = {
  bronze: { name: 'Bronze Medal', color: 'text-orange-400', icon: MedalIcon },
  silver: { name: 'Silver Medal', color: 'text-slate-400', icon: MedalIcon },
  gold: { name: 'Gold Medal', color: 'text-yellow-500', icon: Crown },
  platinum: { name: 'Platinum Medal', color: 'text-slate-400', icon: Crown },
  emerald: { name: 'Emerald Medal', color: 'text-emerald-500', icon: Gem },
};


export default function ResultsPage() {
    const router = useRouter();
    const [resultData, setResultData] = useState<ResultData | null>(null);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [percentile, setPercentile] = useState(0);
    const [medal, setMedal] = useState<Medal | null>(null);

    useEffect(() => {
        const storedResults = localStorage.getItem('lastQuizResult');
        if (storedResults) {
            const data: ResultData = JSON.parse(storedResults);
            setResultData(data);
            
            const correspondingQuiz = mockQuizzes.find(q => q.id === data.quizId);
            if (correspondingQuiz) {
                setQuiz(correspondingQuiz);

                // Calculate percentile
                const scores = correspondingQuiz.dailyScores ?? [];
                const belowCount = scores.filter(s => s < data.score).length;
                const percentileValue = scores.length > 0 ? Math.round((belowCount / scores.length) * 100) : 100;
                setPercentile(percentileValue);

                // Determine medal
                 let newMedal: Medal | null = null;
                 const percentage = (data.score / data.totalQuestions) * 100;
  
                if(data.totalQuestions >= 20) { // Mega Quiz
                    if(percentage >= 100) { newMedal = 'emerald'; }
                    else if(percentage >= 75) { newMedal = 'platinum';}
                } else { // Daily Quiz
                    if (percentage >= 100) { newMedal = 'gold'; }
                    else if (percentage >= 80) { newMedal = 'silver'; }
                    else if (percentage >= 50) { newMedal = 'bronze'; }
                }
                setMedal(newMedal);

                // Update user progress
                if (newMedal) {
                    // This creates the date object in the user's local timezone
                    const quizDate = new Date(`${correspondingQuiz.date}T12:00:00`);
                    const todayIndex = getDay(quizDate);

                    const storedUser = localStorage.getItem('user');
                    let user: User = storedUser ? JSON.parse(storedUser) : mockUsers[0];
                    
                    user.weeklyProgress[todayIndex] = newMedal;
                    
                    const existingHistoryIndex = user.quizHistory.findIndex(h => h.date === correspondingQuiz.date);
                    if (existingHistoryIndex > -1) {
                        user.quizHistory[existingHistoryIndex].medal = newMedal;
                    } else {
                        user.quizHistory.push({ date: correspondingQuiz.date, medal: newMedal });
                    }
                     localStorage.setItem('user', JSON.stringify(user));
                     window.dispatchEvent(new Event('storage'));
                }
            }
        } else {
            // No results found, redirect to dashboard
            router.push('/dashboard');
        }
    }, [router]);

    if (!resultData || !quiz) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Loading results...</p>
            </div>
        );
    }
    
    const MedalDisplay = medal ? medalConfig[medal] : null;
    const topPercentile = 100 - percentile;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold font-headline">Quiz Results</h1>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                             <CardTitle className="font-headline text-2xl">{quiz.topic} Quiz</CardTitle>
                             <CardDescription>Here's how you performed today.</CardDescription>
                        </div>
                        {MedalDisplay && (
                            <div className={`flex items-center gap-2 text-lg font-bold ${MedalDisplay.color} self-start sm:self-center`}>
                                <MedalDisplay.icon className="h-7 w-7" />
                                <span>{MedalDisplay.name}</span>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card className="p-4 bg-card/50">
                        <CardTitle className="text-4xl font-bold">{resultData.score}/{resultData.totalQuestions}</CardTitle>
                        <CardDescription>Correct Answers</CardDescription>
                    </Card>
                     <Card className="p-4 bg-card/50">
                        <CardTitle className="text-4xl font-bold">{Math.round((resultData.score / resultData.totalQuestions) * 100)}%</CardTitle>
                        <CardDescription>Accuracy</CardDescription>
                    </Card>
                     <Card className="p-4 bg-card/50">
                        <CardTitle className="text-3xl font-bold tracking-tight">Top {topPercentile}%</CardTitle>
                        <CardDescription>Performance</CardDescription>
                    </Card>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Answer Review</CardTitle>
                    <CardDescription>Check out the correct answers and explanations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {resultData.questions.map((q, index) => {
                            const userAnswer = resultData.answers[index];
                            const isCorrect = userAnswer === q.correctAnswer;
                            return (
                                <AccordionItem value={`item-${index}`} key={q.id}>
                                    <AccordionTrigger>
                                        <div className="flex items-start gap-4 text-left">
                                            {isCorrect ? <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" /> : <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />}
                                            <span>{q.questionText}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-3 pl-10">
                                       {!isCorrect && (
                                            <p>Your answer: <Badge variant="destructive">{userAnswer || 'Not Answered'}</Badge></p>
                                       )}
                                       <p>Correct answer: <Badge variant="default">{q.correctAnswer}</Badge></p>
                                       {q.explanation && (
                                           <p className="text-muted-foreground bg-muted/50 p-3 rounded-md">{q.explanation}</p>
                                       )}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}
