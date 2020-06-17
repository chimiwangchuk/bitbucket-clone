export type ResizeEvent = {
  isOpen: boolean;
  width?: number;
};

export type MenuItemGroup = {
  key: string;
  title: string;
  type: 'menu_item_group';
  children: MenuItem[];
};

export type MenuItem = {
  analytics_label: string;
  icon_class: string;
  badge_label: string;
  weight: number;
  url: string;
  tab_name: string;
  can_display: boolean;
  label: string;
  anchor: boolean;
  analytics_payload: {
    addon_key: string;
    module_key: string;
    oauth_consumer_id: string;
  };
  target: string;
  type: 'menu_item' | 'connect_menu_item';
  id: string;
  parentId?: string; // used for nestedMenu
  icon: string;
  is_selected: boolean;
  is_client_link?: boolean;
  icon_url: string;
  matching_url_prefixes: string[];
  count?: number;
  children: (MenuItemGroup | MenuItem)[];
};

export type DroplistItem<C> = {
  content: C;
  href?: string;
  elemBefore?: any;
};

export type CheckableDroplistItem<C> = DroplistItem<C> & { isChecked: boolean };

export type UiEvent = {
  action: string;
  actionSubject: string;
  source: string;
  attributes?: object;
};

export type AnalyticsEvent = {
  action: string;
  actionSubject: string;
  actionSubjectId: string | number;
  source: string;
  attributes?: object;
  containerType?: string;
  containerId?: string | number;
  objectType?: string;
  objectId?: string | number;
  tags?: string[];
};

export enum BbEnv {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
}

export type PullRequestGlobalSearchResult = {
  id: number;
  localId: number;
  repo: string;
  repo_owner_uuid: string;
  repo_uuid: string;
  title: string;
  url: string;
};

export type RepositoryGlobalSearchResult = {
  fullSlug: string;
  logo: string;
  name: string;
  owner: string;
  owner_uuid: string;
  slug: string;
  url: string;
  uuid: string;
};

export enum Product {
  Bitbucket = 'bitbucket.ondemand',
  Confluence = 'confluence.ondemand',
  JiraSoftware = 'jira-software.ondemand',
  JiraServiceDesk = 'jira-servicedesk.ondemand',
  Opsgenie = 'opsgenie',
}

export enum ApiResponseStatusCode {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 401,
}

export type Site = {
  avatarUrl?: string;
  cloudId: string;
  displayName: string;
  products: Array<{ productKey: Product; url?: string }>;
  url: string;
  relevance?: number;
  users?: SiteUser[];
};

export interface JoinableSite extends Omit<Site, 'products'> {
  products: Product[];
}

export type SiteUser = { avatarUrl: string; displayName: string };
