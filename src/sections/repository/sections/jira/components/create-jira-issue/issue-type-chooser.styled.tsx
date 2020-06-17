import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const IssueTypeChooserWrapper = styled.div`
  margin-left: ${gridSize() / 2}px;
`;

export const IssueTypeImage = styled.img`
  margin-bottom: -${gridSize() / 4}px;
`;

export const CustomOption = styled.div`
  display: flex;
  align-items: center;
`;

export const IssueTypeIcon = styled.img`
  height: ${gridSize() * 2}px;
`;

export const CustomOptionLabel = styled.div`
  padding-left: ${gridSize()}px;
`;
