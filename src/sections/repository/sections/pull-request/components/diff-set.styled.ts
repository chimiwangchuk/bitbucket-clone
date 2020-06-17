import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';
import { STICKY_HEADER_HEIGHT_OFFSET } from './utils/calculate-header-offset';
import { PULL_REQUEST_DETAILS_PADDING_BOTTOM } from './pull-request-details.style';

export const DiffSetFileWrapper = styled.div<{
  isSingleFileModeActive: boolean;
}>`
  position: relative;
  ${({ isSingleFileModeActive }) =>
    isSingleFileModeActive
      ? // For single file mode, we want the file to be nearly as tall as the window, so that when
        // we scroll to the file, the top of the file ends up being next to the sticky header.
        css`
          min-height: calc(
            100vh - ${STICKY_HEADER_HEIGHT_OFFSET}px -
              ${PULL_REQUEST_DETAILS_PADDING_BOTTOM}px
          );
        `
      : css`
          margin-bottom: ${gridSize() * 1.5}px;
        `}
`;

// This top offset is a short-term fix to line
// the anchors up just below the sticky header
export const ScrollToAnchor = styled.div<{ topOffset: number }>`
  position: absolute;
  top: -${({ topOffset }) => topOffset + STICKY_HEADER_HEIGHT_OFFSET}px;
  left: 0;
`;

export const SettingsHeader = styled.div`
  align-items: center;
  display: flex;
  font-weight: bold;
  justify-content: space-between;
  margin-bottom: ${gridSize() * 2}px;
  margin-top: 0;
`;

export const GroupedSpan = styled.span`
  display: flex;
`;
