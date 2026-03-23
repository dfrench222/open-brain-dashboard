#!/usr/bin/env python3
"""Deploy Open Brain schema to Supabase via Management API using curl."""

import json
import subprocess
import sys

PROJECT_REF = "ybaqownpbpmdstjlqejn"
API_URL = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"

ACCESS_TOKEN = sys.argv[1] if len(sys.argv) > 1 else None
if not ACCESS_TOKEN:
    print("Usage: python3 deploy-schema.py <access_token>")
    sys.exit(1)

STEPS = [
    ("Enable pgvector extension",
     "CREATE EXTENSION IF NOT EXISTS vector;"),

    ("Create thoughts table",
     """CREATE TABLE IF NOT EXISTS thoughts (
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
CREATE INDEX IF NOT EXISTS idx_thoughts_created_at ON thoughts(created_at DESC);"""),

    ("Create finances table",
     """CREATE TABLE IF NOT EXISTS finances (
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
CREATE INDEX IF NOT EXISTS idx_finances_workspace ON finances(workspace);"""),

    ("Create people table",
     """CREATE TABLE IF NOT EXISTS people (
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
CREATE INDEX IF NOT EXISTS idx_people_relationship ON people(relationship);"""),

    ("Create projects table",
     """CREATE TABLE IF NOT EXISTS projects (
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
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);"""),

    ("Create metrics table",
     """CREATE TABLE IF NOT EXISTS metrics (
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
CREATE INDEX IF NOT EXISTS idx_metrics_workspace ON metrics(workspace);"""),

    ("Create events table",
     """CREATE TABLE IF NOT EXISTS events (
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
CREATE INDEX IF NOT EXISTS idx_events_workspace ON events(workspace);"""),

    ("Create audit_log table",
     """CREATE TABLE IF NOT EXISTS audit_log (
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
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);"""),

    ("Create daily_quotes table",
     """CREATE TABLE IF NOT EXISTS daily_quotes (
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
CREATE INDEX IF NOT EXISTS idx_daily_quotes_category ON daily_quotes(category);"""),

    ("Enable RLS on all tables",
     """ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;"""),

    ("Create RLS policy for thoughts",
     """CREATE POLICY "Service role full access" ON thoughts FOR ALL USING (auth.role() = 'service_role');"""),
    ("Create RLS policy for finances",
     """CREATE POLICY "Service role full access" ON finances FOR ALL USING (auth.role() = 'service_role');"""),
    ("Create RLS policy for people",
     """CREATE POLICY "Service role full access" ON people FOR ALL USING (auth.role() = 'service_role');"""),
    ("Create RLS policy for projects",
     """CREATE POLICY "Service role full access" ON projects FOR ALL USING (auth.role() = 'service_role');"""),
    ("Create RLS policy for metrics",
     """CREATE POLICY "Service role full access" ON metrics FOR ALL USING (auth.role() = 'service_role');"""),
    ("Create RLS policy for events",
     """CREATE POLICY "Service role full access" ON events FOR ALL USING (auth.role() = 'service_role');"""),
    ("Create RLS policy for audit_log",
     """CREATE POLICY "Service role full access" ON audit_log FOR ALL USING (auth.role() = 'service_role');"""),
    ("Create RLS policy for daily_quotes",
     """CREATE POLICY "Service role full access" ON daily_quotes FOR ALL USING (auth.role() = 'service_role');"""),

    ("Create updated_at trigger function",
     """CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;"""),

    ("Create trigger for thoughts",
     "CREATE TRIGGER set_updated_at_thoughts BEFORE UPDATE ON thoughts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();"),
    ("Create trigger for people",
     "CREATE TRIGGER set_updated_at_people BEFORE UPDATE ON people FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();"),
    ("Create trigger for projects",
     "CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();"),
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
    print(f"Deploying Open Brain schema to project {PROJECT_REF}...")
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

    # Verify tables exist
    print()
    print("Verifying tables...")
    http_code, body = execute_sql(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;",
        ACCESS_TOKEN,
    )
    if http_code == "200":
        try:
            tables = json.loads(body)
            print("Tables in public schema:")
            for t in tables:
                print(f"  - {t['table_name']}")
        except (json.JSONDecodeError, KeyError):
            print(f"  Raw: {body[:500]}")
    else:
        print(f"Verification failed: HTTP {http_code}")

    # Also verify RLS policies
    print()
    print("Verifying RLS policies...")
    http_code, body = execute_sql(
        "SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;",
        ACCESS_TOKEN,
    )
    if http_code == "200":
        try:
            policies = json.loads(body)
            print("RLS policies:")
            for p in policies:
                print(f"  - {p['tablename']}: {p['policyname']}")
        except (json.JSONDecodeError, KeyError):
            print(f"  Raw: {body[:500]}")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
