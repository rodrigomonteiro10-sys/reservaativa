"use client"

import { useState } from "react"
import type { DiagnosticoData } from "../wizard"

interface StepProps {
  data: DiagnosticoData
  onNext: (data: Partial<DiagnosticoData>) => void
  onPrevious: () => void
  isSaving: boolean
}

const canais = [
  { value: "booking", label: "Booking.com" },
  { value: "expedia", label: "Expedia" },
  { value: "airbnb", label: "Airbnb" },
  { value: "decolar", label: "Decolar" },
  { value: "trivago", label: "Trivago" },
  { value: "whatsapp", label: "WhatsApp / Direto" },
  { value: "telefone", label: "Telefone" },
  { value: "site_proprio", label: "Site próprio" },
  { value: "instagram", label: "Instagram" },
  { value: "google", label: "Google Hotel Ads" },
  { value: "agencias", label: "Agências / Operadoras" },
  { value: "indicacao", label: "Indicação" },
]

export function Step3Canais({ data, onNext, onPrevious, isSaving }: StepProps) {
  const [selectedCanais, setSelectedCanais] = useState<string[]>(data.canais_venda || [])
  const [canalPrincipal, setCanalPrincipal] = useState(data.canal_principal || "")

  const toggleCanal = (value: string) => {
    setSelectedCanais(prev => {
      const newCanais = prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
      
      // If removing the principal canal, reset it
      if (!newCanais.includes(canalPrincipal)) {
        setCanalPrincipal("")
      }
      
      return newCanais
    })
  }

  const handleSubmit = () => {
    if (selectedCanais.length === 0 || !canalPrincipal) return
    onNext({
      canais_venda: selectedCanais,
      canal_principal: canalPrincipal,
    })
  }

  const isValid = selectedCanais.length > 0 && canalPrincipal

  return (
    <div className="bg-navy-light/40 border border-gold/30 rounded-2xl p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Canais de venda</h2>
        <p className="text-text-muted">Por onde você recebe reservas atualmente?</p>
      </div>

      <div className="space-y-6">
        {/* Canais utilizados */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            Selecione todos os canais que você utiliza *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {canais.map(canal => (
              <button
                key={canal.value}
                type="button"
                onClick={() => toggleCanal(canal.value)}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  selectedCanais.includes(canal.value)
                    ? "bg-gold/20 border-gold text-gold"
                    : "bg-navy-dark/50 border-gold/20 text-white hover:border-gold/50"
                }`}
              >
                {canal.label}
              </button>
            ))}
          </div>
        </div>

        {/* Canal principal */}
        {selectedCanais.length > 0 && (
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <label className="block text-white text-sm font-medium mb-3">
              Qual desses é o seu canal principal? *
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedCanais.map(value => {
                const canal = canais.find(c => c.value === value)
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCanalPrincipal(value)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      canalPrincipal === value
                        ? "bg-gold text-navy border-gold"
                        : "bg-navy-dark/50 border-gold/20 text-white hover:border-gold/50"
                    }`}
                  >
                    {canal?.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-gold/30 text-white font-medium rounded-lg hover:border-gold/60 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid || isSaving}
          className="px-8 py-3 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-navy border-t-transparent rounded-full" />
              Salvando...
            </>
          ) : (
            <>
              Próximo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
