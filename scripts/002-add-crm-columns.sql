-- Add CRM columns to leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS crm_status VARCHAR(50) DEFAULT 'novo',
  ADD COLUMN IF NOT EXISTS crm_notes TEXT;

-- Index for CRM status filtering
CREATE INDEX IF NOT EXISTS idx_leads_crm_status ON leads(crm_status);
