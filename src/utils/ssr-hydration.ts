import { BucketState } from 'src/types/state';
import { canHydrateFromSsr, getSsrState } from './ssr';

type HydratableStateKey = 'reduxStoreState' | 'resourceStoreState';

const getHydratableState = (key: HydratableStateKey): BucketState | any =>
  canHydrateFromSsr() ? getSsrState()[key] : undefined;

export const getResourceStoreSsrState = (): any =>
  getHydratableState('resourceStoreState');

export const getReduxStoreSsrState = (): BucketState | undefined =>
  getHydratableState('reduxStoreState');
