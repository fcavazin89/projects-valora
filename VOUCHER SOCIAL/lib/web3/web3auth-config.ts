import type { Web3AuthContextConfig } from "@web3auth/modal/react"

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID

// Validação básica do Client ID
const isValidClientId = clientId && clientId.length > 20 && !clientId.includes("SEU_")

if (!clientId) {
  console.warn(
    "[Web3Auth] NEXT_PUBLIC_WEB3AUTH_CLIENT_ID not configured. Web3Auth will be disabled.",
  )
} else if (!isValidClientId) {
  console.warn(
    "[Web3Auth] Client ID appears to be invalid or a placeholder. Web3Auth will be disabled.",
  )
}

const web3AuthContextConfig: Web3AuthContextConfig | null = isValidClientId
  ? {
      web3AuthOptions: {
        clientId: clientId!,
        web3AuthNetwork: "sapphire_devnet",
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0xaa36a7", // Sepolia testnet
          rpcTarget: process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.ankr.com/eth_sepolia",
          displayName: "Ethereum Sepolia",
          blockExplorerUrl: "https://sepolia.etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
        },
        uiConfig: {
          appName: "Voucher Social",
          loginMethodsOrder: ["google", "email_passwordless"],
          defaultLanguage: "pt",
          mode: "light",
          theme: {
            primary: "#059669",
          },
        },
      },
    }
  : null

export default web3AuthContextConfig
