import { NextResponse } from "next/server"
import { approveChargeOnChain } from "@/lib/blockchain"
import { transacaoApi, comercioApi } from "@/lib/valora-api"

// Trata preflight CORS vindo do VOUCHER SOCIAL
export async function OPTIONS() {
  const voucherAppUrl = process.env.NEXT_PUBLIC_VOUCHER_APP_URL || "http://localhost:3001"
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": voucherAppUrl,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST(request: Request) {
  const voucherAppUrl = process.env.NEXT_PUBLIC_VOUCHER_APP_URL || "http://localhost:3001"

  try {
    const body = await request.json()
    const { chargeId, beneficiaryAddress, merchantAddress, amount, cartaoId } = body

    if (!chargeId || !beneficiaryAddress) {
      return NextResponse.json(
        { error: "chargeId e beneficiaryAddress são obrigatórios" },
        { status: 400, headers: { "Access-Control-Allow-Origin": voucherAppUrl } }
      )
    }

    // 1. Executa aprovação na blockchain
    const result = await approveChargeOnChain(chargeId, beneficiaryAddress)

    // 2. Registra transação na valora-api (best-effort)
    try {
      if (merchantAddress && amount && cartaoId) {
        const comercio = await comercioApi.getByWallet(merchantAddress)
        if (comercio?.id) {
          await transacaoApi.create({
            cartao_id: cartaoId,
            comercio_id: comercio.id,
            valor: amount,
            tipo: "pagamento",
            tx_hash: result.hash,
          })
        }
      }
    } catch (apiErr) {
      console.warn("[valora-api] Falha ao registrar transação:", apiErr)
    }

    return NextResponse.json(
      {
        success: true,
        chargeId,
        transactionHash: result.hash,
        blockNumber: result.receipt.blockNumber?.toString(),
        explorerUrl: `${process.env.NEXT_PUBLIC_BLOCK_EXPLORER || "https://sepolia.etherscan.io"}/tx/${result.hash}`,
      },
      { headers: { "Access-Control-Allow-Origin": voucherAppUrl } }
    )
  } catch (error) {
    console.error("Erro ao aprovar cobrança:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500, headers: { "Access-Control-Allow-Origin": voucherAppUrl } }
    )
  }
}
