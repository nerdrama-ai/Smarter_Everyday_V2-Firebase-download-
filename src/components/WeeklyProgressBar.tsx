'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Crown, Gem, Medal as MedalIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import type { Medal } from '@/lib/types';
import { getDay } from 'date-fns';
import { Skeleton } from './ui/skeleton';

const medalConfig = {
  bronze: { icon: MedalIcon, color: 'text-orange-400', name: 'Bronze' },
  silver: { icon: Award, color: 'text-slate-400', name: 'Silver' },
  gold: { icon: Crown, color: 'text-yellow-500', name: 'Gold' },
  platinum: { icon: Crown, color: 'text-gray-500', name: 'Platinum' },
  emerald: { icon: Gem, color: 'text-emerald-500', name: 'Emerald' },
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface WeeklyProgressBarProps {
  weeklyProgress: (Medal | null)[];
}

export function WeeklyProgressBar({ weeklyProgress }: WeeklyProgressBarProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const todayIndex = isClient ? getDay(new Date()) : -1;
  const completedDays = weeklyProgress.filter(Boolean).length;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (!isClient) {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
            </div>
            <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => <Skeleton key={day} className="h-20 w-full rounded-lg" />)}
            </div>
        </div>
    );
  }

  return (
    <div className="w-full">
       <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">Weekly Progress</p>
        <p className="text-sm text-muted-foreground">{completedDays} / 7 days</p>
      </div>
      <TooltipProvider>
        <motion.div
          className="grid grid-cols-7 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {weekDays.map((day, index) => {
            const medal = weeklyProgress[index];
            const config = medal ? medalConfig[medal] : null;

            return (
              <Tooltip key={day}>
                <TooltipTrigger asChild>
                  <motion.div
                    variants={itemVariants}
                    className={cn(
                      'relative flex flex-col items-center justify-center gap-1 p-2 rounded-lg aspect-square transition-colors border-2',
                      index === todayIndex ? 'border-primary bg-primary/10' : 'border-dashed bg-card',
                      config ? cn('border-solid', config.color.replace('text-', 'border-')) : ''
                    )}
                  >
                    <span className="text-xs font-semibold text-muted-foreground">{day}</span>
                    <div className="flex-grow flex items-center justify-center">
                        {config ? (
                            <config.icon className={cn('h-6 w-6', config.color)} />
                        ) : (
                            <div className="h-6 w-6 bg-muted rounded-full" />
                        )}
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{day}: {config ? `${config.name} Medal` : (index <= todayIndex ? 'Not Completed' : 'Upcoming')}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </motion.div>
      </TooltipProvider>
    </div>
  );
}
