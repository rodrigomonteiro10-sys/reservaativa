"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Check if already authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/admin/leads?limit=1')
        if (response.ok) {
          router.replace('/admin/leads')
        }
      } catch {
        // Not authenticated, show login form
      } finally {
        setIsChecking(false)
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro na autenticação')
      }

      router.push('/admin/leads')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na autenticação')
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-navy-light/40 border border-gold/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <span className="text-gold font-semibold text-sm">Reserva Ativa</span>
            <h1 className="text-white text-2xl font-bold mt-2">Área Administrativa</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-navy-dark/50 border border-gold/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                placeholder="Digite a senha"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-navy border-t-transparent rounded-full" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
