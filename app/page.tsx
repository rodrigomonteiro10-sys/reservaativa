import { Navbar } from "@/components/reserva-ativa/navbar"
import { Hero } from "@/components/reserva-ativa/hero"
import { PainPoints } from "@/components/reserva-ativa/pain-points"
import { WhatIs } from "@/components/reserva-ativa/what-is"
import { HowItWorks } from "@/components/reserva-ativa/how-it-works"
import { ForWhom } from "@/components/reserva-ativa/for-whom"
import { Testimonials } from "@/components/reserva-ativa/testimonials"
import { FAQ } from "@/components/reserva-ativa/faq"
import { ContactForm } from "@/components/reserva-ativa/contact-form"
import { Footer } from "@/components/reserva-ativa/footer"

export default function ReservaAtivaLanding() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PainPoints />
      <WhatIs />
      <HowItWorks />
      <ForWhom />
      <Testimonials />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  )
}
