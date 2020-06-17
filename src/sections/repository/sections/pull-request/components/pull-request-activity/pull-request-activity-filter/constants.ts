import { ActivityEntryTypes } from 'src/components/activity/types';

export enum FilterOptions {
  SHOW_ALL = 'show_all',
  MY_COMMENTS = 'my_comments',
  ALL_COMMENTS = 'all_comments',
  TASKS = 'tasks',
  COMMITS = 'commits',
  STATUS = 'status',
}

export type SelectableFilterOptions = Exclude<
  FilterOptions,
  FilterOptions.SHOW_ALL
>;

export type PossiblyEmptyFilterOptions = Exclude<
  FilterOptions,
  FilterOptions.SHOW_ALL | FilterOptions.STATUS
>;

export const VISIBLE_FILTER_OPTIONS: SelectableFilterOptions[] = [
  FilterOptions.MY_COMMENTS,
  FilterOptions.ALL_COMMENTS,
  FilterOptions.TASKS,
  FilterOptions.COMMITS,
  FilterOptions.STATUS,
];

export const ALLOWABLE_ACTIVITY_TYPES: {
  [key in SelectableFilterOptions]: string[];
} = {
  [FilterOptions.MY_COMMENTS]: [
    ActivityEntryTypes.CommentStart,
    ActivityEntryTypes.CommentReplies,
  ],
  [FilterOptions.ALL_COMMENTS]: [
    ActivityEntryTypes.CommentStart,
    ActivityEntryTypes.CommentReplies,
  ],
  [FilterOptions.TASKS]: [
    ActivityEntryTypes.TaskCreated,
    ActivityEntryTypes.TaskResolved,
  ],
  [FilterOptions.COMMITS]: [ActivityEntryTypes.Commit],
  [FilterOptions.STATUS]: [
    ActivityEntryTypes.StatusChange,
    ActivityEntryTypes.Approval,
  ],
};
