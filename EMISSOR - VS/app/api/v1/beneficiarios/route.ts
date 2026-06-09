import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/valora-api"
import { mapBeneficiario } from "@/lib/api-mapper"

export async function GET() {
  try {
    const result = await apiFetch<any>("/beneficiarios")
    const data = (result.data ?? []).map(mapBeneficiario)
    return NextResponse.json({
      data,
      total: result.pagination?.total ?? data.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao buscar beneficiários.", data: [], total: 0 },
      { status: 500 },
    )
  }
}
