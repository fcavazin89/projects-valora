"use client"

import { Shell } from "@/components/shell"
import { DataTable, type Column } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency, formatDate } from "@/lib/nav"
import type { Recarga } from "@/lib/types"

const columns: Column<Recarga>[] = [
  { key: "id", header: "ID", className: "font-mono text-xs" },
  { key: "beneficiario", header: "Beneficiário", render: (r) => <span className="font-medium">{r.beneficiario}</span> },
  { key: "programa", header: "Programa" },
  { key: "valor", header: "Valor", render: (r) => formatCurrency(r.valor), className: "text-right" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "data", header: "Data", render: (r) => formatDate(r.data) },
]

export default function Page() {
  return (
    <Shell title="Recargas" description="Créditos aplicados aos benefícios">
      <DataTable<Recarga>
        endpoint="/api/v1/recargas"
        columns={columns}
        searchKeys={["beneficiario", "programa", "status", "id"]}
        searchPlaceholder="Buscar por beneficiário, programa ou status..."
      />
    </Shell>
  )
}
