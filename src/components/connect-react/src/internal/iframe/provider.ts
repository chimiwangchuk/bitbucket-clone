import { ConnectIframeProvider as BaseConnectIframeProvider } from '@atlassian/connect-module-core';
import {
  LoadingState,
  ConnectIframeDefinitions,
} from '@atlassian/connect-module-core/dist/es5/modules/app/ConnectIframe';
import { isFunction } from '../../main/utils';

export type IframeActionHandler = (appKey: string) => void;

export type ConnectIframeProviderProps = {
  loadingTimeout?: number;
  defaultStyles?: {
    [key: string]: any;
  };
  handleHideInlineDialog?: Function;
  handleIframeLoadingStarted?: IframeActionHandler;
  handleIframeLoadingComplete?: IframeActionHandler;
  handleIframeUnload?: IframeActionHandler;
  buildIframeStyles?: (
    activeLoadingState: symbol | typeof undefined,
    loadingStates: typeof LoadingState
  ) => void;
};

export default class ConnectIframeProvider
  implements BaseConnectIframeProvider {
  timeoutHandlers: Array<
    (appKey: string, cancelLoadingCallback: Function) => void
  >;
  props: ConnectIframeProviderProps;
  constructor(props: ConnectIframeProviderProps = {}) {
    this.timeoutHandlers = [];
    this.props = {
      loadingTimeout: 5000,
      ...props,
    };
  }

  registerTimeout(timeoutHandler: () => any): void {
    if (!this.timeoutHandlers.find(h => h === timeoutHandler)) {
      this.timeoutHandlers.push(timeoutHandler);
    }
  }

  unregister(timeoutHandler: () => any) {
    this.timeoutHandlers = this.timeoutHandlers.filter(
      h => h !== timeoutHandler
    );
  }

  // Not implimented
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onStoreNestedIframeJSON(_: ConnectIframeDefinitions.Props): void {}

  onHideInlineDialog() {
    if (isFunction(this.props.handleHideInlineDialog)) {
      this.props.handleHideInlineDialog();
    }
  }

  getLoadingTimeoutMilliseconds() {
    // In the ACJS we use an aggressive timeout value so we can test more quickly.
    return this.props.loadingTimeout || 0;
  }

  handleIframeLoadingStarted(appKey: string) {
    if (
      isFunction<IframeActionHandler>(this.props.handleIframeLoadingStarted)
    ) {
      this.props.handleIframeLoadingStarted(appKey);
    }
  }

  handleIframeLoadingComplete(appKey: string) {
    if (
      isFunction<IframeActionHandler>(this.props.handleIframeLoadingComplete)
    ) {
      this.props.handleIframeLoadingComplete(appKey);
    }
  }

  handleIframeUnload(appKey: string) {
    if (
      isFunction<IframeActionHandler>(this.props.handleIframeLoadingComplete)
    ) {
      this.props.handleIframeLoadingComplete(appKey);
    }
  }

  handleIframeLoadTimeout(appKey: string, cancelLoadingCallback: Function) {
    this.timeoutHandlers.forEach(h => h(appKey, cancelLoadingCallback));
  }

  // eslint-disable-next-line consistent-return
  buildIframeStyles(
    activeLoadingState: symbol | typeof undefined,
    loadingStates: typeof LoadingState
  ) {
    if (isFunction(this.props.buildIframeStyles)) {
      return this.props.buildIframeStyles(activeLoadingState, loadingStates);
    }
    switch (activeLoadingState) {
      case loadingStates.LOADED:
        return this.props.defaultStyles;
      case loadingStates.LOADING:
      case loadingStates.TIMEOUT:
        return {
          ...this.props.defaultStyles,
          opacity: 0,
          display: 'none',
          visibility: 'hidden',
        };
    }
  }
}
