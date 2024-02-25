export function isEmptyObj(obj: any): boolean {
  return (
    obj &&
    typeof obj === "object" &&
    Object.keys(obj).length === 0 &&
    obj.constructor === Object
  );
}
