import React, { Component } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';
import EmojiFrequentIcon from '@atlaskit/icon/glyph/emoji/frequent';

import { Expander, ExpanderOnChangeEvent } from 'src/components/sidebar';
import store from 'src/utils/store';

import PullRequestActivity from '../../containers/pull-request-activity';
import messages from './pull-request-activity-card.i18n';

const ACTIVITY_CARD_COLLAPSED_LOCALSTORAGE_KEY = 'activity.card.collapsed';

type PullRequestActivityCardProps = {
  isCollapsed?: boolean;
  intl: InjectedIntl;
};

class PullRequestActivityCard extends Component<PullRequestActivityCardProps> {
  static defaultProps = {
    isCollapsed: false,
  };

  onCardStatusChange = (event: ExpanderOnChangeEvent) => {
    store.set(ACTIVITY_CARD_COLLAPSED_LOCALSTORAGE_KEY, event.isCollapsed);
  };

  initialCardIsCollapsed = () =>
    store.get(ACTIVITY_CARD_COLLAPSED_LOCALSTORAGE_KEY, false);

  render() {
    const { isCollapsed, intl } = this.props;
    const label = intl.formatMessage(messages.activityCardLabel);
    const icon = <EmojiFrequentIcon label={label} />;

    if (isCollapsed) {
      return (
        <Tooltip position="left" content={label}>
          <Button appearance="subtle" iconBefore={icon} />
        </Tooltip>
      );
    }

    return (
      <div data-qa="pr-activity-card">
        <Expander
          icon={icon}
          label={label}
          ariaLabel={intl.formatMessage(messages.activityCardLabel)}
          defaultIsCollapsed={this.initialCardIsCollapsed()}
          onChange={this.onCardStatusChange}
          isPanelBodyOverflowVisible
        >
          <PullRequestActivity />
        </Expander>
      </div>
    );
  }
}

export default injectIntl(PullRequestActivityCard);
