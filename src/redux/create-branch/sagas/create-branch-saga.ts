import * as Sentry from '@sentry/browser';
import { all, call, put, race, select, take } from 'redux-saga/effects';
import { uniqBy } from 'lodash-es';

import { showFlagComponent, showFlag } from 'src/redux/flags';
import branchUrls from 'src/sections/repository/sections/branches/urls';
import repoUrls from 'src/sections/repository/urls';
import {
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
  getRepositoryBranchingModel,
} from 'src/selectors/repository-selectors';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { Action } from 'src/types/state';

import messages from 'src/sections/global/components/flags/create-branch/create-branch-error-flag.i18n';
import {
  EXTENDED_BRANCH_KINDS,
  CREATE_BRANCH_ERROR_TYPE,
  CREATE_FROM,
} from 'src/sections/create-branch/constants';
import {
  getJiraIssueTypeForAnalytics,
  getRepositoryForIssue,
  setRepositoryForIssue,
} from 'src/sections/create-branch/jira';

import {
  CreateBranchError,
  CreateFromPayload,
  Ref,
} from 'src/sections/create-branch/types';
import {
  generateBranchName,
  getRepoFullName,
  getRefs,
  getRef,
  generateRefSelectorOptions,
  getRepoOwnerAndSlug,
  suggestFromBranch,
  moveMainBranchToTop,
} from 'src/sections/create-branch/utils';

import {
  CHANGE_BRANCH_TYPE,
  CREATE_BRANCH,
  changeFromBranch,
  closeCreateBranchRepoDialog,
  closeCreateBranchGlobalDialog,
  FETCH_REF_OPTIONS,
  FETCH_COMMIT_STATUSES,
  fetchRefOptions,
  fetchBranchingModel,
  onChangeRepository,
  FETCH_BRANCHING_MODEL,
  setSuggestedFromBranch,
  ChangeRepositoryAction,
  FetchRefOptionsSuccessAction,
  FetchRefOptionsAction,
  loadRepository,
  LOAD_REPOSITORY,
} from '../actions';

import {
  getCreateBranchParams,
  getBranchTypesVisible,
  getJiraIssue,
  getRefSelectorState,
  getSelectedRepoOwnerAndSlug,
  getSelectedRepoFullSlug,
  getSelectedBranchType,
  getWorkflowBranches,
  getSelectedRepositoryMainBranch,
} from '../selectors';

