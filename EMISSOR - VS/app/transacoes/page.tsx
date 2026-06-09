"use client"

import { Shell } from "@/components/shell"
import { DataTable, type Column } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/nav"
import type { Transacao } from "@/lib/types"

const columns: Column<Transacao>[] = [
  { key: "id", header: "ID", className: "font-mono text-xs" },
  { key: "cartao", header: "Cartão", className: "font-mono text-xs" },
  { key: "comercio", header: "Comércio", render: (r) => <span className="font-medium">{r.comercio}</span> },
  { key: "tipo", header: "Tipo", render: (r) => <Badge variant="secondary">{r.tipo}</Badge> },
  { key: "valor", header: "Valor", render: (r) => formatCurrency(r.valor), className: "text-right" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "data", header: "Data", render: (r) => formatDate(r.data) },
]

export default function Page() {
  return (
    <Shell title="Transações" description="Movimentações realizadas com os cartões">
      <DataTable<Transacao>
        endpoint="/api/v1/transacoes"
        columns={columns}
        searchKeys={["cartao", "comercio", "tipo", "status", "id"]}
        searchPlaceholder="Buscar por cartão, comércio ou status..."
      />
    </Shell>
  )
}
