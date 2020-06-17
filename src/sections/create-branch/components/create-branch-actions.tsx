import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button, { ButtonGroup } from '@atlaskit/button';

import { CREATE_BRANCH_FORM_ID } from '../constants';
import messages from './create-branch.i18n';

type CreateBranchActionsProps = {
  isLoading: boolean;
  onCreate: () => void;
  onCancel: () => void;
  isSaveDisabled: boolean;
  isCancelDisabled: boolean;
};

export const CreateBranchActions = ({
  isLoading,
  onCreate,
  onCancel,
  isSaveDisabled,
  isCancelDisabled,
}: CreateBranchActionsProps) => {
  return (
    <ButtonGroup>
      <Button
        id="create-branch-button"
        form={CREATE_BRANCH_FORM_ID}
        type="submit"
        appearance="primary"
        onClick={onCreate}
        isDisabled={isSaveDisabled}
        isLoading={isLoading}
      >
        <FormattedMessage {...messages.createButton} />
      </Button>
      <Button
        id="cancel-create-branch-button"
        appearance="subtle"
        onClick={onCancel}
        isDisabled={isCancelDisabled}
      >
        <FormattedMessage {...messages.cancelButton} />
      </Button>
    </ButtonGroup>
  );
};
