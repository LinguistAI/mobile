export function objectIsNotEmpty<T>(obj: T | {}): obj is T {
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).length > 0;
  }
  return false;
}
