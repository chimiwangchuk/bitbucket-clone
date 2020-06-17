import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'frontbucket.repository.pullRequest.asyncMergeSection.title',
    description:
      'Text to display as a title of the async merge section message',
    defaultMessage: 'Merge in progress',
  },
  body: {
    id: 'frontbucket.repository.pullRequest.asyncMergeSection.body',
    description: 'Text to display as a body of the async merge section message',
    defaultMessage:
      'The merge is taking longer than expected. The page will refresh once the merge has succeeded.',
  },
});
