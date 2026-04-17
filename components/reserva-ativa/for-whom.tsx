"use client"

import { useEffect, useRef } from "react"

const personas = [
  {
    initials: "RO",
    name: "Roberto Oliveira",
    role: "Dono de Hotel Fazenda · 45 quartos · Penedo, RJ",
    quote: "Chega bastante gente no WhatsApp, mas no fim do mês o hotel não está tão cheio quanto deveria.",
    result: "Quer provas concretas, não promessas — recebe dados reais do próprio negócio",
    resultIcon: "🎯"
  },
  {
    initials: "CS",
    name: "Camila Souza",
    role: "Gestora de Resort · 60 quartos · Vale do Café, RJ",
    quote: "Eu sei que a gente tem potencial para faturar muito mais. O problema é que não tenho estrutura para dar conta de tudo.",
    result: "Quer dados e dashboard — recebe relatório profissional para apresentar ao sócio",
    resultIcon: "📊"
  }
]

export function ForWhom() {
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
    <section ref={sectionRef} className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase">
            Para quem é
          </span>
          <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mt-4 text-balance">
            Feito para donos e gestores de hotéis fazenda e resorts
          </h2>
        </div>

        {/* Personas Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {personas.map((persona, index) => (
            <div
              key={index}
              className="animate-on-scroll bg-offwhite rounded-2xl p-6 sm:p-8 border border-gray-100"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Avatar and Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-navy rounded-full flex items-center justify-center border-2 border-gold">
                  <span className="font-[var(--font-heading)] text-lg sm:text-xl font-bold text-gold">
                    {persona.initials}
                  </span>
                </div>
                <div>
                  <h3 className="font-[var(--font-heading)] text-lg font-bold text-navy">
                    {persona.name}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {persona.role}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="relative pl-4 border-l-2 border-gold">
                <p className="text-text-body text-base sm:text-lg italic leading-relaxed">
                  &quot;{persona.quote}&quot;
                </p>
              </blockquote>

              {/* Result Tag */}
              <div className="mt-6 flex items-start gap-2 bg-gold/10 rounded-lg p-4">
                <span className="text-xl">{persona.resultIcon}</span>
                <p className="text-navy text-sm sm:text-base font-medium">
                  {persona.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
