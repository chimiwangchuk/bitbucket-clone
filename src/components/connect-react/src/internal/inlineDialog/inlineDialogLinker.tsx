import React from 'react';
import { ConnectHost, ConnectModule } from '@atlassian/bitbucket-connect-js';
import LinkerHOC, { LinkerProps } from '../shared/linkerHOC';
import IframeWrapper from './inlineDialogIframeWrapper';

export interface InlineDialogLinkerProps extends LinkerProps {
  connectHost: ConnectHost;
  module: ConnectModule;
  handleHideInlineDialog: Function;
}

export default LinkerHOC<InlineDialogLinkerProps>(
  ({ connectHost, options, module: mod, handleHideInlineDialog }) => {
    return (
      <IframeWrapper
        connectHost={connectHost}
        module={mod}
        inlineDialogOptions={options}
        handleHideInlineDialog={handleHideInlineDialog}
      />
    );
  }
);
