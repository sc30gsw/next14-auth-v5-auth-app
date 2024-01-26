import { auth } from './auth'
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from './routes'

export default auth((req) => {
  const { nextUrl } = req
  console.log('🚀 ~ auth ~ nextUrl:', nextUrl)
  const isLoggedIn = !!req.auth
  console.log('🚀 ~ auth ~ isLoggedIn:', isLoggedIn)

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  console.log('🚀 ~ auth ~ isApiAuthRoute:', isApiAuthRoute)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  console.log('🚀 ~ auth ~ isPublicRoute:', isPublicRoute)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  console.log('🚀 ~ auth ~ isAuthRoute:', isAuthRoute)

  if (isApiAuthRoute) {
    return null
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }

  if (!(isLoggedIn || isPublicRoute)) {
    return Response.redirect(new URL('/sign-up', nextUrl))
  }

  return null
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
