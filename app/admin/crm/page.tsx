"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LeadDetailModal } from "@/components/admin/crm/lead-detail-modal"

interface Lead {
  id: number
  name: string
  hotel: string
  email: string
  phone: string
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
  adr: number | null
  ocupacao_media: number | null
  faturamento_mensal: string | null
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

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

export default function CRMPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null)
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
  const [filterPriority, setFilterPriority] = useState<string>('todos')

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filterPriority !== 'todos') {
        params.set('priority', filterPriority)
      }

      const response = await fetch(`/api/admin/crm/leads?${params}`, {
        headers: getAuthHeaders()
      })
      
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

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

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
    
    if (!draggedLead || draggedLead.crm_stage === newStage) {
      setDraggedLead(null)
      return
    }

    // Optimistic update
    setLeads(prev => prev.map(l => 
      l.id === draggedLead.id ? { ...l, crm_stage: newStage } : l
    ))

    try {
      const response = await fetch(`/api/admin/crm/leads/${draggedLead.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ crm_stage: newStage }),
      })

      if (!response.ok) {
        // Revert on error
        setLeads(prev => prev.map(l => 
          l.id === draggedLead.id ? { ...l, crm_stage: draggedLead.crm_stage } : l
        ))
      }
    } catch (error) {
      console.error('Error updating lead stage:', error)
      // Revert on error
      setLeads(prev => prev.map(l => 
        l.id === draggedLead.id ? { ...l, crm_stage: draggedLead.crm_stage } : l
      ))
    }

    setDraggedLead(null)
  }

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => (lead.crm_stage || 'novo') === stageId)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    router.replace('/admin')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="bg-navy-dark/50 border-b border-gold/20 py-4">
        <div className="max-w-full mx-auto px-4 flex items-center justify-between">
          <div>
            <span className="text-gold font-semibold text-sm">Reserva Ativa</span>
            <h1 className="text-white text-xl font-bold">CRM - Pipeline de Vendas</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/leads"
              className="text-text-muted hover:text-white transition-colors text-sm"
            >
              Lista de Leads
            </Link>
            <Link 
              href="/"
              className="text-text-muted hover:text-white transition-colors text-sm"
            >
              Ver site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gold/30 text-white text-sm rounded-lg hover:border-gold/60 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 py-4 border-b border-gold/10 flex items-center gap-4">
        <span className="text-text-muted text-sm">Prioridade:</span>
        <div className="flex gap-2">
          {['todos', 'alta', 'media', 'baixa'].map(priority => (
            <button
              key={priority}
              onClick={() => setFilterPriority(priority)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterPriority === priority
                  ? 'bg-gold text-navy'
                  : 'bg-navy-light/50 text-white hover:bg-navy-light'
              }`}
            >
              {priority === 'todos' ? 'Todas' : PRIORITIES[priority]?.label || priority}
            </button>
          ))}
        </div>
        <span className="text-text-muted text-sm ml-auto">
          {leads.length} lead{leads.length !== 1 ? 's' : ''}
        </span>
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
              return (
                <div
                  key={stage.id}
                  className="w-72 flex-shrink-0"
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
                  </div>

                  {/* Column Content */}
                  <div className="bg-navy-dark/30 border-x border-b border-gold/20 rounded-b-lg p-2 min-h-[calc(100vh-220px)] space-y-2">
                    {stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead)}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`bg-navy-light border border-gold/20 rounded-lg p-3 cursor-pointer hover:border-gold/40 transition-all ${
                          draggedLead?.id === lead.id ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-white font-medium text-sm leading-tight truncate">
                            {lead.hotel || lead.name}
                          </h4>
                          {lead.crm_priority && (
                            <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-medium border ${PRIORITIES[lead.crm_priority]?.color}`}>
                              {PRIORITIES[lead.crm_priority]?.label?.[0]}
                            </span>
                          )}
                        </div>

                        {/* Card Body */}
                        <p className="text-text-muted text-xs mb-2 truncate">{lead.name}</p>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted">{formatDate(lead.created_at)}</span>
                          {lead.crm_expected_value && (
                            <span className="text-gold font-medium">
                              R$ {lead.crm_expected_value.toLocaleString('pt-BR')}
                            </span>
                          )}
                        </div>

                        {/* Diagnostico Badge */}
                        {lead.diagnostico_status === 'completo' && (
                          <div className="mt-2 pt-2 border-t border-gold/10">
                            <span className="text-green-400 text-xs flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Diagnóstico completo
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div className="text-text-muted text-sm text-center py-8 border-2 border-dashed border-gold/10 rounded-lg">
                        Arraste leads aqui
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
