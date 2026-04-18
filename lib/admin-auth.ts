// Simple admin authentication
// In production, use proper JWT or session management

export const ADMIN_TOKEN = 'reservaativa_admin_session_2024'

export function verifyAdminToken(authHeader: string | null): boolean {
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}
