import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import InfoIcon from '@atlaskit/icon/glyph/info';
import Button from '@atlaskit/button';

import { colors } from '@atlaskit/theme';
import { BranchSyncInfo as BranchSyncInfoType } from 'src/redux/pull-request/types';
import {
  getBranchSyncInfo,
  getDestinationBranchName,
  getPullRequestBranchName,
  getPullRequestDestinationRepo,
  getPullRequestSourceRepo,
  getConflictStatus,
  getPullRequestSourceHash,
  getPullRequestDestinationHash,
} from 'src/redux/pull-request/selectors';
import {
  getCurrentRepositoryScm,
  getCurrentRepositorySshCloneLink,
} from 'src/selectors/repository-selectors';

import { refreshCodeReviewData } from 'src/redux/pull-request/actions';

import { openSyncBranchDialog } from 'src/redux/branches';
import { getBranchesFullNames } from 'src/utils/compare-branches';
import { BucketState } from 'src/types/state';
import messages from './branch-sync-info.i18n';
import * as styles from './branch-sync-info.style';

import ConflictsDialog from './conflicts-dialog';

type Props = {
  branchSyncInfo: BranchSyncInfoType | null;
  destinationHash: string;
  sourceHash: string;
  destinationBranchName: string;
  sourceBranchName: string;
  destinationRepositoryFullName: string;
  sourceRepositoryFullName: string;
  appearance?: 'block' | 'inline';
  hasConflicts: boolean;
  scm: 'git' | 'hg';
  sourceCloneLink: string;
  openSyncDialog: typeof openSyncBranchDialog;
};

export const BranchSyncInfo = ({
  branchSyncInfo,
  sourceHash,
  destinationHash,
  destinationBranchName,
  sourceBranchName,
  destinationRepositoryFullName,
  sourceRepositoryFullName,
  appearance = 'block',
  hasConflicts,
  scm,
  sourceCloneLink,
  openSyncDialog,
}: Props) => {
  const [isOpen, setIsConflictsDialogOpen] = useState(false);

  // @ts-ignore TODO: fix noImplicitAny error here
  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();

    if (hasConflicts) {
      setIsConflictsDialogOpen(true);
      return;
    }

    openSyncDialog({
      destinationBranchName,
      sourceBranchName,
      destinationRepositoryFullName,
      sourceRepositoryFullName,
      reloadAction: refreshCodeReviewData({
        needsDiff: true,
        needsComments: false,
        needsPullRequest: true,
      }),
    });
  };

  const fullNames = getBranchesFullNames(
    sourceBranchName,
    destinationBranchName,
    sourceRepositoryFullName,
    destinationRepositoryFullName
  );

  const Container =
    appearance === 'inline'
      ? styles.BranchSyncInlineContainer
      : styles.BranchSyncBlockContainer;

  if (branchSyncInfo && branchSyncInfo.behind > 0) {
    return (
      <Container>
        {appearance === 'inline' && (
          <styles.InfoIconWrapper>
            <InfoIcon label="info" size="small" primaryColor={colors.B400} />
          </styles.InfoIconWrapper>
        )}
        <span>
          <strong>
            {branchSyncInfo.behind}
            {branchSyncInfo.behindTruncated && '+'}{' '}
          </strong>
          <FormattedMessage
            {...messages.text}
            values={{
              numberOfCommits: branchSyncInfo.behind,
              branchName: fullNames.sourceBranchName,
            }}
          />
        </span>
        <styles.ActionWrapper>
          <Button appearance="link" spacing="compact" onClick={handleClick}>
            <FormattedMessage {...messages.action} />
          </Button>
        </styles.ActionWrapper>
        <ConflictsDialog
          isOpen={isOpen}
          sourceCloneLink={sourceCloneLink}
          sourceBranchName={sourceBranchName}
          destinationBranchName={destinationBranchName}
          sourceRepositoryFullName={sourceRepositoryFullName}
          destinationRepositoryFullName={destinationRepositoryFullName}
          sourceHash={sourceHash}
          destinationHash={destinationHash}
          scm={scm}
          onClose={() => setIsConflictsDialogOpen(false)}
        />
      </Container>
    );
  }
  return null;
};

const mapStateToProps = (state: BucketState) => {
  const destinationRepository = getPullRequestDestinationRepo(state);
  const sourceRepository = getPullRequestSourceRepo(state);

  return {
    scm: getCurrentRepositoryScm(state),
    sourceCloneLink: getCurrentRepositorySshCloneLink(state),
    branchSyncInfo: getBranchSyncInfo(state),
    hasConflicts: getConflictStatus(state),
    // destination and source branches were changed intentionally
    // because destination branch of PR is actually a source branch
    // to sync data from
    destinationBranchName: getPullRequestBranchName(state),
    sourceBranchName: getDestinationBranchName(state),
    destinationRepositoryFullName:
      sourceRepository && sourceRepository.full_name,
    sourceRepositoryFullName:
      destinationRepository && destinationRepository.full_name,
    sourceHash: getPullRequestDestinationHash(state),
    destinationHash: getPullRequestSourceHash(state),
  };
};

const mapDispatchToProps = {
  openSyncDialog: openSyncBranchDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(BranchSyncInfo);
