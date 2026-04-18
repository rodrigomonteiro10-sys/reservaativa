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

// GET - Get single lead with full details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const leadId = parseInt(id)
    const sql = getDbConnection()

    const leadResult = await sql`
      SELECT 
        l.*,
        hd.token,
        hd.status as diagnostico_status,
        hd.categoria,
        hd.tipo_localizacao,
        hd.atrativos,
        hd.publico_principal,
        hd.canais_venda,
        hd.canal_principal,
        hd.adr,
        hd.adr_nao_sei,
        hd.ocupacao_media,
        hd.ocupacao_nao_sei,
        hd.faturamento_mensal,
        hd.desafios,
        hd.completed_at
      FROM leads l
      LEFT JOIN hotel_diagnostico hd ON hd.lead_id = l.id
      WHERE l.id = ${leadId}
    `

    if (leadResult.length === 0) {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
    }

    const activities = await sql`
      SELECT * FROM lead_activities 
      WHERE lead_id = ${leadId} 
      ORDER BY created_at DESC
    `

    const notes = await sql`
      SELECT * FROM lead_notes 
      WHERE lead_id = ${leadId} 
      ORDER BY created_at DESC
    `

    const stageHistory = await sql`
      SELECT * FROM lead_stage_history 
      WHERE lead_id = ${leadId} 
      ORDER BY changed_at DESC
    `

    return NextResponse.json({
      lead: leadResult[0],
      activities,
      notes,
      stageHistory
    })
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json({ error: 'Erro ao buscar lead' }, { status: 500 })
  }
}

// PATCH - Update lead CRM fields
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const leadId = parseInt(id)
    const body = await request.json()
    const sql = getDbConnection()

    // Get current stage for history tracking
    const currentLead = await sql`SELECT crm_stage FROM leads WHERE id = ${leadId}`
    const currentStage = currentLead[0]?.crm_stage

    // Update lead
    const result = await sql`
      UPDATE leads SET
        crm_stage = COALESCE(${body.crm_stage ?? null}, crm_stage),
        crm_priority = COALESCE(${body.crm_priority ?? null}, crm_priority),
        crm_assigned_to = COALESCE(${body.crm_assigned_to ?? null}, crm_assigned_to),
        crm_next_contact = COALESCE(${body.crm_next_contact ?? null}, crm_next_contact),
        crm_expected_value = COALESCE(${body.crm_expected_value ?? null}, crm_expected_value),
        crm_lost_reason = COALESCE(${body.crm_lost_reason ?? null}, crm_lost_reason),
        updated_at = NOW()
      WHERE id = ${leadId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
    }

    // Record stage change in history if stage changed
    if (body.crm_stage && body.crm_stage !== currentStage) {
      await sql`
        INSERT INTO lead_stage_history (lead_id, from_stage, to_stage, changed_by)
        VALUES (${leadId}, ${currentStage}, ${body.crm_stage}, ${body.changed_by || 'admin'})
      `

      // Also create an activity for the stage change
      await sql`
        INSERT INTO lead_activities (lead_id, type, description, created_by)
        VALUES (${leadId}, 'stage_change', ${'Movido de ' + (currentStage || 'novo') + ' para ' + body.crm_stage}, ${body.changed_by || 'admin'})
      `
    }

    return NextResponse.json({ success: true, lead: result[0] })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 })
  }
}
