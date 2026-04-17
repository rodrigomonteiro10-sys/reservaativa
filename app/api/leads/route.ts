import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, hotel, email, whatsapp, rooms, city, challenge } = body

    // Validate required fields
    if (!name || !hotel || !email || !whatsapp || !rooms) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      )
    }

    const connectionString = process.env.DATABASE_URL ?? process.env.reservaativa_DATABASE_URL
    if (!connectionString) {
      throw new Error('Missing DATABASE_URL env var')
    }
    const sql = neon(connectionString)

    // Build message from form data
    const message = [
      `Quartos: ${rooms}`,                          
      city ? `Cidade: ${city}` : null,
      challenge ? `Desafio: ${challenge}` : null,
    ].filter(Boolean).join('\n')

    // Insert lead into database
    const leadResult = await sql`
      INSERT INTO leads (name, hotel, email, phone, message, source)
      VALUES (${name}, ${hotel}, ${email}, ${whatsapp}, ${message}, 'landing_page_diagnostico')
      RETURNING id, created_at
    `

    const leadId = leadResult[0]?.id

    // Generate unique token and create hotel_diagnostico record
    const token = generateToken()
    await sql`
      INSERT INTO hotel_diagnostico (lead_id, token, status)
      VALUES (${leadId}, ${token}, 'rascunho')
    `

    return NextResponse.json({
      success: true,
      message: 'Lead cadastrado com sucesso',
      id: leadId,
      token: token,
    })
  } catch (error) {
    console.error('Error saving lead:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar lead' },
      { status: 500 }
    )
  }
}
