export function delay(fn: () => Promise<any>, wait: number) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      fn().then(resolve, reject);
    }, wait);
  });
}
