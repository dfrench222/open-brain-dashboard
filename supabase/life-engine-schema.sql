-- Life Engine Schema v1.0
-- Supabase project: ybaqownpbpmdstjlqejn
-- Deploy via: python3 deploy-life-engine-schema.py <supabase_access_token>
-- Or paste into Supabase Dashboard SQL Editor

-- ============================================================
-- engine_cycles — tracks every Life Engine run
-- ============================================================
CREATE TABLE IF NOT EXISTS engine_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_type TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  sources_synced TEXT[],
  items_written INT DEFAULT 0,
  ai_analysis TEXT,
  errors JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- life_engine_briefings — AI-generated daily briefings
-- ============================================================
CREATE TABLE IF NOT EXISTS life_engine_briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_type TEXT NOT NULL,
  briefing_date DATE NOT NULL,
  title TEXT,
  narrative TEXT,
  action_items JSONB DEFAULT '[]',
  follow_ups JSONB DEFAULT '[]',
  decisions JSONB DEFAULT '[]',
  schedule JSONB DEFAULT '[]',
  suggestions JSONB DEFAULT '[]',
  insights JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- synced_tasks — ClickUp + Notion tasks
-- ============================================================
CREATE TABLE IF NOT EXISTS synced_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('clickup', 'notion')),
  title TEXT NOT NULL,
  status TEXT,
  priority TEXT,
  due_date TIMESTAMPTZ,
  assignees JSONB DEFAULT '[]',
  list_name TEXT,
  workspace TEXT NOT NULL,
  external_url TEXT,
  ai_analysis TEXT,
  is_overdue BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  raw_data JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(external_id, source)
);

-- ============================================================
-- synced_messages — Slack (JL + PG workspaces)
-- ============================================================
CREATE TABLE IF NOT EXISTS synced_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('slack_jl', 'slack_pg')),
  channel_name TEXT,
  channel_id TEXT,
  sender_name TEXT,
  preview TEXT,
  full_text TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  workspace TEXT NOT NULL,
  tier INT DEFAULT 3,
  ai_summary TEXT,
  ai_action_needed BOOLEAN DEFAULT FALSE,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(external_id)
);

-- ============================================================
-- synced_calendar_events — Google Calendar events
-- ============================================================
CREATE TABLE IF NOT EXISTS synced_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  location TEXT,
  attendees JSONB DEFAULT '[]',
  workspace TEXT NOT NULL,
  ai_prep_notes TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(external_id)
);

-- ============================================================
-- life_engine_checkins — mood/energy tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS life_engine_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  value INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- life_engine_evolution — self-improvement proposals
-- ============================================================
CREATE TABLE IF NOT EXISTS life_engine_evolution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposed_change TEXT NOT NULL,
  reason TEXT,
  approved BOOLEAN,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- life_engine_habits — habit definitions
-- ============================================================
CREATE TABLE IF NOT EXISTS life_engine_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  frequency TEXT,
  time_of_day TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- life_engine_habit_log — habit completion tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS life_engine_habit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES life_engine_habits(id),
  completed_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE engine_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_engine_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_engine_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_engine_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_engine_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_engine_habit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies — service role full access
-- ============================================================
CREATE POLICY "Service role full access" ON engine_cycles FOR ALL USING (true);
CREATE POLICY "Service role full access" ON life_engine_briefings FOR ALL USING (true);
CREATE POLICY "Service role full access" ON synced_tasks FOR ALL USING (true);
CREATE POLICY "Service role full access" ON synced_messages FOR ALL USING (true);
CREATE POLICY "Service role full access" ON synced_calendar_events FOR ALL USING (true);
CREATE POLICY "Service role full access" ON life_engine_checkins FOR ALL USING (true);
CREATE POLICY "Service role full access" ON life_engine_evolution FOR ALL USING (true);
CREATE POLICY "Service role full access" ON life_engine_habits FOR ALL USING (true);
CREATE POLICY "Service role full access" ON life_engine_habit_log FOR ALL USING (true);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_engine_cycles_started ON engine_cycles(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefings_date ON life_engine_briefings(briefing_date DESC);
CREATE INDEX IF NOT EXISTS idx_synced_tasks_source ON synced_tasks(source);
CREATE INDEX IF NOT EXISTS idx_synced_tasks_active ON synced_tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_synced_tasks_due ON synced_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_synced_messages_source ON synced_messages(source);
CREATE INDEX IF NOT EXISTS idx_synced_messages_tier ON synced_messages(tier);
CREATE INDEX IF NOT EXISTS idx_synced_messages_timestamp ON synced_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_synced_calendar_start ON synced_calendar_events(start_time);

-- ============================================================
-- Updated_at triggers for tables with updated_at columns
-- ============================================================
CREATE TRIGGER IF NOT EXISTS set_updated_at_life_engine_briefings
  BEFORE UPDATE ON life_engine_briefings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS set_updated_at_synced_tasks
  BEFORE UPDATE ON synced_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
