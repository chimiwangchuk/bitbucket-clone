import React from 'react';
import InlineDialog from './inlineDialogIframe';
import InlineDialogLinker from './inlineDialogLinker';
import UniversalPortal from './portal';

export type InlineDialogGlobalProps = {
  connectHost: any;
  addonManager: any;
  inlineDialogProvider: any;
};

export interface InlineDialogGlobalState {
  instances: Array<{ key: string; props: any; data: any }>;
}

export class InlineDialogGlobal extends React.PureComponent<
  InlineDialogGlobalProps,
  InlineDialogGlobalState
> {
  state: InlineDialogGlobalState = {
    instances: [],
  };
  componentWillMount() {
    this.props.inlineDialogProvider.setView(this);
  }
  dismiss() {
    this.state.instances.forEach(({ key }) => this.dispose(key));
  }
  create(key: string, props: any, data: any) {
    let { instances } = this.state;
    const instance = instances.find(({ key: k }) => k === key);
    if (instance) {
      this.dispose(key);
    } else {
      if (!instances.length) {
        const dismiss = () => {
          this.state.instances.forEach(({ key: _key }) => this.dispose(_key));
          window.removeEventListener('scroll', dismiss, true);
        };
        window.addEventListener('scroll', dismiss, true);
      }
      instances = [...instances, { key, props, data }];
      this.setState({ instances });
    }
  }
  dispose(key: string) {
    let { instances } = this.state;
    instances = instances.filter(({ key: k }) => k !== key);
    this.setState({ instances });
  }
  render() {
    const items = this.state.instances.map(({ key, props, data }) => {
      const provider = this.props.inlineDialogProvider.create(key);
      return (
        <InlineDialog
          {...this.props}
          provider={provider}
          isOpen
          IframeComponent={p => (
            <InlineDialogLinker
              {...p}
              connectHost={this.props.connectHost}
              addonManager={this.props.addonManager}
              extension={data}
              options={props}
            />
          )}
          key={key}
        >
          <span
            style={{
              ...props.position,
              position: 'absolute',
              pointerEvents: 'none',
            }}
          />
        </InlineDialog>
      );
    });
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
        {items}
      </div>
    );
  }
}

export default (props: InlineDialogGlobalProps) => {
  return (
    <UniversalPortal container={document.body}>
      <InlineDialogGlobal {...props} />
    </UniversalPortal>
  );
};
