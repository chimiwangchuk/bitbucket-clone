import { race, take, all, delay } from 'redux-saga/effects';
import { statsdApiClient } from 'src/utils/metrics';
import {
  LOAD_DIFFSTAT,
  FETCH_DIFF,
  INITIAL_DIFFS_RENDERED,
  LOAD_PULL_REQUEST,
} from '../actions';

const VIEW_PR_TIMEOUT = 30 * 1000;

export function* viewPullRequestCapabilitySaga() {
  const { viewPRSuccess, viewPRFailure, timeout } = yield race({
    viewPRSuccess: all([
      take(INITIAL_DIFFS_RENDERED),
      take(LOAD_PULL_REQUEST.SUCCESS),
      take(LOAD_DIFFSTAT.SUCCESS),
      take(FETCH_DIFF.SUCCESS),
    ]),
    viewPRFailure: race({
      pullRequest: take(LOAD_PULL_REQUEST.ERROR),
      diffstat: take(LOAD_DIFFSTAT.ERROR),
      diff: take(FETCH_DIFF.ERROR),
    }),
    timeout: delay(VIEW_PR_TIMEOUT),
  });

  if (viewPRSuccess) {
    statsdApiClient.increment('frontbucket.capability.viewPullRequest.success');
    return;
  }

  let failureKind = 'unknown';
  if (viewPRFailure) {
    const { diff, diffstat, pullRequest } = viewPRFailure;
    if (diff) {
      failureKind = 'load-diff';
    } else if (diffstat) {
      failureKind = 'load-diffstat';
    } else if (pullRequest) {
      failureKind = 'load-pullRequest';
    }
  } else if (timeout) {
    failureKind = 'timeout';
  }

  statsdApiClient.increment('frontbucket.capability.viewPullRequest.failure', {
    tags: [`failure_kind:${failureKind}`],
  });
}
