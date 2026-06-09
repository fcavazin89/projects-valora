"use client"

import { Shell } from "@/components/shell"
import { DataTable, type Column } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { formatCurrency, formatDate } from "@/lib/nav"
import type { Beneficiario } from "@/lib/types"

const columns: Column<Beneficiario>[] = [
  { key: "id", header: "ID", className: "font-mono text-xs" },
  { key: "nome", header: "Nome", render: (r) => <span className="font-medium">{r.nome}</span> },
  { key: "cpf", header: "CPF", className: "font-mono text-xs" },
  { key: "programa", header: "Programa" },
  { key: "saldo", header: "Saldo", render: (r) => formatCurrency(r.saldo) },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "criadoEm", header: "Criado em", render: (r) => formatDate(r.criadoEm) },
]

export default function Page() {
  return (
    <Shell title="Beneficiários" description="Portadores vinculados aos programas">
      <DataTable<Beneficiario>
        endpoint="/api/v1/beneficiarios"
        columns={columns}
        searchKeys={["nome", "cpf", "programa", "id"]}
        searchPlaceholder="Buscar por nome, CPF ou programa..."
      />
    </Shell>
  )
}
