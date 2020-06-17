// @ts-ignore TODO: fix noImplicitAny error here
import engine from 'store/src/store-engine';
// @ts-ignore TODO: fix noImplicitAny error here
import localStorage from 'store/storages/localStorage';
// @ts-ignore TODO: fix noImplicitAny error here
import memoryStorage from 'store/storages/memoryStorage';

// memoryStorage is a fallback if for some reason localStorage doesn't work (e.g. in some browser's private mode).
// Without the fallback, "this.storage is undefined" can happen when we try to use the store.
const storages = [localStorage, memoryStorage];
// @ts-ignore TODO: fix noImplicitAny error here
const plugins = [];

// @ts-ignore TODO: fix noImplicitAny error here
export default engine.createStore(storages, plugins);
