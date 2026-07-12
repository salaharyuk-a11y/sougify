import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { env } from '@/lib/env'

// Kept as a literal (not imported from '@/lib/auth') to keep middleware's
// dependency graph minimal — it runs on every request. Keep in sync with
// ORG_COOKIE in src/lib/auth.ts.
const ORG_COOKIE = 'scarpar-org'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  // Refresh the session so server components downstream see a valid cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAdminPath = pathname.startsWith('/admin')
  const isOnboardingPath = pathname.startsWith('/onboarding')

  if ((isAdminPath || isOnboardingPath) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAdminPath && user) {
    const hasOrgCookie = Boolean(request.cookies.get(ORG_COOKIE)?.value)
    if (!hasOrgCookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|xml)$).*)',
  ],
}
