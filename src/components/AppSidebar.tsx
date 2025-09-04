'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { useSidebar } from './ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/admin', icon: ShieldCheck, label: 'Admin' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();

  return (
    <div className={cn(
        "hidden border-r bg-muted/40 md:flex md:flex-col gap-2 transition-all",
    )}>
        <div className={cn(
            "flex h-14 items-center justify-between border-b lg:h-[60px]",
            open ? "px-4" : "px-2.5",
            !open && "justify-center"
            )}
            onClick={!open ? toggleSidebar : undefined}
            >
          <Logo isCollapsed={!open}/>
           <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn(!open && "hidden")}>
              <ChevronLeft className={cn("h-5 w-5 transition-transform")} />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
        </div>
        <div className="flex-1">
          <nav className={cn("grid items-start text-sm font-medium",
            open ? "px-4" : "px-3 mt-4"
          )}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg py-3 text-muted-foreground transition-all hover:text-primary',
                   open ? 'px-3' : 'justify-center',
                   pathname === item.href && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn(!open && "hidden")}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className={cn(
            "mt-auto p-4 border-t",
            !open && "p-2"
        )}>
             <Button size="sm" variant="ghost" className={cn("w-full", open ? "justify-start" : "justify-center")} asChild>
              <Link href="/">
                <LogOut className={cn("h-5 w-5", open && "mr-2")} />
                <span className={cn(!open && "hidden")}>Logout</span>
              </Link>
            </Button>
        </div>
    </div>
  );
}
