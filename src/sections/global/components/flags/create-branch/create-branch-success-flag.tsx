import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import Tag from '@atlaskit/tag';
import { AutoDismissFlag } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { colors } from '@atlaskit/theme';
import { Branch } from 'src/components/types';
import { ComponentFlagId } from 'src/redux/flags/types';
import { BucketState } from 'src/types/state';
import messages from './create-branch-success-flag.i18n';

type Props = {
  id: ComponentFlagId;
  intl: InjectedIntl;
  branch: Branch | null | undefined;
};

const SuccessFlag = ({ id, branch, intl, ...otherProps }: Props) => {
  if (!branch) {
    return null;
  }

  return (
    <AutoDismissFlag
      {...otherProps}
      id={id}
      icon={<SuccessIcon label="Success" primaryColor={colors.G300} />}
      title={intl.formatMessage(messages.createBranchSuccessTitle)}
      description={
        <FormattedMessage
          {...messages.createBranchSuccessDescription}
          values={{ branchLabel: <Tag text={branch.name} /> }}
        />
      }
      actions={[
        {
          content: (
            <a href={branch.links.html.href}>
              <FormattedMessage {...messages.createBranchSuccessLinkText} />
            </a>
          ),
          onClick: () => {},
        },
      ]}
    />
  );
};

const mapStateToProps = (state: BucketState) => {
  const {
    successFlag: { branch },
  } = state.createBranch;
  return { branch };
};

export const CreateBranchSuccessFlag = connect(mapStateToProps)(
  injectIntl(SuccessFlag)
);
