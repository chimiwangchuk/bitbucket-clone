import { createSelector } from 'reselect';

import { getRepository } from 'src/selectors/state-slicing-selectors';
import commitGraphBuilder from 'src/utils/commit-graph-builder';

export const getCommitList = createSelector(
  getRepository,
  repository => repository.commitList
);

export const getCommits = createSelector(
  getCommitList,
  commitList => commitList.commits
);

export const getCurrentCommits = createSelector(getCommitList, commitList => {
  const {
    commits,
    pageLength,
    currentPage,
    startPage,
    isLoading,
    isFiltering,
  } = commitList;
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const showPageOnLoad = startPage < currentPage ? previousPage : nextPage;
  const currentCommitPage =
    isLoading && !isFiltering ? showPageOnLoad : currentPage;
  const offset = (currentCommitPage - startPage) * pageLength;

  return commits.slice(offset, offset + pageLength);
});

export const getCurrentPage = createSelector(
  getCommitList,
  commitList => commitList.currentPage
);

export const getPageLength = createSelector(
  getCommitList,
  commitList => commitList.pageLength
);

export const getCommitGraph = createSelector(getCommits, commits =>
  commitGraphBuilder(commits)
);

export const getCurrentCommitGraph = createSelector(
  getCommitList,
  getCommitGraph,
  (commitList, commitGraph) => {
    const { pageLength, currentPage, startPage } = commitList;
    const offset = (currentPage - startPage) * pageLength;

    return commitGraph.slice(offset, offset + pageLength);
  }
);

export const getStartPage = createSelector(
  getCommitList,
  commitList => commitList.startPage
);

export const getEndPage = createSelector(
  getCommits,
  getStartPage,
  getPageLength,
  (commits, startPage, pageLength) =>
    Math.ceil(startPage + commits.length / pageLength - 1)
);

export const getPaginationUrls = createSelector(
  getCommitList,
  commitList => commitList.paginationUrls
);

export const getHasNextPage = createSelector(
  getCommitList,
  getEndPage,
  (commitList, endPage) => {
    const { hasNextPage, currentPage } = commitList;

    return currentPage < endPage || hasNextPage;
  }
);
