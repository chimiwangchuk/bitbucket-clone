export function isString(str: any): str is string {
  return typeof str === 'string' || str instanceof String;
}

export function isObject<T extends {}>(obj: any): obj is T {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    !(obj instanceof RegExp) &&
    !(obj instanceof Date)
  );
}

export function isArray<T>(array: any): array is T[] {
  return (
    (Array.isArray && Array.isArray(array)) ||
    (array && typeof array.length === 'number' && array.constructor === Array)
  );
}

export function isFunction<T = (...args: any) => any>(fn: any): fn is T {
  return fn && {}.toString.call(fn) === '[object Function]';
}

export function isNumeric(value: any, base = 10): value is number {
  const parsedInt = parseInt(value, base);
  return !isNaN(parsedInt);
}

export function getObjectValue(
  obj: any,
  path: string,
  defaultValue?: any
): any {
  return (
    (isString(path) &&
      isObject(obj) &&
      path
        .split('.')
        // @ts-ignore TODO: fix noImplicitAny error here
        .reduce((o: any, k: string) => (isObject(o) ? o[k] : ''), obj)) ||
    defaultValue
  );
}

export function hasObject(obj: any, path: string) {
  return isObject(getObjectValue(obj, path));
}
