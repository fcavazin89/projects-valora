import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/valora-api"
import { mapSaque } from "@/lib/api-mapper"

export async function GET() {
  try {
    const result = await apiFetch<any>("/saques")
    const data = (result.data ?? []).map(mapSaque)
    return NextResponse.json({
      data,
      total: result.pagination?.total ?? data.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao buscar saques.", data: [], total: 0 },
      { status: 500 },
    )
  }
}
