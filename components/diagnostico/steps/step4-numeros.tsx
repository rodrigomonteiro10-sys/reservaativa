"use client"

import { useState } from "react"
import type { DiagnosticoData } from "../wizard"

interface StepProps {
  data: DiagnosticoData
  onNext: (data: Partial<DiagnosticoData>) => void
  onPrevious: () => void
  isSaving: boolean
}

const faixasFaturamento = [
  { value: "ate_50k", label: "Até R$ 50 mil" },
  { value: "50k_100k", label: "R$ 50 mil – R$ 100 mil" },
  { value: "100k_200k", label: "R$ 100 mil – R$ 200 mil" },
  { value: "200k_500k", label: "R$ 200 mil – R$ 500 mil" },
  { value: "acima_500k", label: "Acima de R$ 500 mil" },
  { value: "nao_informar", label: "Prefiro não informar" },
]

export function Step4Numeros({ data, onNext, onPrevious, isSaving }: StepProps) {
  const [adr, setAdr] = useState<string>(data.adr?.toString() || "")
  const [adrNaoSei, setAdrNaoSei] = useState(data.adr_nao_sei || false)
  const [ocupacao, setOcupacao] = useState<string>(data.ocupacao_media?.toString() || "")
  const [ocupacaoNaoSei, setOcupacaoNaoSei] = useState(data.ocupacao_nao_sei || false)
  const [faturamento, setFaturamento] = useState(data.faturamento_mensal || "")

  const handleSubmit = () => {
    onNext({
      adr: adrNaoSei ? null : (adr ? parseFloat(adr) : null),
      adr_nao_sei: adrNaoSei,
      ocupacao_media: ocupacaoNaoSei ? null : (ocupacao ? parseFloat(ocupacao) : null),
      ocupacao_nao_sei: ocupacaoNaoSei,
      faturamento_mensal: faturamento,
    })
  }

  return (
    <div className="bg-navy-light/40 border border-gold/30 rounded-2xl p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Seus números</h2>
        <p className="text-text-muted">Essas informações nos ajudam a calcular o potencial do seu hotel.</p>
      </div>

      <div className="space-y-6">
        {/* ADR */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Qual sua diária média (ADR)?
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">R$</span>
              <input
                type="number"
                value={adr}
                onChange={(e) => {
                  setAdr(e.target.value)
                  setAdrNaoSei(false)
                }}
                disabled={adrNaoSei}
                placeholder="350"
                className="w-full pl-12 pr-4 py-3 bg-navy-dark/50 border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors disabled:opacity-50"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={adrNaoSei}
                onChange={(e) => {
                  setAdrNaoSei(e.target.checked)
                  if (e.target.checked) setAdr("")
                }}
                className="w-5 h-5 rounded border-gold/20 bg-navy-dark/50 text-gold focus:ring-gold focus:ring-offset-0"
              />
              <span className="text-text-muted text-sm whitespace-nowrap">Não sei</span>
            </label>
          </div>
        </div>

        {/* Ocupação */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Qual sua ocupação média mensal?
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="number"
                value={ocupacao}
                onChange={(e) => {
                  setOcupacao(e.target.value)
                  setOcupacaoNaoSei(false)
                }}
                disabled={ocupacaoNaoSei}
                placeholder="65"
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-navy-dark/50 border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors disabled:opacity-50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">%</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ocupacaoNaoSei}
                onChange={(e) => {
                  setOcupacaoNaoSei(e.target.checked)
                  if (e.target.checked) setOcupacao("")
                }}
                className="w-5 h-5 rounded border-gold/20 bg-navy-dark/50 text-gold focus:ring-gold focus:ring-offset-0"
              />
              <span className="text-text-muted text-sm whitespace-nowrap">Não sei</span>
            </label>
          </div>
        </div>

        {/* Faturamento */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            Faixa de faturamento mensal médio
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {faixasFaturamento.map(faixa => (
              <button
                key={faixa.value}
                type="button"
                onClick={() => setFaturamento(faixa.value)}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  faturamento === faixa.value
                    ? "bg-gold/20 border-gold text-gold"
                    : "bg-navy-dark/50 border-gold/20 text-white hover:border-gold/50"
                }`}
              >
                {faixa.label}
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
          disabled={isSaving}
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
