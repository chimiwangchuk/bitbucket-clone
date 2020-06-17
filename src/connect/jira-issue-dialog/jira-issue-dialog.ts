import qs from 'qs';
import ConnectHost from '@atlassian/bitbucket-connect-js';
import { getBbEnv, getBbCommitHash } from 'src/utils/bb-env';

// Opens a Jira issue dialog (Bento). This is usable from any context (such as a user's
// dashboard) because it doesn't require an installed connect addon to work.
// The content of the iframe works by using Jira's session.
export const openJiraIssueDialog = (jiraUrl: string, jiraIssueKey: string) => {
  const dialogProvider = ConnectHost.frameworkAdaptor.getProviderByModuleName(
    'dialog'
  );

  const query = qs.stringify({
    'issue-key': jiraIssueKey,
    'modal-size': 'maximum',
    // These two params are needed so that Jira can load the connect JS.
    // Why is that needed? So that the "close" button within the iframe (Jira)
    // can close the dialog in the host (Bitbucket).
    cenv: getBbEnv(),
    crev: `${getBbCommitHash()}/dist/connect/v5`,
  });
  const url = `${jiraUrl}/rest/bitbucket/1.0/issue-details/fragment-csp?${query}`;

  const options = {
    chrome: false,
    size: 'maximum',
  };

  const urlIframeProps = {
    // These are required by the library but we don't actually have a module here.
    // Use a key that shouldn't clash with any existing ones.
    appKey: `jira-bitbucket-connector-plugin.${jiraUrl}`,
    moduleKey: 'dashboard-jira-issue-dialog',
    moduleId: 'dashboard-jira-issue-dialog',
    url,
  };

  dialogProvider.createUrlIframeDialog(options, urlIframeProps);
};
