-- Create leads table for Reserva Ativa
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  hotel VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  message TEXT,
  source VARCHAR(100),
  quartos VARCHAR(50),
  cidade VARCHAR(255),
  desafio VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Create hotel_diagnostico table
CREATE TABLE IF NOT EXISTS hotel_diagnostico (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  token VARCHAR(64) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'rascunho',
  categoria VARCHAR(100),
  tipo_localizacao VARCHAR(100),
  atrativos TEXT,
  publico_principal VARCHAR(100),
  canais_venda TEXT,
  canal_principal VARCHAR(100),
  adr NUMERIC(10, 2),
  adr_nao_sei BOOLEAN DEFAULT FALSE,
  ocupacao_media NUMERIC(5, 2),
  ocupacao_nao_sei BOOLEAN DEFAULT FALSE,
  faturamento_mensal VARCHAR(100),
  desafios TEXT,
  updated_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hotel_diagnostico_token ON hotel_diagnostico(token);
CREATE INDEX IF NOT EXISTS idx_hotel_diagnostico_lead_id ON hotel_diagnostico(lead_id);
