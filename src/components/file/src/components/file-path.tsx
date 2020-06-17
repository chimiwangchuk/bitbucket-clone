import React, { PureComponent } from 'react';

import * as styles from '../styles';
import PathSegment from './path-segment';
import ComplexPath from './complex-path';

export type FilePathProps = {
  children: string;
  prevFilePath?: string;
  maxFullPathLength: number;
  separator: string;
  spacing: string;
};

export default class FilePath extends PureComponent<FilePathProps> {
  static defaultProps = {
    children: '',
    maxFullPathLength: 13,
    separator: '/',
    spacing: '0.5em',
  };

  render() {
    const {
      children,
      prevFilePath,
      maxFullPathLength,
      separator,
      spacing,
    } = this.props;

    const segmentProps = {
      maxFullPathLength,
      separator,
      spacing,
    };

    return (
      <styles.FilePath
        onClick={e => {
          // this stops the file component expander from being triggered when
          // selecting text in the file path by click+dragging or
          // double-clicking
          e.stopPropagation();
        }}
        data-qa="bk-filepath"
      >
        {prevFilePath ? (
          <ComplexPath
            {...segmentProps}
            filePath={children}
            prevFilePath={prevFilePath}
          />
        ) : (
          <styles.HighlightLastWord>
            <PathSegment {...segmentProps}>{children}</PathSegment>
          </styles.HighlightLastWord>
        )}
      </styles.FilePath>
    );
  }
}
