/**
 * French public holidays for a given year.
 * Returns an array of "YYYY-MM-DD" strings.
 */
export function getFrenchPublicHolidays(year: number): string[] {
  const pad = (n: number) => String(n).padStart(2, '0');
  const toStr = (m: number, d: number) => `${year}-${pad(m)}-${pad(d)}`;

  // Easter calculation (Anonymous Gregorian algorithm)
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  const easter = new Date(year, month - 1, day);

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const easterMonday = addDays(easter, 1);
  const ascension = addDays(easter, 39);
  const whitMonday = addDays(easter, 50);

  const dateToStr = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return [
    toStr(1, 1),   // Jour de l'An
    dateToStr(easterMonday), // Lundi de Pâques
    toStr(5, 1),   // Fête du Travail
    toStr(5, 8),   // Victoire 1945
    dateToStr(ascension),    // Ascension
    dateToStr(whitMonday),   // Lundi de Pentecôte
    toStr(7, 14),  // Fête nationale
    toStr(8, 15),  // Assomption
    toStr(11, 1),  // Toussaint
    toStr(11, 11), // Armistice
    toStr(12, 25), // Noël
  ];
}

/**
 * Check if a given date string falls on a French public holiday.
 */
export function isFrenchPublicHoliday(dateStr: string): boolean {
  const year = new Date(dateStr).getFullYear();
  const holidays = getFrenchPublicHolidays(year);
  const normalized = dateStr.slice(0, 10); // YYYY-MM-DD
  return holidays.includes(normalized);
}

/**
 * Check if a date falls on a Sunday.
 */
export function isSunday(dateStr: string): boolean {
  return new Date(dateStr).getDay() === 0;
}

/**
 * Check if a date is a Sunday or a public holiday.
 */
export function isSundayOrHoliday(dateStr: string): boolean {
  return isSunday(dateStr) || isFrenchPublicHoliday(dateStr);
}

/**
 * Check if a given hour falls within night hours (default 21:00 - 06:00).
 */
export function isNightHours(
  hour: number,
  nightStart: number = 21,
  nightEnd: number = 6
): boolean {
  if (nightStart > nightEnd) {
    // Overnight range (e.g. 21-06)
    return hour >= nightStart || hour < nightEnd;
  }
  return hour >= nightStart && hour < nightEnd;
}

/**
 * Calculate how many night hours fall within a shift.
 * Times are "HH:mm" strings.
 */
export function calculateNightHours(
  startTime: string,
  endTime: string,
  nightStart: number = 21,
  nightEnd: number = 6
): number {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  // Handle overnight shift
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  const nightStartMin = nightStart * 60;
  const nightEndMin = nightEnd * 60;

  let nightMinutes = 0;

  for (let m = startMinutes; m < endMinutes; m++) {
    const normalizedHour = Math.floor((m % (24 * 60)) / 60);
    if (isNightHours(normalizedHour, nightStart, nightEnd)) {
      nightMinutes++;
    }
  }

  return nightMinutes / 60;
}

/**
 * Calculate overtime hours given total worked hours and threshold.
 */
export function calculateOvertimeHours(
  totalHours: number,
  threshold: number = 35
): number {
  return Math.max(0, totalHours - threshold);
}

/**
 * Compare planned vs actual hours and return the difference.
 */
export function calculatePlannedVsActual(
  plannedHours: number,
  actualHours: number
): {
  difference: number;
  isOvertime: boolean;
  isUndertime: boolean;
  percentageWorked: number;
} {
  const difference = actualHours - plannedHours;
  return {
    difference,
    isOvertime: difference > 0,
    isUndertime: difference < 0,
    percentageWorked: plannedHours > 0 ? (actualHours / plannedHours) * 100 : 0,
  };
}
