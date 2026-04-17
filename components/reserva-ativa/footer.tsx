export function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-gold/20 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="inline-flex flex-col items-center">
          <span className="font-[var(--font-heading)] font-bold text-xl sm:text-2xl tracking-wide text-white">
            RESERVA <span className="text-gold">ATIVA</span>
          </span>
          <span className="text-[10px] sm:text-xs tracking-[0.2em] text-gold/70 uppercase mt-1">
            Hospitality Intelligence
          </span>
        </div>

        {/* Tagline */}
        <p className="text-text-muted text-sm sm:text-base mt-6 italic">
          &quot;Da prospecção ao check-out. Do dado à decisão.&quot;
        </p>

        {/* Copyright */}
        <p className="text-text-muted/60 text-xs sm:text-sm mt-6">
          © {new Date().getFullYear()} Reserva Ativa. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
