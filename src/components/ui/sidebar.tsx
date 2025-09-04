"use client"

import * as React from "react"

type SidebarContext = {
  open: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(true)

  const toggleSidebar = () => {
    setOpen((prev) => !prev)
  }

  return (
    <SidebarContext.Provider value={{ open, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}
