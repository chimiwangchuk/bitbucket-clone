import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Flag from '@atlaskit/flag';
import { colors } from '@atlaskit/theme';

import urls from 'src/urls/global';
import store from 'src/utils/store';
import { ComponentFlagId } from 'src/redux/flags/types';
import { getCurrentUser } from 'src/selectors/user-selectors';
import { dismissFlag } from 'src/redux/flags';
import { BucketState } from 'src/types/state';
import messages from './i18n';

const NUM_DAYS_TO_SHOW_BANNER_AGAIN = 30;
export const FLAG_ID = 'outdated-jira-connector-flag';

// @ts-ignore TODO: fix noImplicitAny error here
export const getOutdatedJIRAConnectorFlagKey = userId =>
  `dismissed-${FLAG_ID}:${userId}`;

// @ts-ignore TODO: fix noImplicitAny error here
const getDayDiff = (date1, date2) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// @ts-ignore TODO: fix noImplicitAny error here
export const hasEnoughTimeAfterDismissPassed = currentUserId => {
  const dismissedBannerTimeStr = store.get(
    getOutdatedJIRAConnectorFlagKey(currentUserId)
  );

  if (!dismissedBannerTimeStr) {
    return true;
  }

  const dismissedBannerTime = new Date(dismissedBannerTimeStr);
  const dayDiff = getDayDiff(dismissedBannerTime, new Date());

  return dayDiff >= NUM_DAYS_TO_SHOW_BANNER_AGAIN;
};

export type Props = {
  id: ComponentFlagId;
  currentUserId?: string | null;
  dismissOutdatedJIRAConnectorFlag: () => void;
};

export class OutdatedJIRAConnectorFlag extends PureComponent<Props> {
  dismissFlag = () => {
    const { currentUserId, dismissOutdatedJIRAConnectorFlag } = this.props;
    store.set(
      getOutdatedJIRAConnectorFlagKey(currentUserId),
      new Date().toUTCString()
    );

    dismissOutdatedJIRAConnectorFlag();
  };

  render() {
    const actions = [
      {
        content: <FormattedMessage {...messages.linkText} />,
        href: urls.external.jiraConnectorLearnMore,
        target: '_blank',
      },
      {
        testId: 'dismiss-outdated-jira-connector-flag',
        content: <FormattedMessage {...messages.dismissButton} />,
        onClick: this.dismissFlag,
      },
    ];

    return (
      <Flag
        appearance="warning"
        icon={<WarningIcon secondaryColor={colors.Y300} label="Warning icon" />}
        title={<FormattedMessage {...messages.title} />}
        description={<FormattedMessage {...messages.body} />}
        actions={actions}
        {...this.props}
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

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  dismissOutdatedJIRAConnectorFlag: () => dispatch(dismissFlag(FLAG_ID)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OutdatedJIRAConnectorFlag);
