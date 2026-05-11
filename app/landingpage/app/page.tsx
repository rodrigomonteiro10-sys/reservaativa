import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reserva Ativa App — CRM + IA para hotéis-fazenda',
  description: 'Atenda leads 24h pelo WhatsApp, Instagram e site. IA que qualifica, engaja e escalona. CRM completo para sua equipe de vendas.',
}

export default function AppLandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <a href="/" className="text-xl font-bold text-navy">Reserva Ativa</a>
        <a
          href="https://app.reservaativa.com/gestao"
          className="text-sm text-gray-500 hover:text-navy transition-colors"
        >
          Acesso da equipe →
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          CRM + IA para hotéis-fazenda
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-6">
          Seu hotel responde leads<br />
          <span className="text-gold">24h por dia, sem esforço</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          A IA da Reserva Ativa atende pelo WhatsApp, Instagram e site —
          qualifica, engaja e escalona para o vendedor fechar. Você acompanha
          tudo em tempo real no CRM.
        </p>
        <a
          href="https://wa.me/5524999720763?text=Quero+conhecer+a+Reserva+Ativa+App"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gold hover:bg-gold-dark text-navy font-semibold px-8 py-4 rounded-lg text-base transition-colors"
        >
          Agendar demonstração
        </a>
        <p className="text-sm text-gray-400 mt-4">Sem contrato. Sem taxa de setup.</p>
      </section>

      {/* Como funciona */}
      <section className="bg-gray-50 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-navy text-center mb-12">
            Do primeiro contato à reserva confirmada
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Lead entra em contato',
                desc: 'Pelo WhatsApp, Instagram ou widget do site. A IA responde em segundos, qualquer horário.',
              },
              {
                step: '02',
                title: 'IA qualifica e engaja',
                desc: 'Entende o perfil, apresenta o hotel, tira dúvidas e conduz o lead até o momento certo.',
              },
              {
                step: '03',
                title: 'Vendedor fecha a reserva',
                desc: 'Quando o lead está pronto, a IA escalona para o vendedor com todo o contexto da conversa.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-gold mb-4">{item.step}</div>
                <h3 className="font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-navy text-center mb-12">
            O que você ganha
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🕐', title: 'Atendimento 24/7', desc: 'Nenhum lead fica sem resposta — nem de madrugada, nem no fim de semana.' },
              { icon: '📊', title: 'CRM completo', desc: 'Pipeline visual, histórico de cada lead, notas, atividades e relatórios.' },
              { icon: '🔔', title: 'Alertas de escalação', desc: 'Quando o lead está quente, você recebe no WhatsApp e age na hora.' },
              { icon: '📱', title: 'Multi-canal', desc: 'WhatsApp, Instagram e widget do site — tudo centralizado em um lugar.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-gold transition-colors">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-navy mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-navy py-16 px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Pronto para ter uma IA no seu time de vendas?
        </h2>
        <p className="text-blue-200 mb-8 max-w-lg mx-auto">
          Mostramos o sistema funcionando com os dados do seu hotel em uma demo de 20 minutos.
        </p>
        <a
          href="https://wa.me/5524999720763?text=Quero+conhecer+a+Reserva+Ativa+App"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gold hover:bg-gold-dark text-navy font-semibold px-8 py-4 rounded-lg text-base transition-colors"
        >
          Falar com a equipe
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 text-center text-sm text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} Reserva Ativa — CRM inteligente para hotéis-fazenda
      </footer>
    </main>
  )
}
