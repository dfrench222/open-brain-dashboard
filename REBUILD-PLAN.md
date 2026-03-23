# Open Brain Dashboard — Complete Rebuild Plan

## Reference: Rich's OS Dashboard
Screenshot analyzed March 22, 2026. Key patterns:

### Architecture (What Rich Has That We Don't)
1. **Sidebar navigation** — Separate pages, NOT one scrolling page. Sections: Overview, Action, Business, Growth, Community, Ops, Intel, etc.
2. **Command bar** — "What do you want done?" input at the top. Type a command → AI executes it.
3. **Action buttons on EVERY item** — DONE | ACT | NUDGE | +1 | +2 | +3 | NOT YET | X
   - DONE = mark complete (hits ClickUp/Notion API)
   - ACT = take action now
   - NUDGE = send a message to the person responsible
   - +1/+2/+3 = Ivy Lee priority assignment
   - NOT YET = defer
   - X = dismiss
4. **"What I Can Do Right Now"** — AI-generated ready-to-execute directives with:
   - Description of what to do
   - Estimated time (~30-45 minutes)
   - "why?" explanation link
   - "DO IT" button
5. **Key metrics** — 3 clean cards (Revenue today, MTD, Waiting On You count)
6. **Issues/warnings banner** — Expandable at the top
7. **REFRESH / REBUILD buttons** in sidebar
8. **Build timestamp** — "Built March 22, 2026 6:30 AM ET"
9. **Clean, minimal design** — Lots of whitespace, no clutter

---

## Don's Dashboard — Sidebar Pages

### Left Sidebar Navigation
| Page | Icon | What It Shows | Data Source |
|------|------|--------------|-------------|
| **Overview** | 🏠 | Morning Anchor + Daily Briefing + Key Metrics + Action Required | Supabase, GitHub (Limitless), ClickUp, Google Cal |
| **Action** | 🔔 | ALL tasks assigned to Don across ClickUp + Notion, with DONE/ACT/NUDGE/priority buttons | ClickUp API, Notion API |
| **Jumm Life** | 🏡 | Personal: Penny, Caitlin, family calendar, restitution, personal finances | Google Cal, Supabase |
| **Performance Golf** | ⛳ | PG metrics (when connected), launches, team tasks, PG Slack feed | ClickUp API, Slack PG API |
| **Communications** | 💬 | Both Slack workspaces side by side, real messages | Slack JL API, Slack PG API |
| **People** | 👥 | CRM — key relationships with contact actions | Supabase `people` table |
| **Projects** | 📋 | All active projects with status | Supabase `projects` table |
| **Knowledge** | 🧠 | AI Activity, KB stats, KT wisdom, Limitless insights | Supabase, GitHub API |

### Command Bar (Top of Every Page)
"What do you want done?" → Input field + Go button
- For now: links to Claude Code or opens a new task
- Future: AI processes the command and executes

---

## Data Sources — How Each One Connects to Vercel

### 1. ClickUp (PG Tasks) ✅ READY
- **Token:** `CLICKUP_API_TOKEN` in Vercel env vars
- **API route:** `/api/clickup/route.ts`
- **What to fetch:** Don's tasks only (overdue + due today + due this week)
- **Filter:** `assignees[]={don_user_id}` + status filters
- **Actions:** DONE button → PATCH task status to "complete"

### 2. GitHub → Limitless Life Logs ⚡ NEEDS SETUP
- **What:** Fine-grained PAT scoped to `obsidian-jumm-life` repo only (read-only)
- **Token name:** `GITHUB_VAULT_TOKEN`
- **API route:** `/api/briefing/route.ts`
- **What to fetch:** Latest `Daily Insights (Limitless).md` file
- **Parses:** Action items, follow-ups, decisions, unresolved questions, ideas
- **Security:** Read-only, single repo, 90-day expiry

### 3. Slack JL (Jumm Life) ✅ TOKEN READY
- **Token:** `SLACK_JL_BOT_TOKEN` in Vercel env vars
- **API route:** `/api/slack-jl/route.ts`
- **What to fetch:** Recent messages from channels the bot is invited to
- **Method:** `conversations.history` + `conversations.list` Slack Web API
- **Security:** Bot can only see channels it's explicitly added to

