import { get } from 'lodash-es';
import lastViewedStore from 'src/utils/pull-requests/last-viewed-store';
import { PullRequest } from 'src/types/pull-requests-table';
// Can't guarantee activity timestamp fidelity under 1 second
const PR_ACTIVITY_FIDELITY = 1000;

export const hasUnseenActivity = (pullRequest: PullRequest) => {
  const lastCommented = (pullRequest.extra || {}).last_comment;

  if (!lastCommented) {
    return false;
  }

  // Lacking this for any reason will result in TRUE - "having unseen activity"
  const repositoryFullSlug = get(
    pullRequest,
    'destination.repository.full_name'
  );
  const id = get(pullRequest, 'id');

  const lastViewed = lastViewedStore.get(repositoryFullSlug, id);

  if (!lastViewed) {
    return true;
  }

  // `lastCommented` has a timezone, but Bitbucket does not store `lastViewed`
  // with one. They need to both have a TZ in order to properly create the dates
  // and compare them
  const lastViewedWithTimezone = `${lastViewed}Z`;

  return (
    new Date(lastCommented).getTime() -
      new Date(lastViewedWithTimezone).getTime() >
    PR_ACTIVITY_FIDELITY
  );
};

export const updatePullRequestLastSeen = (
  repositoryFullSlug: string,
  id: string | number
) => {
  const nowWithoutTimezone = new Date().toISOString().replace(/Z/, '');
  lastViewedStore.set(repositoryFullSlug, id, nowWithoutTimezone);
};
