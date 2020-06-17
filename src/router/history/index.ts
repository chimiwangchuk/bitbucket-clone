import { createBrowserHistory } from 'history';
import once from 'lodash-es/once';

const browserHistory = createBrowserHistory();

// @ts-ignore TODO: fix noImplicitAny error here
export const createSafeHistory = history => {
  let cleaned = false;
  let listeners: { unsubscribe: () => void }[] = [];

  // @ts-ignore TODO: fix noImplicitAny error here
  const listen = callback => {
    if (cleaned) {
      return () => {};
    }

    const unsubscribe = once(history.listen(callback));

    const listener = {
      unsubscribe,
    };

    listeners.push(listener);

    return once(() => {
      listener.unsubscribe();
    });
  };

  const cleanup = () => {
    listeners.forEach(({ unsubscribe }) => {
      unsubscribe();
    });

    cleaned = true;
    listeners = [];
  };

  return {
    length: history.length,
    location: history.location,
    action: history.action,
    index: history.index,
    entries: history.entries,
    // @ts-ignore TODO: fix noImplicitAny error here
    push: (path: string, params) => history.push(path, params),
    // @ts-ignore TODO: fix noImplicitAny error here
    replace: (path: string, params) => history.replace(path, params),
    go: (n: number) => history.go(n),
    goBack: () => history.goBack(),
    goForward: () => history.goForward(),
    // @ts-ignore TODO: fix noImplicitAny error here
    createHref: (...args) => history.createHref(...args),
    // Memory only
    canGo: (n: number) => {
      if (history.canGo) {
        return history.canGo(n);
      }
      return true;
    },
    listen,
    // @ts-ignore TODO: fix noImplicitAny error here
    block: (blocker: string | ((location, action) => string)) =>
      history.block(blocker),
    destroy: cleanup,
  };
};

export default browserHistory;
