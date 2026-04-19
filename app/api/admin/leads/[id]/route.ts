import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function checkAuth() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin_auth')
    return authCookie?.value === 'authenticated'
  } catch {
    return false
  }
}

function getDb() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.reservaativa_DATABASE_URL
  if (!url) throw new Error('Missing DATABASE_URL')
  return neon(url)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuth = await checkAuth()
  if (!isAuth) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const leadId = parseInt(id)
  if (isNaN(leadId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const body = await request.json()
  const { crm_status, crm_notes } = body

  const validStatuses = ['novo', 'contato_feito', 'proposta_enviada', 'fechado', 'perdido']
  if (crm_status && !validStatuses.includes(crm_status)) {
    return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
  }

  try {
    const sql = getDb()

    if (crm_status !== undefined && crm_notes !== undefined) {
      await sql`UPDATE leads SET crm_status = ${crm_status}, crm_notes = ${crm_notes} WHERE id = ${leadId}`
    } else if (crm_status !== undefined) {
      await sql`UPDATE leads SET crm_status = ${crm_status} WHERE id = ${leadId}`
    } else if (crm_notes !== undefined) {
      await sql`UPDATE leads SET crm_notes = ${crm_notes} WHERE id = ${leadId}`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar lead', detail: String(error) }, { status: 500 })
  }
}
