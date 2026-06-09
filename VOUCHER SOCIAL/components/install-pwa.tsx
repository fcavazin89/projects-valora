'use client'

import { useEffect, useState } from 'react'
import { Download, X, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Verifica se já está instalado (standalone mode)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true

    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    // Detecta iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    if (ios) {
      // iOS: sempre mostra o banner (sem evento nativo)
      const dismissed = sessionStorage.getItem('pwa-banner-dismissed')
      if (!dismissed) setShowBanner(true)
      return
    }

    // Chrome/Android/Edge: captura o evento nativo
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    setShowBanner(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    sessionStorage.setItem('pwa-banner-dismissed', '1')
  }

  if (!showBanner || isInstalled) return null

  return (
    <div className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-orange-200 bg-white p-4 shadow-xl">
      <div className="flex items-start gap-3">
        {/* Ícone do app */}
        <img
          src="/icons/icon-96x96.png"
          alt="Voucher Social"
          className="h-12 w-12 rounded-xl"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">Instalar Voucher Social</p>

          {isIOS ? (
            <p className="mt-0.5 text-xs text-gray-500 leading-snug">
              Toque em <strong>Compartilhar</strong>{' '}
              <Share className="inline h-3 w-3" />{' '}
              e depois <strong>"Adicionar à Tela de Início"</strong>
            </p>
          ) : (
            <>
              <p className="mt-0.5 text-xs text-gray-500 leading-snug">
                Instale o app para acessar offline e receber notificações.
              </p>
              <Button
                size="sm"
                className="mt-2 h-8 bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 gap-1.5"
                onClick={handleInstall}
              >
                <Download className="h-3.5 w-3.5" />
                Instalar agora
              </Button>
            </>
          )}
        </div>

        {/* Fechar */}
        <button
          onClick={handleDismiss}
          className="mt-0.5 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Botão compacto para usar dentro da tela de login
export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true

    if (isStandalone) { setIsInstalled(true); return }

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (isIOS) { setShowIOSHint(true); return }
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setDeferredPrompt(null)
  }

  if (isInstalled) return null

  return (
    <>
      <button
        onClick={handleInstall}
        className="flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 transition-colors"
        aria-label="Instalar app"
      >
        <Download className="h-3.5 w-3.5" />
        Instalar app
      </button>

      {showIOSHint && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl bg-white border border-orange-200 p-4 shadow-xl">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-700">
              Toque em <strong>Compartilhar</strong> <Share className="inline h-3.5 w-3.5" /> e depois{' '}
              <strong>"Adicionar à Tela de Início"</strong>
            </p>
            <button onClick={() => setShowIOSHint(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
