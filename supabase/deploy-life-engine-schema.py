#!/usr/bin/env python3
"""Deploy Life Engine schema to Supabase via Management API using curl."""

import json
import subprocess
import sys

PROJECT_REF = "ybaqownpbpmdstjlqejn"
API_URL = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"

ACCESS_TOKEN = sys.argv[1] if len(sys.argv) > 1 else None
if not ACCESS_TOKEN:
    print("Usage: python3 deploy-life-engine-schema.py <access_token>")
    print()
    print("Get your access token from: https://supabase.com/dashboard/account/tokens")
    sys.exit(1)

STEPS = [
    ("Create engine_cycles table",
     """CREATE TABLE IF NOT EXISTS engine_cycles (
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
);"""),

    ("Create life_engine_briefings table",
     """CREATE TABLE IF NOT EXISTS life_engine_briefings (
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
);"""),

    ("Create synced_tasks table",
     """CREATE TABLE IF NOT EXISTS synced_tasks (
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
);"""),

    ("Create synced_messages table",
     """CREATE TABLE IF NOT EXISTS synced_messages (
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
);"""),

    ("Create synced_calendar_events table",
     """CREATE TABLE IF NOT EXISTS synced_calendar_events (
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
);"""),

    ("Create life_engine_checkins table",
     """CREATE TABLE IF NOT EXISTS life_engine_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  value INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);"""),

    ("Create life_engine_evolution table",
     """CREATE TABLE IF NOT EXISTS life_engine_evolution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposed_change TEXT NOT NULL,
  reason TEXT,
  approved BOOLEAN,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);"""),

    ("Create life_engine_habits table",
     """CREATE TABLE IF NOT EXISTS life_engine_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  frequency TEXT,
  time_of_day TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);"""),

    ("Create life_engine_habit_log table",
     """CREATE TABLE IF NOT EXISTS life_engine_habit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES life_engine_habits(id),
  completed_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);"""),

    ("Enable RLS on all new tables",
     """ALTER TABLE engine_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_engine_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_engine_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_engine_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_engine_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_engine_habit_log ENABLE ROW LEVEL SECURITY;"""),

    ("Create RLS policy for engine_cycles",
     """CREATE POLICY "Service role full access" ON engine_cycles FOR ALL USING (true);"""),
    ("Create RLS policy for life_engine_briefings",
     """CREATE POLICY "Service role full access" ON life_engine_briefings FOR ALL USING (true);"""),
    ("Create RLS policy for synced_tasks",
     """CREATE POLICY "Service role full access" ON synced_tasks FOR ALL USING (true);"""),
    ("Create RLS policy for synced_messages",
     """CREATE POLICY "Service role full access" ON synced_messages FOR ALL USING (true);"""),
    ("Create RLS policy for synced_calendar_events",
     """CREATE POLICY "Service role full access" ON synced_calendar_events FOR ALL USING (true);"""),
    ("Create RLS policy for life_engine_checkins",
     """CREATE POLICY "Service role full access" ON life_engine_checkins FOR ALL USING (true);"""),
    ("Create RLS policy for life_engine_evolution",
     """CREATE POLICY "Service role full access" ON life_engine_evolution FOR ALL USING (true);"""),
    ("Create RLS policy for life_engine_habits",
     """CREATE POLICY "Service role full access" ON life_engine_habits FOR ALL USING (true);"""),
    ("Create RLS policy for life_engine_habit_log",
     """CREATE POLICY "Service role full access" ON life_engine_habit_log FOR ALL USING (true);"""),

    ("Create indexes",
     """CREATE INDEX IF NOT EXISTS idx_engine_cycles_started ON engine_cycles(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefings_date ON life_engine_briefings(briefing_date DESC);
CREATE INDEX IF NOT EXISTS idx_synced_tasks_source ON synced_tasks(source);
CREATE INDEX IF NOT EXISTS idx_synced_tasks_active ON synced_tasks(is_active);
CREATE INDEX IF NOT EXISTS idx_synced_tasks_due ON synced_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_synced_messages_source ON synced_messages(source);
CREATE INDEX IF NOT EXISTS idx_synced_messages_tier ON synced_messages(tier);
CREATE INDEX IF NOT EXISTS idx_synced_messages_timestamp ON synced_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_synced_calendar_start ON synced_calendar_events(start_time);"""),

    ("Create updated_at triggers",
     """DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_life_engine_briefings') THEN
    CREATE TRIGGER set_updated_at_life_engine_briefings BEFORE UPDATE ON life_engine_briefings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_synced_tasks') THEN
    CREATE TRIGGER set_updated_at_synced_tasks BEFORE UPDATE ON synced_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;"""),
]


def execute_sql(query: str, token: str) -> tuple:
    """Execute SQL via curl to the Supabase Management API."""
    payload = json.dumps({"query": query})
    result = subprocess.run(
        [
            "curl", "-s", "-w", "\n%{http_code}",
            API_URL,
            "-H", f"Authorization: Bearer {token}",
            "-H", "Content-Type: application/json",
            "-d", payload,
        ],
        capture_output=True,
        text=True,
        timeout=30,
    )
    lines = result.stdout.strip().split("\n")
    http_code = lines[-1] if lines else "0"
    body = "\n".join(lines[:-1])
    return http_code, body


def main():
    print(f"Deploying Life Engine schema to project {PROJECT_REF}...")
    print(f"API endpoint: {API_URL}")
    print(f"Total steps: {len(STEPS)}")
    print()

    success = 0
    failed = 0

    for i, (name, sql) in enumerate(STEPS, 1):
        print(f"[{i}/{len(STEPS)}] {name}...", end=" ", flush=True)
        http_code, body = execute_sql(sql, ACCESS_TOKEN)

        if http_code in ("200", "201"):
            print("OK")
            success += 1
        else:
            print(f"FAILED (HTTP {http_code})")
            print(f"  Response: {body[:300]}")
            failed += 1

    print()
    print(f"Deployment complete: {success} succeeded, {failed} failed out of {len(STEPS)} steps")

    # Verify new tables exist
    print()
    print("Verifying Life Engine tables...")
    expected = [
        "engine_cycles", "life_engine_briefings", "synced_tasks",
        "synced_messages", "synced_calendar_events", "life_engine_checkins",
        "life_engine_evolution", "life_engine_habits", "life_engine_habit_log",
    ]
    http_code, body = execute_sql(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;",
        ACCESS_TOKEN,
    )
    if http_code == "200":
        try:
            tables = json.loads(body)
            table_names = [t["table_name"] for t in tables]
            for t in expected:
                status = "OK" if t in table_names else "MISSING"
                print(f"  {t}: {status}")
        except (json.JSONDecodeError, KeyError):
            print(f"  Raw: {body[:500]}")
    else:
        print(f"Verification failed: HTTP {http_code}")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
