import { verifyToken } from './auth'

/**
 * Middleware para verificar autenticación en server components
 */
export async function verifyAuth(request) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return { isAuthenticated: false, user: null }
  }

  const result = verifyToken(token)
  
  return {
    isAuthenticated: result.success,
    user: result.success ? result.user : null
  }
}

/**
 * Verifica autenticación desde cookies en server components
 */
export async function getAuthFromCookies(cookiesHeader) {
  const authCookie = cookiesHeader?.split(';')
    .find(cookie => cookie.trim().startsWith('auth-token='))
  
  if (!authCookie) {
    return { isAuthenticated: false, user: null }
  }

  const token = authCookie.split('=')[1]
  const result = verifyToken(token)
  
  return {
    isAuthenticated: result.success,
    user: result.success ? result.user : null
  }
} 