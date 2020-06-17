import { ISO8601DateString } from 'src/types/pull-request';
import { Link } from 'src/components/types';
import {
  POLLED_PULLREQUEST,
  LOAD_PULL_REQUEST,
  FETCH_COMMENTS,
  FETCH_DIFF,
  ENTERED_CODE_REVIEW,
  EXITED_CODE_REVIEW,
} from './actions';

export type PullRequestPollingLinks = {
  diff: Link;
  diffstat: Link;
};

export type PullRequestPollingState = {
  lastPollTime: ISO8601DateString | null;
  needsDiff: boolean;
  needsComments: boolean;
  needsPullRequest: boolean;
  links: PullRequestPollingLinks | null | undefined;
};

export const initialState: PullRequestPollingState = {
  lastPollTime: null,
  needsDiff: false,
  needsComments: false,
  needsPullRequest: false,
  links: null,
};

// @ts-ignore TODO: fix noImplicitAny error here
export default (state = initialState, action): PullRequestPollingState => {
  switch (action.type) {
    case ENTERED_CODE_REVIEW:
    case EXITED_CODE_REVIEW:
      // We leave lastpoll incase they revisit within the stale timer
      return {
        ...state,
        needsComments: false,
        needsPullRequest: false,
        needsDiff: false,
        links: null,
      };
    // This is an imperfect reset since we would be fetching DIFF, DIFFSTAT, CONFLICTS
    case FETCH_DIFF.SUCCESS:
      return { ...state, needsDiff: false };
    case FETCH_COMMENTS.SUCCESS:
      return { ...state, needsComments: false };
    case LOAD_PULL_REQUEST.SUCCESS:
      return {
        ...state,
        needsPullRequest: false,
        lastPollTime: action.payload.result.lastPoll,
      };
    case POLLED_PULLREQUEST: {
      const {
        needsDiff,
        needsComments,
        needsPullRequest,
        lastModified,
        links,
      } = action.payload;

      // Never removes existing "needs", only aggregates until the appropriate fetch has happened
      return {
        ...state,
        lastPollTime: lastModified,
        needsDiff: needsDiff || state.needsDiff,
        needsComments: needsComments || state.needsComments,
        needsPullRequest: needsPullRequest || state.needsPullRequest,
        links: links || state.links,
      };
    }
    default:
      return state;
  }
};
