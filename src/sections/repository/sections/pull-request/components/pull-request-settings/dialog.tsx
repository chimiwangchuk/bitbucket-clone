import ModalDialog from '@atlaskit/modal-dialog';
import { ActionProps } from '@atlaskit/modal-dialog/dist/esm/types';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from 'src/hooks/intl';
import commonMessages from 'src/i18n/common';
import {
  getIsPullRequestSettingsDialogLoading,
  toggleSettingsDialog,
} from 'src/redux/pull-request-settings';
import { getIsPrAnnotationsEnabled } from 'src/selectors/feature-selectors';
import { BucketState } from 'src/types/state';

import { DiffViewModeField } from './diff-view-mode-field';
import { IgnoreWhitespaceField } from './ignore-whitespace-field';
import { PullRequestSettingsForm } from './pull-request-settings-form';
import { WordDiffField } from './word-diff-field';
import { AnnotationsField } from './annotations-field';
import { ColorBlindModeField } from './color-blind-mode-field';
import messages from './i18n';

const componentOverrides = {
  Container: PullRequestSettingsForm,
};

export const PullRequestSettingsDialog = React.memo(() => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const isLoading = useSelector<BucketState, boolean>(
    getIsPullRequestSettingsDialogLoading
  );

  const isPrAnnotationsEnabled = useSelector<BucketState, boolean>(
    getIsPrAnnotationsEnabled
  );

  const handleClose = useCallback(() => dispatch(toggleSettingsDialog(false)), [
    dispatch,
  ]);

  const actions: ActionProps[] = useMemo(
    () => [
      {
        appearance: 'subtle',
        isDisabled: isLoading,
        onClick: handleClose,
        text: intl.formatMessage(commonMessages.cancel),
      },
      {
        appearance: 'primary',
        isDisabled: isLoading,
        isLoading,
        text: intl.formatMessage(commonMessages.save),
        type: 'submit',
      },
    ],
    [handleClose, intl, isLoading]
  );

  return (
    <ModalDialog
      actions={actions}
      components={componentOverrides}
      heading={intl.formatMessage(messages.modalHeading)}
      onClose={handleClose}
      shouldCloseOnEscapePress={!isLoading}
      shouldCloseOnOverlayClick={!isLoading}
      width="small"
    >
      <DiffViewModeField autoFocus isDisabled={isLoading} />
      <IgnoreWhitespaceField isDisabled={isLoading} />
      <WordDiffField isDisabled={isLoading} />
      <ColorBlindModeField isDisabled={isLoading} />
      {isPrAnnotationsEnabled ? (
        <AnnotationsField isDisabled={isLoading} />
      ) : null}
    </ModalDialog>
  );
});
