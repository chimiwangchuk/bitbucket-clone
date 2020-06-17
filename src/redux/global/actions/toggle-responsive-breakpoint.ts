import { TOGGLE_UP_TO_SMALL_BREAKPOINT } from './';

export const toggleUpToSmallBreakpoint = (isUpToSmallBreakpoint: boolean) => {
  return {
    type: TOGGLE_UP_TO_SMALL_BREAKPOINT,
    payload: isUpToSmallBreakpoint,
  };
};
