import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { InjectedIntl, injectIntl } from 'react-intl';
import Flag from '@atlaskit/flag';
import InfoIcon from '@atlaskit/icon/glyph/info';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { ComponentFlagProps } from 'src/redux/flags/types';
import { BucketState } from 'src/types/state';
import messages from './ie-deprecation-flag.i18n';
import { messageDismissed } from './ie-deprecation-store';

type Props = ComponentFlagProps & {
  onDismissed: (id: string) => void;
  intl: InjectedIntl;
  currentUserId: string;
};

// flag that shows a warning to users that IE11 is not supported by bitbucket.   Originally this was the second of 2
//  warnings, but now we only show part 2.
export class IeDeprecationFlagTwo extends PureComponent<Props> {
  actions = () => {
    const {
      id: id,
      intl: { formatMessage },
    } = this.props;

    const gotIt = {
      content: formatMessage(messages.gotItButton),
      onClick: () => {
        this.onDismiss(id);
        this.props.onDismissed(this.props.id);
      },
    };
    const learnMore = {
      content: formatMessage(messages.learnMoreButton),
      href:
        'https://confluence.atlassian.com/cloud/supported-browsers-744721663.html',
      target: '_new',
      onClick: () => {
        this.onDismiss(id);
        this.props.onDismissed(this.props.id);
      },
    };
    return [gotIt, learnMore];
  };

  onDismiss = (messageId: string) => {
    messageDismissed(this.props.currentUserId, messageId);
  };

  render() {
    const {
      id,
      intl: { formatMessage },
      ...flagProps
    } = this.props;

    const title = formatMessage(messages.phaseTwoTitle);
    const content = formatMessage(messages.phaseTwoContent);

    return (
      <Flag
        {...flagProps}
        actions={this.actions()}
        appearance="info"
        description={content}
        icon={<InfoIcon label="" secondaryColor="inherit" />}
        id={id}
        title={title}
      />
    );
  }
}

const mapStateToProps = (state: BucketState) => {
  const currentUser = getCurrentUser(state);
  return {
    currentUserId: currentUser && currentUser.uuid,
  };
};

export default connect(mapStateToProps)(injectIntl(IeDeprecationFlagTwo));
