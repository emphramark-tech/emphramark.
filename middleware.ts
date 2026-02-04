import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const { createServerClient } = await import('@supabase/ssr')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables in middleware')
      return NextResponse.next({
        request: { headers: request.headers },
      })
    }

    let supabaseResponse = NextResponse.next({
      request: { headers: new Headers(request.headers) },
    })

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            if (!Array.isArray(cookiesToSet) || cookiesToSet.length === 0) {
              return
            }
            cookiesToSet.forEach(({ name, value }) => {
              try {
                request.cookies.set({ name, value })
              } catch (error) {
                console.warn('Failed to set request cookie in middleware', error)
              }
            })
            supabaseResponse = NextResponse.next({
              request: { headers: new Headers(request.headers) },
            })
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                supabaseResponse.cookies.set({ name, value, ...options })
              } catch (error) {
                console.warn('Failed to set response cookie in middleware', error)
              }
            })
          },
        },
      },
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const user = session?.user ?? null

    if (
      request.nextUrl.pathname.startsWith('/dashboard') &&
      request.nextUrl.pathname !== '/dashboard' &&
      !user
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    if (
      user &&
      (request.nextUrl.pathname.startsWith('/auth/login') ||
        request.nextUrl.pathname.startsWith('/auth/sign-up'))
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware crashed before handling request', error)
    return NextResponse.next({
      request: { headers: request.headers },
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
