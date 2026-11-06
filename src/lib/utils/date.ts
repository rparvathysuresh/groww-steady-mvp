/**
 * Safe Date Manipulation Utilities.
 * Handles month-end date rollover without JavaScript 31st-of-month bugs (EDGE-FLEX-004).
 */

/**
 * Adds months to an ISO date string safely, clamping to the last valid day of the target month.
 * E.g., Jan 31 + 1 month = Feb 28 (or Feb 29 in leap year), NOT March 2 or 3.
 */
export function addMonthsSafe(dateStr: string, monthsToAdd: number): string {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed month
  const day = parseInt(dayStr, 10);

  const targetDate = new Date(year, month + monthsToAdd, 1);
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();

  // Find the last day of target month (day 0 of month + 1)
  const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const clampedDay = Math.min(day, daysInTargetMonth);

  const finalDate = new Date(targetYear, targetMonth, clampedDay);

  const yyyy = finalDate.getFullYear();
  const mm = String(finalDate.getMonth() + 1).padStart(2, '0');
  const dd = String(finalDate.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Calculates hours remaining between now (or reference date) and a target date.
 */
export function getHoursRemaining(targetDateStr: string, referenceDate?: string | Date): number {
  const target = new Date(targetDateStr).getTime();
  const ref = referenceDate ? new Date(referenceDate).getTime() : Date.now();
  return (target - ref) / (1000 * 60 * 60);
}

