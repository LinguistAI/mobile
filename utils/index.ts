export const formatAsStr = (input: string | string[]): string => {
  // Check if the input is an array
  if (Array.isArray(input)) {
    // Join the array elements into a single string, separated by spaces
    return input.join(', ');
  } else {
    // Input is already a string, so just return it
    return input;
  }
};

export const updateArrayAtIndex = (arr: any[], index: number, val: any) => {
  return [...arr.slice(0, index), val, ...arr.slice(index + 1)];
};
