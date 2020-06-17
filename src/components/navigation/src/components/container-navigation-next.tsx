import URL from 'url';
import React, { useState, PureComponent, Fragment, ComponentType } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import {
  ContainerHeader,
  HeaderSection,
  BackItem,
  Item,
  ItemAvatar,
  GroupHeading,
  Section,
  MenuSection,
  Wordmark,
  // @ts-ignore TODO: fix noImplicitAny error here
} from '@atlaskit/navigation-next';
import { BitbucketWordmark } from '@atlaskit/logo';
import { gridSize } from '@atlaskit/theme';
import Lozenge from '@atlaskit/lozenge';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import {
  isNestedMenu,
  findNestedMenuItemParentId,
  ROOT_MENU_ID,
  MENU_ITEM_GROUP_TYPE,
  getFirstMenuItem,
} from '../utils/create-nested-menu';
import { MenuItem, MenuItemGroup } from '../types';
import { GroupHeadingNoTopMargin } from './container-navigation-next.style';
import { renderMenuItemIcon } from './icons-map';
import messages from './container-navigation-next.i18n';

const renderMenuItemAfter = (
  item: MenuItem,
  isJiraRepoPageM2Enabled: boolean,
  intl: InjectedIntl
) => {
  switch (item.tab_name) {
    case 'jira':
      return (
        <Lozenge appearance="new" isBold>
          {isJiraRepoPageM2Enabled ? intl.formatMessage(messages.new) : 'BETA'}
        </Lozenge>
      );
    default:
      return null;
  }
};

type ContainerHeaderProps =
  | {
      isGlobalContext: true;
      isPrivate?: false;
      containerHref?: undefined;
      containerLogo?: undefined;
      containerName?: undefined;
    }
  | {
      isGlobalContext: false;
      isPrivate: boolean;
      containerHref: string;
      containerLogo: string;
      containerName: string;
    };

type historyPushType = {
  push: (pathname: string) => void;
};

type ContainerNavigationProps = {
  history?: historyPushType; // This property is not passed in bitbucket-core.
  linkComponent?: ComponentType<any>;
  menuItems: MenuItem[];
  selectedMenuItem?: MenuItem;
  isJiraRepoPageM2Enabled: boolean;
  intl: InjectedIntl;
} & ContainerHeaderProps;

export const ContainerMenuItem = ({
  item,
  index,
  setSelectedMenu,
  isJiraRepoPageM2Enabled,
  intl,
  selectedMenuItem,
  linkComponent,
  isNested,
  history,
}: {
  item: MenuItem | MenuItemGroup;
  index: number;
  history?: historyPushType;
  setSelectedMenu: (update: {
    selectedMenuItem?: MenuItem;
    selectedMenuId?: string;
  }) => void;
  isJiraRepoPageM2Enabled: boolean;
  intl: InjectedIntl;
  selectedMenuItem?: MenuItem;
  linkComponent?: ComponentType<any>;
  isNested?: boolean;
}) => {
  if (item.type === MENU_ITEM_GROUP_TYPE) {
    const heading = (
      <GroupHeading key={item.key} id={item.key}>
        {item.title}
      </GroupHeading>
    );
    // If the first item, then remove top margin from heading
    return (
      <>
        {index === 0 ? (
          <GroupHeadingNoTopMargin key={item.key}>
            {heading}
          </GroupHeadingNoTopMargin>
        ) : (
          heading
        )}
        {item.children.map((child, i) => (
          <ContainerMenuItem
            key={child.id}
            history={history}
            item={child}
            index={i}
            setSelectedMenu={setSelectedMenu}
            selectedMenuItem={selectedMenuItem}
            linkComponent={linkComponent}
            isJiraRepoPageM2Enabled={isJiraRepoPageM2Enabled}
            intl={intl}
            isNested
          />
        ))}
      </>
    );
  }
  if (Array.isArray(item.children) && item.children.length) {
    const firstMenuItem: MenuItem = getFirstMenuItem(item);
    return (
      <Item
        before={() => renderMenuItemIcon(item)}
        // @ts-ignore TODO: fix noImplicitAny error here
        after={({ isHover }) =>
          isHover && (
            <ArrowRightCircleIcon label={item.label} secondaryColor="inherit" />
          )
        }
        key={item.id}
        text={item.label}
        onClick={() => {
          if (history && firstMenuItem.is_client_link) {
            // internal frontbucket navigation
            history.push(firstMenuItem.url);
          } else {
            // navigating to and/or from a backbucket page
            window.location.assign(firstMenuItem.url);
          }
        }}
      />
    );
  }
  const icon = isNested ? null : renderMenuItemIcon(item);
  return (
    <Item
      href={item.url}
      after={() => renderMenuItemAfter(item, isJiraRepoPageM2Enabled, intl)}
      key={item.id}
      text={item.label}
      isSelected={selectedMenuItem && selectedMenuItem.id === item.id}
      component={item.is_client_link ? linkComponent : undefined}
      {...(icon ? { before: () => icon } : {})}
    />
  );
};

