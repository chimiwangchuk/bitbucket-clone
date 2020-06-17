import React, { Fragment, PureComponent } from 'react';
import { InjectedIntl, FormattedMessage, injectIntl } from 'react-intl';
import AkPageHeader from '@atlaskit/page-header';
// @ts-ignore TODO: fix noImplicitAny error here
import { UIControllerSubscriber } from '@atlaskit/navigation-next';
import RepositoryBreadcrumbs from 'src/sections/repository/containers/breadcrumbs';
import {
  PageHeaderColumn,
  PageHeaderWrapper,
} from 'src/sections/global/components/page.style';

import RenderedTitle from 'src/components/rendered-title';
import StickyHeader from 'src/components/sticky-header';
import { PullRequest } from 'src/components/types';
import UserAvatar from 'src/containers/user-avatar';

import { RelativeDate } from '@atlassian/bitkit-date';
import StickyHeaderContent from '../components/sticky-header-content';
import PullRequestBreadcrumbs from '../containers/breadcrumbs';
import PullRequestStateMessage from './pull-request-state-message';
import HeaderActions from './header-actions';
import BranchesAndState from './branches-and-state';
import * as styles from './header.style';
import messages from './header.i18n';
import { calculateOffsetForNavNext } from './utils/calculate-header-offset';

export type HeaderProps = {
  hasCreatePendingMergeFeature: boolean;
  onFetchPendingMergeStatus?: () => void;
  currentPullRequest?: PullRequest;
  isMobileHeaderActive: boolean;
  sidebarWidth: number;
  stickHeaderTopOffset: number;
  intl: InjectedIntl;
  isHorizontalNavEnabled: boolean;
};

class Header extends PureComponent<HeaderProps> {
  componentDidMount() {
    const {
      hasCreatePendingMergeFeature,
      onFetchPendingMergeStatus,
    } = this.props;
    if (hasCreatePendingMergeFeature && onFetchPendingMergeStatus) {
      onFetchPendingMergeStatus();
    }
  }

  getAuthorStatus() {
    const { currentPullRequest } = this.props;
    if (!currentPullRequest) {
      return null;
    }
    const { participants, author } = currentPullRequest;
    const hasAuthorApproved = participants.some(
      p => !!p.user && !!author && p.user.uuid === author.uuid && p.approved
    );
    if (hasAuthorApproved) {
      return 'approved';
    }
    // do not display any status
    return undefined;
  }

  render() {
    const {
      currentPullRequest,
      isMobileHeaderActive,
      sidebarWidth,
      stickHeaderTopOffset,
      intl,
      isHorizontalNavEnabled,
    } = this.props;

    if (!currentPullRequest) {
      return null;
    }

    const {
      author,
      state,
      rendered,
      created_on: createdOn,
      closed_on: closedOn,
      updated_on: updatedOn,
    } = currentPullRequest;

    return (
      <Fragment>
        <PageHeaderWrapper
          data-qa="pr-header-page-header-wrapper"
          aria-label={intl.formatMessage(messages.pullRequestHeaderLabel)}
        >
          <PageHeaderColumn>
            <AkPageHeader
              breadcrumbs={
                <RepositoryBreadcrumbs>
                  <PullRequestBreadcrumbs />
                </RepositoryBreadcrumbs>
              }
              bottomBar={
                <Fragment>
                  <styles.ActionsWrapper>
                    <styles.PullRequestAuthor>
                      <styles.Avatar data-qa="pr-header-author-styles">
                        <UserAvatar
                          profileCardPosition="bottom-start"
                          user={author}
                          status={this.getAuthorStatus()}
                        />
                      </styles.Avatar>
                      <styles.PullRequestInfo>
                        <BranchesAndState
                          pullRequestState={state}
                          pullRequestCreatedOn={createdOn}
                          pullRequestClosedOn={closedOn}
                        />
                        <styles.PullRequestDates>
                          <FormattedMessage
                            {...messages.created}
                            values={{ date: <RelativeDate date={createdOn} /> }}
                          />
                          &nbsp;&middot;&nbsp;
                          <FormattedMessage
                            {...messages.lastUpdated}
                            values={{ date: <RelativeDate date={updatedOn} /> }}
                          />
                        </styles.PullRequestDates>
                      </styles.PullRequestInfo>
                    </styles.PullRequestAuthor>
                    <styles.ButtonsWrapper>
                      <HeaderActions />
                    </styles.ButtonsWrapper>
                  </styles.ActionsWrapper>
                  <PullRequestStateMessage />
                </Fragment>
              }
            >
              <RenderedTitle renderedContent={rendered.title} />
            </AkPageHeader>
          </PageHeaderColumn>
        </PageHeaderWrapper>
        {!isMobileHeaderActive && (
          <UIControllerSubscriber>
            {({ state: navState }: any) => (
              <StickyHeader
                offset={calculateOffsetForNavNext(
                  !navState.isCollapsed,
                  isMobileHeaderActive,
                  isHorizontalNavEnabled,
                  sidebarWidth,
                  navState.productNavWidth
                )}
                trigger={this}
                topOffset={stickHeaderTopOffset}
              >
                <StickyHeaderContent />
              </StickyHeader>
            )}
          </UIControllerSubscriber>
        )}
      </Fragment>
    );
  }
}

export default injectIntl(Header);
