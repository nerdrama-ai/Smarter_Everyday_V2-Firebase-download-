'use client';

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, PlusCircle, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import type { Quiz } from '@/lib/types';
import { useState, useEffect } from 'react';

interface QuizCalendarProps {
    quizzes: Quiz[];
    onSelectDate: (date: Date) => void;
}

export function QuizCalendar({ quizzes, onSelectDate }: QuizCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const daysInMonth = eachDayOfInterval({
        start: startOfWeek(firstDayOfMonth),
        end: endOfWeek(lastDayOfMonth),
    });

    const quizMap = new Map(quizzes.map(item => [item.date, item]));
    
    // We need to know today's date on the client to render future dates correctly
    const todayDate = isClient ? new Date() : null;

    const getDayComponent = (day: Date) => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const quiz = quizMap.get(dayStr);
        const isCurrentMonth = isSameMonth(day, currentDate);
        
        let isFuture = false;
        if(todayDate) {
            // Compare dates only, ignoring time
            const todayStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
            isFuture = day > todayStart;
        }

        return (
            <div
                key={day.toString()}
                onClick={() => onSelectDate(day)}
                className={cn(
                'relative flex h-24 md:h-32 w-full flex-col rounded-lg border-2 p-2 transition-colors cursor-pointer hover:bg-card/80',
                isCurrentMonth
                    ? 'bg-card'
                    : 'bg-muted/50 text-muted-foreground',
                isClient && isToday(day) && 'border-primary',
                quiz ? 'border-accent/50' : 'border-dashed'
                )}
            >
                <span className="font-medium self-end text-xs md:text-sm">{format(day, 'd')}</span>
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                   {quiz ? (
                       <div className="space-y-1">
                           <p className="font-bold text-xs md:text-sm">{quiz.topic}</p>
                           <p className="text-xs text-muted-foreground">{quiz.questions.length} Qs</p>
                           {isFuture && <Edit className="w-3 h-3 md:w-4 md:h-4 text-accent mx-auto mt-1" />}
                       </div>
                   ) : (
                       isCurrentMonth && isFuture && (
                           <div className="text-muted-foreground">
                                <PlusCircle className="w-4 h-4 md:w-6 md:h-6 mx-auto" />
                                <p className="text-xs mt-1 hidden md:block">Create Quiz</p>
                           </div>
                       )
                   )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-0 md:p-4 rounded-lg bg-background/50">
        <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg md:text-xl font-bold font-headline">{format(currentDate, 'MMMM yyyy')}</h2>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs md:text-sm font-medium text-muted-foreground mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day.substring(0,1)}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2">
            {daysInMonth.map(day => getDayComponent(day))}
        </div>
        </div>
    );
}
