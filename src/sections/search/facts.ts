import Fact from '@atlassian/bitkit-analytics';

type SearchResultsViewedFactProps = {
  total_result_count?: number;
  is_substituted?: boolean;
  is_too_long?: boolean;
  scope_type?: string;
  error?: string;
};

export class SearchResultsViewedFact extends Fact<
  SearchResultsViewedFactProps
> {
  name = 'bitbucket.search_results.viewed';
}

export class SearchAccountSelectorClickedFact extends Fact<void> {
  name = 'bitbucket.search_results.account_switcher.clicked';
}

type SearchAccountSelectorChangedFactProps = {
  account_uuid: string;
};

export class SearchAccountSelectorChangedFact extends Fact<
  SearchAccountSelectorChangedFactProps
> {
  name = 'bitbucket.search_results.account_switcher.changed';
}

type SearchResultsPaginationClickedProps = {
  page_num: number;
};

export class SearchResultsPaginationClickedFact extends Fact<
  SearchResultsPaginationClickedProps
> {
  name = 'bitbucket.search_results.pagination.clicked';
}

type SearchResultsSourceFileClickedFactProps = {
  result_num: number;
  page_num: number;
};

export class SearchResultsSourceFileClickedFact extends Fact<
  SearchResultsSourceFileClickedFactProps
> {
  name = 'bitbucket.search_results.source_file.clicked';
}

type SearchResultsSourceFileLineClickedFactProps = {
  line_num: number;
  result_num: number;
  page_num: number;
};

export class SearchResultsSourceFileLineClickedFact extends Fact<
  SearchResultsSourceFileLineClickedFactProps
> {
  name = 'bitbucket.search_results.source_file.line.clicked';
}

type SearchResultsRepositorySearchHintClickedFactProps = {
  state: string;
};

export class SearchResultsRepositorySearchHintClickedFact extends Fact<
  SearchResultsRepositorySearchHintClickedFactProps
> {
  name = 'bitbucket.search_results.repository_search_hint.clicked';
}

type SearchResultsSourcePathClickedFactProps = {
  result_num: number;
  page_num: number;
};

export class SearchResultsSourcePathClickedFact extends Fact<
  SearchResultsSourcePathClickedFactProps
> {
  name = 'bitbucket.search_results.source_path.clicked';
}

export class SearchResultsCodeExpandClickedFact extends Fact<void> {
  name = 'bitbucket.search_results.code_expand.clicked';
}

export class SearchResultsCodeCollapseClickedFact extends Fact<void> {
  name = 'bitbucket.search_results.code_collapse.clicked';
}

type SearchFormRefineMenuItemAddedFactProps = {
  modifier?: string;
};

export class SearchFormRefineMenuItemAddedFact extends Fact<
  SearchFormRefineMenuItemAddedFactProps
> {
  name = 'bitbucket.search_form.refine_menu.item_added';
}

type SearchFormSubmittedFactProps = {
  trigger: string;
};

export class SearchFormSubmittedFact extends Fact<
  SearchFormSubmittedFactProps
> {
  name = 'bitbucket.search_form.submitted';
}

type SearchFormOpenedFactProps = {
  account_selection_logic: string;
};

export class SearchFormOpenedFact extends Fact<SearchFormOpenedFactProps> {
  name = 'bitbucket.search_form.opened';
}

type SearchSatisfactionShownProps = {
  account_uuid: string;
  selectable_accounts: number;
  account_type: string;
  total_search_results: number;
};

export class SearchSatisfactionShownFact extends Fact<
  SearchSatisfactionShownProps
> {
  name = 'bitbucket.search_results.satisfaction.shown';
}

export class SearchSatisfactionYesFact extends Fact<void> {
  name = 'bitbucket.search_results.satisfaction.yes.clicked';
}

export class SearchSatisfactionNoFact extends Fact<void> {
  name = 'bitbucket.search_results.satisfaction.no.clicked';
}

export class SearchSatisfactionExitFact extends Fact<void> {
  name = 'bitbucket.search_results.satisfaction.exit.clicked';
}

type SearchSatisfactionModalSubmitProps = {
  response: string;
  followup: boolean;
};

export class SearchSatisfactionModalSubmitFact extends Fact<
  SearchSatisfactionModalSubmitProps
> {
  name = 'bitbucket.search_results.satisfaction.modal.submit';
}
