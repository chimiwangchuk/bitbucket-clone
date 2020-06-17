import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import { AvatarPropTypes } from '@atlaskit/avatar';

import ActivityEvent from 'src/components/activity';
import { User } from 'src/components/types';
import UserAvatar from 'src/containers/user-avatar';
import UserName from 'src/containers/user-name';
import GenericMessage from 'src/components/generic-message';
import { ActivityEntry } from 'src/components/activity/types';

import PullRequestApprovalEvent from './pull-request-approval-event';
import * as styles from './pull-request-activity.styled';
import messages, { filterEmptyMessages } from './pull-request-activity.i18n';
import eventMessages from './pull-request-activity-events.i18n';
import { PullRequestCommentStartEntry } from './pull-request-comment-start-entry';
import { PullRequestRepliesEntry } from './pull-request-replies-entry';
import { PullRequestCommitEntry } from './pull-request-commit-entry';
import { PullRequestStatusEntry } from './pull-request-status-entry';
import { PullRequestTaskEntry } from './pull-request-task-entry';
import PullRequestActivityFilter from './pull-request-activity-filter';
import {
  ALLOWABLE_ACTIVITY_TYPES,
  FilterOptions,
  SelectableFilterOptions,
} from './pull-request-activity-filter/constants';
import { PullRequestReviewersAddedEntry } from './pull-request-reviewers-added-entry';

export type PullRequestActivityProps = {
  activityEntries: ActivityEntry[];
  hasError: boolean;
  isLoading: boolean;
  retryFetchActivity: () => void;
  uuid?: string;
};

type PullRequestActivityState = {
  filterOption: FilterOptions;
};

export class PullRequestActivity extends React.PureComponent<
  PullRequestActivityProps,
  PullRequestActivityState
> {
  state = {
    filterOption: FilterOptions.SHOW_ALL,
  };

  renderActorAvatar = (
    actor: User | undefined,
    avatarProps: Partial<AvatarPropTypes>
  ) => (
    <UserAvatar
      {...avatarProps}
      profileCardPosition="left-start"
      user={actor}
    />
  );

  renderActorName = (actor: User | undefined) => (
    <UserName profileCardPosition="left-start" user={actor} />
  );

  renderLoadingState() {
    return (
      <styles.Spinner>
        <Spinner size="small" delay={0} />
      </styles.Spinner>
    );
  }

  renderFooter() {
    const { hasError, retryFetchActivity } = this.props;

    if (hasError) {
      return (
        <GenericMessage
          iconType="warning"
          title={<FormattedMessage {...messages.activityErrorHeading} />}
          messageType="activity"
        >
          <Button appearance="link" onClick={retryFetchActivity}>
            {<FormattedMessage {...messages.activityErrorAction} />}
          </Button>
        </GenericMessage>
      );
    }

    return null;
  }

  renderActivityEntry = (entry: ActivityEntry) => {
    const { timestamp, actor } = entry;

    // Event - a single happening as reported by the backend in endpoint data structures
    // Entry - a single visual representation in the Activity Feed of the UI
    return (
      <ActivityEvent
        actor={actor || undefined}
        date={timestamp}
        key={`${timestamp.getTime()}-${entry.type}`}
        renderActorAvatar={this.renderActorAvatar}
        renderActorName={this.renderActorName}
      >
        {entry.type === 'status-change' && (
          <PullRequestStatusEntry status={entry.event.update.state} />
        )}
        {entry.type === 'approval' && <PullRequestApprovalEvent />}
        {entry.type === 'update' && 'hashes' in entry && (
          <PullRequestCommitEntry hashes={entry.hashes} />
        )}
        {entry.type === 'comment-start' && (
          <PullRequestCommentStartEntry event={entry.event} />
        )}
        {entry.type === 'comment-replies' && (
          <PullRequestRepliesEntry event={entry.event} />
        )}
        {entry.type === 'title-change' && (
          <Fragment>
            <FormattedMessage {...eventMessages.titleChangeMessage} />:{' '}
            <s>{entry.lastTitle}</s>-&gt;{entry.event.update.title}
          </Fragment>
        )}
        {entry.type === 'description-change' && (
          <FormattedMessage {...eventMessages.descriptionChangeMessage} />
        )}
        {(entry.type === 'task-created' || entry.type === 'task-resolved') && (
          <PullRequestTaskEntry event={entry.event} />
        )}
        {entry.type === 'reviewers-added' && (
          <PullRequestReviewersAddedEntry event={entry.event} />
        )}
      </ActivityEvent>
    );
  };

  getActivitiesFilter = (filterOption: SelectableFilterOptions) => {
    if (filterOption === FilterOptions.MY_COMMENTS) {
      return (activityEntry: ActivityEntry) =>
        ALLOWABLE_ACTIVITY_TYPES[filterOption].includes(activityEntry.type) &&
        activityEntry.actor.uuid === this.props.uuid;
    }

    return (activityEntry: ActivityEntry) =>
      ALLOWABLE_ACTIVITY_TYPES[filterOption].includes(activityEntry.type);
  };

  renderActivities = () => {
    const { filterOption } = this.state;
    let { activityEntries } = this.props;

    if (filterOption !== FilterOptions.SHOW_ALL) {
      activityEntries = activityEntries.filter(
        this.getActivitiesFilter(filterOption)
      );

      if (!activityEntries.length && filterOption !== FilterOptions.STATUS) {
        return (
          <styles.EmptyState>
            <FormattedMessage {...filterEmptyMessages[filterOption]} />
          </styles.EmptyState>
        );
      }
    }

    return activityEntries.map(this.renderActivityEntry);
  };

  onFilterStateChange = (filterOption: FilterOptions) =>
    this.setState({ filterOption });

  render() {
    const { isLoading, uuid } = this.props;

    return (
      <div data-qa="pr-activity">
        <PullRequestActivityFilter
          uuid={uuid}
          isDisabled={isLoading}
          onChangeState={this.onFilterStateChange}
        />
        {this.renderActivities()}
        {isLoading ? this.renderLoadingState() : this.renderFooter()}
      </div>
    );
  }
}
