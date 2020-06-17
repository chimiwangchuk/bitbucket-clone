import React, { PureComponent } from 'react';
import { ConnectModulePrincipalId } from '@atlassian/bitbucket-connect-js';
import { ConnectModules } from '@atlassian/bitbucket-connect-react';
import { PullRequest } from 'src/components/types';

export type ConnectPullRequestModulesProps = {
  principalId: ConnectModulePrincipalId;
  target: PullRequest;
};

export default class ConnectPullRequestModules extends PureComponent<
  ConnectPullRequestModulesProps
> {
  render() {
    const { principalId, target } = this.props;

    const query = [
      {
        target,
        modules: [
          {
            location: 'org.bitbucket.pullrequest.summary.info',
            moduleType: 'webItems',
          },
          {
            location: 'org.bitbucket.pullrequest.summary.actions',
            moduleType: 'webItems',
          },
        ],
      },
    ];

    return <ConnectModules principalId={principalId} query={query} />;
  }
}
