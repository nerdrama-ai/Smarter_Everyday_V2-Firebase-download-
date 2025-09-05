'use client'
import AppHeader from "@/components/AppHeader"
import AppSidebar from "@/components/AppSidebar"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

function AppLayoutContent({ children }) {
  const { open } = useSidebar()
  return (
    <div
      className={cn(
        "grid min-h-screen w-full transition-[grid-template-columns]",
        open ? "md:grid-cols-[280px_1fr]" : "md:grid-cols-[88px_1fr]"
      )}
    >
      <AppSidebar />
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background/60">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  )
}
