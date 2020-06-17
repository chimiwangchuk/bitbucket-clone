// @ts-ignore TODO: fix noImplicitAny error here
import engine from 'store/src/store-engine';
// @ts-ignore TODO: fix noImplicitAny error here
import localStorage from 'store/storages/localStorage';
// @ts-ignore TODO: fix noImplicitAny error here
import memoryStorage from 'store/storages/memoryStorage';
// @ts-ignore TODO: fix noImplicitAny error here
import expirePlugin from 'store/plugins/expire';
import { Blog } from './components/blog-fetch';

// memoryStorage is a fallback if for some reason localStorage doesn't work (e.g. in some browser's private mode).
// Without the fallback, "this.storage is undefined" can happen when we try to use the store.
const storages = [localStorage, memoryStorage];
const plugins = [expirePlugin];

const store = engine.createStore(storages, plugins);

export function clearAll() {
  store.clearAll();
}

// Whats new content
const contentStorageKey = (userUuid: string) => `whatsnew_content::${userUuid}`;

export const lastSeenStorageKey = (userUuid: string) => `whatsnew::${userUuid}`;

export const getLastSeen = (userUuid: string) =>
  store.get(lastSeenStorageKey(userUuid), 0);

export const setLastSeen = (userUuid: string, latestBlogId: number) =>
  store.set(lastSeenStorageKey(userUuid), latestBlogId);

export const getContent = (userUuid: string) =>
  store.get(contentStorageKey(userUuid));

export const setContent = (userUuid: string, blogs: Blog[]) => {
  const oneHourExpiry = new Date().getTime() + 60 * 60 * 1000;
  store.set(contentStorageKey(userUuid), blogs, oneHourExpiry);
};
