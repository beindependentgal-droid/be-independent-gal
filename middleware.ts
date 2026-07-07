import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const protectedRoutes = [
  '/dashboard',
  '/community',
  '/feed',
  '/messages',
  '/profile',
  '/settings',
  '/saved',
  '/events/my-events',
  '/opportunities/my',
  '/big-club',
  '/admin',
]

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL('/signin?redirect=' + encodeURIComponent(pathname), request.url))
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          res.cookies.set(name, value, options)
        })
      },
    },
  })

  const { data } = await supabase.auth.getSession()

  if (!data.session?.user) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/community/:path*', '/feed/:path*', '/messages/:path*', '/profile/:path*', '/settings/:path*', '/saved/:path*', '/events/my-events/:path*', '/opportunities/my/:path*', '/big-club/:path*', '/admin/:path*'],
}
