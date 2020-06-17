import { defineMessages } from 'react-intl';

export default defineMessages({
  projectsFailedToLoadMessage: {
    id:
      'frontbucket.createJiraIssueFromPullRequest.projectsFailedToLoadMessage',
    description:
      'Projects failed to load message when creating an issue from the pull request screen',
    defaultMessage: `We can’t load the projects`,
  },
  projectsForbiddenToLoadMessage: {
    id:
      'frontbucket.createJiraIssueFromPullRequest.projectsForbiddenToLoadMessage',
    description: 'Projects failed to load due to lack of permissions',
    defaultMessage: `You don’t have access to any projects in this Jira site`,
  },
  noProjectsMessage: {
    id: 'frontbucket.createJiraIssueFromPullRequest.noProjectsMessage',
    description:
      'No projects message when creating an issue from the pull request screen',
    defaultMessage: 'The site has no projects associated',
  },
  selectProjectMessage: {
    id: 'frontbucket.createJiraIssueFromPullRequest.selectProjectsMessage',
    description:
      'To be displayed outside the select boxes when projects are selected',
    defaultMessage: 'Select a project',
  },
  filterResultNoProjectMessage: {
    id:
      'frontbucket.createJiraIssueFromPullRequest.filterResultNoProjectsMessage',
    description:
      'When the search returns empty but there are projects associated',
    defaultMessage: 'No projects available',
  },
  projectsHeader: {
    id: 'frontbucket.createJiraIssueFromPullRequest.projectsHeader',
    description: 'Header text for the Jira projects dropdown',
    defaultMessage: 'Jira projects',
  },
});
