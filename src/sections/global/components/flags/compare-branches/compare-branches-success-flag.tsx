import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { AutoDismissFlag } from '@atlaskit/flag';
import Tag from '@atlaskit/tag';
import Tooltip from '@atlaskit/tooltip';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { colors } from '@atlaskit/theme';
import { ComponentFlagId } from 'src/redux/flags/types';
import { getCompareBranchesDialogSlice } from 'src/redux/branches';
import { getBranchesFullNames } from 'src/utils/compare-branches';
import { BucketState } from 'src/types/state';
import messages from './compare-branches-success-flag.i18n';

type Props = {
  id: ComponentFlagId;
  action: 'sync' | 'merge';
  sourceBranchName: string;
  destinationBranchName: string;
  intl: InjectedIntl;
};

const SuccessFlag = ({
  intl,
  id,
  action,
  sourceBranchName,
  destinationBranchName,
  ...otherProps
}: Props) => (
  <AutoDismissFlag
    {...otherProps}
    id={id}
    icon={<SuccessIcon label="success" primaryColor={colors.G300} />}
    title={intl.formatMessage(messages[action].compareBranchesSuccessTitle)}
    description={
      <FormattedMessage
        {...messages[action].compareBranchesSuccessDescription}
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
  };
};

export const CompareBranchesSuccessFlag = compose<any, any, any>(
  injectIntl,
  connect(mapStateToProps)
)(SuccessFlag);
