"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { LeadDetailModal } from "@/components/admin/crm/lead-detail-modal"

interface Lead {
  id: number
  name: string
  hotel: string
  email: string
  phone: string
  cidade: string | null
  quartos: string | null
  desafio: string | null
  message: string | null
  created_at: string
  crm_stage: string
  crm_priority: string
  crm_assigned_to: string | null
  crm_next_contact: string | null
  crm_expected_value: number | null
  crm_lost_reason: string | null
  token: string | null
  diagnostico_status: string | null
  categoria: string | null
  adr: string | null
  ocupacao_media: string | null
  faturamento_mensal: string | null
  tipo_localizacao: string | null
  publico_principal: string | null
  canal_principal: string | null
  activities_count: number
  notes_count: number
}

const STAGES = [
  { id: 'novo', label: 'Novo', color: 'border-blue-500' },
  { id: 'contato_inicial', label: 'Contato Inicial', color: 'border-cyan-500' },
  { id: 'qualificacao', label: 'Qualificação', color: 'border-yellow-500' },
  { id: 'proposta', label: 'Proposta', color: 'border-orange-500' },
  { id: 'negociacao', label: 'Negociação', color: 'border-purple-500' },
  { id: 'fechado_ganho', label: 'Fechado (Ganho)', color: 'border-green-500' },
  { id: 'fechado_perdido', label: 'Fechado (Perdido)', color: 'border-red-500' },
]

