import styled from '@emotion/styled';
import { colors, gridSize } from '@atlaskit/theme';
import { media } from '@atlassian/bitkit-responsive';

const akPageBackgroundColor = colors.N0;
const akBorderColor = colors.N40;

export const StickyHeaderWrapper = styled.div`
  align-items: center;
  background-color: ${akPageBackgroundColor};
  border-bottom: 1px solid ${akBorderColor};
  box-sizing: border-box;
  display: flex;
  height: 56px;
  justify-content: space-between;
  padding: ${gridSize()}px 0;
  margin: 0 ${gridSize() * 5}px;
  width: 100%;

  /* stylelint-disable-next-line declaration-empty-line-before */
  ${media.upToSmall(`justify-content: flex-end;`)}
`;

export const StickyHeaderContent = styled.div<{ isHeaderSticky: boolean }>`
  display: flex;
  ${({ isHeaderSticky }) => isHeaderSticky && media.upToSmall(`display: none`)};
`;

export const StickyHeaderAvatar = styled.div`
  margin-right: ${gridSize() * 2}px;
  ${media.upToXXLarge(`display: none;`)}
`;

export const StickyHeaderBranchesAndState = styled.div`
  align-items: center;
  display: flex;
  ${media.upToXXLarge(`display: none;`)}
`;
