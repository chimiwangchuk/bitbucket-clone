import { UP_TO_SMALL_BREAKPOINT_ACTIVE_WIDTH } from 'src/sections/global/constants';

// Note: do not use window.screen.width here because Chromedriver
// does not set that value reliably.
export const isUpToSmallBreakpoint = () => {
  return (
    Math.max(
      document.documentElement ? document.documentElement.clientWidth : 0,
      window.innerWidth || 0
    ) < UP_TO_SMALL_BREAKPOINT_ACTIVE_WIDTH
  );
};
