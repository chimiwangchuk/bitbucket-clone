import { TOGGLE_MOBILE_HEADER } from './';

export default (isMobile: boolean) => {
  return {
    type: TOGGLE_MOBILE_HEADER,
    payload: isMobile,
  };
};
