"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const AUTH_COOKIE = "portal_session"
const SESSION_VALUE = "emissor-admin"
const VALID_USER = "admin"
const VALID_PASSWORD = "123"

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const usuario = String(formData.get("usuario") ?? "").trim()
  const senha = String(formData.get("senha") ?? "")

  if (usuario !== VALID_USER || senha !== VALID_PASSWORD) {
    return { error: "Usuário ou senha inválidos." }
  }

  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  })

  redirect("/")
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
  redirect("/login")
}

export async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIE)?.value === SESSION_VALUE
}
