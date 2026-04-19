"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface StageStats {
  stage: string
  count: string
  expected_revenue: string
}

interface DashboardData {
  stageStats: StageStats[]
  summary: {
    total: number
    totalActive: number
    won: number
    lost: number
    conversionRate: string
    revenueWon: number
    totalPipeline: number
  }
  followUp: {
    overdue: number
    upcoming: number
  }
  recent: {
    last7Days: number
    last30Days: number
    won30Days: number
  }
  diagnostico: {
    completo: number
    rascunho: number
    sem: number
  }
  recentActivities: {
    id: number
    type: string
    description: string
    created_at: string
    created_by: string
    name: string
    hotel: string
  }[]
}

const STAGE_CONFIG: Record<string, { label: string; color: string; bar: string }> = {
  novo:            { label: 'Novo',              color: 'text-blue-400',   bar: 'bg-blue-500' },
  contato_inicial: { label: 'Contato Inicial',   color: 'text-cyan-400',   bar: 'bg-cyan-500' },
  qualificacao:    { label: 'Qualificação',       color: 'text-yellow-400', bar: 'bg-yellow-500' },
  proposta:        { label: 'Proposta',           color: 'text-orange-400', bar: 'bg-orange-500' },
  negociacao:      { label: 'Negociação',         color: 'text-purple-400', bar: 'bg-purple-500' },
  fechado_ganho:   { label: 'Fechado (Ganho)',    color: 'text-green-400',  bar: 'bg-green-500' },
  fechado_perdido: { label: 'Fechado (Perdido)',  color: 'text-red-400',    bar: 'bg-red-500' },
}

const ACTIVITY_ICONS: Record<string, string> = {
  ligacao: '📞', email: '✉️', reuniao: '🤝', whatsapp: '💬', stage_change: '🔄', outro: '📌',
}

