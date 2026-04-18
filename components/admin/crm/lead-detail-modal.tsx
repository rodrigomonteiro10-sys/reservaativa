"use client"

import { useState, useEffect } from "react"

interface LeadDetail {
  id: number
  name: string
  hotel: string
  email: string
  phone: string
  message: string
  source: string
  created_at: string
  updated_at: string
  crm_stage: string
  crm_priority: string
  crm_assigned_to: string | null
  crm_next_contact: string | null
  crm_expected_value: number | null
  crm_lost_reason: string | null
  token: string | null
  diagnostico_status: string | null
  categoria: string | null
  tipo_localizacao: string | null
  atrativos: string | null
  publico_principal: string | null
  canais_venda: string | null
  canal_principal: string | null
  adr: number | null
  adr_nao_sei: boolean
  ocupacao_media: number | null
  ocupacao_nao_sei: boolean
  faturamento_mensal: string | null
  desafios: string | null
  completed_at: string | null
}

interface Activity {
  id: number
  type: string
  description: string
  created_by: string
  created_at: string
}

interface Note {
  id: number
  content: string
  created_by: string
  created_at: string
}

interface StageHistory {
  id: number
  from_stage: string | null
  to_stage: string
  changed_by: string
  changed_at: string
}

interface LeadDetailModalProps {
  leadId: number
  onClose: () => void
  onUpdate: () => void
}

const STAGES = [
  { id: 'novo', label: 'Novo' },
  { id: 'contato_inicial', label: 'Contato Inicial' },
  { id: 'qualificacao', label: 'Qualificação' },
  { id: 'proposta', label: 'Proposta' },
  { id: 'negociacao', label: 'Negociação' },
  { id: 'fechado_ganho', label: 'Fechado (Ganho)' },
  { id: 'fechado_perdido', label: 'Fechado (Perdido)' },
]

const PRIORITIES = [
  { id: 'alta', label: 'Alta' },
  { id: 'media', label: 'Média' },
  { id: 'baixa', label: 'Baixa' },
]

const ACTIVITY_TYPES = [
  { id: 'ligacao', label: 'Ligação', icon: '📞' },
  { id: 'email', label: 'E-mail', icon: '✉️' },
  { id: 'reuniao', label: 'Reunião', icon: '🤝' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'outro', label: 'Outro', icon: '📌' },
]

