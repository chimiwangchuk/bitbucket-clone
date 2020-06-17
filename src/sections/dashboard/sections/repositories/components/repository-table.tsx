import React, { PureComponent, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import RepositoryLink from 'src/components/repository-link';
import repositoryUrls from 'src/sections/repository/urls';
import { RepositoryTableProps as BaseRepositoryTableProps } from 'src/components/repository-table';
import BaseRepositoryTable from 'src/containers/repository-table';

import messages from './repository-table.i18n';
import * as styles from './repository-table.styled';

export type RepositoryTableProps = {
  filterApplied?: boolean;
  focusedRowIndex?: number | null | undefined;
};

export default class RepositoryTable extends PureComponent<
  RepositoryTableProps & BaseRepositoryTableProps
> {
  render() {
    const {
      filterApplied,
      repositories,
      renderControl,
      renderPagination,
      emptyMessage,
      summaryHeader,
      isLoading,
      focusedRowIndex,
    } = this.props;
    return (
      <Fragment>
        {filterApplied && !repositories.length ? (
          <styles.EmptyResults>
            <h3>
              <FormattedMessage {...messages.emptyResultsHeading} />
            </h3>
            <styles.EmptyResultsInfo>
              <FormattedMessage
                {...messages.emptyStateWithSearch}
                values={{
                  createRepositoryLink: (
                    <styles.NoWrapContainer>
                      <a href={repositoryUrls.ui.create()}>
                        <FormattedMessage {...messages.createLink} />
                      </a>
                    </styles.NoWrapContainer>
                  ),
                }}
              />
            </styles.EmptyResultsInfo>
          </styles.EmptyResults>
        ) : (
          <BaseRepositoryTable
            repositoryLinkComponent={RepositoryLink}
            repositories={repositories}
            renderControl={renderControl}
            renderPagination={renderPagination}
            emptyMessage={emptyMessage}
            summaryHeader={summaryHeader}
            isLoading={isLoading}
            focusedRowIndex={focusedRowIndex}
          />
        )}
      </Fragment>
    );
  }
}
