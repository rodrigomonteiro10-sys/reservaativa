import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'

function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  return verifyAdminToken(authHeader)
}

function getDbConnection() {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.reservaativa_DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL env var')
  }
  return neon(connectionString)
}

// GET - List leads for CRM Kanban
export async function GET(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const assignedTo = searchParams.get('assigned_to')
    const priority = searchParams.get('priority')

    const sql = getDbConnection()

    const leads = await sql`
      SELECT 
        l.id,
        l.name,
        l.hotel,
        l.email,
        l.phone,
        l.created_at,
        l.crm_stage,
        l.crm_priority,
        l.crm_assigned_to,
        l.crm_next_contact,
        l.crm_expected_value,
        l.crm_lost_reason,
        hd.token,
        hd.status as diagnostico_status,
        hd.categoria,
        hd.adr,
        hd.ocupacao_media,
        hd.faturamento_mensal
      FROM leads l
      LEFT JOIN hotel_diagnostico hd ON hd.lead_id = l.id
      WHERE 1=1
        AND (${assignedTo}::text IS NULL OR l.crm_assigned_to = ${assignedTo})
        AND (${priority}::text IS NULL OR l.crm_priority = ${priority})
      ORDER BY 
        CASE l.crm_priority 
          WHEN 'alta' THEN 1 
          WHEN 'media' THEN 2 
          WHEN 'baixa' THEN 3 
        END,
        l.created_at DESC
    `

    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Error fetching CRM leads:', error)
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 })
  }
}
