import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage, InjectedIntl, injectIntl } from 'react-intl';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { JiraSoftwareIcon } from '@atlaskit/logo';

import { BucketState } from 'src/types/state';
import { SectionErrorBoundary } from 'src/components/error-boundary';
import { PullRequestJiraIssuesState } from 'src/redux/jira/reducers/pull-request-jira-issues';
import { fetchPullRequestJiraIssues } from 'src/redux/jira/actions';
import { Expander } from 'src/components/sidebar';
import { LoadingStatus } from 'src/constants/loading-status';
import { publishUiEvent, publishTrackEvent } from 'src/utils/analytics/publish';
import { getCurrentPullRequest } from 'src/redux/pull-request/selectors';
import {
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
} from 'src/selectors/repository-selectors';
import messages from './jira-issues-card.i18n';
import ExpanderContent from './jira-issues-card-expander-content/jira-issues-card-expander-content';

type Props = {
  isSidebarCollapsed?: boolean;
  intl: InjectedIntl;
};

const JiraIssuesCard: React.FC<Props> = ({ isSidebarCollapsed, intl }) => {
  const pullRequestJiraIssues = useSelector<
    BucketState,
    PullRequestJiraIssuesState
  >(state => state.jira.pullRequestJiraIssues);
  const dispatch = useDispatch();
  const pullRequest = useSelector(getCurrentPullRequest);
  const owner = useSelector(getCurrentRepositoryOwnerName);
  const slug = useSelector(getCurrentRepositorySlug) || '';

  const { jiraIssues, jiraIssuesFetchedStatus } = pullRequestJiraIssues;

  const [shouldShowAllPrIssues, setShouldShowAllPrIssues] = useState(false);
  const [
    shouldShowAllPrCommentIssues,
    setShouldShowAllPrCommentIssues,
  ] = useState(true);
  const [prevFetchedStatus, setPrevFetchedStatus] = useState(
    LoadingStatus.Before
  );

  const onChange = ({ isCollapsed }: { isCollapsed: boolean }) => {
    publishUiEvent({
      action: 'clicked',
      actionSubject: 'card',
      actionSubjectId: 'jiraIssuesCard',
      source: 'pullRequestScreen',
    });

    // Re-fetch the issues here because of edge case where issues
    // are requested before bb-jira-service is able to write them.
    if (!isCollapsed && jiraIssues.length === 0) {
      dispatch(
        fetchPullRequestJiraIssues({
          owner,
          slug,
          id: pullRequest!.id,
        })
      );
    }
  };

  const prIssues = jiraIssues.filter(issue => issue.type === 'PrIssue');
  const prCommentIssues = jiraIssues.filter(
    issue => issue.type === 'PrCommentIssue'
  );

  useEffect(() => {
    if (
      (jiraIssuesFetchedStatus === LoadingStatus.Success ||
        jiraIssuesFetchedStatus === LoadingStatus.Failed) &&
      prevFetchedStatus !== LoadingStatus.Success &&
      prevFetchedStatus !== LoadingStatus.Failed &&
      !isSidebarCollapsed
    ) {
      setPrevFetchedStatus(jiraIssuesFetchedStatus);
      publishTrackEvent({
        action: 'viewed',
        actionSubject: 'sidebar',
        actionSubjectId: 'jiraIssuesCardViewSidebar',
        attributes: {
          prIssuesCount: prIssues.length,
          prCommentIssuesCount: prCommentIssues.length,
        },
        source: 'pullRequestScreen',
      });
    }
  }, [
    isSidebarCollapsed,
    jiraIssuesFetchedStatus,
    prCommentIssues.length,
    prIssues.length,
    prevFetchedStatus,
  ]);

  const icon = <JiraSoftwareIcon label="Jira Software" size="small" />;
  const labels = {
    rich: (
      <FormattedMessage
        {...messages.issueCount}
        values={{
          total: jiraIssues.length,
          formattedCount: <b>{jiraIssues.length}</b>,
        }}
      />
    ),
    plain: intl.formatMessage(messages.issueCount, {
      total: jiraIssues.length,
      formattedCount: prIssues.length,
    }),
  };

  // Issues are re-requested when the expander is opened and there are no issues.
  // The loading state is only show for the initial fetch.
  const isLoading =
    jiraIssuesFetchedStatus !== LoadingStatus.Success &&
    jiraIssuesFetchedStatus !== LoadingStatus.Failed &&
    prevFetchedStatus !== LoadingStatus.Success &&
    prevFetchedStatus !== LoadingStatus.Failed;

  if (isSidebarCollapsed) {
    return (
      <Tooltip position="left" content={labels.plain}>
        <Button appearance="subtle" iconBefore={icon} />
      </Tooltip>
    );
  }

  return (
    <SectionErrorBoundary>
      <Expander
        icon={icon}
        defaultIsCollapsed
        isLoading={isLoading}
        label={labels.rich}
        ariaLabel={intl.formatMessage(messages.ariaLabel)}
        onChange={onChange}
        dataTestId="jira-issues-card"
      >
        <ExpanderContent
          prIssues={prIssues}
          prCommentIssues={prCommentIssues}
          shouldShowAllPrIssues={shouldShowAllPrIssues}
          setShouldShowAllPrIssues={setShouldShowAllPrIssues}
          shouldShowAllPrCommentIssues={shouldShowAllPrCommentIssues}
          setShouldShowAllPrCommentIssues={setShouldShowAllPrCommentIssues}
          fetchedStatus={jiraIssuesFetchedStatus}
        />
      </Expander>
    </SectionErrorBoundary>
  );
};

JiraIssuesCard.defaultProps = {
  isSidebarCollapsed: false,
};

export default injectIntl(JiraIssuesCard);
