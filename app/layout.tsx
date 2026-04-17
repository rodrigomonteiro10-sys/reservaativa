import type { Metadata } from 'next'
import { Montserrat, Open_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-heading'
});

const openSans = Open_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Reserva Ativa | Raio-X Comercial — Diagnóstico para Hotéis Fazenda',
  description: 'Descubra quanto seu hotel fazenda está deixando na mesa. Diagnóstico comercial completo com dados reais do seu negócio.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-offwhite">
      <body className={`${montserrat.variable} ${openSans.variable} font-sans antialiased overflow-x-hidden`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
