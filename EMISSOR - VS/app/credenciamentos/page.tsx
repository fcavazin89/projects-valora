"use client"

import { Shell } from "@/components/shell"
import { DataTable, type Column } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/nav"
import type { Credenciamento } from "@/lib/types"

const columns: Column<Credenciamento>[] = [
  { key: "id", header: "ID", className: "font-mono text-xs" },
  { key: "comercio", header: "Comércio", render: (r) => <span className="font-medium">{r.comercio}</span> },
  { key: "cnpj", header: "CNPJ", className: "font-mono text-xs" },
  { key: "adquirente", header: "Adquirente", render: (r) => <Badge variant="secondary">{r.adquirente}</Badge> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "criadoEm", header: "Credenciado em", render: (r) => formatDate(r.criadoEm) },
]

export default function Page() {
  return (
    <Shell title="Credenciamentos" description="Vínculos entre comércios e adquirentes">
      <DataTable<Credenciamento>
        endpoint="/api/v1/credenciamentos"
        columns={columns}
        searchKeys={["comercio", "cnpj", "adquirente", "id"]}
        searchPlaceholder="Buscar por comércio, CNPJ ou adquirente..."
      />
    </Shell>
  )
}
