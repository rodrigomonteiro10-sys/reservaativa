"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { StepIndicator } from "./step-indicator"
import { Step1Categoria } from "./steps/step1-categoria"
import { Step2Publico } from "./steps/step2-publico"
import { Step3Canais } from "./steps/step3-canais"
import { Step4Numeros } from "./steps/step4-numeros"
import { Step5Desafios } from "./steps/step5-desafios"

export interface DiagnosticoData {
  // Lead info
  name?: string
  hotel?: string
  email?: string
  phone?: string
  // Step 1 - Categoria
  categoria?: string
  tipo_localizacao?: string
  atrativos?: string[]
  // Step 2 - Público
  publico_principal?: string
  // Step 3 - Canais
  canais_venda?: string[]
  canal_principal?: string
  // Step 4 - Números
  adr?: number | null
  adr_nao_sei?: boolean
  ocupacao_media?: number | null
  ocupacao_nao_sei?: boolean
  faturamento_mensal?: string
  // Step 5 - Desafios
  desafios?: string[]
}

interface DiagnosticoWizardProps {
  token: string
}

const TOTAL_STEPS = 5

export function DiagnosticoWizard({ token }: DiagnosticoWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<DiagnosticoData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch existing data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/diagnostico/${token}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError("Diagnóstico não encontrado. Verifique o link ou solicite um novo.")
            return
          }
          throw new Error("Erro ao carregar dados")
        }
        const result = await response.json()
        
        // Parse arrays from strings if needed
        const parsedData: DiagnosticoData = {
          name: result.name,
          hotel: result.hotel,
          email: result.email,
          phone: result.phone,
          categoria: result.categoria,
          tipo_localizacao: result.tipo_localizacao,
          atrativos: result.atrativos ? JSON.parse(result.atrativos) : [],
          publico_principal: result.publico_principal,
          canais_venda: result.canais_venda ? JSON.parse(result.canais_venda) : [],
          canal_principal: result.canal_principal,
          adr: result.adr ? parseFloat(result.adr) : null,
          adr_nao_sei: result.adr_nao_sei,
          ocupacao_media: result.ocupacao_media ? parseFloat(result.ocupacao_media) : null,
          ocupacao_nao_sei: result.ocupacao_nao_sei,
          faturamento_mensal: result.faturamento_mensal,
          desafios: result.desafios ? JSON.parse(result.desafios) : [],
        }
        setData(parsedData)
      } catch (err) {
        console.error("Error fetching diagnostico:", err)
        setError("Erro ao carregar diagnóstico. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [token])

  const saveStepData = async (stepData: Partial<DiagnosticoData>, isComplete = false) => {
    setIsSaving(true)
    try {
      // Prepare data for API - convert arrays to JSON strings
      const apiData: Record<string, unknown> = { ...stepData }
      
      if (stepData.atrativos) {
        apiData.atrativos = JSON.stringify(stepData.atrativos)
      }
      if (stepData.canais_venda) {
        apiData.canais_venda = JSON.stringify(stepData.canais_venda)
      }
      if (stepData.desafios) {
        apiData.desafios = JSON.stringify(stepData.desafios)
      }
      
      if (isComplete) {
        apiData.status = "completo"
      }

      const response = await fetch(`/api/diagnostico/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar dados")
      }

      // Update local state
      setData(prev => ({ ...prev, ...stepData }))
      
      return true
    } catch (err) {
      console.error("Error saving step data:", err)
      setError("Erro ao salvar. Tente novamente.")
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleNext = async (stepData: Partial<DiagnosticoData>) => {
    const saved = await saveStepData(stepData)
    if (saved && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
      setError(null)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setError(null)
    }
  }

  const handleComplete = async (stepData: Partial<DiagnosticoData>) => {
    const saved = await saveStepData(stepData, true)
    if (saved) {
      router.push(`/diagnostico/${token}/obrigado`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white text-lg">Carregando diagnóstico...</p>
        </div>
      </div>
    )
  }

  if (error && !data.hotel) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="bg-navy-light/40 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-white text-xl font-bold mb-2">Ops!</h2>
          <p className="text-text-muted">{error}</p>
          <a href="/" className="inline-block mt-6 px-6 py-3 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition-colors">
            Voltar para o início
          </a>
        </div>
      </div>
    )
  }

  const stepProps = {
    data,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onComplete: handleComplete,
    isSaving,
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="bg-navy-dark/50 border-b border-gold/20 py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div>
            <span className="text-gold font-semibold text-sm">Reserva Ativa</span>
            <h1 className="text-white text-lg font-bold">Diagnóstico do Hotel</h1>
          </div>
          <div className="text-right">
            <p className="text-text-muted text-sm">Hotel:</p>
            <p className="text-white font-medium">{data.hotel || "—"}</p>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Step Content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-center">
            {error}
          </div>
        )}

        {currentStep === 1 && <Step1Categoria {...stepProps} />}
        {currentStep === 2 && <Step2Publico {...stepProps} />}
        {currentStep === 3 && <Step3Canais {...stepProps} />}
        {currentStep === 4 && <Step4Numeros {...stepProps} />}
        {currentStep === 5 && <Step5Desafios {...stepProps} />}
      </main>
    </div>
  )
}
