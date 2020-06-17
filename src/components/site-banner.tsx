import React, { PureComponent, Fragment } from 'react';
import { InjectedIntl } from 'react-intl';

import Banner from '@atlaskit/banner';

import { SiteMessage } from 'src/types/site-message';
import messages from '../sections/global/components/flags/site-message/site-message-flag.i18n';

type Props = { siteMessage?: SiteMessage; intl: InjectedIntl };

class SiteBanner extends PureComponent<Props> {
  render() {
    const {
      siteMessage,
      intl: { formatMessage },
    } = this.props;
    if (!siteMessage) {
      return null;
    }

    return (
      // Banner.isOpen is always true, because this SiteBanner component
      // is conditionally rendered by the parent.
      <Banner isOpen>
        {siteMessage.text}
        {siteMessage.url && (
          <Fragment>
            {' '}
            &mdash;{' '}
            <a href={siteMessage.url} target="_new" rel="noopener">
              {formatMessage(messages.learnMoreButton)}
            </a>
          </Fragment>
        )}
      </Banner>
    );
  }
}

export default SiteBanner;
