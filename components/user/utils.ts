export const dateObjToISODate = (date: Date) => {
  return date.toISOString().slice(0, 10);
};
