import { CreditCard } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <CreditCard className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">Portal do Emissor</h1>
            <p className="text-sm text-sidebar-foreground/60">Gestão de Benefícios</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground">Acessar o portal</h2>
            <p className="text-sm text-muted-foreground">Informe suas credenciais para continuar.</p>
          </div>
          <LoginForm />
        </div>

        <p className="mt-4 text-center text-xs text-sidebar-foreground/50">
          Acesso de demonstração · usuário {"admin"} · senha {"123"}
        </p>
      </div>
    </main>
  )
}
