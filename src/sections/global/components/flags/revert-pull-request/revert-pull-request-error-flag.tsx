import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntl } from 'react-intl';
import { AutoDismissFlag } from '@atlaskit/flag';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';
import { getRevertError } from 'src/redux/pull-request/selectors';
import { ComponentFlagId } from 'src/redux/flags/types';
import { BucketState } from 'src/types/state';
import messages from './revert-pull-request-error-flag.i18n';

type Props = {
  id: ComponentFlagId;
  revertError: string | null;
  intl: InjectedIntl;
};

const ErrorFlag = ({ id, intl, revertError, ...otherProps }: Props) => (
  <AutoDismissFlag
    {...otherProps}
    id={id}
    icon={<ErrorIcon label="error" primaryColor={colors.R300} />}
    title={intl.formatMessage(messages.title)}
    description={revertError}
    actions={[
      {
        content: intl.formatMessage(messages.learnMore),
        href:
          'https://www.atlassian.com/git/tutorials/undoing-changes/git-revert',
        target: '_blank',
      },
    ]}
  />
);

const mapStateToProps = (state: BucketState) => ({
  revertError: getRevertError(state),
});

export const RevertPullRequestErrorFlag = compose<any, any, any>(
  injectIntl,
  connect(mapStateToProps)
)(ErrorFlag);
