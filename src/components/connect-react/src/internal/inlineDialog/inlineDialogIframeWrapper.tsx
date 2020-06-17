import React from 'react';
import { ConnectModule } from '@atlassian/bitbucket-connect-js';
import { ConnectModuleIframe } from '../iframe/connectModuleIframe';
import IframeLoadingIndicator from '../iframe/iframeLoadingIndicator';
import IframeTimeoutIndicator from '../iframe/iframeTimeoutIndicator';

export type InlineDialogIframeWrapperProps = {
  module: ConnectModule;
  connectHost: any;
  inlineDialogOptions: any;
  handleHideInlineDialog: Function;
};

export default function InlineDialogIframeWrapper({
  module: mod,
  connectHost,
  handleHideInlineDialog,
  inlineDialogOptions = {},
}: InlineDialogIframeWrapperProps) {
  const { width, height } = inlineDialogOptions;
  return (
    <ConnectModuleIframe
      connectHost={connectHost}
      module={mod}
      width={width}
      height={height}
      options={{
        ...inlineDialogOptions,
        hostFrameOffset: 1,
        isInlineDialog: true,
      }}
      handleHideInlineDialog={handleHideInlineDialog}
      loadingComponent={IframeLoadingIndicator}
      loadingTimeoutComponent={IframeTimeoutIndicator}
      defaultStyles={{
        display: 'block',
      }}
    />
  );
}
