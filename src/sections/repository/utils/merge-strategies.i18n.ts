import { defineMessages } from 'react-intl';

export default defineMessages({
  mergeCommit: {
    id: 'frontbucket.mergeStrategies.mergeCommit',
    description: 'Text for the merge commit strategy label',
    defaultMessage: 'Merge commit',
  },
  squash: {
    id: 'frontbucket.mergeStrategies.squash',
    description: 'Text for the squash strategy label',
    defaultMessage: 'Squash',
  },
  fastForward: {
    id: 'frontbucket.mergeStrategies.fastForward',
    description: 'Text for the fast forward strategy label',
    defaultMessage: 'Fast forward',
  },
});
