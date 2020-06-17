import { defineMessages, FormattedMessage } from 'react-intl';
import {
  FilterOptions,
  PossiblyEmptyFilterOptions,
} from './pull-request-activity-filter/constants';

export default defineMessages({
  activityErrorHeading: {
    id: 'frontbucket.repository.pullRequest.activity.errorHeading',
    description:
      'Text for error state showing that there was a problem loading pull request activity',
    defaultMessage: `Couldn't load activity`,
  },
  activityErrorAction: {
    id: 'frontbucket.repository.pullRequest.activity.errorAction',
    description:
      'Click action for error state showing that there was a problem loading pull request activity',
    defaultMessage: 'Try again',
  },
});

export const filterEmptyMessages: {
  [key in PossiblyEmptyFilterOptions]: FormattedMessage.MessageDescriptor;
} = defineMessages({
  [FilterOptions.MY_COMMENTS]: {
    id: 'frontbucket.repository.pullRequest.activity.filter.ownConversation',
    description: 'Empty state text for own conversation option',
    defaultMessage: 'You made no comments on this pull request.',
  },
  [FilterOptions.ALL_COMMENTS]: {
    id: 'frontbucket.repository.pullRequest.activity.filter.allConversation',
    description: 'Empty state text for all conversation option',
    defaultMessage: 'There are no comments on this pull request.',
  },
  [FilterOptions.TASKS]: {
    id: 'frontbucket.repository.pullRequest.activity.filter.tasks',
    description: 'Empty state text for own tasks option',
    defaultMessage: 'There are no tasks on this pull request.',
  },
  [FilterOptions.COMMITS]: {
    id: 'frontbucket.repository.pullRequest.activity.filter.commits',
    description: 'Empty state text for own commits option',
    defaultMessage: 'There are no new commits added to this pull request.',
  },
});
