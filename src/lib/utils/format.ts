/**
 * Format a number as EUR currency: "1 234,56 €"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Format a phone number in French format.
 * Input can be "0612345678" or "+33612345678".
 * Output: "06 12 34 56 78"
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // Convert +33 prefix to 0
  if (cleaned.startsWith('+33')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('33') && cleaned.length === 11) {
    cleaned = '0' + cleaned.slice(2);
  }

  // Format as XX XX XX XX XX
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }

  return phone; // Return original if format unknown
}

/**
 * Format a duration given in minutes: "2h30" or "45min"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 0) minutes = 0;

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    return `${mins}min`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h${String(mins).padStart(2, '0')}`;
}

/**
 * Format hours as a decimal string: "7.50h"
 */
export function formatHoursDecimal(hours: number): string {
  return `${hours.toFixed(2)}h`;
}

/**
 * Format an address from parts.
 */
export function formatAddress(parts: {
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
}): string {
  const segments = [
    parts.address,
    [parts.postal_code, parts.city].filter(Boolean).join(' '),
    parts.country,
  ].filter(Boolean);

  return segments.join(', ');
}

/**
 * Truncate a string to the given length, appending "..." if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Generate initials from a name: "Jean Dupont" -> "JD"
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${(firstName?.[0] ?? '').toUpperCase()}${(lastName?.[0] ?? '').toUpperCase()}`;
}
