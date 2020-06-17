import React, { Fragment, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import Button from '@atlaskit/button';
import DocumentIcon from '@atlaskit/icon/glyph/document';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import SectionMessage from '@atlaskit/section-message';
import Tooltip from '@atlaskit/tooltip';
import { colors } from '@atlaskit/theme';
import { CopyButton } from '@atlassian/bitkit-copy';
import { Expander, ExpanderOnChangeEvent } from 'src/components/sidebar';
import GenericMessage from 'src/components/generic-message';
import { getCurrentRepositoryScm } from 'src/selectors/repository-selectors';
import { useIntl } from 'src/hooks/intl';
import {
  formatScm,
  scmCommandCode,
} from 'src/sections/repository/utils/formatted-scm';

import FileTree, {
  FileTreeProps,
  FileClickProps,
} from 'src/components/file-tree';
import commonMessages from 'src/i18n/common';
import { shortHash } from 'src/utils/short-hash';
import {
  getPullRequestSourceHash,
  getPullRequestDestinationHash,
} from 'src/redux/pull-request/selectors';
import messages from './file-tree-card.i18n';
import * as styles from './file-tree-card.style';

export type FileTreeCardStateProps = {
  activeDiff: string;
  hasConflicts?: boolean;
  hasError?: boolean;
  isTruncated?: boolean;
  untruncatedFileCount: number;
} & Pick<FileTreeProps, 'fileTree'>;

export type FileTreeCardExternalProps = FileTreeProps & {
  isCollapsed?: boolean;
  onFileClick?: (event: React.MouseEvent, props: FileClickProps) => void;
  onChange: (event: ExpanderOnChangeEvent) => void;
  onErrorClick?: () => void;
  initialCardIsCollapsed?: boolean;
};

export type FileTreeCardProps = FileTreeCardStateProps &
  FileTreeCardExternalProps;

const FileTreeCard: React.FC<FileTreeCardProps> = memo(
  (props: FileTreeCardProps) => {
    const {
      activeDiff,
      isCollapsed,
      hasConflicts,
      fileTree,
      onFileClick,
      hasError,
      onChange,
      initialCardIsCollapsed,
      isTruncated,
      onErrorClick,
      untruncatedFileCount,
    } = props;
    const intl = useIntl();
    const icon = <DocumentIcon label={intl.formatMessage(messages.label)} />;

    const mergeConflictsMessage = intl.formatMessage(messages.mergeConflicts);

    const mergeConflictsIcon = hasConflicts ? (
      <Tooltip position="bottom" content={mergeConflictsMessage}>
        <WarningIcon label={mergeConflictsMessage} primaryColor={colors.Y300} />
      </Tooltip>
    ) : (
      undefined
    );

    const scm = useSelector(getCurrentRepositoryScm);
    const targetBranchHash = useSelector(getPullRequestDestinationHash) || '';
    const sourceBranchHash = useSelector(getPullRequestSourceHash) || '';
    const targetBranchShortHash = shortHash(targetBranchHash);
    const featureBranchShortHash = shortHash(sourceBranchHash);
    const diffCommand = scmCommandCode(
      scm,
      targetBranchShortHash,
      featureBranchShortHash
    );

    if (isCollapsed) {
      const content = intl.formatMessage(messages.fileCount, {
        total: untruncatedFileCount,
        formattedCount: untruncatedFileCount,
      });

      return (
        <Tooltip position="left" content={content}>
          <Button
            appearance="subtle"
            iconBefore={
              <styles.IconContainer>
                {icon}{' '}
                {hasConflicts && (
                  <styles.ConflictIndicator
                    aria-label={mergeConflictsMessage}
                  />
                )}
              </styles.IconContainer>
            }
          />
        </Tooltip>
      );
    }

    return (
      <Expander
        icon={icon}
        isLoading={!fileTree && !hasError}
        onChange={onChange}
        defaultIsCollapsed={initialCardIsCollapsed}
        label={
          <FormattedMessage
            {...messages.fileCount}
            values={{
              total: untruncatedFileCount,
              formattedCount: (
                <styles.FileNumber>{untruncatedFileCount}</styles.FileNumber>
              ),
            }}
          />
        }
        iconSecondary={mergeConflictsIcon}
        ariaLabel={intl.formatMessage(messages.label)}
      >
        {!!fileTree && !!fileTree.length && !hasError && (
          <Fragment>
            <FileTree
              activeDiff={activeDiff}
              fileTree={fileTree}
              expandAll
              onClick={onFileClick}
            />
            {isTruncated && (
              <SectionMessage appearance="info">
                <styles.TruncatedContentMessageTitle>
                  {intl.formatMessage(messages.truncatedContentsMessageTitle)}
                </styles.TruncatedContentMessageTitle>
                <FormattedMessage
                  {...messages.truncatedContentsMessageMain}
                  tagName="p"
                  values={{ scm: formatScm(scm) }}
                />
                <p>
                  <CopyButton
                    buttonText={intl.formatMessage(
                      messages.truncatedContentsButtonText
                    )}
                    value={diffCommand}
                    shouldMatchTextFieldHeight={false}
                    tooltipPosition="bottom"
                  />
                </p>
              </SectionMessage>
            )}
          </Fragment>
        )}
        {hasError && (
          <GenericMessage
            iconType="warning"
            title={<FormattedMessage {...messages.errorHeading} />}
          >
            <Button appearance="link" onClick={onErrorClick}>
              <FormattedMessage {...commonMessages.tryAgain} />
            </Button>
          </GenericMessage>
        )}
      </Expander>
    );
  }
);

export default FileTreeCard;
