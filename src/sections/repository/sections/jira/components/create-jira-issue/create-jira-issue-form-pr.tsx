import React from 'react';
import { useSelector } from 'react-redux';

import { BucketState } from 'src/types/state';
import { CreateJiraIssue } from './create-jira-issue';

export const CreateJiraIssueFormPr = React.memo(
  ({ commentId }: { commentId: number }) => {
    const isVisible = useSelector<BucketState, boolean>(state => {
      const { createForm } = state.jira.createJiraIssue;
      return createForm[commentId] && createForm[commentId].isVisible;
    });

    return isVisible ? <CreateJiraIssue commentId={commentId} /> : null;
  }
);
