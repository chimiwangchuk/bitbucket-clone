import * as React from 'react';
import { ConnectModule } from '@atlassian/bitbucket-connect-js';
import Connect, { ConnectProps } from '../../main/connect';
import ConnectModules from '../modules';
import InlineDialogIframe, {
  InlineDialogIframeProps,
} from './inlineDialogIframe';
import { InlineDialogProviderSubset } from './provider';

export interface InlineDialogProps extends ConnectProps {
  children: (
    args: Array<{
      module: ConnectModule;
      provider: InlineDialogProviderSubset;
      Component: React.FunctionComponent<Partial<InlineDialogIframeProps>>;
    }>
  ) => React.ReactNode;
}

export default Connect(
  ({ children, providers, ...props }: InlineDialogProps) => (
    <ConnectModules {...props}>
      {({ modules }) =>
        children(
          modules.map((m: ConnectModule) => {
            const {
              id,
              descriptor: { target: { options = {} } = {} },
            } = m;
            const provider = providers.inlineDialogProvider.create(id, options);
            return {
              module: m,
              provider,
              Component: p => (
                <InlineDialogIframe
                  {...props}
                  {...p}
                  module={m}
                  provider={provider}
                  key={id}
                />
              ),
            };
          })
        )
      }
    </ConnectModules>
  )
);
