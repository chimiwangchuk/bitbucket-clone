import mitt from 'mitt';
import { isFunction } from '../../utils';

export const emitter = mitt();

export function registerAnalyticsListener(
  event: any,
  fn?: any
): { unlisten: () => any } {
  if (isFunction(event)) {
    // eslint-disable-next-line no-param-reassign
    fn = event;
    // eslint-disable-next-line no-param-reassign
    event = '*';
  }
  emitter.on(event, fn);
  return {
    unlisten: () => emitter.off(event, fn),
  };
}
