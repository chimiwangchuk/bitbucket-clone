import React, { PureComponent, Fragment } from 'react';
import { ErrorState } from '@atlassian/bitbucket-generic-message';

import TransparentLoadingCover from './transparent-loading-cover';

import * as styles from './pageable-table.style';

export type PageableTableProps<Row> = {
  children: (row: Row, index: number) => JSX.Element;
  renderEmptyState: () => JSX.Element;
  onClickErrorState?: () => void;
  isError: boolean;
  isLoading: boolean;
  renderBeforeRows?: (() => JSX.Element) | null | undefined;
  renderColumnDefinitions: () => JSX.Element;
  renderHeaders?: (() => JSX.Element) | null;
  renderPagination?: (() => JSX.Element) | null;
  rows: Row[];
  shouldShowLoadingCover: boolean;
};

export default class PageableTable<Row> extends PureComponent<
  PageableTableProps<Row>
> {
  static defaultColumnDefinitions = () => null;

  static defaultEmptyState = () => null;

  static defaultProps = {
    renderEmptyState: PageableTable.defaultEmptyState,
    isError: false,
    isLoading: false,
    renderBeforeRows: null,
    renderColumnDefinitions: PageableTable.defaultColumnDefinitions,
    renderHeaders: null,
    renderPagination: null,
    rows: [],
    shouldShowLoadingCover: true,
  };

  renderTableRows() {
    const { children, rows, renderBeforeRows } = this.props;

    return (
      <Fragment>
        {renderBeforeRows && renderBeforeRows()}
        {rows.map(children)}
      </Fragment>
    );
  }

  renderTable() {
    const {
      renderEmptyState,
      isLoading,
      rows,
      renderColumnDefinitions,
      renderHeaders,
      renderPagination,
    } = this.props;

    const shouldRenderEmptyState = !isLoading && !rows.length;

    return (
      <Fragment>
        <styles.Table isLoading={isLoading}>
          {renderColumnDefinitions()}
          {renderHeaders && <thead>{renderHeaders()}</thead>}
          <styles.TableBody showHeaders={!!renderHeaders}>
            {shouldRenderEmptyState
              ? renderEmptyState()
              : this.renderTableRows()}
          </styles.TableBody>
        </styles.Table>
        {renderPagination && renderPagination()}
      </Fragment>
    );
  }

  render() {
    const {
      isError,
      isLoading,
      onClickErrorState,
      shouldShowLoadingCover,
    } = this.props;

    if (isError) {
      return <ErrorState onClick={onClickErrorState} />;
    }

    return (
      <styles.Container>
        {shouldShowLoadingCover && isLoading && <TransparentLoadingCover />}
        {this.renderTable()}
      </styles.Container>
    );
  }
}
