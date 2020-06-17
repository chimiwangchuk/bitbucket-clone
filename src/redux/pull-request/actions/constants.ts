import { createAsyncAction, createAsyncActionE } from 'src/redux/actions';
import { PullRequestPollingLinks } from '../polling-reducer';

export const prefixed = (action: string) => `pullRequest/${action}`;

export const COLLAPSE_TASKS_CARD = prefixed('COLLAPSE_TASKS_CARD');
export const LOAD_PULL_REQUEST = createAsyncAction(
  prefixed('LOAD_PULL_REQUEST')
);

export const CLOSE_OUTDATED_COMMENTS_DIALOG = prefixed(
  'CLOSE_OUTDATED_COMMENTS_DIALOG'
);
export const OPEN_OUTDATED_COMMENTS_DIALOG = prefixed(
  'OPEN_OUTDATED_COMMENTS_DIALOG'
);

export const OPEN_DIFF_COMMENTS_DIALOG = prefixed('OPEN_DIFF_COMMENTS_DIALOG');

export const CLOSE_DIFF_COMMENTS_DIALOG = prefixed(
  'CLOSE_DIFF_COMMENTS_DIALOG'
);

export const OPEN_NONRENDERED_DIFF_COMMENTS_DIALOG = prefixed(
  'OPEN_NONRENDERED_DIFF_COMMENTS_DIALOG'
);
export const CLOSE_NONRENDERED_DIFF_COMMENTS_DIALOG = prefixed(
  'CLOSE_NONRENDERED_DIFF_COMMENTS_DIALOG'
);

export const OPEN_FILE_COMMENT = prefixed('OPEN_FILE_COMMENT');
export const CLOSE_FILE_COMMENT = prefixed('CLOSE_FILE_COMMENT');
export const COMMIT_RANGE_CHANGE = prefixed('COMMIT_RANGE_CHANGE');

export const POLLED_PULLREQUEST = prefixed('POLLED_PULLREQUEST');

export const APPROVE = createAsyncAction(prefixed('APPROVE'));
export const UNAPPROVE = createAsyncAction(prefixed('UNAPPROVE'));
export const UPDATE_PARTICIPANTS = createAsyncAction(
  prefixed('UPDATE_PARTICIPANTS')
);

export const FETCH_DIFF = createAsyncAction(prefixed('FETCH_DIFF'));
export const EXPAND_CONTEXT = createAsyncAction(prefixed('EXPAND_CONTEXT'));
export const FETCH_COMMENT_CONTEXT = createAsyncAction(
  prefixed('FETCH_COMMENT_CONTEXT')
);

export const FETCH_PULL_REQUEST_ANNOTATIONS = createAsyncAction(
  prefixed('FETCH_PULL_REQUEST_ANNOTATIONS')
);

export const FETCH_IS_PIPELINES_ENABLED = createAsyncAction(
  prefixed('FETCH_IS_PIPELINES_ENABLED')
);

export const FETCH_CODE_INSIGHTS_REPORTS = createAsyncAction(
  prefixed('FETCH_CODE_INSIGHTS_REPORTS')
);

export const FETCH_CODE_INSIGHTS_ANNOTATIONS = createAsyncAction(
  prefixed('FETCH_CODE_INSIGHTS_ANNOTATIONS')
);

export const FETCH_COMMENTS = createAsyncAction(prefixed('FETCH_COMMENTS'));

export const FETCH_TASKS = createAsyncAction(prefixed('FETCH_TASKS'));
export const TASK_STATE_CHANGE = createAsyncAction(
  prefixed('TASK_STATE_CHANGE')
);
export const TASK_CREATE = createAsyncAction(prefixed('TASK_CREATE'));
export const TASK_EDIT = createAsyncAction(prefixed('TASK_EDIT'));
export const TASKS_EDIT = {
  ...createAsyncAction(prefixed('TASKS_EDIT')),
  PARTIAL_SUCCESS: `${prefixed('TASKS_EDIT')}_PARTIAL_SUCCESS`,
};
export const TASKS_CLEAR_ERRORS = prefixed('TASKS_CLEAR_ERRORS');
export const TASK_DELETE = createAsyncAction(prefixed('TASK_DELETE'));
export const TOGGLE_CREATE_COMMENT_TASK_INPUT = prefixed(
  'TOGGLE_CREATE_COMMENT_TASK_INPUT'
);
export const TOGGLE_EDIT_COMMENT_TASK_INPUT = prefixed(
  'TOGGLE_EDIT_COMMENT_TASK_INPUT'
);

