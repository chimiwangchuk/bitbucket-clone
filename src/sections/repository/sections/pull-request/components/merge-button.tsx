import React, { PureComponent } from 'react';
import Button from '@atlaskit/button';
import RecentIcon from '@atlaskit/icon/glyph/recent';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import messages from './merge-button.i18n';

type MergeButtonProps = InjectedIntlProps & {
  isMergePending: boolean;
  isAsyncMergeInProgress: boolean;
  onClick: () => void;
  tabIndex?: number;
  isMergeable: boolean;
  hasMergeChecklistFeature: boolean;
};

class MergeButton extends PureComponent<MergeButtonProps> {
  render() {
    const {
      isAsyncMergeInProgress,
      isMergePending,
      onClick,
      tabIndex,
      isMergeable,
      hasMergeChecklistFeature,
      intl,
    } = this.props;

    const iconBefore = isMergePending ? (
      <RecentIcon label={intl.formatMessage(messages.pendingMergeIconLabel)} />
    ) : (
      undefined
    );

    if (hasMergeChecklistFeature) {
      return (
        // change this to inline dialog: https://softwareteams.atlassian.net/browse/COREX-1176
        <Button
          onClick={onClick}
          iconBefore={iconBefore}
          isLoading={isAsyncMergeInProgress}
          tabIndex={tabIndex}
          appearance={isMergeable ? 'primary' : 'default'}
        >
          <FormattedMessage {...messages.mergePullRequestAction} />
        </Button>
      );
    }
    return (
      <Button
        onClick={onClick}
        iconBefore={iconBefore}
        isLoading={isAsyncMergeInProgress}
        tabIndex={tabIndex}
      >
        <FormattedMessage {...messages.mergePullRequestAction} />
      </Button>
    );
  }
}

export default injectIntl(MergeButton);
