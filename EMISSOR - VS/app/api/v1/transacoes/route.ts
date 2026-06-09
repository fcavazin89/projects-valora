import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/valora-api"
import { mapTransacao } from "@/lib/api-mapper"

export async function GET() {
  try {
    const result = await apiFetch<any>("/transacoes")
    const data = (result.data ?? []).map(mapTransacao)
    return NextResponse.json({
      data,
      total: result.pagination?.total ?? data.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao buscar transações.", data: [], total: 0 },
      { status: 500 },
    )
  }
}
