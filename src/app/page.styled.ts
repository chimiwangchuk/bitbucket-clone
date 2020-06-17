import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { HORIZONTAL_GLOBAL_NAV_HEIGHT } from '@atlaskit/atlassian-navigation/dist/esm/common/constants';
import { BANNER_HEIGHT } from 'src/constants/navigation';

const pageWithSidebarStyles = css`
  display: flex;
  width: 100%;
  box-sizing: border-box;

  /* In right-to-left languages, keeps the sidebar on the right of the page content */
  &:dir(rtl) {
    flex-direction: row-reverse;
  }
`;

export const PageLayout = styled.div<{
  isMobileHeaderActive: boolean;
}>`
  ${({ isMobileHeaderActive }) => {
    // In a separate file the LayoutManager `experimental_horizontalGlobalNav` prop is applied
    // to force the nav-next component to hide itself (but remain mounted) when the mobile nav
    // is visible. Unfortunately setting the 'experimental_horizontalGlobalNav' prop causes
    // a `margin-top` to be applied, which would make sense if we were actually using the
    // horizontal nav, but since horizontal nav is not yet rolled out we negate the `margin-top`
    // here.
    return isMobileHeaderActive
      ? css`
          margin-top: -${HORIZONTAL_GLOBAL_NAV_HEIGHT}px;
        `
      : pageWithSidebarStyles;
  }}
`;

// Setting an explicit flex-basis here instead of 'auto' fixes IE 11 not
// correctly shrinking the child flex container for the page header.
// IE 11 requires a unit for the 3rd argument (flex basis).
// SEE: known issues on https://caniuse.com/#feat=flexbox
//
// NOTE: DO NOT set `overflow` on this or change `100%` to `100vh`.
// If you do you will cause a massive scroll performance regression.
// SEE: https://hello.atlassian.net/wiki/spaces/BB/blog/2019/02/14/399650562/Improving+Scroll+Performance+on+Bitbucket
export const Content = styled.div<{
  isBannerOpen?: boolean;
}>`
  flex: 1 1 0px; /* stylelint-disable-line length-zero-no-unit */
  min-width: 0;
  min-height: ${props =>
    props.isBannerOpen ? `calc(100% - ${BANNER_HEIGHT}px)` : '100%'};
`;
