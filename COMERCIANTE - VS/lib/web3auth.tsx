import type { Web3AuthContextConfig } from "@web3auth/modal/react"

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? ""

// Validação básica — evita crash com ID vazio ou placeholder
const isValidClientId = clientId.length > 20 && !clientId.includes("SEU_")

if (!isValidClientId) {
  console.warn(
    "[Web3Auth] NEXT_PUBLIC_WEB3AUTH_CLIENT_ID não configurado ou inválido. Web3Auth desabilitado."
  )
}

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: isValidClientId ? clientId : "placeholder",
    web3AuthNetwork: "sapphire_devnet",
    chainConfig: {
      chainNamespace: "eip155",
      chainId: "0xaa36a7", // Sepolia
      rpcTarget: process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.ankr.com/eth_sepolia",
      displayName: "Ethereum Sepolia",
      blockExplorerUrl: "https://sepolia.etherscan.io",
      ticker: "ETH",
      tickerName: "Ethereum",
    },
    uiConfig: {
      appName: "Comerciante Valora",
      loginMethodsOrder: ["google", "email_passwordless"],
      defaultLanguage: "pt",
      mode: "light",
      theme: {
        primary: "#ea580c", // laranja do terminal
      },
    },
  },
}

export default web3AuthContextConfig
export { isValidClientId }
