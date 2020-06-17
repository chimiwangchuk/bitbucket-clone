import React, { Component, Fragment } from 'react';

import { DirectoryEntry, FileEntry, TreeEntry, FileTreeProps } from './types';
import { flattenDirectories } from './flatten-directories';
import FileTreeDirectory from './file-tree-directory';
import { FileTreeFile } from './file-tree-file';

type FileTreeState = {
  flattenedFileTree: TreeEntry[];
};

export default class FileTree extends Component<FileTreeProps, FileTreeState> {
  state = {
    flattenedFileTree: this.props.fileTree?.map(flattenDirectories) || [],
  };

  static getDerivedStateFromProps(nextProps: FileTreeProps): FileTreeState {
    return {
      flattenedFileTree: nextProps.fileTree?.map(flattenDirectories) || [],
    };
  }

  renderTreeEntry = (treeEntry: TreeEntry) => {
    return treeEntry.type === 'directory'
      ? this.renderDirectory(treeEntry)
      : this.renderFile(treeEntry);
  };

  renderDirectory = (directory: DirectoryEntry) => {
    const { expandAll } = this.props;
    const { name, contents } = directory;

    return (
      <FileTreeDirectory key={name} name={name} defaultCollapsed={!expandAll}>
        {contents.map(this.renderTreeEntry)}
      </FileTreeDirectory>
    );
  };

  renderFile = (file: FileEntry) => {
    const { onClick, activeDiff } = this.props;
    const {
      name,
      comments,
      fileDiffStatus,
      href,
      isConflicted,
      linesAdded,
      linesRemoved,
    } = file;

    return (
      <FileTreeFile
        key={name}
        name={name}
        comments={comments}
        onClick={onClick}
        href={href}
        fileDiffStatus={fileDiffStatus}
        isConflicted={isConflicted}
        isActive={!!activeDiff && `#${activeDiff}` === href}
        linesAdded={linesAdded}
        linesRemoved={linesRemoved}
      />
    );
  };

  render() {
    const { flattenedFileTree } = this.state;

    return <Fragment>{flattenedFileTree.map(this.renderTreeEntry)}</Fragment>;
  }
}
