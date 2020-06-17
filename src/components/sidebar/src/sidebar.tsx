import React, { PureComponent } from 'react';

import { stopPropagation } from '../utils/events';
import * as styles from './styles';
import { ResizeProps, SidebarContent } from './types';

import SidebarCollapsed from './sidebar-collapsed';
import SidebarExpanded from './sidebar-expanded';
import SplitBar from './split-bar';

export type SidebarProps = {
  ariaLabel?: string;
  collapsedContent: SidebarContent;
  collapsedWidth: number;
  expandedContent: SidebarContent;
  expandedWidth: number;
  icon?: JSX.Element;
  isCollapsed: boolean;
  maxExpandedWidth: number;
  minExpandedWidth: number;
  onResize: (props: ResizeProps) => void;
  resizable?: boolean;
  toggleButtonCollapseLabel: string;
  toggleButtonExpandLabel: string;
};

export type SidebarState = {
  isCollapsed: boolean;
  shouldAnimate: boolean;
  width: number;
};

function createChildWrapper(
  keyPrefix: 'collapsed' | 'expanded',
  onToggle?: () => void
) {
  return (
    sidebarCard: JSX.Element,
    sidebarIndex: number,
    allSidebarCards: JSX.Element[]
  ) => {
    // reverse the "natural" z-index stacking order to allow InlineMessage components
    // in card titles to overlap cards below them
    const zIndex = allSidebarCards.length - sidebarIndex;

    return (
      <styles.SidebarChild
        key={`${keyPrefix}-${sidebarIndex}`}
        onClick={keyPrefix === 'expanded' ? stopPropagation : onToggle}
        style={{ zIndex }}
      >
        {sidebarCard}
      </styles.SidebarChild>
    );
  };
}

export default class Sidebar extends PureComponent<SidebarProps, SidebarState> {
  static defaultProps = {
    collapsedContent: [],
    collapsedWidth: 64,
    expandedContent: [],
    expandedWidth: 264,
    isCollapsed: false,
    maxExpandedWidth: 800,
    minExpandedWidth: 200,
    onResize: () => {},
    resizable: true,
  };

  state = {
    isCollapsed: this.props.isCollapsed,
    shouldAnimate: true,
    width: this.props.isCollapsed
      ? this.props.collapsedWidth
      : this.props.expandedWidth,
  };

  UNSAFE_componentWillReceiveProps(nextProps: SidebarProps) {
    if (this.state.isCollapsed !== nextProps.isCollapsed) {
      this.toggleSidebar(nextProps.isCollapsed);
    }
  }

  fireOnResize() {
    const { isCollapsed, width } = this.state;
    this.props.onResize({ isCollapsed, width });
  }

  handleToggleSidebar = () => {
    this.toggleSidebar();
  };

  handleResize = (offset: number) => {
    this.setState(oldState => {
      const { collapsedWidth, maxExpandedWidth, minExpandedWidth } = this.props;
      let newWidth = oldState.width + offset;

      const isCollapsed = newWidth < minExpandedWidth;

      if (newWidth > maxExpandedWidth) {
        newWidth = maxExpandedWidth;
      }

      if (newWidth < collapsedWidth) {
        newWidth = collapsedWidth;
      }
      return { isCollapsed, shouldAnimate: false, width: newWidth };
    });
  };

  handleResizeComplete = () => {
    this.setState(oldState => {
      const { width } = oldState;
      const { collapsedWidth, minExpandedWidth } = this.props;
      const newWidth = width < minExpandedWidth ? collapsedWidth : width;
      return { shouldAnimate: true, width: newWidth };
    }, this.fireOnResize);
  };

  toggleSidebar(isCollapsed?: boolean) {
    this.setState(oldState => {
      const { collapsedWidth, expandedWidth } = this.props;
      const newIsCollapsed =
        isCollapsed !== undefined ? isCollapsed : !oldState.isCollapsed;
      const newWidth = newIsCollapsed ? collapsedWidth : expandedWidth;
      return { isCollapsed: newIsCollapsed, width: newWidth };
    }, this.fireOnResize);
  }

  render() {
    const { isCollapsed } = this.state;
    const {
      toggleButtonCollapseLabel,
      toggleButtonExpandLabel,
      ariaLabel,
    } = this.props;

    return (
      <styles.SidebarContainer aria-label={ariaLabel}>
        <styles.SidebarControls>
          <styles.Arrow
            aria-label={
              isCollapsed ? toggleButtonExpandLabel : toggleButtonCollapseLabel
            }
            aria-expanded={!isCollapsed}
            isCollapsed={isCollapsed}
            onClick={this.handleToggleSidebar}
            role="button"
            data-testid={
              isCollapsed ? 'expand-sidebar-button' : 'collapse-sidebar-button'
            }
          />
          {this.props.resizable ? (
            <SplitBar
              onClick={this.handleToggleSidebar}
              onResize={this.handleResize}
              onResizeComplete={this.handleResizeComplete}
            />
          ) : null}
        </styles.SidebarControls>
        <styles.Sidebar
          tabIndex={-1}
          shouldAnimate={this.state.shouldAnimate}
          style={{ width: this.state.width }}
        >
          <styles.SidebarContent>
            <SidebarCollapsed
              isVisible={isCollapsed}
              icon={this.props.icon}
              onToggle={this.handleToggleSidebar}
              width={this.state.width}
            >
              {this.props.collapsedContent.map(
                createChildWrapper('collapsed', this.handleToggleSidebar)
              )}
            </SidebarCollapsed>
            <SidebarExpanded isVisible={!isCollapsed} width={this.state.width}>
              {this.props.expandedContent.map(createChildWrapper('expanded'))}
            </SidebarExpanded>
          </styles.SidebarContent>
        </styles.Sidebar>
      </styles.SidebarContainer>
    );
  }
}
