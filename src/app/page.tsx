import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, Zap, BarChart, Badge, CalendarCheck } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline tracking-tighter">
            The Quizway
          </h1>
        </div>
        <Button asChild variant="ghost">
          <Link href="/login">
            Login or Sign Up <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </header>
      <main className="flex-grow">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
                  Get Smarter, One Day at a Time
                </h1>
                <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                  Join The Quizway and challenge yourself with daily quizzes. Build your knowledge, earn badges, and compete with friends.
                </p>
              </div>
               <div className="w-full max-w-sm mx-auto">
                 <Button asChild size="lg" className="w-full">
                    <Link href="/login">
                      Start Your Streak <Zap className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
               </div>
            </div>
          </div>
        </section>

         <section className="w-full pb-12 md:pb-24 lg:pb-32">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <CalendarCheck className="h-10 w-10 text-primary"/>
                            <CardTitle className="font-headline text-xl">Daily Challenges</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Test your knowledge on a new topic every single day. Consistency is key!</p>
                        </CardContent>
                    </Card>
                     <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Badge className="h-10 w-10 text-primary"/>
                            <CardTitle className="font-headline text-xl">Earn Badges</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Unlock achievement badges and medals for your performance and streaks.</p>
                        </CardContent>
                    </Card>
                     <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <BarChart className="h-10 w-10 text-primary"/>
                            <CardTitle className="font-headline text-xl">Track Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-muted-foreground">Monitor your accuracy and see how you stack up against others.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} The Quizway. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
