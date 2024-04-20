export const formatAsStr = (input: string | string[]): string => {
  if (Array.isArray(input)) {
    return input.join(', ');
  } else {
    return input;
  }
};

export const updateArrayAtIndex = (arr: any[], index: number, val: any) => {
  return [...arr.slice(0, index), val, ...arr.slice(index + 1)];
};

/**
 * Converts milliseconds to seconds.
 *
 * @param {number} ms - The number of milliseconds.
 * @param {boolean} [pretty=false] - If true, rounds the result down to the nearest whole number.
 * @returns {number} The number of seconds equivalent to the input milliseconds.
 */
export const msToSeconds = (ms: number, pretty = false) => {
  let seconds = ms / 1000;
  if (pretty) {
    seconds = Math.floor(seconds);
  }

  return seconds;
};
