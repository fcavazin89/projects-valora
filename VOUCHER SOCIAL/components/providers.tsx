"use client"

import dynamic from "next/dynamic"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import web3AuthContextConfig from "@/lib/web3/web3auth-config"

const Web3AuthProvider = dynamic(
  () => import("@web3auth/modal/react").then((m) => m.Web3AuthProvider),
  { ssr: false, loading: () => <div className="min-h-screen bg-emerald-50" /> },
)

const WagmiProvider = dynamic(
  () => import("@web3auth/modal/react/wagmi").then((m) => m.WagmiProvider),
  { ssr: false, loading: () => <div className="min-h-screen bg-emerald-50" /> },
)

// Cria o QueryClient fora do componente para evitar recriação
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sempre retorna o QueryClientProvider primeiro
  if (!mounted) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-emerald-50" />
      </QueryClientProvider>
    )
  }

  // Sem Web3Auth configurado: mostra aplicação em modo demo
  if (!web3AuthContextConfig) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  // Com Web3Auth: QueryClient > Web3Auth > Wagmi
  return (
    <QueryClientProvider client={queryClient}>
      <Web3AuthProvider config={web3AuthContextConfig}>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </Web3AuthProvider>
    </QueryClientProvider>
  )
}
