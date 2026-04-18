import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Simple token - in production, use a proper JWT or session management
const ADMIN_TOKEN = 'reservaativa_admin_session_2024'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    const adminPassword = process.env.ADMIN_PASSWORD ?? process.env.reservaativa_ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Configuração de admin não encontrada' },
        { status: 500 }
      )
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      )
    }

    // Return token for client to store
    return NextResponse.json({ 
      success: true,
      token: ADMIN_TOKEN
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Erro na autenticação' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  return NextResponse.json({ success: true })
}

// Helper function to check auth from token
export function verifyAdminToken(token: string | null): boolean {
  return token === ADMIN_TOKEN
}
