import qs from 'qs';
import React, { PureComponent } from 'react';
import { History, Location } from 'history';
import { injectIntl, InjectedIntl, FormattedMessage } from 'react-intl';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import { Repository } from 'src/components/types';
import { uncurlyUuid } from '@atlassian/bitkit-analytics';
import { Expander, ExpanderOnChangeEvent } from 'src/components/sidebar';
import { PullRequestFact } from 'src/sections/repository/sections/pull-request/facts';
import { publishFact } from 'src/utils/analytics/publish';
import store from 'src/utils/store';
import FeedbackButton from 'src/components/feedback-button';
import navigationUrls from 'src/components/navigation/src/urls';

import messages from './pull-request-feedback-card.i18n';
import * as styles from './pull-request-feedback-card.style';

export const FEEDBACK_CARD_COLLAPSED_LOCALSTORAGE_KEY =
  'feedback.card.collapsed';

type CardProps = {
  destRepo: Repository;
  history: History;
  isBrowserMsie11: boolean;
  isMobileHeaderActive: boolean;
  isNewCodeReviewFeatureEnabledForUser: boolean;
  isNewCodeReviewFeatureEnabledForTeam: boolean;
  location: Location;
  numDiffFiles: number;
  // @ts-ignore TODO: fix noImplicitAny error here
  numDiffFilesRendered;
  numDiffLines: number;
  // @ts-ignore TODO: fix noImplicitAny error here
  numDiffLinesRendered;
  optOutUrl: string;
  pullRequestId: number;
  sourceRepo: Repository;
  intl: InjectedIntl;
  initialCardIsCollapsed?: boolean;
};

class PullRequestFeedbackCard extends PureComponent<CardProps> {
  linkSource: string;

  extractLinkSource = () => {
    const { location, history } = this.props;
    const { pathname, search, hash, state } = location;
    const { link_source: linkSource, ...otherParams } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    const stringifiedOtherParams = qs.stringify(otherParams, {
      addQueryPrefix: true,
      indices: false,
    });

    if (linkSource && !this.linkSource) {
      this.linkSource = linkSource;

      // Remove link_source from url
      history.replace(`${pathname}${stringifiedOtherParams}${hash}`, state);
    }
  };

  handleOptOutClick = () => {
    const {
      sourceRepo,
      destRepo,
      pullRequestId,
      numDiffFiles,
      numDiffFilesRendered,
      numDiffLines,
      numDiffLinesRendered,
      isBrowserMsie11,
      isMobileHeaderActive,
    } = this.props;

    const factData = {
      from_repository_uuid: uncurlyUuid(sourceRepo.uuid),
      is_mobile: isMobileHeaderActive,
      is_browser_msie_11: isBrowserMsie11,
      link_source: this.linkSource,
      number_of_files: numDiffFiles,
      number_of_files_rendered: numDiffFilesRendered,
      number_of_diff_lines: numDiffLines,
      number_of_diff_lines_rendered: numDiffLinesRendered,
      pull_request_id: pullRequestId,
      to_repository_uuid: uncurlyUuid(destRepo.uuid),
      to_repository_owner_uuid: uncurlyUuid(
        (destRepo.owner && destRepo.owner.uuid) || ''
      ),
    };

    publishFact(
      new PullRequestFact('bitbucket.pullrequests.tempOptOut.click', factData)
    );
  };

  onCardStatusChange = (event: ExpanderOnChangeEvent) => {
    store.set(FEEDBACK_CARD_COLLAPSED_LOCALSTORAGE_KEY, event.isCollapsed);
  };

  initialCardIsCollapsed = () => {
    if (this.props.initialCardIsCollapsed !== undefined) {
      return this.props.initialCardIsCollapsed;
    }
    return store.get(FEEDBACK_CARD_COLLAPSED_LOCALSTORAGE_KEY, false);
  };

  getJiraIssueCollectorKey = () => {
    let feedbackKey = '';

    if (this.props.isNewCodeReviewFeatureEnabledForUser) {
      feedbackKey = 'code-review-beta';
    }

    if (this.props.isNewCodeReviewFeatureEnabledForTeam) {
      feedbackKey = 'code-review-rollout';
    }

    return feedbackKey;
  };

  render() {
    const { intl } = this.props;

    this.extractLinkSource();

    return (
      <Expander
        isLoading={false}
        icon={
          <EditorPanelIcon
            label={intl.formatMessage(messages.feedbackCardAriaLabel)}
          />
        }
        label={<FormattedMessage {...messages.feedbackCardLabel} />}
        ariaLabel={intl.formatMessage(messages.feedbackCardAriaLabel)}
        defaultIsCollapsed={this.initialCardIsCollapsed()}
        onChange={this.onCardStatusChange}
      >
        <FormattedMessage {...messages.feedbackCardMessage} />
        <styles.FeedbackButtonWrapper>
          <FeedbackButton feedbackKey={this.getJiraIssueCollectorKey()} />
        </styles.FeedbackButtonWrapper>
        <FormattedMessage {...messages.feedbackCardOptOutText} />{' '}
        <a href={this.props.optOutUrl} onClick={this.handleOptOutClick}>
          <FormattedMessage {...messages.feedbackCardOptOutLinkText} />
        </a>
        <FormattedMessage
          {...messages.feedbackCardDocumentationMessage}
          tagName="p"
          values={{
            learnMoreLink: (
              <a
                href="https://confluence.atlassian.com/x/190gOQ"
                target="_blank"
              >
                <FormattedMessage
                  {...messages.feedbackCardDocumentationLinkText}
                />
              </a>
            ),
            bitbucketLabsLink: (
              <a href={navigationUrls.ui.labs()} target="_blank">
                <FormattedMessage {...messages.feedbackCardLabsLinkText} />
              </a>
            ),
          }}
        />
      </Expander>
    );
  }
}

export default injectIntl(PullRequestFeedbackCard);
