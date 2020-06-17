import { debounce } from 'lodash-es';

const DEFAULT_INACTIVITY = 1000 * 60 * 1; // one minute
const MAX_INTERVAL = 1000 * 60 * 10; // 10 minutes
/**
 * Inspiration stolen from confluence and bitbucket-core.
 */
export const backOffPoller = (
  initialInterval: number,
  inactivityInterval: number = DEFAULT_INACTIVITY
) => {
  // eslint-disable-next-line no-param-reassign
  initialInterval = Math.min(
    Number.MAX_SAFE_INTEGER,
    Math.max(1, initialInterval)
  ); // safety clamp

  let intervalMultiplier = 1;
  const incrementor = setInterval(() => {
    intervalMultiplier = intervalMultiplier + 1;
  }, inactivityInterval);

  // eslint-disable-next-line no-return-assign
  const resetMultiplier = () => (intervalMultiplier = 1);
  const debouncedReset = debounce(resetMultiplier, 100);

  // Listen for activity
  document.body.addEventListener('click', resetMultiplier);
  document.body.addEventListener('touchstart', resetMultiplier);
  window.addEventListener('scroll', debouncedReset);

  return {
    // For polling we cap the interval at 10min
    calculateDelay: () =>
      Math.min(MAX_INTERVAL, initialInterval * intervalMultiplier),
    cleanup: () => {
      clearInterval(incrementor);
      document.body.removeEventListener('click', resetMultiplier);
      document.body.removeEventListener('touchstart', resetMultiplier);
      window.removeEventListener('scroll', debouncedReset);
    },
  };
};
