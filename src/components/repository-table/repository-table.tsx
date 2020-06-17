import React, {
  PureComponent,
  ComponentType,
  ReactNode,
  Fragment,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { RepositoryLinkProps } from 'src/components/repository-link';
import { RenderProps } from 'src/components/list-keyboard-shortcuts';
import PageableTable, {
  TableHeaderMobileHidden,
  TableHeaderMobileOnly,
} from 'src/components/pageable-table';
import repositoryUrls from 'src/sections/repository/urls';
import { DetailedRepository } from 'src/sections/dashboard/types';
import Repository from './repository';
import messages from './repository-table.i18n';
import * as styles from './repository-table.style';

export type RepositoryTableProps = {
  renderControl?: () => ReactNode;
  renderPagination?: (() => JSX.Element) | null;
  isWorkspaceUiEnabled?: boolean;
  emptyMessage?: ReactNode;
  summaryHeader?: ReactNode;
  isLoading: boolean;
  repositories: DetailedRepository[];
  repositoryLinkComponent?: ComponentType<RepositoryLinkProps>;
};

export default class RepositoryTable extends PureComponent<
  RepositoryTableProps & RenderProps
> {
  static defaultProps = {
    repositories: [],
    focusedRowIndex: null,
  };

  renderDesktopHeaders() {
    const { summaryHeader, renderControl } = this.props;

    return (
      <Fragment>
        <TableHeaderMobileHidden colSpan={4}>
          {summaryHeader || (
            <FormattedMessage {...messages.tableHeaderSummary} />
          )}
        </TableHeaderMobileHidden>
        <TableHeaderMobileHidden colSpan={4}>
          <FormattedMessage {...messages.tableHeaderDescription} />
        </TableHeaderMobileHidden>
        <TableHeaderMobileHidden colSpan={2}>
          <FormattedMessage {...messages.tableHeaderBuilds} />
        </TableHeaderMobileHidden>
        <TableHeaderMobileHidden colSpan={2}>
          {renderControl && (
            <styles.ControlContainer>{renderControl()}</styles.ControlContainer>
          )}
        </TableHeaderMobileHidden>
      </Fragment>
    );
  }

  renderMobileHeaders() {
    const { summaryHeader } = this.props;

    return (
      <Fragment>
        <TableHeaderMobileOnly colSpan={7}>
          {summaryHeader || (
            <FormattedMessage {...messages.tableHeaderSummary} />
          )}
        </TableHeaderMobileOnly>
        <TableHeaderMobileOnly colSpan={3}>
          <FormattedMessage {...messages.tableHeaderBuilds} />
        </TableHeaderMobileOnly>
        <TableHeaderMobileOnly colSpan={2} />
      </Fragment>
    );
  }

  renderHeaders = () => {
    return (
      <tr>
        {this.renderDesktopHeaders()}
        {this.renderMobileHeaders()}
      </tr>
    );
  };

  renderEmptyMessage = () => {
    const { emptyMessage } = this.props;

    return (
      <tr>
        <styles.MessageCol colSpan={12}>
          {emptyMessage || (
            <FormattedMessage
              {...messages.emptyState}
              values={{
                createRepositoryLink: (
                  <a href={repositoryUrls.ui.create()}>
                    <FormattedMessage {...messages.createLink} />
                  </a>
                ),
              }}
            />
          )}
        </styles.MessageCol>
      </tr>
    );
  };

  render() {
    const {
      focusedRowIndex,
      isLoading,
      isWorkspaceUiEnabled,
      renderPagination,
      repositoryLinkComponent,
      repositories,
    } = this.props;

    return (
      <PageableTable
        renderEmptyState={this.renderEmptyMessage}
        isLoading={isLoading}
        rows={repositories}
        renderHeaders={this.renderHeaders}
        renderPagination={renderPagination}
      >
        {(repository, index) => (
          <Repository
            key={repository.uuid}
            repository={repository}
            isFocused={index === focusedRowIndex}
            isWorkspaceUiEnabled={isWorkspaceUiEnabled}
            repositoryLinkComponent={repositoryLinkComponent}
          />
        )}
      </PageableTable>
    );
  }
}
