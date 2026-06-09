import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/valora-api"
import { mapEmissor } from "@/lib/api-mapper"

export async function GET() {
  try {
    const result = await apiFetch<any>("/emissores")
    const data = (result.data ?? []).map(mapEmissor)
    return NextResponse.json({
      data,
      total: result.pagination?.total ?? data.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao buscar emissores.", data: [], total: 0 },
      { status: 500 },
    )
  }
}
