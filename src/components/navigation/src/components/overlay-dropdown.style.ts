import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { colors } from '@atlaskit/theme';

export const Root = styled.div`
  position: relative;
  overflow-x: hidden;
  text-align: left;
  font-size: 14px;
`;

export const animateLeft = keyframes`
  from { left: 100%; }
  to { left:0; }
`;

export const animateRight = keyframes`
  from { left: 0; }
  to { left: 100%; }
`;

export const NotificationDotParent = styled.div`
  position: relative;
`;

export const NotificationDot = styled.span<{ parentColor: string }>`
  display: block;
  width: 8px;
  height: 8px;
  background-color: ${colors.P100};
  position: absolute;
  top: -2px;
  right: -2px;
  border-radius: 8px;
  border: 3px solid ${props => props.parentColor};
`;

/* remove this disable once https://github.com/YozhikM/stylelint-a11y/issues/38 is addressed */
/* stylelint-disable a11y/media-prefers-reduced-motion */
export const OverlayPanel = styled.div<{ isShown: boolean }>`
  position: absolute;
  top: 0;
  left: ${props => (props.isShown ? '0' : '100%')};
  height: 100%;
  width: 100%;
  background: white;
  animation: ${props => (props.isShown ? animateLeft : animateRight)} 0.15s
    ease-out;
  display: flex;
  flex-direction: column;

  @media screen and (prefers-reduced-motion: reduce) {
    /* https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/ */
    animation-duration: 0.001ms;
    animation-iteration-count: 1;
  }
`;
/* stylelint-enable */

export const OverlayHeader = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  border-bottom: 1px solid ${colors.N30A};
  padding: 6px;
  text-transform: uppercase;
  font-size: 12px;
  color: ${colors.N200};
  flex: 0 0 auto;
`;

export const PostsWrapper = styled.div<{ isAkDropdown?: boolean }>`
  ${({ isAkDropdown }) => isAkDropdown && `max-height: 470px;`}
  overflow-y: auto;
  flex: 1 1 auto;
`;
