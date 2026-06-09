import type { Beneficiario, Cartao, Comercio, Credenciamento, Emissor, Programa, Recarga, Saque, Transacao } from "./types"

function toISO(d: string | Date | undefined | null): string {
  if (!d) return new Date().toISOString()
  if (typeof d === "string") return d
  return d.toISOString()
}

function mapStatus(s: string | undefined | null): string {
  if (!s) return "PENDENTE"
  const upper = s.toUpperCase()
  if (["ATIVO", "INATIVO", "PENDENTE", "BLOQUEADO", "CANCELADO"].includes(upper)) return upper
  if (upper === "SUSPENSO") return "BLOQUEADO"
  return "PENDENTE"
}

export function mapEmissor(row: Record<string, unknown>): Emissor {
  return {
    id: String(row.id_emissor ?? ""),
    nome: String(row.razao_social || row.nome_fantasia || ""),
    cnpj: String(row.cnpj ?? ""),
    status: mapStatus(String(row.status ?? "")) as Emissor["status"],
    programas: Number(row.programas_count || ((row._count as Record<string, unknown>)?.programas as number) || 0),
    criadoEm: toISO(String(row.data_cadastro ?? "")),
  }
}

export function mapPrograma(row: Record<string, unknown>): Programa {
  const codigo = String(row.codigo_programa ?? "")
  const tipoMap: Record<string, Programa["tipo"]> = {
    ALIMENTACAO: "ALIMENTACAO",
    REFEICAO: "REFEICAO",
    SAUDE: "SAUDE",
    MOBILIDADE: "MOBILIDADE",
    MULTIBENEFICIO: "MULTIBENEFICIO",
  }
  const tipoDetected = codigo.startsWith("VA") || codigo.startsWith("ALIM")
    ? "ALIMENTACAO"
    : codigo.startsWith("VR") || codigo.startsWith("REF")
    ? "REFEICAO"
    : codigo.startsWith("SAU")
    ? "SAUDE"
    : "MULTIBENEFICIO"

  return {
    id: String(row.id_programa ?? ""),
    nome: String(row.nome ?? ""),
    emissor: String(row.emissor_razao_social || row.emissor_nome_fantasia || ""),
    tipo: tipoMap[row.tipo as string] || tipoDetected,
    status: mapStatus(String(row.status ?? "")) as Programa["status"],
    beneficiarios: Number(row.beneficiarios_count || ((row._count as Record<string, unknown>)?.beneficiarios as number) || 0),
    criadoEm: toISO(String(row.created_at ?? "")),
  }
}

export function mapBeneficiario(row: Record<string, unknown>): Beneficiario {
  return {
    id: String(row.id_beneficiario ?? ""),
    nome: String(row.nome_completo ?? ""),
    cpf: String(row.cpf ?? ""),
    programa: String(row.programa_nome ?? ""),
    status: mapStatus(String(row.status_beneficiario ?? row.status ?? "")) as Beneficiario["status"],
    saldo: Number(row.saldo_atual ?? 0),
    criadoEm: toISO(String(row.data_cadastro ?? "")),
  }
}

export function mapComercio(row: Record<string, unknown>): Comercio {
  const endereco = String(row.endereco ?? "")
  const parts = endereco.split(",").map((s: string) => s.trim())
  return {
    id: String(row.id_comercio ?? ""),
    razaoSocial: String(row.razao_social ?? ""),
    cnpj: String(row.cnpj ?? ""),
    mcc: String(row.cnae_principal ?? row.categoria_comercio ?? ""),
    cidade: parts.length > 1 ? parts[parts.length - 2] : "",
    uf: parts.length > 0 ? parts[parts.length - 1].split(" ").pop() ?? "" : "",
    status: mapStatus(String(row.status_comercio ?? row.status ?? "")) as Comercio["status"],
    criadoEm: toISO(String(row.data_cadastro ?? "")),
  }
}

export function mapCartao(row: Record<string, unknown>): Cartao {
  const numero = String(row.numero_cartao ?? "")
  const mascarado = numero.length >= 4 ? `**** **** **** ${numero.slice(-4)}` : numero
  return {
    id: String(row.id_cartao ?? ""),
    numeroMascarado: mascarado,
    beneficiario: String(row.beneficiario_nome ?? row.beneficiario ?? ""),
    programa: String(row.programa_nome ?? ""),
    status: mapStatus(String(row.status_cartao ?? row.status ?? "")) as Cartao["status"],
    validade: String(row.validade ?? ""),
    criadoEm: toISO(String(row.data_emissao ?? "")),
  }
}

export function mapCredenciamento(row: Record<string, unknown>): Credenciamento {
  return {
    id: String(row.id_credenciamento ?? ""),
    comercio: String(row.comercio_nome ?? ""),
    cnpj: String(row.comercio_cnpj ?? ""),
    adquirente: String(row.adquirente ?? ""),
    status: mapStatus(String(row.status_credenciamento ?? row.status ?? "")) as Credenciamento["status"],
    criadoEm: toISO(String(row.data_credenciamento ?? "")),
  }
}

export function mapTransacao(row: Record<string, unknown>): Transacao {
  return {
    id: String(row.id_transacao ?? ""),
    cartao: String(row.numero_cartao ?? ""),
    comercio: String(row.comercio_nome ?? ""),
    valor: Number(row.valor_bruto ?? 0),
    tipo: (String(row.tipo_transacao ?? "compra").toUpperCase() === "COMPRA" ? "COMPRA"
      : String(row.tipo_transacao ?? "").toUpperCase() === "ESTORNO" ? "ESTORNO"
      : "AJUSTE") as Transacao["tipo"],
    status: (String(row.status_transacao ?? "").toUpperCase() === "CONFIRMADA"
      || String(row.status_transacao ?? "").toUpperCase() === "AUTORIZADA" ? "APROVADA"
      : String(row.status_transacao ?? "").toUpperCase() === "NEGADA" ? "NEGADA"
      : "PENDENTE") as Transacao["status"],
    data: toISO(String(row.data_hora_autorizacao ?? "")),
  }
}

export function mapRecarga(row: Record<string, unknown>): Recarga {
  return {
    id: String(row.id_recarga ?? ""),
    beneficiario: String(row.beneficiario_nome ?? ""),
    programa: String(row.programa_nome ?? ""),
    valor: Number(row.valor_creditado ?? 0),
    status: (String(row.status_recarga ?? "PROCESSADA").toUpperCase() === "PROCESSADA" ? "PROCESSADA"
      : String(row.status_recarga ?? "").toUpperCase() === "FALHA" ? "FALHA"
      : "PENDENTE") as Recarga["status"],
    data: toISO(String(row.data_credito ?? "")),
  }
}

export function mapSaque(row: Record<string, unknown>): Saque {
  return {
    id: String(row.id_saque ?? ""),
    comercio: String(row.comercio_nome ?? ""),
    cnpj: String(row.comercio_cnpj ?? ""),
    valor: Number(row.valor_solicitado ?? 0),
    status: (String(row.status_saque ?? "PENDENTE").toUpperCase() === "PAGO"
      || String(row.status_saque ?? "").toUpperCase() === "APROVADO" ? "LIQUIDADO"
      : String(row.status_saque ?? "").toUpperCase() === "REJEITADO"
      || String(row.status_saque ?? "").toUpperCase() === "REPROVADO" ? "REJEITADO"
      : "PENDENTE") as Saque["status"],
    data: toISO(String(row.data_solicitacao ?? "")),
  }
}
