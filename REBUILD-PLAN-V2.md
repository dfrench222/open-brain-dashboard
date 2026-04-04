# Open Brain Dashboard — Rebuild Plan V2

**Date:** April 4, 2026
**Context:** Life Engine CLI briefings are working perfectly. The dashboard needs to match that quality. Financial data is out of scope for now — this is about making the briefing, tasks, calendar, and action layer functional.

**Reference:** Rich's OS deep analysis at `~/jumm-life/projects/richs-os-v2-mac/open-brain-vs-richs-os-comparison.md`

---

## What Don Said

> "The briefing needs to be more forward-thinking — action steps I should be taking, understanding why it's important and what it's doing."
> "ClickUp tasks on the dashboard don't do much right now. In my briefings you've been giving specific ClickUp tasks perfectly."
> "Commitments and that stuff is not valuable at all right now; it's not actually doing anything."
> "Financial data is a whole other build — skip it for now."

---

## Core Principle

**The dashboard should feel like reading the CLI briefing — but interactive.** Everything the Life Engine produces in the terminal should be visible, actionable, and forward-looking in the app. If it's not actionable, it doesn't belong on the Overview.

---

## Phase 1: Make the Briefing the Dashboard

The Overview page should BE the morning briefing. Not a separate thing you read in the terminal — the same intelligence, rendered beautifully, with buttons.

### 1.1 Pre-Bake the Briefing to Supabase

**Problem:** The dashboard fetches briefing data via API on page load. Sometimes it fails. Sometimes it's stale. The CLI briefing is better because it runs live.

**Solution:** When `/life-engine` runs (manually or scheduled), write the compiled briefing JSON to `life_engine_briefings` table in Supabase. The dashboard reads this instantly — no computation, no API chaining, no failures.

**Briefing JSON structure (what gets written):**
```json
{
  "briefing_date": "2026-04-04",
  "briefing_type": "morning",
  "generated_at": "2026-04-04T10:00:00Z",

  "narrative": "Light calendar day — 3 events. RS1 influencer outreach is live...",

  "schedule": [
    {
      "time": "7:00 AM",
      "title": "Hazel x Donnie — Next Steps",
      "workspace": "performance-golf",
      "attendees": ["hazel@performancegolfzone.com"],
      "prep_notes": "Hazel at PG. 30-min call.",
      "minutes_until": 60
    }
  ],

  "action_items": [
    {
      "title": "Onboard Jeff Logue to AI workflows",
      "why": "He's the key ally for scaling AI across the eng team. You sent Brixton a voice note about bonus motivation.",
      "source": "limitless_insights",
      "time_estimate": "30 min",
      "priority": "high",
      "due": null
    }
  ],

  "follow_ups": [
    {
      "title": "Help Fran finish Solomon VSL draft",
      "why": "You committed to a working draft by Thursday. Deadline passed.",
      "source": "limitless_insights",
      "priority": "high",
      "overdue": true
    }
  ],

  "decisions_yesterday": [
    {
      "decision": "Quiz mirrors 4-step high-ticket diagnostic process",
      "context": "Made during quiz redesign session with Brixton and Christopher"
    }
  ],

  "suggestions": [
    {
      "directive": "Review Aurora's influencer brief questions in #rs1",
      "time_estimate": "10 min",
      "reason": "Launch momentum — don't let it stall. Aurora asked about upload vs. post clarity and editing support.",
      "priority": "high",
      "source": "slack_pg"
    }
  ],

  "stories_for_the_don": [
    {
      "title": "The Childhood Home — French Lane, Michigan",
      "date": "2026-04-01",
      "status": "extracted"
    }
  ],

  "ideas": [
    {
      "concept": "Anti-review testimonial format",
      "detail": "Start with genuine skepticism before demonstrating performance. You and Ben did this naturally with SF2."
    }
  ],

  "slack_tier1": [
    {
      "channel": "#product-rs1-putter-launch",
      "sender": "Aurora Leindecker",
      "preview": "Need clarity on influencer brief — post AND upload, or just one?",
      "timestamp": "2026-04-02T17:46:23-04:00",
      "workspace": "performance-golf"
    }
  ],

  "stats": {
    "meetings_today": 3,
    "focus_hours_available": 9,
    "overdue_tasks_clickup": 16,
    "overdue_tasks_notion": 0,
    "tier1_messages": 2,
    "stories_pending": 0
  }
}
```

### 1.2 Overview Page — The Briefing Rendered

**Remove:** Commitments section, static metrics cards, anything not actionable.

**New Overview layout (top to bottom):**

