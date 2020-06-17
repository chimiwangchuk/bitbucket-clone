import { getContext } from 'redux-saga/effects';
import { ApiShape } from 'src/redux/pull-request/api';

export const SAGAS_CONTEXT_KEY_PR_APIS = 'pullRequestApi';

/**
 * Helper for getting the pull request apis object from redux-saga context.
 *
 * REMEMBER! to use yield* to get the return instead of the yield.
 */
export function* getPullRequestApis(): Generator<unknown, ApiShape, unknown> {
  const api = yield getContext(SAGAS_CONTEXT_KEY_PR_APIS);
  return api as ApiShape;
}
