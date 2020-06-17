import { ModalTitle } from '@atlaskit/modal-dialog';
import { colors, gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';

import Loading from 'src/components/loading';
import { CodeContainer } from 'src/styles';

export const DialogTitle = styled(ModalTitle)`
  justify-content: space-between;
  width: 100%;
`;

export const DialogTitleIcon = styled.span`
  margin-right: ${gridSize()}px;
  flex: 0 0 auto;
`;

export const DialogTitleText = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

export const DiffWrapper = styled.div`
  border: 1px solid ${colors.N40};
`;

export const ModalLoading = styled(Loading)`
  height: 100%;
`;

export const ScmCommandCodeContainer = styled(CodeContainer)`
  max-width: 540px;
`;
