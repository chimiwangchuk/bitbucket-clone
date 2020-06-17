import Tooltip from '@atlaskit/tooltip';
import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import { ShowMoreIcon, IconSizes } from '@atlassian/bitkit-icon';

import messages from '../i18n';

export type ShowMoreLinesButtonProps = {
  intl: InjectedIntl;
  onShowMoreLines: () => void;
  hasMoreLines: boolean;
  isLoading: boolean;
  isDummyChunk?: boolean;
};

class ShowMoreLinesButton extends PureComponent<ShowMoreLinesButtonProps> {
  props: ShowMoreLinesButtonProps;

  onClick = (): void => {
    const { onShowMoreLines, isLoading } = this.props;

    if (!isLoading) {
      onShowMoreLines();
    }
  };

  renderShowMoreControls() {
    const { intl, isLoading, isDummyChunk } = this.props;

    let dataQA = isDummyChunk
      ? 'pr-diff-show-more-lines-is-dummy-chunk'
      : 'pr-diff-show-more-lines';
    dataQA += isLoading ? '-is-loading' : '';

    return (
      <Tooltip
        content={intl.formatMessage(messages.showMoreLines)}
        position="right"
      >
        <span className="show-more-lines-wrapper">
          <button
            className="show-more-lines-button gutter-width-apply-width"
            onClick={this.onClick}
            data-qa={dataQA}
            style={{ cursor: 'pointer' }}
          >
            <ShowMoreIcon
              size={IconSizes.Medium}
              shouldAnimate={isLoading}
              label={intl.formatMessage(messages.showMoreIcon)}
            />
          </button>
        </span>
      </Tooltip>
    );
  }

  render() {
    const { hasMoreLines, isDummyChunk } = this.props;

    // a11y (screen readers): Do not render interactive element (button) if it has no content
    if (!hasMoreLines && isDummyChunk === undefined) {
      return null;
    }

    if (hasMoreLines) {
      return this.renderShowMoreControls();
    }

    return (
      <span className="show-more-lines-wrapper">
        <button className="show-more-lines-button gutter-width-apply-width" />
      </span>
    );
  }
}

export default injectIntl(ShowMoreLinesButton);
