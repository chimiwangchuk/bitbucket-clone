import React, { KeyboardEvent, PureComponent } from 'react';
import {
  ActionOptions,
  DialogCreationOptions,
} from '@atlassian/connect-module-core/src/modules/dialog/DialogCreationOptions';
import { ConnectModuleCredentials } from '@atlassian/bitbucket-connect-js';
import UrlIframe, { UrlIframeProps } from '../iframe/iframe';
import { LinkerExtension } from '../shared/linkerHOC';
import DialogModal from './dialogModal';
import DialogLinker from './dialogLinker';

export interface DialogAction extends ActionOptions {
  key: string;
  name?: string;
  type?: string;
  disabled?: boolean;
  hidden?: boolean;
  immutable?: boolean;
}

export type DialogExtension = ConnectModuleCredentials & LinkerExtension;

export interface DialogCreationOptionsExtended extends DialogCreationOptions {
  actions: DialogAction[];
}

export type DialogProvider = any;

export type DialogProps = {
  connectHost: any;
  addonManager: any;
  dialogProvider: DialogProvider;
};

export enum DialogActiveState {
  NONE,
  DIALOG,
  DIALOG_LINKER,
  DIALOG_URL_IFRAME,
}

export type DialogState = {
  active: DialogActiveState;
  options?: DialogCreationOptionsExtended;
  extension?: DialogExtension;
  urlIframeProps?: UrlIframeProps;
};

export default class Dialog extends PureComponent<DialogProps, DialogState> {
  props: DialogProps;

  static getDefaultCreationOptions = (): DialogCreationOptionsExtended => ({
    key: '',
    size: 'large', // ref: AK-1723
    width: '',
    height: '',
    chrome: true,
    header: '',
    actions: [],
    closeOnEscape: true,
    hint: '',
  });

  static compareButtons(a: DialogAction, b: DialogAction) {
    if (a.identifier === 'cancel') {
      return 1;
    } else if (a.identifier === 'submit') {
      if (b.identifier === 'cancel') {
        return -1;
      }
      return 1;
    }
    return 0;
  }

  static convertFromJSAPI(dialogCreationOptions: any) {
    const { width, height, size } = dialogCreationOptions;
    let { actions = [] } = dialogCreationOptions;
    actions = actions.sort(Dialog.compareButtons);
    // @ts-ignore TODO: fix noImplicitAny error here
    actions = actions.map(action => ({
      ...action,
      hidden: action.hidden || false,
    }));
    // @ts-ignore TODO: fix noImplicitAny error here
    actions = actions.map(action => ({
      ...action,
      hidden: action.disabled || false,
    }));
    // @ts-ignore TODO: fix noImplicitAny error here
    actions = actions.map(action => ({
      ...action,
      key: action.identifier,
    }));
    return {
      ...dialogCreationOptions,
      width: width || size,
      height: height || size,
      actions,
    };
  }

  state: DialogState = {
    active: DialogActiveState.NONE,
  };

  componentWillMount() {
    this.props.dialogProvider.setView(this);
  }

  // eslint-disable-next-line @typescript-eslint/camelcase
  get addon_key() {
    const { extension, urlIframeProps } = this.state;
    if (extension) {
      return extension.addon_key;
    } else if (urlIframeProps) {
      return urlIframeProps.appKey;
    }
    return '';
  }

  get extension() {
    return this.state.extension || {};
  }

  isOpen = () => this.state.active !== DialogActiveState.NONE;

  close = () => {
    this.setState({
      active: DialogActiveState.NONE,
    });
  };

  dismissDialog = (e: KeyboardEvent<HTMLElement>) => {
    const { extension, urlIframeProps, options } = this.state;
    if (extension || urlIframeProps) {
      const { closeOnEscape } = (extension && extension.options) || options;
      if (
        typeof e.key !== 'undefined' &&
        e.key === 'Escape' &&
        typeof closeOnEscape !== 'undefined' &&
        closeOnEscape === false
      ) {
        return;
      }
      this.props.connectHost.dialog.close(this.addon_key, extension);
    }
  };

  /**
   * @param dialogCreationOptions - for type info, see @atlassian/connect-module-core/main/modules/flag/DialogCreationOptions.
   */
  createDialog = (
    options: Partial<DialogCreationOptions>,
    extension: DialogExtension
  ) => {
    this.setState({
      active: extension.linkKey
        ? DialogActiveState.DIALOG_LINKER
        : DialogActiveState.DIALOG,
      options: Dialog.convertFromJSAPI({
        ...Dialog.getDefaultCreationOptions(),
        ...options,
      }),
      extension,
      urlIframeProps: undefined,
    });
  };

