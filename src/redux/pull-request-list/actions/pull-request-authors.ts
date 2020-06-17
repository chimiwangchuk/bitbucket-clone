import { createAsyncAction, fetchAction } from 'src/redux/actions';
import urls from 'src/sections/repository/urls';
import profileUrls from 'src/urls/profile';
import { User } from 'src/components/types';

export const LoadPullRequestAuthors = createAsyncAction(
  'pullRequestList/LOAD_AUTHORS'
);

export const ClearFilteredAuthors = 'pullRequestList/CLEAR_FILTERED_AUTHORS';

export const LoadPullRequestAuthor = createAsyncAction(
  'pullRequestList/LOAD_AUTHOR'
);

export const UpdatePreloadedAuthor = 'pullRequestList/UPDATE_AUTHOR';

export const fetchPullRequestAuthors = (
  repoUrl: string,
  status: string | null,
  query: string
) => {
  return fetchAction(LoadPullRequestAuthors, {
    url: urls.api.internal.pullRequestAuthors(repoUrl, { status, query }),
    data: {
      status,
      query,
    },
  });
};

export const fetchPullRequestAuthor = (uuid: string) => {
  return fetchAction(LoadPullRequestAuthor, {
    url: profileUrls.api.v20.user(uuid),
  });
};

export const clearFilteredAuthors = () => ({
  type: ClearFilteredAuthors,
});

export const updatePreloadedAuthor = (payload: User) => ({
  type: UpdatePreloadedAuthor,
  payload,
});
