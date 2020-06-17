import React from 'react';
import { useSelector } from 'react-redux';
import { BucketState } from 'src/types/state';
import { LoadingStatus } from 'src/constants/loading-status';
import { PrCommentJiraIssue } from 'src/redux/jira/types';
import {
  getPullRequestJiraIssuesFetchedStatus,
  getPullRequestJiraIssuesForComment,
} from 'src/redux/jira/selectors/jira-issue-selectors';
import * as styles from './jira-issues.styled';

type Props = {
  commentId: number;
};

export const JiraIssues: React.FC<Props> = ({ commentId }) => {
  const fetchedStatus = useSelector<BucketState, LoadingStatus>(
    getPullRequestJiraIssuesFetchedStatus
  );
  const issues = useSelector<BucketState, PrCommentJiraIssue[]>(state =>
    getPullRequestJiraIssuesForComment(state, commentId)
  );

  if (fetchedStatus === LoadingStatus.Success && issues.length > 0) {
    return (
      <styles.JiraIssueWrapper>
        {issues.map(issue => (
          <styles.JiraIssueInnerWrapper
            key={`${issue.issue.id}-${issue.issue.project.id}`}
          >
            <div>
              <styles.JiraIssueTypeIcon src={issue.issue.issueType.iconUrl} />
            </div>
            <styles.JiraIssueInnerContainer>
              <styles.JiraIssueKeyContainer
                dangerouslySetInnerHTML={{
                  __html: issue.issue.renderedKey!.html,
                }}
              />
              <styles.JiraIssueSummary data-testid="pr-comment-jira-issue">
                {issue.issue.summary}
              </styles.JiraIssueSummary>
            </styles.JiraIssueInnerContainer>
          </styles.JiraIssueInnerWrapper>
        ))}
      </styles.JiraIssueWrapper>
    );
  } else {
    return null;
  }
};
