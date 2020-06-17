/**
 * Find last instance in an array that satisfies the given predicate
 */
// @ts-ignore TODO: fix noImplicitAny error here
function findLast(array, predicate) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return array[i];
    }
  }

  return null;
}

/**
 * Get the timings for the last resource fetch where the url matches the given substring
 */
export function getResourceTimings(urlSubstring: string) {
  const emptyTimings = {
    transferSize: -1,
    duration: -1,
    responseDuration: -1,
    requestWaitingTime: -1,
    encodedBodySize: -1,
    present: false,
  };

  if (
    !window.performance ||
    typeof window.performance.getEntriesByType !== 'function'
  ) {
    return emptyTimings;
  }

  const resources = window.performance.getEntriesByType('resource');
  // @ts-ignore TODO: fix noImplicitAny error here
  const timings = findLast(resources, r => r.name.includes(urlSubstring));

  if (!timings) {
    return emptyTimings;
  }

  timings.present = true;
  timings.requestWaitingTime = Math.ceil(
    timings.responseStart - timings.requestStart
  );
  timings.responseDuration = Math.ceil(
    timings.responseEnd - timings.responseStart
  );

  return timings;
}
