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

export function groupBy(
  list: any[],
  keyGetter: (item: any) => any
): Map<string, any> {
  const map = new Map();
  list.forEach((item: any) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function flatMerge(
  a: { [x: string]: any } = {},
  b: { [x: string]: any } = {}
) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  const len = Math.max(aKeys.length, bKeys.length);
  const out = {};
  for (let i = 0; i < len; i++) {
    if (aKeys[i] && a[aKeys[i]]) {
      // @ts-ignore TODO: fix noImplicitAny error here
      out[aKeys[i]] = a[aKeys[i]];
    }
    if (bKeys[i] && b[bKeys[i]]) {
      // @ts-ignore TODO: fix noImplicitAny error here
      out[bKeys[i]] = b[bKeys[i]];
    }
  }
  return out;
}
