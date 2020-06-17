import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { Diff } from 'src/types/pull-request';

import HiddenDiff from './hidden-diff';
import messages from './empty-diff.i18n';

export type EmptyDiffProps = {
  file: Diff;
  isOpen: boolean;
  intl: InjectedIntl;
};

class EmptyDiff extends PureComponent<EmptyDiffProps> {
  static defaultProps = {
    isOpen: true,
  };

  render() {
    const { file, isOpen } = this.props;

    return (
      <HiddenDiff
        file={file}
        isOpen={isOpen}
        heading={<FormattedMessage {...messages.heading} />}
        description={<FormattedMessage tagName="p" {...messages.description} />}
      />
    );
  }
}

export default injectIntl(EmptyDiff);
