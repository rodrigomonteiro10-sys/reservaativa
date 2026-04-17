"use client"

import { useState, useEffect } from "react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-navy/95 backdrop-blur-md border-b border-gold/20" 
          : "bg-navy/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex flex-col">
            <span className="font-[var(--font-heading)] font-bold text-lg sm:text-xl tracking-wide text-white">
              RESERVA <span className="text-gold">ATIVA</span>
            </span>
            <span className="text-[10px] sm:text-xs tracking-[0.2em] text-gold/70 uppercase">
              Hospitality Intelligence
            </span>
          </div>

          {/* CTA Button */}
          <a
            href="#diagnostico"
            className="hidden sm:inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-[var(--font-heading)] font-bold text-sm px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold/20"
          >
            Quero meu diagnóstico
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  )
}
