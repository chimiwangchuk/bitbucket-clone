import React, { ReactNode } from 'react';

// NOTE: this file only exports components which are used outside of @atlassian/bitkit-diff
// There should not be any usage of `@emotion` in here.

type Props = { children: ReactNode };

export const TopLevelInlineContent = (props: Props) => (
  <div className="bitkit-diff-top-level-inline-content" {...props} />
);

export const InlineContentContainer = (props: Props) => (
  <div className="bitkit-diff-inline-content-container" {...props} />
);
