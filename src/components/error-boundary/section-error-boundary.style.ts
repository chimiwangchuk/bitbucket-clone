import styled from '@emotion/styled';
import Button from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme';

export const TryAgainLink = styled(Button)`
  margin: 0;
  padding: 0 ${gridSize() / 2}px 0 0;
`;

export const SupportResourcesLink = styled.a`
  margin: ${gridSize() / 2}px ${gridSize() / 2}px ${gridSize() / 2}px 0;
  display: flex;
  height: ${gridSize()}px;
  align-items: center;
`;

export const SectionMessageContainer = styled.div`
  p {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`;

export const TextContainer = styled.span`
  margin-right: ${gridSize() / 2}px;
`;

export const SectionErrorContainer = styled.div`
  text-align: left;
`;
