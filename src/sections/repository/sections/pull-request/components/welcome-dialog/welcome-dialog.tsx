import React, { PureComponent } from 'react';
import { ClassNames } from '@emotion/core';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { Modal } from '@atlaskit/onboarding';
import { media } from '@atlassian/bitkit-responsive';

import { publishUiEvent } from 'src/utils/analytics/publish';
import {
  getPullRequestMergeChecksLoadingState,
  getRenderedDiffStat,
  getWelcomeDialogState,
} from 'src/redux/pull-request/selectors';
import { getIsNewOnboardingEnabled } from 'src/selectors/feature-selectors';
import { getIsMobileHeaderActive } from 'src/selectors/global-selectors';
import { getTasksLoadingState } from 'src/selectors/task-selectors';
import {
  CLOSE_CODE_REVIEW_WELCOME_DIALOG,
  setWelcomeTourActive,
} from 'src/redux/pull-request/actions';
import { updateSidebarState } from 'src/redux/sidebar';
import { isCodeReviewSidebarOpen } from 'src/redux/sidebar/reducer';
import updateMobileHeaderState from 'src/redux/global/actions/update-mobile-header-state';

import { BucketState } from 'src/types/state';
import messages from './welcome-dialog.i18n';
import onboardingImage from './onboarding.svg';

import * as styles from './welcome-dialog.styled';

type Props = {
  intl: InjectedIntl;
  isOpen: boolean;
  isSidebarOpen: boolean;
  isMobileHeaderActive: boolean;
  closeDialog: () => void;
  startTour: () => void;
  openSidebar: () => void;
  openMobileSidebar: () => void;
};

const SIDEBAR_OPEN_DURATION = 1000;

export class WelcomeDialog extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.isOpen) {
      this.publishEvent('opened', 'dialog', 'welcomeDialogOpened');
    }
  }

  handleAccept = () => {
    const {
      closeDialog,
      startTour,
      isSidebarOpen,
      isMobileHeaderActive,
      openMobileSidebar,
      openSidebar,
    } = this.props;

    this.publishEvent('clicked', 'button', 'startTour');
    closeDialog();

    if (isMobileHeaderActive) {
      openMobileSidebar();
      // wait a bit for sidebar to open
      setTimeout(startTour, SIDEBAR_OPEN_DURATION);
      return;
    }

    if (!isSidebarOpen) {
      openSidebar();
      // wait a bit for sidebar to open
      setTimeout(startTour, SIDEBAR_OPEN_DURATION);
      return;
    }

    startTour();
  };

  handleReject = () => {
    this.publishEvent('clicked', 'button', 'skipTour');
    this.props.closeDialog();
  };

  handleGotIt = () => {
    this.publishEvent('clicked', 'button', 'gotIt');
    this.props.closeDialog();
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  publishEvent(action, actionSubject, actionSubjectId) {
    publishUiEvent({
      action,
      actionSubject,
      actionSubjectId,
      source: 'welcomeDialog',
    });
  }

  render() {
    const { intl, isOpen } = this.props;
    if (!isOpen) {
      return null;
    }
    return (
      <ClassNames>
        {({ css }) => (
          <Modal
            actions={[
              {
                onClick: this.handleAccept,
                text: intl.formatMessage(messages.welcomeDialogAccept),
                // @ts-ignore existing working code but className inside an action is not officially supported
                className: css`
                  ${media.upToMedium('display: none')}
                `,
              },
              {
                onClick: this.handleReject,
                text: intl.formatMessage(messages.welcomeDialogReject),
                className: css`
                  ${media.upToMedium('display: none')}
                `,
              },
              {
                onClick: this.handleGotIt,
                text: intl.formatMessage(messages.welcomeDialogGotIt),
                appearance: 'primary',
                className: css`
                  display: none;
                  ${media.upToMedium('display: block')}
                `,
              },
            ]}
            heading={intl.formatMessage(messages.welcomeDialogTitle)}
            image={onboardingImage}
            key="code-review-welcome-dialog"
          >
            <styles.Description>
              <FormattedMessage
                {...messages.welcomeDialogDescMain}
                values={{
                  link: (
                    <a
                      href="https://confluence.atlassian.com/x/190gOQ"
                      target="_blank"
                    >
                      <FormattedMessage {...messages.learnMoreLink} />
                    </a>
                  ),
                }}
              />
            </styles.Description>
          </Modal>
        )}
      </ClassNames>
    );
  }
}

const mapStateToProps = (state: BucketState) => ({
  // ensure cards have loaded before showing dialog
  isOpen:
    getIsNewOnboardingEnabled(state) &&
    getWelcomeDialogState(state) &&
    getRenderedDiffStat(state) &&
    !getTasksLoadingState(state) &&
    !getPullRequestMergeChecksLoadingState(state),
  isSidebarOpen: isCodeReviewSidebarOpen(state),
  isMobileHeaderActive: getIsMobileHeaderActive(state),
});

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  closeDialog: () => dispatch({ type: CLOSE_CODE_REVIEW_WELCOME_DIALOG }),
  startTour: () => dispatch(setWelcomeTourActive(true)),
  openSidebar: () =>
    dispatch(updateSidebarState({ sidebarType: 'code-review', isOpen: true })),
  openMobileSidebar: () => dispatch(updateMobileHeaderState('sidebar')),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(WelcomeDialog);
