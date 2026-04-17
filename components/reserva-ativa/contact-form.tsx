"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <section ref={sectionRef} id="diagnostico" className="relative bg-navy py-16 sm:py-24 overflow-hidden">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase">
            Agende Agora
          </span>
          <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-4 text-balance">
            Descubra quanto seu hotel está deixando na mesa
          </h2>
          <p className="text-text-muted text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Preencha o formulário. Nossa equipe entra em contato em até 24 horas para agendar sua sessão de diagnóstico.
          </p>
        </div>

        {/* Form Card */}
        <div className="animate-on-scroll bg-navy-light/40 border border-gold/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h3 className="font-[var(--font-heading)] text-xl sm:text-2xl font-bold text-white">
              Solicitar diagnóstico gratuito
            </h3>
            <p className="text-text-muted text-sm mt-2">
              Sem compromisso. Sem pressão. Com dados reais.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                  Seu nome *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-navy-dark/50 border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="João Silva"
                />
              </div>

              {/* Nome do Hotel */}
              <div>
                <label htmlFor="hotel" className="block text-white text-sm font-medium mb-2">
                  Nome do hotel *
                </label>
                <input
                  type="text"
                  id="hotel"
                  name="hotel"
                  required
                  className="w-full px-4 py-3 bg-navy-dark/50 border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="Hotel Fazenda Vista Verde"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-white text-sm font-medium mb-2">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  required
                  className="w-full px-4 py-3 bg-navy-dark/50 border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="(21) 99999-9999"
                />
              </div>

              {/* Número de Quartos */}
              <div>
                <label htmlFor="rooms" className="block text-white text-sm font-medium mb-2">
                  Número de quartos *
                </label>
                <select
                  id="rooms"
                  name="rooms"
                  required
                  className="w-full px-4 py-3 bg-navy-dark/50 border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                >
                  <option value="">Selecione</option>
                  <option value="menos-20">Menos de 20</option>
                  <option value="20-40">20–40</option>
                  <option value="40-60">40–60</option>
                  <option value="60-80">60–80</option>
                  <option value="mais-80">Mais de 80</option>
                </select>
              </div>
            </div>

            {/* Cidade */}
            <div>
              <label htmlFor="city" className="block text-white text-sm font-medium mb-2">
                Cidade / Região do hotel
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="w-full px-4 py-3 bg-navy-dark/50 border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                placeholder="Penedo, RJ"
              />
            </div>

            {/* Desafio */}
            <div>
              <label htmlFor="challenge" className="block text-white text-sm font-medium mb-2">
                Qual é o seu maior desafio hoje?
              </label>
              <select
                id="challenge"
                name="challenge"
                className="w-full px-4 py-3 bg-navy-dark/50 border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
              >
                <option value="">Selecione</option>
                <option value="leads">Leads no WhatsApp que não convertem</option>
                <option value="otas">Dependência das OTAs</option>
                <option value="ocupacao">Ocupação baixa na semana/baixa temporada</option>
                <option value="conversao">Não sei minha taxa de conversão real</option>
                <option value="recepcao">Recepção sobrecarregada</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitted || isSubmitting}
              className={`w-full font-[var(--font-heading)] font-bold text-base sm:text-lg py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                submitted
                  ? "bg-green-500 text-white cursor-default"
                  : "bg-gold hover:bg-gold-light text-navy hover:shadow-xl hover:shadow-gold/30"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </>
              ) : submitted ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Solicitação enviada! Entraremos em contato em breve.
                </>
              ) : (
                <>
                  Quero meu diagnóstico gratuito
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>

            {/* Privacy notice */}
            <p className="text-text-muted text-xs sm:text-sm text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Seus dados são confidenciais e não serão compartilhados.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
