/**
 * Debounce
 * @param {function} fn The function to debounce
 * @param {number} wait The time to wait
 */
export function debounce<T extends () => any>(fn: T, wait: number) {
  // @ts-ignore TODO: fix noImplicitAny error here
  let timeout;
  return function(...args: any[]) {
    // @ts-ignore TODO: fix noImplicitAny error here
    clearTimeout(timeout);
    // eslint-disable-next-line babel/no-invalid-this
    timeout = setTimeout(() => fn.apply(this, args), wait || 1);
  };
}

/**
 * Throttle
 * @param {function} fn The function to throttle
 * @param {number} delay The time to wait between invocations
 */
export function throttle<T extends () => any>(fn: T, delay: number) {
  let isThrottled = false;
  // @ts-ignore TODO: fix noImplicitAny error here
  let args;
  // @ts-ignore TODO: fix noImplicitAny error here
  let context;

  function wrapper() {
    if (isThrottled) {
      // eslint-disable-next-line prefer-rest-params
      args = arguments;
      // eslint-disable-next-line babel/no-invalid-this
      context = this;
      return;
    }

    isThrottled = true;
    // eslint-disable-next-line babel/no-invalid-this, prefer-rest-params
    fn.apply(this, arguments);

    setTimeout(() => {
      isThrottled = false;
      // @ts-ignore TODO: fix noImplicitAny error here
      if (args) {
        // @ts-ignore TODO: fix noImplicitAny error here
        wrapper.apply(context, args);
        args = context = null;
      }
    }, delay);
  }

  return wrapper;
}

/**
 * joinUrl
 * @param {string} host The host address (e.g https://some-domain.io)
 * @param {string} path The path to join (e.g /some/path/to/join)
 */
export function joinUrl(host: string, path: string) {
  if (path.startsWith(host)) {
    return path;
  }
  const cleanHost = host.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${cleanHost}/${cleanPath}`;
}
