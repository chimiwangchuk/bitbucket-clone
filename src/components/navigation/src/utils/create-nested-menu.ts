import { MenuItem, MenuItemGroup } from '../types';

export const ROOT_MENU_ID = '__root__'; // Used to create an ID for the menuItems array
export const MENU_ITEM_GROUP_TYPE = 'menu_item_group';

export const isNestedMenu = (menuItems: MenuItem[]) =>
  menuItems[0] && menuItems[0].id === ROOT_MENU_ID;

const hasChildren: (
  item: MenuItem | Partial<MenuItem> | MenuItemGroup
) => boolean = item => {
  return Array.isArray(item.children) && item.children.length > 0;
};

export const getFirstMenuItem = (
  menuItem: MenuItem | MenuItemGroup
): MenuItem => {
  if (menuItem.type === MENU_ITEM_GROUP_TYPE || hasChildren(menuItem)) {
    return getFirstMenuItem(menuItem.children[0]);
  } else {
    return menuItem;
  }
};

// @ts-ignore TODO: fix noImplicitAny error here
export function createMenuStructure(menuItem: Partial<MenuItem>) {
  // @ts-ignore TODO: fix noImplicitAny error here
  const createMenu = (
    menuItems: (MenuItem | MenuItemGroup)[],
    mainMenuItem: Partial<MenuItem>
  ) =>
    menuItems.reduce((items: MenuItem[], item: MenuItem | MenuItemGroup) => {
      if (hasChildren(item)) {
        if (item.type === MENU_ITEM_GROUP_TYPE) {
          return items.concat(createMenu(item.children, mainMenuItem));
        }
        return items.concat(
          createMenuStructure({ ...item, parentId: mainMenuItem.id })
        );
      }
      return items;
    }, [] as MenuItem[]);
  if (!menuItem.children || !hasChildren(menuItem)) return [menuItem];
  return [menuItem, ...createMenu(menuItem.children, menuItem)];
}

export function createNestedMenu(menuItems: MenuItem[] = []) {
  if (isNestedMenu(menuItems)) {
    // already a nested menu
    return menuItems;
  }
  return createMenuStructure({
    id: ROOT_MENU_ID,
    children: menuItems,
  });
}

export function findNestedMenuItem(
  menuItems: (MenuItem | MenuItemGroup)[],
  predicate: (item: MenuItem) => boolean
): MenuItem | undefined {
  let items = menuItems;
  if (isNestedMenu(items as MenuItem[])) {
    // only need to search root menu
    items = items[0].children;
  }
  for (const item of items) {
    if (
      item.type !== MENU_ITEM_GROUP_TYPE &&
      !hasChildren(item) &&
      predicate(item)
    ) {
      return item;
    }
    if (hasChildren(item)) {
      const result = findNestedMenuItem(item.children, predicate);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
}

export function mapNestedMenuItems(
  menuItems: (MenuItem | MenuItemGroup)[],
  newItem: (item: MenuItem) => MenuItem
): (MenuItem | MenuItemGroup)[] {
  return menuItems.map(({ ...item }: MenuItem | MenuItemGroup) => {
    if (hasChildren(item)) {
      item.children = mapNestedMenuItems(item.children, newItem);
    }
    if (item.type === MENU_ITEM_GROUP_TYPE) {
      return item;
    }
    return newItem(item);
  });
}

export function findNestedMenuItemParentId(
  menuItems: (MenuItem | MenuItemGroup)[],
  menuItem: MenuItem
): string | undefined {
  for (let i = menuItems.length - 1; i >= 0; i--) {
    const menu = menuItems[i];
    if (
      menu.type !== MENU_ITEM_GROUP_TYPE &&
      hasChildren(menu) &&
      findNestedMenuItem(
        menu.children,
        (item: MenuItem) => item.id === menuItem.id
      )
    ) {
      return menu.id;
    }
  }
  return undefined;
}
