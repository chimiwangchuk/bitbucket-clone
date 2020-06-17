import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const Annotator = styled.div`
  display: flex;
  align-items: center;
`;

export const AnnotatorLabel = styled.div`
  padding-left: ${gridSize()}px;
`;

export const AnnotationCounts = styled.small`
  display: block;
  margin-top: 0;
`;
