"use client"

import { Shell } from "@/components/shell"
import { DataTable, type Column } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency, formatDate } from "@/lib/nav"
import type { Saque } from "@/lib/types"

const columns: Column<Saque>[] = [
  { key: "id", header: "ID", className: "font-mono text-xs" },
  { key: "comercio", header: "Comércio", render: (r) => <span className="font-medium">{r.comercio}</span> },
  { key: "cnpj", header: "CNPJ", className: "font-mono text-xs" },
  { key: "valor", header: "Valor", render: (r) => formatCurrency(r.valor), className: "text-right" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "data", header: "Data", render: (r) => formatDate(r.data) },
]

export default function Page() {
  return (
    <Shell title="Saques Comércio" description="Liquidações solicitadas pelos estabelecimentos">
      <DataTable<Saque>
        endpoint="/api/v1/saques"
        columns={columns}
        searchKeys={["comercio", "cnpj", "status", "id"]}
        searchPlaceholder="Buscar por comércio, CNPJ ou status..."
      />
    </Shell>
  )
}