const getErrorType = (
  status: number,
  errorKey: string | null | undefined,
  message: string | null | undefined
): CREATE_BRANCH_ERROR_TYPE => {
  if (status >= 500 || !errorKey || !message) {
    return CREATE_BRANCH_ERROR_TYPE.GENERIC;
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  return CREATE_BRANCH_ERROR_TYPE[errorKey] || CREATE_BRANCH_ERROR_TYPE.OTHER;
};

export function redirectToBranchPage(href: string) {
  window.location.assign(href);
}

export function* handleCreateBranchSuccessSaga(
  createFrom: CREATE_FROM,
  branch: any
) {
  // Once the branch page is a SPA, we will also
  // want to show the "create branch success" flag
  // here after redirecting the user.

  if (createFrom === CREATE_FROM.REPO_DIALOG) {
    yield put(closeCreateBranchRepoDialog());
  } else if (createFrom === CREATE_FROM.GLOBAL_DIALOG) {
    yield put(closeCreateBranchGlobalDialog());
  }

  yield redirectToBranchPage(branch.links.html.href);
}

export function* handleLoadingBranchingModelErrorSaga() {
  yield put({ type: FETCH_BRANCHING_MODEL.ERROR });
  /**
   *  this error flag is stateless and
   *  auto-dismiss disable
   * */
  yield put(
    showFlag({
      id: FETCH_BRANCHING_MODEL.ERROR,
      iconType: 'warning',
      title: { msg: messages.branchingModelsLoadingErrorTitle },
      description: { msg: messages.branchingModelsLoadingErrorDescription },
    })
  );
}
export function* handleCreateBranchErrorSaga(error: CreateBranchError) {
  yield put({
    type: CREATE_BRANCH.ERROR,
    payload: error,
  });
  yield put(showFlagComponent('create-branch-error'));
}

// @ts-ignore fix implicit any return type
export function* createBranchSaga(action: Action) {
  // eslint-disable-next-line prefer-destructuring
  const payload: CreateFromPayload = action.payload;
  const params = yield select(getCreateBranchParams);
  const [owner, slug] = yield select(getSelectedRepoOwnerAndSlug);
  const branchType = yield select(getSelectedBranchType);
  const branchTypeVisible = yield select(getBranchTypesVisible);
  const jiraIssue = yield select(getJiraIssue);
  const url = repoUrls.api.v20.branches(owner, slug);

  const body = JSON.stringify({
    name: generateBranchName(params.name, branchType),
    target: {
      hash: params.target.hash,
    },
  });

  const headers: HeadersInit = {
    ...jsonHeaders,
    'X-Bitbucket-ScreenName': payload.createFrom,
    // urlencode branch name because it can contain non-latin1 characters which are problematic in headers
    'X-Bitbucket-SourceBranch': encodeURIComponent(params.target.name),
  };

  if (branchTypeVisible) {
    headers['X-Bitbucket-BranchType'] = branchType
      ? branchType.kind
      : EXTENDED_BRANCH_KINDS.OTHER;
  }
  if (jiraIssue) {
    headers['X-Bitbucket-JiraIssueType'] = getJiraIssueTypeForAnalytics(
      jiraIssue
    );
  }

  const request = authRequest(url, {
    method: 'POST',
    body,
    headers,
  });

  try {
    const response = yield call(fetch, request);
    if (response.ok) {
      const branch = yield response.json();
      yield call(
        handleCreateBranchSuccessSaga,
        action.payload.createFrom,
        branch
      );
    } else {
      const { error } = yield response.json();
      const errorType = getErrorType(
        response.status,
        error.data && error.data.key,
        error.message
      );
      yield call(handleCreateBranchErrorSaga, {
        type: errorType,
        message: error.message,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield call(handleCreateBranchErrorSaga, {
      type: CREATE_BRANCH_ERROR_TYPE.GENERIC,
    });
  }
}

export function* fetchRefOptionsSaga({
  // @ts-ignore TODO: fix noImplicitAny error here
  payload: { search, mainBranch, repositoryFullSlug },
}) {
  const [owner, slug] = getRepoOwnerAndSlug(repositoryFullSlug);
  const url = repoUrls.api.v20.findRefs(owner, slug, search);
  const request = authRequest(url);
  try {
    const response = yield call(fetch, request);
    if (response.ok) {
      const res = yield response.json();
      let refs = getRefs(res.values);
      const branchingModel = yield select(getRepositoryBranchingModel);
      // @ts-ignore TODO: fix noImplicitAny error here
      const searchCondition = branch => {
        if (!search || !branch.name) {
          return true;
        }
        if (branch.name.includes(search)) {
          return true;
        }
        return false;
      };

      if (branchingModel) {
        const { development, production } = branchingModel;
        const priorityRefs: Ref[] = [development, production]
          .filter(
            b => !!b && !!b.branch && !b.use_mainbranch && searchCondition(b)
          )
          .map(b => ({
            hash: b.target ? b.target.hash : undefined,
            name: b.name,
            type: b.type.toUpperCase(),
          }));
        const uniqPriorityRefs = uniqBy(priorityRefs, 'name');
        const priorityRefNames = uniqPriorityRefs.map(b => b.name);
        const filteredRefs = refs.filter(
          b => !priorityRefNames.includes(b.name)
        );

        refs = [...uniqPriorityRefs, ...filteredRefs];
      }

      const reorderedRefs = moveMainBranchToTop(refs, mainBranch, !!search);
      const result: FetchRefOptionsSuccessAction = {
        type: FETCH_REF_OPTIONS.SUCCESS,
        payload: {
          mainRef: mainBranch ? getRef(mainBranch) : null,
          refs: generateRefSelectorOptions(reorderedRefs),
          hasMoreRefs: !!res.next,
        },
      };
      yield put(result);
    } else {
      yield put({
        type: FETCH_REF_OPTIONS.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_REF_OPTIONS.ERROR,
    });
  }
}

export function* selectDataAndFetchRefOptionsSaga({
  payload: { search },
}: FetchRefOptionsAction) {
  const repositoryFullSlug = yield select(getSelectedRepoFullSlug);
  const mainBranch = yield select(getSelectedRepositoryMainBranch);
  yield call(fetchRefOptionsSaga, {
    payload: {
      repositoryFullSlug,
      mainBranch,
      search,
    },
  });
}

// @ts-ignore fix implicit any return type
export function* fetchCommitStatusesSaga() {
  const [owner, slug] = yield select(getSelectedRepoOwnerAndSlug);
  const {
    target: { hash },
  } = yield select(getCreateBranchParams);
  const url = branchUrls.api.v20.commitStatuses(owner, slug, hash);
  const request = authRequest(url);
  try {
    const response = yield call(fetch, request);
    if (response.ok) {
      const { values: statuses } = yield response.json();
      yield put({
        type: FETCH_COMMIT_STATUSES.SUCCESS,
        payload: statuses,
      });
    } else {
      yield put({
        type: FETCH_COMMIT_STATUSES.ERROR,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    yield put({
      type: FETCH_COMMIT_STATUSES.ERROR,
    });
  }
}

// @ts-ignore fix implicit any return type
export function* fetchBranchingModelSaga() {
  const [owner, slug] = yield select(getSelectedRepoOwnerAndSlug);
  try {
    const url = repoUrls.api.v20.branchingModel(owner, slug);
    const request = authRequest(url);
    const response = yield call(fetch, request);
    if (response.ok) {
      const {
        development,
        production,
        branch_types: branchTypes,
      } = yield response.json();

      const devBranch = development && development.branch;
      const prodBranch = production && production.branch;

      yield put({
        type: FETCH_BRANCHING_MODEL.SUCCESS,
        payload: {
          development: devBranch ? getRef(devBranch) : null,
          production: prodBranch ? getRef(prodBranch) : null,
          branchTypes,
        },
      });
    } else {
      yield call(handleLoadingBranchingModelErrorSaga);
    }
  } catch (e) {
    Sentry.captureException(e);
    yield call(handleLoadingBranchingModelErrorSaga);
  }
}

export function* handleChangeRepositorySaga(action: ChangeRepositoryAction) {
  const {
    payload: { selected, selectedByUser },
  } = action;
  if (selectedByUser) {
    const issue = yield select(getJiraIssue);
    if (issue) {
      setRepositoryForIssue(issue, selected.value);
    }
  }

  const [owner, slug] = getRepoOwnerAndSlug(selected.value);
  yield put(loadRepository(owner, slug));
  yield take([LOAD_REPOSITORY.SUCCESS, LOAD_REPOSITORY.ERROR]);

  yield put(fetchRefOptions());
  yield put(fetchBranchingModel());
}

export function* setCurrentRepositorySaga() {
  const owner = yield select(getCurrentRepositoryOwnerName);
  const slug = yield select(getCurrentRepositorySlug);
  const fullName = getRepoFullName({ owner, slug });

  yield put(
    onChangeRepository(
      { value: fullName, label: fullName, data: undefined },
      false
    )
  );
}

export function* handleLoadRepositoriesSuccessSaga({ payload }: Action) {
  const { repositories } = payload;
  if (repositories && repositories.length !== 0) {
    const issue = yield select(getJiraIssue);
    let repoForIssue = null;
    if (issue) {
      const repoNameForIssue = getRepositoryForIssue(issue);
      repoForIssue =
        repoNameForIssue &&
        // @ts-ignore TODO: fix noImplicitAny error here
        repositories.find(r => r.full_name === repoNameForIssue);
    }

    const defaultRepo = repoForIssue || repositories[0];

    yield put(
      onChangeRepository(
        {
          value: defaultRepo.full_name,
          label: defaultRepo.full_name,
          data: undefined,
        },
        false
      )
    );
  }
}

export function* handleLoadRepositoriesErrorSaga() {
  yield put(showFlagComponent('create-branch-load-repositories-error'));
}

export function* suggestFromBranchSaga() {
  while (true) {
    // We need to trigger pre-selection in the following cases:
    //   - repository refs were successfully fetched AND
    //     branching model was fetched successfully or with an error
    //   - branch type was changed
    yield race({
      changeBranchType: take(CHANGE_BRANCH_TYPE),
      fetchBranchAndRefs: all([
        race({
          branchModelSuccess: take(FETCH_BRANCHING_MODEL.SUCCESS),
          branchModelFailure: take(FETCH_BRANCHING_MODEL.ERROR),
        }),
        take(FETCH_REF_OPTIONS.SUCCESS),
      ]),
    });

    const workflowBranches = yield select(getWorkflowBranches);
    const branchType = yield select(getSelectedBranchType);

    const fromBranch = suggestFromBranch(workflowBranches, branchType);
    if (fromBranch) {
      yield put(setSuggestedFromBranch(fromBranch));

      const refSelector = yield select(getRefSelectorState);
      // Change from branch only if user hasn't changed it already
      if (!refSelector.selectedByUser) {
        yield put(changeFromBranch(fromBranch, false));
      }
    }
  }
}
