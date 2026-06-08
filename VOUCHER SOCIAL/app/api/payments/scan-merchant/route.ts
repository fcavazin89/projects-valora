import { NextResponse } from "next/server"
import { merchantRegistry } from "@/lib/web3/server/merchant-registry"
import { comercioApi } from "@/lib/valora-api"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { rawQR, merchantAddress: directAddress } = body

    // ── 1. QR vindo da câmera (rawQR) — tenta parsear como payload do COMERCIANTE ──
    if (rawQR) {
      try {
        const payload = JSON.parse(rawQR)

        // Payload gerado pelo COMERCIANTE - VS
        if (payload?.type === "VOUCHER_CHARGE" || payload?.chargeId) {
          const merchantAddr = payload.merchantAddress || null

          // Tenta buscar nome do comerciante na valora-api pelo endereço
          let merchantName = payload.merchantName || "Comerciante"
          if (merchantAddr) {
            try {
              const comercio = await comercioApi.getByWallet(merchantAddr)
              if (comercio) {
                merchantName = comercio.nome_fantasia || comercio.razao_social || merchantName
              }
            } catch {
              // valora-api indisponível, usa nome do QR
            }
          }

          return NextResponse.json({
            merchantName,
            merchantAddress: merchantAddr || "0x0000000000000000000000000000000000000000",
            amount: payload.amount
              ? `R$ ${Number(payload.amount).toFixed(2).replace(".", ",")}`
              : "R$ 0,00",
            amountValue: payload.amount?.toString() || "0",
            voucherType: payload.voucherType || "alimentacao",
            verified: true,
            chargeId: payload.chargeId,
            // Passa apiUrl do QR para o cliente poder notificar o comerciante
            apiUrl: payload.apiUrl || `${process.env.NEXT_PUBLIC_MERCHANT_APP_URL || "http://localhost:3000"}/api/charges/approve`,
            source: "qr-comerciante",
          })
        }
      } catch {
        // Não era JSON válido do COMERCIANTE, continua
      }
    }

    // ── 2. Endereço direto do comerciante passado ──
    const merchantAddress = directAddress || body.merchantAddress
    if (merchantAddress) {
      try {
        const comercio = await comercioApi.getByWallet(merchantAddress)
        if (comercio) {
          return NextResponse.json({
            merchantName: comercio.nome_fantasia || comercio.razao_social,
            merchantAddress: comercio.wallet_address || merchantAddress,
            amount: body.amount || "R$ 0,00",
            voucherType: body.voucherType || "alimentacao",
            verified: true,
            apiUrl: `${process.env.NEXT_PUBLIC_MERCHANT_APP_URL || "http://localhost:3000"}/api/charges/approve`,
            source: "valora-api",
          })
        }
      } catch {
        // valora-api indisponível, continua com fallback
      }
    }

    // ── 3. Fallback: modo demo com comerciantes do registry local ──
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const merchant = merchantRegistry.getRandomMerchant()

    const amountOptions = [
      { amount: "45,50", voucherType: "alimentacao" as const },
      { amount: "18,00", voucherType: "alimentacao" as const },
      { amount: "100,00", voucherType: "gas" as const },
      { amount: "32,00", voucherType: "alimentacao" as const },
      { amount: "87,00", voucherType: "alimentacao" as const },
    ]

    const picked = amountOptions[Math.floor(Math.random() * amountOptions.length)]

    return NextResponse.json({
      merchantName: merchant.name,
      merchantAddress: merchant.address,
      merchantLocation: merchant.location,
      amount: `R$ ${picked.amount}`,
      amountValue: picked.amount,
      voucherType: picked.voucherType,
      verified: merchant.verified,
      apiUrl: `${process.env.NEXT_PUBLIC_MERCHANT_APP_URL || "http://localhost:3000"}/api/charges/approve`,
      source: "demo",
    })
  } catch (error: any) {
    console.error("[API] Erro ao escanear QR:", error)
    return NextResponse.json(
      { error: error?.message || "Falha ao escanear QR Code" },
      { status: 500 }
    )
  }
}
