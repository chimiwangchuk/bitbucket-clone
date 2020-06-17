import AddItemIcon from '@atlaskit/icon/glyph/add-item';
import BitbucketBranchesIcon from '@atlaskit/icon/glyph/bitbucket/branches';
import BitbucketCloneIcon from '@atlaskit/icon/glyph/bitbucket/clone';
import BitbucketForksIcon from '@atlaskit/icon/glyph/bitbucket/forks';
import BitbucketPullrequestsIcon from '@atlaskit/icon/glyph/bitbucket/pullrequests';
import BitbucketReposIcon from '@atlaskit/icon/glyph/bitbucket/repos';
import BitbucketSnippetsIcon from '@atlaskit/icon/glyph/bitbucket/snippets';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import React, {
  ComponentType,
  Fragment,
  PureComponent,
  ReactNode,
} from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import { CompareIcon } from '@atlassian/bitkit-icon';
import { FactContext } from '@atlassian/bitkit-analytics';

import { MenuItem, AnalyticsEvent } from '../types';
import { withMenuItem } from './with-menu-item';
import { SidebarCreateDrawerMenuItemClickedFact } from './facts';
import ConnectMenuItemIcon from './connect-menu-item-icon';
import messages from './create-drawer.i18n';
import DrawerItem from './drawer-item';
import DrawerItemGroup from './drawer-item-group';

const icons = {
  'repository-create-drawer-item': BitbucketReposIcon,
  'repository-import-drawer-item': BitbucketReposIcon,
  'team-create-drawer-item': PeopleIcon,
  'project-create-drawer-item': FolderIcon,
  'snippet-create-drawer-item': BitbucketSnippetsIcon,
  'workspace-create-drawer-item': DashboardIcon,
  'repo-add-file-link': AddItemIcon,
  'repo-clone-button': BitbucketCloneIcon,
  'repo-compare-link': CompareIcon,
  'repo-create-branch-link': BitbucketBranchesIcon,
  'repo-create-pull-request-link': BitbucketPullrequestsIcon,
  'repo-fork-link': BitbucketForksIcon,
};

const renderConnectAction = (item: MenuItem) => {
  // eslint-disable-next-line @typescript-eslint/camelcase
  const { addon_key, module_key, oauth_consumer_id } = item.analytics_payload;
  return (
    <FactContext.Consumer key={item.id}>
      {({ publishFact }) => (
        <DrawerItem
          onClick={() =>
            publishFact(
              // @ts-ignore
              new SidebarCreateDrawerMenuItemClickedFact({
                label: item.analytics_label || item.id,
                addon_key,
                module_key,
                oauth_consumer_id,
              })
            )
          }
          icon={<ConnectMenuItemIcon menuItem={item} />}
          href={item.url}
          text={item.label}
        />
      )}
    </FactContext.Consumer>
  );
};

export type BaseCreateDrawerProps = {
  containerBitbucketActions?: MenuItem[];
  containerConnectActions?: MenuItem[];
  drawerHeader?: ReactNode;
  globalBitbucketActions: MenuItem[];
  importBitbucketActions: MenuItem[];
  onCloneClick: () => void;
  onCreateDrawerClose: () => void;
  linkComponent?: ComponentType<any>;
  publishUiEvent: (event: AnalyticsEvent) => void;
};

type CreateDrawerProps = BaseCreateDrawerProps & { intl: InjectedIntl };

export class BaseCreateDrawer extends PureComponent<CreateDrawerProps> {
  static defaultProps = {
    containerBitbucketActions: [],
    containerConnectActions: [],
  };

  renderBitbucketAction = (item: MenuItem) => {
    // @ts-ignore TODO: fix noImplicitAny error here
    const IconComponent = icons[item.id];
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { addon_key, module_key, oauth_consumer_id } = item.analytics_payload;
    return (
      <FactContext.Consumer key={item.id}>
        {({ publishFact }) => (
          <DrawerItem
            onClick={() => {
              publishFact(
                // @ts-ignore
                new SidebarCreateDrawerMenuItemClickedFact({
                  label: item.analytics_label || item.id,
                  addon_key,
                  module_key,
                  oauth_consumer_id,
                })
              );
              this.props.publishUiEvent({
                action: 'clicked',
                actionSubject: 'link',
                actionSubjectId: 'createDrawerLink',
                source: 'navigation',
                attributes: {
                  label: item.analytics_label || item.id,
                  addon_key,
                  module_key,
                  oauth_consumer_id,
                },
              });

              if (item.is_client_link) {
                this.props.onCreateDrawerClose();
              }
            }}
            icon={IconComponent ? <IconComponent label="" /> : null}
            href={item.url}
            linkComponent={
              item.is_client_link && this.props.linkComponent
                ? withMenuItem(item)(this.props.linkComponent)
                : undefined
            }
            text={<span dangerouslySetInnerHTML={{ __html: item.label }} />}
          />
        )}
      </FactContext.Consumer>
    );
  };

  renderCloneTrigger(item: MenuItem) {
    // @ts-ignore TODO: fix noImplicitAny error here
    const IconComponent = icons[item.id];
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { addon_key, module_key, oauth_consumer_id } = item.analytics_payload;
    return (
      <FactContext.Consumer key={item.id}>
        {({ publishFact }) => (
          <DrawerItem
            onClick={() => {
              publishFact(
                // @ts-ignore
                new SidebarCreateDrawerMenuItemClickedFact({
                  label: item.analytics_label || item.id,
                  addon_key,
                  module_key,
                  oauth_consumer_id,
                })
              );

              this.props.onCloneClick();
            }}
            icon={IconComponent ? <IconComponent label="" /> : null}
            text={<span dangerouslySetInnerHTML={{ __html: item.label }} />}
          />
        )}
      </FactContext.Consumer>
    );
  }

  render() {
    const {
      globalBitbucketActions,
      importBitbucketActions,
      containerBitbucketActions,
      containerConnectActions,
      drawerHeader,
      intl,
    } = this.props;

    return (
      <Fragment>
        {drawerHeader || null}
        {globalBitbucketActions.length ? (
          <DrawerItemGroup
            title={intl.formatMessage(messages.globalBitbucketActionsHeading)}
          >
            {globalBitbucketActions.map(item =>
              this.renderBitbucketAction(item)
            )}
          </DrawerItemGroup>
        ) : null}
        {importBitbucketActions.length ? (
          <DrawerItemGroup
            title={intl.formatMessage(messages.importBitbucketActionsHeading)}
          >
            {importBitbucketActions.map(item =>
              this.renderBitbucketAction(item)
            )}
          </DrawerItemGroup>
        ) : null}
        {containerBitbucketActions && containerBitbucketActions.length ? (
          <DrawerItemGroup
            title={intl.formatMessage(
              messages.containerBitbucketActionsHeading
            )}
          >
            {containerBitbucketActions.map(item =>
              item.id === 'repo-clone-button'
                ? this.renderCloneTrigger(item)
                : this.renderBitbucketAction(item)
            )}
          </DrawerItemGroup>
        ) : null}
        {containerConnectActions && containerConnectActions.length ? (
          <DrawerItemGroup
            title={intl.formatMessage(messages.containerConnectActionsHeading)}
          >
            {containerConnectActions.map(item => renderConnectAction(item))}
          </DrawerItemGroup>
        ) : null}
      </Fragment>
    );
  }
}

export default injectIntl(BaseCreateDrawer);
