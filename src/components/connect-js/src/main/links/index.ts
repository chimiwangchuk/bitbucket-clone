// @ts-ignore TODO: fix noImplicitAny error here
import ConnectHost from 'atlassian-connect-js';
import assignLinkHandlers from '../../plugin/links';
import { getSharedState } from '../sharedState';
import { flatMerge } from '../../utils';
import { ConnectModuleLinkData } from '../../types';

let cmdOrCtrl = false;

export function setConnectLinkMetaKey(isSelected: boolean) {
  cmdOrCtrl = isSelected;
}

export function handleScrollEvent() {
  const inlineDialogProvider = ConnectHost.frameworkAdaptor.getProviderByModuleName(
    'inlineDialog'
  );
  if (inlineDialogProvider && inlineDialogProvider.isOpen()) {
    inlineDialogProvider.close();
  }
}

export function handleConnectLink(linkData: Partial<ConnectModuleLinkData>) {
  if (!linkData || !linkData.href) {
    return;
  }
  if (cmdOrCtrl) {
    window.open(linkData.href);
  } else {
    window.location.href = linkData.href;
  }
  cmdOrCtrl = false;
}

export function createDialog(linkData: ConnectModuleLinkData) {
  const data: Partial<ConnectModuleLinkData> = flatMerge(
    getSharedState(),
    linkData
  );
  if (data.href && cmdOrCtrl) {
    handleConnectLink(data);
    return;
  }
  const dialogProvider = ConnectHost.frameworkAdaptor.getProviderByModuleName(
    'dialog'
  );
  if (dialogProvider) {
    if (dialogProvider.isOpen()) {
      const extension = dialogProvider.getActiveDialogExtension();
      if (!extension) {
        throw new Error('Extension require to close connect dialog.');
      }
      // close exisiting dialog before opening a new one
      ConnectHost.dialog.close(extension.addon_key, extension);
      // A slight delay is needed to prevent atlassian-connect-js throwing a dialog not found exception.
      // There is no way to hook into the connect 'dialog.close' event on the host side. That would be preferred.
      setTimeout(() => dialogProvider.createDialogFromLinker(data), 100);
      return;
    }
    dialogProvider.createDialogFromLinker(data);
  }
}

export function createInlineDialog(linkData: ConnectModuleLinkData) {
  const data: Partial<ConnectModuleLinkData> = flatMerge(
    getSharedState(),
    linkData
  );
  if (data.href && cmdOrCtrl) {
    handleConnectLink(data);
    return;
  }
  const inlineDialogProvider = ConnectHost.frameworkAdaptor.getProviderByModuleName(
    'inlineDialog'
  );
  if (inlineDialogProvider) {
    if (!data.extensionId) {
      inlineDialogProvider.createGlobal(data);
      return;
    }
    const iframe = document.getElementById(data.extensionId);
    if (!iframe) {
      return;
    }
    const pos = iframe.getBoundingClientRect();
    const { top, left } = data.position || { top: 0, left: 0 };
    inlineDialogProvider.createGlobal({
      ...data,
      position: {
        ...data.position,
        top: pos.top + top,
        left: pos.left + left,
      },
    });
  }
}

// This sets up linkers locally within frontbucket
// Otherwise, handlers are called over the bridge
assignLinkHandlers(
  {
    links: {
      setConnectLinkMetaKey,
      handleConnectLink,
      createDialog,
      createInlineDialog,
    },
  },
  true
);