export const ContainerMenuSection = ({
  menuItems,
  isJiraRepoPageM2Enabled,
  intl,
  selectedMenuItem,
  linkComponent,
  history,
  containerHref,
}: {
  menuItems: MenuItem[];
  isJiraRepoPageM2Enabled: boolean;
  intl: InjectedIntl;
  selectedMenuItem?: MenuItem;
  linkComponent?: ComponentType<any>;
  containerHref: string;
  history?: historyPushType;
}) => {
  const [
    { menuItems: items, selectedMenuItem: selectedItem, selectedMenuId },
    setState,
  ] = useState({
    menuItems,
    selectedMenuItem,
    selectedMenuId:
      (selectedMenuItem &&
        findNestedMenuItemParentId(menuItems, selectedMenuItem)) ||
      ROOT_MENU_ID,
  });
  const setSelectedMenu = (update: {
    selectedMenuItem?: MenuItem;
    selectedMenuId?: string;
  }) =>
    setState(state => ({
      ...state,
      ...update,
    }));
  const selectedMenu = items.find(
    item => item.id === selectedMenuId
  ) as MenuItem;

  return (
    <>
      {selectedMenu.parentId && (
        <Section>
          {({ className }: any) => (
            <div className={className}>
              <BackItem
                onClick={() => {
                  const containerHrefPathname =
                    URL.parse(containerHref).pathname || '/';
                  setSelectedMenu({
                    selectedMenuId: selectedMenu.parentId,
                  });
                  if (history) {
                    history.push(containerHrefPathname);
                  } else {
                    window.location.assign(containerHrefPathname);
                  }
                }}
              />
            </div>
          )}
        </Section>
      )}
      <MenuSection
        key="nested-section"
        id={selectedMenu.id}
        parentId={selectedMenu.parentId}
        shouldGrow
      >
        {({ className }: any) => (
          <div className={className}>
            {selectedMenu.children.map((item: MenuItem, index: number) => (
              <ContainerMenuItem
                key={item.id}
                history={history}
                index={index}
                item={item}
                setSelectedMenu={setSelectedMenu}
                selectedMenuItem={selectedItem}
                linkComponent={linkComponent}
                isJiraRepoPageM2Enabled={isJiraRepoPageM2Enabled}
                intl={intl}
              />
            ))}
          </div>
        )}
      </MenuSection>
    </>
  );
};

class ContainerNavigation extends PureComponent<ContainerNavigationProps> {
  render() {
    const {
      containerHref,
      containerLogo,
      containerName,
      isGlobalContext,
      isPrivate,
      linkComponent,
      menuItems,
      selectedMenuItem,
      isJiraRepoPageM2Enabled,
      intl,
      history,
    } = this.props;

    return (
      <Fragment>
        <HeaderSection>
          {({ css }: any) =>
            isGlobalContext ? (
              <div style={{ ...css }}>
                <Wordmark wordmark={BitbucketWordmark} />
              </div>
            ) : (
              <div style={{ ...css, paddingBottom: gridSize() * 2.5 }}>
                <ContainerHeader
                  // @ts-ignore TODO: fix noImplicitAny error here
                  before={itemState => (
                    <ItemAvatar
                      itemState={itemState}
                      appearance="square"
                      size="large"
                      src={containerLogo}
                      status={isPrivate ? 'locked' : undefined}
                    />
                  )}
                  component={linkComponent}
                  href={containerHref}
                  text={containerName}
                />
              </div>
            )
          }
        </HeaderSection>
        {isNestedMenu(menuItems) ? (
          <ContainerMenuSection
            history={history}
            containerHref={containerHref as string}
            menuItems={menuItems}
            selectedMenuItem={selectedMenuItem}
            linkComponent={linkComponent}
            isJiraRepoPageM2Enabled={isJiraRepoPageM2Enabled}
            intl={intl}
          />
        ) : (
          <MenuSection>
            {({ className }: any) => (
              <div className={className}>
                {menuItems.map(item => (
                  <Item
                    href={item.url}
                    before={() => renderMenuItemIcon(item)}
                    after={() =>
                      renderMenuItemAfter(item, isJiraRepoPageM2Enabled, intl)
                    }
                    key={item.id}
                    text={item.label}
                    isSelected={item === selectedMenuItem}
                    component={item.is_client_link ? linkComponent : undefined}
                  />
                ))}
              </div>
            )}
          </MenuSection>
        )}
      </Fragment>
    );
  }
}
export default injectIntl(ContainerNavigation);
