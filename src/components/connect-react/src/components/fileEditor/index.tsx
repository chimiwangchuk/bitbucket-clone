import React, { PureComponent, ComponentType } from 'react';
import Connect, { ConnectProps } from '../../main/connect';
import { ConnectIframes } from '../../internal/iframe/connectIframes';
import {
  ConnectModulesRequestProps,
  ConnectModulesStandardProps,
} from '../../internal/modules';
import { ConnectModuleIframeProps } from '../../internal/iframe/connectModuleIframe';
import FileEditor, { FileEditorMainProps } from './fileEditor';

export type ConnectFileEditorProps = ConnectModulesRequestProps &
  ConnectModulesStandardProps &
  ConnectModuleIframeProps &
  FileEditorMainProps & {
    defaultComponent?: ComponentType<any>; // rendered if no fileEditor found
  };

export class ConnectFileEditor extends PureComponent<
  ConnectFileEditorProps & ConnectProps
> {
  static defaultProps = {
    width: '100%',
  };
  render() {
    const {
      children,
      width,
      height,
      defaultComponent: DefaultComponent = () => null,
      ...props
    } = this.props;

    return (
      <ConnectIframes {...props} moduleType="fileEditors">
        {iframes => {
          const p = iframes[0];
          if (p) {
            return (
              <FileEditor
                {...props}
                {...p}
                width={width}
                height={height}
                key={p.module.id}
              />
            );
          }
          return <DefaultComponent />;
        }}
      </ConnectIframes>
    );
  }
}

export default Connect(ConnectFileEditor);
