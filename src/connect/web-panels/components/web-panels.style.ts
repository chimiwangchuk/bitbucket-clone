import { gridSize, typography } from '@atlaskit/theme';
import styled from '@emotion/styled';

// Pipelines has chosen this as their default Connect add-on height
export const webPanelHeight = '50px';
export const webPanelWidth = '100%';

export const SourceWebPanel = styled.div`
  display: flex;
  position: relative;
  margin-bottom: ${gridSize() * 3}px;
  min-height: ${webPanelHeight};
  max-height: 280px;
  overflow: auto;
  iframe {
    display: block;
  }
`;

export const PullRequestWebPanel = styled.div`
  display: flex;
  position: relative;
  margin-top: ${gridSize()}px;
  overflow: auto;
  min-height: ${webPanelHeight};
  max-height: 600px;
  iframe {
    display: block;
    overflow: auto;
  }
`;

export const WebPanelHeader = styled.span`
  ${typography.h400() as any};
`;

export const WebPanelSection = styled.section`
  margin-top: ${gridSize()}px;
  margin-bottom: ${gridSize()}px;
`;
