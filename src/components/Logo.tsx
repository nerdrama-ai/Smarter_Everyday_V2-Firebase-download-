import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, isCollapsed }: { className?: string, isCollapsed?: boolean }) {
  const Comp = isCollapsed ? 'div' : Link;
  return (
    <Comp href="/dashboard" className={cn("flex items-center gap-2", isCollapsed && "cursor-pointer", className)}>
      <BrainCircuit className="h-8 w-8 text-primary" />
      <h1 className={cn(
          "text-2xl font-bold font-headline tracking-tighter transition-all duration-300 ease-in-out",
          isCollapsed && "hidden"
        )}>
        The Quizway
      </h1>
    </Comp>
  );
}
