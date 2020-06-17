import { gridSize, colors, borderRadius } from '@atlaskit/theme';
import styled from '@emotion/styled';
import { media } from '@atlassian/bitkit-responsive';

import { overflowEllipsis } from 'src/styles/mixins';

const originalTagMaxWidth = '180px';
const smallTagMaxWidth = '80px';
const mergePrDialogBranchNameMaxWidth = '97%';

export const BranchText = styled.span<{ isFluidWidth: boolean }>`
  background: ${colors.N20};
  border-radius: ${borderRadius()}px;
  color: ${colors.N500};
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  padding: ${gridSize() / 2}px ${gridSize()}px;
  vertical-align: middle;

  ${props =>
    props.isFluidWidth
      ? overflowEllipsis(mergePrDialogBranchNameMaxWidth)
      : overflowEllipsis(originalTagMaxWidth)}

  ${props =>
    props.isFluidWidth
      ? media.upToSmall(`
    font-size: 10px;
  `)
      : media.upToSmall(`
    font-size: 10px;
    max-width: ${smallTagMaxWidth};
  `)}
`;
