import React from 'react';
import {
  DropdownItem as AkDropdownItem,
  DropdownItemGroup as AkDropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import {
  MenuGroup,
  LinkItem,
  MenuGroupProps,
  LinkItemProps,
  HeadingItem,
} from '@atlaskit/menu';

// This file provides abstractions for the 2 Atlaskit packages used for dropdown menus, since the
// 2 different navigation components use different ones and they have different APIs:
// * @atlaskit/navigation-next      => uses @atlaskit/dropdown-item
// * @atlaskit/atlassian-navigation => uses @atlaskit/menu
// Once the "fd-horizontal-nav" feature flag is removed, this abstraction can be removed.

type DropdownItemProps = LinkItemProps & { isAkDropdown?: boolean };

export const DropdownItem = ({ isAkDropdown, ...props }: DropdownItemProps) => {
  return isAkDropdown ? <AkDropdownItem {...props} /> : <LinkItem {...props} />;
};

type DropdownItemGroupProps = MenuGroupProps & {
  title?: string;
  isAkDropdown?: boolean;
};

export const DropdownItemGroup = ({
  isAkDropdown,
  ...props
}: DropdownItemGroupProps) => {
  if (isAkDropdown) {
    return <AkDropdownItemGroup {...props} />;
  }

  const { children, title, ...menuProps } = props;
  return (
    <MenuGroup {...menuProps}>
      <HeadingItem>{title}</HeadingItem>
      {children}
    </MenuGroup>
  );
};
