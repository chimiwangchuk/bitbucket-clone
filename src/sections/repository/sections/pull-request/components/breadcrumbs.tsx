import { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import { Repository } from 'src/components/types';

import urls from 'src/redux/pull-request/urls';

import { ComponentLink as Link } from 'src/components/component-link';
import messages from './breadcrumbs.i18n';

type PullRequestBreadcrumbsProps = {
  repository: Repository | null | undefined;
  intl: InjectedIntl;
};

class PullRequestBreadcrumbs extends PureComponent<
  PullRequestBreadcrumbsProps
> {
  render() {
    const { intl, repository } = this.props;

    if (!(repository && repository.owner)) {
      return null;
    }

    const [owner, slug] = repository.full_name.split('/');
    const href = urls.ui.pullrequests(owner, slug);
    const text = intl.formatMessage(messages.pullRequests);

    return <BreadcrumbsItem href={href} text={text} component={Link} />;
  }
}

export default injectIntl(PullRequestBreadcrumbs);
