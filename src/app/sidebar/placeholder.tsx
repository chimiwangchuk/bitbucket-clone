import React, { useEffect, useContext } from 'react';
import { layers } from '@atlaskit/theme';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { getIsHorizontalNavEnabled } from 'src/selectors/feature-selectors';
import { getCombinedBannerAndHorizontalNavHeight } from 'src/selectors/global-selectors';
import { BucketState } from 'src/types/state';

import { SidebarContext } from './context';

// TODO add polyfill for position: sticky
// https://softwareteams.atlassian.net/browse/BBCDEV-10779
const Container = styled.div<{
  topOffset: number;
  isHorizontalNavEnabled: boolean;
}>`
  display: flex;

  /* Changing this to 100% causes sticky header cells of panels to not work. */
  height: calc(100vh - ${props => props.topOffset}px);
  justify-content: flex-end;
  position: sticky;
  top: ${props => props.topOffset}px;
  z-index: ${({ isHorizontalNavEnabled }) =>
    isHorizontalNavEnabled ? layers.layer() : layers.blanket()};
`;

type SidebarPlaceholderProps = {
  isBeingRenderedInsideMobileNav: boolean;
};

// The mobile sidebar is not always rendered, so we need to trigger a re-render
// of the Sidebar component when this component becomes rendered
export const SidebarPlaceholder: React.FC<SidebarPlaceholderProps> = ({
  isBeingRenderedInsideMobileNav,
}: SidebarPlaceholderProps) => {
  const sidebarContext = useContext(SidebarContext);

  useEffect(() => {
    sidebarContext.renderSidebar();
    // intentionally empty useEffect deps to simulate componentDidMount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isHorizontalNavEnabled = useSelector(getIsHorizontalNavEnabled);
  const topOffset = useSelector((state: BucketState) =>
    getCombinedBannerAndHorizontalNavHeight(
      state,
      isBeingRenderedInsideMobileNav
    )
  );

  return (
    <Container
      id="bb-sidebar"
      isHorizontalNavEnabled={isHorizontalNavEnabled}
      topOffset={topOffset}
    />
  );
};
