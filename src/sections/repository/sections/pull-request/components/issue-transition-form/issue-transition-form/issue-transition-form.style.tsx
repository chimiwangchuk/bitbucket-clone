import styled from '@emotion/styled';
import { colors, gridSize } from '@atlaskit/theme';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';
import Button from '@atlaskit/button';

export const LineContainer = styled.div`
  display: flex;
  align-items: center;
  padding-top: ${gridSize() / 4}px;
  padding-left: ${gridSize() / 2}px;
  padding-right: ${gridSize() / 2}px;
`;

export const AddTransitionButton = styled(Button)`
  color: ${colors.N300};
`;

export const StyledEditorAddIcon = styled(EditorAddIcon)`
  color: ${colors.N300};
`;
