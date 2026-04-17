"use client"

import { useEffect, useRef } from "react"

const deliverables = [
  {
    number: "01",
    title: "Taxa de conversão atual",
    description: "Quantos leads entram e quantos de fato viram reservas pagas"
  },
  {
    number: "02",
    title: "Onde os leads morrem",
    description: "Mapeamos exatamente em qual etapa do funil você perde mais dinheiro"
  },
  {
    number: "03",
    title: "Receita oculta calculada",
    description: "Um número real: quanto você está deixando de ganhar por mês"
  },
  {
    number: "04",
    title: "Benchmarks do setor",
    description: "Como seu hotel se compara com os melhores hotéis fazenda do eixo Rio–SP"
  },
  {
    number: "05",
    title: "Relatório Potencial Oculto",
    description: "Documento completo com diagnóstico, gaps e o caminho para destravar"
  }
]

export function WhatIs() {
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_60%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase">
            Raio-X Comercial
          </span>
          <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-4 text-balance">
            Uma sessão. Um relatório.{" "}
            <span className="text-gold">Toda a clareza que você precisa.</span>
          </h2>
          <p className="text-text-muted text-base sm:text-lg mt-4 max-w-3xl mx-auto">
            Em 2–3 horas, mapeamos o funil comercial do seu hotel do zero. Sem achismo. Sem promessa vaga. Você recebe dados reais do seu negócio.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverables.map((item, index) => (
            <div
              key={index}
              className={`animate-on-scroll relative bg-navy-light/30 border border-gold/20 rounded-xl p-6 backdrop-blur-sm ${
                index === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Large number background */}
              <span className="absolute top-4 right-4 font-[var(--font-heading)] text-5xl sm:text-6xl font-bold text-gold/10">
                {item.number}
              </span>
              
              <div className="relative">
                <h3 className="font-[var(--font-heading)] text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm sm:text-base mt-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="animate-on-scroll mt-12 sm:mt-16 bg-navy-light/40 border border-gold/30 rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-white text-base sm:text-lg mb-6">
            Ao final, você sabe exatamente{" "}
            <span className="text-gold font-semibold">o quanto está perdendo</span> e o que fazer para recuperar.
          </p>
          <a
            href="#diagnostico"
            className="inline-flex items-center gap-3 bg-gold hover:bg-gold-light text-navy font-[var(--font-heading)] font-bold text-base px-6 sm:px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-xl hover:shadow-gold/30"
          >
            Agendar diagnóstico
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
