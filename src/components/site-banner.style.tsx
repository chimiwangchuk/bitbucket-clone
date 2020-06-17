import styled from '@emotion/styled';
import { layers } from '@atlaskit/theme';

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;

  /*
    Site banner is given z-index one more than that of Sidebar to make it appear on top.
  */
  z-index: ${layers.blanket() + 1};
`;
