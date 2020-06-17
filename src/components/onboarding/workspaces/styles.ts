import { gridSize, colors } from '@atlaskit/theme';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

export const ModalBody = styled.div`
  text-align: center;
  padding: ${gridSize() * 4}px 0 ${gridSize() * 2}px;
`;

export const HeaderWrapper = styled.div`
  position: relative;
  line-height: 0;
  margin-bottom: ${gridSize() * 2}px;
`;

type AbsWrapperProps = {
  top?: number;
  bottom?: number;
  width?: number;
  height?: number;
};

export const AbsWrapper = styled.div<AbsWrapperProps>`
  position: absolute;
  ${({ top }) =>
    top &&
    css`
      top: ${top}px;
    `}
  ${({ bottom }) =>
    bottom &&
    css`
      bottom: ${bottom}px;
    `}
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
      left: calc(50% - ${width / 2}px);
    `}
  ${({ height }) =>
    height &&
    css`
      height: ${height}px;
    `}
`;

export const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${gridSize() * 4}px;
`;

export const FooterWrapper = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${gridSize() * 4}px;
`;

export const FooterWrapperAlignCenter = styled(FooterWrapper)`
  justify-content: center;
  > * {
    margin: 0 ${gridSize() / 2}px;
  }
`;

export const Step = styled.div`
  color: ${colors.subtleText};
`;
