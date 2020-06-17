import React from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { ButtonGroup } from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

import RepositoryAccessGuard from 'src/sections/repository/components/repository-access-guard';
import { publishUiEvent } from 'src/utils/analytics/publish';
import { BucketState } from 'src/types/state';

import {
  ConnectPullRequestSummaryInfo,
  ConnectPullRequestSummaryActions,
  ConnectPullRequestModules,
} from 'src/connect/pull-request-modules';
import {
  getCurrentPullRequest,
  getPullRequestCanCurrentUserMerge,
  getIsSingleFileModeActive,
  getIsSingleFileModeSettingsHeaderVisible,
} from 'src/redux/pull-request/selectors';
import { useIntl } from 'src/hooks/intl';
import { FeatureToggle } from 'src/containers/feature-toggle';

import { PullRequestReviewers } from 'src/containers/pull-request-reviewers';
import EditPullRequest from '../../containers/edit-pull-request';
import WatchPullRequest from '../../containers/watch-pull-request';
import ApprovalButton from '../../containers/approval-button';
import MergeButton from '../../containers/merge-button';
import ErrorDialog from '../../containers/error-dialog';
import DeclineDropdownItem from '../../containers/decline-dropdown-item';

import { SingleFileNavigation } from '../single-file-mode/single-file-navigation';
import { SingleFileModeSubheading } from '../single-file-mode/info-subheading';
import RevertPullRequest from './revert-pull-request';

import messages from './header-actions.i18n';
import approvalMessages from './approval-button.i18n';
import * as styles from './header-actions.style';

type Props = {
  isHeaderSticky?: boolean;
};

const isOpen = (state: BB.PullRequestState | undefined) =>
  state && state === 'OPEN';

const HeaderActions = ({ isHeaderSticky }: Props) => {
  const intl = useIntl();
  const pullRequestState = useSelector((state: BucketState) => {
    const currentPullRequest = getCurrentPullRequest(state);
    return currentPullRequest ? currentPullRequest.state : undefined;
  });
  const isSingleFileModeActive = useSelector(getIsSingleFileModeActive);
  const isSettingsHeaderVisible = useSelector(
    getIsSingleFileModeSettingsHeaderVisible
  );
  const canCurrentUserMerge = useSelector(getPullRequestCanCurrentUserMerge);
  const isOpenPr = isOpen(pullRequestState);
  const tabIndex = isHeaderSticky ? -1 : 0;

  return (
    <styles.HeaderActions>
      <styles.Reviewers
        isHeaderSticky={!!isHeaderSticky}
        aria-label={intl.formatMessage(messages.reviewersListLabel)}
        data-qa="pr-header-actions-reviewers-style"
      >
        <PullRequestReviewers
          tabIndex={tabIndex}
          maxCount={4}
          size={isHeaderSticky ? 'small' : 'medium'}
          appearance="stack"
        />
      </styles.Reviewers>

      <styles.HeaderActionsButtonWrapper>
        <ButtonGroup>
          <ErrorDialog>
            <ApprovalButton messages={approvalMessages} tabIndex={tabIndex} />
          </ErrorDialog>
          <RepositoryAccessGuard requiredLevel="write">
            {isOpenPr && canCurrentUserMerge && (
              <MergeButton tabIndex={tabIndex} />
            )}
          </RepositoryAccessGuard>
          {isHeaderSticky && isSingleFileModeActive && (
            <FeatureToggle feature="fd-new-code-review-single-file-mode">
              {!isSettingsHeaderVisible && (
                <SingleFileModeSubheading shownInStickyHeader />
              )}
              {!isSettingsHeaderVisible && <SingleFileNavigation />}
            </FeatureToggle>
          )}
          {!(isHeaderSticky && isSingleFileModeActive) && (
            // show dropdown when header is not sticky or when in all files mode
            <styles.DropdownMenu data-qa="pr-header-actions-drop-down-menu-styles">
              <ConnectPullRequestModules />
              <DropdownMenu
                triggerType="button"
                shouldFlip={false}
                position="bottom right"
                triggerButtonProps={{
                  iconBefore: <MoreIcon label="More" />,
                  tabIndex,
                }}
                onOpenChange={(attrs: any) => {
                  if (attrs.isOpen) {
                    publishUiEvent({
                      action: 'clicked',
                      actionSubject: 'button',
                      source: 'pullrequestHeaderAction',
                      actionSubjectId: 'pullrequestHeaderActionClicked',
                    });
                  }
                }}
              >
                <styles.DropdownMenuContent>
                  <DropdownItemGroup>
                    <RepositoryAccessGuard requiredLevel="write">
                      {isOpenPr && <EditPullRequest />}
                      {isOpenPr && (
                        <DeclineDropdownItem>
                          <FormattedMessage
                            {...messages.declinePullRequestAction}
                          />
                        </DeclineDropdownItem>
                      )}
                      <RevertPullRequest />
                    </RepositoryAccessGuard>
                    <WatchPullRequest />
                    <ConnectPullRequestSummaryInfo component={DropdownItem} />
                    <ConnectPullRequestSummaryActions
                      component={DropdownItem}
                    />
                  </DropdownItemGroup>
                </styles.DropdownMenuContent>
              </DropdownMenu>
            </styles.DropdownMenu>
          )}
        </ButtonGroup>
      </styles.HeaderActionsButtonWrapper>
    </styles.HeaderActions>
  );
};

export default HeaderActions;
