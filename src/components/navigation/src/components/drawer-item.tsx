import React, { ReactNode, StatelessComponent } from 'react';

import * as styles from './drawer-item.style';

type Props = {
  href?: string;
  icon: ReactNode;
  isSelected?: boolean;
  text: ReactNode;
  linkComponent?: ReactNode;
  onClick?: () => void;
};

const DrawerItem: StatelessComponent<Props> = ({
  text,
  icon,
  ...restProps
}: Props) => (
  <styles.StyledItem elemBefore={icon} {...restProps}>
    {text}
  </styles.StyledItem>
);

export default DrawerItem;
