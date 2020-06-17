import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';
import { useMemo } from 'react';

import { getModalMenuPortalStyles } from 'src/styles/select';

export const Field = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${gridSize() * 2}px;
`;

export const useSelectStyles = (isSiteBannerOpen: boolean) =>
  useMemo(() => {
    const minWidth = `${gridSize() * 18}px`;
    return {
      ...getModalMenuPortalStyles(isSiteBannerOpen),
      // @ts-ignore TODO: Upgrade @atlaskit/select and use `StylesConfig` as this full object's type
      // to fix noImplicitAny error here
      container: base => ({
        ...base,
        flex: `0 0 ${minWidth}`,
        marginLeft: `${gridSize() * 2}px`,
        minWidth,
      }),
    };
  }, [isSiteBannerOpen]);
