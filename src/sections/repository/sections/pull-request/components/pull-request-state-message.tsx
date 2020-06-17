import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import SectionMessage from '@atlaskit/section-message';
import { connect } from 'react-redux';
import {
  getName,
  getProfileUrl,
  parseCommitAuthor,
} from '@atlassian/bitbucket-user-profile';
import { relativeDateString } from '@atlassian/bitkit-date';

import { PullRequestCommit, User } from 'src/components/types';
import firstLine from 'src/utils/first-line';
import { shortHash } from 'src/utils/short-hash';

import { openDialog } from 'src/redux/pull-request/merge-reducer';
import { BucketState } from 'src/types/state';
import {
  getPullRequestIsMergeable,
  getCurrentPullRequest,
} from 'src/redux/pull-request/selectors';
import * as styles from './pull-request-state-message.style';
import messages from './pull-request-state-message.i18n';

const mapStateToProps = (state: BucketState) => {
  const currentPullRequest =
    getCurrentPullRequest(state) || ({} as Partial<BB.PullRequest>);

  return {
    pullRequestState: currentPullRequest.state,
    mergeCommit: currentPullRequest.merge_commit,
    closedBy: currentPullRequest.closed_by,
    closedOn: currentPullRequest.closed_on,
    reason: currentPullRequest.reason,
    isMergeable: getPullRequestIsMergeable(state),
    hasMergeChecklistFeature:
      state.global.features['new-code-review-merge-checklist'],
  };
};

const mapDispatchToProps = { openMergeDialog: openDialog };

type PullRequestStateMessageProps = {
  pullRequestState: string | undefined;
  mergeCommit: PullRequestCommit | undefined;
  closedBy: User | undefined;
  closedOn: string | undefined;
  reason: string | undefined;
  intl: InjectedIntl;
  openMergeDialog: () => void;
  isMergeable: boolean;
  hasMergeChecklistFeature: boolean;
};

class PullRequestStateMessage extends PureComponent<
  PullRequestStateMessageProps
> {
  render() {
    const {
      pullRequestState,
      mergeCommit,
      intl,
      isMergeable,
      hasMergeChecklistFeature,
    } = this.props;

    if (pullRequestState === 'MERGED') {
      if (
        !mergeCommit ||
        !mergeCommit.message ||
        !mergeCommit.author ||
        !mergeCommit.date
      ) {
        return null;
      }

      const { author } = mergeCommit;

      const mergeCommitAuthorProfileUrl = getProfileUrl(author.user);
      const mergeCommitAuthorString = author.user
        ? getName(author.user, intl)
        : parseCommitAuthor(author.raw);
      const mergeCommitLinks = mergeCommit.links;

      return (
        <styles.StateMessageWrapper>
          <SectionMessage
            appearance="confirmation"
            title={intl.formatMessage(messages.mergedPullRequestStateMessage)}
            actions={[
              {
                key: 'hash',
                href: mergeCommitLinks.html.href,
                text: shortHash(mergeCommit.hash),
              },
              {
                key: 'author',
                href: mergeCommitAuthorProfileUrl,
                text: mergeCommitAuthorString,
              },
              {
                key: 'date',
                text: mergeCommit.date
                  ? relativeDateString(mergeCommit.date, intl)
                  : '',
              },
            ]}
          >
            <p>{firstLine(mergeCommit.message)}</p>
          </SectionMessage>
        </styles.StateMessageWrapper>
      );
    } else if (pullRequestState === 'DECLINED') {
      const { closedBy, closedOn } = this.props;

      if (!closedOn) {
        return null;
      }

      const closedByProfileUrl = getProfileUrl(closedBy);
      const closedByName = getName(closedBy, intl);

      return (
        <styles.StateMessageWrapper>
          <SectionMessage
            appearance="error"
            title={intl.formatMessage(messages.declinedPullRequestStateMessage)}
            actions={[
              {
                key: 'closed-by',
                href: closedByProfileUrl,
                text: closedByName,
              },
              {
                key: 'date',
                text: relativeDateString(closedOn, intl),
              },
            ]}
          >
            <p>{this.props.reason}</p>
          </SectionMessage>
        </styles.StateMessageWrapper>
      );
    } else if (isMergeable && hasMergeChecklistFeature) {
      return (
        <styles.StateMessageWrapper>
          <SectionMessage
            appearance="info"
            title={intl.formatMessage(
              messages.readyToMergePullRequestStateMessage
            )}
            actions={[
              {
                key: 'merge-dialog',
                onClick: this.props.openMergeDialog,
                text: intl.formatMessage(messages.mergePullRequestLink),
              },
            ]}
          >
            <p>
              {intl.formatMessage(messages.readyToMergePullRequestDescription)}
            </p>
          </SectionMessage>
        </styles.StateMessageWrapper>
      );
    }
    return null;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PullRequestStateMessage));
