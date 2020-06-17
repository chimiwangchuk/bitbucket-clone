import { colors, gridSize, layers } from '@atlaskit/theme';
import styled from '@emotion/styled';

const TRANSITION_DURATION_BASE = 0.2;
const TRANSITION_DURATION = `${TRANSITION_DURATION_BASE}s`;

const SidebarAnimation = `
  transition: all ${TRANSITION_DURATION} ease-out;
`;

export const SidebarContainer = styled.section`
  overflow: hidden;
  width: 100%;
`;

export const Sidebar = styled.div<{ shouldAnimate: boolean }>`
  display: flex;
  min-width: 64px;
  height: 100%;
  width: 100%;
  background-color: ${colors.N20};
  ${({ shouldAnimate }) => (shouldAnimate ? SidebarAnimation : null)};
  outline: none;
`;

export const SplitBar = styled.div`
  height: 100%;
  width: 100%;
  cursor: ew-resize;
  position: absolute;

  &::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 0;
    display: table;
    width: 2px;
    height: 100%;
  }

  &:hover::after,
  &:focus::after {
    background-color: ${colors.B200};
  }

  &:active::after {
    background-color: ${colors.B200};
  }
`;

export const ExpandedSidebar = styled.div<{ isVisible: boolean }>`
  box-sizing: border-box;
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  flex-direction: column;
  padding: 0 ${gridSize() * 1.5}px;
`;

export const CollapsedSidebar = styled.div<{ isVisible: boolean }>`
  box-sizing: border-box;
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  flex-direction: column;
  padding: 12px;
`;

export const SidebarContent = styled.div`
  margin-right: -17px;
  overflow-y: scroll;
  padding-right: 17px;

  &::after {
    content: '';
    display: block;
    height: ${gridSize() * 8}px;
  }
`;

export const SidebarChild = styled.div`
  margin-top: 12px;
  text-align: center;
  &:empty {
    margin-top: 0;
  }
`;

// The z-index here is set to 100 to be greater
// than the number of cards in the sidebar.
// see: src/components/sidebar/src/utils/wrap-child.js
export const SidebarControls = styled.div`
  position: absolute;
  left: -8px;
  top: 0;
  height: 100%;
  width: 12px;
  user-select: none;
  z-index: ${layers.card()};
`;

/* stylelint-disable a11y/media-prefers-reduced-motion */
export const Arrow = styled.button<{ isCollapsed: boolean }>`
  background: none;
  border: none;
  opacity: 0;
  position: absolute;
  top: 50%;
  width: ${gridSize() * 2}px;
  left: -${gridSize() * 1.5}px;
  padding-right: ${gridSize()}px;
  cursor: pointer;

  &::-moz-focus-inner {
    border: 0;
  }

  &:focus {
    box-shadow: 0 0 0 2px ${colors.B100};
    outline: none;
  }

  /* In order to get rid of explicit definition of
   classnames ::before and ::after pseudo elements are used. */
  &::before,
  &::after {
    content: '';
    display: block;
    position: relative;
    margin-right: 0;
    margin-left: auto;
    width: 2px;
    height: 8px;
    background-color: ${colors.B200};
    border-radius: 5px;
    transition: all 0.15s ease-out;
    transform: rotate(0deg);
  }

  &::before {
    top: 2px;
    transform-origin: 1px 6px;
  }

  &::after {
    top: 0;
    transform-origin: 1px 2px;
  }

  &:hover,
  &:focus {
    opacity: 1;

    &::before {
      /* prettier-ignore */
      transform:
        rotate(
          ${({ isCollapsed }) => (isCollapsed ? '45deg' : '-45deg')}
        );
    }

    &::after {
      /* prettier-ignore */
      transform:
        rotate(
          ${({ isCollapsed }) => (isCollapsed ? '-45deg' : '45deg')}
        );
    }
  }

  /* stylelint-disable selector-type-no-unknown, a11y/selector-pseudo-class-focus */
  ${SidebarControls}:hover & {
    opacity: 1;
    transition: all ${TRANSITION_DURATION} ease-out;
  }
  /* stylelint-enable */
`;
/* stylelint-enable */
