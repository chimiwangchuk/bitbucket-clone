import React, { PureComponent } from 'react';
import Tooltip from '@atlaskit/tooltip';
import { get } from 'lodash-es';
import { ConnectIframes } from '@atlassian/bitbucket-connect-react';
import { Expander } from 'src/components/sidebar';
import WebCardIcon from './web-card-icon';
import WebCardLoading from './web-card-loading';
import * as styles from './web-cards.style';

export type WebCardsProps = {
  principalId: string;
  target: any;
  location: string;
  isCollapsed?: boolean;
};

export class WebCards extends PureComponent<WebCardsProps> {
  render() {
    const { principalId, target, location, isCollapsed } = this.props;

    return (
      <ConnectIframes
        moduleType="webCards"
        principalId={principalId}
        target={target}
        location={location}
        width="100%"
        loadingComponent={() => null} // We dont want to show a loader for modules API
        loadingFailedComponent={() => null} // We want to hide if modules API fails
      >
        {iframes =>
          iframes.length > 0 &&
          iframes.map(({ Component: Iframe, module: mod }) => {
            const label = get(mod, 'descriptor.name.value');
            const icon = (
              <WebCardIcon
                label={label}
                url={get(mod, 'descriptor.icon.url')}
                className={get(mod, 'descriptor.params.auiIcon')}
              />
            );

            if (isCollapsed) {
              return (
                <Tooltip key={mod.id} position="left" content={label}>
                  {icon}
                </Tooltip>
              );
            }

            return (
              <styles.Card key={mod.id} data-qa="connect-webcard">
                <Expander
                  defaultIsCollapsed
                  icon={icon}
                  isLoading={false}
                  label={label}
                >
                  <Iframe
                    loadingComponent={() => (
                      <WebCardLoading module={mod} delay={300} />
                    )}
                    loadingTimeoutComponent={props => (
                      <WebCardLoading
                        action="timeout"
                        {...props}
                        module={mod}
                      />
                    )}
                    loadingFailedComponent={() => (
                      <WebCardLoading action="failed" module={mod} />
                    )}
                  />
                </Expander>
              </styles.Card>
            );
          })
        }
      </ConnectIframes>
    );
  }
}
