import React, { useState, useCallback } from 'react';
import { InjectedIntl } from 'react-intl';

import { DiffStatStatus } from 'src/types/diffstat';
import { DiffStatusIcon } from 'src/components/diff-file-status/diff-file-status-icon-mapper';
import { FileStateless } from 'src/components/file';
import { useIntl } from 'src/hooks/intl';

import { DiffActionsMenu } from 'src/sections/repository/sections/pull-request/components/diff-actions-menu';
import { DiffConflictLozenge } from 'src/sections/repository/sections/pull-request/components/diff-conflict-lozenge';
import { PullRequestFileConversation } from 'src/sections/repository/sections/pull-request/components/pull-request-file-conversation';

import messages from './image-diff.i18n';
import * as styles from './image-diff.style';
import { ImageDiffProps } from './types';

function renderImageDiffContent(intl: InjectedIntl, props: ImageDiffProps) {
  const { file, beforeUrl, afterUrl } = props;

  switch (file.fileDiffStatus) {
    case DiffStatStatus.Added: {
      const title = intl.formatMessage(messages.added);
      return <styles.ImageDiffContentAfter title={title} source={afterUrl} />;
    }
    case DiffStatStatus.Removed: {
      const title = intl.formatMessage(messages.removed);
      return <styles.ImageDiffContentBefore title={title} source={beforeUrl} />;
    }
    case DiffStatStatus.BinaryConflict:
    case DiffStatStatus.Modified: {
      const beforeTitle = intl.formatMessage(messages.before);
      const afterTitle = intl.formatMessage(messages.after);

      return (
        <styles.TwoUp>
          <styles.ImageDiffContentBefore
            title={beforeTitle}
            source={beforeUrl}
          />
          <styles.ImageDiffContentAfter title={afterTitle} source={afterUrl} />
        </styles.TwoUp>
      );
    }
    default:
      return null;
  }
}

function ImageDiff(props: ImageDiffProps) {
  const {
    file,
    filepath,
    prevFilepath,
    isOpen,
    toggleExpanded,
    stickyHeaderOffset,
  } = props;
  const { fileDiffStatus } = file;
  const [isDiffActionsMenuOpen, setIsDiffActionsMenuOpen] = useState(false);

  const dropdownMenu = (
    <DiffActionsMenu
      onSideBySide={undefined}
      onAddComment={undefined}
      filepath={filepath}
      isDeleted={fileDiffStatus === DiffStatStatus.Removed}
      onDiffActionsMenuClicked={e => setIsDiffActionsMenuOpen(e.isOpen)}
    />
  );

  const intl = useIntl();
  const { isConflicted, conflictMessage } = file;
  const renderConflictLozenge = useCallback(
    () =>
      isConflicted && conflictMessage ? (
        <DiffConflictLozenge conflictMessage={conflictMessage} />
      ) : (
        undefined
      ),
    [isConflicted, conflictMessage]
  );

  return (
    <FileStateless
      dropdownMenu={dropdownMenu}
      filePath={filepath}
      hasStickyHeader
      icon={<DiffStatusIcon fileDiffStatus={fileDiffStatus} />}
      isCollapsible
      isDropdownMenuOpen={isDiffActionsMenuOpen}
      isExpanded={isOpen}
      prevFilePath={prevFilepath}
      renderAfterFilePath={renderConflictLozenge}
      stickyHeaderOffset={stickyHeaderOffset}
      toggleExpanded={toggleExpanded}
    >
      <PullRequestFileConversation file={file} />
      {renderImageDiffContent(intl, props)}
    </FileStateless>
  );
}

ImageDiff.defaultProps = {
  toggleExpanded: () => {},
};

export default React.memo(ImageDiff);
