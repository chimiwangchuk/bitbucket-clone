import styled from '@emotion/styled';
import { colors, gridSize } from '@atlaskit/theme';
import { media } from '@atlassian/bitkit-responsive';

import ImageDiffContent from './image-diff-content';

export const TwoUp = styled.div`
  display: flex;

  ${media.upToLarge(`
    display: block;
  `)}
`;

export const ImageDiffContentCommon = styled(ImageDiffContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${gridSize() * 2}px;
  box-sizing: border-box;
`;

export const ImageDiffContentBefore = styled(ImageDiffContentCommon)`
  background: ${colors.R50};
  color: ${colors.R500};
`;

export const ImageDiffContentAfter = styled(ImageDiffContentCommon)`
  background: ${colors.G50};
  color: ${colors.G500};
`;
