import React from 'react';
import { FormattedMessage } from 'react-intl';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import * as styles from 'src/sections/global/components/page.style';
import messages from './attachments-panel.i18n';

export default function AttachmentPanelHeader({
  count,
  hasError,
}: {
  count: number;
  hasError: boolean;
}) {
  return (
    <styles.PanelHeader>
      <FormattedMessage
        {...messages.attachmentPanelHeader}
        values={{ count, hasError }}
      />
      {hasError && (
        <Tooltip
          tag="span"
          content={
            <FormattedMessage {...messages.loadAttachmentsGenericError} />
          }
        >
          <WarningIcon primaryColor={colors.Y300} label="" />
        </Tooltip>
      )}
    </styles.PanelHeader>
  );
}
