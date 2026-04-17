import Link from "next/link"

export default async function ObrigadoPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="font-[var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
          Diagnóstico enviado com sucesso!
        </h1>

        {/* Description */}
        <p className="text-text-muted text-lg mb-8">
          Obrigado por preencher o diagnóstico. Nossa equipe irá analisar as informações e entrar em contato em até <strong className="text-gold">24 horas</strong> para agendar sua reunião estratégica.
        </p>

        {/* What happens next */}
        <div className="bg-navy-light/40 border border-gold/30 rounded-2xl p-6 mb-8 text-left">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            O que acontece agora?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-gold/20 text-gold rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
              <span className="text-text-muted">Vamos analisar os dados do seu hotel</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-gold/20 text-gold rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
              <span className="text-text-muted">Entraremos em contato via WhatsApp ou e-mail</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-gold/20 text-gold rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
              <span className="text-text-muted">Agendaremos sua reunião estratégica de ~1 hora</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para o início
        </Link>

        {/* Contact info */}
        <p className="text-text-muted text-sm mt-8">
          Dúvidas? Entre em contato pelo WhatsApp: <a href="https://wa.me/5524999720763" className="text-gold hover:underline">(24) 99972-0763</a>
        </p>
      </div>
    </div>
  )
}
