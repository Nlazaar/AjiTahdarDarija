import jwt_decode from 'jwt-decode'

export function isTokenExpired(token: string) {
  try {
    const decoded: any = jwt_decode(token)
    if (!decoded || !decoded.exp) return true
    const now = Math.floor(Date.now() / 1000)
    return decoded.exp <= now
  } catch {
    return true
  }
}
