import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@atlaskit/button';

import { PrCommentJiraIssue } from 'src/redux/jira/types';
import { getCurrentPullRequest } from 'src/redux/pull-request/selectors';
import { LoadingStatus } from 'src/constants/loading-status';
import {
  getCurrentRepositoryOwnerName,
  getCurrentRepositorySlug,
} from 'src/selectors/repository-selectors';
import { fetchPullRequestJiraIssues } from 'src/redux/jira/actions';
import GenericMessage from '@atlassian/bitbucket-generic-message';
import urls from 'src/sections/repository/urls';
import { publishUiEvent } from 'src/utils/analytics/publish';
import IssueCard from '../issue-card/issue-card';
import messages from './jira-issues-card-expander-content.i18n';
import imgUrl from './jira.png';
import * as styles from './jira-issues-card-expander-content.styled';

type Props = {
  prIssues: PrCommentJiraIssue[];
  prCommentIssues: PrCommentJiraIssue[];
  shouldShowAllPrIssues: boolean;
  // @ts-ignore TODO: fix noImplicitAny error here
  setShouldShowAllPrIssues: (boolean) => void;
  shouldShowAllPrCommentIssues: boolean;
  // @ts-ignore TODO: fix noImplicitAny error here
  setShouldShowAllPrCommentIssues: (boolean) => void;
  fetchedStatus: LoadingStatus;
};

const INITIAL_NUM_TO_DISPLAY = 5;

const JiraIssuesCardExpanderContent: React.FC<Props> = ({
  prIssues,
  prCommentIssues,
  shouldShowAllPrIssues,
  setShouldShowAllPrIssues,
  shouldShowAllPrCommentIssues,
  setShouldShowAllPrCommentIssues,
  fetchedStatus,
}) => {
  const dispatch = useDispatch();
  const pullRequest = useSelector(getCurrentPullRequest);
  const owner = useSelector(getCurrentRepositoryOwnerName);
  const slug = useSelector(getCurrentRepositorySlug) || '';

  const displayedPrIssues = shouldShowAllPrIssues
    ? prIssues
    : prIssues.slice(0, Math.min(prIssues.length, INITIAL_NUM_TO_DISPLAY));

  const handleClickShowMore = () => {
    publishUiEvent({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'jiraIssuesCardShowMore',
      source: 'pullRequestScreen',
      attributes: {
        prIssuesCount: prIssues.length,
        prCommentIssuesCount: prCommentIssues.length,
      },
    });
    setShouldShowAllPrIssues(true);
  };
  const handleClickShowHide = () =>
    setShouldShowAllPrCommentIssues(!shouldShowAllPrCommentIssues);
  const handleClickError = () =>
    dispatch(
      fetchPullRequestJiraIssues({
        owner,
        slug,
        id: pullRequest!.id,
      })
    );
  const handleClickLearnMore = () =>
    publishUiEvent({
      action: 'clicked',
      actionSubject: 'link',
      actionSubjectId: 'jiraIssuesCardLearnMore',
      source: 'pullRequestScreen',
    });

  const createdInPrButtonMessage = shouldShowAllPrCommentIssues
    ? messages.hide
    : messages.show;

  const CreatedInPrContainer =
    prIssues.length > 0
      ? styles.CreatedInPrContainerLargeTopMargin
      : styles.CreatedInPrContainerSmallTopMargin;
  const isEmpty = prIssues.length === 0 && prCommentIssues.length === 0;

  if (fetchedStatus === LoadingStatus.Failed) {
    return (
      <GenericMessage
        iconType="warning"
        title={<FormattedMessage {...messages.errorHeading} />}
      >
        <Button appearance="link" onClick={handleClickError}>
          <FormattedMessage {...messages.errorRetry} />
        </Button>
      </GenericMessage>
    );
  }

  if (isEmpty) {
    return (
      <styles.EmptyStateContainer>
        <styles.EmptyStateImage src={imgUrl} alt="Jira Backlog" width="100" />
        <styles.EmptyStateHeadingText>
          {messages.emptyHeader.defaultMessage}
        </styles.EmptyStateHeadingText>
        <styles.EmptyStateBodyText>
          {messages.emptyBody.defaultMessage}
        </styles.EmptyStateBodyText>
        <styles.EmptyStateButton
          appearance="link"
          href={urls.external.referenceIssuesLearnMore}
          onClick={handleClickLearnMore}
        >
          {messages.emptyAction.defaultMessage}
        </styles.EmptyStateButton>
      </styles.EmptyStateContainer>
    );
  }

  return (
    <styles.ExpanderContentContainer>
      {displayedPrIssues.map(prIssue => (
        <IssueCard prIssue={prIssue} key={prIssue.issue.id} />
      ))}
      {!shouldShowAllPrIssues && prIssues.length > INITIAL_NUM_TO_DISPLAY && (
        <styles.ShowMoreButton onClick={handleClickShowMore}>
          <styles.ShowMoreTextContainer>
            <FormattedMessage
              {...messages.showMore}
              values={{
                formattedCount: prIssues.length - INITIAL_NUM_TO_DISPLAY,
              }}
            />
          </styles.ShowMoreTextContainer>
        </styles.ShowMoreButton>
      )}
      {prCommentIssues.length > 0 && prIssues.length > 0 && <styles.Divider />}
      {prCommentIssues.length > 0 && (
        <CreatedInPrContainer>
          <styles.CreatedInPrHeadingContainer>
            <styles.CreatedInPrTextContainer>
              <FormattedMessage
                {...messages.createdInPr}
                values={{
                  formattedCount: prCommentIssues.length,
                }}
              />
            </styles.CreatedInPrTextContainer>
            <styles.ShowHideButton onClick={handleClickShowHide}>
              <styles.ShowHideTextContainer>
                <FormattedMessage {...createdInPrButtonMessage} />
              </styles.ShowHideTextContainer>
            </styles.ShowHideButton>
          </styles.CreatedInPrHeadingContainer>
          {shouldShowAllPrCommentIssues &&
            prCommentIssues.map(prCommentIssue => (
              <IssueCard
                prIssue={prCommentIssue}
                key={prCommentIssue.issue.id}
              />
            ))}
        </CreatedInPrContainer>
      )}
    </styles.ExpanderContentContainer>
  );
};

export default JiraIssuesCardExpanderContent;
