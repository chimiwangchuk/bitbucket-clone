import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { AutoDismissFlag } from '@atlaskit/flag';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';
import { ComponentFlagId } from 'src/redux/flags/types';
import { getCompareBranchesDialogSlice } from 'src/redux/branches';
import { BucketState } from 'src/types/state';
import messages from './compare-branches-timeout-flag.i18n';

type Props = {
  id: ComponentFlagId;
  action: 'sync' | 'merge';
  intl: InjectedIntl;
};

const TimeoutFlag = ({ intl, id, action, ...otherProps }: Props) => (
  <AutoDismissFlag
    {...otherProps}
    id={id}
    icon={<WarningIcon label="warning" primaryColor={colors.Y300} />}
    title={intl.formatMessage(messages[action].compareBranchesTimeoutTitle)}
    description={
      <FormattedMessage
        {...messages[action].compareBranchesTimeoutDescription}
      />
    }
    actions={[
      {
        content: intl.formatMessage(
          messages[action].compareBranchesTimeoutAction
        ),
        onClick: () => window.location.reload(),
      },
    ]}
  />
);

const mapStateToProps = (state: BucketState) => {
  const { isMerge } = getCompareBranchesDialogSlice(state);
  return {
    action: isMerge ? 'merge' : 'sync',
  };
};

export const CompareBranchesTimeoutFlag = compose<any, any, any>(
  injectIntl,
  connect(mapStateToProps)
)(TimeoutFlag);
