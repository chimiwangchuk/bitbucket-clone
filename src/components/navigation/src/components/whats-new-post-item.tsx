import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import Lozenge from '@atlaskit/lozenge';
import { Blog } from './blog-fetch';
import * as styles from './whats-new-post-item.style';
import messages from './help-menu.i18n';

type Props = Blog & { intl: InjectedIntl; onClick: () => void };

class WhatsNewPostItem extends PureComponent<Props> {
  render() {
    const { id, link, date, title, intro, isNew, intl, onClick } = this.props;
    return (
      <styles.Card key={id}>
        <styles.CardHeader>
          <styles.Date>{date}</styles.Date>
          {isNew && (
            <Lozenge appearance="new">
              {intl.formatMessage(messages.newLabel)}
            </Lozenge>
          )}
        </styles.CardHeader>
        <styles.CardInner>
          <styles.CardTitle>{title}</styles.CardTitle>
          {/* The intro returned from the feed includes escaped characters such as
            &#8211; which cannot be natively escaped without DOM hackery. The
            content has already had HTML tags stripped. */}
          <styles.WhatsNewIntro dangerouslySetInnerHTML={{ __html: intro }} />
          <styles.LearnMoreLink href={link} target="_blank" onClick={onClick}>
            {intl.formatMessage(messages.learnMoreLink)}
          </styles.LearnMoreLink>
        </styles.CardInner>
      </styles.Card>
    );
  }
}

export default injectIntl(WhatsNewPostItem);
