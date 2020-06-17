import React, { KeyboardEvent } from 'react';
import { ConnectHost } from '@atlassian/bitbucket-connect-js';
import LinkerHOC, { LinkerProps } from '../shared/linkerHOC';
import DialogModal from './dialogModal';

export interface DialogLinkerProps extends LinkerProps {
  isOpen: boolean;
  connectHost: ConnectHost;
  dismissDialog: (e: KeyboardEvent<HTMLElement>) => void;
}

export default LinkerHOC<DialogLinkerProps>(
  ({
    connectHost,
    addonManager,
    extension,
    options,
    isOpen,
    dismissDialog,
  }) => (
    <DialogModal
      connectHost={connectHost}
      addonManager={addonManager}
      extension={extension}
      options={options}
      isOpen={isOpen}
      dismissDialog={dismissDialog}
    />
  )
);
