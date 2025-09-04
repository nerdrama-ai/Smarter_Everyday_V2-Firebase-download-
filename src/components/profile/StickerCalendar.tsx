'use client';

import { useState } from 'react';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Medal, Crown, Gem, Award } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import type { QuizAttempt } from '@/lib/types';

const medalConfig = {
  bronze: { icon: Medal, color: 'bg-orange-200 border-orange-400 text-orange-600', name: 'Bronze Medal' },
  silver: { icon: Award, color: 'bg-slate-200 border-slate-400 text-slate-600', name: 'Silver Medal' },
  gold: { icon: Crown, color: 'bg-yellow-200 border-yellow-400 text-yellow-600', name: 'Gold Medal' },
  platinum: { icon: Crown, color: 'bg-gray-300 border-gray-500 text-gray-700', name: 'Platinum Medal' },
  emerald: { icon: Gem, color: 'bg-emerald-200 border-emerald-400 text-emerald-600', name: 'Emerald Medal' },
};

export function StickerCalendar({ history }: { history: QuizAttempt[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(lastDayOfMonth),
  });

  const historyMap = new Map(history.map(item => [item.date, item.medal]));

  const getDayComponent = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const medal = historyMap.get(dayStr);
    const config = medal ? medalConfig[medal] : null;

    const dayComponent = (
        <div
        key={day.toString()}
        className={cn(
          'relative flex h-16 sm:h-20 w-full flex-col items-center justify-center rounded-lg border-2 transition-colors',
          isSameMonth(day, currentDate)
            ? 'bg-card'
            : 'bg-muted/50 text-muted-foreground',
          isSameDay(day, new Date()) && 'border-primary',
          config ? config.color : 'border-dashed'
        )}
      >
        <span className="absolute top-1 right-1 sm:right-2 text-xs sm:text-sm font-medium">{format(day, 'd')}</span>
        {config && (
            <config.icon className="h-6 w-6 sm:h-8 sm:w-8" />
        )}
      </div>
    );
    
    if (config) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{dayComponent}</TooltipTrigger>
                    <TooltipContent>
                        <p>{format(day, 'MMMM d')}: {config.name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return dayComponent;
  };

  return (
    <div className="p-0 sm:p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg sm:text-xl font-bold font-headline">{format(currentDate, 'MMMM yyyy')}</h2>
        <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-medium text-muted-foreground">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-2">
        {daysInMonth.map(day => getDayComponent(day))}
      </div>
    </div>
  );
}
