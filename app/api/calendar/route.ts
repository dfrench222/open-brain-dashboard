import { NextResponse } from "next/server";

// Google Calendar integration
// Needs Google service account setup -- Don will create this separately
// When ready, set GOOGLE_SERVICE_ACCOUNT env var with the service account JSON key
// Then share calendars with the service account email

export async function GET() {
  const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT;

  if (!serviceAccount) {
    return NextResponse.json({
      events: [],
      connected: false,
      message: "Connect Google Calendar",
    });
  }

  // Future: Use Google Calendar API with service account
  // GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
  // with timeMin={today} and timeMax={today + 7 days}

  return NextResponse.json({
    events: [],
    connected: false,
    message: "Google Calendar setup in progress",
  });
}
