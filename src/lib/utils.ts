/**
 * Tiny `clsx`-style helper. Joins truthy class names with a space.
 */
export function cn(
  ...classes: Array<string | undefined | null | false>
): string {
  return classes.filter(Boolean).join(' ');
}

/** Shortens an Ethereum address to `0x1234…abcd` for display. */
export function shortAddress(address: string | undefined, lead = 6, tail = 4): string {
  if (!address) return '';
  if (address.length <= lead + tail + 1) return address;
  return `${address.slice(0, lead)}\u2026${address.slice(-tail)}`;
}
