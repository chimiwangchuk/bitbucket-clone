import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  DialogModule,
  MessageModule,
  InlineDialogModule,
} from '@atlassian/connect-module-core';
import { ConnectHost, AddonManager } from '@atlassian/bitbucket-connect-js';

import AddonProvider from '../internal/addon/provider';
import DialogProvider, {
  DialogProvider as DialogProviderCls,
} from '../internal/dialog/provider';
import InlineDialogProvider, {
  InlineDialogProvider as InlineDialogProviderCls,
} from '../internal/inlineDialog/provider';
import MessageProvider, {
  MessageProvider as MessageProviderCls,
} from '../internal/message/provider';

import Dialog from '../internal/dialog/dialog';
import InlineDialog from '../internal/inlineDialog/inlineDialogGlobal';
import Message from '../internal/message/message';
import OAuth from '../internal/oauth';

export interface ConnectProviderProps {
  connectHost: ConnectHost;
  addonManager: typeof AddonManager;
  analyticsEventHandler: any;
  children?: React.ReactNode;
}

export interface ConnectProviders {
  dialogProvider: DialogProviderCls;
  messageProvider: MessageProviderCls;
  inlineDialogProvider: InlineDialogProviderCls;
}

export type ConnectProviderContext = ConnectProviderProps & ConnectProviders;

export default class ConnectProvider extends Component<ConnectProviderProps> {
  props: ConnectProviderProps;
  static childContextTypes = {
    dialogProvider: PropTypes.object.isRequired,
    messageProvider: PropTypes.object.isRequired,
    inlineDialogProvider: PropTypes.object.isRequired,
    connectHost: PropTypes.object.isRequired,
    addonManager: PropTypes.object.isRequired,
    analyticsEventHandler: PropTypes.func,
  };
  constructor(props: ConnectProviderProps) {
    super(props);
    props.connectHost.registerProvider('addon', AddonProvider);
    // @ts-ignore TODO: fix noImplicitAny error here
    props.connectHost.onFrameClick(iframe => {
      // clicks inside an iframe don't register in the parent window
      // this causes popups like inline dialog not to behave as expected
      // triggering the click on the iframe element fixes this
      iframe.click();
    });
  }
  getChildContext(): ConnectProviderContext {
    const { connectHost, addonManager, analyticsEventHandler } = this.props;
    return {
      dialogProvider: DialogProvider,
      messageProvider: MessageProvider,
      inlineDialogProvider: InlineDialogProvider,
      connectHost,
      addonManager,
      analyticsEventHandler,
    };
  }
  render() {
    const {
      dialogProvider,
      messageProvider,
      inlineDialogProvider,
      connectHost,
      addonManager,
    } = this.getChildContext();
    const adaptor = connectHost.getFrameworkAdaptor();
    return (
      <div>
        {this.props.children}
        <Dialog
          connectHost={connectHost}
          dialogProvider={dialogProvider}
          addonManager={addonManager}
        />
        <DialogModule adaptor={adaptor} dialogProvider={dialogProvider} />
        <InlineDialog
          connectHost={connectHost}
          addonManager={addonManager}
          inlineDialogProvider={inlineDialogProvider}
        />
        <InlineDialogModule
          adaptor={adaptor}
          inlineDialogProvider={inlineDialogProvider}
        />
        <Message connectHost={connectHost} messageProvider={messageProvider} />
        <MessageModule adaptor={adaptor} messageProvider={messageProvider} />
        <OAuth addonManager={addonManager} />
      </div>
    );
  }
}
