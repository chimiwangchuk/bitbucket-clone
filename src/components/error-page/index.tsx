import React from 'react';
import { connect } from 'react-redux';
import AkPage from '@atlaskit/page';
import Helmet from 'react-helmet';
import { InjectedIntl, injectIntl } from 'react-intl';
import { compose } from 'redux';

import { FocusedNavigationNext } from 'src/components/navigation';
import ErrorCodes from 'src/constants/error-codes';
import messages from 'src/sections/global/components/focused-task-page.i18n';
import {
  getCurrentUserEmail,
  getIsMobileHeaderActive,
} from 'src/selectors/global-selectors';
import { BucketState } from 'src/types/state';
import MobileHeader from 'src/sections/global/components/mobile-header';
import Page from 'src/app/page';
import FocusedNavigation from 'src/components/navigation/src/components/focused-navigation-next';
import { NotFoundState } from './components/not-found-state';
import { ForbiddenState } from './components/forbidden-state';

export enum ERROR_TITLES {
  NOT_FOUND_PAGE = '404',
  FORBIDDEN_PAGE = '403',
}

export const getErrorPageTitle = (errorCode: ErrorCodes) => {
  const TITLE_MAP = {
    [ErrorCodes.NOT_FOUND]: ERROR_TITLES.NOT_FOUND_PAGE,
    [ErrorCodes.FORBIDDEN]: ERROR_TITLES.FORBIDDEN_PAGE,
  };

  return TITLE_MAP[errorCode];
};

export type ErrorPageProps = {
  currentUserEmail?: string;
  statusCode: ErrorCodes;
  intl: InjectedIntl;
  isMobileHeaderActive: boolean;
};

export class ErrorPage extends React.Component<ErrorPageProps> {
  renderMobileHeader = () => (
    <MobileHeader
      isBannerOpen={false}
      renderNavigation={() => (
        <FocusedNavigation
          backButtonTooltip={this.props.intl.formatMessage(
            messages.backButtonTooltip
          )}
          backButtonUrl="/dashboard/overview"
        />
      )}
    />
  );

  renderNavigation = () => (
    <FocusedNavigationNext
      backButtonTooltip={this.props.intl.formatMessage(
        messages.backButtonTooltip
      )}
      backButtonUrl="/"
    />
  );

  renderState = (errorCode: ErrorCodes) => {
    const ERROR_STATE_MAP = {
      [ErrorCodes.NOT_FOUND]: <NotFoundState />,
      [ErrorCodes.FORBIDDEN]: (
        <ForbiddenState userEmail={this.props.currentUserEmail} />
      ),
    };

    return ERROR_STATE_MAP[errorCode];
  };

  render() {
    const {
      isMobileHeaderActive,
      statusCode = ErrorCodes.NOT_FOUND,
    } = this.props;
    const title = getErrorPageTitle(statusCode);

    return (
      <AkPage navigation={!isMobileHeaderActive && this.renderNavigation()}>
        <Page>
          {isMobileHeaderActive && this.renderMobileHeader()}
          <Helmet defer={false} title={title} />
          {this.renderState(statusCode)}
        </Page>
      </AkPage>
    );
  }
}

export const mapStateToProps = (state: BucketState) => ({
  currentUserEmail: getCurrentUserEmail(state),
  isMobileHeaderActive: getIsMobileHeaderActive(state),
});

export default compose<any, any, any>(
  injectIntl,
  connect(mapStateToProps)
)(ErrorPage);
