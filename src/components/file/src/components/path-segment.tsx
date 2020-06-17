// @ts-ignore TODO: fix noImplicitAny error here
import escapeStringRegExp from 'escape-string-regexp';
import React, { PureComponent } from 'react';

import * as styles from '../styles';

export type PathSegmentProps = {
  children: string;
  maxFullPathLength: number;
  separator: string;
  spacing: string;
};

export default class PathSegment extends PureComponent<PathSegmentProps> {
  pickSegments = (segments: string[]): string[] => {
    const { maxFullPathLength } = this.props;

    if (segments.length > maxFullPathLength) {
      const first = segments.slice(0, maxFullPathLength / 2);
      const last = segments.slice(segments.length - maxFullPathLength / 2);

      return [...first, '...', ...last];
    }

    return segments;
  };

  render() {
    const { children: child } = this.props;
    // Wrap the separator in parens to include the separator value in output
    const captureSeparator = new RegExp(
      `(${escapeStringRegExp(this.props.separator)})`,
      'g'
    );

    // Split the segments and let the consumer pick which to show
    const segments = this.pickSegments(child.split(captureSeparator));

    // Wrap each part of the split in a PaddedSegment
    return segments.filter(Boolean).map((segment, idx) => (
      <styles.PaddedSegment
        // eslint-disable-next-line react/no-array-index-key
        key={`padded-segment-${idx}`}
        spacing={this.props.spacing}
        data-qa="bk-filepath__padded-segment"
      >
        {segment}
      </styles.PaddedSegment>
    ));
  }
}
