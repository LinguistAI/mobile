export function objectIsNotEmpty<T>(obj: T | {}): obj is T {
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).length > 0;
  }
  return false;
}

export function formatTime(timestamp: Date) {
  return timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) || '';
}