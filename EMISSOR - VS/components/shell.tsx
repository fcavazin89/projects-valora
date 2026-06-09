import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"

export function Shell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <MobileNav />
            <div>
              <h1 className="text-balance text-lg font-semibold leading-tight text-foreground">{title}</h1>
              {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
          </div>
          {actions}
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
