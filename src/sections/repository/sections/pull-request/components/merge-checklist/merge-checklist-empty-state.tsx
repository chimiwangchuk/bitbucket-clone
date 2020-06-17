import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, InjectedIntl, injectIntl } from 'react-intl';

import urls from 'src/sections/repository/urls';
import imgUrl from './simple-workflow.svg';
import * as styles from './merge-checklist.style';
import messages from './merge-checklist.i18n';

type MergeChecklistEmptyStateProps = {
  repositoryFullSlug: string;
  intl: InjectedIntl;
};

class MergeChecklistEmptyState extends PureComponent<
  MergeChecklistEmptyStateProps
> {
  render() {
    const [owner, slug] = this.props.repositoryFullSlug.split('/');
    return (
      <Fragment>
        <styles.WorkflowIcon
          alt={this.props.intl.formatMessage(messages.workflowIconAltText)}
          src={imgUrl}
        />
        <styles.MessageRow>
          <FormattedMessage {...messages.emptyStateMessageLineOne} />
        </styles.MessageRow>
        <styles.MessageRow>
          <FormattedMessage {...messages.emptyStateMessageLineTwo} />
        </styles.MessageRow>
        <styles.MessageLink>
          <FormattedMessage
            {...messages.emptyStateMessageLineThree}
            values={{
              branchPermissionsLink: (
                <a href={urls.ui.branchPermissions(owner, slug)}>
                  <FormattedMessage {...messages.emptyStateMessageLink} />
                </a>
              ),
            }}
          />
        </styles.MessageLink>
      </Fragment>
    );
  }
}

export default injectIntl(MergeChecklistEmptyState);