export function LeadDetailModal({ leadId, onClose, onUpdate }: LeadDetailModalProps) {
  const [lead, setLead] = useState<LeadDetail | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [stageHistory, setStageHistory] = useState<StageHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'timeline' | 'diagnostico'>('info')
  
  // Edit states
  const [editingField, setEditingField] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    crm_stage: '',
    crm_priority: '',
    crm_assigned_to: '',
    crm_next_contact: '',
    crm_expected_value: '',
    crm_lost_reason: '',
  })

  // New activity/note states
  const [newActivity, setNewActivity] = useState({ type: 'ligacao', description: '' })
  const [newNote, setNewNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchLeadDetails()
  }, [leadId])

  async function fetchLeadDetails() {
    try {
      const response = await fetch(`/api/admin/crm/leads/${leadId}`)
      if (!response.ok) throw new Error('Erro ao buscar lead')
      
      const data = await response.json()
      setLead(data.lead)
      setActivities(data.activities || [])
      setNotes(data.notes || [])
      setStageHistory(data.stageHistory || [])
      
      setFormData({
        crm_stage: data.lead.crm_stage || 'novo',
        crm_priority: data.lead.crm_priority || 'media',
        crm_assigned_to: data.lead.crm_assigned_to || '',
        crm_next_contact: data.lead.crm_next_contact?.split('T')[0] || '',
        crm_expected_value: data.lead.crm_expected_value?.toString() || '',
        crm_lost_reason: data.lead.crm_lost_reason || '',
      })
    } catch (error) {
      console.error('Error fetching lead details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSaveField(field: string, value: string) {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value || null }),
      })
      
      if (response.ok) {
        await fetchLeadDetails()
        onUpdate()
      }
    } catch (error) {
      console.error('Error saving field:', error)
    } finally {
      setIsSaving(false)
      setEditingField(null)
    }
  }

  async function handleAddActivity() {
    if (!newActivity.description.trim()) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/crm/leads/${leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      })
      
      if (response.ok) {
        setNewActivity({ type: 'ligacao', description: '' })
        await fetchLeadDetails()
      }
    } catch (error) {
      console.error('Error adding activity:', error)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/crm/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      })
      
      if (response.ok) {
        setNewNote('')
        await fetchLeadDetails()
      }
    } catch (error) {
      console.error('Error adding note:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActivityIcon = (type: string) => {
    return ACTIVITY_TYPES.find(t => t.id === type)?.icon || '📌'
  }

  const getStageLabel = (stageId: string) => {
    return STAGES.find(s => s.id === stageId)?.label || stageId
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!lead) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-navy-light border border-gold/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gold/20">
          <div>
            <h2 className="text-white text-xl font-bold">{lead.hotel || lead.name}</h2>
            <p className="text-text-muted">{lead.hotel ? lead.name : lead.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gold/20">
          {[
            { id: 'info', label: 'Informações' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'diagnostico', label: 'Diagnóstico' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-text-muted text-sm mb-1">Email</p>
                  <a href={`mailto:${lead.email}`} className="text-gold hover:underline">{lead.email}</a>
                </div>
                <div>
                  <p className="text-text-muted text-sm mb-1">WhatsApp</p>
                  <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                    {lead.phone}
                  </a>
                </div>
              </div>

              <hr className="border-gold/20" />

              {/* CRM Fields */}
              <h3 className="text-white font-semibold">Gestão do Lead</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Stage */}
                <div>
                  <p className="text-text-muted text-sm mb-1">Estágio</p>
                  <select
                    value={formData.crm_stage}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, crm_stage: e.target.value }))
                      handleSaveField('crm_stage', e.target.value)
                    }}
                    className="w-full px-3 py-2 bg-navy-dark border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                  >
                    {STAGES.map(stage => (
                      <option key={stage.id} value={stage.id}>{stage.label}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <p className="text-text-muted text-sm mb-1">Prioridade</p>
                  <select
                    value={formData.crm_priority}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, crm_priority: e.target.value }))
                      handleSaveField('crm_priority', e.target.value)
                    }}
                    className="w-full px-3 py-2 bg-navy-dark border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Assigned To */}
                <div>
                  <p className="text-text-muted text-sm mb-1">Responsável</p>
                  <input
                    type="text"
                    value={formData.crm_assigned_to}
                    onChange={(e) => setFormData(prev => ({ ...prev, crm_assigned_to: e.target.value }))}
                    onBlur={() => handleSaveField('crm_assigned_to', formData.crm_assigned_to)}
                    placeholder="Nome do responsável"
                    className="w-full px-3 py-2 bg-navy-dark border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Next Contact */}
                <div>
                  <p className="text-text-muted text-sm mb-1">Próximo Contato</p>
                  <input
                    type="date"
                    value={formData.crm_next_contact}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, crm_next_contact: e.target.value }))
                      handleSaveField('crm_next_contact', e.target.value)
                    }}
                    className="w-full px-3 py-2 bg-navy-dark border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Expected Value */}
                <div>
                  <p className="text-text-muted text-sm mb-1">Valor Esperado (R$)</p>
                  <input
                    type="number"
                    value={formData.crm_expected_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, crm_expected_value: e.target.value }))}
                    onBlur={() => handleSaveField('crm_expected_value', formData.crm_expected_value)}
                    placeholder="0,00"
                    className="w-full px-3 py-2 bg-navy-dark border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Lost Reason */}
                {formData.crm_stage === 'fechado_perdido' && (
                  <div className="sm:col-span-2">
                    <p className="text-text-muted text-sm mb-1">Motivo da Perda</p>
                    <textarea
                      value={formData.crm_lost_reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, crm_lost_reason: e.target.value }))}
                      onBlur={() => handleSaveField('crm_lost_reason', formData.crm_lost_reason)}
                      placeholder="Descreva o motivo da perda..."
                      rows={2}
                      className="w-full px-3 py-2 bg-navy-dark border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold resize-none"
                    />
                  </div>
                )}
              </div>

              <hr className="border-gold/20" />

              {/* Quick Actions */}
              <div>
                <h3 className="text-white font-semibold mb-3">Ações Rápidas</h3>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium hover:bg-green-600/30 transition-colors"
                  >
                    Abrir WhatsApp
                  </a>
                  <a
                    href={`mailto:${lead.email}`}
                    className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium hover:bg-blue-600/30 transition-colors"
                  >
                    Enviar Email
                  </a>
                  {lead.token && (
                    <a
                      href={`/diagnostico/${lead.token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gold/20 text-gold border border-gold/30 rounded-lg text-sm font-medium hover:bg-gold/30 transition-colors"
                    >
                      Ver Diagnóstico
                    </a>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="text-sm text-text-muted">
                <p>Criado em: {formatDate(lead.created_at)}</p>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Add Activity */}
              <div className="bg-navy-dark/50 border border-gold/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Registrar Atividade</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {ACTIVITY_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setNewActivity(prev => ({ ...prev, type: type.id }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        newActivity.type === type.id
                          ? 'bg-gold text-navy'
                          : 'bg-navy-light text-white hover:bg-navy-light/80'
                      }`}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva a atividade..."
                    className="flex-1 px-3 py-2 bg-navy-dark border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold"
                  />
                  <button
                    onClick={handleAddActivity}
                    disabled={!newActivity.description.trim() || isSaving}
                    className="px-4 py-2 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Add Note */}
              <div className="bg-navy-dark/50 border border-gold/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Adicionar Nota</h4>
                <div className="flex gap-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escreva uma nota..."
                    rows={2}
                    className="flex-1 px-3 py-2 bg-navy-dark border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold resize-none"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSaving}
                    className="px-4 py-2 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 self-end"
                  >
                    Salvar
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-white font-medium mb-3">Histórico</h4>
                <div className="space-y-3">
                  {activities.length === 0 && notes.length === 0 && stageHistory.length === 0 ? (
                    <p className="text-text-muted text-center py-8">Nenhuma atividade registrada</p>
                  ) : (
                    [...activities.map(a => ({ ...a, itemType: 'activity' as const })),
                     ...notes.map(n => ({ ...n, itemType: 'note' as const, type: 'note', description: n.content })),
                     ...stageHistory.map(s => ({ ...s, itemType: 'stage' as const, type: 'stage_change', description: `${getStageLabel(s.from_stage || 'novo')} → ${getStageLabel(s.to_stage)}`, created_at: s.changed_at, created_by: s.changed_by }))]
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((item, index) => (
                        <div key={`${item.itemType}-${index}`} className="flex gap-3 p-3 bg-navy-dark/30 border border-gold/10 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-navy-light rounded-full flex items-center justify-center text-sm">
                            {item.itemType === 'note' ? '📝' : item.itemType === 'stage' ? '🔄' : getActivityIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm">{item.description}</p>
                            <p className="text-text-muted text-xs mt-1">
                              {formatDateShort(item.created_at)} • {item.created_by || 'admin'}
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diagnostico' && (
            <div className="space-y-6">
              {!lead.diagnostico_status ? (
                <div className="text-center py-12">
                  <p className="text-text-muted mb-4">Este lead ainda não completou o diagnóstico</p>
                  {lead.token && (
                    <a
                      href={`/diagnostico/${lead.token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex px-4 py-2 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors"
                    >
                      Abrir formulário de diagnóstico
                    </a>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      lead.diagnostico_status === 'completo' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {lead.diagnostico_status === 'completo' ? 'Diagnóstico Completo' : 'Em Andamento'}
                    </span>
                    {lead.completed_at && (
                      <span className="text-text-muted text-sm">
                        Concluído em {formatDate(lead.completed_at)}
                      </span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {lead.categoria && (
                      <div>
                        <p className="text-text-muted text-sm">Categoria</p>
                        <p className="text-white capitalize">{lead.categoria.replace(/_/g, ' ')}</p>
                      </div>
                    )}
                    {lead.tipo_localizacao && (
                      <div>
                        <p className="text-text-muted text-sm">Tipo de Localização</p>
                        <p className="text-white capitalize">{lead.tipo_localizacao.replace(/_/g, ' ')}</p>
                      </div>
                    )}
                    {lead.publico_principal && (
                      <div>
                        <p className="text-text-muted text-sm">Público Principal</p>
                        <p className="text-white capitalize">{lead.publico_principal.replace(/_/g, ', ')}</p>
                      </div>
                    )}
                    {lead.canal_principal && (
                      <div>
                        <p className="text-text-muted text-sm">Canal Principal</p>
                        <p className="text-white capitalize">{lead.canal_principal.replace(/_/g, ' ')}</p>
                      </div>
                    )}
                    {lead.canais_venda && (
                      <div className="sm:col-span-2">
                        <p className="text-text-muted text-sm">Canais de Venda</p>
                        <p className="text-white capitalize">{lead.canais_venda.replace(/_/g, ', ')}</p>
                      </div>
                    )}
                    {(lead.adr || lead.adr_nao_sei) && (
                      <div>
                        <p className="text-text-muted text-sm">ADR (Diária Média)</p>
                        <p className="text-white">{lead.adr_nao_sei ? 'Não sabe' : `R$ ${lead.adr?.toFixed(2)}`}</p>
                      </div>
                    )}
                    {(lead.ocupacao_media || lead.ocupacao_nao_sei) && (
                      <div>
                        <p className="text-text-muted text-sm">Ocupação Média</p>
                        <p className="text-white">{lead.ocupacao_nao_sei ? 'Não sabe' : `${lead.ocupacao_media}%`}</p>
                      </div>
                    )}
                    {lead.faturamento_mensal && (
                      <div>
                        <p className="text-text-muted text-sm">Faturamento Mensal</p>
                        <p className="text-white capitalize">{lead.faturamento_mensal.replace(/_/g, ' ')}</p>
                      </div>
                    )}
                    {lead.atrativos && (
                      <div className="sm:col-span-2">
                        <p className="text-text-muted text-sm">Atrativos</p>
                        <p className="text-white capitalize">{lead.atrativos.replace(/_/g, ', ')}</p>
                      </div>
                    )}
                    {lead.desafios && (
                      <div className="sm:col-span-2">
                        <p className="text-text-muted text-sm">Desafios</p>
                        <p className="text-white whitespace-pre-wrap">{lead.desafios}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
