-- Open Brain Schema v1.0
-- Supabase project: ybaqownpbpmdstjlqejn
-- Deploy via Supabase Dashboard SQL Editor or psql

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- thoughts table (core knowledge store)
-- ============================================================
CREATE TABLE IF NOT EXISTS thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  workspace TEXT NOT NULL CHECK (workspace IN ('jumm-life', 'performance-golf', 'shared')),
  namespace TEXT,
  source TEXT,
  source_ref TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_thoughts_workspace ON thoughts(workspace);
CREATE INDEX IF NOT EXISTS idx_thoughts_namespace ON thoughts(namespace);
CREATE INDEX IF NOT EXISTS idx_thoughts_source ON thoughts(source);
CREATE INDEX IF NOT EXISTS idx_thoughts_metadata ON thoughts USING gin (metadata);
CREATE INDEX IF NOT EXISTS idx_thoughts_created_at ON thoughts(created_at DESC);

-- ============================================================
-- finances table
-- ============================================================
CREATE TABLE IF NOT EXISTS finances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'restitution', 'investment', 'transfer')),
  category TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  date DATE NOT NULL,
  description TEXT,
  source TEXT,
  source_ref TEXT,
  workspace TEXT NOT NULL DEFAULT 'jumm-life',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finances_type ON finances(type);
CREATE INDEX IF NOT EXISTS idx_finances_category ON finances(category);
CREATE INDEX IF NOT EXISTS idx_finances_date ON finances(date DESC);
CREATE INDEX IF NOT EXISTS idx_finances_workspace ON finances(workspace);

-- ============================================================
-- people table
-- ============================================================
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  relationship TEXT,
  workspace TEXT[],
  phone TEXT,
  email TEXT,
  location TEXT,
  role TEXT,
  notes TEXT,
  last_interaction TIMESTAMPTZ,
  interaction_count INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_people_name ON people(name);
CREATE INDEX IF NOT EXISTS idx_people_relationship ON people(relationship);

-- ============================================================
-- projects table
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  workspace TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  owner TEXT,
  description TEXT,
  due_date DATE,
  source TEXT,
  source_ref TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);

-- ============================================================
-- metrics table
-- ============================================================
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value DECIMAL(15,4),
  unit TEXT,
  date DATE NOT NULL,
  workspace TEXT NOT NULL,
  source TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_metrics_type_date ON metrics(metric_type, date DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_workspace ON metrics(workspace);

-- ============================================================
-- events table
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  location TEXT,
  workspace TEXT NOT NULL,
  source TEXT,
  source_ref TEXT,
  attendees TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_events_workspace ON events(workspace);

-- ============================================================
-- audit_log table
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- ============================================================
-- daily_quotes table (Morning Anchor feature)
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_text TEXT NOT NULL,
  source_title TEXT,
  source_author TEXT DEFAULT 'Kevin Trudeau',
  category TEXT,
  used_on DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_quotes_used_on ON daily_quotes(used_on);
CREATE INDEX IF NOT EXISTS idx_daily_quotes_category ON daily_quotes(category);

-- ============================================================
-- Row Level Security (RLS) policies
-- Enable RLS on all tables but allow service_role full access
-- ============================================================
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;

-- Service role bypass policies (allows API access with service_role key)
CREATE POLICY "Service role full access" ON thoughts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON finances FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON people FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON audit_log FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON daily_quotes FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- Updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_thoughts
  BEFORE UPDATE ON thoughts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_people
  BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
