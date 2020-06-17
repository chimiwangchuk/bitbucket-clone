import React, { PureComponent } from 'react';
import Pagination from '@atlaskit/pagination';
import { ComponentLink } from 'src/components/component-link';
import { publishUiEvent } from 'src/utils/analytics/publish';

import { Page } from 'src/types/pagination';

import * as styles from './pagination.styled';

export type PaginationPropTypes = {
  isError: boolean;
  isLoading: boolean;
  page: number;
  pages: Page[];
  onPageChange: (page?: Page) => void;
  uiEventSource: string;
  uiEventSubjectId: string;
  publishEvent: boolean;
};

export default class RouterPagination extends PureComponent<
  PaginationPropTypes
> {
  static defaultProps = {
    publishEvent: true,
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  handlePageChange = (_e, newPage) => {
    const {
      publishEvent,
      uiEventSource,
      uiEventSubjectId,
      onPageChange,
    } = this.props;

    if (publishEvent) {
      publishUiEvent({
        action: 'clicked',
        actionSubject: 'button',
        source: uiEventSource || 'pagination',
        actionSubjectId: uiEventSubjectId || 'pagination',
      });
    }

    onPageChange(newPage);
  };

  getPageLabel = (pageItem: Page) => pageItem.label;

  render() {
    const { isError, isLoading, page, pages } = this.props;

    if (isError || isLoading || pages.length === 1) {
      return null;
    }

    const selectedPageIndex = page - 1;

    return (
      <styles.Pagination>
        <Pagination
          pages={pages}
          onChange={this.handlePageChange}
          selectedIndex={selectedPageIndex}
          getPageLabel={this.getPageLabel}
          components={{
            Previous: props =>
              selectedPageIndex <= 0 ? null : (
                <ComponentLink
                  {...props}
                  href={pages[selectedPageIndex - 1].href}
                />
              ),
            Page: props => <ComponentLink {...props} href={props.page.href} />,
            Next: props =>
              selectedPageIndex >= pages.length - 1 ? null : (
                <ComponentLink
                  {...props}
                  href={pages[selectedPageIndex + 1].href}
                />
              ),
          }}
        />
      </styles.Pagination>
    );
  }
}
