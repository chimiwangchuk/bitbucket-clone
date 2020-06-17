import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BucketState, BucketDispatch } from 'src/types/state';
import {
  publishBasePullRequestFact,
  RETRY_LOAD_DIFF_STAT,
  scrollToAnchor,
} from 'src/redux/pull-request/actions';
import updateMobileHeaderState from 'src/redux/global/actions/update-mobile-header-state';
import {
  getActiveDiff,
  getConflictStatus,
  getDiffStatError,
  getIsPullRequestTruncated,
  getUntruncatedPullRequestDiffFileCount,
} from 'src/redux/pull-request/selectors';
import { getFileTree } from 'src/selectors/file-tree-selectors';
import { FileClickProps } from 'src/components/file-tree/src/types';
import FileTreeCard, {
  FileTreeCardStateProps,
  FileTreeCardProps,
} from 'src/components/file-tree-card/file-tree-card';
import { ExpanderOnChangeEvent } from 'src/components/sidebar';
import store from 'src/utils/store';

export const FILE_TREE_CARD_COLLAPSED_LOCALSTORAGE_KEY =
  'file.tree.card.collapsed';

const mapStateToProps = (state: BucketState): FileTreeCardStateProps => {
  return {
    activeDiff: getActiveDiff(state),
    fileTree: getFileTree(state),
    hasConflicts: getConflictStatus(state),
    hasError: !!getDiffStatError(state),
    isTruncated: getIsPullRequestTruncated(state),
    untruncatedFileCount: getUntruncatedPullRequestDiffFileCount(state),
  };
};

const mapDispatchToProps = (dispatch: BucketDispatch) => ({
  onFileClick: (_event: React.MouseEvent, file: FileClickProps) => {
    dispatch(
      publishBasePullRequestFact('bitbucket.pullrequests.filepath.click')
    );

    if (file.href) {
      const anchorId = file.href.replace(/#/, '');
      dispatch(updateMobileHeaderState('none'));
      dispatch(scrollToAnchor(anchorId));
    }
  },
  onErrorClick: () => dispatch({ type: RETRY_LOAD_DIFF_STAT }),
});

type CurrentPullRequestFileTreeProps = Omit<FileTreeCardProps, 'onChange'>;

class CurrentPullRequestFileTree extends Component<
  CurrentPullRequestFileTreeProps
> {
  onCardStatusChange = (event: ExpanderOnChangeEvent) => {
    store.set(FILE_TREE_CARD_COLLAPSED_LOCALSTORAGE_KEY, event.isCollapsed);
  };

  initialCardIsCollapsed = () => {
    if (this.props.initialCardIsCollapsed !== undefined) {
      return this.props.initialCardIsCollapsed;
    }
    return store.get(FILE_TREE_CARD_COLLAPSED_LOCALSTORAGE_KEY, false);
  };

  render() {
    const {
      activeDiff,
      isCollapsed,
      onFileClick,
      hasConflicts,
      fileTree,
      hasError,
      onErrorClick,
      isTruncated,
      untruncatedFileCount,
    } = this.props;

    return (
      <FileTreeCard
        activeDiff={activeDiff}
        onFileClick={onFileClick}
        isCollapsed={isCollapsed}
        fileTree={fileTree}
        hasConflicts={hasConflicts}
        hasError={hasError}
        onErrorClick={onErrorClick}
        onChange={this.onCardStatusChange}
        initialCardIsCollapsed={this.initialCardIsCollapsed()}
        isTruncated={isTruncated}
        untruncatedFileCount={untruncatedFileCount}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentPullRequestFileTree);
