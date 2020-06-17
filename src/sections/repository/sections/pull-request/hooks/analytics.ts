import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  getPullRequestDestinationRepoUuid,
  getPullRequestSourceRepoUuid,
  getCurrentPullRequestId,
} from 'src/redux/pull-request/selectors';
import { BucketState } from 'src/types/state';
import { publishFullScreenEvent } from 'src/utils/analytics/publish';

type PullRequestScreenEventOptions = {
  name: string;
  attributes?: {};
  skip?: boolean;
};

export const usePullRequestScreenEvent = ({
  name,
  attributes = {},
  skip = false,
}: PullRequestScreenEventOptions) => {
  const toRepositoryUuid = useSelector<BucketState, string | null | undefined>(
    getPullRequestDestinationRepoUuid
  );

  const fromRepositoryUuid = useSelector<
    BucketState,
    string | null | undefined
  >(getPullRequestSourceRepoUuid);

  const pullRequestId = useSelector<BucketState, number | null>(
    getCurrentPullRequestId
  );

  useEffect(() => {
    if (toRepositoryUuid && pullRequestId && fromRepositoryUuid && !skip) {
      publishFullScreenEvent({
        name,
        containerType: 'repository',
        containerId: toRepositoryUuid,
        objectType: 'pullRequest',
        objectId: pullRequestId,
        attributes: { fromRepositoryUuid, ...attributes },
      });
    }
  }, [
    pullRequestId,
    fromRepositoryUuid,
    toRepositoryUuid,
    attributes,
    name,
    skip,
  ]);
};