```
┌─────────────────────────────────────────────────┐
│ HERO ROW                                         │
│ [Meetings Today: 3] [Focus Hours: 9h] [Action: 5]│
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ NARRATIVE (5-second scan)                        │
│ "Light calendar day — 3 events. RS1 influencer   │
│  outreach is live. Fran VSL deadline passed..."   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TODAY'S SCHEDULE (time blocks)                    │
│ 7:00 AM  Hazel x Donnie — Next Steps      [PG]  │
│ 8:30 AM  Second Brain Deep Dive            [JL]  │
│ 1:00 PM  Bank Appointment                  [PG]  │
│ 7:00 PM  Jumm Love Date Night              [JL]  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ WHAT I CAN DO RIGHT NOW                          │
│                                                   │
│ [HIGH] Review Aurora's influencer brief — 10 min  │
│   WHY: Launch momentum. She asked about upload    │
│   vs. post clarity.                    [DO IT]    │
│                                                   │
│ [HIGH] Message Fran — Solomon VSL — 10 min        │
│   WHY: You committed to Thursday. It's Friday.    │
│                                        [DO IT]    │
│                                                   │
│ [MED]  Build Masters promo page — 2 hrs           │
│   WHY: Video filmed, needs landing page on React  │
│   site with buttons to 357/359/bundle. [DO IT]    │
└─────────────────────────────────────────────────┘

┌──────────────────────┐ ┌────────────────────────┐
│ ACTION ITEMS          │ │ FOLLOW-UPS             │
│ (from yesterday)      │ │ (overdue = red)        │
│                       │ │                        │
│ • Onboard Jeff Logue  │ │ • Fran VSL draft ⚠️    │
│   [WHY] [DONE] [DEFER]│ │   [WHY] [DONE] [NUDGE]│
│                       │ │                        │
│ • RS1 Checkout Champ  │ │ • Connect w/ Danielle  │
│   [WHY] [DONE] [DEFER]│ │   [WHY] [DONE] [NUDGE]│
└──────────────────────┘ └────────────────────────┘

┌─────────────────────────────────────────────────┐
│ DECISIONS MADE YESTERDAY                         │
│ • Quiz = 4-step high-ticket diagnostic process   │
│ • Quiz leads to 7-day free PG1 trial             │
│ • Masters promo = 357 + 359 fairway woods        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SLACK — NEEDS ATTENTION (Tier 1 only)            │
│                                                   │
│ #rs1-putter-launch · Aurora · 2h ago             │
│ "Need clarity on influencer brief..."   [REPLY]  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ STORIES FOR THE DON (if any pending)             │
│ 2 stories extracted Apr 1 ✅                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ DAILY QUOTE                                      │
│ "Whatever you want in life, give it away first." │
└─────────────────────────────────────────────────┘
```

**Key difference from current dashboard:** Every item has a WHY and an ACTION BUTTON. Nothing is just displayed — everything is operable.

---

## Phase 2: Fix the ClickUp Tasks Page (Action Page)

### 2.1 What's Wrong Now

The Action page shows a flat list of ClickUp tasks with minimal context. No sense of priority, no "why this matters", no connection to the briefing.

### 2.2 What It Should Be

The Action page should match the quality of the CLI briefing task sections. Group by urgency, show context, enable triage.

**Layout:**

```
┌─────────────────────────────────────────────────┐
│ OVERDUE (red accent)                     [3 tasks]│
│                                                   │
│ • Current Influencer Contract Renewals   [HIGH]   │
│   PG · John Hardesty · 2 days overdue             │
│   WHY: Active renewals need sign-off before Q2    │
│                         [DONE] [DEFER] [OPEN CU]  │
│                                                   │
│ • Rick Smith Trump Transformation · Scoping       │
│   PG · Jenni Nagel · in progress                  │
│                         [DONE] [DEFER] [OPEN CU]  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ DUE THIS WEEK (amber accent)            [5 tasks]│
│ ...                                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ NOTION — PERSONAL TASKS                  [0 open]│
│ All clear ✓                                       │
└─────────────────────────────────────────────────┘
```

**Action buttons on every task:**
- **DONE** → PATCH ClickUp API to mark complete (or Notion API)
- **DEFER** → Snooze 1 day / 3 days / 1 week (dropdown)
- **OPEN** → Link to ClickUp/Notion task URL
- **NUDGE** → (future) Send Slack message to assignee

### 2.3 Notion Integration

Pull from the Admin board (database ID: `2e89360c-68be-80db-bc21-cf46eb58c44b`). Show personal tasks separately from ClickUp PG tasks. Clear visual separation: "PG Tasks (ClickUp)" vs "Personal Tasks (Notion)".

---

## Phase 3: Calendar on Overview

### 3.1 What Exists

Google Calendar MCP is connected. Life Engine already pulls events from both calendars (JL + PG). The data is there — it's just not rendered in the dashboard.

### 3.2 Implementation

