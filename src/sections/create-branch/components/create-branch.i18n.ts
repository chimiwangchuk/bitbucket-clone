import { defineMessages } from 'react-intl';

export default defineMessages({
  refSelectorLabelBranches: {
    id: 'frontbucket.createBranch.refSelectorLabelBranches',
    description:
      'Text for the branches label inside the ref selector in the create branch screen',
    defaultMessage: 'Branches',
  },
  title: {
    id: 'frontbucket.createBranch.createBranchTitle',
    description: 'Text for the title of the create branch screen',
    defaultMessage: 'Create branch',
  },
  refSelectorLabelTags: {
    id: 'frontbucket.createBranch.refSelectorLabelTags',
    description:
      'Text for the tags label inside the ref selector in the create branch screen',
    defaultMessage: 'Tags',
  },
  refSelectorNoMatches: {
    id: 'frontbucket.createBranch.refSelectorNoMatches',
    description: 'Text for the ref selector when there are no matches',
    defaultMessage: `We can't find that branch or tag`,
  },
  refSelectorNoRefs: {
    id: 'frontbucket.createBranch.refSelectorNoRefs',
    description:
      'Text for the placeholder in the ref selector when the repositories does not have any branches/tags',
    defaultMessage: 'No branches or tags',
  },
  refSelectorLoadError: {
    id: 'frontbucket.createBranch.refSelectorLoadError',
    description:
      'Text for the placeholder in the ref selector when the branches/tags could not be loaded',
    defaultMessage: `We couldn't load branches or tags`,
  },
  refSelectorMoreOptions: {
    id: 'frontbucket.createBranch.refSelectorMoreOptions',
    description:
      'Text in the ref selector when the branches/tags were limited and user should type to find options',
    defaultMessage: 'Type to filter...',
  },
  repositoryLabel: {
    id: 'frontbucket.createBranch.repositoryLabel',
    description: 'Text for the repository label in the create branch screen',
    defaultMessage: 'Repository',
  },
  repositorySelectorNoRepositories: {
    id: 'frontbucket.createBranch.repositorySelectorNoRepositories',
    description:
      'Text for the placeholder in the repository selector if there are no repositories to create a branch in',
    defaultMessage: `We can't find any repositories you have write access to`,
  },
  repositorySelectorNoMatches: {
    id: 'frontbucket.createBranch.repositorySelectorNoMatches',
    description: 'Text for the repository selector when there are no matches',
    defaultMessage: `We can't find that repository`,
  },
  repositorySelectorLoadError: {
    id: 'frontbucket.createBranch.repositorySelectorLoadError',
    description:
      'Text for the placeholder in the repository selector if loading the repositories failed',
    defaultMessage: 'Unable to load repositories',
  },
  repositorySelectorMoreOptions: {
    id: 'frontbucket.createBranch.repositorySelectorMoreOptions',
    description:
      'Text in the repository selector when the options were limited and user should type to find options',
    defaultMessage: 'Type to filter...',
  },
  fromBranchLabel: {
    id: 'frontbucket.createBranch.fromBranchLabel',
    description: 'Text for the from branch label in the create branch screen',
    defaultMessage: 'From branch',
  },
  branchTypeLabel: {
    id: 'frontbucket.createBranch.branchTypeLabel',
    description: 'Text for the branch type label in the create branch screen',
    defaultMessage: 'Type',
  },
  branchTypeTooltipText: {
    id: 'frontbucket.createBranch.branchTypeTooltipText',
    description:
      'Text for the branch type label tooltip in the create branch screen',
    defaultMessage: `Select a branch type, and we’ll add the prefix to your branch name.`,
  },
  branchTypeTooltipLearnMoreLink: {
    id: 'frontbucket.createBranch.branchTypeTooltipLearnMoreLink',
    description:
      'Link to learn more about branch types in the branch type label tooltip',
    defaultMessage: 'Learn more',
  },
  branchTypeBugfixOptionLabel: {
    id: 'frontbucket.createBranch.branchTypeBugfixOptionLabel',
    description:
      'Text for the bugfix branch type option in the create branch screen',
    defaultMessage: 'Bugfix',
  },
  branchTypeFeatureOptionLabel: {
    id: 'frontbucket.createBranch.branchTypeFeatureOptionLabel',
    description:
      'Text for the feature branch type option in the create branch screen',
    defaultMessage: 'Feature',
  },
  branchTypeHotfixOptionLabel: {
    id: 'frontbucket.createBranch.branchTypeHotfixOptionLabel',
    description:
      'Text for the hotfix branch type option in the create branch screen',
    defaultMessage: 'Hotfix',
  },
  branchTypeReleaseOptionLabel: {
    id: 'frontbucket.createBranch.branchTypeReleaseOptionLabel',
    description:
      'Text for the release branch type option in the create branch screen',
    defaultMessage: 'Release',
  },
  branchTypeOtherOptionLabel: {
    id: 'frontbucket.createBranch.branchTypeOtherOptionLabel',
    description:
      'Text for the other branch type option in the create branch screen',
    defaultMessage: 'Other',
  },
  branchNameLabel: {
    id: 'frontbucket.createBranch.branchNameLabel',
    description: 'Text for the branch name label in the create branch screen',
    defaultMessage: 'Branch name',
  },
  createButton: {
    id: 'frontbucket.createBranch.createBranchScreenCreateButton',
    description: 'Text for the create button in the create branch screen',
    defaultMessage: 'Create',
  },
  cancelButton: {
    id: 'frontbucket.createBranch.createBranchScreenCancelButton',
    description: 'Text for the cancel button in the create branch screen',
    defaultMessage: 'Cancel',
  },
  createBranchButton: {
    id: 'frontbucket.createBranch.createBranchButton',
    description:
      'Text for the create branch button on the page that opens the screen',
    defaultMessage: 'Create branch',
  },
  createBranchButtonDisabled: {
    id: 'frontbucket.createBranch.createBranchButtonDisabled',
    description:
      "Text for tooltip on the create branch button that is disabled when the user doesn't have repository write priviliges.",
    defaultMessage: 'You do not have permission to create a branch',
  },
  errorDescriptionBranchAlreadyExists: {
    id: 'frontbucket.createBranch.errorDescription.BranchAlreadyExists',
    description:
      'Text for the inline error description when a branch with the given name already exists in the repository',
    defaultMessage: `Branch already exists.`,
  },
});
