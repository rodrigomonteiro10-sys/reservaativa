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
  -- CRM fields
  crm_stage VARCHAR(50) DEFAULT 'novo',
  crm_priority VARCHAR(20) DEFAULT 'media',
  crm_assigned_to VARCHAR(255),
  crm_next_contact TIMESTAMP WITH TIME ZONE,
  crm_expected_value NUMERIC(10, 2),
  crm_lost_reason TEXT,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_crm_stage ON leads(crm_stage);

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

-- CRM: lead activities log
CREATE TABLE IF NOT EXISTS lead_activities (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  created_by VARCHAR(255) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);

-- CRM: lead notes
CREATE TABLE IF NOT EXISTS lead_notes (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by VARCHAR(255) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);

-- CRM: stage change history
CREATE TABLE IF NOT EXISTS lead_stage_history (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  from_stage VARCHAR(50),
  to_stage VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255) DEFAULT 'admin',
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_stage_history_lead_id ON lead_stage_history(lead_id);
