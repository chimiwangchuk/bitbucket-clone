import { call, select } from 'redux-saga/effects';

import { getTokenDetails, getAuthHeader } from 'src/utils/get-token-details';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { getIsExpiresDurationInApiToken } from 'src/selectors/feature-selectors';

export const createJiraIssueUserPreferencesKey = (repoUuid: string) =>
  `default-jira-project:${repoUuid}`;

export function* authHeader() {
  const currentUser = yield select(getCurrentUser);
  const expiresDurationInApiToken = yield select(
    getIsExpiresDurationInApiToken
  );
  const options = yield call(
    getTokenDetails,
    currentUser && currentUser.uuid,
    expiresDurationInApiToken
  );
  const header = yield call(getAuthHeader, options);
  return header;
}
