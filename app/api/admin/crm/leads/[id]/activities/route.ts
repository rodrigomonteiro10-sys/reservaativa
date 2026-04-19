import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function checkAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')
  return authCookie?.value === 'authenticated'
}

function getDbConnection() {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.reservaativa_DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL env var')
  }
  return neon(connectionString)
}

// POST - Create activity
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await checkAuth()
    if (!isAuth) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const leadId = parseInt(id)
    if (isNaN(leadId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const body = await request.json()
    const sql = getDbConnection()

    if (!body.type || !body.description) {
      return NextResponse.json({ error: 'Tipo e descrição são obrigatórios' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO lead_activities (lead_id, type, description, author)
      VALUES (${leadId}, ${body.type}, ${body.description}, ${'admin'})
      RETURNING *
    `

    return NextResponse.json({ success: true, activity: result[0] })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: 'Erro ao criar atividade' }, { status: 500 })
  }
}
