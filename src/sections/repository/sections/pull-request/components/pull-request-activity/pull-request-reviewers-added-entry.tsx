import React from 'react';
import { FormattedMessage } from 'react-intl';
import { User } from 'src/components/types';
import { ActivityApi } from 'src/components/activity/types';
import messages from './pull-request-activity-events.i18n';

type Props = {
  event: ActivityApi['Update'];
};

export const PullRequestReviewersAddedEntry = ({ event }: Props) => {
  const users: User[] = event.update.changes.reviewers?.added
    ? event.update.changes.reviewers.added
    : [];
  const reviewerInfo = {
    numReviewers: users.length,
    otherReviewers: users.length - 1,
    reviewer: users[0].display_name,
    reviewer2: users.length === 2 ? users[1].display_name : '',
  };
  return (
    <FormattedMessage
      values={reviewerInfo}
      {...messages.reviewersAddedMessage}
    />
  );
};
