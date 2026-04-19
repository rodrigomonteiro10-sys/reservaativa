import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function checkAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin_auth')
  return authCookie?.value === 'authenticated'
}

function getDb() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.reservaativa_DATABASE_URL
  if (!url) throw new Error('Missing DATABASE_URL')
  return neon(url)
}

export async function GET() {
  try {
    const isAuth = await checkAuth()
    if (!isAuth) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const sql = getDb()

    const [stageStats, conversionStats, followUpStats, recentStats, diagStats, activityStats] = await Promise.all([
      // Leads e receita por estágio
      sql`
        SELECT
          COALESCE(crm_stage, 'novo') as stage,
          COUNT(*) as count,
          COALESCE(SUM(crm_expected_value), 0) as expected_revenue
        FROM leads
        GROUP BY COALESCE(crm_stage, 'novo')
        ORDER BY COUNT(*) DESC
      `,

      // Métricas de conversão
      sql`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE crm_stage = 'fechado_ganho') as won,
          COUNT(*) FILTER (WHERE crm_stage = 'fechado_perdido') as lost,
          COALESCE(SUM(crm_expected_value) FILTER (WHERE crm_stage = 'fechado_ganho'), 0) as revenue_won,
          COALESCE(SUM(crm_expected_value), 0) as total_pipeline
        FROM leads
      `,

      // Follow-ups vencidos e próximos
      sql`
        SELECT
          COUNT(*) FILTER (WHERE crm_next_contact < NOW() AND crm_stage NOT IN ('fechado_ganho','fechado_perdido')) as overdue,
          COUNT(*) FILTER (WHERE crm_next_contact BETWEEN NOW() AND NOW() + INTERVAL '3 days' AND crm_stage NOT IN ('fechado_ganho','fechado_perdido')) as upcoming
        FROM leads
      `,

      // Novos leads (últimos 7 e 30 dias)
      sql`
        SELECT
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as last_7_days,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as last_30_days,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days' AND crm_stage = 'fechado_ganho') as won_30_days
        FROM leads
      `,

      // Status de diagnóstico
      sql`
        SELECT
          COUNT(*) FILTER (WHERE hd.status = 'completo') as diag_completo,
          COUNT(*) FILTER (WHERE hd.status = 'rascunho') as diag_rascunho,
          COUNT(*) FILTER (WHERE hd.id IS NULL) as diag_sem
        FROM leads l
        LEFT JOIN hotel_diagnostico hd ON hd.lead_id = l.id
      `,

      // Atividades recentes (últimas 10)
      sql`
        SELECT
          la.id, la.type, la.description, la.created_at, la.author as created_by,
          l.name, l.hotel
        FROM lead_activities la
        JOIN leads l ON l.id = la.lead_id
        ORDER BY la.created_at DESC
        LIMIT 10
      `,
    ])

    const conversion = conversionStats[0]
    const followUp = followUpStats[0]
    const recent = recentStats[0]
    const diag = diagStats[0]

    const totalActive = Number(conversion.total) - Number(conversion.won) - Number(conversion.lost)
    const conversionRate = Number(conversion.total) > 0
      ? ((Number(conversion.won) / Number(conversion.total)) * 100).toFixed(1)
      : '0'

    return NextResponse.json({
      stageStats,
      summary: {
        total: Number(conversion.total),
        totalActive,
        won: Number(conversion.won),
        lost: Number(conversion.lost),
        conversionRate,
        revenueWon: Number(conversion.revenue_won),
        totalPipeline: Number(conversion.total_pipeline),
      },
      followUp: {
        overdue: Number(followUp.overdue),
        upcoming: Number(followUp.upcoming),
      },
      recent: {
        last7Days: Number(recent.last_7_days),
        last30Days: Number(recent.last_30_days),
        won30Days: Number(recent.won_30_days),
      },
      diagnostico: {
        completo: Number(diag.diag_completo),
        rascunho: Number(diag.diag_rascunho),
        sem: Number(diag.diag_sem),
      },
      recentActivities: activityStats,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Erro ao buscar estatísticas', detail: String(error) }, { status: 500 })
  }
}
