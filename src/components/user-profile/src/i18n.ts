import { defineMessages } from 'react-intl';

export default defineMessages({
  displayNameDeletedPrivateNickname: {
    id: 'frontbucket.components.userProfile.displayNameDeletedPrivateNickname',
    description:
      'Display name for an account that has been deleted and with an owner who has chosen not to preserve the nickname',
    defaultMessage: 'Former user',
  },
  statusLabelDeactivated: {
    id: 'frontbucket.components.userProfile.statusLabelDeactivated',
    description:
      'Label for an account that has been deactivated or is in the process of being deleted',
    defaultMessage: 'Account deactivated',
  },
  statusLabelDeleted: {
    id: 'frontbucket.components.userProfile.statusLabelDeleted',
    description: 'Label for an account that has been deleted',
    defaultMessage: 'Account deleted',
  },
  teamProfileCardMessage: {
    id: 'frontbucket.components.userProfile.teamProfileCardMessage',
    description: `Message in the profile card of a team whose content has been migrated to workspace`,
    defaultMessage: `You can no longer collaborate with this account. This account has been migrated to a workspace.`,
  },
  unmatchedCommitAuthorTooltip: {
    id: 'frontbucket.components.userProfile.unmatchedCommitAuthorTooltip',
    description: `Tooltip message presented when hovering in the UI over the author of a commit who does not have a matching Bitbucket account`,
    defaultMessage: `{commitAuthor} cannot be matched to an Atlassian account`,
  },
  unmatchedUnknownCommitAuthorTooltip: {
    id:
      'frontbucket.components.userProfile.unmatchedUnknownCommitAuthorTooltip',
    description: `Tooltip message presented when hovering in the UI over the author of a commit who does not have a matching Bitbucket account and left the "author" field of the commit empty`,
    defaultMessage: `This user cannot be matched to an Atlassian account.`,
  },
  unmigratedAtlassianAccountProfileCardMessage: {
    id:
      'frontbucket.components.userProfile.unmigratedAtlassianAccountProfileCardMessage',
    description: `Message in the profile card of a user who has not yet migrated to an Atlassian Account`,
    defaultMessage: `You can no longer collaborate with this person. This account has been inactive for more than a year.`,
  },
  viewProfileAction: {
    id: 'frontbucket.components.userProfile.viewProfileAction',
    description: `Button to click to view a user's profile page`,
    defaultMessage: 'View profile',
  },
});
