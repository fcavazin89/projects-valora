"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { Menu, X, CreditCard } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const current = navItems.find((n) => n.href === pathname)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
        aria-label="Abrir menu de navegação"
      >
        <Menu className="size-4" />
        {current?.label ?? "Menu"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="relative flex w-72 flex-col bg-sidebar text-sidebar-foreground">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <CreditCard className="size-4" />
                </div>
                <span className="text-sm font-semibold">Portal do Emissor</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu">
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {navItems.map((item) => {
                const active = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
