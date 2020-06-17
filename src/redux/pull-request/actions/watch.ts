import { LOAD_WATCH } from 'src/redux/pull-request/actions/constants';
import { Action } from 'src/types/state';

export const watchLoading = (): Action => ({
  type: LOAD_WATCH.BEGIN,
});

export const watchLoadingEnd = (watching: boolean): Action => ({
  type: LOAD_WATCH.END,
  payload: watching,
});