export const ADD_COMMENT = createAsyncAction(prefixed('ADD_COMMENT'));
export const DELETE_COMMENT = createAsyncAction(prefixed('DELETE_COMMENT'));
export const LOAD_DIFFSTAT = createAsyncAction(prefixed('LOAD_DIFFSTAT'));
export const RETRY_LOAD_DIFF_STAT = 'RETRY_LOAD_DIFF_STAT';

export const START_WATCH = createAsyncActionE(prefixed('START_WATCH'));
export const STOP_WATCH = createAsyncActionE(prefixed('STOP_WATCH'));
export const LOAD_WATCH = createAsyncActionE(prefixed('LOAD_WATCH'));

export const FETCH_OUTDATED_COMMENT_CONTEXT = createAsyncAction(
  'FETCH_OUTDATED_COMMENT_CONTEXT'
);

export const FETCH_LARGE_FILE_COMMENT_CONTEXT = createAsyncAction(
  prefixed('FETCH_LARGE_FILE_COMMENT_CONTEXT')
);

export const FETCH_CONFLICTS = createAsyncAction(prefixed('FETCH_CONFLICTS'));

export const FETCH_MERGE_CHECKS = createAsyncAction(
  prefixed('FETCH_MERGE_CHECKS')
);
export const FETCH_MERGE_CHECKS_RETRY = prefixed('FETCH_MERGE_CHECKS_RETRY');

export const HIDE_ERROR_DIALOG = prefixed('HIDE_ERROR_DIALOG');
export const SET_APPROVAL_LOADER = prefixed('SET_APPROVAL_LOADER');
export const UNLOAD_PULL_REQUEST = prefixed('UNLOAD_PULL_REQUEST');

export const ENTERED_CODE_REVIEW = prefixed('ENTERED_CODE_REVIEW');
export const EXITED_CODE_REVIEW = prefixed('EXITED_CODE_REVIEW');

export const DIFFS_HAVE_RENDERED = prefixed('DIFFS_HAVE_RENDERED');
export const INITIAL_DIFFS_RENDERED = prefixed('INITIAL_DIFFS_RENDERED');

export const HIGHLIGHT_ACTIVE_TREE_ITEM = prefixed(
  'HIGHLIGHT_ACTIVE_TREE_ITEM'
);
export const PERMALINK_HASH_CHANGE = prefixed('PERMALINK_HASH_CHANGE');
export const ACTIVE_DIFF_PERMALINK = prefixed('ACTIVE_DIFF_PERMALINK');
export const RESET_ACTIVE_TREE_ITEM = prefixed('RESET_ACTIVE_TREE_ITEM');
export const PUBLISH_FILEPATH_CLICKED_FACT = prefixed(
  'PUBLISH_FILEPATH_CLICKED_FACT'
);

export const TOGGLE_SINGLE_FILE_MODE = prefixed('TOGGLE_SINGLE_FILE_MODE');
export const TOGGLE_SINGLE_FILE_MODE_ELIGIBILITY = prefixed(
  'TOGGLE_SINGLE_FILE_MODE_ELIGIBILITY'
);

export const TOGGLE_SINGLE_FILE_MODE_SETTINGS_HEADER_VISIBILITY = prefixed(
  'TOGGLE_SINGLE_FILE_MODE_SETTINGS_HEADER_VISIBILITY'
);

export const TOGGLE_STICKY_HEADER_ACTIVE_STATUS = prefixed(
  'TOGGLE_STICKY_HEADER_ACTIVE_STATUS'
);

export const SCROLL_TO_FILE = prefixed('SCROLL_TO_FILE');
export const scrollToAnchor = (anchorId: string) => ({
  type: SCROLL_TO_FILE,
  payload: anchorId,
});
export const SCROLL_TO_COMMENT_IN_MODAL = prefixed(
  'SCROLL_TO_COMMENT_IN_MODAL'
);
export const onPermalinkHashChange = (permalink: string) => ({
  type: PERMALINK_HASH_CHANGE,
  payload: permalink,
});

export const PUBLISH_BASE_PULL_REQUEST_FACT = prefixed(
  'PUBLISH_BASE_PULL_REQUEST_FACT'
);
export const publishBasePullRequestFact = (factName: string) => ({
  type: PUBLISH_BASE_PULL_REQUEST_FACT,
  payload: { name: factName },
});

