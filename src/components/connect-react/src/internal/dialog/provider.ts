import { DialogProvider as ConnectDialogProvider } from '@atlassian/connect-module-core/src/modules/dialog/DialogProvider';
import { DialogCreationOptions } from '@atlassian/connect-module-core/src/modules/dialog/DialogCreationOptions';
import { UrlIframeProps } from '../iframe/iframe';
import { LinkerTargetProps } from '../shared/linkerTarget';
import Dialog, { DialogAction, DialogExtension } from './dialog';

export class DialogProvider implements ConnectDialogProvider {
  dialogView?: Dialog;
  create = (
    options: Partial<DialogCreationOptions>,
    extension: DialogExtension
  ) => {
    if (!this.dialogView) {
      throw new Error('Dialog view not set');
    }
    this.dialogView.createDialog(options, extension);
    return this.dialogView;
  };

  createUrlIframeDialog = (
    options: Partial<DialogCreationOptions>,
    urlIframeProps: UrlIframeProps
  ) => {
    if (!this.dialogView) {
      throw new Error('Dialog view not set');
    }
    this.dialogView.createUrlIframeDialog(options, urlIframeProps);
    return this.dialogView;
  };

  createButton = (action: DialogAction) => {
    if (this.dialogView) {
      this.dialogView.createButton(action);
    }
  };

  close = () => {
    if (this.dialogView) {
      this.dialogView.close();
    }
  };

  setButtonDisabled = (identifier: string, disabled: boolean) => {
    if (this.dialogView) {
      this.dialogView.setButtonDisabled(identifier, disabled);
    }
  };

  setButtonHidden = (identifier: string, hidden: boolean) => {
    if (this.dialogView) {
      this.dialogView.setButtonHidden(identifier, hidden);
    }
  };

  isButtonDisabled = (identifier: string) =>
    !!this.dialogView && this.dialogView.isButtonDisabled(identifier);

  isButtonHidden = (identifier: string) =>
    !!this.dialogView && this.dialogView.isButtonHidden(identifier);

  toggleButton = (identifier: string) => {
    if (this.dialogView) {
      this.dialogView.toggleButton(identifier);
    }
  };

  isOpen = () => !!this.dialogView && this.dialogView.isOpen();

  isActiveDialog = (addonKey: string) =>
    !!this.dialogView && this.dialogView.isActiveDialog(addonKey);

  getActiveDialogExtension = () =>
    this.dialogView ? this.dialogView.extension : {};

  setView = (dialogView: Dialog) => {
    this.dialogView = dialogView;
  };

  createDialogFromLinker = ({
    principalId,
    principalType,
    appKey = '',
    moduleKey = '',
    linkKey,
    text,
  }: LinkerTargetProps) => {
    if (!this.dialogView) {
      throw new Error('Dialog view not set');
    }
    this.dialogView.createDialog(
      {
        key: moduleKey,
      },
      {
        key: moduleKey,
        addon_key: appKey,
        appKey,
        moduleKey,
        linkKey,
        text,
        principalId,
        principalType,
        options: {},
      }
    );
  };
}

export default new DialogProvider();
