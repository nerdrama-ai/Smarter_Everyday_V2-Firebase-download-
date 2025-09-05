'use client'

import { mockUsers } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { StickerCalendar } from "@/components/profile/StickerCalendar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Award, Crown, Gem, Medal as MedalIcon, Star, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const medalConfig = {
  bronze: { name: 'Bronze', color: 'text-orange-400', icon: MedalIcon },
  silver: { name: 'Silver', color: 'text-slate-400', icon: Award },
  gold: { name: 'Gold', color: 'text-yellow-500', icon: Crown },
  platinum: { name: 'Platinum', color: 'text-slate-400', icon: Crown },
  emerald: { name: 'Emerald', color: 'text-emerald-500', icon: Gem },
}

export default function ProfilePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    setUser(storedUser ? JSON.parse(storedUser) : mockUsers[0])
  }, [])

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-40 rounded-md" />
        </div>
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg md:col-span-2" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  const totalQuizzes = user.quizHistory.length
  const overallAccuracy = 82
  const currentStreak = 5

  const medalCounts = user.quizHistory.reduce((acc, attempt) => {
    if (attempt.medal) {
      acc[attempt.medal] = (acc[attempt.medal] || 0) + 1
    }
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold font-headline">My Profile</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 space-y-4 sm:space-y-0">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl md:text-3xl font-headline">{user.name}</CardTitle>
            <CardDescription>Member since 2024 • {user.mobileNumber}</CardDescription>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span><span className="font-bold text-foreground">{currentStreak}</span> day streak</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span><span className="font-bold text-foreground">{totalQuizzes}</span> quizzes played</span>
              </div>
            </div>
          </div>
          <Button className="w-full sm:w-auto">Edit Profile</Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Overall Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="text-muted/20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${overallAccuracy}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl font-bold">{overallAccuracy}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Medal Cabinet
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            {Object.keys(medalConfig).map(medal => {
              const count = medalCounts[medal] || 0
              const config = medalConfig[medal]
              const Icon = config.icon
              return (
                <div key={medal} className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg bg-card/50 border border-dashed">
                  <Icon className={cn("h-8 w-8 sm:h-10 sm:w-10", config.color)} />
                  <p className="text-xl sm:text-2xl font-bold mt-2">{count}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{config.name}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Sticker Collection</CardTitle>
          <CardDescription>Your quiz achievements for the current month.</CardDescription>
        </CardHeader>
        <CardContent>
          <StickerCalendar history={user.quizHistory} />
        </CardContent>
      </Card>
    </div>
  )
}
