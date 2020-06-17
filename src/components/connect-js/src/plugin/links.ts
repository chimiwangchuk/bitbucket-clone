import { ConnectModuleLinkData } from '../types';
import { throttle } from './utils';

function getLinkData(target: any, addon: any): ConnectModuleLinkData {
  return {
    moduleKey: target.getAttribute('data-module-key'),
    appKey: target.getAttribute('data-app-key'),
    linkKey: target.getAttribute('data-link-key'),
    text: target.textContent,
    href: target.href,
    principalId:
      target.getAttribute('data-principal-uuid') || addon.options.principalId,
    extensionId: addon.extension_id,
  };
}

export default (AP: any, isHost?: boolean) => {
  // @ts-ignore TODO: fix noImplicitAny error here
  let addon;
  if (isHost) {
    addon = { options: { isInlineDialog: true }, extension_id: '' };
  } else {
    try {
      addon = JSON.parse(window.name);
    } catch (e) {
      throw new Error('AP failed to parse window name');
    }
  }
  if (
    typeof addon !== 'object' ||
    typeof addon.options !== 'object' ||
    addon.options === null
  ) {
    return;
  }
  window.addEventListener('keydown', (event: MouseEvent) =>
    AP.links.setConnectLinkMetaKey(event.ctrlKey || event.metaKey)
  );
  window.addEventListener('keyup', (event: MouseEvent) =>
    AP.links.setConnectLinkMetaKey(event.ctrlKey || event.metaKey)
  );
  if (!addon.options.isInlineDialog) {
    window.addEventListener(
      'scroll',
      throttle(() => AP.links.handleScrollEvent(), 300),
      true
    );
  }
  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target || !target.classList) {
      return;
    }
    if (target.classList.contains('ap-connect-link')) {
      event.preventDefault();
      // @ts-ignore TODO: fix noImplicitAny error here
      AP.links.handleConnectLink(getLinkData(target, addon));
    } else if (target.classList.contains('ap-connect-dialog')) {
      event.preventDefault();
      // @ts-ignore TODO: fix noImplicitAny error here
      AP.links.createDialog(getLinkData(target, addon));
    } else if (target.classList.contains('ap-connect-inline-dialog')) {
      event.preventDefault();
      event.stopPropagation(); // This is needed to prevent inlineDialog closing after open as click gets triggered in parent frame.
      AP.links.createInlineDialog({
        // @ts-ignore TODO: fix noImplicitAny error here
        ...getLinkData(target, addon),
        // DOMRect issue: https://github.com/Microsoft/TypeScript/issues/11085
        position: (target.getBoundingClientRect() as DOMRect).toJSON(),
      });
    }
  });
};
