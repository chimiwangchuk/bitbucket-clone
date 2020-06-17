import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const ProjectLabel = styled.div`
  padding: 0 ${gridSize() / 2}px;
`;

export const CustomOption = styled.div`
  display: flex;
  align-items: center;
`;

export const ProjectIcon = styled.img`
  height: ${gridSize() * 2}px;
`;

export const CustomOptionLabel = styled.div`
  padding-left: ${gridSize()}px;
`;
