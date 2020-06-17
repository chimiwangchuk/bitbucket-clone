import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { BucketState } from 'src/types/state';
import { publishUiEvent } from 'src/utils/analytics/publish';
import { LoadingStatus } from 'src/constants/loading-status';
import { Site } from 'src/redux/jira/types';
import { onCreateJiraIssueFormChangeVisibility } from 'src/redux/jira/actions';
import messages from 'src/sections/repository/sections/jira/components/create-jira-issue/create-jira-issue.i18n';
import { getJiraIssueSites } from 'src/redux/jira/selectors/jira-issue-selectors';

export const useCreateJiraIssueAction = () => {
  const dispatch = useDispatch();

  const sites = useSelector<
    BucketState,
    { fetchedStatus: LoadingStatus; list: Site[] }
  >(getJiraIssueSites);

  const preferencesFetchedStatus = useSelector<BucketState, LoadingStatus>(
    state => state.jira.createJiraIssue.preferences.fetchedStatus
  );

  // Create Jira issue action should only be visible after fetching both connected sites,
  // and the preferences for default site and project.
  // The reason why we defer the rendering is to make sure that the selected values (site and project)
  // won't change once the user is in the middle of creating an issue.
  const shouldBeVisible = () => {
    const hasSites =
      sites.fetchedStatus === LoadingStatus.Success && sites.list.length > 0;

    // We shouldn't bother about the outcome of fetching preferences, we don't want to hide the action
    // even if fetching preferences fails for any reason.
    const preferencesFetched =
      preferencesFetchedStatus === LoadingStatus.Success ||
      preferencesFetchedStatus === LoadingStatus.Failed;

    return hasSites && preferencesFetched;
  };

  return {
    isVisible: shouldBeVisible(),
    label: <FormattedMessage {...messages.createIssueButtonLabel} />,
    onClick: (args: { commentId: number; isVisible: boolean }) => {
      publishUiEvent({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'createJiraIssueFromPrCommentButton',
        source: 'pullRequestScreen',
      });
      dispatch(onCreateJiraIssueFormChangeVisibility(args));
    },
  };
};

export type CreateJiraIssueActionType = {
  isVisible: boolean;
  label: JSX.Element;
  // @ts-ignore TODO: fix noImplicitAny error here
  onClick: ({ commentId: number, isVisible: boolean }) => void;
};

// We cannot use hooks in class components, this is created to solve that problem.
// Use this component as a wrapper in cases where you need to add a "Create Jira issue" action.
export const WithCreateJiraIssueAction = ({
  children,
}: {
  children: (createJiraIssueAction: CreateJiraIssueActionType) => JSX.Element;
}) => {
  const createJiraIssueAction = useCreateJiraIssueAction();
  return children(createJiraIssueAction);
};
