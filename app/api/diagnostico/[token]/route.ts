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

    // Build dynamic update query based on provided fields
    const allowedFields = [
      'categoria',
      'tipo_localizacao',
      'atrativos',
      'publico_principal',
      'canais_venda',
      'canal_principal',
      'adr',
      'adr_nao_sei',
      'ocupacao_media',
      'ocupacao_nao_sei',
      'faturamento_mensal',
      'desafios',
      'status'
    ]

    // Filter only allowed fields from body
    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo válido para atualizar' },
        { status: 400 }
      )
    }

    // Check if status is being set to 'completo'
    const isCompleting = updates.status === 'completo'

    // Build the SET clause dynamically
    const setClauses = Object.entries(updates).map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key} = '${value.replace(/'/g, "''")}'`
      } else if (typeof value === 'boolean') {
        return `${key} = ${value}`
      } else if (typeof value === 'number') {
        return `${key} = ${value}`
      } else if (value === null) {
        return `${key} = NULL`
      }
      return `${key} = '${String(value).replace(/'/g, "''")}'`
    }).join(', ')

    const completedAtClause = isCompleting ? ', completed_at = NOW()' : ''
    const query = `
      UPDATE hotel_diagnostico 
      SET ${setClauses}, updated_at = NOW()${completedAtClause}
      WHERE token = '${token}'
      RETURNING *
    `

    const result = await sql(query)

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
