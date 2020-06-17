import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { AutoDismissFlag } from '@atlaskit/flag';
import Tag from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';
import { ComponentFlagId } from 'src/redux/flags/types';
import { getCompareBranchesDialogSlice } from 'src/redux/branches';
import { getBranchesFullNames } from 'src/utils/compare-branches';
import { BucketState } from 'src/types/state';
import messages from './compare-branches-error-flag.i18n';

type Props = {
  id: ComponentFlagId;
  action: 'sync' | 'merge';
  sourceBranchName: string;
  destinationBranchName: string;
  errorMessage: string | null;
  intl: InjectedIntl;
};

const ErrorFlag = ({
  id,
  intl,
  action,
  sourceBranchName,
  destinationBranchName,
  errorMessage,
  ...otherProps
}: Props) => (
  <AutoDismissFlag
    {...otherProps}
    id={id}
    icon={<ErrorIcon label="error" primaryColor={colors.R300} />}
    title={intl.formatMessage(messages[action].compareBranchesErrorTitle)}
    description={
      errorMessage || (
        <FormattedMessage
          {...messages[action].compareBranchesErrorDescription}
          values={{
            sourceBranch: (
              <Tooltip content={sourceBranchName} tag="span">
                <Tag text={sourceBranchName} />
              </Tooltip>
            ),
            destinationBranch: (
              <Tooltip content={destinationBranchName} tag="span">
                <Tag text={destinationBranchName} />
              </Tooltip>
            ),
          }}
        />
      )
    }
  />
);

const mapStateToProps = (state: BucketState) => {
  const {
    sourceBranchName,
    destinationBranchName,
    sourceRepositoryFullName,
    destinationRepositoryFullName,
    isMerge,
    errorMessage,
  } = getCompareBranchesDialogSlice(state);

  const fullNames = getBranchesFullNames(
    sourceBranchName,
    destinationBranchName,
    sourceRepositoryFullName,
    destinationRepositoryFullName
  );

  return {
    action: isMerge ? 'merge' : 'sync',
    sourceBranchName: fullNames.sourceBranchName,
    destinationBranchName: fullNames.destinationBranchName,
    errorMessage,
  };
};

export const CompareBranchesErrorFlag = compose<any, any, any>(
  injectIntl,
  connect(mapStateToProps)
)(ErrorFlag);
