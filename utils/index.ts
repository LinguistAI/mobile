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
