import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ModalTransition } from '@atlaskit/modal-dialog';
import { BucketState } from 'src/types/state';
import { getIsDeclineDialogOpen } from 'src/redux/pull-request/decline-reducer';
import { getIsMergeDialogOpen } from 'src/redux/pull-request/merge-reducer';
import { getIsUploadImageDialogOpen } from 'src/redux/pull-request/image-upload-reducer';
import { getIsPullRequestSettingsDialogOpen } from 'src/redux/pull-request-settings';
import {
  getIsOutdatedDialogOpen,
  getIsDiffCommentsDialogOpen,
  getIsNonRenderedDiffCommentsDialogOpen,
  getIsRevertDialogOpen,
} from 'src/redux/pull-request/selectors';
import { getIsViewEntireFileDialogOpen } from 'src/redux/pull-request/view-entire-file-reducer';
import { WelcomeDialog } from '../components/welcome-dialog';
import { DiffCommentsDialog } from '../components/diff-comments-dialog';
import { RevertDialog } from '../components/header-actions/revert-pull-request';
import NonRenderedDiffCommentsDialog from '../components/non-rendered-diff-comments-dialog';
import { PullRequestSettingsDialog } from '../components/pull-request-settings';
import { ViewEntireFileDialog } from '../components/view-entire-file';
import { ConnectedImageUploadDialog } from './image-upload-dialog';
import DeclineDialog from './decline-dialog';
import MergeDialog from './merge-dialog';
import OutdatedCommentsDialog from './comments-dialog';

type PullRequestDialogZoneProps = {
  isDeclineDialogOpen: boolean;
  isMergeDialogOpen: boolean;
  isImageUploadDialogOpen: boolean;
  isOutdatedCommentsDialogOpen: boolean;
  isDiffCommentsDialogOpen: boolean;
  isNonRenderedDiffCommentsDialogOpen: boolean;
  isPullRequestSettingsDialogOpen: boolean;
  isRevertDialogOpen: boolean;
  isViewEntireFileDialogOpen: boolean;
};

const mapStateToProps = (state: BucketState) => ({
  isDeclineDialogOpen: getIsDeclineDialogOpen(state),
  isMergeDialogOpen: getIsMergeDialogOpen(state),
  isImageUploadDialogOpen: getIsUploadImageDialogOpen(state),
  // If we can't find the file then don't even open it. Stale permalinks can do this.
  isOutdatedCommentsDialogOpen: getIsOutdatedDialogOpen(state),
  isDiffCommentsDialogOpen: getIsDiffCommentsDialogOpen(state),
  isNonRenderedDiffCommentsDialogOpen: getIsNonRenderedDiffCommentsDialogOpen(
    state
  ),
  isPullRequestSettingsDialogOpen: getIsPullRequestSettingsDialogOpen(state),
  isRevertDialogOpen: getIsRevertDialogOpen(state),
  isViewEntireFileDialogOpen: getIsViewEntireFileDialogOpen(state),
});

export const PullRequestDialogZone = connect(mapStateToProps)(
  class BasePullRequestDialogZone extends PureComponent<
    PullRequestDialogZoneProps
  > {
    render() {
      const {
        isMergeDialogOpen,
        isDeclineDialogOpen,
        isImageUploadDialogOpen,
        isOutdatedCommentsDialogOpen,
        isDiffCommentsDialogOpen,
        isNonRenderedDiffCommentsDialogOpen,
        isPullRequestSettingsDialogOpen,
        isRevertDialogOpen,
        isViewEntireFileDialogOpen,
      } = this.props;

      return (
        <ModalTransition>
          {isMergeDialogOpen && <MergeDialog />}
          {isDeclineDialogOpen && <DeclineDialog />}
          {isImageUploadDialogOpen && <ConnectedImageUploadDialog />}
          {isOutdatedCommentsDialogOpen && <OutdatedCommentsDialog />}
          {isDiffCommentsDialogOpen && <DiffCommentsDialog />}
          {isRevertDialogOpen && <RevertDialog />}
          {/*
            Onboarding modal does not play well with
            <ModalTransition>, so we handle opening/closing inside
          */}
          <WelcomeDialog />
          {isNonRenderedDiffCommentsDialogOpen && (
            <NonRenderedDiffCommentsDialog />
          )}
          {isPullRequestSettingsDialogOpen && <PullRequestSettingsDialog />}
          {isViewEntireFileDialogOpen && <ViewEntireFileDialog />}
        </ModalTransition>
      );
    }
  }
);
