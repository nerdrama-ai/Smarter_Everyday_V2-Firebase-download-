'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Confetti from 'react-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Medal as MedalIcon,
  Crown,
  Sparkles,
  Share2,
  Award,
  Gem,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { generateAchievementBadge } from '@/ai/flows/achievement-badges';

export function QuizResultModal({
  isOpen,
  onClose,
  score,
  totalQuestions,
  isMegaQuiz,
  onUnlockMegaQuiz,
  onRestart,
}) {
  const [badgeInfo, setBadgeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  let medal = null;
  let medalName = '';
  let medalColor = '';
  let MedalComponent = Award;
  const percentage = (score / totalQuestions) * 100;

  if (totalQuestions === 20) {
    if (percentage >= 100) {
      medal = 'emerald';
      medalName = 'Emerald Medal';
      medalColor = 'text-emerald-500';
      MedalComponent = Gem;
    } else if (percentage >= 75) {
      medal = 'platinum';
      medalName = 'Platinum Medal';
      medalColor = 'text-slate-400';
      MedalComponent = Crown;
    }
  } else if (totalQuestions === 10) {
    if (percentage >= 100) {
      medal = 'gold';
      medalName = 'Gold Medal';
      medalColor = 'text-yellow-500';
      MedalComponent = Crown;
    } else if (percentage >= 80) {
      medal = 'silver';
      medalName = 'Silver Medal';
      medalColor = 'text-slate-400';
      MedalComponent = MedalIcon;
    } else if (percentage >= 50) {
      medal = 'bronze';
      medalName = 'Bronze Medal';
      medalColor = 'text-orange-400';
      MedalComponent = MedalIcon;
    }
  }

  useEffect(() => {
    if (isOpen) {
      const fetchBadge = async () => {
        setLoading(true);
        setShowConfetti(false);
        try {
          const input = {
            milestone: medal ? `${medal}Medal` : 'dailyCompletion',
            username: 'Alex',
          };
          const result = await generateAchievementBadge(input);

          // placeholder image since no real generation here
          const placeholderBadge = {
            badgeDataUri: `https://picsum.photos/seed/${input.milestone}/512`,
            badgeDescription:
              result.badgeDescription ||
              `You've achieved ${medalName || 'a new milestone'}!`,
          };
          setBadgeInfo(placeholderBadge);

          // trigger confetti when badge is ready
          setTimeout(() => setShowConfetti(true), 300);
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
    } else {
      setShowConfetti(false);
    }
  }, [isOpen, medal, medalName]);

  const handleShare = () => {
    alert('Sharing to social media!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center relative overflow-hidden">
        {/* Confetti animation */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={180}
            recycle={false}
            className="pointer-events-none"
          />
        )}

        <DialogHeader>
          <DialogTitle className="text-3xl font-headline mx-auto animate-bounce">
            Quiz Completed!
          </DialogTitle>
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
                <Image
                  src={badgeInfo.badgeDataUri}
                  alt="Achievement Badge"
                  width={192}
                  height={192}
                  className="rounded-full shadow-xl border-4 border-primary animate-fade-in"
                />
              )}
              {medal && (
                <div
                  className={`flex items-center gap-2 text-xl font-bold animate-pulse ${medalColor}`}
                >
                  <MedalComponent className="h-8 w-8" />
                  <span>{medalName} Unlocked!</span>
                </div>
              )}
              <p className="text-muted-foreground animate-fade-in">
                {badgeInfo?.badgeDescription}
              </p>
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-center flex-col sm:flex-col gap-2">
          {isMegaQuiz && (
            <Button
              onClick={onUnlockMegaQuiz}
              className="w-full bg-accent hover:bg-accent/90 animate-glow"
            >
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