  createUrlIframeDialog = (
    options: Partial<DialogCreationOptions>,
    urlIframeProps: UrlIframeProps
  ) => {
    this.setState({
      active: DialogActiveState.DIALOG_URL_IFRAME,
      options: Dialog.convertFromJSAPI({
        ...Dialog.getDefaultCreationOptions(),
        ...options,
      }),
      extension: undefined,
      urlIframeProps,
    });
  };

  createButton = (action: DialogAction) => {
    const { active, options } = this.state;
    if (options && active === DialogActiveState.DIALOG) {
      const actions = options.actions.slice();
      actions.unshift(
        Object.assign(action, {
          key: action.identifier,
          hidden: false,
          disabled: false,
        })
      );
      this.setState({
        options: {
          ...options,
          actions,
        },
      });
    }
  };

  setButtonDisabled = (identifier: string, disabled: boolean) => {
    const { active, options } = this.state;
    if (options && active === DialogActiveState.DIALOG) {
      const actions = options.actions.map(action =>
        action.identifier === identifier
          ? Object.assign(action, { disabled })
          : action
      );
      this.setState({
        options: {
          ...options,
          actions,
        },
      });
    }
  };

  setButtonHidden = (identifier: string, hidden: boolean) => {
    const { active, options } = this.state;
    if (options && active === DialogActiveState.DIALOG) {
      const actions = options.actions.map(action =>
        action.identifier === identifier
          ? Object.assign(action, { hidden })
          : action
      );
      this.setState({
        options: {
          ...options,
          actions,
        },
      });
    }
  };

  isButtonDisabled = (identifier: string) => {
    const { active, options } = this.state;
    if (options && active === DialogActiveState.DIALOG) {
      const action = options.actions.find(a => a.identifier === identifier);
      if (action) {
        return !!action.disabled;
      }
    }
    return false;
  };

  isButtonHidden = (identifier: string) => {
    const { active, options } = this.state;
    if (options && active === DialogActiveState.DIALOG) {
      const action = options.actions.find(a => a.identifier === identifier);
      if (action) {
        return !!action.hidden;
      }
    }
    return false;
  };

  toggleButton = (identifier: string) => {
    const { active, options } = this.state;
    if (options && active === DialogActiveState.DIALOG) {
      const actions = options.actions.map(action =>
        action.identifier === identifier
          ? Object.assign(action, { disabled: !action.disabled })
          : action
      );
      this.setState({
        options: {
          ...options,
          actions,
        },
      });
    }
  };

  isActiveDialog = (addonKey: string) => {
    return this.addon_key === addonKey;
  };

  dialogLinkerChange = ({ options, extension }: any) => {
    // NOTE: Pipelines requires a linker to open a dialog within a dialog
    // and atlassian-connect-js, which connect-js/connect-react is built on,
    // only supports one dialog. We also need to query the modules API for
    // connect data if not in cache, so we're using a HOC that renders a
    // dialog, calls the modules API and hooks into and onChange event to
    // then create a connect dialog via connectHost as to maintain state
    // with atlassian-connect-js. If we didn't use this method, then calling
    // AP.dialog.close() from within an Connect Iframe would not work.
    // We're also stubbing a default cancel footer link for when chrome === true
    this.props.connectHost.dialog.create(
      {
        ...extension,
        options: {
          ...extension.options,
        },
      },
      {
        chrome: true,
        buttons: [
          {
            text: 'Cancel',
            identifier: 'cancel',
            type: 'link',
            onClick: this.close,
          },
        ],
        ...options,
      }
    );
  };

  render() {
    const { connectHost, addonManager } = this.props;
    const { active, extension, options, urlIframeProps } = this.state;

    const isOpen = active !== DialogActiveState.NONE;

    if (extension) {
      if (active === DialogActiveState.DIALOG_LINKER) {
        return (
          <DialogLinker
            isOpen={isOpen}
            connectHost={connectHost}
            addonManager={addonManager}
            extension={extension}
            options={options}
            onChange={this.dialogLinkerChange}
            dismissDialog={this.dismissDialog}
          />
        );
      }
      return (
        <DialogModal
          isOpen={isOpen}
          connectHost={connectHost}
          addonManager={addonManager}
          extension={extension}
          options={options}
          dismissDialog={this.dismissDialog}
        />
      );
    } else if (urlIframeProps) {
      return (
        <DialogModal
          isOpen={isOpen}
          connectHost={connectHost}
          addonManager={addonManager}
          extension={{}}
          options={options}
          dismissDialog={this.dismissDialog}
        >
          {defaultIframeProps => (
            <UrlIframe {...defaultIframeProps} {...urlIframeProps} />
          )}
        </DialogModal>
      );
    }

    return null;
  }
}
