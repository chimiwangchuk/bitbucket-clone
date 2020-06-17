import React, { PureComponent, ComponentType } from 'react';
import PropTypes from 'prop-types';
import { AddonManager } from '@atlassian/bitbucket-connect-js';

import { DialogProvider } from '../internal/dialog/provider';
import { InlineDialogProvider } from '../internal/inlineDialog/provider';
import { MessageProvider } from '../internal/message/provider';
import { ConnectProviderContext } from './provider';

export interface ConnectProps {
  addonManager: typeof AddonManager;
  connectHost: any;
  analyticsEventHandler: any;
  providers: {
    dialogProvider: DialogProvider;
    inlineDialogProvider: InlineDialogProvider;
    messageProvider: MessageProvider;
  };
}

export default function Connect<P>(Component: ComponentType<P>) {
  return class extends PureComponent<
    Pick<P, Exclude<keyof P, keyof ConnectProps>>
  > {
    context: ConnectProviderContext;
    static component = Component;
    static contextTypes = {
      connectHost: PropTypes.object.isRequired,
      addonManager: PropTypes.object.isRequired,
      analyticsEventHandler: PropTypes.func,
      dialogProvider: PropTypes.object,
      inlineDialogProvider: PropTypes.object,
      messageProvider: PropTypes.object,
    };
    render() {
      const {
        connectHost,
        addonManager,
        analyticsEventHandler,
        dialogProvider,
        inlineDialogProvider,
        messageProvider,
      } = this.context;
      return (
        <Component
          {...(this.props as P)}
          connectHost={connectHost}
          addonManager={addonManager}
          analyticsEventHandler={analyticsEventHandler}
          providers={{ dialogProvider, inlineDialogProvider, messageProvider }}
        />
      );
    }
  };
}
