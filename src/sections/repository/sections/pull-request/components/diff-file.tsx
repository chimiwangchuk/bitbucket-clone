import React, { Fragment, useCallback, useRef, useState } from 'react';
import { ModalTransition } from '@atlaskit/modal-dialog';
import Diff, {
  LineAnnotation,
  getLineAnnotations,
} from '@atlassian/bitkit-diff';
import * as styles from '@atlassian/bitkit-diff/styles';

import { useIntl } from 'src/hooks/intl';
import { Diff as DiffType } from 'src/types/pull-request';
import {
  extractFilepath,
  extractPrevFilepath,
} from 'src/utils/extract-file-path';
import { DiffStatusIcon } from 'src/components/diff-file-status/diff-file-status-icon-mapper';
import { ExpandContextParams } from 'src/redux/pull-request/actions/expand-context';

import { FileStateless } from '@atlassian/bitkit-file';

import OutdatedCommentsButton from '../containers/outdated-comments-button';
import { useConversations } from '../hooks/conversations';
import {
  useAnnotations,
  useDiffPreferences,
  usePermalinks,
} from '../hooks/diffs';

import { DiffActionsMenu } from './diff-actions-menu';
import { PullRequestFileConversation } from './pull-request-file-conversation';
import { DiffConflictLozenge } from './diff-conflict-lozenge';
import { STICKY_HEADER_HEIGHT_OFFSET } from './utils/calculate-header-offset';
import DiscardCommentsDialog, {
  useDiscardCommentsDialogState,
} from './discard-comments-dialog';
import diffMessages from './diff.i18n';

export type StateProps = {
  bannerAndNavHeight: number;
};

export type DispatchProps = {
  expandContext: (params: ExpandContextParams) => void;
  onExpand: (filepath: string, isOpening: boolean) => void;
  onEditorOpenStateChange: (isOpen: boolean) => void;
  onToggleSideBySideMode: (filePath: string, isSideBySide: boolean) => void;
};

export type OwnProps = {
  file: DiffType;
  fileIndex: number;
  isOpen: boolean;
};

export type Props = StateProps & DispatchProps & OwnProps;

