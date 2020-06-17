import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Diff } from 'src/types/pull-request';
import {
  getCurrentRepositoryFullSlug,
  getRepositoryAccessLevel,
} from 'src/selectors/repository-selectors';
import { RepositoryPrivilege } from 'src/sections/repository/types';
import urls from 'src/sections/repository/urls';
import { extractFilepath } from 'src/utils/extract-file-path';
import { BucketState } from 'src/types/state';
import SourceDiffLink from '../../containers/source-diff-link';

import { DiffCommentsDialogTrigger } from '../diff-comments-dialog';

import HiddenDiff from './hidden-diff';
import messages from './excluded-diff.i18n';

export type ExcludedDiffProps = {
  file: Diff;
  repoSlug: string;
  pattern: string;
  isOpen: boolean;
  intl: InjectedIntl;
  userLevel: RepositoryPrivilege | null | undefined;
};

class ExcludedDiff extends PureComponent<ExcludedDiffProps> {
  static defaultProps = {
    isOpen: true,
  };

  render() {
    const { file, repoSlug, pattern, isOpen, userLevel } = this.props;
    const filepath = extractFilepath(file);

    const excludedDiffLink = () => {
      if (userLevel === 'admin') {
        return (
          <a href={urls.ui.excludedFiles(repoSlug)} target="_blank">
            <FormattedMessage {...messages.adminLinkText} />
          </a>
        );
      } else {
        return (
          <a href={urls.external.excludedFilesLearnMore} target="_blank">
            <FormattedMessage {...messages.defaultLinkText} />
          </a>
        );
      }
    };

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
              pattern,
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
            <li>{excludedDiffLink()}</li>
          </Fragment>
        }
      />
    );
  }
}

const mapStateToProps = (state: BucketState) => ({
  repoSlug: getCurrentRepositoryFullSlug(state),
  userLevel: getRepositoryAccessLevel(state),
});

export default compose<any, any, any>(
  injectIntl,
  connect(mapStateToProps)
)(ExcludedDiff);
