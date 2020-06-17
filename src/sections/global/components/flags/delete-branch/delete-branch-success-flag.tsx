import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { AutoDismissFlag } from '@atlaskit/flag';
import Tag from '@atlaskit/tag';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { colors } from '@atlaskit/theme';
import { DetailedBranch } from 'src/sections/repository/sections/branches/types';
import { getCurrentRepositoryScm } from 'src/selectors/repository-selectors';
import { getDeleteBranchDialogSlice } from 'src/redux/branches';
import { BucketState } from 'src/types/state';
import messages from './delete-branch-success-flag.i18n';

type Props = {
  id: string;
  scm: 'git' | 'hg';
  branch: DetailedBranch;
  intl: InjectedIntl;
};

const SuccessFlag = ({ scm, branch, intl, ...otherProps }: Props) => (
  <AutoDismissFlag
    {...otherProps}
    icon={<SuccessIcon label="success" primaryColor={colors.G300} />}
    title={intl.formatMessage(messages[scm].deleteBranchSuccessTitle)}
    description={
      <FormattedMessage
        {...messages[scm].deleteBranchSuccessDescription}
        values={{ branchLabel: <Tag text={branch.name} /> }}
      />
    }
  />
);

const mapStateToProps = (state: BucketState) => {
  const scm = getCurrentRepositoryScm(state);
  const {
    successFlag: { branch },
  } = getDeleteBranchDialogSlice(state);

  return {
    scm,
    branch,
  };
};

export const DeleteBranchSuccessFlag = compose<any, any, any>(
  injectIntl,
  connect(mapStateToProps)
)(SuccessFlag);
