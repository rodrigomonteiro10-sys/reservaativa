import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

function getDbConnection() {
  const connectionString = process.env.DATABASE_URL ?? process.env.reservaativa_DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL env var')
  }
  return neon(connectionString)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const sql = getDbConnection()

    const result = await sql`
      SELECT 
        hd.*,
        l.name,
        l.hotel,
        l.email,
        l.phone
      FROM hotel_diagnostico hd
      JOIN leads l ON l.id = hd.lead_id
      WHERE hd.token = ${token}
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Diagnóstico não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching diagnostico:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar diagnóstico' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await request.json()
    const sql = getDbConnection()

    // Check if status is being set to 'completo'
    const isCompleting = body.status === 'completo'

    // Update all fields using tagged template literal
    const result = await sql`
      UPDATE hotel_diagnostico 
      SET 
        categoria = COALESCE(${body.categoria ?? null}, categoria),
        tipo_localizacao = COALESCE(${body.tipo_localizacao ?? null}, tipo_localizacao),
        atrativos = COALESCE(${body.atrativos ?? null}, atrativos),
        publico_principal = COALESCE(${body.publico_principal ?? null}, publico_principal),
        canais_venda = COALESCE(${body.canais_venda ?? null}, canais_venda),
        canal_principal = COALESCE(${body.canal_principal ?? null}, canal_principal),
        adr = COALESCE(${body.adr ?? null}, adr),
        adr_nao_sei = COALESCE(${body.adr_nao_sei ?? null}, adr_nao_sei),
        ocupacao_media = COALESCE(${body.ocupacao_media ?? null}, ocupacao_media),
        ocupacao_nao_sei = COALESCE(${body.ocupacao_nao_sei ?? null}, ocupacao_nao_sei),
        faturamento_mensal = COALESCE(${body.faturamento_mensal ?? null}, faturamento_mensal),
        desafios = COALESCE(${body.desafios ?? null}, desafios),
        status = COALESCE(${body.status ?? null}, status),
        updated_at = NOW(),
        completed_at = CASE WHEN ${isCompleting} THEN NOW() ELSE completed_at END
      WHERE token = ${token}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Diagnóstico não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    })
  } catch (error) {
    console.error('Error updating diagnostico:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar diagnóstico' },
      { status: 500 }
    )
  }
}
