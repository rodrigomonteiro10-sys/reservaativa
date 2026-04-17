-- Create leads table for Reserva Ativa
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  hotel VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  rooms VARCHAR(50) NOT NULL,
  city VARCHAR(255),
  challenge VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
