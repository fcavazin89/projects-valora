"use client"

import dynamic from "next/dynamic"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import web3AuthContextConfig, { isValidClientId } from "@/lib/web3auth"
import { suppressKnownWarnings } from "@/lib/suppress-warnings"

suppressKnownWarnings()

const Web3AuthProvider = dynamic(
  () => import("@web3auth/modal/react").then((m) => m.Web3AuthProvider),
  { ssr: false, loading: () => <div className="min-h-screen bg-[#0F172A]" /> }
)

const WagmiProvider = dynamic(
  () => import("@web3auth/modal/react/wagmi").then((m) => m.WagmiProvider),
  { ssr: false, loading: () => <div className="min-h-screen bg-[#0F172A]" /> }
)

// Cria QueryClient fora do componente para evitar recriação
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

  // SSR safe — renderiza sem provider até montar no browser
  if (!mounted) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-[#0F172A]" />
      </QueryClientProvider>
    )
  }

  // Sem Web3Auth válido: app funciona sem carteira (modo terminal simples)
  if (!isValidClientId) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

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
