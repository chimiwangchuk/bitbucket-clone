import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme';

export const Container = styled.div`
  align-items: flex-end;
  display: flex;
`;

// Override AK so the button height matches that of the text field
export const CopyButtonToMatchTextfield = styled.div`
  margin-left: ${`${gridSize()}px`};

  & button {
    height: 39px;
  }
`;

export const TextField = styled.div`
  flex: 1;
`;
