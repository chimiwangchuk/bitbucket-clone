import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import urls from 'src/sections/repository/urls';
import imgUrl from './pipelines-promotion-icon.png';
import * as styles from './build-status-pipelines-promotion.style';
import messages from './build-status-pipelines-promotion.i18n';

type BuildStatusPipelinesPromotionProps = {
  repositoryFullSlug: string;
};

export default class BuildStatusPipelinesPromotion extends PureComponent<
  BuildStatusPipelinesPromotionProps
> {
  render() {
    const [owner, slug] = this.props.repositoryFullSlug.split('/');
    return (
      <Fragment>
        <styles.PipelinesPromotionIcon
          alt="Code emerging from a folder, with a green tick implying it's correctly working."
          height="104"
          src={imgUrl}
        />
        <styles.PipelinesPromotionRow>
          <FormattedMessage
            {...messages.promotionLineOne}
            values={{
              bitbucketPipelinesDocumentation: (
                <a
                  target="_blank"
                  href="https://confluence.atlassian.com/bitbucket/get-started-with-bitbucket-pipelines-792298921.html"
                >
                  <FormattedMessage
                    {...messages.promotionPipelinesDocumentationLink}
                  />
                </a>
              ),
            }}
          />
        </styles.PipelinesPromotionRow>
        <styles.PipelinesPromotionRow>
          <FormattedMessage {...messages.promotionLineTwo} />
        </styles.PipelinesPromotionRow>
        <styles.PipelinesPromotionLink>
          {/* Only links to Bitbucket Pipelines production environment at the moment. This URL will not work on Bitbucket Staging, as it uses the Pipelines Staging environment. */}
          <a href={urls.ui.pipelines(owner, slug)}>
            <FormattedMessage
              {...messages.promotionSetUpBitbucketPipelinesLink}
            />
          </a>
        </styles.PipelinesPromotionLink>
      </Fragment>
    );
  }
}
