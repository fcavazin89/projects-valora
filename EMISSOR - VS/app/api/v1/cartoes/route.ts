import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/valora-api"
import { mapCartao } from "@/lib/api-mapper"

export async function GET() {
  try {
    const result = await apiFetch<any>("/cartoes")
    const data = (result.data ?? []).map(mapCartao)
    return NextResponse.json({
      data,
      total: result.pagination?.total ?? data.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao buscar cartões.", data: [], total: 0 },
      { status: 500 },
    )
  }
}
