import { useSelector } from 'react-redux';
import { publishUiEvent } from 'src/utils/analytics/publish';
import { getCurrentPullRequestId } from 'src/redux/pull-request/selectors';
import { getCurrentRepositoryUuid } from 'src/selectors/repository-selectors';

export const usePublishActivityUiEvent = (eventType: string) => {
  const repositoryUUID = useSelector(getCurrentRepositoryUuid);
  const pullRequestId = useSelector(getCurrentPullRequestId);

  return () => {
    publishUiEvent({
      action: 'clicked',
      actionSubject: 'link',
      actionSubjectId: 'pullRequestActivityFeedEvent',
      source: 'pullRequestScreen',
      objectType: 'pullRequest',
      objectId: `${repositoryUUID}/${pullRequestId}`,
      containerId: `${repositoryUUID}`,
      containerType: 'repository',
      attributes: {
        eventType,
      },
    });
  };
};
