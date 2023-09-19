export const truncateHash = (hash?: string, length = 38): string =>
  hash ? hash.replace(hash.substring(6, length), '...') : '';

export function pickOne<T>(messages: T[]): T {
  return messages[new Date().getTime() % messages.length];
}

export const stringToHex = (w: string): string => {
  const hex = w
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');

  return `0x${hex}`;
};
