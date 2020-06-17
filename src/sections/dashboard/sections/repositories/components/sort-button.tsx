import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';

import messages from './sort-button.i18n';

type Props = {
  onClick: () => void;
  isAscending?: boolean;
};

export default class SortButton extends PureComponent<Props> {
  render() {
    return (
      <Button
        appearance="subtle"
        iconAfter={
          this.props.isAscending ? (
            <ChevronUpIcon label="asc" />
          ) : (
            <ChevronDownIcon label="desc" />
          )
        }
        onClick={this.props.onClick}
      >
        <FormattedMessage {...messages.lastUpdated} />
      </Button>
    );
  }
}
