"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Lead {
  id: number
  name: string
  hotel: string
  email: string
  phone: string
  message: string
  source: string
  created_at: string
  token: string | null
  diagnostico_status: string | null
  categoria: string | null
  tipo_localizacao: string | null
  publico_principal: string | null
  canal_principal: string | null
  adr: number | null
  ocupacao_media: number | null
  faturamento_mensal: string | null
  completed_at: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const statusLabels: Record<string, { label: string; color: string }> = {
  rascunho: { label: "Rascunho", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  completo: { label: "Completo", color: "bg-green-500/20 text-green-400 border-green-500/30" },
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("todos")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [statusFilter])

  async function fetchLeads(page = 1) {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })
      if (statusFilter !== 'todos') {
        params.set('status', statusFilter)
      }

      console.log("[v0] Fetching leads with params:", params.toString())
      const response = await fetch(`/api/admin/leads?${params}`)
      
      console.log("[v0] Response status:", response.status)
      
      if (response.status === 401) {
        console.log("[v0] 401 - Redirecting to /admin")
        router.replace('/admin')
        return
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Error response:", errorText)
        throw new Error('Erro ao buscar leads')
      }

      const data = await response.json()
      console.log("[v0] Data received:", data)
      setLeads(data.leads || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('[v0] Error fetching leads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.replace('/admin')
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

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="bg-navy-dark/50 border-b border-gold/20 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <span className="text-gold font-semibold text-sm">Reserva Ativa</span>
            <h1 className="text-white text-xl font-bold">Gestão de Leads</h1>
          </div>
          <div className="flex items-center gap-4">
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-sm">Filtrar por status:</span>
            <div className="flex gap-2">
              {['todos', 'rascunho', 'completo'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-gold text-navy'
                      : 'bg-navy-light/50 text-white hover:bg-navy-light'
                  }`}
                >
                  {status === 'todos' ? 'Todos' : statusLabels[status]?.label || status}
                </button>
              ))}
            </div>
          </div>
          {pagination && (
            <p className="text-text-muted text-sm">
              {pagination.total} lead{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-navy-light/40 border border-gold/30 rounded-2xl p-12 text-center">
            <p className="text-text-muted text-lg">Nenhum lead encontrado</p>
          </div>
        ) : (
          <div className="bg-navy-light/40 border border-gold/30 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/20">
                    <th className="text-left text-text-muted text-sm font-medium px-4 py-3">Hotel</th>
                    <th className="text-left text-text-muted text-sm font-medium px-4 py-3">Contato</th>
                    <th className="text-left text-text-muted text-sm font-medium px-4 py-3">Status</th>
                    <th className="text-left text-text-muted text-sm font-medium px-4 py-3">Data</th>
                    <th className="text-left text-text-muted text-sm font-medium px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} className="border-b border-gold/10 hover:bg-navy-light/30 transition-colors">
                      <td className="px-4 py-4">
                        <p className="text-white font-medium">{lead.hotel || '—'}</p>
                        <p className="text-text-muted text-sm">{lead.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-white text-sm">{lead.email}</p>
                        <p className="text-text-muted text-sm">{lead.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        {lead.diagnostico_status ? (
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${statusLabels[lead.diagnostico_status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                            {statusLabels[lead.diagnostico_status]?.label || lead.diagnostico_status}
                          </span>
                        ) : (
                          <span className="text-text-muted text-sm">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-text-muted text-sm">{formatDate(lead.created_at)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-3 py-1.5 bg-gold/20 text-gold text-sm font-medium rounded-lg hover:bg-gold/30 transition-colors"
                        >
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => fetchLeads(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  pagination.page === page
                    ? 'bg-gold text-navy'
                    : 'bg-navy-light/50 text-white hover:bg-navy-light'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedLead(null)}>
          <div 
            className="bg-navy-light border border-gold/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white text-xl font-bold">{selectedLead.hotel || 'Lead sem hotel'}</h2>
                <p className="text-text-muted">{selectedLead.name}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-text-muted hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-text-muted text-sm">Email</p>
                  <p className="text-white">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">WhatsApp</p>
                  <a href={`https://wa.me/${selectedLead.phone?.replace(/\D/g, '')}`} className="text-gold hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
              </div>

              {/* Diagnostico Info */}
              {selectedLead.diagnostico_status && (
                <>
                  <hr className="border-gold/20" />
                  <h3 className="text-white font-semibold">Diagnóstico</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-text-muted text-sm">Status</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${statusLabels[selectedLead.diagnostico_status]?.color}`}>
                        {statusLabels[selectedLead.diagnostico_status]?.label}
                      </span>
                    </div>
                    {selectedLead.categoria && (
                      <div>
                        <p className="text-text-muted text-sm">Categoria</p>
                        <p className="text-white capitalize">{selectedLead.categoria.replace(/_/g, ' ')}</p>
                      </div>
                    )}
                    {selectedLead.tipo_localizacao && (
                      <div>
                        <p className="text-text-muted text-sm">Localização</p>
                        <p className="text-white capitalize">{selectedLead.tipo_localizacao.replace(/_/g, ' ')}</p>
                      </div>
                    )}
                    {selectedLead.publico_principal && (
                      <div>
                        <p className="text-text-muted text-sm">Público Principal</p>
                        <p className="text-white capitalize">{selectedLead.publico_principal.replace(/_/g, ' ')}</p>
                      </div>
                    )}
                    {selectedLead.canal_principal && (
                      <div>
                        <p className="text-text-muted text-sm">Canal Principal</p>
                        <p className="text-white capitalize">{selectedLead.canal_principal.replace(/_/g, ' ')}</p>
                      </div>
                    )}
                    {selectedLead.adr && (
                      <div>
                        <p className="text-text-muted text-sm">ADR</p>
                        <p className="text-white">R$ {selectedLead.adr.toFixed(2)}</p>
                      </div>
                    )}
                    {selectedLead.ocupacao_media && (
                      <div>
                        <p className="text-text-muted text-sm">Ocupação Média</p>
                        <p className="text-white">{selectedLead.ocupacao_media}%</p>
                      </div>
                    )}
                    {selectedLead.faturamento_mensal && (
                      <div>
                        <p className="text-text-muted text-sm">Faturamento</p>
                        <p className="text-white capitalize">{selectedLead.faturamento_mensal.replace(/_/g, ' ')}</p>
                      </div>
                    )}
                  </div>

                  {selectedLead.token && (
                    <div>
                      <p className="text-text-muted text-sm mb-1">Link do diagnóstico</p>
                      <a 
                        href={`/diagnostico/${selectedLead.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold text-sm hover:underline break-all"
                      >
                        /diagnostico/{selectedLead.token}
                      </a>
                    </div>
                  )}
                </>
              )}

              {/* Message */}
              {selectedLead.message && (
                <>
                  <hr className="border-gold/20" />
                  <div>
                    <p className="text-text-muted text-sm mb-1">Mensagem do formulário</p>
                    <p className="text-white whitespace-pre-wrap">{selectedLead.message}</p>
                  </div>
                </>
              )}

              {/* Dates */}
              <hr className="border-gold/20" />
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">Criado em</p>
                  <p className="text-white">{formatDate(selectedLead.created_at)}</p>
                </div>
                {selectedLead.completed_at && (
                  <div>
                    <p className="text-text-muted">Diagnóstico concluído em</p>
                    <p className="text-white">{formatDate(selectedLead.completed_at)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
