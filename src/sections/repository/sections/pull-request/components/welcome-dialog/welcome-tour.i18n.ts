import { defineMessages } from 'react-intl';

import { PullRequestWelcomeTourTarget } from './types';

const files = defineMessages({
  title: {
    id: 'frontbucket.repository.pullRequest.welcomeTour.files.title',
    description: 'Title for the files card spotlight tour item',
    defaultMessage: 'Find files fast',
  },
  guide: {
    id: 'frontbucket.repository.pullRequest.welcomeTour.files.guide',
    description: 'Guide text for the files card spotlight tour item',
    defaultMessage:
      'Navigate directly to a file by clicking on it or click on folders to expand and collapse them in the file tree.',
  },
});

const sidebar = defineMessages({
  title: {
    id: 'frontbucket.repository.pullRequest.welcomeTour.sidebar.title',
    description: 'Title for the sidebar spotlight tour item',
    defaultMessage: 'Adjust the sidebar',
  },
  guide: {
    id: 'frontbucket.repository.pullRequest.welcomeTour.sidebar.guide',
    description: 'Guide text for the sidebar spotlight tour item',
    defaultMessage:
      'If you want more space for code, click and drag the edge of the sidebar to change its width.',
  },
});

const feedback = defineMessages({
  title: {
    id: 'frontbucket.repository.pullRequest.welcomeTour.feedback.title',
    description: 'Title for the feedback card spotlight tour item',
    defaultMessage: 'Share your thoughts',
  },
  guide: {
    id: 'frontbucket.repository.pullRequest.welcomeTour.feedback.guide',
    description: 'Guide text for the feedback card spotlight tour item',
    defaultMessage:
      'Explore the rest of the new pull request experience, and let us know what you think.',
  },
});

const commonMessages = defineMessages({
  nextAction: {
    id: 'frontbucket.repository.pullRequest.welcomeTour.common.nextAction',
    description: 'Spotlight tour next action text',
    defaultMessage: 'Next',
  },
  finishAction: {
    id: 'frontbucket.repository.pullRequest.welcomeTour.common.finishAction',
    description: 'Spotlight tour finish action text',
    defaultMessage: 'Finish',
  },
  cancelAction: {
    id: 'frontbucket.repository.pullRequest.welcomeTour.common.cancelAction',
    description: 'Spotlight tour cancel action text',
    defaultMessage: 'Cancel',
  },
});

export default {
  [PullRequestWelcomeTourTarget.Files]: files,
  [PullRequestWelcomeTourTarget.Sidebar]: sidebar,
  [PullRequestWelcomeTourTarget.Feedback]: feedback,
  common: commonMessages,
};
