import RoomMenuIcon from '@atlaskit/icon/glyph/room-menu';
import Tooltip from '@atlaskit/tooltip';
import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';

import messages from 'src/app/sidebar/sidebar.i18n';
import Sidebar, { SidebarContent, ResizeProps } from 'src/components/sidebar';

import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_MIN_EXPANDED_WIDTH,
  SIDEBAR_MAX_EXPANDED_WIDTH,
} from '../constants';
import * as styles from './sidebar.style';

export type SidebarProps = {
  expandedWidth: number;
  collapsedContent: SidebarContent;
  expandedContent: SidebarContent;
  intl: InjectedIntl;
  isCollapsed: boolean;
  onResize: (props: ResizeProps) => void;
};

class GlobalSidebar extends PureComponent<SidebarProps> {
  static defaultProps = {
    expandedWidth: SIDEBAR_EXPANDED_WIDTH,
  };

  render() {
    const { intl } = this.props;
    const icon = (
      <Tooltip
        position="left"
        content={intl.formatMessage(messages.expandIconTooltip)}
      >
        <RoomMenuIcon label={intl.formatMessage(messages.expandIconTooltip)} />
      </Tooltip>
    );

    return (
      <styles.Container data-qa="sidebar-container">
        <Sidebar
          ariaLabel={intl.formatMessage(messages.sidebarLabel)}
          collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
          expandedWidth={this.props.expandedWidth}
          icon={icon}
          minExpandedWidth={SIDEBAR_MIN_EXPANDED_WIDTH}
          maxExpandedWidth={SIDEBAR_MAX_EXPANDED_WIDTH}
          resizable
          toggleButtonCollapseLabel={intl.formatMessage(
            messages.toggleButtonCollapseLabel
          )}
          toggleButtonExpandLabel={intl.formatMessage(
            messages.toggleButtonExpandLabel
          )}
          {...this.props}
        />
      </styles.Container>
    );
  }
}

export default injectIntl(GlobalSidebar);
