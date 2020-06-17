import React from 'react';
import Connect from '../../main/connect';
import {
  ConnectIframe,
  ConnectIframeProps,
} from '../../internal/iframe/connectIframe';

export default Connect(({ ...props }: ConnectIframeProps) => (
  <ConnectIframe
    {...props}
    width="100%"
    options={{ autoresize: true }}
    moduleType="fileViews"
  />
));
