import React, { Component, ComponentClass } from 'react';
import { ConnectModulePrincipalId } from '@atlassian/bitbucket-connect-js';
import { WebItems } from '@atlassian/bitbucket-connect-react';
import { PullRequest } from 'src/components/types';

import { publishUiEvent } from 'src/utils/analytics/publish';

export type PullRequestSummaryInfoProps = {
  component: ComponentClass<any>;
  principalId: ConnectModulePrincipalId;
  target?: PullRequest;
};

export default class ConnectPullRequestSummaryInfo extends Component<
  PullRequestSummaryInfoProps
> {
  render() {
    const { principalId, target, component } = this.props;

    // TODO: fix this code so it is accessible (use a real button and not a div)
    return (
      <WebItems
        location="org.bitbucket.pullrequest.summary.info"
        principalId={principalId}
        target={target}
        component={component}
        loadingComponent={() => null}
        loadingFailedComponent={() => null}
      >
        {items =>
          items.map(item => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
            <div
              role="button"
              key={item.key as string}
              onClick={() => {
                publishUiEvent({
                  action: 'clicked',
                  actionSubject: 'button',
                  source: 'pullrequestHeaderAction',
                  actionSubjectId: 'pullrequestSummaryInfoClicked',
                });
              }}
            >
              {item}
            </div>
          ))
        }
      </WebItems>
    );
  }
}
