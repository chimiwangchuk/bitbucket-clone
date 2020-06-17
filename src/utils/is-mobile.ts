import { MOBILE_HEADER_ACTIVE_WIDTH } from 'src/sections/global/constants';

// Note: do not use window.screen.width here because Chromedriver
// does not set that value reliably.
export default function isMobile() {
  return (
    Math.max(
      document.documentElement ? document.documentElement.clientWidth : 0,
      window.innerWidth || 0
    ) < MOBILE_HEADER_ACTIVE_WIDTH
  );
}
