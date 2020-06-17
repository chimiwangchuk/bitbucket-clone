import ModalDialog from '@atlaskit/modal-dialog';
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useIntl } from 'src/hooks/intl';

import diffMessages from './diff.i18n';

type DialogConfig = {
  message: FormattedMessage.MessageDescriptor;
  onCancelDiscard?: () => void;
  onConfirmDiscard: () => void;
};

export const useDiscardCommentsDialogState = () => {
  const [config, setConfig] = useState<DialogConfig | null>(null);

  const confirmDiscardComments = useCallback(
    (cfg: DialogConfig) => setConfig(cfg),
    []
  );

  const onCancel = useCallback(() => {
    config?.onCancelDiscard?.();
    setConfig(null);
  }, [config]);

  const onDiscard = useCallback(() => {
    if (!config) {
      return;
    }
    config.onConfirmDiscard();
    setConfig(null);
  }, [config]);

  const dialogProps: Props = {
    children: config ? (
      <FormattedMessage {...config.message} tagName="p" />
    ) : null,
    onCancel,
    onDiscard,
  };

  return { confirmDiscardComments, dialogProps, isDialogOpen: !!config };
};

type Props = {
  children: React.ReactNode;
  onDiscard: () => void;
  onCancel: () => void;
};

const DiscardCommentsDialog = React.memo((props: Props) => {
  const intl = useIntl();
  const { onDiscard, onCancel, children } = props;

  const actions = [
    {
      onClick: onDiscard,
      text: intl.formatMessage(diffMessages.discardCommentsModalDiscardButton),
    },
    {
      onClick: onCancel,
      text: intl.formatMessage(diffMessages.discardCommentsModalCancelButton),
    },
  ];

  return (
    <ModalDialog
      appearance="danger"
      heading={intl.formatMessage(diffMessages.discardCommentsModalTitle)}
      width="small"
      actions={actions}
      onClose={onCancel}
    >
      {children}
    </ModalDialog>
  );
});

export default DiscardCommentsDialog;
