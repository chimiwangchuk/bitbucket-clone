import React, { PureComponent, FunctionComponent } from 'react';
import { ConnectModule } from '@atlassian/bitbucket-connect-js';
import Connect, { ConnectProps } from '../../main/connect';
import {
  ConnectModules,
  ConnectModulesRequestProps,
  ConnectModulesStandardProps,
} from '../modules';
import {
  ConnectModuleIframe,
  ConnectModuleIframeProps,
} from './connectModuleIframe';
import IframeLoadingIndicator from './iframeLoadingIndicator';
import IframeFailedIndicator from './iframeFailedIndicator';
import IframeTimeoutIndicator from './iframeTimeoutIndicator';

export type ConnectIframeChildArgs = {
  module: ConnectModule;
  Component: FunctionComponent<Partial<ConnectModuleIframeProps>>;
};

export type ConnectIframeChild = (
  args: ConnectIframeChildArgs[]
) => React.ReactNode;

export interface ConnectIframeContainerComponent {
  containerComponent?: FunctionComponent<{
    children: React.ReactNode;
  }>;
}

export type ConnectIframesOwnProps = {
  children?: ConnectIframeChild;
};

export type ConnectIframesProps = ConnectIframesOwnProps &
  ConnectIframeContainerComponent &
  ConnectModuleIframeProps &
  ConnectModulesRequestProps &
  ConnectModulesStandardProps &
  ConnectProps;

export class ConnectIframes extends PureComponent<ConnectIframesProps> {
  // @ts-ignore TODO: fix noImplicitAny error here
  static defaultContainer = ({ children }) => children;
  render() {
    const {
      children,
      containerComponent: Container = ConnectIframes.defaultContainer,
      loadingComponent: Loading = IframeLoadingIndicator,
      loadingFailedComponent: LoadingFailed = IframeFailedIndicator,
      loadingTimeoutComponent: LoadingTimeout = IframeTimeoutIndicator,
      ...props
    } = this.props;

    return (
      <ConnectModules {...props}>
        {({ modules, loading, error }) => {
          if (error) {
            return (
              <Container>
                <LoadingFailed {...props} />
              </Container>
            );
          }
          if (loading) {
            return (
              <Container>
                <Loading {...props} />
              </Container>
            );
          }
          return (
            <Container>
              {children &&
                children(
                  modules.map((mod: ConnectModule) => ({
                    module: mod,
                    Component: (p: Partial<ConnectModuleIframeProps>) => (
                      <ConnectModuleIframe
                        {...props}
                        loadingComponent={Loading}
                        loadingFailedComponent={LoadingFailed}
                        loadingTimeoutComponent={LoadingTimeout}
                        {...p}
                        module={mod}
                        key={mod.id}
                      />
                    ),
                  }))
                )}
            </Container>
          );
        }}
      </ConnectModules>
    );
  }
}

export default Connect(ConnectIframes);
