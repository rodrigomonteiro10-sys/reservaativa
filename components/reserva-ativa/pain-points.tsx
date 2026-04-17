"use client"

import { useEffect, useRef } from "react"

const painPoints = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "WhatsApp cheio, hotel vazio",
    description: "Chegam orçamentos, mas ninguém faz follow-up. O lead esfria, vai embora — e você nem sabe quantos foram."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
    title: "Ocupação só cresce no feriado",
    description: "Durante a semana e na baixa temporada, as unidades ficam vazias. A estrutura pesa, a receita some."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Booking levando sua margem",
    description: "15 a 25% de comissão por reserva que poderia ter sido direta. Todo mês, uma sangria silenciosa no caixa."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Zero visibilidade do funil",
    description: "Você não sabe sua taxa de conversão, de onde vêm os melhores clientes nem qual canal gera mais receita real."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Hóspedes que não voltam",
    description: "Sem CRM, sem estratégia de retenção. O histórico do cliente some quando o recepcionista troca de emprego."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Recepção sobrecarregada",
    description: "As mesmas pessoas que acolhem o hóspede precisam vender, fazer follow-up e ainda cuidar do operacional."
  }
]

export function PainPoints() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase">
            O diagnóstico começa aqui
          </span>
          <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mt-4 text-balance">
            Reconhece alguma dessas situações no seu hotel?
          </h2>
          <p className="text-text-body text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Se você respondeu sim para qualquer uma delas, há dinheiro sendo deixado na mesa todos os dias.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="animate-on-scroll bg-white rounded-xl p-6 border border-gray-100 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-navy/5 rounded-lg flex items-center justify-center text-navy group-hover:bg-gold/10 group-hover:text-gold transition-colors duration-300">
                {point.icon}
              </div>
              <h3 className="font-[var(--font-heading)] text-lg font-bold text-navy mt-4">
                {point.title}
              </h3>
              <p className="text-text-body text-sm sm:text-base mt-2 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
