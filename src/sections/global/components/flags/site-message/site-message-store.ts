import store from 'src/utils/store';

export const storageKey = (userId: string) => `sitemessage::${userId}`;

export function shouldDisplayFlag(userId: string, messageId: number) {
  if (!userId) {
    return false;
  }

  const lastDismissedMessageId = store.get(storageKey(userId), 0);
  return lastDismissedMessageId < messageId;
}

export function messageDismissed(userId: string, messageId: number) {
  store.set(storageKey(userId), messageId);
}

export const storeDisabled = store.disabled;
