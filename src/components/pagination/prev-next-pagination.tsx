import Button, { ButtonGroup } from '@atlaskit/button';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { publishUiEvent } from 'src/utils/analytics/publish';
import { paginationMessages } from 'src/i18n';

import * as styles from './pagination.styled';

export type PrevNextPaginationPropTypes = {
  nextUrl: string | undefined;
  previousUrl: string | undefined;
  onPageChange: () => void;
  component: React.ComponentType;
  uiEventSource?: string;
  publishEvent: boolean;
};

const buttonClickEventTemplate = {
  action: 'clicked',
  actionSubject: 'button',
};

export default class PrevNextPagination extends React.Component<
  PrevNextPaginationPropTypes
> {
  static defaultProps = {
    onPageChange: () => null,
    publishEvent: true,
  };

  handlePrevButtonClick = () => {
    if (this.props.publishEvent) {
      publishUiEvent({
        ...buttonClickEventTemplate,
        source: this.props.uiEventSource || 'prevNextPagination',
        actionSubjectId: 'paginationPrevPageButton',
      });
    }
    this.props.onPageChange();
  };

  handleNextButtonClick = () => {
    if (this.props.publishEvent) {
      publishUiEvent({
        ...buttonClickEventTemplate,
        source: this.props.uiEventSource || 'prevNextPagination',
        actionSubjectId: 'paginationNextPageButton',
      });
    }
    this.props.onPageChange();
  };

  render() {
    const { nextUrl, previousUrl, component } = this.props;

    if (!nextUrl && !previousUrl) {
      return null;
    }

    return (
      <styles.PaginationWrapper>
        <ButtonGroup appearance="link">
          <Button
            href={this.props.previousUrl}
            isDisabled={!this.props.previousUrl}
            component={this.props.previousUrl ? component : undefined}
            onClick={this.handlePrevButtonClick}
          >
            <FormattedMessage {...paginationMessages.previous} />
          </Button>
          <Button
            href={this.props.nextUrl}
            isDisabled={!this.props.nextUrl}
            component={this.props.nextUrl ? component : undefined}
            onClick={this.handleNextButtonClick}
          >
            <FormattedMessage {...paginationMessages.next} />
          </Button>
        </ButtonGroup>
      </styles.PaginationWrapper>
    );
  }
}
