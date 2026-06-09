"use client"

import { Shell } from "@/components/shell"
import { DataTable, type Column } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { NovoProgramaDialog } from "@/components/novo-programa-dialog"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatNumber } from "@/lib/nav"
import type { Programa } from "@/lib/types"

const columns: Column<Programa>[] = [
  { key: "id", header: "ID", className: "font-mono text-xs" },
  { key: "nome", header: "Nome", render: (r) => <span className="font-medium">{r.nome}</span> },
  { key: "emissor", header: "Emissor" },
  { key: "tipo", header: "Tipo", render: (r) => <Badge variant="secondary">{r.tipo}</Badge> },
  { key: "beneficiarios", header: "Beneficiários", render: (r) => formatNumber(r.beneficiarios) },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "criadoEm", header: "Criado em", render: (r) => formatDate(r.criadoEm) },
]

export default function Page() {
  return (
    <Shell title="Programas" description="Programas de benefícios vinculados aos emissores">
      <DataTable<Programa>
        endpoint="/api/v1/programas"
        columns={columns}
        searchKeys={["nome", "emissor", "tipo", "id"]}
        searchPlaceholder="Buscar por nome, emissor ou tipo..."
        toolbar={<NovoProgramaDialog />}
      />
    </Shell>
  )
}
