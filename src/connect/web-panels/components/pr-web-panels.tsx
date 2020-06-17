import React, { PureComponent, Fragment } from 'react';
import { ConnectIframes } from '@atlassian/bitbucket-connect-react';
import { ConnectModulePrincipalId } from '@atlassian/bitbucket-connect-js';
import { PullRequest } from 'src/components/types';
import { LOADING_MODULE_DELAY } from 'src/connect/shared/constants';
import { publishScreenEvent } from 'src/utils/analytics/publish';
import Loading from './loading';
import * as styles from './web-panels.style';

type PullRequestViewWebPanelsProps = {
  principalId: ConnectModulePrincipalId;
  target: PullRequest;
};

export class PullRequestViewWebPanels extends PureComponent<
  PullRequestViewWebPanelsProps
> {
  render() {
    const { principalId, target } = this.props;

    return (
      <ConnectIframes
        moduleType="webPanels"
        principalId={principalId}
        target={target}
        location="org.bitbucket.pullrequest.overview.informationPanel"
        height={`${styles.webPanelHeight}`}
        width={`${styles.webPanelWidth}`}
        options={{ autoresize: true }}
        loadingComponent={() => null} // We dont want to show a loader for modules API
        loadingFailedComponent={() => null} // We want to hide if modules API fails
      >
        {iframes =>
          iframes.length > 0 && (
            <Fragment>
              {iframes.map(({ Component: Iframe, module: mod }) => (
                <styles.WebPanelSection
                  data-qa="connect-pullrequestview-webpanel"
                  key={mod.id}
                  onLoad={() => {
                    publishScreenEvent('pullRequstWebPanelScreen');
                  }}
                >
                  {mod.descriptor.name && (
                    <styles.WebPanelHeader>
                      {mod.descriptor.name.value}
                    </styles.WebPanelHeader>
                  )}
                  <styles.PullRequestWebPanel key={mod.id}>
                    <Iframe
                      loadingComponent={() => (
                        <Loading module={mod} delay={LOADING_MODULE_DELAY} />
                      )}
                      loadingTimeoutComponent={props => (
                        <Loading action="timeout" {...props} module={mod} />
                      )}
                      loadingFailedComponent={() => (
                        <Loading action="failed" module={mod} />
                      )}
                    />
                  </styles.PullRequestWebPanel>
                </styles.WebPanelSection>
              ))}
            </Fragment>
          )
        }
      </ConnectIframes>
    );
  }
}
