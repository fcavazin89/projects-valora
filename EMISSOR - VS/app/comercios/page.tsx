"use client"

import { Shell } from "@/components/shell"
import { DataTable, type Column } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { formatDate } from "@/lib/nav"
import type { Comercio } from "@/lib/types"

const columns: Column<Comercio>[] = [
  { key: "id", header: "ID", className: "font-mono text-xs" },
  { key: "razaoSocial", header: "Razão Social", render: (r) => <span className="font-medium">{r.razaoSocial}</span> },
  { key: "cnpj", header: "CNPJ", className: "font-mono text-xs" },
  { key: "mcc", header: "MCC", className: "font-mono text-xs" },
  { key: "local", header: "Cidade/UF", render: (r) => `${r.cidade} / ${r.uf}` },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "criadoEm", header: "Criado em", render: (r) => formatDate(r.criadoEm) },
]

export default function Page() {
  return (
    <Shell title="Comércios" description="Estabelecimentos cadastrados na rede">
      <DataTable<Comercio>
        endpoint="/api/v1/comercios"
        columns={columns}
        searchKeys={["razaoSocial", "cnpj", "cidade", "uf", "id"]}
        searchPlaceholder="Buscar por razão social, CNPJ ou cidade..."
      />
    </Shell>
  )
}
