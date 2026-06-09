const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090"

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}/api/v1${path}`
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erro desconhecido" }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}
