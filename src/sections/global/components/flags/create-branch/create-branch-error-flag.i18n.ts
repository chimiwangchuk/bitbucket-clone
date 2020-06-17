import { defineMessages } from 'react-intl';

export default defineMessages({
  createBranchErrorTitle: {
    id: 'frontbucket.branches.createBranchErrorTitle',
    description: 'Text for the title of the create branch error message',
    defaultMessage: `We couldn't create a branch`,
  },
  insufficientRepoAccessRightsDescription: {
    id: 'frontbucket.branches.insufficientRepoAccessRightsDescription',
    description:
      'Text for the description of insufficient repo access rights error',
    defaultMessage:
      'You have insufficient rights to create a branch in this repository.',
  },
  genericErrorDescription: {
    id: 'frontbucket.branches.genericErrorDescription',
    description: 'Text for the description of a generic error',
    defaultMessage: 'If this keeps happening, {supportLink}.',
  },
  loadRepositoriesErrorTitle: {
    id: 'frontbucket.branches.loadRepositoriesErrorTitle',
    description: 'Title of error message when loading repositories fails',
    defaultMessage: 'We weren’t able to load the repositories',
  },
  supportLink: {
    id: 'frontbucket.branches.supportPageLink',
    description: 'Text for a link to support page',
    defaultMessage: 'contact support',
  },
  branchingModelsLoadingErrorTitle: {
    id: 'frontbucket.branches.loadBranchingModelTypesErrorTitle',
    description: 'Title of error message when loading branching models fails',
    defaultMessage: "We couldn't load the branch types",
  },
  branchingModelsLoadingErrorDescription: {
    id: 'frontbucket.branches.loadBranchingModelTypesErrorDescription',
    description: 'Error message when loading branching models fails',
    defaultMessage: 'Refresh the page or enter your branch prefix manually.',
  },
});
