"use client"

import { useState } from "react"
import type { DiagnosticoData } from "../wizard"

interface StepProps {
  data: DiagnosticoData
  onNext: (data: Partial<DiagnosticoData>) => void
  isSaving: boolean
}

const categorias = [
  { value: "hotel_fazenda", label: "Hotel Fazenda" },
  { value: "pousada", label: "Pousada" },
  { value: "resort", label: "Resort" },
  { value: "hotel_urbano", label: "Hotel Urbano" },
  { value: "hotel_praia", label: "Hotel de Praia" },
  { value: "hostel", label: "Hostel" },
  { value: "outro", label: "Outro" },
]

const localizacoes = [
  { value: "serra", label: "Serra / Montanha" },
  { value: "praia", label: "Praia / Litoral" },
  { value: "campo", label: "Campo / Rural" },
  { value: "urbano", label: "Urbano / Cidade" },
  { value: "ecoturismo", label: "Ecoturismo / Natureza" },
]

const atrativos = [
  { value: "piscina", label: "Piscina" },
  { value: "spa", label: "SPA / Wellness" },
  { value: "restaurante", label: "Restaurante próprio" },
  { value: "eventos", label: "Espaço para eventos" },
  { value: "aventura", label: "Atividades de aventura" },
  { value: "kids", label: "Área kids / lazer infantil" },
  { value: "pet_friendly", label: "Pet friendly" },
  { value: "cavalos", label: "Passeio a cavalo" },
  { value: "trilhas", label: "Trilhas / Ecoturismo" },
]

export function Step1Categoria({ data, onNext, isSaving }: StepProps) {
  const [categoria, setCategoria] = useState(data.categoria || "")
  const [tipoLocalizacao, setTipoLocalizacao] = useState(data.tipo_localizacao || "")
  const [selectedAtrativos, setSelectedAtrativos] = useState<string[]>(data.atrativos || [])

  const toggleAtrativo = (value: string) => {
    setSelectedAtrativos(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const handleSubmit = () => {
    if (!categoria || !tipoLocalizacao) return
    onNext({
      categoria,
      tipo_localizacao: tipoLocalizacao,
      atrativos: selectedAtrativos,
    })
  }

  const isValid = categoria && tipoLocalizacao

  return (
    <div className="bg-navy-light/40 border border-gold/30 rounded-2xl p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Sobre o seu hotel</h2>
        <p className="text-text-muted">Nos conte um pouco sobre o perfil do seu estabelecimento.</p>
      </div>

      <div className="space-y-6">
        {/* Categoria */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            Qual a categoria do seu hotel? *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categorias.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategoria(cat.value)}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  categoria === cat.value
                    ? "bg-gold/20 border-gold text-gold"
                    : "bg-navy-dark/50 border-gold/20 text-white hover:border-gold/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Localização */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            Onde está localizado? *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {localizacoes.map(loc => (
              <button
                key={loc.value}
                type="button"
                onClick={() => setTipoLocalizacao(loc.value)}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  tipoLocalizacao === loc.value
                    ? "bg-gold/20 border-gold text-gold"
                    : "bg-navy-dark/50 border-gold/20 text-white hover:border-gold/50"
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Atrativos */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            Quais atrativos seu hotel oferece? (opcional)
          </label>
          <div className="flex flex-wrap gap-2">
            {atrativos.map(atr => (
              <button
                key={atr.value}
                type="button"
                onClick={() => toggleAtrativo(atr.value)}
                className={`px-3 py-2 rounded-full border text-sm transition-all ${
                  selectedAtrativos.includes(atr.value)
                    ? "bg-gold/20 border-gold text-gold"
                    : "bg-navy-dark/50 border-gold/20 text-text-muted hover:text-white hover:border-gold/50"
                }`}
              >
                {atr.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-end">
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
