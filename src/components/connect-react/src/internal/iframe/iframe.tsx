import React, { PureComponent, ComponentType } from 'react';
import { ConnectIframe, AppOptions } from '@atlassian/connect-module-core';
import { ConnectHost } from '@atlassian/bitbucket-connect-js';
import Connect from '../../main/connect';
import { isNumeric } from '../../main/utils';
import { getInitialOrBucketState } from './ssr';
import ConnectIframeProvider, { ConnectIframeProviderProps } from './provider';
import {
  iframeEmptyContainer,
  IframeContainer,
  IframeContainerProps,
} from './utils';
import IframeLoadingIndicator from './iframeLoadingIndicator';
import IframeFailedIndicator from './iframeFailedIndicator';
import IframeTimeoutIndicator, {
  LoadingTimeoutComponent,
} from './iframeTimeoutIndicator';

type IframeOptions = Partial<
  AppOptions & {
    isFullPage: boolean;
    sandbox: string;
    noSub: boolean;
  }
>;

export type IframeProps = {
  width?: number | string;
  height?: number | string;
  options?: IframeOptions;
  onHideInlineDialog?: Function;
  loadingComponent?: ComponentType<any>;
  loadingFailedComponent?: ComponentType<any>;
  loadingTimeoutComponent?: LoadingTimeoutComponent;
  iframeContainer?: IframeContainer;
} & ConnectIframeProviderProps;

type UrlIframePropsOwnProps = {
  moduleId: string;
  moduleKey: string;
  appKey: string;
  url: string;
  moduleOptions?: object;
};

export type UrlIframeProps = UrlIframePropsOwnProps & IframeProps;

export class UrlIframe extends PureComponent<
  UrlIframeProps & { connectHost: ConnectHost }
> {
  /* eslint-disable @typescript-eslint/no-empty-function */
  static options: AppOptions = {
    autoresize: false,
    widthinpx: false,
    hostFrameOffset: 0,
    _contextualOperations: {
      resize(): void {},
      sizeToParent(): void {},
      hideInlineDialog(): void {},
    },
  };
  /* eslint-enable @typescript-eslint/no-empty-function */
  static IFRAME_SANDBOX =
    'allow-forms allow-modals allow-popups allow-scripts allow-same-origin allow-top-navigation-by-user-activation';
  render() {
    const {
      moduleId,
      appKey,
      moduleKey,
      url,
      connectHost,
      width,
      height,
      options: defaultOptions,
      moduleOptions,
      loadingComponent: LoadingIndicator = IframeLoadingIndicator,
      loadingFailedComponent: FailedIndicator = IframeFailedIndicator,
      loadingTimeoutComponent: TimeoutIndicator = IframeTimeoutIndicator,
      iframeContainer = iframeEmptyContainer,
      // provider props
      loadingTimeout,
      defaultStyles,
      handleHideInlineDialog,
      handleIframeLoadingStarted,
      handleIframeLoadingComplete,
      handleIframeUnload,
      buildIframeStyles,
    } = this.props;

    const options: IframeOptions = {
      ...defaultOptions,
      ...moduleOptions,
    };

    // TODO: Remove once FF has been removed and no longer required
    // Sandbox attr should always be on once FF removed
    const state = getInitialOrBucketState();
    const sandboxEnabled = state?.global?.features['connect-iframe-sandbox'];
    if (sandboxEnabled) {
      options.sandbox = UrlIframe.IFRAME_SANDBOX;
    }

    const noSubEnabled = state?.global?.features['connect-iframe-no-sub'];
    if (noSubEnabled) {
      options.noSub = true;
    }

    const connectIframeProvider = new ConnectIframeProvider({
      loadingTimeout,
      defaultStyles,
      handleHideInlineDialog,
      handleIframeLoadingStarted,
      handleIframeLoadingComplete,
      handleIframeUnload,
      buildIframeStyles,
    });

    return (
      <ConnectIframe
        key={moduleId}
        connectHost={connectHost}
        appKey={appKey}
        moduleKey={moduleKey}
        // casting to PureComponent as strict requirement not needed
        loadingIndicator={LoadingIndicator as typeof PureComponent}
        // casting to PureComponent as strict requirement not needed
        failedToLoadIndicator={FailedIndicator as typeof PureComponent}
        // casting to PureComponent as strict requirement not needed
        timeoutIndicator={
          TimeoutIndicator as new () => PureComponent<{
            failedCallback: Function;
          }>
        }
        url={url}
        options={{ ...UrlIframe.options, ...options }}
        width={isNumeric(width) ? String(width) : ''}
        height={isNumeric(height) ? String(height) : ''}
        connectIframeProvider={connectIframeProvider}
        // casting to PureComponent as strict requirement not needed
        iframeContainer={
          iframeContainer as new () => PureComponent<IframeContainerProps>
        }
      />
    );
  }
}

export default Connect(UrlIframe);
