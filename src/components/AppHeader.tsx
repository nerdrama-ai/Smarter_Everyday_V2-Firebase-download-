'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  Menu,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { WeeklyProgressBar } from './WeeklyProgressBar';
import { mockUsers } from '@/lib/mock-data';
import type { User as UserType } from '@/lib/types';
import { Logo } from './Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/admin', icon: ShieldCheck, label: 'Admin' },
  ];

export default function AppHeader() {
  const [user, setUser] = useState<UserType | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : mockUsers[0]);
    };
    
    fetchUser();
    
    window.addEventListener('storage', fetchUser);

    return () => {
      window.removeEventListener('storage', fetchUser);
    };
  }, []);

  if (!user) {
    return (
        <header className="flex h-auto items-center gap-4 border-b bg-muted/40 px-4 py-2 lg:h-[60px] lg:px-6 lg:py-3 animate-pulse">
            <div className="h-8 w-8 bg-muted-foreground/20 rounded-md md:hidden" />
            <div className="flex-1 h-10 bg-muted-foreground/20 rounded-md" />
            <div className="h-10 w-10 bg-muted-foreground/20 rounded-full ml-auto" />
        </header>
    )
  }

  return (
    <header className="flex h-auto items-center gap-4 border-b bg-muted/40 px-4 py-2 lg:h-[60px] lg:px-6 lg:py-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <div className="mb-4">
              <Logo />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                  pathname === item.href && 'bg-muted text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Button size="sm" variant="ghost" className="w-full justify-start" asChild>
                <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      <div className="w-full flex-1 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <WeeklyProgressBar weeklyProgress={user.weeklyProgress} />
        </motion.div>
      </div>

      <div className="ml-auto">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
                <Image
                src={user.avatarUrl}
                width={36}
                height={36}
                alt="User Avatar"
                className="rounded-full"
                data-ai-hint="user avatar"
                />
                <span className="sr-only">Toggle user menu</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/">Logout</Link>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
