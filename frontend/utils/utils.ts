export const truncateHash = (hash?: string, length = 38): string =>
  hash ? hash.replace(hash.substring(6, length), '...') : '';
