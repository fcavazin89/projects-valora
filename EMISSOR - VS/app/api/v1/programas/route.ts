import { NextResponse } from "next/server"
import { apiFetch } from "@/lib/valora-api"
import { mapPrograma } from "@/lib/api-mapper"

export async function GET() {
  try {
    const result = await apiFetch<any>("/programas")
    const data = (result.data ?? []).map(mapPrograma)
    return NextResponse.json({
      data,
      total: result.pagination?.total ?? data.length,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao buscar programas.", data: [], total: 0 },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const payload: Record<string, unknown> = {
      id_emissor: Number(body.emissor) || 1,
      nome: body.nome,
      codigo_programa: `PRG-${Date.now()}`,
      descricao: body.descricao || `Programa ${body.nome}`,
      data_inicio: new Date().toISOString().split("T")[0],
      dia_credito: 5,
      status: (String(body.status ?? "PENDENTE")).toLowerCase(),
      valor_base_mensal: 0,
      periodicidade: "mensal",
    }
    const result = await apiFetch<any>("/programas", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    return NextResponse.json({ data: mapPrograma(result.data ?? {}) }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao criar programa." },
      { status: 500 },
    )
  }
}
