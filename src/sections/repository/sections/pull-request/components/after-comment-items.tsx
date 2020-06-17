import React, { Fragment } from 'react';
import { Comment } from '@atlaskit/conversation/dist/esm/model/Comment';
import { CommentTaskList } from 'src/sections/repository/sections/pull-request/components/tasks/comment-task-list';
import { JiraIssues } from 'src/sections/repository/sections/jira/components/jira-issues/jira-issues';
import { CreateJiraIssueFormPr } from 'src/sections/repository/sections/jira/components/create-jira-issue/create-jira-issue-form-pr';

export const AfterCommentItems = (comment: Comment) => {
  const commentId = parseInt(comment.commentId, 10);
  return (
    <Fragment>
      <CommentTaskList commentId={comment.commentId} />
      <JiraIssues commentId={commentId} />
      <CreateJiraIssueFormPr commentId={commentId} />
    </Fragment>
  );
};
