/**
 * Fire-and-forget action logging for the AutoAgent trajectory pattern.
 * Every dashboard action feeds back into the Life Engine for evolution proposals.
 */
export function logAction(
  action: string,
  tableName: string,
  recordId: string,
  details?: Record<string, unknown>
) {
  fetch("/api/log-action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      table_name: tableName,
      record_id: recordId,
      details: details || {},
    }),
  }).catch(() => {
    // Silent fail — logging should never block the UI
  });
}
