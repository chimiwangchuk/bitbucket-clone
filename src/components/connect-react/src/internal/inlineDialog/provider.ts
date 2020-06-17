import { DefaultInlineDialogProvider } from '@atlassian/connect-module-core';
import { LinkerTargetProps } from '../shared/linkerTarget';
import InlineDialog from './inlineDialog';
import { InlineDialogGlobal } from './inlineDialogGlobal';

export interface InlineDialogProviderSubset {
  register: (view: InlineDialog) => void;
  unregister: () => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export class InlineDialogProvider extends DefaultInlineDialogProvider {
  globalView: InlineDialogGlobal;
  views: {
    [key: string]: {
      view: InlineDialog;
      options: any;
    };
  } = {};

  toggle = (key: string) => {
    const wrapper = this.views[key];
    if (wrapper) {
      if (wrapper.view.isOpen()) {
        this.close(key);
      } else {
        this.open(key);
      }
    }
  };

  open = (key: string) => {
    const wrapper = this.views[key];
    if (wrapper) {
      const { view, options } = wrapper;
      if (options && options.closeOthers) {
        Object.entries(this.views).forEach(([k, { view: _view }]) =>
          k === key && !_view.isOpen()
            ? _view.open()
            : _view.isOpen() && _view.close()
        );
      } else {
        view.open();
      }
    }
  };

  // eslint-disable-next-line consistent-return
  isOpen = (key: string) => {
    if (!key) {
      return Object.keys(this.views).some(viewsKey =>
        this.views[viewsKey].view.isOpen()
      );
    }
    const wrapper = this.views[key];
    if (wrapper) {
      return wrapper.view.isOpen();
    }
  };

  close = (key: string) => {
    if (!key) {
      Object.keys(this.views).forEach(this.close);
      return;
    }
    const wrapper = this.views[key];
    if (wrapper) {
      wrapper.view.close();
      if (this.globalView) {
        this.globalView.dispose(key);
      }
    }
  };

  register = (key: string, view: InlineDialog, options: any) => {
    this.views[key] = { view, options };
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  unregister = key => {
    delete this.views[key];
  };

  create = (key: string, options: any = {}): InlineDialogProviderSubset => {
    return {
      register: (view: InlineDialog) => this.register(key, view, options),
      unregister: () => this.unregister(key),
      toggle: () => this.toggle(key),
      open: () => this.open(key),
      close: () => this.close(key),
    };
  };

  // private
  setView = (globalView: InlineDialogGlobal) => {
    this.globalView = globalView;
  };

  createGlobal = ({
    principalId,
    principalType,
    moduleKey,
    appKey,
    linkKey,
    text,
    position,
  }: LinkerTargetProps & { position: DOMRect }) => {
    if (this.globalView) {
      this.globalView.create(
        `${principalId}:${appKey}:${moduleKey}`,
        { position },
        {
          key: moduleKey,
          addon_key: appKey,
          principalId,
          principalType,
          appKey,
          moduleKey,
          linkKey,
          text,
        }
      );
    }
  };
}

export default new InlineDialogProvider();
