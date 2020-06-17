import styled from '@emotion/styled';
import { colors, gridSize, borderRadius } from '@atlaskit/theme';

export const UploadErrorMessage = styled.div`
  margin-top: ${gridSize() / 2}px;
  display: flex;
  align-items: center;
`;

export const dropzoneStyles = {
  width: '200px',
  height: '200px',
  borderWidth: '2px',
  borderColor: colors.N40,
  borderStyle: 'dashed',
  borderRadius: `${borderRadius() * 2}px`,
  color: colors.N400,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: `${gridSize()}px`,
  cursor: 'pointer',
};
