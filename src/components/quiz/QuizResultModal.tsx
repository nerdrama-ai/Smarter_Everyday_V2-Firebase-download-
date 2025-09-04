'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { generateAchievementBadge, AchievementBadgeOutput, AchievementBadgeInput } from '@/ai/flows/achievement-badges';
import { Medal as MedalIcon, Crown, Sparkles, Share2, Award, Gem } from 'lucide-react';
import type { Medal } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface QuizResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalQuestions: number;
  isMegaQuiz: boolean;
  onUnlockMegaQuiz: () => void;
  onRestart: () => void;
}

export function QuizResultModal({ isOpen, onClose, score, totalQuestions, isMegaQuiz, onUnlockMegaQuiz, onRestart }: QuizResultModalProps) {
  const [badgeInfo, setBadgeInfo] = useState<AchievementBadgeOutput | null>(null);
  const [loading, setLoading] = useState(true);

  let medal: Medal | null = null;
  let medalName: string = '';
  let medalColor: string = '';
  let MedalComponent: any = Award;
  const percentage = (score / totalQuestions) * 100;
  
  if(totalQuestions === 20) {
    if(percentage >= 100) { medal = 'emerald'; medalName = "Emerald Medal"; medalColor = "text-emerald-500"; MedalComponent = Gem }
    else if(percentage >= 75) { medal = 'platinum'; medalName = "Platinum Medal"; medalColor = "text-slate-400"; MedalComponent = Crown; }
  } else if (totalQuestions === 10) {
    if (percentage >= 100) { medal = 'gold'; medalName = "Gold Medal"; medalColor = "text-yellow-500"; MedalComponent = Crown; }
    else if (percentage >= 80) { medal = 'silver'; medalName = "Silver Medal"; medalColor = "text-slate-400"; MedalComponent = MedalIcon }
    else if (percentage >= 50) { medal = 'bronze'; medalName = "Bronze Medal"; medalColor = "text-orange-400"; MedalComponent = MedalIcon }
  }

  useEffect(() => {
    if (isOpen) {
      const fetchBadge = async () => {
        setLoading(true);
        try {
          const input: AchievementBadgeInput = {
            milestone: medal ? `${medal}Medal` : 'dailyCompletion',
            username: 'Alex',
          };
          const result = await generateAchievementBadge(input);
          
          // Using a placeholder as imagen is not available for generation in this context
          const placeholderBadge = {
            badgeDataUri: `https://picsum.photos/seed/${input.milestone}/512`,
            badgeDescription: result.badgeDescription || `You've achieved ${medalName || 'a new milestone'}!`
          }
          setBadgeInfo(placeholderBadge);

        } catch (error) {
          console.error('Failed to generate badge:', error);
          setBadgeInfo({
            badgeDataUri: 'https://picsum.photos/seed/error/512',
            badgeDescription: 'Congratulations on completing the quiz!',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchBadge();
    }
  }, [isOpen, medal, medalName]);

  const handleShare = () => {
    // Mock sharing functionality
    alert('Sharing to social media!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline mx-auto">Quiz Completed!</DialogTitle>
          <DialogDescription>
            You scored {score} out of {totalQuestions}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          {loading ? (
            <div className="space-y-2 flex flex-col items-center">
                <Skeleton className="h-48 w-48 rounded-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
          ) : (
            <>
              {badgeInfo?.badgeDataUri && (
                <Image src={badgeInfo.badgeDataUri} alt="Achievement Badge" width={192} height={192} className="rounded-full shadow-lg border-4 border-primary" data-ai-hint="achievement badge"/>
              )}
              {medal && (
                <div className={`flex items-center gap-2 text-xl font-bold ${medalColor}`}>
                    <MedalComponent className="h-8 w-8" />
                    <span>{medalName} Unlocked!</span>
                </div>
              )}
              <p className="text-muted-foreground">{badgeInfo?.badgeDescription}</p>
            </>
          )}
        </div>
        
        <DialogFooter className="sm:justify-center flex-col sm:flex-col sm:space-x-0 gap-2">
          {isMegaQuiz && (
            <Button onClick={onUnlockMegaQuiz} className="w-full bg-accent hover:bg-accent/90">
              <Sparkles className="mr-2 h-4 w-4" /> Unlock Sunday Mega Quiz!
            </Button>
          )}
          <Button onClick={handleShare} variant="outline" className="w-full">
            <Share2 className="mr-2 h-4 w-4" /> Share Your Achievement
          </Button>
          <Button onClick={onRestart} variant="ghost" className="w-full">
            Back to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
