import store from 'src/utils/store';

export const storageKey = (userId: string, messageId: string) =>
  `iedeprecation::${messageId}::${userId}`;

export function shouldDisplayFlag(userId: string, messageId: string) {
  if (!userId) {
    return false;
  }

  const dismissed = store.get(storageKey(userId, messageId), '');
  return dismissed !== 'dismissed';
}

export function messageDismissed(userId: string, messageId: string) {
  store.set(storageKey(userId, messageId), 'dismissed');
}

export const storeDisabled = store.disabled;
