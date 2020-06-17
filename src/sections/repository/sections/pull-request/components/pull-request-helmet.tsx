import React, { PureComponent } from 'react';
// @ts-ignore TODO: fix noImplicitAny error here
import Helmet from 'react-helmet';
import { injectIntl, InjectedIntl } from 'react-intl';

import { PullRequest } from 'src/components/types';
import messages from './pull-request-helmet.i18n';

type PullRequestHelmetProps = {
  currentPullRequest?: PullRequest;
  intl: InjectedIntl;
};

class PullRequestHelmet extends PureComponent<PullRequestHelmetProps> {
  titleTemplate = (id: string | number, title: string) => {
    const translatedPullRequest = this.props.intl.formatMessage(
      messages.pullRequestTitle
    );

    return `/ ${translatedPullRequest} #${id}: ${title}`;
  };

  render() {
    const { currentPullRequest, intl } = this.props;
    let helmetTitle = `/ ${intl.formatMessage(messages.pullRequestTitle)}`;

    if (currentPullRequest) {
      const { id, title } = currentPullRequest;
      helmetTitle = this.titleTemplate(id, title);
    }

    return <Helmet title={helmetTitle} defer={false} />;
  }
}

export default injectIntl(PullRequestHelmet);
