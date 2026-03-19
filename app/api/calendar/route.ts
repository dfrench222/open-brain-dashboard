import { NextResponse } from "next/server";

// Mock calendar data with realistic upcoming events
// Will be wired to real Google Calendar API when server-side OAuth is set up
export async function GET() {
  const now = new Date();

  const events = [
    {
      id: "1",
      title: "PG Weekly Standup",
      description: "Performance Golf leadership sync with Brixton",
      start_time: getNextWeekday(now, 1, 10, 0), // Monday 10am
      end_time: getNextWeekday(now, 1, 11, 0),
      location: "Zoom",
      workspace: "performance-golf",
      type: "meeting",
    },
    {
      id: "2",
      title: "PG1 Presale Review",
      description: "Review PG1 presale campaign metrics and creative",
      start_time: getNextWeekday(now, 2, 14, 0), // Tuesday 2pm
      end_time: getNextWeekday(now, 2, 15, 0),
      location: "Zoom",
      workspace: "performance-golf",
      type: "meeting",
    },
    {
      id: "3",
      title: "Rich Schefren Strategy Call",
      description: "Monthly strategic advisory session",
      start_time: getNextWeekday(now, 3, 11, 0), // Wednesday 11am
      end_time: getNextWeekday(now, 3, 12, 0),
      location: "Zoom",
      workspace: "jumm-life",
      type: "meeting",
    },
    {
      id: "4",
      title: "Ben Marcoux - Perfect Pitch Sync",
      description: "AI workflow review and publishing pipeline",
      start_time: getNextWeekday(now, 4, 15, 0), // Thursday 3pm
      end_time: getNextWeekday(now, 4, 16, 0),
      location: "Zoom",
      workspace: "jumm-life",
      type: "meeting",
    },
    {
      id: "5",
      title: "Penny FaceTime",
      description: "Weekly video call with Penny in Rome",
      start_time: getNextWeekday(now, 6, 10, 0), // Saturday 10am
      end_time: getNextWeekday(now, 6, 10, 30),
      location: "FaceTime",
      workspace: "jumm-life",
      type: "family",
    },
    {
      id: "6",
      title: "GIN Global Call",
      description: "Global Information Network community call",
      start_time: addDays(now, 8, 19, 0),
      end_time: addDays(now, 8, 20, 30),
      location: "Zoom",
      workspace: "jumm-life",
      type: "community",
    },
    {
      id: "7",
      title: "PG Creative Review",
      description: "Review ad creatives for upcoming launches",
      start_time: addDays(now, 10, 13, 0),
      end_time: addDays(now, 10, 14, 0),
      location: "Zoom",
      workspace: "performance-golf",
      type: "meeting",
    },
  ];

  return NextResponse.json(events);
}

function getNextWeekday(
  from: Date,
  targetDay: number,
  hour: number,
  minute: number
): string {
  const result = new Date(from);
  const currentDay = result.getDay();
  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) daysToAdd += 7;
  result.setDate(result.getDate() + daysToAdd);
  result.setHours(hour, minute, 0, 0);
  return result.toISOString();
}

function addDays(
  from: Date,
  days: number,
  hour: number,
  minute: number
): string {
  const result = new Date(from);
  result.setDate(result.getDate() + days);
  result.setHours(hour, minute, 0, 0);
  return result.toISOString();
}
