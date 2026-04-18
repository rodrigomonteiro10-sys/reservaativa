import { NextResponse } from 'next/server'

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

    // Set auth cookie (valid for 24 hours) using Set-Cookie header
    const isProduction = process.env.NODE_ENV === 'production'
    const maxAge = 60 * 60 * 24 // 24 hours
    const cookieValue = `admin_auth=authenticated; Path=/; Max-Age=${maxAge}; SameSite=Lax${isProduction ? '; Secure' : ''}; HttpOnly`
    
    const response = NextResponse.json({ success: true })
    response.headers.set('Set-Cookie', cookieValue)
    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Erro na autenticação' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.headers.set('Set-Cookie', 'admin_auth=; Path=/; Max-Age=0; HttpOnly')
  return response
}
