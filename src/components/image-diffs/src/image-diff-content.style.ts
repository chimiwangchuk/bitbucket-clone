import styled from '@emotion/styled';
import { colors, gridSize } from '@atlaskit/theme';

const CHECKER = colors.N20;

export const Image = styled.img`
  margin: ${gridSize() * 2}px 0;
  border: 3px solid;
  border-radius: 3px;
  max-width: 60%;
  max-height: ${gridSize() * 65}px;
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;

  /* Checkerboard background effect */
  background-image: linear-gradient(45deg, ${CHECKER} 25%, transparent 25%),
    linear-gradient(-45deg, ${CHECKER} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${CHECKER} 75%),
    linear-gradient(-45deg, white 75%, ${CHECKER} 75%);
`;

export const Title = styled.div`
  text-transform: uppercase;
`;

export const Dimension = styled.span`
  & + &::before {
    content: ' | ';
    color: ${colors.N800};
  }
`;

export const DimensionKey = styled.strong`
  font-weight: 700;
  color: ${colors.N800};
`;

export const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
