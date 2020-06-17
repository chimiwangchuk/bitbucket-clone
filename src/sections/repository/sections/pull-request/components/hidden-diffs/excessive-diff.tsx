import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { Diff } from 'src/types/pull-request';
import urls from 'src/sections/repository/urls';
import { extractFilepath } from 'src/utils/extract-file-path';
import SourceDiffLink from '../../containers/source-diff-link';
import { DiffCommentsDialogTrigger } from '../diff-comments-dialog';

import HiddenDiff from './hidden-diff';
import messages from './excessive-diff.i18n';

export type ExcessiveDiffProps = {
  file: Diff;
  size: number;
  isOpen: boolean;
  intl: InjectedIntl;
};

class ExcessiveDiff extends PureComponent<ExcessiveDiffProps> {
  static defaultProps = {
    isOpen: true,
  };

  render() {
    const { file, size, isOpen } = this.props;
    const filepath = extractFilepath(file);

    return (
      <HiddenDiff
        file={file}
        isOpen={isOpen}
        heading={<FormattedMessage {...messages.heading} />}
        description={
          <FormattedMessage
            tagName="p"
            {...messages.description}
            values={{
              size,
            }}
          />
        }
        actions={
          <Fragment>
            <DiffCommentsDialogTrigger file={file} />
            <li>
              <SourceDiffLink filepath={filepath} target="_blank">
                <FormattedMessage {...messages.action} />
              </SourceDiffLink>
            </li>
            <li>
              <a href={urls.external.excludedFilesLearnMore} target="_blank">
                <FormattedMessage {...messages.excludedFilesLinkText} />
              </a>
            </li>
          </Fragment>
        }
      />
    );
  }
}

export default injectIntl(ExcessiveDiff);
