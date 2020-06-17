import mitt from 'mitt';

export const REPLACE_CONTENT_EVENT = 'replace-content';
export const emitter = mitt();

export function replaceContentHandler(fn: any): { unlisten: () => any } {
  emitter.on(REPLACE_CONTENT_EVENT, fn);
  return {
    unlisten: () => emitter.off(REPLACE_CONTENT_EVENT, fn),
  };
}
