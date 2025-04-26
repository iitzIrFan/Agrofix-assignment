/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Generate a simple order ID
 */
export function generateOrderId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

/**
 * Convert an enum value to a more readable format
 */
export function formatEnumValue(value: string): string {
  return value
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
} 