import React, { PureComponent, ReactNode } from 'react';
import { connect } from 'react-redux';
import { FileStateless } from '@atlassian/bitkit-file';
import { Diff } from 'src/types/pull-request';
import GenericMessage from 'src/components/generic-message';
import {
  extractFilepath,
  extractPrevFilepath,
} from 'src/utils/extract-file-path';
import { DiffStatusIcon } from 'src/components/diff-file-status/diff-file-status-icon-mapper';
import { TOGGLE_DIFF_EXPANSION } from 'src/redux/pull-request/actions';
import { BucketDispatch } from 'src/types/state';
import { DiffActionsMenu } from '../diff-actions-menu';
import { DiffConflictLozenge } from '../diff-conflict-lozenge';
import { STICKY_HEADER_HEIGHT_OFFSET } from '../utils/calculate-header-offset';
import { PullRequestFileConversation } from '../pull-request-file-conversation';
import * as styles from './hidden-diff.style';

type DispatchingProps = {
  onExpand: (filepath: string, isOpening: boolean) => void;
};

type OwnProps = {
  file: Diff;
  heading: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  isOpen: boolean;
};

type Props = DispatchingProps & OwnProps;

type State = {
  isDiffActionsMenuOpen: boolean;
};

class HiddenDiff extends PureComponent<Props, State> {
  static defaultProps = {
    isOpen: true,
    onExpand: () => {},
  };

  state: State = {
    isDiffActionsMenuOpen: false,
  };

  render() {
    const { isDiffActionsMenuOpen } = this.state;
    const {
      file,
      heading,
      description,
      actions,
      isOpen,
      onExpand,
    } = this.props;
    const { conflictMessage, fileDiffStatus, isConflicted } = file;
    const filepath = extractFilepath(file);

    const dropdownMenu = (
      <DiffActionsMenu
        filepath={filepath}
        onDiffActionsMenuClicked={e =>
          this.setState({ isDiffActionsMenuOpen: e.isOpen })
        }
      />
    );

    const getDiffStatusIcon = () => {
      return fileDiffStatus ? (
        <DiffStatusIcon fileDiffStatus={fileDiffStatus} />
      ) : (
        undefined
      );
    };

    const shouldRenderConflictLozenge = () => {
      return isConflicted && conflictMessage
        ? () => <DiffConflictLozenge conflictMessage={conflictMessage} />
        : undefined;
    };

    return (
      <FileStateless
        dropdownMenu={dropdownMenu}
        icon={getDiffStatusIcon()}
        isCollapsible
        isDropdownMenuOpen={isDiffActionsMenuOpen}
        isExpanded={isOpen}
        toggleExpanded={() => onExpand(filepath, !isOpen)}
        filePath={filepath}
        prevFilePath={extractPrevFilepath(file)}
        renderAfterFilePath={shouldRenderConflictLozenge()}
        hasStickyHeader
        stickyHeaderOffset={STICKY_HEADER_HEIGHT_OFFSET}
      >
        <PullRequestFileConversation file={file} />
        <GenericMessage iconType="info" title={heading}>
          {description && description}
          {actions && <styles.ActionsList>{actions}</styles.ActionsList>}
        </GenericMessage>
      </FileStateless>
    );
  }
}

const mapDispatchToProps = (dispatch: BucketDispatch): DispatchingProps => ({
  onExpand: (filepath: string, isOpening: boolean) =>
    dispatch({
      type: TOGGLE_DIFF_EXPANSION,
      payload: { filepath, isOpening },
    }),
});

export default connect(undefined, mapDispatchToProps)(HiddenDiff);