export const PUBLISH_PULL_REQUEST_DIFF_FACT = prefixed(
  'PUBLISH_PULL_REQUEST_DIFF_FACT'
);

export const REFRESH_CODE_REVIEW_DATA = prefixed('REFRESH_CODE_REVIEW_DATA');
export const REFRESH_CODE_REVIEW_DATA_FROM_POLL_RESULTS = prefixed(
  'REFRESH_CODE_REVIEW_DATA_FROM_POLL_RESULTS'
);

export type RefreshCodeReviewDataOptions = {
  needsDiff: boolean;
  needsComments: boolean;
  needsPullRequest: boolean;
  links?: PullRequestPollingLinks | null;
};
export const refreshCodeReviewData = (
  payload: RefreshCodeReviewDataOptions
) => ({
  type: REFRESH_CODE_REVIEW_DATA,
  payload,
});

export const UPDATE_BUILDS = prefixed('UPDATE_BUILDS');

export const CLOSE_CODE_REVIEW_WELCOME_DIALOG = prefixed(
  'CLOSE_CODE_REVIEW_WELCOME_DIALOG'
);

export const UPDATE_EDITOR_OPEN_STATE = prefixed('UPDATE_EDITOR_OPEN_STATE');

export const onEditorOpenStateChange = (isOpen: boolean) => ({
  type: UPDATE_EDITOR_OPEN_STATE,
  payload: isOpen,
});

export class EnteredCodeReviewAction {
  readonly type = ENTERED_CODE_REVIEW;
  constructor(
    public owner: string,
    public slug: string,
    public id: number | string
  ) {}
}

export const UPDATE_PULL_REQUEST_LINKS = prefixed('UPDATE_PULL_REQUEST_LINKS');

export const FETCH_BRANCH_SYNC_INFO = createAsyncAction(
  prefixed('FETCH_BRANCH_SYNC_INFO')
);

export const SET_WELCOME_TOUR_ACTIVE = prefixed('SET_WELCOME_TOUR_ACTIVE');
export const setWelcomeTourActive = (isActive: boolean) => ({
  type: SET_WELCOME_TOUR_ACTIVE,
  payload: isActive,
});

export const REVERT_DIALOG = {
  OPEN: prefixed('OPEN_REVERT_DIALOG'),
  CLOSE: prefixed('CLOSE_REVERT_DIALOG'),
};

export const REVERT_PULL_REQUEST = createAsyncAction(
  prefixed('REVERT_PULL_REQUEST')
);

export type RevertPullRequestOptions = {
  branchName: string;
  commitMessage?: string;
};

export const revertPullRequest = (options: RevertPullRequestOptions) => ({
  type: REVERT_PULL_REQUEST.REQUEST,
  payload: options,
});

export const FETCH_DESTINATION_BRANCH = createAsyncAction(
  prefixed('FETCH_DESTINATION_BRANCH')
);

export const FETCH_SOURCE_BRANCH_DETAILS = createAsyncAction(
  prefixed('FETCH_SOURCE_BRANCH_DETAILS')
);

export const FETCH_COMMENT_LIKES = createAsyncAction(
  prefixed('FETCH_COMMENT_LIKES')
);

export const TOGGLE_COMMENT_LIKE = createAsyncAction(
  prefixed('TOGGLE_COMMENT_LIKE')
);

export const PULL_REQUEST_OPENED = prefixed('PULL_REQUEST_OPENED');

export const PUBLISH_PULL_REQUEST_TRACK_EVENT = prefixed(
  'PUBLISH_PULL_REQUEST_TRACK_EVENT'
);

export const PUBLISH_PULL_REQUEST_UI_EVENT = prefixed(
  'PUBLISH_PULL_REQUEST_UI_EVENT'
);

export type PullRequestEventAttributesType = {
  action: string;
  actionSubject: string;
  actionSubjectId: string;
  attributes?: object;
};

export const publishPullRequestTrackEvent = (
  payload: PullRequestEventAttributesType
) => ({
  type: PUBLISH_PULL_REQUEST_TRACK_EVENT,
  payload,
});

export const publishPullRequestUiEvent = (
  payload: PullRequestEventAttributesType
) => ({
  type: PUBLISH_PULL_REQUEST_UI_EVENT,
  payload,
});
