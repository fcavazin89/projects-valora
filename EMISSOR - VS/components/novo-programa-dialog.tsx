"use client"

import { useState } from "react"
import useSWR from "swr"
import { useSWRConfig } from "swr"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { Programa, Status, Emissor } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const tipos: Programa["tipo"][] = ["ALIMENTACAO", "REFEICAO", "MOBILIDADE", "SAUDE", "MULTIBENEFICIO"]
const statusOpcoes: Status[] = ["ATIVO", "PENDENTE", "INATIVO", "BLOQUEADO"]

const tipoLabel: Record<Programa["tipo"], string> = {
  ALIMENTACAO: "Alimentação",
  REFEICAO: "Refeição",
  MOBILIDADE: "Mobilidade",
  SAUDE: "Saúde",
  MULTIBENEFICIO: "Multibenefício",
}

export function NovoProgramaDialog() {
  const { mutate } = useSWRConfig()
  const { data: emissoresData } = useSWR<{ data: Emissor[] }>("/api/v1/emissores", fetcher)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [nome, setNome] = useState("")
  const [emissor, setEmissor] = useState("")
  const [tipo, setTipo] = useState<Programa["tipo"] | "">("")
  const [status, setStatus] = useState<Status>("PENDENTE")
  const [beneficiarios, setBeneficiarios] = useState("")

  const emissores = emissoresData?.data ?? []

  function reset() {
    setNome("")
    setEmissor("")
    setTipo("")
    setStatus("PENDENTE")
    setBeneficiarios("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !emissor || !tipo) {
      toast.error("Preencha nome, emissor e tipo.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/v1/programas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          emissor,
          tipo,
          status,
          beneficiarios: Number(beneficiarios) || 0,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Falha ao criar programa.")
      }

      await mutate("/api/v1/programas")
      toast.success("Programa criado com sucesso.")
      reset()
      setOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus className="size-4" />
            Novo programa
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo programa</DialogTitle>
          <DialogDescription>
            Cadastre um novo programa de benefícios vinculado a um emissor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome do programa</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Programa Alimentação 2026"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="emissor">Emissor</Label>
            <Select value={emissor} onValueChange={(v) => v !== null && setEmissor(v)}>
              <SelectTrigger id="emissor">
                <SelectValue placeholder="Selecione o emissor" />
              </SelectTrigger>
              <SelectContent>
                {emissores.map((em) => (
                  <SelectItem key={em.id} value={em.nome}>
                    {em.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as Programa["tipo"])}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {tipos.map((t) => (
                    <SelectItem key={t} value={t}>
                      {tipoLabel[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOpcoes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="beneficiarios">Beneficiários estimados</Label>
            <Input
              id="beneficiarios"
              type="number"
              min={0}
              value={beneficiarios}
              onChange={(e) => setBeneficiarios(e.target.value)}
              placeholder="0"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Criar programa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
