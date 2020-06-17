import React from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import { connect } from 'react-redux';
import Flag, { AutoDismissFlag } from '@atlaskit/flag';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

import { ComponentFlagProps } from 'src/redux/flags/types';
import { CREATE_BRANCH_ERROR_TYPE } from 'src/sections/create-branch/constants';
import { CreateBranchError } from 'src/sections/create-branch/types';
import urls from 'src/urls/global';
import { BucketState } from 'src/types/state';
import messages from './create-branch-error-flag.i18n';

const errorMessage = (error: CreateBranchError) => {
  switch (error.type) {
    case CREATE_BRANCH_ERROR_TYPE.BRANCH_ALREADY_EXISTS:
    case CREATE_BRANCH_ERROR_TYPE.BRANCH_PERMISSION_VIOLATED:
    case CREATE_BRANCH_ERROR_TYPE.INVALID_BRANCH_NAME:
      // These errors are shown inlined with the branch name input field, so not showing any flag
      return null;
    case CREATE_BRANCH_ERROR_TYPE.INSUFFICIENT_RIGHTS:
      return (
        <FormattedMessage
          {...messages.insufficientRepoAccessRightsDescription}
        />
      );
    case CREATE_BRANCH_ERROR_TYPE.OTHER:
      // For these errors we simply show the message returned in API response
      return <span>{error.message}</span>;
    default:
    case CREATE_BRANCH_ERROR_TYPE.GENERIC:
      return (
        <FormattedMessage
          {...messages.genericErrorDescription}
          values={{
            supportLink: (
              <a target="_blank" href={urls.external.support}>
                <FormattedMessage {...messages.supportLink} />
              </a>
            ),
          }}
        />
      );
  }
};

type ErrorFlagProps = ComponentFlagProps & {
  error: any;
};

const ErrorFlag = injectIntl(
  ({ error, intl, ...otherProps }: ErrorFlagProps & { intl: InjectedIntl }) => {
    if (error) {
      const message = errorMessage(error);
      if (message) {
        return (
          <Flag
            {...otherProps}
            icon={<ErrorIcon label="error" primaryColor={colors.R300} />}
            title={intl.formatMessage(messages.createBranchErrorTitle)}
            description={errorMessage(error)}
          />
        );
      }
    }

    return null;
  }
);

const mapStateToProps = (state: BucketState) => {
  const { error } = state.createBranch;
  return { error };
};

export const CreateBranchErrorFlag = connect(mapStateToProps)(ErrorFlag);

type IntlFlagProps = ComponentFlagProps & { intl: InjectedIntl };

const LoadRepositoriesErrorFlagBase = ({ id, intl }: IntlFlagProps) => (
  <AutoDismissFlag
    id={id}
    icon={<ErrorIcon label="error" primaryColor={colors.R300} />}
    title={intl.formatMessage(messages.loadRepositoriesErrorTitle)}
    description={
      <FormattedMessage
        {...messages.genericErrorDescription}
        values={{
          supportLink: (
            <a target="_blank" href={urls.external.support}>
              <FormattedMessage {...messages.supportLink} />
            </a>
          ),
        }}
      />
    }
  />
);

export const LoadRepositoriesErrorFlag = injectIntl(
  LoadRepositoriesErrorFlagBase
);
