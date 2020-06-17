import React, { PureComponent } from 'react';
import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { FormattedMessage } from 'react-intl';

import messages from './msie11-warning-banner.i18n';

const Icon = <WarningIcon label="Warning icon" secondaryColor="inherit" />;

type Msie11WarningBannerProps = {
  url: string;
  isOpen: boolean;
};

class Msie11WarningBanner extends PureComponent<Msie11WarningBannerProps> {
  render() {
    const { url, isOpen = true } = this.props;

    return (
      <Banner icon={Icon} isOpen={isOpen} appearance="warning">
        <FormattedMessage {...messages.Msie11WarningBanner} />{' '}
        <a href={url}>
          <FormattedMessage {...messages.Msie11WarningLinkLabel} />
        </a>
      </Banner>
    );
  }
}

export default Msie11WarningBanner;
