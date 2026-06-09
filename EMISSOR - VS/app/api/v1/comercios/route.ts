import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/valora-api"
import { mapComercio } from "@/lib/api-mapper"

export async function GET() {
  try {
    const result = await apiFetch<any>("/comercios")
    const data = (result.data ?? []).map(mapComercio)
    return NextResponse.json({
      data,
      total: result.pagination?.total ?? data.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao buscar comércios.", data: [], total: 0 },
      { status: 500 },
    )
  }
}
