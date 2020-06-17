import React, { Component, ComponentType } from 'react';
import { ConnectModule, AddonManager } from '@atlassian/bitbucket-connect-js';
import { ConnectIframeProps } from '../../internal/iframe/connectIframe';

const getCredentials = ({
  id: moduleId,
  app_key: appKey,
  module_type: moduleType,
  targetHref,
  descriptor: { key: moduleKey, location },
}: ConnectModule) => ({
  moduleId,
  moduleKey,
  moduleType,
  appKey,
  location,
  targetHref,
});

export interface FileEditorMainProps {
  source: string;
  onChange?: (source: string) => void;
  onReset?: (source: string) => void;
  width?: string | number;
  height?: string | number;
}

export interface FileEditorRequiredProps {
  module: ConnectModule;
  Component: ComponentType<any>;
}

export type FileEditorProps = FileEditorMainProps &
  FileEditorRequiredProps &
  ConnectIframeProps;

export class FileEditor extends Component<FileEditorProps> {
  componentDidMount() {
    this.openEditor(this.props);
  }

  componentWillReceiveProps(nextProps: FileEditorProps) {
    this.closeEditor(this.props);
    this.openEditor(nextProps);
  }

  shouldComponentUpdate(props: FileEditorProps) {
    const { module: mod, onChange, onReset, width, height } = this.props;
    return (
      mod !== props.module ||
      onChange !== props.onChange ||
      onReset !== props.onReset ||
      width !== props.width ||
      height !== props.height
    );
  }

  componentWillUnmount() {
    this.closeEditor(this.props);
  }

  openEditor = (props: any) => {
    const { module: mod, source, onChange, onReset } = props;
    const credentials = getCredentials(mod);
    AddonManager.editor.editorSetSource(credentials, source);
    if (typeof onChange === 'function') {
      AddonManager.editor.editorSetSource(credentials, source);
      AddonManager.editor.editorAddListener(credentials, 'change', onChange);
    }
    if (typeof onReset === 'function') {
      AddonManager.editor.editorAddListener(credentials, 'reset', onReset);
    }
  };
  closeEditor = (props: any) => {
    const { module: m } = props;
    const credentials = getCredentials(m);
    AddonManager.editor.editorRemoveSource(credentials);
    AddonManager.editor.editorRemoveListener(credentials, 'change');
    AddonManager.editor.editorRemoveListener(credentials, 'reset');
  };

  render() {
    const { Component: Iframe, width, height } = this.props;
    return <Iframe width={width} height={height} />;
  }
}

export default FileEditor;
