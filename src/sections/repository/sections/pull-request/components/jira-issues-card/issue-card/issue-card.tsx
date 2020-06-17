import React from 'react';
import Avatar from '@atlaskit/avatar';
import Tooltip from '@atlaskit/tooltip';
import CheckIcon from '@atlaskit/icon/glyph/check';
import { colors } from '@atlaskit/theme';

import { PrCommentJiraIssue } from 'src/redux/jira/types';
import { openJiraIssueDialog } from 'src/connect/jira-issue-dialog/jira-issue-dialog';
import { publishUiEvent } from 'src/utils/analytics/publish';
import * as styles from './issue-card.styled';

type Props = {
  prIssue: PrCommentJiraIssue;
};

const IssueCard: React.FC<Props> = ({ prIssue }) => {
  const { avatarUrls } = prIssue.issue.assignee || {};
  const avatarUrl = avatarUrls
    ? avatarUrls['128x128'] || avatarUrls['48x48']
    : undefined;
  const jiraUrl = prIssue.issue.site.cloudUrl;
  const issueUrl = `${jiraUrl}/browse/${prIssue.issue.key}`;

  const handleClick = (e: React.MouseEvent) => {
    publishUiEvent({
      action: 'clicked',
      actionSubject: 'card',
      actionSubjectId: 'jiraIssuesCardItem',
      source: 'pullRequestScreen',
      attributes: {
        issueType: prIssue.type,
      },
    });

    if (e.metaKey || e.ctrlKey) {
      return;
    }
    e.preventDefault();
    openJiraIssueDialog(jiraUrl, prIssue.issue.key);
  };
  return (
    <styles.IssueCardLink
      href={issueUrl}
      target="_blank"
      onClick={handleClick}
      data-testid="jira-issues-card-item"
    >
      <Tooltip content={prIssue.issue.summary}>
        <styles.SummaryTextContainer>
          {prIssue.issue.summary}
        </styles.SummaryTextContainer>
      </Tooltip>
      <styles.BottomContentContainer>
        <styles.BottomLeftContentContainer>
          <img
            src={prIssue.issue.issueType.iconUrl}
            alt={prIssue.issue.issueType.name}
          />
          <styles.IssueKeyContainer>
            {prIssue.issue.key}
          </styles.IssueKeyContainer>
        </styles.BottomLeftContentContainer>
        <styles.BottomRightContentContainer>
          {prIssue.issue.status?.category === 'done' && (
            <styles.DoneIconContainer>
              <CheckIcon label="Done" primaryColor={colors.G400} size="small" />
            </styles.DoneIconContainer>
          )}
          <Tooltip content={prIssue.issue.assignee?.displayName}>
            <Avatar size="small" src={avatarUrl} />
          </Tooltip>
        </styles.BottomRightContentContainer>
      </styles.BottomContentContainer>
    </styles.IssueCardLink>
  );
};

export default IssueCard;
