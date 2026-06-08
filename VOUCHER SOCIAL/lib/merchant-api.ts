/**
 * Cliente para a API do COMERCIANTE - VS
 * Permite que o VOUCHER SOCIAL notifique o comerciante após um pagamento.
 *
 * Base URL: NEXT_PUBLIC_MERCHANT_APP_URL (ex: http://localhost:3000)
 */

function getMerchantAppUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_MERCHANT_APP_URL || "http://localhost:3000"
  }
  return process.env.NEXT_PUBLIC_MERCHANT_APP_URL || "http://localhost:3000"
}

/**
 * Notifica o COMERCIANTE que o QR foi escaneado e aprovado pelo beneficiário.
 * Chamada após `processPayment()` para que o polling do comerciante detecte "approved".
 */
export async function approveChargeOnMerchant(params: {
  chargeId: string
  beneficiaryAddress: string
  merchantAddress?: string
  amount?: number
  apiUrl?: string // URL do /api/charges/approve embutida no QR (mais precisa)
}): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
  const url = params.apiUrl || `${getMerchantAppUrl()}/api/charges/approve`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chargeId: params.chargeId,
        beneficiaryAddress: params.beneficiaryAddress,
        merchantAddress: params.merchantAddress,
        amount: params.amount,
      }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return { success: false, error: data.error || `HTTP ${res.status}` }
    }

    return {
      success: true,
      transactionHash: data.transactionHash,
    }
  } catch (err: any) {
    console.warn("[merchant-api] Falha ao aprovar cobrança:", err?.message)
    return { success: false, error: err?.message || "Falha de rede" }
  }
}

/**
 * Verifica o status de uma cobrança no COMERCIANTE.
 * Útil para o VOUCHER SOCIAL confirmar que a aprovação foi registrada.
 */
export async function getChargeStatus(
  chargeId: string,
  baseUrl?: string
): Promise<{ status: string; transactionHash?: string } | null> {
  const url = `${baseUrl || getMerchantAppUrl()}/api/charges/${chargeId}/status`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
