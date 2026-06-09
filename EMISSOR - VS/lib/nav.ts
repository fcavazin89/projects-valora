import {
  LayoutDashboard,
  Building2,
  Layers,
  Users,
  Store,
  CreditCard,
  BadgeCheck,
  ArrowLeftRight,
  Wallet,
  Banknote,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  endpoint?: string
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Emissores", href: "/emissores", icon: Building2, endpoint: "/api/v1/emissores" },
  { label: "Programas", href: "/programas", icon: Layers, endpoint: "/api/v1/programas" },
  { label: "Beneficiários", href: "/beneficiarios", icon: Users, endpoint: "/api/v1/beneficiarios" },
  { label: "Comércios", href: "/comercios", icon: Store, endpoint: "/api/v1/comercios" },
  { label: "Cartões", href: "/cartoes", icon: CreditCard, endpoint: "/api/v1/cartoes" },
  { label: "Credenciamentos", href: "/credenciamentos", icon: BadgeCheck, endpoint: "/api/v1/credenciamentos" },
  { label: "Transações", href: "/transacoes", icon: ArrowLeftRight, endpoint: "/api/v1/transacoes" },
  { label: "Recargas", href: "/recargas", icon: Wallet, endpoint: "/api/v1/recargas" },
  { label: "Saques Comércio", href: "/saques", icon: Banknote, endpoint: "/api/v1/saques" },
]

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(iso),
  )
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value)
}
