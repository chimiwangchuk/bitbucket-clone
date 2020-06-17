import { gridSize } from '@atlaskit/theme';

const NAV_NEXT_GLOBAL_NAV_WIDTH = gridSize() * 8; // @atlaskit/navigation-next does not export this

// Ak Navigation widths copied from @atlaskit/navigation because they can't be imported
const pagePadding = gridSize() * 5 * 2;

export const STICKY_FILE_HEIGHT = 42;
export const STICKY_HEADER_HEIGHT_OFFSET = 54;

// Ak Navigation widths are copied from @atlaskit/navigation-next because they can't be imported
const navNextGlobalNavWidth = gridSize() * 8;
const navNextClosedWidth = navNextGlobalNavWidth + gridSize() * 2.5;

export const calculateOffsetForNavNext = (
  isNavigationOpen: boolean,
  isMobileHeaderActive: boolean,
  isHorizontalNavEnabled: boolean,
  sidebarWidth: number,
  productNavWidth: number
) => {
  let offset;

  if (isNavigationOpen && isMobileHeaderActive) {
    return 0;
  }

  if (isNavigationOpen) {
    const navNextOpenWidth = navNextGlobalNavWidth + productNavWidth;
    offset = navNextOpenWidth;
  } else {
    offset = navNextClosedWidth;
  }

  offset += sidebarWidth;
  offset += pagePadding;

  if (isHorizontalNavEnabled) {
    // The horizontal nav moves the "global" nav blue bar to the top of the screen into a
    // horizontal white bar, so if hirzontal nav is enabled the blue bar width is not relevant
    // when calculating the sticky header x-offset.
    offset -= NAV_NEXT_GLOBAL_NAV_WIDTH;
  }

  return offset;
};
