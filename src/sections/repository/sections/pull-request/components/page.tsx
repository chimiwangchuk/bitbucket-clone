import React, { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';

import Sidebar from 'src/app/sidebar';
import { GlobalErrorBoundary } from 'src/components/error-boundary';
import { Loading } from 'src/sections/global/components/loading.style';
import { publishFact } from 'src/utils/analytics/publish';

import PullRequestDetails from '../containers/pull-request-details';
import PullRequestHelmet from '../containers/pull-request-helmet';
import PullRequestSidebar from '../containers/sidebar';
import Msie11WarningBanner from '../containers/msie11-warning-banner';
import { PullRequestFact, PullRequestFactPropertiesSchema } from '../facts';

export type PullRequestPageProps = {
  dispatchEnteredCodeReview: () => void;
  onExitPage: () => void;
  onPullRequestOpened: () => void;
  factProperties: PullRequestFactPropertiesSchema;
  isBrowserMsie11: boolean;
  oldPullRequestUrl: string | null | undefined;
  pullRequestStateReady: boolean;
};

export class PullRequestPage extends PureComponent<PullRequestPageProps> {
  componentDidMount() {
    // Note: Most mounts will require fetching data.  However, PR state will
    // be ready on mount in the event that the user returns to the last loaded PR
    // from another Frontbucket page. The init() correctly handles both cases.
    this.props.dispatchEnteredCodeReview();
    this.init();
  }

  componentDidUpdate() {
    // In current use, component updates only occur after initially fetching data (ie.
    // shortly after initial mount). In future, SPA Pull Request -> Pull Request transitions
    // will also trigger component updates. The init() correctly handles both cases.
    const { pullRequestStateReady, dispatchEnteredCodeReview } = this.props;
    if (!pullRequestStateReady) {
      dispatchEnteredCodeReview();
    }
    this.init();
  }

  componentWillUnmount() {
    this.props.onExitPage();
  }

  init() {
    const { pullRequestStateReady } = this.props;

    if (pullRequestStateReady) {
      this.publishPullRequestOpenedEvent();
    }
  }

  publishPullRequestOpenedEvent() {
    this.props.onPullRequestOpened();
    publishFact(
      new PullRequestFact(
        'bitbucket.pullrequests.open',
        this.props.factProperties
      )
    );
  }

  render() {
    const {
      isBrowserMsie11,
      oldPullRequestUrl,
      pullRequestStateReady,
    } = this.props;

    return (
      <GlobalErrorBoundary>
        <PullRequestHelmet />

        {isBrowserMsie11 && oldPullRequestUrl && (
          <Msie11WarningBanner url={oldPullRequestUrl} isOpen />
        )}

        {pullRequestStateReady ? (
          <PullRequestDetails />
        ) : (
          <Loading>
            <Spinner size="large" />
          </Loading>
        )}

        <Sidebar>
          <PullRequestSidebar />
        </Sidebar>
      </GlobalErrorBoundary>
    );
  }
}
