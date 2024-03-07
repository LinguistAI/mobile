export function objectIsNotEmpty<T>(obj: T | {}): obj is T {
  return !(obj && typeof obj === 'object' && Object.keys(obj).length === 0 && obj.constructor === Object);
}
