import Fact from '@atlassian/bitkit-analytics';

export type ViewCodeSearchResultsFactProps = {
  context: string;
  user_uuid?: string;
};

export class ViewCodeSearchResultsFact extends Fact<
  ViewCodeSearchResultsFactProps
> {
  name = 'bitbucket.adg3-navigation.search.code.view.results';
}

export type SearchDrawerItemType =
  | 'recent_repos'
  | 'search_repos'
  | 'search_prs'
  | 'search_issues';

type SearchDrawerItemClickFactProps = {
  total_shown: number;
  index: number;
  type: SearchDrawerItemType;
  repository_uuid: string;
  owner_uuid: string;
  issue_id?: number;
  pull_request_id?: number;
};

export class SearchDrawerItemClickFact extends Fact<
  SearchDrawerItemClickFactProps
> {
  name = 'bitbucket.search_drawer.item.click';
}

type SidebarCreateDrawerMenuItemClickedFactProps = {
  label: string;
  addon_key?: string;
  module_key?: string;
  oauth_consumer_id?: string;
};

export class SidebarCreateDrawerMenuItemClickedFact extends Fact<
  SidebarCreateDrawerMenuItemClickedFactProps
> {
  name = 'bitbucket.sidebar.create_drawer.click';
}

export class WhatsNewSubmenuOpenedFact extends Fact<{}> {
  name = 'bitbucket.whatsnew.submenu.open';
}

export class WhatsNewPostClickedFact extends Fact<{}> {
  name = 'bitbucket.whatsnew.post.clicked';
}
