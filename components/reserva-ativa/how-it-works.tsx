"use client"

import { useEffect, useRef } from "react"

const steps = [
  {
    number: 1,
    title: "Você agenda a sessão",
    description: "Preenche o formulário, equipe entra em contato em até 24h. Presencial ou remoto — você escolhe.",
    tag: "5 minutos para agendar",
    tagIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    number: 2,
    title: "Sessão de diagnóstico: 2–3 horas",
    description: "Mergulhamos no funil comercial. Analisamos canais, conversão, processos de follow-up e como a equipe lida com os leads.",
    tag: "100% baseado em dados do seu hotel",
    tagIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    number: 3,
    title: "Você recebe o Relatório Potencial Oculto",
    description: "Em até 5 dias úteis, relatório completo com diagnóstico, benchmarks, cálculo de receita não capturada e recomendações.",
    tag: "Relatório profissional completo",
    tagIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    number: 4,
    title: "Você decide o próximo passo",
    description: "Com os dados em mãos, clareza total para decidir. Sem pressão. Sem obrigação.",
    tag: "Sem compromisso após o diagnóstico",
    tagIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-offwhite py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase">
            Processo
          </span>
          <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mt-4">
            Como funciona o Raio-X Comercial
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold to-gold/20" />

          <div className="space-y-8 sm:space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="animate-on-scroll relative flex gap-6 sm:gap-8"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Number circle */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/30">
                  <span className="font-[var(--font-heading)] text-lg sm:text-xl font-bold text-navy">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-[var(--font-heading)] text-lg sm:text-xl font-bold text-navy">
                    {step.title}
                  </h3>
                  <p className="text-text-body text-sm sm:text-base mt-2 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="inline-flex items-center gap-2 mt-4 bg-gold/10 text-gold-dark px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                    {step.tagIcon}
                    {step.tag}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
