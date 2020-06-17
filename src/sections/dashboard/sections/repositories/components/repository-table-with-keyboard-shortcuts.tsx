import React, { Component } from 'react';

import { WithListKeyboardShortcuts } from 'src/components/list-keyboard-shortcuts';

import { RepositoryTableProps } from 'src/components/repository-table/repository-table';
import RepositoryTable from './repository-table';
import messages from './repository-table-with-keyboard-shortcuts.i18';

export default class RepositoryTableWithKeyboardShortcuts extends Component<
  RepositoryTableProps
> {
  render() {
    return (
      <WithListKeyboardShortcuts
        messages={messages}
        rows={this.props.repositories}
        isLoading={this.props.isLoading}
      >
        {({ focusedRowIndex }) => (
          <RepositoryTable {...this.props} focusedRowIndex={focusedRowIndex} />
        )}
      </WithListKeyboardShortcuts>
    );
  }
}
