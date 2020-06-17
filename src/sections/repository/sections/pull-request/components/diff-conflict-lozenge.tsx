import React from 'react';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';
import { FormattedMessage } from 'react-intl';

import messages from './diff-conflict-lozenge.i18n';

type Props = {
  conflictMessage: string;
};

export const DiffConflictLozenge = ({ conflictMessage }: Props) => {
  return (
    <Tooltip content={conflictMessage} position="bottom">
      <Lozenge appearance="moved" isBold>
        <FormattedMessage {...messages.conflictedLabel} />
      </Lozenge>
    </Tooltip>
  );
};
