"use client"

import { Shell } from "@/components/shell"
import { DataTable, type Column } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { formatDate } from "@/lib/nav"
import type { Cartao } from "@/lib/types"

const columns: Column<Cartao>[] = [
  { key: "id", header: "ID", className: "font-mono text-xs" },
  { key: "numeroMascarado", header: "Número", className: "font-mono text-xs" },
  { key: "beneficiario", header: "Beneficiário", render: (r) => <span className="font-medium">{r.beneficiario}</span> },
  { key: "programa", header: "Programa" },
  { key: "validade", header: "Validade", className: "font-mono text-xs" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "criadoEm", header: "Emitido em", render: (r) => formatDate(r.criadoEm) },
]

export default function Page() {
  return (
    <Shell title="Cartões" description="Cartões emitidos para os beneficiários">
      <DataTable<Cartao>
        endpoint="/api/v1/cartoes"
        columns={columns}
        searchKeys={["numeroMascarado", "beneficiario", "programa", "id"]}
        searchPlaceholder="Buscar por número, beneficiário ou programa..."
      />
    </Shell>
  )
}
