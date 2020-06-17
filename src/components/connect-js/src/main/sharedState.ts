export type SharedState = {
  principalId?: string;
  principalType?: string;
};

let getter: () => SharedState = () => ({});
// eslint-disable-next-line no-return-assign
export const sharedStateProvider = (fn: () => SharedState) => (getter = fn);
export const getSharedState = (): SharedState => getter();
