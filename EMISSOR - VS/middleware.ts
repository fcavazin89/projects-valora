import { NextResponse, type NextRequest } from "next/server"

const AUTH_COOKIE = "portal_session"
const SESSION_VALUE = "emissor-admin"

export function middleware(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIE)?.value
  const isAuthed = session === SESSION_VALUE
  const { pathname } = request.nextUrl

  const isLoginPage = pathname === "/login"

  if (!isAuthed && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthed && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Protege tudo exceto assets estáticos e as rotas internas do Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)"],
}
