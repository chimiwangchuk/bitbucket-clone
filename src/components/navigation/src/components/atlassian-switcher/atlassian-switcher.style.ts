import { typography } from '@atlaskit/theme';
import styled from '@emotion/styled';

// Use &&& to make the specificity of this selector higher to override
// styles for h1 defined globally in Bitbucket core pages in typography.less.
// TODO: clean up override when we no longer have globally defined CSS rules for h1.
export const SwitcherWrapper = styled.div`
  &&& {
    h1 {
      ${typography.h100() as any};
      margin-top: 0;
    }
  }
`;
