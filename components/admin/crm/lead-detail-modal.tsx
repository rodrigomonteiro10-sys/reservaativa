"use client"

import { useState, useEffect, useCallback } from "react"

interface LeadDetail {
  id: number
  name: string
  hotel: string
  email: string
  phone: string
  message: string | null
  source: string
  cidade: string | null
  quartos: string | null
  desafio: string | null
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
  adr: string | number | null
  adr_nao_sei: boolean
  ocupacao_media: string | number | null
  ocupacao_nao_sei: boolean
  faturamento_mensal: string | null
  desafios: string | null
  completed_at: string | null
}

interface Activity {
  id: number
  type: string
  description: string
  author: string
  created_at: string
}

interface Note {
  id: number
  content: string
  author: string
  created_at: string
}

interface StageHistory {
  id: number
  from_stage: string | null
  to_stage: string
  author: string
  created_at: string
}

interface LeadDetailModalProps {
  leadId: number
  onClose: () => void
  onUpdate: () => void
}

const STAGES = [
  { id: 'novo', label: 'Novo', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'contato_inicial', label: 'Contato Inicial', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'qualificacao', label: 'Qualificação', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'proposta', label: 'Proposta', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'negociacao', label: 'Negociação', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'fechado_ganho', label: 'Fechado (Ganho)', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'fechado_perdido', label: 'Fechado (Perdido)', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
]

const PRIORITIES: Record<string, { label: string; color: string; dot: string }> = {
  alta: { label: 'Alta', color: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-400' },
  media: { label: 'Média', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  baixa: { label: 'Baixa', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
}

const PRIORITY_LIST = [
  { id: 'alta', label: 'Alta' },
  { id: 'media', label: 'Média' },
  { id: 'baixa', label: 'Baixa' },
]

const ACTIVITY_TYPES = [
  { id: 'ligacao', label: 'Ligação', icon: '📞', color: 'border-l-blue-400' },
  { id: 'email', label: 'E-mail', icon: '✉️', color: 'border-l-purple-400' },
  { id: 'reuniao', label: 'Reunião', icon: '🤝', color: 'border-l-green-400' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', color: 'border-l-emerald-400' },
  { id: 'outro', label: 'Outro', icon: '📌', color: 'border-l-gray-400' },
]

const TABS = [
  { id: 'info', label: 'Informações', icon: '👤' },
  { id: 'formulario', label: 'Formulário', icon: '📋' },
  { id: 'timeline', label: 'Timeline', icon: '📅' },
  { id: 'diagnostico', label: 'Diagnóstico', icon: '📊' },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
      <div className="text-white text-sm">{children}</div>
    </div>
  )
}

function buildWaTemplate(templateId: string, lead: LeadDetail): string {
  const hotel = lead.hotel || lead.name
  const nome = lead.name.split(' ')[0]
  const phone = lead.phone?.replace(/\D/g, '') || ''
  let text = ''

  if (templateId === 'primeiro_contato') {
    text = `Olá ${nome}! Aqui é da equipe da Reserva Ativa. Vi que você tem o ${hotel} e gostaria de entender melhor como podemos ajudar a aumentar sua receita direta. Tem 5 minutos para conversar?`
  } else if (templateId === 'envio_proposta') {
    text = `Olá ${nome}! Conforme combinado, estou enviando a proposta personalizada para o ${hotel}. Qualquer dúvida, estou à disposição!`
  } else if (templateId === 'followup') {
    text = `Olá ${nome}, tudo bem? Passando para saber se você teve a oportunidade de avaliar a proposta que enviamos para o ${hotel}. Posso ajudar com alguma dúvida?`
  } else if (templateId === 'diagnostico') {
    text = `Olá ${nome}! Para finalizarmos seu diagnóstico personalizado do ${hotel}, preciso de alguns dados rápidos. Pode acessar o link abaixo? 👇`
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

const WA_TEMPLATES = [
  { id: 'primeiro_contato', label: '👋 Primeiro Contato' },
  { id: 'envio_proposta', label: '📄 Envio de Proposta' },
  { id: 'followup', label: '🔁 Follow-up' },
  { id: 'diagnostico', label: '📊 Solicitar Diagnóstico' },
]

export function LeadDetailModal({ leadId, onClose, onUpdate }: LeadDetailModalProps) {
  const [lead, setLead] = useState<LeadDetail | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [stageHistory, setStageHistory] = useState<StageHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'formulario' | 'timeline' | 'diagnostico'>('info')

  const [formData, setFormData] = useState({
    crm_stage: '',
    crm_priority: '',
    crm_assigned_to: '',
    crm_next_contact: '',
    crm_expected_value: '',
    crm_lost_reason: '',
  })

  // Save feedback: field name → 'saving' | 'saved'
  const [saveStatus, setSaveStatus] = useState<Record<string, 'saving' | 'saved'>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [newActivity, setNewActivity] = useState({ type: 'ligacao', description: '' })
  const [newNote, setNewNote] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const fetchLeadDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/crm/leads/${leadId}`, { credentials: 'include' })
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
  }, [leadId])

  useEffect(() => { fetchLeadDetails() }, [fetchLeadDetails])

  async function handleSaveField(field: string, value: string) {
    setSaveStatus(prev => ({ ...prev, [field]: 'saving' }))
    try {
      const response = await fetch(`/api/admin/crm/leads/${leadId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value || null }),
      })
      if (response.ok) {
        await fetchLeadDetails()
        onUpdate()
        setSaveStatus(prev => ({ ...prev, [field]: 'saved' }))
        setTimeout(() => setSaveStatus(prev => { const n = { ...prev }; delete n[field]; return n }), 2000)
      }
    } catch (error) {
      console.error('Error saving field:', error)
      setSaveStatus(prev => { const n = { ...prev }; delete n[field]; return n })
    }
  }

  async function handleAddActivity() {
    if (!newActivity.description.trim()) return
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/crm/leads/${leadId}/activities`, {
        method: 'POST',
        credentials: 'include',
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
        credentials: 'include',
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

  async function handleDeleteLead() {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/crm/leads/${leadId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (response.ok) {
        onUpdate()
        onClose()
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const formatDateShort = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })

  const getActivityColor = (type: string) => ACTIVITY_TYPES.find(t => t.id === type)?.color || 'border-l-gray-400'
  const getActivityIcon = (type: string) => ACTIVITY_TYPES.find(t => t.id === type)?.icon || '📌'
  const getStageLabel = (stageId: string) => STAGES.find(s => s.id === stageId)?.label || stageId
  const getStageColor = (stageId: string) => STAGES.find(s => s.id === stageId)?.color || ''

  function SaveIndicator({ field }: { field: string }) {
    const status = saveStatus[field]
    if (!status) return null
    return (
      <span className={`text-xs ml-2 transition-opacity ${status === 'saved' ? 'text-green-400' : 'text-text-muted'}`}>
        {status === 'saving' ? '…' : '✓ Salvo'}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!lead) return null

  const stageColor = getStageColor(formData.crm_stage)
  const priorityInfo = PRIORITIES[formData.crm_priority]
  const isOverdue = lead.crm_next_contact && new Date(lead.crm_next_contact) < new Date()

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-navy-light border border-gold/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-gold/15 bg-gradient-to-r from-navy-dark/60 to-navy-light">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-xl font-bold truncate">{lead.hotel || lead.name}</h2>
              {lead.hotel
                ? <p className="text-text-muted text-sm mt-0.5">{lead.name} · {lead.email}</p>
                : <p className="text-text-muted text-sm mt-0.5">{lead.email}</p>
              }
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {stageColor && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stageColor}`}>
                    {getStageLabel(formData.crm_stage)}
                  </span>
                )}
                {priorityInfo && (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityInfo.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dot}`} />
                    {priorityInfo.label}
                  </span>
                )}
                {lead.crm_expected_value && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold/15 text-gold border border-gold/25">
                    R$ {Number(lead.crm_expected_value).toLocaleString('pt-BR')}
                  </span>
                )}
                {isOverdue && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/25">
                    ⏰ Follow-up atrasado
                  </span>
                )}
                {lead.diagnostico_status === 'completo' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/25">
                    ✓ Diagnóstico
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`}
                target="_blank" rel="noopener noreferrer" title="WhatsApp"
                className="w-9 h-9 rounded-lg bg-green-600/20 border border-green-500/30 flex items-center justify-center hover:bg-green-600/35 transition-colors"
              >
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.847L.057 23.882l6.204-1.448A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.501-5.201-1.375l-.373-.221-3.861.901.953-3.745-.243-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </a>
              <a
                href={`mailto:${lead.email}`} title="E-mail"
                className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center hover:bg-blue-600/35 transition-colors"
              >
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                title="Excluir lead"
                className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400/60 hover:bg-red-600/25 hover:text-red-400 hover:border-red-500/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-navy-dark/50 border border-gold/15 flex items-center justify-center text-text-muted hover:text-white hover:border-gold/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-gold/15 bg-navy-dark/20">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'text-text-muted hover:text-white hover:bg-navy-dark/40'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── INFO TAB ── */}
          {activeTab === 'info' && (
            <div className="space-y-5">

              {/* Contact card */}
              <div className="bg-navy-dark/40 border border-gold/10 rounded-xl p-4">
                <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-3">Contato</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Email">
                    <a href={`mailto:${lead.email}`} className="text-gold hover:underline">{lead.email}</a>
                  </Field>
                  <Field label="WhatsApp">
                    <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">{lead.phone}</a>
                  </Field>
                  {lead.cidade && <Field label="Cidade">{lead.cidade}</Field>}
                  {lead.quartos && <Field label="Quartos">{lead.quartos}</Field>}
                </div>
              </div>

              {/* CRM management card */}
              <div className="bg-navy-dark/40 border border-gold/10 rounded-xl p-4">
                <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-3">Gestão do Lead</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-1.5">
                      Estágio <SaveIndicator field="crm_stage" />
                    </p>
                    <select
                      value={formData.crm_stage}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, crm_stage: e.target.value }))
                        handleSaveField('crm_stage', e.target.value)
                      }}
                      className="w-full px-3 py-2 bg-navy-light border border-gold/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold/60 cursor-pointer"
                    >
                      {STAGES.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-1.5">
                      Prioridade <SaveIndicator field="crm_priority" />
                    </p>
                    <select
                      value={formData.crm_priority}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, crm_priority: e.target.value }))
                        handleSaveField('crm_priority', e.target.value)
                      }}
                      className="w-full px-3 py-2 bg-navy-light border border-gold/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold/60 cursor-pointer"
                    >
                      {PRIORITY_LIST.map(p => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-1.5">
                      Responsável <SaveIndicator field="crm_assigned_to" />
                    </p>
                    <input
                      type="text"
                      value={formData.crm_assigned_to}
                      onChange={(e) => setFormData(prev => ({ ...prev, crm_assigned_to: e.target.value }))}
                      onBlur={() => handleSaveField('crm_assigned_to', formData.crm_assigned_to)}
                      placeholder="Nome do responsável"
                      className="w-full px-3 py-2 bg-navy-light border border-gold/20 rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-gold/60"
                    />
                  </div>

                  <div>
                    <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-1.5">
                      Próximo Contato <SaveIndicator field="crm_next_contact" />
                    </p>
                    <input
                      type="date"
                      value={formData.crm_next_contact}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, crm_next_contact: e.target.value }))
                        handleSaveField('crm_next_contact', e.target.value)
                      }}
                      className="w-full px-3 py-2 bg-navy-light border border-gold/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold/60"
                    />
                  </div>

                  <div>
                    <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-1.5">
                      Valor Esperado (R$) <SaveIndicator field="crm_expected_value" />
                    </p>
                    <input
                      type="number"
                      value={formData.crm_expected_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, crm_expected_value: e.target.value }))}
                      onBlur={() => handleSaveField('crm_expected_value', formData.crm_expected_value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-navy-light border border-gold/20 rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-gold/60"
                    />
                  </div>

                  {formData.crm_stage === 'fechado_perdido' && (
                    <div className="sm:col-span-2">
                      <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-1.5">
                        Motivo da Perda <SaveIndicator field="crm_lost_reason" />
                      </p>
                      <textarea
                        value={formData.crm_lost_reason}
                        onChange={(e) => setFormData(prev => ({ ...prev, crm_lost_reason: e.target.value }))}
                        onBlur={() => handleSaveField('crm_lost_reason', formData.crm_lost_reason)}
                        placeholder="Descreva o motivo da perda..."
                        rows={2}
                        className="w-full px-3 py-2 bg-navy-light border border-gold/20 rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-gold/60 resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Templates */}
              <div className="bg-navy-dark/40 border border-gold/10 rounded-xl p-4">
                <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-3">Templates de Mensagem</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {WA_TEMPLATES.map(tpl => (
                    <a
                      key={tpl.id}
                      href={buildWaTemplate(tpl.id, lead)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2.5 bg-navy-light/60 border border-gold/10 rounded-lg text-sm text-white hover:border-green-500/40 hover:bg-green-600/10 hover:text-green-300 transition-all group"
                    >
                      <svg className="w-4 h-4 text-green-400/60 group-hover:text-green-400 flex-shrink-0 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.847L.057 23.882l6.204-1.448A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.501-5.201-1.375l-.373-.221-3.861.901.953-3.745-.243-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                      {tpl.label}
                    </a>
                  ))}
                </div>
              </div>

              <p className="text-text-muted text-xs text-right">Lead criado em {formatDate(lead.created_at)}</p>
            </div>
          )}

          {/* ── FORMULÁRIO TAB ── */}
          {activeTab === 'formulario' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs flex items-center justify-center font-bold">1</span>
                  <h3 className="text-white font-semibold text-sm">Dados de Contato</h3>
                </div>
                <div className="bg-navy-dark/40 border border-gold/10 rounded-xl p-4 grid sm:grid-cols-2 gap-4">
                  <Field label="Nome">{lead.name}</Field>
                  <Field label="Hotel / Propriedade">{lead.hotel || <span className="text-text-muted">—</span>}</Field>
                  <Field label="Email">
                    <a href={`mailto:${lead.email}`} className="text-gold hover:underline">{lead.email}</a>
                  </Field>
                  <Field label="WhatsApp">
                    <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">{lead.phone}</a>
                  </Field>
                  {lead.cidade && <Field label="Cidade">{lead.cidade}</Field>}
                  {lead.quartos && <Field label="Número de Quartos">{lead.quartos}</Field>}
                  {lead.desafio && (
                    <div className="sm:col-span-2">
                      <Field label="Principal desafio relatado">
                        <p className="leading-relaxed">{lead.desafio}</p>
                      </Field>
                    </div>
                  )}
                  {lead.message && (
                    <div className="sm:col-span-2">
                      <Field label="Mensagem adicional">
                        <p className="whitespace-pre-wrap leading-relaxed">{lead.message}</p>
                      </Field>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <Field label="Origem">
                      <span className="capitalize">{lead.source?.replace(/_/g, ' ') || '—'}</span>
                    </Field>
                  </div>
                </div>
              </div>

              {lead.diagnostico_status ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs flex items-center justify-center font-bold">2</span>
                    <h3 className="text-white font-semibold text-sm">Diagnóstico Preenchido</h3>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium border ${lead.diagnostico_status === 'completo' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                      {lead.diagnostico_status === 'completo' ? 'Completo' : 'Em andamento'}
                    </span>
                  </div>
                  <div className="bg-navy-dark/40 border border-gold/10 rounded-xl p-4 grid sm:grid-cols-2 gap-4">
                    {lead.categoria && <Field label="Categoria"><span className="capitalize">{lead.categoria.replace(/_/g, ' ')}</span></Field>}
                    {lead.tipo_localizacao && <Field label="Tipo de Localização"><span className="capitalize">{lead.tipo_localizacao.replace(/_/g, ' ')}</span></Field>}
                    {lead.publico_principal && <Field label="Público Principal"><span className="capitalize">{lead.publico_principal.replace(/_/g, ', ')}</span></Field>}
                    {lead.canal_principal && <Field label="Canal Principal"><span className="capitalize">{lead.canal_principal.replace(/_/g, ' ')}</span></Field>}
                    {lead.canais_venda && (
                      <div className="sm:col-span-2">
                        <Field label="Canais de Venda"><span className="capitalize">{lead.canais_venda.replace(/_/g, ', ')}</span></Field>
                      </div>
                    )}
                    {lead.atrativos && (
                      <div className="sm:col-span-2">
                        <Field label="Atrativos"><span className="capitalize">{lead.atrativos.replace(/_/g, ', ')}</span></Field>
                      </div>
                    )}
                    <Field label="ADR (Diária Média)">
                      {lead.adr_nao_sei ? 'Não sabe' : lead.adr ? `R$ ${parseFloat(String(lead.adr)).toFixed(2)}` : '—'}
                    </Field>
                    <Field label="Ocupação Média">
                      {lead.ocupacao_nao_sei ? 'Não sabe' : lead.ocupacao_media ? `${parseFloat(String(lead.ocupacao_media)).toFixed(0)}%` : '—'}
                    </Field>
                    {lead.faturamento_mensal && (
                      <Field label="Faturamento Mensal"><span className="capitalize">{lead.faturamento_mensal.replace(/_/g, ' ')}</span></Field>
                    )}
                    {lead.desafios && (
                      <div className="sm:col-span-2">
                        <Field label="Desafios principais">
                          <p className="whitespace-pre-wrap leading-relaxed">{lead.desafios}</p>
                        </Field>
                      </div>
                    )}
                    {lead.completed_at && (
                      <div className="sm:col-span-2">
                        <Field label="Diagnóstico concluído em">{formatDate(lead.completed_at)}</Field>
                      </div>
                    )}
                    {lead.token && (
                      <div className="sm:col-span-2">
                        <Field label="Link do diagnóstico">
                          <a href={`/diagnostico/${lead.token}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline break-all">
                            /diagnostico/{lead.token}
                          </a>
                        </Field>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-navy-dark/40 border border-gold/10 rounded-xl p-6 text-center">
                  <p className="text-text-muted mb-3 text-sm">Este lead ainda não preencheu o diagnóstico</p>
                  {lead.token && (
                    <a href={`/diagnostico/${lead.token}`} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 bg-gold text-navy text-sm font-semibold rounded-lg hover:bg-gold/90 transition-colors">
                      Abrir formulário de diagnóstico
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── TIMELINE TAB ── */}
          {activeTab === 'timeline' && (
            <div className="space-y-5">
              <div className="bg-navy-dark/40 border border-gold/15 rounded-xl p-4">
                <h4 className="text-white font-semibold text-sm mb-3">Registrar Atividade</h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {ACTIVITY_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setNewActivity(prev => ({ ...prev, type: type.id }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        newActivity.type === type.id
                          ? 'bg-gold text-navy'
                          : 'bg-navy-light/60 text-text-muted hover:text-white hover:bg-navy-light'
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
                    onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
                    placeholder="Descreva a atividade..."
                    className="flex-1 px-3 py-2 bg-navy-light border border-gold/20 rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-gold/60"
                  />
                  <button
                    onClick={handleAddActivity}
                    disabled={!newActivity.description.trim() || isSaving}
                    className="px-4 py-2 bg-gold text-navy text-sm font-semibold rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-40"
                  >
                    Salvar
                  </button>
                </div>
              </div>

              <div className="bg-navy-dark/40 border border-gold/15 rounded-xl p-4">
                <h4 className="text-white font-semibold text-sm mb-3">📝 Adicionar Nota</h4>
                <div className="flex gap-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escreva uma nota..."
                    rows={2}
                    className="flex-1 px-3 py-2 bg-navy-light border border-gold/20 rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:border-gold/60 resize-none"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSaving}
                    className="px-4 py-2 bg-gold text-navy text-sm font-semibold rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-40 self-end"
                  >
                    Salvar
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Histórico</h4>
                {activities.length === 0 && notes.length === 0 && stageHistory.length === 0 ? (
                  <p className="text-text-muted text-center py-10 text-sm">Nenhuma atividade registrada</p>
                ) : (
                  <div className="space-y-2">
                    {[
                      ...activities.map(a => ({ ...a, itemType: 'activity' as const })),
                      ...notes.map(n => ({ ...n, itemType: 'note' as const, type: 'note', description: n.content })),
                      ...stageHistory.map(s => ({
                        ...s,
                        itemType: 'stage' as const,
                        type: 'stage_change',
                        description: `${getStageLabel(s.from_stage || 'novo')} → ${getStageLabel(s.to_stage)}`,
                        author: s.author,
                      })),
                    ]
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((item, index) => {
                        const borderColor =
                          item.itemType === 'note' ? 'border-l-amber-400' :
                          item.itemType === 'stage' ? 'border-l-purple-400' :
                          getActivityColor(item.type)
                        const icon =
                          item.itemType === 'note' ? '📝' :
                          item.itemType === 'stage' ? '🔄' :
                          getActivityIcon(item.type)
                        return (
                          <div key={`${item.itemType}-${index}`} className={`flex gap-3 p-3 bg-navy-dark/30 border border-gold/10 border-l-2 ${borderColor} rounded-lg rounded-l-none`}>
                            <span className="flex-shrink-0 text-base mt-0.5">{icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm leading-snug">{item.description}</p>
                              <p className="text-text-muted text-xs mt-1">{formatDateShort(item.created_at)} · {item.author || 'admin'}</p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── DIAGNÓSTICO TAB ── */}
          {activeTab === 'diagnostico' && (
            <div className="space-y-5">
              {!lead.diagnostico_status ? (
                <div className="text-center py-16">
                  <p className="text-text-muted mb-4 text-sm">Este lead ainda não completou o diagnóstico</p>
                  {lead.token && (
                    <a href={`/diagnostico/${lead.token}`} target="_blank" rel="noopener noreferrer" className="inline-flex px-5 py-2.5 bg-gold text-navy font-semibold rounded-lg hover:bg-gold/90 transition-colors text-sm">
                      Abrir formulário de diagnóstico
                    </a>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${lead.diagnostico_status === 'completo' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                      {lead.diagnostico_status === 'completo' ? '✓ Diagnóstico Completo' : '⚡ Em Andamento'}
                    </span>
                    {lead.completed_at && (
                      <span className="text-text-muted text-xs">Concluído em {formatDate(lead.completed_at)}</span>
                    )}
                  </div>

                  {(lead.adr || lead.adr_nao_sei || lead.ocupacao_media || lead.ocupacao_nao_sei || lead.faturamento_mensal) && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-navy-dark/50 border border-gold/15 rounded-xl p-3 text-center">
                        <p className="text-text-muted text-xs mb-1">ADR Médio</p>
                        <p className="text-white font-bold text-lg">
                          {lead.adr_nao_sei ? <span className="text-sm font-normal text-text-muted">Não sabe</span> : lead.adr ? `R$${parseFloat(String(lead.adr)).toFixed(0)}` : '—'}
                        </p>
                      </div>
                      <div className="bg-navy-dark/50 border border-gold/15 rounded-xl p-3 text-center">
                        <p className="text-text-muted text-xs mb-1">Ocupação</p>
                        <p className="text-white font-bold text-lg">
                          {lead.ocupacao_nao_sei ? <span className="text-sm font-normal text-text-muted">Não sabe</span> : lead.ocupacao_media ? `${parseFloat(String(lead.ocupacao_media)).toFixed(0)}%` : '—'}
                        </p>
                      </div>
                      <div className="bg-navy-dark/50 border border-gold/15 rounded-xl p-3 text-center">
                        <p className="text-text-muted text-xs mb-1">Faturamento</p>
                        <p className="text-white font-bold text-sm capitalize">
                          {lead.faturamento_mensal ? lead.faturamento_mensal.replace(/_/g, ' ') : '—'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-navy-dark/40 border border-gold/10 rounded-xl p-4 grid sm:grid-cols-2 gap-4">
                    {lead.categoria && <Field label="Categoria"><span className="capitalize">{lead.categoria.replace(/_/g, ' ')}</span></Field>}
                    {lead.tipo_localizacao && <Field label="Localização"><span className="capitalize">{lead.tipo_localizacao.replace(/_/g, ' ')}</span></Field>}
                    {lead.publico_principal && <Field label="Público Principal"><span className="capitalize">{lead.publico_principal.replace(/_/g, ', ')}</span></Field>}
                    {lead.canal_principal && <Field label="Canal Principal"><span className="capitalize">{lead.canal_principal.replace(/_/g, ' ')}</span></Field>}
                    {lead.canais_venda && (
                      <div className="sm:col-span-2">
                        <Field label="Canais de Venda"><span className="capitalize">{lead.canais_venda.replace(/_/g, ', ')}</span></Field>
                      </div>
                    )}
                    {lead.atrativos && (
                      <div className="sm:col-span-2">
                        <Field label="Atrativos"><span className="capitalize">{lead.atrativos.replace(/_/g, ', ')}</span></Field>
                      </div>
                    )}
                    {lead.desafios && (
                      <div className="sm:col-span-2">
                        <Field label="Desafios">
                          <p className="whitespace-pre-wrap leading-relaxed">{lead.desafios}</p>
                        </Field>
                      </div>
                    )}
                    {lead.token && (
                      <div className="sm:col-span-2">
                        <Field label="Link do diagnóstico">
                          <a href={`/diagnostico/${lead.token}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline break-all">
                            /diagnostico/{lead.token}
                          </a>
                        </Field>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 flex items-center justify-center z-10" onClick={e => e.stopPropagation()}>
          <div className="bg-navy-light border border-red-500/30 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Excluir lead?</h3>
            <p className="text-text-muted text-sm mb-5">
              Todos os dados de <span className="text-white font-medium">{lead.hotel || lead.name}</span> serão removidos permanentemente, incluindo atividades, notas e histórico.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-navy-dark border border-gold/20 text-white text-sm font-medium rounded-lg hover:border-gold/40 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteLead}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600/80 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo…' : 'Excluir definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
