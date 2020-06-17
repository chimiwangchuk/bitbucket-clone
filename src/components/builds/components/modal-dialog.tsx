import ModalDialog, {
  HeaderComponentProps,
  ModalHeader,
} from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { colors } from '@atlaskit/theme';
import React, { ReactNode } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import i18n from '../i18n';
import * as styles from '../styles';

interface DialogHeaderProps extends HeaderComponentProps {
  intl: InjectedIntl;
}

const DialogHeader = injectIntl(
  React.memo((props: DialogHeaderProps) => {
    const { onClose, intl } = props;

    return (
      <ModalHeader>
        <styles.DialogTitle>
          {intl.formatMessage(i18n.buildSummaryDialogHeading)}
          <Button
            onClick={onClose}
            appearance="subtle"
            spacing="none"
            iconBefore={
              <EditorCloseIcon
                label={intl.formatMessage(i18n.buildDialogCloseButton)}
                primaryColor={colors.N800}
              />
            }
          />
        </styles.DialogTitle>
      </ModalHeader>
    );
  })
);

type BuildStatusModalDialogProps = {
  children: ReactNode;
  onClose: () => void;
};

export const BuildStatusModalDialog = React.memo(
  (props: BuildStatusModalDialogProps) => (
    <ModalDialog
      onClose={props.onClose}
      components={{
        Header: DialogHeader,
        Container: styles.DialogContainer,
      }}
    >
      {props.children}
    </ModalDialog>
  )
);
