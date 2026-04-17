"use client"

import { useState, useEffect, useRef } from "react"

const faqs = [
  {
    question: "O diagnóstico tem custo?",
    answer: "O diagnóstico inicial é realizado sem comprometimento financeiro. Nosso objetivo é mostrar o potencial real do seu hotel com dados concretos — o valor que entregamos fala por si só."
  },
  {
    question: "Preciso preparar algum material antes da sessão?",
    answer: "Não é necessário nenhum preparo específico. Nossa equipe conduz toda a sessão com perguntas estruturadas. Se você tiver acesso a algum histórico de reservas ou relatório, ótimo — mas não é obrigatório."
  },
  {
    question: "A sessão pode ser feita remotamente?",
    answer: "Sim. Realizamos sessões presenciais no eixo Rio–SP (Resende, Penedo, Visconde de Mauá, Vale do Café) e também remotamente por videochamada. A qualidade do diagnóstico é a mesma."
  },
  {
    question: "Sou obrigado a contratar algo após o diagnóstico?",
    answer: "Absolutamente não. O relatório é seu, independentemente de qualquer decisão futura. Acreditamos que quando você vir os números, vai querer conversar sobre os próximos passos — mas essa decisão é sempre sua."
  },
  {
    question: "Meu hotel tem 20 quartos. É para mim?",
    answer: "Nosso perfil ideal são hotéis fazenda e resorts com 30 a 80 quartos e faturamento a partir de R$ 300k/mês. Se você está abaixo disso, pode entrar em contato — avaliamos caso a caso."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
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

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section ref={sectionRef} className="bg-offwhite py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase">
            Dúvidas Frequentes
          </span>
          <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mt-4 text-balance">
            Perguntas que todo hoteleiro faz antes de agendar
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="animate-on-scroll bg-white rounded-xl border border-gray-100 overflow-hidden"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-[var(--font-heading)] text-base sm:text-lg font-semibold text-navy pr-4">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gold/10 text-gold transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                  <p className="text-text-body text-sm sm:text-base leading-relaxed">
                    {faq.answer}
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
