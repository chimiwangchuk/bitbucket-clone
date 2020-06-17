import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Button from '@atlaskit/button';

import { UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS } from 'src/redux/pull-request-settings';
import { Diff } from 'src/types/pull-request';

import HiddenDiff from './hidden-diff';
import messages from './file-contents-unchanged-diff.i18n';

type FileContentsUnchangedDiffProps = {
  file: Diff;
  isOpen: boolean;
  intl: InjectedIntl;
  onToggleWhitespace: () => void;
};

class FileContentsUnchangedDiff extends PureComponent<
  FileContentsUnchangedDiffProps
> {
  static defaultProps = {
    isOpen: true,
  };

  render() {
    const { file, isOpen, onToggleWhitespace } = this.props;

    return (
      <HiddenDiff
        file={file}
        isOpen={isOpen}
        heading={<FormattedMessage {...messages.heading} />}
        description={<FormattedMessage tagName="p" {...messages.description} />}
        actions={
          <li>
            <Button appearance="link" onClick={() => onToggleWhitespace()}>
              <FormattedMessage {...messages.action} />
            </Button>
          </li>
        }
      />
    );
  }
}

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  onToggleWhitespace: () =>
    // We normally wouldn't dispatch this directly (which is why there's no action creator),
    // but this is needed to continue some level of support for this button until COREX-2023
    // is addressed
    dispatch({
      type: UPDATE_GLOBAL_SHOULD_IGNORE_WHITESPACE_SUCCESS,
      payload: {
        shouldIgnoreWhitespace: false,
      },
    }),
});

export default compose<any, any, any>(
  injectIntl,
  connect(null, mapDispatchToProps)
)(FileContentsUnchangedDiff);