Write calendar events to Supabase `synced_calendar_events` table during Life Engine runs. Dashboard reads from Supabase.

Render as time blocks on the Overview page (see layout above). Each event shows:
- Time
- Title
- Workspace badge (JL green / PG orange)
- Attendees (if meeting)
- Prep notes (if generated by Life Engine)

---

## Phase 4: Slack Tier-1 on Overview

### 4.1 What It Should Do

Show only Tier 1 messages (urgent, needs Don's response) from both Slack workspaces. Not a full Slack feed — just the stuff that requires action.

### 4.2 Implementation

Life Engine already does tier classification. Write tier-1 messages to `synced_messages` table with `tier: 1`. Dashboard reads and renders with:
- Channel name + sender
- Message preview (first 120 chars)
- Timestamp (relative: "2h ago")
- **REPLY** button (opens Slack deep link)
- **DISMISS** button (marks as read in Supabase)

---

## Phase 5: Suggestions Engine ("What I Can Do Right Now")

### 5.1 The Most Important Feature

This is what separates an operating system from a dashboard. The Life Engine already generates suggestions in the CLI briefing. Write them to the briefing JSON and render them prominently on the Overview.

### 5.2 Each Suggestion Has

- **Directive** — What to do (one sentence)
- **Time estimate** — How long it'll take
- **Why** — Expandable explanation of why this matters right now
- **Priority** — High (red), Medium (amber), Low (default)
- **Source** — Where the signal came from (slack_pg, clickup, limitless, etc.)
- **DO IT** button — (future) Opens relevant app/link or triggers action

---

## Phase 6: Error Boundaries + Loading States + Health

### 6.1 Error Boundaries

Wrap every panel/section in a React error boundary. If one section fails to load, the rest of the page stays up. Show a small error card: "Slack feed unavailable — last updated 6h ago" instead of crashing.

### 6.2 Loading States

Shimmer/skeleton screens while data loads. Not blank space.

### 6.3 Health Indicator

Sidebar shows:
- **Green dot** — All data sources fresh (< 6h)
- **Amber dot** — Some sources stale (> 6h)
- **Red dot** — Data older than 24h or Supabase unreachable
- **Last updated** timestamp
- **Refresh** button — Re-runs Life Engine data fetch

---

## Phase 7: Additional Themes

Add at minimum:
1. **Neon** — Inspired by Rich's neon-strict. Pure black, neon green/cyan accents, monospace. Don loves this aesthetic for dashboards.
2. **Terminal** — Deep black, amber/green text, hacker feel.
3. Keep existing dark (default) and light themes.

Use the same CSS custom property injection pattern Rich uses — theme files in `/public/themes/`, dynamically loaded, no rebuild needed.

---

## What's NOT in This Plan (Explicitly Deferred)

- Financial data / revenue metrics / DOMO integration
- WebAuthn / passkey auth (password is fine for now)
- Full Slack Communications page rebuild
- Knowledge Base browsing/search
- People CRM page improvements
- Horse racing / investment tracking
- Eight Sleep / health metrics
- AI command bar execution (Phase 2 of a future plan)
- AI chat panel (Phase 2 of a future plan)

---

## Build Order

| Priority | What | Why | Effort |
|----------|------|-----|--------|
| **1** | Pre-bake briefing JSON to Supabase | Everything else depends on fast, reliable data | Medium |
| **2** | Overview page — render the briefing | This IS the product. If this page is perfect, the app is useful. | Large |
| **3** | Action buttons (DONE/DEFER) on tasks | Actionability is the #1 gap vs. Rich's OS | Medium |
| **4** | Calendar on Overview | Data already exists via MCP, just needs rendering | Small |
| **5** | Slack Tier-1 on Overview | Life Engine already classifies — just render | Small |
| **6** | Suggestions ("What I Can Do Right Now") | Forward-thinking intelligence, not just data display | Medium |
| **7** | Error boundaries + loading states | Resilience — stops the "blank page" problem | Small |
| **8** | Notion tasks on Action page | Personal tasks alongside ClickUp PG tasks | Small |
| **9** | Health indicator + refresh button | Know when data is stale, trigger refresh | Small |
| **10** | Additional themes (neon, terminal) | Polish — makes it feel like YOUR system | Small |

---

## Success Criteria

When this rebuild is done, Don should be able to:

1. Open the dashboard at 6 AM and see the same quality briefing he gets in Claude Code
2. See today's schedule with prep notes without opening Google Calendar
3. Know exactly what to do next (suggestions with WHY explanations)
4. Mark tasks done from the dashboard without opening ClickUp
5. See which Slack messages need a response without opening Slack
6. Never see a blank page or broken section
7. Trust that the data is fresh (health indicator confirms it)

**The test:** If Don can start his day from the dashboard instead of Claude Code, the rebuild is successful.
