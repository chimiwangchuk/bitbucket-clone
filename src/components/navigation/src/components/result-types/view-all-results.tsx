import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { colors } from '@atlaskit/theme';

import DrawerItem from '../drawer-item';
import * as styles from './icon.style';
import messages from './view-all-results.i18n';

type ViewAllResultsProps = {
  text: any;
  intl: InjectedIntl;
};

class ViewAllResults extends PureComponent<ViewAllResultsProps> {
  render() {
    const { text, intl, ...props } = this.props;

    const icon = (
      <styles.Icon backgroundColor={colors.N50}>
        <SearchIcon
          label={intl.formatMessage(messages.searchIcon)}
          primaryColor="#FFFFFF"
        />
      </styles.Icon>
    );

    return <DrawerItem icon={icon} text={text} {...props} />;
  }
}

export default injectIntl(ViewAllResults);
