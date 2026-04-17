import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function checkAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')
  return authCookie?.value === 'authenticated'
}

function getDbConnection() {
  const connectionString = process.env.DATABASE_URL ?? process.env.reservaativa_DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL env var')
  }
  return neon(connectionString)
}

export async function GET(request: Request) {
  try {
    console.log("[v0] Admin leads API called")
    const isAuth = await checkAuth()
    console.log("[v0] Auth check result:", isAuth)
    if (!isAuth) {
      console.log("[v0] Not authenticated, returning 401")
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const sql = getDbConnection()

    let leads
    let countResult

    if (status && status !== 'todos') {
      // Query with status filter
      leads = await sql`
        SELECT 
          l.id,
          l.name,
          l.hotel,
          l.email,
          l.phone,
          l.message,
          l.source,
          l.created_at,
          hd.token,
          hd.status as diagnostico_status,
          hd.categoria,
          hd.tipo_localizacao,
          hd.publico_principal,
          hd.canal_principal,
          hd.adr,
          hd.ocupacao_media,
          hd.faturamento_mensal,
          hd.completed_at
        FROM leads l
        LEFT JOIN hotel_diagnostico hd ON hd.lead_id = l.id
        WHERE hd.status = ${status}
        ORDER BY l.created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `

      countResult = await sql`
        SELECT COUNT(*) as total 
        FROM leads l
        LEFT JOIN hotel_diagnostico hd ON hd.lead_id = l.id
        WHERE hd.status = ${status}
      `
    } else {
      // Query without status filter
      leads = await sql`
        SELECT 
          l.id,
          l.name,
          l.hotel,
          l.email,
          l.phone,
          l.message,
          l.source,
          l.created_at,
          hd.token,
          hd.status as diagnostico_status,
          hd.categoria,
          hd.tipo_localizacao,
          hd.publico_principal,
          hd.canal_principal,
          hd.adr,
          hd.ocupacao_media,
          hd.faturamento_mensal,
          hd.completed_at
        FROM leads l
        LEFT JOIN hotel_diagnostico hd ON hd.lead_id = l.id
        ORDER BY l.created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `

      countResult = await sql`
        SELECT COUNT(*) as total 
        FROM leads l
        LEFT JOIN hotel_diagnostico hd ON hd.lead_id = l.id
      `
    }

    const total = parseInt(countResult[0]?.total || '0')
    console.log("[v0] Found leads count:", leads.length, "Total:", total)

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar leads' },
      { status: 500 }
    )
  }
}
