import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntl } from 'react-intl';
import Flag from '@atlaskit/flag';
import InfoIcon from '@atlaskit/icon/glyph/info';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { SiteMessage } from 'src/types/site-message';
import { ComponentFlagProps } from 'src/redux/flags/types';
import { BucketState } from 'src/types/state';
import messages from './site-message-flag.i18n';
import { messageDismissed } from './site-message-store';

type Props = ComponentFlagProps & {
  onDismissed: (id: string) => void;
  siteMessage: SiteMessage;
  intl: InjectedIntl;
  currentUserId: string;
};

export class SiteMessageFlag extends PureComponent<Props> {
  actions = () => {
    const {
      siteMessage: { id, url },
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
      href: url,
      target: '_new',
      onClick: () => {
        this.onDismiss(id);
      },
    };
    return url ? [gotIt, learnMore] : [gotIt];
  };

  onDismiss = (messageId: number) => {
    messageDismissed(this.props.currentUserId, messageId);
  };

  render() {
    const { siteMessage, id, ...flagProps } = this.props;

    if (!siteMessage) {
      return null;
    }

    const { title, text } = siteMessage;

    return (
      <Flag
        {...flagProps}
        actions={this.actions()}
        appearance="info"
        description={text}
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
    siteMessage: state.global.siteMessage,
    currentUserId: currentUser && currentUser.uuid,
  };
};

export default connect(mapStateToProps)(injectIntl(SiteMessageFlag));
