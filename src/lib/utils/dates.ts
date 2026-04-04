import { format, isToday as _isToday, isTomorrow as _isTomorrow, isPast as _isPast, differenceInMinutes, differenceInBusinessDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date string to French locale: "12 mars 2025"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'd MMMM yyyy', { locale: fr });
}

/**
 * Format a date string to short French locale: "12/03/2025"
 */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy', { locale: fr });
}

/**
 * Format a time string: "14:30"
 */
export function formatTime(time: string | Date): string {
  const d = typeof time === 'string' ? (time.includes('T') ? parseISO(time) : new Date(`1970-01-01T${time}`)) : time;
  return format(d, 'HH:mm', { locale: fr });
}

/**
 * Format a date-time string: "12 mars 2025 à 14:30"
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, "d MMMM yyyy 'à' HH:mm", { locale: fr });
}

/**
 * Check if a date is today.
 */
export function isToday(date: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return _isToday(d);
}

/**
 * Check if a date is tomorrow.
 */
export function isTomorrow(date: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return _isTomorrow(d);
}

/**
 * Check if a date is in the past.
 */
export function isPast(date: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return _isPast(d);
}

/**
 * Get French day name: "lundi", "mardi", etc.
 */
export function getDayName(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEEE', { locale: fr });
}

/**
 * Get French month name: "janvier", "février", etc.
 */
export function getMonthName(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM', { locale: fr });
}

/**
 * Calculate duration in minutes between two time strings or dates.
 */
export function calculateDuration(start: string | Date, end: string | Date): number {
  const s = typeof start === 'string' ? (start.includes('T') ? parseISO(start) : new Date(`1970-01-01T${start}`)) : start;
  const e = typeof end === 'string' ? (end.includes('T') ? parseISO(end) : new Date(`1970-01-01T${end}`)) : end;

  let minutes = differenceInMinutes(e, s);

  // Handle overnight shifts (end is before start)
  if (minutes < 0) {
    minutes += 24 * 60;
  }

  return minutes;
}

/**
 * Calculate the number of working days (Mon-Fri) between two dates.
 */
export function calculateWorkingDays(start: string | Date, end: string | Date): number {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return differenceInBusinessDays(e, s);
}
