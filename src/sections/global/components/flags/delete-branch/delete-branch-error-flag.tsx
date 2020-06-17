import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { AutoDismissFlag } from '@atlaskit/flag';
import Tag from '@atlaskit/tag';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';
import { Branch } from 'src/components/types';
import { getCurrentRepositoryScm } from 'src/selectors/repository-selectors';
import {
  DeleteBranchErrorType,
  DeleteBranchErrorTypes,
  getDeleteBranchDialogSlice,
} from 'src/redux/branches';
import { BucketState } from 'src/types/state';
import messages from './delete-branch-error-flag.i18n';

const getErrorMessage = (
  scm: 'git' | 'hg',
  errorType: DeleteBranchErrorType
) => {
  switch (errorType) {
    case DeleteBranchErrorTypes.BRANCH_NOT_FOUND:
      return messages[scm].deleteBranchErrorDescriptionNotFound;
    case DeleteBranchErrorTypes.ACCESS_DENIED:
      return messages[scm].deleteBranchErrorDescriptionAccessDenied;
    default:
    case DeleteBranchErrorTypes.GENERIC:
      return messages[scm].deleteBranchErrorDescriptionGeneric;
  }
};

type Props = {
  id: string;
  scm: 'git' | 'hg';
  branch: Branch;
  errorType: DeleteBranchErrorType;
  intl: InjectedIntl;
};

const ErrorFlag = ({ scm, branch, errorType, intl, ...otherProps }: Props) => (
  <AutoDismissFlag
    {...otherProps}
    icon={<ErrorIcon label="error" primaryColor={colors.R300} />}
    title={intl.formatMessage(messages[scm].deleteBranchErrorTitle)}
    description={
      <FormattedMessage
        {...getErrorMessage(scm, errorType)}
        values={{ branchLabel: <Tag text={branch.name} /> }}
      />
    }
  />
);

const mapStateToProps = (state: BucketState) => {
  const scm = getCurrentRepositoryScm(state);
  const {
    errorFlag: { branch, errorType },
  } = getDeleteBranchDialogSlice(state);

  return {
    scm,
    branch,
    errorType,
  };
};

export const DeleteBranchErrorFlag = compose<any, any, any>(
  injectIntl,
  connect(mapStateToProps)
)(ErrorFlag);
