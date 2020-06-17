import Button from '@atlaskit/button';
import { gridSize, colors } from '@atlaskit/theme';
import styled from '@emotion/styled';

export const CreateJiraIssueWrapper = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: ${gridSize()}px;
  max-width: ${gridSize() * 110}px;
`;

export const CreateJiraIssueActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${colors.N200};
`;

export const CreateJiraIssueActionsInnerContainer = styled.div`
  display: flex;
  align-items: center;

  /* Need to set an explicit white background here so that SpotlightTarget
  component uses the correct background color when onboarding is shown. */
  background-color: ${colors.N0};
`;

export const CancelButton = styled(Button)`
  padding-right: 0;
`;

export const SubmitButton = styled(Button)`
  margin-left: ${gridSize() * 2}px;
  padding-right: 0;
`;

export const CreateIssueSpinnerWrapper = styled.div`
  margin-right: ${gridSize() / 2}px;
`;
