import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';
import { ModalTitle } from '@atlaskit/modal-dialog';

const WRAP_MARGIN = gridSize() / 4;

export const BuildsContainer = styled.div`
  display: flex;
  flex-flow: column;
  padding: ${gridSize()}px;
`;

// Set `min-width: 0` on the flex child in order to support truncating text
// nested within: https://css-tricks.com/flexbox-truncated-text/
export const BuildInfo = styled.div`
  min-width: 0;
  padding: ${gridSize() / 4}px;
`;

export const BuildItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: ${gridSize()}px;
`;

export const BuildName = styled.div`
  display: inline-block;
  vertical-align: bottom;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: ${gridSize() / 2}px;
`;

export const BuildState = styled.div`
  flex: 0 0 auto;
  margin-right: ${gridSize()}px;
`;

export const BuildDescription = styled.small`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
  margin-top: ${WRAP_MARGIN}px;
  &::after {
    content: '\xb7';
    width: ${gridSize() * 2}px;
    display: inline-block;
    text-align: center;
  }
  &:empty::after {
    display: none;
  }
`;

export const BuildTime = styled.small`
  margin-top: ${WRAP_MARGIN}px;
`;

export const BuildDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: -${WRAP_MARGIN}px;
`;

export const DialogTitle = styled(ModalTitle)`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
export const DialogContainer = styled.div`
  padding-bottom: ${gridSize() * 1.75}px;
`;
