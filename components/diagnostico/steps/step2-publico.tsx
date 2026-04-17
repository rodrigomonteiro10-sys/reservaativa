"use client"

import { useState } from "react"
import type { DiagnosticoData } from "../wizard"

interface StepProps {
  data: DiagnosticoData
  onNext: (data: Partial<DiagnosticoData>) => void
  onPrevious: () => void
  isSaving: boolean
}

const publicos = [
  { value: "familias", label: "Famílias com crianças", icon: "👨‍👩‍👧‍👦" },
  { value: "casais", label: "Casais", icon: "💑" },
  { value: "corporativo", label: "Corporativo / Eventos", icon: "💼" },
  { value: "grupos", label: "Grupos / Excursões", icon: "🚌" },
  { value: "aventureiros", label: "Aventureiros / Ecoturistas", icon: "🏔️" },
  { value: "terceira_idade", label: "Terceira idade", icon: "👴" },
  { value: "jovens", label: "Jovens / Mochileiros", icon: "🎒" },
  { value: "misto", label: "Público misto", icon: "🌐" },
]

export function Step2Publico({ data, onNext, onPrevious, isSaving }: StepProps) {
  const [publicoPrincipal, setPublicoPrincipal] = useState(data.publico_principal || "")

  const handleSubmit = () => {
    if (!publicoPrincipal) return
    onNext({ publico_principal: publicoPrincipal })
  }

  return (
    <div className="bg-navy-light/40 border border-gold/30 rounded-2xl p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Seu público</h2>
        <p className="text-text-muted">Qual o perfil principal dos hóspedes que você recebe?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            Público principal *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {publicos.map(pub => (
              <button
                key={pub.value}
                type="button"
                onClick={() => setPublicoPrincipal(pub.value)}
                className={`px-4 py-4 rounded-lg border text-left transition-all flex items-center gap-3 ${
                  publicoPrincipal === pub.value
                    ? "bg-gold/20 border-gold"
                    : "bg-navy-dark/50 border-gold/20 hover:border-gold/50"
                }`}
              >
                <span className="text-2xl">{pub.icon}</span>
                <span className={`font-medium ${publicoPrincipal === pub.value ? "text-gold" : "text-white"}`}>
                  {pub.label}
                </span>
              </button>
            ))}
          </div>
        </div>
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
          disabled={!publicoPrincipal || isSaving}
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
