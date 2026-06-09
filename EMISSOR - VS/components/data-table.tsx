"use client"

import { useMemo, useState, type ReactNode } from "react"
import useSWR from "swr"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Loader2, AlertCircle } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  endpoint: string
  columns: Column<T>[]
  searchKeys: (keyof T)[]
  searchPlaceholder?: string
  toolbar?: ReactNode
}

export function DataTable<T extends Record<string, unknown>>({
  endpoint,
  columns,
  searchKeys,
  searchPlaceholder = "Buscar...",
  toolbar,
}: DataTableProps<T>) {
  const { data, error, isLoading } = useSWR<{ data: T[]; total: number }>(endpoint, fetcher)
  const [query, setQuery] = useState("")

  const rows = useMemo(() => {
    const all = data?.data ?? []
    if (!query.trim()) return all
    const q = query.toLowerCase()
    return all.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q)),
    )
  }, [data, query, searchKeys])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "—" : `${rows.length} registro(s)`}
          </p>
          {toolbar}
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {columns.map((c) => (
                  <TableHead key={c.key} className={c.className}>
                    {c.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" /> Carregando...
                    </span>
                  </TableCell>
                </TableRow>
              )}
              {error && !isLoading && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <span className="inline-flex items-center gap-2 text-destructive">
                      <AlertCircle className="size-4" /> Erro ao carregar dados
                    </span>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !error && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                !error &&
                rows.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((c) => (
                      <TableCell key={c.key} className={c.className}>
                        {c.render ? c.render(row) : String(row[c.key] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