function formatCurrency(value: number) {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`
  return `R$ ${value.toLocaleString('pt-BR')}`
}

function MetricCard({ title, value, subtitle, accent }: { title: string; value: string | number; subtitle?: string; accent?: string }) {
  return (
    <div className="bg-navy-light/40 border border-gold/20 rounded-2xl p-5">
      <p className="text-text-muted text-sm mb-1">{title}</p>
      <p className={`text-3xl font-bold ${accent || 'text-white'}`}>{value}</p>
      {subtitle && <p className="text-text-muted text-xs mt-1">{subtitle}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/crm/stats', { credentials: 'include' })
      if (res.status === 401) { router.replace('/admin'); return }
      if (!res.ok) throw new Error('Erro')
      setData(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => { fetchStats() }, [fetchStats])

  const maxStageCount = data ? Math.max(...data.stageStats.map(s => Number(s.count)), 1) : 1

  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin w-10 h-10 border-4 border-gold border-t-transparent rounded-full" />
          </div>
        ) : !data ? (
          <p className="text-text-muted text-center py-32">Erro ao carregar dados</p>
        ) : (
          <>
            {/* KPIs principais */}
            <div>
              <h2 className="text-white font-semibold mb-4">Visão Geral</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total de Leads" value={data.summary.total} subtitle={`${data.summary.totalActive} ativos`} />
                <MetricCard title="Taxa de Conversão" value={`${data.summary.conversionRate}%`} subtitle={`${data.summary.won} fechados`} accent="text-green-400" />
                <MetricCard title="Receita Fechada" value={formatCurrency(data.summary.revenueWon)} subtitle="leads ganhos" accent="text-gold" />
                <MetricCard title="Pipeline Total" value={formatCurrency(data.summary.totalPipeline)} subtitle="valor esperado" accent="text-purple-400" />
              </div>
            </div>

            {/* Alertas de follow-up + leads recentes */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Follow-ups */}
              <div className="bg-navy-light/40 border border-gold/20 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4">Follow-ups</h2>
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-3 rounded-xl border ${data.followUp.overdue > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-navy-dark/30 border-gold/10'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🔴</span>
                      <div>
                        <p className="text-white font-medium text-sm">Atrasados</p>
                        <p className="text-text-muted text-xs">Próximo contato vencido</p>
                      </div>
                    </div>
                    <span className={`text-2xl font-bold ${data.followUp.overdue > 0 ? 'text-red-400' : 'text-text-muted'}`}>
                      {data.followUp.overdue}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between p-3 rounded-xl border ${data.followUp.upcoming > 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-navy-dark/30 border-gold/10'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🟡</span>
                      <div>
                        <p className="text-white font-medium text-sm">Próximos 3 dias</p>
                        <p className="text-text-muted text-xs">Contatos agendados</p>
                      </div>
                    </div>
                    <span className={`text-2xl font-bold ${data.followUp.upcoming > 0 ? 'text-yellow-400' : 'text-text-muted'}`}>
                      {data.followUp.upcoming}
                    </span>
                  </div>
                </div>
              </div>

              {/* Leads recentes */}
              <div className="bg-navy-light/40 border border-gold/20 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4">Novos Leads</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-navy-dark/30 border border-gold/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📅</span>
                      <p className="text-white font-medium text-sm">Últimos 7 dias</p>
                    </div>
                    <span className="text-2xl font-bold text-white">{data.recent.last7Days}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-navy-dark/30 border border-gold/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📆</span>
                      <p className="text-white font-medium text-sm">Últimos 30 dias</p>
                    </div>
                    <span className="text-2xl font-bold text-white">{data.recent.last30Days}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏆</span>
                      <p className="text-white font-medium text-sm">Fechados (30 dias)</p>
                    </div>
                    <span className="text-2xl font-bold text-green-400">{data.recent.won30Days}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline por estágio */}
            <div className="bg-navy-light/40 border border-gold/20 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-6">Pipeline por Estágio</h2>
              <div className="space-y-4">
                {['novo','contato_inicial','qualificacao','proposta','negociacao','fechado_ganho','fechado_perdido'].map(stageId => {
                  const cfg = STAGE_CONFIG[stageId]
                  const stat = data.stageStats.find(s => s.stage === stageId)
                  const count = Number(stat?.count || 0)
                  const revenue = Number(stat?.expected_revenue || 0)
                  const pct = Math.round((count / maxStageCount) * 100)
                  return (
                    <div key={stageId} className="flex items-center gap-4">
                      <p className={`text-sm font-medium w-36 flex-shrink-0 ${cfg.color}`}>{cfg.label}</p>
                      <div className="flex-1 bg-navy-dark/50 rounded-full h-2">
                        <div className={`${cfg.bar} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-white font-bold w-6 text-right text-sm">{count}</span>
                      {revenue > 0 && (
                        <span className="text-text-muted text-xs w-24 text-right">{formatCurrency(revenue)}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Diagnósticos + Atividades recentes */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Diagnósticos */}
              <div className="bg-navy-light/40 border border-gold/20 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4">Diagnósticos</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Completos', value: data.diagnostico.completo, color: 'text-green-400', bar: 'bg-green-500' },
                    { label: 'Em andamento', value: data.diagnostico.rascunho, color: 'text-yellow-400', bar: 'bg-yellow-500' },
                    { label: 'Sem diagnóstico', value: data.diagnostico.sem, color: 'text-text-muted', bar: 'bg-gray-600' },
                  ].map(item => {
                    const total = data.diagnostico.completo + data.diagnostico.rascunho + data.diagnostico.sem
                    const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
                    return (
                      <div key={item.label} className="flex items-center gap-3">
                        <p className={`text-sm w-32 flex-shrink-0 ${item.color}`}>{item.label}</p>
                        <div className="flex-1 bg-navy-dark/50 rounded-full h-2">
                          <div className={`${item.bar} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-white font-bold text-sm w-6 text-right">{item.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Atividades recentes */}
              <div className="bg-navy-light/40 border border-gold/20 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4">Atividades Recentes</h2>
                {data.recentActivities.length === 0 ? (
                  <p className="text-text-muted text-sm text-center py-8">Nenhuma atividade registrada</p>
                ) : (
                  <div className="space-y-2">
                    {data.recentActivities.map(activity => (
                      <div key={activity.id} className="flex gap-3 items-start py-2 border-b border-gold/10 last:border-0">
                        <span className="text-lg flex-shrink-0">{ACTIVITY_ICONS[activity.type] || '📌'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{activity.description}</p>
                          <p className="text-text-muted text-xs">{activity.hotel || activity.name} · {new Date(activity.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
