import mitt from 'mitt';

const OAUTH_ACCEPT_OR_DENY_EVENT = 'oauth-accept-deny';
const EMIT_OAUTH_ACCEPT_OR_DENY_EVENT = 'emit-oauth-accept-deny';
const emitter = mitt();

export type AcceptOrDenyArgs = {
  moduleId: string;
  accepted: boolean;
};

export type OnAcceptOrDenyFn = (args: AcceptOrDenyArgs) => void;

export function onAcceptOrDeny(fn: OnAcceptOrDenyFn): () => any {
  emitter.on(OAUTH_ACCEPT_OR_DENY_EVENT, fn);
  return () => emitter.off(OAUTH_ACCEPT_OR_DENY_EVENT, fn);
}

export type AcceptOrDenyOptions = {
  moduleId: string;
  name: string;
  scopes: string;
};

// return Promise<AcceptOrDenyArgs & { unlisten: Function }>
// eslint-disable-next-line require-await
export async function onAcceptOrDenyAsync(
  opts: AcceptOrDenyOptions
): Promise<any> {
  emitter.emit(EMIT_OAUTH_ACCEPT_OR_DENY_EVENT, opts);
  return new Promise(resolve => {
    const unlisten = onAcceptOrDeny((args: AcceptOrDenyArgs) => {
      unlisten();
      resolve(args);
    });
  });
}

export function accept(moduleId: string): void {
  emitter.emit(OAUTH_ACCEPT_OR_DENY_EVENT, { moduleId, accepted: true });
}

export function deny(moduleId: string): void {
  emitter.emit(OAUTH_ACCEPT_OR_DENY_EVENT, { moduleId, accepted: false });
}

export function onEmitAcceptOrDeny(
  fn: (options: AcceptOrDenyOptions, accept: () => any, deny: () => any) => void
): () => any {
  function emitFn(options: AcceptOrDenyOptions) {
    fn(
      options,
      () => accept(options.moduleId),
      () => deny(options.moduleId)
    );
  }
  emitter.on(EMIT_OAUTH_ACCEPT_OR_DENY_EVENT, emitFn);
  return () => emitter.off(EMIT_OAUTH_ACCEPT_OR_DENY_EVENT, emitFn);
}
