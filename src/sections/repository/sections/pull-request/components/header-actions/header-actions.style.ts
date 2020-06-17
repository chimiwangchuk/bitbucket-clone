import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { gridSize } from '@atlaskit/theme';
import { media } from '@atlassian/bitkit-responsive';

const FLEX_WRAP_MARGIN = gridSize() * 2;

export const HeaderActions = styled.div`
  align-items: center;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;

  /* we need to compensate margin, so it will be visible only on wrap */
  margin-top: -${FLEX_WRAP_MARGIN}px;
`;

// `text-align: left;` is to work around an AK bug
// https://ecosystem.atlassian.net/projects/AK/queues/issue/AK-5837
export const Reviewers = styled.div<{ isHeaderSticky: boolean }>`
  margin-top: ${FLEX_WRAP_MARGIN}px;
  text-align: left;
  ${media.upToLarge(`
// @ts-ignore TODO: fix noImplicitAny error here
    ${({ isHeaderSticky }) =>
      isHeaderSticky &&
      css`
        display: none;
      `}
  `)};
`;

export const DropdownMenu = styled.div`
  text-align: initial;
`;

export const DropdownMenuContent = styled.div`
  min-width: ${gridSize() * 19}px;
`;

// when the buttons wrap to the next line on small
// screens, we want reviewers to right-align all the
// way to the edge so add the spacing here instead of
// to reviewers
export const HeaderActionsButtonWrapper = styled.div`
  margin-left: ${gridSize() * 2}px;
  margin-top: ${FLEX_WRAP_MARGIN}px;
`;