### 4. Slack PG (Performance Golf) ⚡ NEEDS TOKEN EXTRACTED
- **Current state:** Connected via MCP (`slack-pg`) but token not in env vars
- **Action:** Extract PG bot token from MCP config → add to Vercel env vars
- **API route:** `/api/slack-pg/route.ts`
- **Same Slack Web API pattern as JL

### 5. Google Calendar ⚡ NEEDS SERVICE ACCOUNT
- **Setup:** Create Google Cloud service account under existing project
- **Share calendars:** Don shares both JL and PG calendars with the service account email
- **Credentials:** Service account JSON key stored as `GOOGLE_SERVICE_ACCOUNT` env var
- **API route:** `/api/calendar/route.ts`
- **What to fetch:** Today's events + next 7 days from both calendars
- **Security:** Read-only, only sees calendars explicitly shared with it

### 6. Notion (JL Tasks) ✅ TOKEN READY
- **Token:** `NOTION_API_TOKEN` in Vercel env vars
- **API route:** `/api/notion/route.ts`
- **What to fetch:** Task databases (admin tasks, birthday reminders, receipt verification)
- **Need:** Discover the specific database IDs Don's assistant uses

### 7. Supabase ✅ WORKING
- **Tables:** thoughts, finances, people, projects, metrics, events, audit_log, daily_quotes
- **API routes:** `/api/quotes`, `/api/people`, `/api/projects`, `/api/brain-stats`
- **All using service role key (server-side only)**

---

## Security Implementation

### Phase 1: Immediate (before next deploy)
1. **Vercel password protection** — Upgrade to Pro ($20/mo) or add middleware-based auth
2. **Fine-grained GitHub PAT** — Single repo, read-only, 90-day expiry
3. **Google service account** — Read-only calendar access
4. **Audit all API routes** — No open endpoints returning sensitive data

### Phase 2: Proper Auth (next week)
1. **Supabase Auth** with passkeys/Face ID (per vision doc)
2. **Role-based access** — Don (full), Caitlin (JL only), Iyah (finances only)
3. **Remove Vercel password** once Supabase Auth is live

---

## Action Item Buttons (Per Rich's Pattern)

Every task/item in the Action page gets these buttons:

| Button | What It Does | API Call |
|--------|-------------|----------|
| **DONE** | Mark task complete | ClickUp: PATCH status → "closed". Notion: PATCH status → "Done" |
| **ACT** | Open the task in its source app | Deep link to ClickUp/Notion/Slack |
| **NUDGE** | Send a message to the assignee/requester | Slack API: `chat.postMessage` to the relevant person |
| **+1 / +2 / +3** | Set Ivy Lee priority level | Store in Supabase `metadata` or ClickUp custom field |
| **NOT YET** | Defer to tomorrow | ClickUp: update due date to tomorrow. Or store in Supabase |
| **X** | Dismiss | Remove from dashboard view (soft delete in Supabase) |

---

## "What I Can Do Right Now" Panel

AI-generated suggestions based on:
- Current time of day
- Today's calendar (what meetings are coming, what free blocks exist)
- Overdue tasks (what's most urgent)
- Yesterday's Limitless insights (what was left unfinished)

Each suggestion shows:
- **Directive** — what to do
- **Estimated time** — how long it'll take
- **Why** — why this matters right now
- **DO IT** — button (future: triggers Claude Code execution)

For v1: Generate these server-side based on task data + calendar data. Static AI analysis, not live Claude execution.

---

## Design Direction

Based on Don's feedback and the SSP dashboard reference:
- **Dark theme** (Don loves it) — warm darks like SSP, not cold blue
- **Sidebar navigation** — clean, minimal, icon + label
- **Lots of whitespace** — Rich's dashboard has massive spacing
- **Cards with generous padding** — 24px minimum
- **Clean typography** — Inter/system font, not Orbitron everywhere
- **Accent color used sparingly** — neon cyan only for the most important elements
- **Mobile-first sidebar** — collapses to bottom nav or hamburger on phone
- **Every number is real or clearly pending**

---

## Build Order

1. Set up security (GitHub PAT, Google service account, Vercel auth)
2. Restructure to sidebar + pages (not one scrolling page)
3. Wire real data for each page
4. Add action buttons (DONE/ACT/NUDGE/priority)
5. Build "What I Can Do Right Now" panel
6. Add command bar
7. Polish design to SSP standard
8. Deploy and test on phone
