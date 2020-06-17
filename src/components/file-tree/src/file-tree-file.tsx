import React from 'react';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { CommentIcon, IconSizes } from '@atlassian/bitkit-icon';

import { DiffStatusIcon } from 'src/components/diff-file-status/diff-file-status-icon-mapper';
import { DiffStatStatus } from 'src/types/diffstat';
import { useIntl } from 'src/hooks/intl';
import messages from './i18n';
import * as styles from './styled';
import { FileClickProps } from './types';

export type FileProps = {
  isActive?: boolean;
  name: string;
  comments?: number;
  href?: string;
  fileDiffStatus?: DiffStatStatus;
  isConflicted?: boolean;
  linesAdded?: number;
  linesRemoved?: number;
  onClick?: (event: React.MouseEvent, props: FileClickProps) => void;
};

const COMMENT_COLOR = colors.N800;

const BaseFileTreeFile = ({
  isActive = false,
  name,
  href,
  comments = 0,
  linesAdded = 0,
  linesRemoved = 0,
  fileDiffStatus,
  isConflicted,
  onClick = () => {},
}: FileProps) => {
  const intl = useIntl();

  const clickHandler = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    onClick(event, {
      name,
      href,
      fileDiffStatus,
      isConflicted,
      comments,
    });
  };

  const renderComments = () => (
    <styles.CommentsWrapper
      label={intl.formatMessage(messages.comment)}
      data-testid="file-tree-file__comments"
    >
      <CommentIcon
        primaryColor={COMMENT_COLOR}
        label={intl.formatMessage(messages.comment)}
        size={IconSizes.Small}
      />
      <styles.CommentsNumber>{comments}</styles.CommentsNumber>
    </styles.CommentsWrapper>
  );

  return (
    <styles.File
      isActive={isActive}
      href={href}
      onClick={clickHandler}
      onMouseDown={e => e.preventDefault()}
    >
      <DiffStatusIcon fileDiffStatus={fileDiffStatus} />
      <Tooltip position="left" content={name} tag={styles.TooltipWrapper}>
        <styles.FileName>{name}</styles.FileName>
      </Tooltip>
      <styles.FileNotes>
        {comments > 0 && renderComments()}
        {isConflicted ? (
          <WarningIcon
            primaryColor={colors.Y300}
            label={intl.formatMessage(messages.conflicted)}
          />
        ) : (
          <React.Fragment>
            {linesAdded > 0 && (
              <styles.LinesAdded>+{linesAdded}</styles.LinesAdded>
            )}
            {linesRemoved > 0 && (
              <styles.LinesRemoved>-{linesRemoved}</styles.LinesRemoved>
            )}
          </React.Fragment>
        )}
      </styles.FileNotes>
    </styles.File>
  );
};

export const FileTreeFile = React.memo(BaseFileTreeFile);
