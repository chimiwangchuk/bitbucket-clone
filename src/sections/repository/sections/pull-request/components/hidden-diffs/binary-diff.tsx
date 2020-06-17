import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { Diff } from 'src/types/pull-request';
import { extractFilepath } from 'src/utils/extract-file-path';
import SourceDiffLink from '../../containers/source-diff-link';

import HiddenDiff from './hidden-diff';
import messages from './binary-diff.i18n';

export type BinaryDiffProps = {
  file: Diff;
  isOpen: boolean;
  intl: InjectedIntl;
};

class BinaryDiff extends PureComponent<BinaryDiffProps> {
  static defaultProps = {
    isOpen: true,
  };

  render() {
    const { file, isOpen } = this.props;
    const filepath = extractFilepath(file);

    return (
      <HiddenDiff
        file={file}
        isOpen={isOpen}
        heading={<FormattedMessage {...messages.heading} />}
        description={<FormattedMessage tagName="p" {...messages.description} />}
        actions={
          <li>
            <SourceDiffLink filepath={filepath} target="_blank">
              <FormattedMessage {...messages.action} />
            </SourceDiffLink>
          </li>
        }
      />
    );
  }
}

export default injectIntl(BinaryDiff);
