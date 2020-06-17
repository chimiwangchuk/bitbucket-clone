import { call, put, select } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import { Action } from 'src/types/state';
import urls from 'src/sections/repository/urls';
import { DetailedBranch } from 'src/sections/repository/sections/branches/types';
import { getCurrentRepositoryFullSlug } from 'src/selectors/repository-selectors';
import authRequest, { jsonHeaders } from 'src/utils/fetch';
import { showFlag } from 'src/redux/flags';
import { captureMessageForResponse } from 'src/utils/sentry';
import messages from 'src/sections/repository/sections/branches/components/dialogs/bulk-delete-branches-dialog.i18n';
import {
  getSelectedBranches,
  getAllBranches,
  getBranchingModel,
} from '../selectors';
import {
  onToggleBranchSelectSave,
  BULK_DELETE_BRANCHES,
  closeBulkDeleteBranchesDialog,
  clearSelectedBranches,
  onToggleSelectionMode,
} from '../actions';
import { shouldAllowDelete } from '../utils';
import reloadBranchesSaga from './reload-branches-saga';

export function* toggleSelectAllSaga({
  payload: selectAllEnabled,
}: Action<boolean>) {
  const branches = yield select(getAllBranches);
  const branchingModel = yield select(getBranchingModel);
  let selectedBranches = yield select(getSelectedBranches);
  // Copy them so that we don't end up mutating the state.
  selectedBranches = [...selectedBranches];

  branches.forEach((branch: DetailedBranch) => {
    const selectedIndex = selectedBranches.findIndex(
      (br: DetailedBranch) => br.name === branch.name
    );
    const isSelected = selectedIndex >= 0;

    if (selectAllEnabled && !isSelected) {
      if (shouldAllowDelete(branch, branchingModel)) {
        selectedBranches.push(branch);
      }
    } else if (!selectAllEnabled && isSelected) {
      if (isSelected) {
        selectedBranches.splice(selectedIndex, 1);
      }
    }
  });

  yield put(onToggleBranchSelectSave(selectedBranches));
}

export function* toggleSelectOneSaga({
  payload: branch,
}: Action<DetailedBranch>) {
  let selectedBranches = yield select(getSelectedBranches);

  if (selectedBranches.find((br: DetailedBranch) => br.name === branch!.name)) {
    selectedBranches = selectedBranches.filter(
      (br: DetailedBranch) => br.name !== branch!.name
    );
  } else {
    selectedBranches = [...selectedBranches, branch!];
  }

  yield put(onToggleBranchSelectSave(selectedBranches));
}

export function* bulkDeleteBranchesSaga() {
  const selectedBranches: DetailedBranch[] = yield select(getSelectedBranches);
  const fullSlug = yield select(getCurrentRepositoryFullSlug);
  const url = urls.api.internal.bulkDeleteBranches(fullSlug);
  const request = authRequest(url, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      names: selectedBranches.map(br => br.name),
    }),
  });

  try {
    const response = yield call(fetch, request);
    if (response.ok) {
      yield put({
        type: BULK_DELETE_BRANCHES.SUCCESS,
      });
    } else {
      yield captureMessageForResponse(
        response,
        'Bulk deleting branches failed'
      );

      yield put({
        type: BULK_DELETE_BRANCHES.ERROR,
      });
    }
  } catch (error) {
    Sentry.captureException(error);
    yield put({
      type: BULK_DELETE_BRANCHES.ERROR,
    });
  }
}

export function* handleBulkDeleteBranchesSuccessSaga() {
  yield put(closeBulkDeleteBranchesDialog());
  yield put(clearSelectedBranches());
  yield put(onToggleSelectionMode(false));
  yield* reloadBranchesSaga();
  yield put(
    showFlag({
      title: { msg: messages.deleteSuccessTitle },
      description: {
        msg: messages.deleteSuccessDescription,
      },
      id: 'bulk-delete-branches-success',
      iconType: 'success',
      autoDismiss: true,
    })
  );
}

export function* handleBulkDeleteBranchesErrorSaga() {
  yield put(closeBulkDeleteBranchesDialog());
  yield put(
    showFlag({
      title: { msg: messages.deleteFailedTitle },
      description: {
        msg: messages.deleteFailedDescription,
      },
      id: 'bulk-delete-branches-error',
      iconType: 'error',
      autoDismiss: true,
    })
  );
}
