import styled from '@emotion/styled';
import { layers, gridSize } from '@atlaskit/theme';

export const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding-top: ${gridSize() * 7}px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  pointer-events: none;
  background: white;
  opacity: 0.5;
  z-index: ${layers.card() + 10};
`;
