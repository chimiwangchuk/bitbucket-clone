// @ts-ignore TODO: fix noImplicitAny error here
import { detectIe } from 'detect-msie';
// @ts-ignore TODO: fix noImplicitAny error here
import cookie from 'js-cookie';

const browser = detectIe();

export default () => {
  const isBrowserMsie11 = cookie.getJSON('bb_browser_msie11');

  // check if we previously set a cookie and that it hasn't expired
  // otherwise use feature detection to determine if the browser is IE 11
  // and set a cookie with a 7 day expiry
  if (isBrowserMsie11) {
    return true;
  } else if (browser.isIe11) {
    cookie.set('bb_browser_msie11', true, { expires: 7 });
    return true;
  }

  return false;
};
