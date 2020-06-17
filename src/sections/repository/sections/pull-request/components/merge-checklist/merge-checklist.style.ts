import styled from '@emotion/styled';
import { gridSize, colors } from '@atlaskit/theme';

const dividerColor = colors.N40A;

export const MergeChecksNumber = styled.span`
  font-weight: bold;
`;

export const MergeCheck = styled.div`
  display: flex;
  align-items: center;
  padding: ${gridSize() / 2}px 0;
`;

export const IconContainer = styled.div`
  position: relative;
`;

export const PassIndicator = styled.span`
  background-color: ${colors.G300};
  border-radius: ${gridSize()}px;
  height: ${gridSize()}px;
  left: ${gridSize() * 3 + gridSize() / 2}px;
  position: absolute;
  top: ${gridSize()}px;
  width: ${gridSize()}px;
`;

export const FailIndicator = styled.span`
  background-color: ${colors.Y300};
  border-radius: ${gridSize()}px;
  height: ${gridSize()}px;
  left: ${gridSize() * 3 + gridSize() / 2}px;
  position: absolute;
  top: ${gridSize()}px;
  width: ${gridSize()}px;
`;

export const IconWrapper = styled.span`
  display: flex;
  margin-right: ${gridSize()}px;
`;

export const WorkflowIcon = styled.img`
  margin: ${gridSize() * 2}px auto ${gridSize() * 3}px auto;
  display: block;
  height: 104px;
`;

export const MessageRow = styled.p`
  padding: 0 ${gridSize() / 2}px;
  margin-bottom: ${gridSize};
  text-align: left;
`;

export const MessageLink = styled.p`
  margin-top: ${gridSize() * 2}px;
  text-align: center;
  border-top: 1px solid ${dividerColor};
  padding: ${gridSize()}px;
`;

export const IconSecondary = styled.div`
  display: flex;
  > * {
    display: flex;
  }
`;
