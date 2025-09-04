'use client';
import { useState } from 'react';
import { QuizForm } from "@/components/admin/QuizForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { mockQuizzes } from "@/lib/mock-data";
import { QuizCalendar } from "@/components/admin/QuizCalendar";
import type { Quiz } from '@/lib/types';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserInsights } from '@/components/admin/UserInsights.client';

export default function AdminPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | undefined>(undefined);

    const handleSelectDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        const quiz = mockQuizzes.find(q => q.date === dateString);
        setSelectedQuiz(quiz);
        setIsFormOpen(true);
    };

    const handleCreateNew = () => {
        setSelectedQuiz(undefined);
        setIsFormOpen(true);
    }
    
    const handleQuizSave = () => {
        // Here you would refetch quizzes, for now we just close the modal
        setIsFormOpen(false);
    }

    return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
                        </Button>
                        <h1 className="text-3xl font-bold font-headline">Admin Panel</h1>
                    </div>
                </div>

                <Tabs defaultValue="quiz-management" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="quiz-management">Quiz Management</TabsTrigger>
                        <TabsTrigger value="user-insights">User Insights</TabsTrigger>
                    </TabsList>
                    <TabsContent value="quiz-management" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="font-headline">Quiz Schedule</CardTitle>
                                    <CardDescription>Select a date to edit an existing quiz or create a new one.</CardDescription>
                                </div>
                                 <DialogTrigger asChild>
                                    <Button onClick={handleCreateNew}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Create New Quiz
                                    </Button>
                                </DialogTrigger>
                            </CardHeader>
                            <CardContent>
                                <QuizCalendar quizzes={mockQuizzes} onSelectDate={handleSelectDate} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="user-insights">
                        <UserInsights />
                    </TabsContent>
                </Tabs>

                <DialogContent className="sm:max-w-4xl">
                     <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">{selectedQuiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
                        <DialogDescription>Use this form to configure the daily or mega quiz.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[80vh] overflow-y-auto p-1">
                        <QuizForm quiz={selectedQuiz} onQuizSave={handleQuizSave} />
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    );
}
