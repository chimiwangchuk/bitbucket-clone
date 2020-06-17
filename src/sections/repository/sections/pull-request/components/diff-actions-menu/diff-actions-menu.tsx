import React, { ReactNode, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { noop } from 'lodash-es';
import MoreIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
// @ts-ignore TODO: upgrade package once AK provides types to fix noImplicitAny error here
import { ItemGroup } from '@atlaskit/item';
import { colors } from '@atlaskit/theme';
import styled from '@emotion/styled';
import { useIntl } from 'src/hooks/intl';
import { OPEN_FILE_COMMENT } from 'src/redux/pull-request/actions';
import { viewEntireFile } from 'src/redux/pull-request/view-entire-file-reducer';
import { getIsViewEntireFileEnabled } from 'src/selectors/feature-selectors';
import { getCurrentUserIsAnonymous } from 'src/selectors/user-selectors';
import { BucketState } from 'src/types/state';
import messages from '../diff.i18n';
import CollapseAllDropdownItem from './collapse-all-dropdown-item';
import ExpandAllDropdownItem from './expand-all-dropdown-item';
import { ToggleSideBySideItem } from './action-items/toggle-side-by-side-item';
import { ViewSourceItem } from './action-items/view-source-item';

const ItemGroupWrapper = styled.div`
  border-bottom: 1px solid ${colors.N40};

  &:last-child {
    border-bottom: none;
  }
`;

type DiffActionsItemGroupProps = {
  children: ReactNode;
  title?: string;
};

const DiffActionsItemGroup = React.memo((props: DiffActionsItemGroupProps) => {
  const { children, title } = props;

  // We want a DropdownItemGroup without a visible `title`
  // `DropdownItemGroup` only supports `aria-label` via the `title` prop
  return (
    <ItemGroupWrapper>
      <ItemGroup label={title} role="menu">
        {children}
      </ItemGroup>
    </ItemGroupWrapper>
  );
});

type OwnProps = {
  filepath: string;
  isDeleted?: boolean;
  isSideBySide?: boolean;
  onAddComment?: () => void;
  onDiffActionsMenuClicked?: (e: { isOpen: boolean }) => void;
  onSideBySide?: () => void;
};

type StateProps = {
  isAnonymousUser: boolean;
  isViewEntireFileEnabled: boolean;
};

type DiffActionsMenuProps = OwnProps & StateProps;

const DiffActionsMenu = React.memo(
  ({
    filepath,
    onAddComment = noop,
    onDiffActionsMenuClicked,
    onSideBySide,
    isDeleted,
    isSideBySide,
    isAnonymousUser,
    isViewEntireFileEnabled = false,
  }: DiffActionsMenuProps) => {
    const intl = useIntl();
    const dispatch = useDispatch();

    const handleAddComment = useCallback(() => {
      dispatch({ type: OPEN_FILE_COMMENT, payload: filepath });
      onAddComment();
    }, [onAddComment, filepath, dispatch]);

    const handleViewEntireFile = useCallback(() => {
      dispatch(viewEntireFile(filepath));
    }, [filepath, dispatch]);

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
        onOpenChange={onDiffActionsMenuClicked}
      >
        <DiffActionsItemGroup title={intl.formatMessage(messages.thisFile)}>
          {onSideBySide && (
            <ToggleSideBySideItem
              onSideBySide={onSideBySide}
              isSideBySide={!!isSideBySide}
            />
          )}
          {isViewEntireFileEnabled && (
            <DropdownItem
              data-qa="pr-diff-file-view-entire-file"
              key="file-actions-menu-view-entire-file"
              onClick={handleViewEntireFile}
            >
              <FormattedMessage {...messages.viewEntireFile} />
            </DropdownItem>
          )}
          <ViewSourceItem isDeleted={isDeleted} filepath={filepath} />
          {!isAnonymousUser && (
            <DropdownItem
              data-qa="pr-diff-file-comment"
              key="file-actions-menu-comment"
              onClick={handleAddComment}
            >
              <FormattedMessage {...messages.comment} />
            </DropdownItem>
          )}
        </DiffActionsItemGroup>
        <DiffActionsItemGroup title={intl.formatMessage(messages.allFiles)}>
          <CollapseAllDropdownItem key="file-actions-menu-collapse-all">
            <FormattedMessage {...messages.collapseAll} />
          </CollapseAllDropdownItem>
          <ExpandAllDropdownItem key="file-actions-menu-expand-all">
            <FormattedMessage {...messages.expandAll} />
          </ExpandAllDropdownItem>
        </DiffActionsItemGroup>
      </DropdownMenu>
    );
  }
);

export const BaseDiffActionsMenu = injectIntl(DiffActionsMenu);

const mapStateToProps = (state: BucketState): StateProps => ({
  isAnonymousUser: getCurrentUserIsAnonymous(state),
  isViewEntireFileEnabled: getIsViewEntireFileEnabled(state),
});

export const ConnectedDiffActionsMenu = connect<StateProps, OwnProps>(
  mapStateToProps
)(BaseDiffActionsMenu);
