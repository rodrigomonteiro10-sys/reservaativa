"use client"

import { useState } from "react"
import type { DiagnosticoData } from "../wizard"

interface StepProps {
  data: DiagnosticoData
  onPrevious: () => void
  onComplete: (data: Partial<DiagnosticoData>) => void
  isSaving: boolean
}

const desafios = [
  { value: "conversao_whatsapp", label: "Leads no WhatsApp que não convertem" },
  { value: "dependencia_otas", label: "Dependência das OTAs (Booking, etc)" },
  { value: "ocupacao_baixa", label: "Ocupação baixa na semana/baixa temporada" },
  { value: "sem_metricas", label: "Não conheço minhas métricas reais" },
  { value: "recepcao_sobrecarregada", label: "Recepção sobrecarregada" },
  { value: "marketing_ineficiente", label: "Marketing que não traz resultado" },
  { value: "preco_incorreto", label: "Dificuldade em precificar corretamente" },
  { value: "concorrencia", label: "Concorrência agressiva na região" },
  { value: "sazonalidade", label: "Sazonalidade muito forte" },
  { value: "equipe", label: "Dificuldade com equipe/treinamento" },
  { value: "tecnologia", label: "Sistemas/tecnologia desatualizados" },
  { value: "outro", label: "Outro" },
]

export function Step5Desafios({ data, onPrevious, onComplete, isSaving }: StepProps) {
  const [selectedDesafios, setSelectedDesafios] = useState<string[]>(data.desafios || [])

  const toggleDesafio = (value: string) => {
    setSelectedDesafios(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const handleSubmit = () => {
    if (selectedDesafios.length === 0) return
    onComplete({ desafios: selectedDesafios })
  }

  return (
    <div className="bg-navy-light/40 border border-gold/30 rounded-2xl p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Seus desafios</h2>
        <p className="text-text-muted">Selecione os principais desafios que você enfrenta hoje.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            Quais são seus maiores desafios? *
            <span className="text-text-muted font-normal ml-2">(selecione quantos quiser)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {desafios.map(desafio => (
              <button
                key={desafio.value}
                type="button"
                onClick={() => toggleDesafio(desafio.value)}
                className={`px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all ${
                  selectedDesafios.includes(desafio.value)
                    ? "bg-gold/20 border-gold text-gold"
                    : "bg-navy-dark/50 border-gold/20 text-white hover:border-gold/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  {selectedDesafios.includes(desafio.value) && (
                    <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {desafio.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {selectedDesafios.length > 0 && (
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
            <p className="text-gold text-sm">
              <strong>{selectedDesafios.length}</strong> desafio{selectedDesafios.length > 1 ? "s" : ""} selecionado{selectedDesafios.length > 1 ? "s" : ""}
            </p>
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
          disabled={selectedDesafios.length === 0 || isSaving}
          className="px-8 py-3 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-navy border-t-transparent rounded-full" />
              Finalizando...
            </>
          ) : (
            <>
              Concluir diagnóstico
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
