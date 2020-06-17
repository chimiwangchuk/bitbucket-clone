import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import Badge from '@atlaskit/badge';
import { colors } from '@atlaskit/theme';
import { DropdownItem } from './dropdown-helpers';
import * as styles from './whats-new-parent-item.style';
import messages from './help-menu.i18n';

type Props = {
  newBlogCount: number;
  onClick: (e: React.MouseEvent<any>) => void;
  intl: InjectedIntl;
  isAkDropdown?: boolean;
};

class WhatsNewParentItem extends PureComponent<Props> {
  handleClick = (e: React.MouseEvent<any>) => {
    // AkDropdownItem automatically closes the menu if the "href" prop is not present,
    // so here we explicitly stop the menu closing by keeping the href here and then
    // preventing default.
    e.preventDefault();
    this.props.onClick(e);
  };
  render() {
    const { newBlogCount, intl, isAkDropdown } = this.props;

    return (
      <DropdownItem
        href="#"
        onClick={this.handleClick}
        isAkDropdown={isAkDropdown}
      >
        <styles.RightArrowDropdownItem>
          {intl.formatMessage(messages.whatsNewTitle)}{' '}
          {newBlogCount ? (
            <styles.BadgeChevronWrapper>
              <Badge
                appearance={{
                  backgroundColor: colors.P300,
                  textColor: colors.N0,
                }}
              >
                {newBlogCount}
              </Badge>{' '}
              <ChevronRightIcon size="small" label="" />
            </styles.BadgeChevronWrapper>
          ) : (
            <ChevronRightIcon size="small" label="" />
          )}
        </styles.RightArrowDropdownItem>
      </DropdownItem>
    );
  }
}

export default injectIntl(WhatsNewParentItem);
