import { defineMessages } from 'react-intl';

export default defineMessages({
  commitListLoading: {
    id: 'frontbucket.repository.pullRequest.commitListLoadingLabel',
    description: 'Label for a list of commits that is still loading',
    defaultMessage: 'Loading commits...',
  },
  commitListLoadMore: {
    id: 'frontbucket.repository.pullRequest.commitListLoadMore',
    description: 'Label for a button to load more commits information',
    defaultMessage: 'Load more commits',
  },
  // This can represent
  //  0 Commits (0 commits, no errors)
  //  10 Commits (X commits, no errors)
  //  10+ Commits (X commits, more available)
  //  Commits (error)
  commitListTitle: {
    id: 'frontbucket.repository.pullrequest.commitListTitle',
    description: 'Title of a list of commits in a pull request',
    defaultMessage: `{hasError, select, true {Commits} other {{count}}}{hasMore, select, true {+} other {}}
       {hasError, select, other {{count, plural, one {commit} other {commits}}} true {}}`,
  },
  commitListLabel: {
    id: 'frontbucket.repository.pullRequest.commitListLabel',
    description: 'Label for a list of commits for a pull request',
    defaultMessage: 'Commit list',
  },
  commitListGenericError: {
    id: 'frontbucket.repository.pullRequest.commitListGenericError',
    description:
      'Generic text explaining that we could not load the commits content',
    defaultMessage: "Couldn't load commits",
  },
});
