import React from 'react';
import DropdownMenu, { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { useIntl } from 'src/hooks/intl';
import messages from '../../diff.i18n';
import { ToggleSideBySideItem } from '../../diff-actions-menu/action-items/toggle-side-by-side-item';
import { ViewSourceItem } from '../../diff-actions-menu/action-items/view-source-item';
import { useDiffPreferences as useDiffPreferencesDI } from '../../../hooks/diffs';
import { useViewEntireFileState as useViewEntireFileStateDI } from '../hooks';

type Props = {
  path: string | null;
  isDeleted: boolean;
  useDiffPreferences: typeof useDiffPreferencesDI;
  useViewEntireFileState: typeof useViewEntireFileStateDI;
};

export const ActionsMenu: React.FC<Props> = ({
  path,
  isDeleted,
  useDiffPreferences = useDiffPreferencesDI,
  useViewEntireFileState = useViewEntireFileStateDI,
}) => {
  const intl = useIntl();
  const { diffFile } = useViewEntireFileState();
  const { isSideBySide, toggleIsSideBySide } = useDiffPreferences(diffFile);

  return (
    <DropdownMenu
      triggerType="button"
      position="bottom right"
      triggerButtonProps={{
        appearance: 'subtle',
        iconBefore: (
          <MoreIcon
            label={intl.formatMessage(messages.diffActionsButtonLabel)}
          />
        ),
      }}
    >
      <DropdownItemGroup>
        <ToggleSideBySideItem
          onSideBySide={toggleIsSideBySide}
          isSideBySide={isSideBySide}
        />
        {path && <ViewSourceItem filepath={path} isDeleted={isDeleted} />}
      </DropdownItemGroup>
    </DropdownMenu>
  );
};
