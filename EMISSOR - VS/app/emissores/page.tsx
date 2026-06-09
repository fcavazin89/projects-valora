"use client"

import { Shell } from "@/components/shell"
import { DataTable, type Column } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { formatDate, formatNumber } from "@/lib/nav"
import type { Emissor } from "@/lib/types"

const columns: Column<Emissor>[] = [
  { key: "id", header: "ID", className: "font-mono text-xs" },
  { key: "nome", header: "Nome", render: (r) => <span className="font-medium">{r.nome}</span> },
  { key: "cnpj", header: "CNPJ", className: "font-mono text-xs" },
  { key: "programas", header: "Programas", render: (r) => formatNumber(r.programas) },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "criadoEm", header: "Criado em", render: (r) => formatDate(r.criadoEm) },
]

export default function Page() {
  return (
    <Shell title="Emissores" description="Entidades emissoras de programas de benefícios">
      <DataTable<Emissor>
        endpoint="/api/v1/emissores"
        columns={columns}
        searchKeys={["nome", "cnpj", "id"]}
        searchPlaceholder="Buscar por nome, CNPJ ou ID..."
      />
    </Shell>
  )
}
