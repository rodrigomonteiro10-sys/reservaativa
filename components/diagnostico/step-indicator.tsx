"use client"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const stepNames = [
  "Seu Hotel",
  "Público",
  "Canais",
  "Números",
  "Desafios"
]

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-navy-light rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step labels - desktop */}
      <div className="hidden sm:flex justify-between">
        {stepNames.map((name, index) => {
          const stepNum = index + 1
          const isActive = stepNum === currentStep
          const isCompleted = stepNum < currentStep

          return (
            <div key={name} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-gold text-navy"
                    : isActive
                    ? "bg-gold/20 text-gold border-2 border-gold"
                    : "bg-navy-light text-text-muted"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  isActive ? "text-gold" : isCompleted ? "text-white" : "text-text-muted"
                }`}
              >
                {name}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile - current step indicator */}
      <div className="sm:hidden text-center">
        <span className="text-gold font-semibold">Etapa {currentStep}</span>
        <span className="text-text-muted"> de {totalSteps}</span>
        <p className="text-white font-medium mt-1">{stepNames[currentStep - 1]}</p>
      </div>
    </div>
  )
}
