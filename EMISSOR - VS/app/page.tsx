"use client"

import useSWR from "swr"
import { Shell } from "@/components/shell"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { TransacoesChart, StatusPie, TopComerciosChart } from "@/components/dashboard-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate, formatNumber } from "@/lib/nav"
import { Building2, Layers, Users, CreditCard, ArrowLeftRight, Wallet, Loader2 } from "lucide-react"
import type { Transacao, Recarga, Cartao, Beneficiario, Programa, Emissor, Comercio, Saque } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function buildSeries(transacoes: Transacao[]) {
  const days = 30
  const buckets = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
    buckets.set(key, 0)
  }
  for (const t of transacoes) {
    if (t.tipo !== "COMPRA" || t.status !== "APROVADA") continue
    const d = new Date(t.data)
    const key = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
    if (buckets.has(key)) buckets.set(key, Math.round((buckets.get(key)! + t.valor) * 100) / 100)
  }
  return Array.from(buckets, ([dia, valor]) => ({ dia, valor }))
}

function buildStatusPie(transacoes: Transacao[]) {
  const counts = transacoes.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1
    return acc
  }, {})
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

function buildTopComercios(transacoes: Transacao[]) {
  const totals = new Map<string, number>()
  for (const t of transacoes) {
    if (t.status !== "APROVADA") continue
    totals.set(t.comercio, Math.round(((totals.get(t.comercio) ?? 0) + t.valor) * 100) / 100)
  }
  return Array.from(totals, ([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 6)
}

export default function Page() {
  const { data: txData } = useSWR<{ data: Transacao[] }>("/api/v1/transacoes", fetcher)
  const { data: recData } = useSWR<{ data: Recarga[] }>("/api/v1/recargas", fetcher)
  const { data: carData } = useSWR<{ data: Cartao[] }>("/api/v1/cartoes", fetcher)
  const { data: benData } = useSWR<{ data: Beneficiario[] }>("/api/v1/beneficiarios", fetcher)
  const { data: progData } = useSWR<{ data: Programa[] }>("/api/v1/programas", fetcher)
  const { data: emiData } = useSWR<{ data: Emissor[] }>("/api/v1/emissores", fetcher)
  const { data: comData } = useSWR<{ data: Comercio[] }>("/api/v1/comercios", fetcher)
  const { data: saqData } = useSWR<{ data: Saque[] }>("/api/v1/saques", fetcher)

  const transacoes = txData?.data ?? []
  const recargas = recData?.data ?? []
  const cartoes = carData?.data ?? []
  const beneficiarios = benData?.data ?? []
  const programas = progData?.data ?? []
  const emissores = emiData?.data ?? []
  const comercios = comData?.data ?? []
  const saques = saqData?.data ?? []

  const isLoading = !txData || !recData || !carData || !benData || !progData || !emiData || !comData || !saqData

  const volumeAprovado = transacoes
    .filter((t) => t.status === "APROVADA" && t.tipo === "COMPRA")
    .reduce((s, t) => s + t.valor, 0)
  const totalRecargas = recargas.filter((r) => r.status === "PROCESSADA").reduce((s, r) => s + r.valor, 0)
  const cartoesAtivos = cartoes.filter((c) => c.status === "ATIVO").length
  const beneficiariosAtivos = beneficiarios.filter((b) => b.status === "ATIVO").length

  const ultimasTransacoes = [...transacoes]
    .sort((a, b) => +new Date(b.data) - +new Date(a.data))
    .slice(0, 8)

  if (isLoading) {
    return (
      <Shell title="Dashboard" description="Carregando indicadores...">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </Shell>
    )
  }

  return (
    <Shell title="Dashboard" description="Visão geral do emissor e da operação de benefícios">
      <div className="flex flex-col gap-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Volume transacionado"
            value={formatCurrency(volumeAprovado)}
            hint="Compras aprovadas"
            icon={ArrowLeftRight}
            accent
          />
          <StatCard label="Recargas processadas" value={formatCurrency(totalRecargas)} hint={`${recargas.length} solicitações`} icon={Wallet} />
          <StatCard label="Cartões ativos" value={formatNumber(cartoesAtivos)} hint={`${cartoes.length} emitidos`} icon={CreditCard} />
          <StatCard label="Beneficiários ativos" value={formatNumber(beneficiariosAtivos)} hint={`${beneficiarios.length} cadastrados`} icon={Users} />
          <StatCard label="Programas" value={formatNumber(programas.length)} hint={`${emissores.length} emissores`} icon={Layers} />
          <StatCard label="Comércios" value={formatNumber(comercios.length)} hint={`${saques.length} saques no período`} icon={Building2} />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransacoesChart data={buildSeries(transacoes)} />
          </div>
          <StatusPie data={buildStatusPie(transacoes)} />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TopComerciosChart data={buildTopComercios(transacoes)} />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Últimas transações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {ultimasTransacoes.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{t.comercio}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.cartao} · {formatDate(t.data)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-medium text-foreground">{formatCurrency(t.valor)}</span>
                      <StatusBadge status={t.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </Shell>
  )
}
