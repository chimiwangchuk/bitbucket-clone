import React, { PureComponent } from 'react';
import { FormattedMessage, InjectedIntl, injectIntl } from 'react-intl';

import Button from '@atlaskit/button';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import Spinner from '@atlaskit/spinner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';

type ApprovalButtonMessages = {
  approveLabel: FormattedMessage.MessageDescriptor;
  unapproveLabel: FormattedMessage.MessageDescriptor;
  approveAction: FormattedMessage.MessageDescriptor;
  unapproveAction: FormattedMessage.MessageDescriptor;
};

type ApprovalButtonProps = {
  messages: ApprovalButtonMessages;
  approve: () => void;
  hasApproved: boolean;
  intl: InjectedIntl;
  isDisabled: boolean;
  isError: boolean;
  isLoading: boolean;
  unapprove: () => void;
  tabIndex?: number;
};

class ApprovalButton extends PureComponent<ApprovalButtonProps> {
  render() {
    const {
      approve,
      hasApproved,
      intl,
      isDisabled,
      isError,
      isLoading,
      unapprove,
      messages,
      tabIndex,
    } = this.props;

    const clickAction = hasApproved ? unapprove : approve;

    const label = hasApproved
      ? intl.formatMessage(messages.unapproveLabel)
      : intl.formatMessage(messages.approveLabel);

    const messageProps = hasApproved
      ? { ...messages.unapproveAction }
      : { ...messages.approveAction };

    let icon = <CheckCircleIcon label="" />;

    if (isError) {
      icon = <WarningIcon label="" size="medium" primaryColor={colors.Y300} />;
    }
    if (isLoading) {
      icon = <Spinner size="small" delay={0} />;
    }

    return (
      <Button
        appearance="default"
        aria-label={label}
        iconBefore={icon}
        isDisabled={isDisabled}
        onClick={clickAction}
        tabIndex={tabIndex}
      >
        <FormattedMessage {...messageProps} />
      </Button>
    );
  }
}

export default injectIntl(ApprovalButton);