const PRIORITIES: Record<string, { label: string; color: string }> = {
  alta: { label: 'Alta', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  media: { label: 'Média', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  baixa: { label: 'Baixa', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
}

function exportToCSV(leads: Lead[]) {
  const headers = [
    'ID', 'Hotel', 'Nome', 'Email', 'Telefone', 'Cidade', 'Quartos',
    'Estágio', 'Prioridade', 'Responsável', 'Próximo Contato',
    'Valor Esperado', 'Diagnóstico', 'ADR', 'Ocupação', 'Criado em',
  ]

  const rows = leads.map(l => [
    l.id,
    l.hotel || l.name,
    l.name,
    l.email,
    l.phone,
    l.cidade || '',
    l.quartos || '',
    l.crm_stage,
    l.crm_priority,
    l.crm_assigned_to || '',
    l.crm_next_contact ? new Date(l.crm_next_contact).toLocaleDateString('pt-BR') : '',
    l.crm_expected_value || '',
    l.diagnostico_status || '',
    l.adr || '',
    l.ocupacao_media || '',
    new Date(l.created_at).toLocaleDateString('pt-BR'),
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads-crm-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function CRMPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null)
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
  const [filterPriority, setFilterPriority] = useState<string>('todos')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filterPriority !== 'todos') params.set('priority', filterPriority)

      const response = await fetch(`/api/admin/crm/leads?${params}`, { credentials: 'include' })

      if (response.status === 401) {
        router.replace('/admin?redirect=/admin/crm')
        return
      }
      if (!response.ok) throw new Error('Erro ao buscar leads')

      const data = await response.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setIsLoading(false)
    }
  }, [router, filterPriority])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault()
    if (!draggedLead || draggedLead.crm_stage === newStage) { setDraggedLead(null); return }

    setLeads(prev => prev.map(l => l.id === draggedLead.id ? { ...l, crm_stage: newStage } : l))

    try {
      const response = await fetch(`/api/admin/crm/leads/${draggedLead.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crm_stage: newStage }),
      })
      if (!response.ok) {
        setLeads(prev => prev.map(l => l.id === draggedLead.id ? { ...l, crm_stage: draggedLead.crm_stage } : l))
      }
    } catch {
      setLeads(prev => prev.map(l => l.id === draggedLead.id ? { ...l, crm_stage: draggedLead.crm_stage } : l))
    }

    setDraggedLead(null)
  }

  const filteredLeads = searchQuery.trim()
    ? leads.filter(l => {
        const q = searchQuery.toLowerCase()
        return (
          l.name?.toLowerCase().includes(q) ||
          l.hotel?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.cidade?.toLowerCase().includes(q)
        )
      })
    : leads

  const getLeadsByStage = (stageId: string) =>
    filteredLeads.filter(lead => (lead.crm_stage || 'novo') === stageId)

  const getStageTotal = (stageId: string) => {
    const stageLeads = getLeadsByStage(stageId)
    const total = stageLeads.reduce((sum, l) => sum + (Number(l.crm_expected_value) || 0), 0)
    return total > 0 ? total : null
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  return (
    <div>
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gold/10 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por hotel, nome, cidade…"
            className="w-full pl-9 pr-3 py-1.5 bg-navy-dark/60 border border-gold/15 rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-gold/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-text-muted text-xs hidden sm:inline">Prioridade:</span>
          {['todos', 'alta', 'media', 'baixa'].map(priority => (
            <button
              key={priority}
              onClick={() => setFilterPriority(priority)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterPriority === priority
                  ? 'bg-gold text-navy'
                  : 'bg-navy-light/50 text-white hover:bg-navy-light'
              }`}
            >
              {priority === 'todos' ? 'Todas' : PRIORITIES[priority]?.label || priority}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-text-muted text-sm">
            {filteredLeads.length !== leads.length
              ? `${filteredLeads.length} de ${leads.length} leads`
              : `${leads.length} lead${leads.length !== 1 ? 's' : ''}`}
          </span>
          <button
            onClick={() => exportToCSV(filteredLeads)}
            title="Exportar CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-light/50 border border-gold/15 text-text-muted text-xs font-medium rounded-lg hover:border-gold/35 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <main className="p-4 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="flex gap-4 min-w-max">
            {STAGES.map(stage => {
              const stageLeads = getLeadsByStage(stage.id)
              const stageTotal = getStageTotal(stage.id)
              return (
                <div
                  key={stage.id}
                  className="w-72 flex-shrink-0 flex flex-col"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {/* Column Header */}
                  <div className={`border-t-4 ${stage.color} bg-navy-light/40 rounded-t-lg px-3 py-2 border-x border-gold/20`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-sm">{stage.label}</h3>
                      <span className="bg-navy-dark px-2 py-0.5 rounded text-text-muted text-xs">
                        {stageLeads.length}
                      </span>
                    </div>
                    {stageTotal && (
                      <p className="text-gold/70 text-xs mt-0.5">
                        R$ {stageTotal.toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>

                  {/* Column Content */}
                  <div className="bg-navy-dark/30 border-x border-b border-gold/20 rounded-b-lg p-2 min-h-[calc(100vh-240px)] space-y-2 flex-1">
                    {stageLeads.map(lead => {
                      const isOverdue = lead.crm_next_contact && new Date(lead.crm_next_contact) < new Date()
                      const hotelName = lead.hotel && lead.hotel !== lead.name ? lead.hotel : null
                      const interactionCount = (Number(lead.activities_count) || 0) + (Number(lead.notes_count) || 0)
                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead)}
                          onClick={() => setSelectedLeadId(lead.id)}
                          className={`bg-navy-light border rounded-lg p-3 cursor-pointer hover:border-gold/50 transition-all select-none ${
                            draggedLead?.id === lead.id ? 'opacity-40 scale-95' : ''
                          } ${isOverdue ? 'border-red-500/40' : 'border-gold/20'}`}
                        >
                          {/* Header: nome + prioridade */}
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-white font-semibold text-sm leading-tight truncate">
                              {hotelName || lead.name}
                            </h4>
                            {lead.crm_priority && (
                              <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-bold border ${PRIORITIES[lead.crm_priority]?.color}`}>
                                {PRIORITIES[lead.crm_priority]?.label}
                              </span>
                            )}
                          </div>

                          {hotelName && (
                            <p className="text-text-muted text-xs truncate mb-1">{lead.name}</p>
                          )}

                          {/* Info badges */}
                          <div className="flex flex-wrap gap-1 my-2">
                            {lead.cidade && (
                              <span className="inline-flex items-center gap-1 bg-navy-dark/60 text-text-muted text-xs px-1.5 py-0.5 rounded">
                                📍 {lead.cidade}
                              </span>
                            )}
                            {lead.quartos && (
                              <span className="inline-flex items-center gap-1 bg-navy-dark/60 text-text-muted text-xs px-1.5 py-0.5 rounded">
                                🛏 {lead.quartos} qts
                              </span>
                            )}
                            {lead.adr && (
                              <span className="inline-flex items-center gap-1 bg-navy-dark/60 text-gold/70 text-xs px-1.5 py-0.5 rounded">
                                ADR R${parseFloat(lead.adr).toFixed(0)}
                              </span>
                            )}
                            {lead.ocupacao_media && (
                              <span className="inline-flex items-center gap-1 bg-navy-dark/60 text-text-muted text-xs px-1.5 py-0.5 rounded">
                                {parseFloat(lead.ocupacao_media).toFixed(0)}% ocup.
                              </span>
                            )}
                          </div>

                          {/* Desafio snippet */}
                          {(lead.desafio || lead.message) && (
                            <p className="text-text-muted text-xs italic truncate mb-1 border-l-2 border-gold/20 pl-2">
                              &ldquo;{lead.desafio || lead.message}&rdquo;
                            </p>
                          )}

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-green-400 text-xs hover:text-green-300 transition-colors mb-2"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.847L.057 23.882l6.204-1.448A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.501-5.201-1.375l-.373-.221-3.861.901.953-3.745-.243-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                            {lead.phone}
                          </a>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs pt-2 border-t border-gold/10">
                            <span className="text-text-muted">{formatDate(lead.created_at)}</span>
                            <div className="flex items-center gap-2">
                              {interactionCount > 0 && (
                                <span className="text-text-muted flex items-center gap-1">
                                  💬 {interactionCount}
                                </span>
                              )}
                              {lead.crm_expected_value && (
                                <span className="text-gold font-semibold">
                                  R$ {Number(lead.crm_expected_value).toLocaleString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status badges */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {isOverdue && (
                              <span className="text-red-400 text-xs flex items-center gap-1">
                                ⏰ Follow-up atrasado
                              </span>
                            )}
                            {lead.crm_next_contact && !isOverdue && (
                              <span className="text-yellow-400 text-xs">
                                📅 {new Date(lead.crm_next_contact).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                              </span>
                            )}
                            {lead.diagnostico_status === 'completo' && (
                              <span className="text-green-400 text-xs flex items-center gap-1">
                                ✓ Diagnóstico
                              </span>
                            )}
                            {lead.diagnostico_status === 'rascunho' && (
                              <span className="text-yellow-400/70 text-xs">
                                ⚡ Diagnóstico pendente
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}

                    {stageLeads.length === 0 && (
                      <div className="text-text-muted text-sm text-center py-8 border-2 border-dashed border-gold/10 rounded-lg">
                        {searchQuery ? 'Nenhum resultado' : 'Arraste leads aqui'}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Lead Detail Modal */}
      {selectedLeadId && (
        <LeadDetailModal
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onUpdate={fetchLeads}
        />
      )}
    </div>
  )
}
