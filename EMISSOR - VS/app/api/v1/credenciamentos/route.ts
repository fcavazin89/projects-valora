import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/valora-api"
import { mapCredenciamento } from "@/lib/api-mapper"

export async function GET() {
  try {
    const result = await apiFetch<any>("/credenciamentos")
    const data = (result.data ?? []).map(mapCredenciamento)
    return NextResponse.json({
      data,
      total: result.pagination?.total ?? data.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao buscar credenciamentos.", data: [], total: 0 },
      { status: 500 },
    )
  }
}
