import type {
  Beneficiario,
  Cartao,
  Comercio,
  Credenciamento,
  Emissor,
  Programa,
  Recarga,
  Saque,
  Status,
  Transacao,
} from "./types"

// Gerador determinístico simples para dados estáveis entre requests
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

const rng = seeded(42)

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function money(min: number, max: number) {
  return Math.round((min + rng() * (max - min)) * 100) / 100
}

function pad(n: number, size = 4) {
  return String(n).padStart(size, "0")
}

function dateBack(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

const statusComum: Status[] = ["ATIVO", "ATIVO", "ATIVO", "INATIVO", "PENDENTE", "BLOQUEADO"]

const nomesPessoas = [
  "Ana Beatriz Souza",
  "Carlos Eduardo Lima",
  "Mariana Oliveira",
  "João Pedro Alves",
  "Fernanda Costa",
  "Rafael Mendes",
  "Juliana Rocha",
  "Bruno Carvalho",
  "Patricia Gomes",
  "Lucas Martins",
  "Camila Ferreira",
  "Diego Barbosa",
  "Larissa Ribeiro",
  "Thiago Nunes",
  "Vanessa Pires",
]

const nomesEmpresas = [
  "Supermercado Bom Preço",
  "Padaria Pão Quente",
  "Restaurante Sabor Caseiro",
  "Farmácia Vida Plena",
  "Posto Avenida",
  "Mercado Central",
  "Lanchonete do Zé",
  "Hortifruti Verde",
  "Açougue Premium",
  "Conveniência 24h",
  "Distribuidora Aliança",
  "Mercearia da Esquina",
]

const ufs = ["SP", "RJ", "MG", "RS", "PR", "BA", "SC", "PE"]
const cidades = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre", "Curitiba", "Salvador"]
const adquirentes = ["Cielo", "Rede", "Getnet", "Stone", "PagSeguro"]
const mccs = ["5411", "5812", "5814", "5912", "5541", "5499"]

export const emissores: Emissor[] = Array.from({ length: 8 }, (_, i) => ({
  id: `EMI-${pad(i + 1)}`,
  nome: pick(["Vale Benefícios", "Flex Card", "Alelo Pay", "Sodexo Plus", "Ticket Mais", "VR Connect", "BenefíciaCard", "GoodCard"]) + ` ${i + 1}`,
  cnpj: `${pad(10 + i, 2)}.${pad(100 + i, 3)}.${pad(200 + i, 3)}/0001-${pad(i, 2)}`,
  status: pick(statusComum),
  programas: Math.floor(rng() * 6) + 1,
  criadoEm: dateBack(Math.floor(rng() * 700) + 30),
}))

const tiposProg: Programa["tipo"][] = ["ALIMENTACAO", "REFEICAO", "MOBILIDADE", "SAUDE", "MULTIBENEFICIO"]

export const programas: Programa[] = Array.from({ length: 14 }, (_, i) => ({
  id: `PRG-${pad(i + 1)}`,
  nome: `Programa ${pick(["Alimentação", "Refeição", "Mobilidade", "Saúde", "Multi"])} ${i + 1}`,
  emissor: pick(emissores).nome,
  tipo: pick(tiposProg),
  status: pick(statusComum),
  beneficiarios: Math.floor(rng() * 5000) + 100,
  criadoEm: dateBack(Math.floor(rng() * 600) + 20),
}))

export const beneficiarios: Beneficiario[] = Array.from({ length: 40 }, (_, i) => ({
  id: `BEN-${pad(i + 1)}`,
  nome: pick(nomesPessoas),
  cpf: `${pad(100 + i, 3)}.${pad(200 + i, 3)}.${pad(300 + i, 3)}-${pad(i, 2)}`,
  programa: pick(programas).nome,
  status: pick(statusComum),
  saldo: money(0, 2500),
  criadoEm: dateBack(Math.floor(rng() * 500) + 5),
}))

export const comercios: Comercio[] = Array.from({ length: 30 }, (_, i) => ({
  id: `COM-${pad(i + 1)}`,
  razaoSocial: pick(nomesEmpresas) + ` ${i + 1}`,
  cnpj: `${pad(20 + i, 2)}.${pad(300 + i, 3)}.${pad(400 + i, 3)}/0001-${pad(i, 2)}`,
  mcc: pick(mccs),
  cidade: pick(cidades),
  uf: pick(ufs),
  status: pick(statusComum),
  criadoEm: dateBack(Math.floor(rng() * 600) + 10),
}))

export const cartoes: Cartao[] = Array.from({ length: 50 }, (_, i) => ({
  id: `CAR-${pad(i + 1)}`,
  numeroMascarado: `**** **** **** ${pad(1000 + i).slice(-4)}`,
  beneficiario: pick(beneficiarios).nome,
  programa: pick(programas).nome,
  status: pick(statusComum),
  validade: `${pad((i % 12) + 1, 2)}/2${pad(8 + (i % 3), 1)}`,
  criadoEm: dateBack(Math.floor(rng() * 400) + 5),
}))

export const credenciamentos: Credenciamento[] = Array.from({ length: 24 }, (_, i) => {
  const c = pick(comercios)
  return {
    id: `CRD-${pad(i + 1)}`,
    comercio: c.razaoSocial,
    cnpj: c.cnpj,
    adquirente: pick(adquirentes),
    status: pick(statusComum),
    criadoEm: dateBack(Math.floor(rng() * 500) + 5),
  }
})

const tiposTx: Transacao["tipo"][] = ["COMPRA", "COMPRA", "COMPRA", "ESTORNO", "AJUSTE"]
const statusTx: Transacao["status"][] = ["APROVADA", "APROVADA", "APROVADA", "NEGADA", "PENDENTE"]

export const transacoes: Transacao[] = Array.from({ length: 120 }, (_, i) => ({
  id: `TRX-${pad(i + 1, 5)}`,
  cartao: pick(cartoes).numeroMascarado,
  comercio: pick(comercios).razaoSocial,
  valor: money(5, 800),
  tipo: pick(tiposTx),
  status: pick(statusTx),
  data: dateBack(Math.floor(rng() * 90)),
}))

const statusRec: Recarga["status"][] = ["PROCESSADA", "PROCESSADA", "PENDENTE", "FALHA"]

export const recargas: Recarga[] = Array.from({ length: 70 }, (_, i) => ({
  id: `REC-${pad(i + 1, 5)}`,
  beneficiario: pick(beneficiarios).nome,
  programa: pick(programas).nome,
  valor: money(50, 1500),
  status: pick(statusRec),
  data: dateBack(Math.floor(rng() * 90)),
}))

const statusSaq: Saque["status"][] = ["LIQUIDADO", "LIQUIDADO", "PENDENTE", "REJEITADO"]

export const saques: Saque[] = Array.from({ length: 45 }, (_, i) => {
  const c = pick(comercios)
  return {
    id: `SAQ-${pad(i + 1, 5)}`,
    comercio: c.razaoSocial,
    cnpj: c.cnpj,
    valor: money(100, 5000),
    status: pick(statusSaq),
    data: dateBack(Math.floor(rng() * 90)),
  }
})
