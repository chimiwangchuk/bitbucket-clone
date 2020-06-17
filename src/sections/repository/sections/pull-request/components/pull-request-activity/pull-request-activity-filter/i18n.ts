import { defineMessages, FormattedMessage } from 'react-intl';
import { FilterOptions, SelectableFilterOptions } from './constants';

export default defineMessages({
  filterPlaceholder: {
    id: 'frontbucket.repository.pullRequest.activity.filter.placeholder',
    description: 'Text for activities filter placeholder ',
    defaultMessage: 'Filter',
  },
});

export const filterLabels: {
  [key in SelectableFilterOptions]: FormattedMessage.MessageDescriptor;
} = defineMessages({
  [FilterOptions.MY_COMMENTS]: {
    id: 'frontbucket.repository.pullRequest.activity.filter.myComments',
    description: 'Label for own conversation option',
    defaultMessage: 'My comments',
  },
  [FilterOptions.ALL_COMMENTS]: {
    id: 'frontbucket.repository.pullRequest.activity.filter.allComments',
    description: 'Label for all conversation option',
    defaultMessage: 'All comments',
  },
  [FilterOptions.TASKS]: {
    id: 'frontbucket.repository.pullRequest.activity.filter.tasks',
    description: 'Label for tasks option',
    defaultMessage: 'Tasks',
  },
  [FilterOptions.COMMITS]: {
    id: 'frontbucket.repository.pullRequest.activity.filter.commits',
    description: 'Label for commits option',
    defaultMessage: 'Commits',
  },
  [FilterOptions.STATUS]: {
    id: 'frontbucket.repository.pullRequest.activity.filter.status',
    description: 'Label for status option',
    defaultMessage: 'Statuses',
  },
});
