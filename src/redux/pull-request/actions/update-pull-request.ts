import { PullRequest } from 'src/components/types';
import { pullRequest as pullRequestSchema } from '../schemas';

export default (type: string, pullRequest: PullRequest) => ({
  type,
  payload: {
    currentPullRequest: pullRequest,
  },
  meta: {
    schema: {
      currentPullRequest: pullRequestSchema,
    },
  },
});
