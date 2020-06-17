import React from 'react';
import { debounce } from 'lodash-es';
import { FieldTextStateless } from '@atlaskit/field-text';
import { InjectedIntl, injectIntl } from 'react-intl';
import { RepositoryFilters } from '../../../types';
import i18n from './search-filter.18n';

export type Props = {
  search: string | null | undefined;
  onFilterChange: (filter: Partial<RepositoryFilters>) => void;
  intl: InjectedIntl;
};

export type State = {
  currentSearch: string | null | undefined;
  lastSearch: string | null | undefined;
};

export const DEBOUNCE_DELAY = 300;

export class SearchFilter extends React.Component<Props, State> {
  state = {
    currentSearch: this.props.search,
    lastSearch: this.props.search,
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.search !== prevState.lastSearch) {
      return {
        currentSearch: nextProps.search,
        lastSearch: nextProps.search,
      };
    }

    return null;
  }

  notifyFilterChanged = (search: string) =>
    this.props.onFilterChange({ search });

  debouncedFilterValueHandler = debounce(
    this.notifyFilterChanged,
    DEBOUNCE_DELAY
  );

  // @ts-ignore TODO: fix noImplicitAny error here
  handleFilterChange = e => {
    const currentSearch: string = e.currentTarget.value;

    this.setState({ currentSearch });
    this.debouncedFilterValueHandler(currentSearch);
  };

  render() {
    const placeholder = this.props.intl.formatMessage(i18n.placeholder);

    return (
      <FieldTextStateless
        isLabelHidden
        shouldFitContainer
        value={this.state.currentSearch || ''}
        onChange={this.handleFilterChange}
        placeholder={placeholder}
      />
    );
  }
}

export default injectIntl(SearchFilter);
