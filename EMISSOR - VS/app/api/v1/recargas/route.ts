import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/valora-api"
import { mapRecarga } from "@/lib/api-mapper"

export async function GET() {
  try {
    const result = await apiFetch<any>("/recargas")
    const data = (result.data ?? []).map(mapRecarga)
    return NextResponse.json({
      data,
      total: result.pagination?.total ?? data.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao buscar recargas.", data: [], total: 0 },
      { status: 500 },
    )
  }
}
