import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const PULL_REQUEST_DETAILS_PADDING_BOTTOM = gridSize() * 32;

export const PullRequest = styled.main`
  padding-bottom: ${PULL_REQUEST_DETAILS_PADDING_BOTTOM}px;
`;
