import React, { ReactNode, StatelessComponent } from 'react';
// @ts-ignore TODO: fix noImplicitAny error here
import { ItemGroup } from '@atlaskit/item';

import * as styles from './drawer-item-group.style';

type Props = {
  title: string;
  children: ReactNode;
};

const DrawerItemGroup: StatelessComponent<Props> = ({
  title,
  children,
}: Props) => {
  return (
    <styles.ItemGroupWrapper>
      <ItemGroup title={<styles.TitleWrapper>{title}</styles.TitleWrapper>}>
        <styles.ItemChildrenWrapper>{children}</styles.ItemChildrenWrapper>
      </ItemGroup>
    </styles.ItemGroupWrapper>
  );
};

export default DrawerItemGroup;
