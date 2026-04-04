"use client";

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  workspace: string;
  attendees?: { email: string; name: string }[];
  ai_prep_notes?: string;
}

interface ScheduleProps {
  events: CalendarEvent[];
}

export function Schedule({ events }: ScheduleProps) {
  if (!events || events.length === 0) {
    return (
      <div className="card" style={{ padding: "20px 24px" }}>
        <div className="label" style={{ marginBottom: "8px" }}>Today&apos;s Schedule</div>
        <div style={{ fontSize: "14px", color: "var(--text-dim)" }}>
          No events synced — run /life-engine to sync calendar
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      <div className="label" style={{ marginBottom: "16px" }}>
        Today&apos;s Schedule
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {events.map((event) => {
          const start = new Date(event.start_time);
          const timeStr = start.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "America/New_York",
          });
          const isJL = event.workspace === "jumm-life";
          const isPast = start < new Date();

          return (
            <div
              key={event.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "10px 0",
                borderBottom: "1px solid var(--border)",
                opacity: isPast ? 0.5 : 1,
              }}
            >
              {/* Time */}
              <div
                className="mono"
                style={{
                  fontSize: "13px",
                  color: "var(--text-dim)",
                  minWidth: "80px",
                  flexShrink: 0,
                }}
              >
                {timeStr}
              </div>

              {/* Event Details */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-bright)",
                    }}
                  >
                    {event.title}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: isJL
                        ? "rgba(50,213,131,0.1)"
                        : "rgba(253,51,0,0.1)",
                      color: isJL ? "var(--green)" : "#FD3300",
                    }}
                  >
                    {isJL ? "JL" : "PG"}
                  </span>
                </div>

                {event.attendees && event.attendees.length > 0 && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-dim)",
                      marginTop: "2px",
                    }}
                  >
                    {event.attendees
                      .map((a) => a.name || a.email.split("@")[0])
                      .join(", ")}
                  </div>
                )}

                {event.ai_prep_notes && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--accent)",
                      marginTop: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    {event.ai_prep_notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