const DiffFile = (props: Props) => {
  const {
    bannerAndNavHeight,
    expandContext,
    file,
    fileIndex,
    isOpen = true,
    onEditorOpenStateChange,
    onExpand,
    onToggleSideBySideMode,
  } = props;

  const { conflictMessage, fileDiffStatus, isConflicted } = file;
  const filepath = extractFilepath(file);

  const intl = useIntl();
  // The # of inline editors that are currently open (new threads and replies)
  const numInlineEditorsOpen = useRef(0);
  const popupMountElement = useRef(null);

  const [isDiffActionsMenuOpen, setIsDiffActionsMenuOpen] = useState(false);

  const { fileAnnotations, isPrAnnotationsEnabled } = useAnnotations(file);
  const {
    isColorBlindModeEnabled,
    isWordWrapEnabled,
    isSideBySide,
  } = useDiffPreferences(file);
  const { activePermalink, onPermalinkClick, showPermalinks } = usePermalinks();

  const {
    confirmDiscardComments,
    dialogProps,
    isDialogOpen,
  } = useDiscardCommentsDialogState();

  const handleDiffActionsMenuClicked = useCallback(
    e => setIsDiffActionsMenuOpen(!!e.isOpen),
    [setIsDiffActionsMenuOpen]
  );

  const handleInlineEditorClose = useCallback(() => {
    numInlineEditorsOpen.current--;
    if (numInlineEditorsOpen.current === 0) {
      onEditorOpenStateChange(false);
    }
  }, [onEditorOpenStateChange]);

  const handleInlineEditorOpen = useCallback(() => {
    numInlineEditorsOpen.current++;
    onEditorOpenStateChange(true);
  }, [onEditorOpenStateChange]);

  const {
    discardCommentsModal,
    onAddInlineComment,
    renderInlineConversations,
  } = useConversations({
    diff: file,
    editorPopupsMountPointRef: popupMountElement,
    onInlineEditorClose: handleInlineEditorClose,
    onInlineEditorOpen: handleInlineEditorOpen,
  });

  const handleShowMoreLines = useCallback(
    (expanderIndex: number) => {
      const getMoreContextLines = () => {
        // @ts-ignore Do we use peekAheadOnly field anymore?
        expandContext({ expanderIndex, fileIndex, filepath });
      };

      // Context expansion will cause a full re-render and wipe out the content in any
      // open comment editors (new threads) and close any replies
      if (numInlineEditorsOpen.current > 0) {
        confirmDiscardComments({
          message: diffMessages.discardCommentsModalBody__ExpandContext,
          onConfirmDiscard: () => {
            getMoreContextLines();
          },
        });
      } else {
        getMoreContextLines();
      }
    },
    [confirmDiscardComments, expandContext, fileIndex, filepath]
  );

  const handleSideBySideClick = useCallback(() => {
    const activateSideBySideMode = () => {
      onToggleSideBySideMode(filepath, !isSideBySide);
    };
    // Toggling SBS vs. Unified will cause a full re-render and wipe out the content in
    // any open comment editors (new threads) and close any replies
    if (numInlineEditorsOpen.current > 0) {
      confirmDiscardComments({
        message: diffMessages.discardCommentsModalBody__SideBySideToggle,
        onConfirmDiscard: activateSideBySideMode,
      });
    } else {
      activateSideBySideMode();
    }
  }, [confirmDiscardComments, filepath, isSideBySide, onToggleSideBySideMode]);

  const dropdownMenu = (
    <DiffActionsMenu
      filepath={filepath}
      isDeleted={fileDiffStatus === 'removed'}
      isSideBySide={isSideBySide}
      onSideBySide={() => {
        onExpand(filepath, true);
        handleSideBySideClick();
      }}
      onDiffActionsMenuClicked={handleDiffActionsMenuClicked}
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

  const stickyHeaderOffset = STICKY_HEADER_HEIGHT_OFFSET + bannerAndNavHeight;

  const lineAnnotations = getLineAnnotations(fileAnnotations, 0);

  return (
    <Fragment>
      <article
        data-qa="pr-diff-file-styles"
        ref={popupMountElement}
        aria-label={intl.formatMessage(diffMessages.diffFileTitle, {
          filepath,
        })}
      >
        <FileStateless
          prevFilePath={extractPrevFilepath(file)}
          filePath={filepath}
          icon={getDiffStatusIcon()}
          dropdownMenu={dropdownMenu}
          isCollapsible
          isDropdownMenuOpen={isDiffActionsMenuOpen}
          isExpanded={isOpen}
          hasStickyHeader
          stickyHeaderOffset={stickyHeaderOffset}
          toggleExpanded={() => onExpand(filepath, !isOpen)}
          renderAfterFilePath={shouldRenderConflictLozenge()}
          renderBeforeActions={() => <OutdatedCommentsButton file={file} />}
        >
          {isPrAnnotationsEnabled && lineAnnotations.length ? (
            <styles.TopLevelInlineContent>
              <LineAnnotation lineAnnotations={lineAnnotations} />
            </styles.TopLevelInlineContent>
          ) : null}
          <PullRequestFileConversation
            file={file}
            popupMountElement={popupMountElement.current}
          />
          <Diff
            activePermalink={activePermalink}
            diff={{ chunks: file.chunks }}
            fileAnnotations={fileAnnotations}
            filePath={filepath}
            inlineContent={renderInlineConversations}
            isColorBlindModeEnabled={isColorBlindModeEnabled}
            isPrAnnotationsEnabled={isPrAnnotationsEnabled}
            isSideBySide={isSideBySide}
            isWordWrapEnabled={isWordWrapEnabled}
            onAddComment={onAddInlineComment}
            onPermalinkClick={onPermalinkClick}
            onShowMoreLines={handleShowMoreLines}
            showPermalinks={showPermalinks}
          />
        </FileStateless>
      </article>
      {/* This modal enforces 1 open inline comment editor at a time */}
      {discardCommentsModal}
      {/* This modal catches dropdown menu actions: SBS/Unified mode switches and context expansion */}
      <ModalTransition>
        {isDialogOpen && <DiscardCommentsDialog {...dialogProps} />}
      </ModalTransition>
    </Fragment>
  );
};

export default React.memo(DiffFile);
