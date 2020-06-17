import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

import { overflowEllipsis } from 'src/styles/mixins';

export const JiraIssueWrapper = styled.div`
  padding-top: ${gridSize()}px;
  max-width: ${gridSize() * 110}px;
  overflow: hidden;
`;

export const JiraIssueInnerWrapper = styled.div`
  display: flex;
`;

export const JiraIssueKeyContainer = styled.div`
  padding-right: ${gridSize()}px;
  flex-shrink: 0;
`;

export const JiraIssueTypeIcon = styled.img`
  width: ${gridSize() * 2}px;
  height: ${gridSize() * 2.5}px;
  padding-right: ${gridSize()}px;
`;
export const JiraIssueInnerContainer = styled.div`
  display: flex;
  overflow: hidden;
`;

export const JiraIssueSummary = styled.div`
  ${overflowEllipsis()}
`;
