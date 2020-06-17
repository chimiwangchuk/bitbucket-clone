// @ts-ignore TODO: fix noImplicitAny error here
import Select from '@atlaskit/select';
import { gridSize } from '@atlaskit/theme';
import React from 'react';
import { defineMessages, injectIntl, InjectedIntl } from 'react-intl';

import { RepositoryFilters } from 'src/sections/dashboard/types';

import * as filtersStyles from './filters.styles';

export type Props = {
  intl: InjectedIntl;
  scm: 'git' | 'hg' | null;
  onFilterChange: (filter: Partial<RepositoryFilters>) => void;
};

const { typeLabel } = defineMessages({
  typeLabel: {
    id: 'frontbucket.dashboard.repositories.typeFilter',
    description: 'Button name for type filter',
    defaultMessage: 'Type',
  },
});

const options = [
  {
    label: 'Git',
    value: 'git',
  },
  {
    label: 'Mercurial',
    value: 'hg',
  },
];

// @ts-ignore TODO: fix noImplicitAny error here
const getSelected = scm => options.find(o => o.value === scm);

class ScmFilter extends React.Component<Props> {
  // @ts-ignore TODO: fix noImplicitAny error here
  handleFilterChange = e => {
    this.props.onFilterChange({ scm: e ? e.value : null });
  };

  render() {
    const selectedOption = getSelected(this.props.scm);

    return (
      <div>
        <Select
          onChange={this.handleFilterChange}
          isClearable
          placeholder={this.props.intl.formatMessage(typeLabel)}
          options={options}
          value={selectedOption}
          styles={{
            // @ts-ignore TODO: fix noImplicitAny error here
            control: (css, state) => ({
              ...css,
              ...filtersStyles.subtleSelector(css, state),
              width: selectedOption ? gridSize() * 20 : gridSize() * 14,
            }),
            // @ts-ignore TODO: fix noImplicitAny error here
            menu: css => ({
              ...css,
              minWidth: gridSize() * 14,
            }),
            // @ts-ignore TODO: fix noImplicitAny error here
            placeholder: css => ({
              ...css,
              ...filtersStyles.nothingSelectedColor(),
            }),
          }}
        />
      </div>
    );
  }
}

export default injectIntl(ScmFilter);
