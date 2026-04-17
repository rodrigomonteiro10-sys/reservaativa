export function Hero() {
  return (
    <section className="relative min-h-screen bg-navy overflow-hidden">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Column - Text */}
          <div className="space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-navy-light/50 border border-gold/20 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse-dot" />
              <span className="text-gold text-xs sm:text-sm font-medium tracking-wide uppercase">
                Raio-X Comercial · Diagnóstico
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-[var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              Seu hotel poderia{" "}
              <span className="text-gold">faturar muito mais.</span>
              <br />
              A gente prova com dados.
            </h1>

            {/* Subtitle */}
            <p className="text-text-muted text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl">
              Em uma sessão de 2–3 horas, mapeamos o funil do seu hotel, calculamos a receita que você está deixando na mesa e entregamos um relatório completo com os gaps e oportunidades reais.
            </p>

            {/* CTA */}
            <div className="space-y-3">
              <a
                href="#diagnostico"
                className="inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-navy font-[var(--font-heading)] font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-200 hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5"
              >
                Quero meu diagnóstico gratuito
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <p className="text-text-muted text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sem compromisso. Com dados reais do seu hotel.
              </p>
            </div>
          </div>

          {/* Right Column - Stats Card */}
          <div className="animate-fade-in-right">
            <div className="bg-navy-light/40 border border-gold/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <span className="text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase">
                O que você vai descobrir
              </span>

              <div className="mt-6 space-y-6">
                {/* Stat 1 */}
                <div className="flex gap-4 border-l-2 border-gold pl-4">
                  <div>
                    <span className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-gold">73%</span>
                    <p className="text-white/80 text-sm sm:text-base mt-1">
                      dos orçamentos enviados pelo WhatsApp nunca viram reserva
                    </p>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex gap-4 border-l-2 border-gold pl-4">
                  <div>
                    <span className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-gold">18–25%</span>
                    <p className="text-white/80 text-sm sm:text-base mt-1">
                      do faturamento vai embora em comissão de OTA desnecessariamente
                    </p>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex gap-4 border-l-2 border-gold pl-4">
                  <div>
                    <span className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-gold">R$ 0</span>
                    <p className="text-white/80 text-sm sm:text-base mt-1">
                      de follow-up ativo. A recepção espera. O lead esfria.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div className="mt-8 pt-6 border-t border-gold/20">
                <p className="text-gold/90 text-sm sm:text-base font-medium italic text-center">
                  &quot;Da prospecção ao check-out. Do dado à decisão.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
