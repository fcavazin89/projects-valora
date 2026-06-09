import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const map: Record<string, string> = {
  ATIVO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  APROVADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PROCESSADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
  LIQUIDADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDENTE: "bg-amber-50 text-amber-700 border-amber-200",
  INATIVO: "bg-slate-100 text-slate-600 border-slate-200",
  BLOQUEADO: "bg-red-50 text-red-700 border-red-200",
  NEGADA: "bg-red-50 text-red-700 border-red-200",
  FALHA: "bg-red-50 text-red-700 border-red-200",
  REJEITADO: "bg-red-50 text-red-700 border-red-200",
  CANCELADO: "bg-red-50 text-red-700 border-red-200",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", map[status] ?? "bg-muted text-muted-foreground")}>
      {status}
    </Badge>
  )
}
