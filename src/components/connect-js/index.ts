export * from './src/types';
export { default } from './src/main/connect';
export { default as ConnectHost } from './src/main/connect';
export { default as AddonManager } from './src/main/addonManager';
export { registerAnalyticsListener } from './src/main/analytics/emitter';
export { sendEvent as sendAnalyticsEvent } from './src/main/analytics/api';
export { replaceContentHandler } from './src/main/contentReplacer/emitter';
export { sharedStateProvider } from './src/main/sharedState';
