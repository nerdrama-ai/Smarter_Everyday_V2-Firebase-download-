'use client';

import { useState, useMemo } from 'react';
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
import {
  ChevronLeft,
  ChevronRight,
  Medal,
  Crown,
  Gem,
  Award,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const medalConfig = {
  bronze: {
    icon: Medal,
    color:
      'bg-orange-100 border-orange-300 text-orange-600 shadow-sm shadow-orange-200',
    name: 'Bronze Medal',
  },
  silver: {
    icon: Award,
    color:
      'bg-slate-100 border-slate-300 text-slate-600 shadow-sm shadow-slate-200',
    name: 'Silver Medal',
  },
  gold: {
    icon: Crown,
    color:
      'bg-yellow-100 border-yellow-300 text-yellow-600 shadow-sm shadow-yellow-200',
    name: 'Gold Medal',
  },
  platinum: {
    icon: Crown,
    color:
      'bg-gray-100 border-gray-400 text-gray-700 shadow-sm shadow-gray-200',
    name: 'Platinum Medal',
  },
  emerald: {
    icon: Gem,
    color:
      'bg-emerald-100 border-emerald-300 text-emerald-600 shadow-sm shadow-emerald-200',
    name: 'Emerald Medal',
  },
};

export function StickerCalendar({ history }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // memoize so we don’t recalc on every render
  const daysInMonth = useMemo(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    return eachDayOfInterval({
      start: startOfWeek(firstDayOfMonth),
      end: endOfWeek(lastDayOfMonth),
    });
  }, [currentDate]);

  const historyMap = useMemo(
    () => new Map(history.map((item) => [item.date, item.medal])),
    [history]
  );

  const getDayComponent = (day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const medal = historyMap.get(dayStr);
    const config = medal ? medalConfig[medal] : null;

    const BaseDay = (
      <motion.div
        layout
        key={day.toString()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className={cn(
          'relative flex h-14 sm:h-20 w-full flex-col items-center justify-center rounded-lg border-2 transition-colors duration-200',
          isSameMonth(day, currentDate)
            ? 'bg-card'
            : 'bg-muted/50 text-muted-foreground',
          isSameDay(day, new Date()) &&
            'border-primary shadow-md shadow-primary/20',
          config ? config.color : 'border-dashed'
        )}
      >
        <span className="absolute top-1 right-1 sm:right-2 text-[10px] sm:text-xs font-medium">
          {format(day, 'd')}
        </span>
        <AnimatePresence>
          {config && (
            <motion.div
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <config.icon className="h-5 w-5 sm:h-7 sm:w-7 drop-shadow-md" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );

    if (config) {
      return (
        <TooltipProvider key={dayStr}>
          <Tooltip>
            <TooltipTrigger asChild>{BaseDay}</TooltipTrigger>
            <TooltipContent>
              <p>
                {format(day, 'MMMM d')}: {config.name}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return BaseDay;
  };

  return (
    <div className="p-2 sm:p-4 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <motion.h2
          key={format(currentDate, 'yyyy-MM')}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-lg sm:text-xl font-bold font-headline"
        >
          {format(currentDate, 'MMMM yyyy')}
        </motion.h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] sm:text-sm font-medium text-muted-foreground">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <motion.div
        layout
        className="grid grid-cols-7 gap-1 sm:gap-2 mt-2"
        transition={{ duration: 0.25 }}
      >
        {daysInMonth.map((day) => getDayComponent(day))}
      </motion.div>
    </div>
  );
}
