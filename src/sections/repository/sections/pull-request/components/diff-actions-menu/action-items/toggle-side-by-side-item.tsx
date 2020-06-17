import React from 'react';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import { FormattedMessage } from 'react-intl';

import { ResponsiveSideBySideModeDisabledTooltip } from '../../responsive-side-by-side-mode-disabled-tooltip';
import messages from '../../diff.i18n';

type Props = {
  onSideBySide: () => void;
  isSideBySide: boolean;
};

export const ToggleSideBySideItem: React.FC<Props> = ({
  onSideBySide,
  isSideBySide,
}) => (
  <ResponsiveSideBySideModeDisabledTooltip position="top">
    {(isSideBySideModeDisabled: boolean) => (
      <DropdownItem
        data-qa="pr-diff-file-side-by-side"
        key="file-actions-menu-sbs"
        onClick={onSideBySide}
        isDisabled={isSideBySideModeDisabled}
      >
        {isSideBySide ? (
          <FormattedMessage {...messages.unifiedDiff} />
        ) : (
          <FormattedMessage {...messages.sideBySide} />
        )}
      </DropdownItem>
    )}
  </ResponsiveSideBySideModeDisabledTooltip>
);
