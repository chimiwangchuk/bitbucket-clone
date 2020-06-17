import React, { PureComponent, Fragment } from 'react';

import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';

import * as styles from '../styles';
import PathSegment from './path-segment';

export type ComplexPathProps = {
  prevFilePath: string;
  filePath: string;
  maxFullPathLength: number;
  separator: string;
  spacing: string;
};

export default class ComplexPath extends PureComponent<ComplexPathProps> {
  render() {
    const {
      prevFilePath,
      filePath,
      separator,
      spacing,
      maxFullPathLength,
    } = this.props;

    // Get the longest common prefix and suffix to pretty print a rename.
    // This code was ported from the `pformat_rename()` function in `bitbucket/apps/repo2/diff.py`
    // that was ported from the `pprint_rename()` function in `diff.c`
    // in the Git source code.
    const minLen = Math.min(prevFilePath.length, filePath.length);

    // Find the longest common prefix that ends with a slash and record
    // a positive offset from the beginning.
    let prefixOffset;
    for (let i = 0; i < minLen; i++) {
      if (prevFilePath[i] !== filePath[i]) {
        break;
      }
      if (prevFilePath[i] === separator) {
        prefixOffset = i + 1;
      }
    }
    const prefix = prefixOffset ? prevFilePath.slice(0, prefixOffset) : '';

    // For finding the suffix, only go as far as the slash of the prefix,
    // otherwise the result is incorrect in case prefix and suffix overlap.
    const maxSuffixLen = prefixOffset ? minLen - prefixOffset + 1 : minLen;

    // Find the longest common suffix that starts with a slash and record
    // a negative offset from the end.
    let suffixOffset;
    for (let i = -1; i >= -maxSuffixLen; i--) {
      if (
        prevFilePath[prevFilePath.length + i] !== filePath[filePath.length + i]
      ) {
        break;
      }
      if (prevFilePath[prevFilePath.length + i] === separator) {
        suffixOffset = i;
      }
    }
    const suffix = suffixOffset ? prevFilePath.slice(suffixOffset) : '';

    // Get the part that actually changed.
    const oldName = prevFilePath.slice(prefixOffset, suffixOffset);
    const newName = filePath.slice(prefixOffset, suffixOffset);

    const hasBraces = prefix || suffix;

    // @ts-ignore TODO: fix noImplicitAny error here
    const Segment = ({ children }) => (
      <PathSegment
        maxFullPathLength={maxFullPathLength}
        spacing={spacing}
        separator={separator}
      >
        {children}
      </PathSegment>
    );

    return (
      <Fragment>
        {prefix && <Segment>{prefix}</Segment>}

        {hasBraces && (
          <styles.PaddedSegment
            data-qa="bk-filepath__padded-segment"
            spacing={spacing}
          >
            {'{'}
          </styles.PaddedSegment>
        )}

        <styles.Highlight>
          <Segment>{oldName}</Segment>
        </styles.Highlight>

        <styles.ArrowContainer>
          <ArrowRightIcon label="arrow" size="small" />
        </styles.ArrowContainer>

        <styles.Highlight>
          <Segment>{newName}</Segment>
        </styles.Highlight>

        {hasBraces && (
          <styles.PaddedSegment
            data-qa="bk-filepath__padded-segment"
            spacing={spacing}
          >
            {'}'}
          </styles.PaddedSegment>
        )}

        {suffix && (
          <styles.HighlightLastWord>
            <Segment>{suffix}</Segment>
          </styles.HighlightLastWord>
        )}
      </Fragment>
    );
  }
}
