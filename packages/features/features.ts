export const FeatureKeys = {
  isExampleFlag: 'example-flag',
  isAAEnabled: 'is-aa-enabled',
  bbogDiscoverExperiment: 'bb.og.discover',
  isIssueTransitionOnMergeEnabled: 'transition-issues-on-pr-merged',
} as const;

export type FeatureKeyType = typeof FeatureKeys[keyof typeof FeatureKeys];
