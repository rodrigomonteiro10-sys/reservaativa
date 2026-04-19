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

// POST - Create note
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

    if (!body.content) {
      return NextResponse.json({ error: 'Conteúdo é obrigatório' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO lead_notes (lead_id, content, created_by)
      VALUES (${leadId}, ${body.content}, ${body.created_by || 'admin'})
      RETURNING *
    `

    // Also create an activity for the note
    await sql`
      INSERT INTO lead_activities (lead_id, type, description, created_by)
      VALUES (${leadId}, 'note', ${'Nota adicionada: ' + body.content.substring(0, 50) + (body.content.length > 50 ? '...' : '')}, ${body.created_by || 'admin'})
    `

    return NextResponse.json({ success: true, note: result[0] })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Erro ao criar nota' }, { status: 500 })
  }
}
