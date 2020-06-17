import { EnvironmentType } from '@atlassian/bitbucket-features';

// API Keys for the Atlassian Fx3 Service
// https://developer.atlassian.com/platform/frontend-feature-flags/introduction/overview/
export const FeatureKeys: { [env in EnvironmentType]: string } = {
  [EnvironmentType.LOCAL]: '425f239d-3a44-44fa-a8bd-6bd9cc982166',
  [EnvironmentType.DEV]: 'd2619f54-fa78-489d-bf35-243e1735fb74',
  [EnvironmentType.STAGING]: '50a4ddb1-bd22-4bf6-8c5f-ec5090e1dd4b',
  [EnvironmentType.PROD]: 'e68da679-ff2b-4bae-913d-22d58892baa8',
};
