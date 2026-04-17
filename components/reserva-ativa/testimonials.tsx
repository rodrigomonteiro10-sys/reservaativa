"use client"

import { useEffect, useRef } from "react"

const testimonials = [
  {
    initials: "MF",
    name: "Marcos F.",
    hotel: "Hotel Fazenda · Penedo, RJ · 52 quartos",
    quote: "Achei que sabia como estava meu hotel. O diagnóstico mostrou que eu estava perdendo quase R$ 80 mil por mês só em leads sem follow-up."
  },
  {
    initials: "AC",
    name: "Ana C.",
    hotel: "Resort de Campo · Visconde de Mauá · 65 quartos",
    quote: "O relatório chegou com números que eu nunca tinha visto no meu próprio negócio. Taxa de conversão de 12%. Eu achava que estava indo bem."
  },
  {
    initials: "RL",
    name: "Ricardo L.",
    hotel: "Pousada de Alto Padrão · Vale do Café · 38 quartos",
    quote: "Uma hora de conversa e eles enxergaram o que eu não via em três anos de operação. Profissional e direto ao ponto."
  }
]

function StarRating() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
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
    <section ref={sectionRef} className="relative bg-navy py-16 sm:py-24 overflow-hidden">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.06)_0%,_transparent_50%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase">
            Resultados Reais
          </span>
          <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-4">
            O que dizem os hoteleiros
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="animate-on-scroll bg-navy-light/40 border border-gold/20 rounded-xl p-6 backdrop-blur-sm"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <StarRating />
              
              <blockquote className="mt-4">
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
              </blockquote>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gold/10">
                <div className="w-10 h-10 bg-navy-dark rounded-full flex items-center justify-center border border-gold/30">
                  <span className="font-[var(--font-heading)] text-sm font-bold text-gold">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-text-muted text-xs">
                    {testimonial.hotel}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
