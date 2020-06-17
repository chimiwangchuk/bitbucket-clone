import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Lozenge, { ThemeAppearance } from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';
import { relativeDateString } from '@atlassian/bitkit-date';
import { PullRequestState } from 'src/components/types';
import messages from './state-lozenge.i18n';
import * as styles from './state-lozenge.style';

const pullRequestStateAppearance: ThemeAppearance = {
  OPEN: 'inprogress',
  MERGED: 'success',
  DECLINED: 'removed',
  SUPERSEDED: 'moved',
  default: 'default',
};

type StateLozengeProps = {
  intl: InjectedIntl;
  pullRequestState: PullRequestState;
  pullRequestCreatedOn: string;
  pullRequestClosedOn: string | null | undefined;
};

class StateLozenge extends PureComponent<StateLozengeProps> {
  pullRequestStateMessage = () => {
    const {
      intl,
      pullRequestState,
      pullRequestCreatedOn,
      pullRequestClosedOn,
    } = this.props;

    const closedOn = pullRequestClosedOn || null;

    switch (pullRequestState) {
      case 'MERGED':
        return intl.formatMessage(messages.pullRequestMerged, {
          formattedDate: relativeDateString(closedOn, intl),
        });
      case 'DECLINED':
        return intl.formatMessage(messages.pullRequestDeclined, {
          formattedDate: relativeDateString(closedOn, intl),
        });
      case 'OPEN':
      default:
        return intl.formatMessage(messages.pullRequestCreated, {
          formattedDate: relativeDateString(pullRequestCreatedOn, intl),
        });
    }
  };

  pullRequestStateLabel = () => {
    const { intl, pullRequestState } = this.props;

    switch (pullRequestState) {
      case 'MERGED':
        return intl.formatMessage(messages.pullRequestMergedLabel);
      case 'DECLINED':
        return intl.formatMessage(messages.pullRequestDeclinedLabel);
      case 'OPEN':
        return intl.formatMessage(messages.pullRequestOpenLabel);
      default:
        return pullRequestState;
    }
  };

  render() {
    const { pullRequestState } = this.props;
    return (
      <Tooltip content={this.pullRequestStateMessage()}>
        <styles.StateLozenge>
          <Lozenge
            isBold
            // @ts-ignore TODO: fix noImplicitAny error here
            appearance={pullRequestStateAppearance[pullRequestState]}
          >
            {this.pullRequestStateLabel()}
          </Lozenge>
        </styles.StateLozenge>
      </Tooltip>
    );
  }
}

export default injectIntl(StateLozenge);
