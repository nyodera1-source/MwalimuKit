/**
 * Predefined break types and Kenyan public holidays for Scheme of Work
 * Based on Kenya's official public holidays calendar
 */

export const BREAK_TYPES = [
  "Mid-Term Break",
  "Mid-Term Exams",
  "End-Term Exams",
  "Public Holiday",
  "Sports Day/Academic Week",
  "Custom (Type your own)",
] as const;

export type BreakType = (typeof BREAK_TYPES)[number];

/**
 * Official Kenyan Public Holidays
 * Note: Some dates are variable (Easter, Islamic holidays)
 */
export const KENYAN_PUBLIC_HOLIDAYS = [
  { name: "New Year's Day", date: "January 1" },
  { name: "Good Friday", date: "Variable (Easter)" },
  { name: "Easter Monday", date: "Variable (Easter)" },
  { name: "Labour Day", date: "May 1" },
  { name: "Madaraka Day", date: "June 1" },
  { name: "Eid ul-Fitr", date: "Variable (Islamic Calendar)" },
  { name: "Eid ul-Adha", date: "Variable (Islamic Calendar)" },
  { name: "Utamaduni Day", date: "October 10" },
  { name: "Mashujaa Day", date: "October 20" },
  { name: "Jamhuri Day", date: "December 12" },
  { name: "Christmas Day", date: "December 25" },
  { name: "Boxing Day", date: "December 26" },
] as const;

/**
 * Get display name for a public holiday (includes date for reference)
 */
export function getHolidayDisplayName(holiday: (typeof KENYAN_PUBLIC_HOLIDAYS)[number]): string {
  return `${holiday.name} (${holiday.date})`;
}

/**
 * Get all public holiday options for dropdown
 */
export function getPublicHolidayOptions(): string[] {
  return KENYAN_PUBLIC_HOLIDAYS.map(h => h.name);
}
