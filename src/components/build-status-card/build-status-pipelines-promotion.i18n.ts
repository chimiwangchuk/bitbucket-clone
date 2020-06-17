import { defineMessages } from 'react-intl';

export default defineMessages({
  promotionLineOne: {
    id: 'frontbucket.repository.source.promotionLineOne',
    description:
      'Identifying that this repository does not have a CI/CD tool linked with it',
    defaultMessage:
      'It looks like you haven’t configured a build tool yet. You can use {bitbucketPipelinesDocumentation} to build, test and deploy your code.',
  },
  promotionLineTwo: {
    id: 'frontbucket.repository.source.promotionLineTwo',
    description: 'Information that all account plans have free Build Minutes',
    defaultMessage: 'Your existing plan already includes build minutes.',
  },
  promotionSetUpBitbucketPipelinesLink: {
    id: 'frontbucket.repository.source.promotionSetUpBitbucketPipelinesLink',
    description: 'Link to Bitbucket Pipelines',
    defaultMessage: 'Set up a pipeline',
  },
  promotionPipelinesDocumentationLink: {
    id: 'frontbucket.repository.source.promotionPipelinesDocumentationLink',
    description: 'Link to Bitbucket Pipelines Documentation',
    defaultMessage: 'Bitbucket Pipelines',
  },
});
