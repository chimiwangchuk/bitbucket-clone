import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import Spinner from '@atlaskit/spinner';
import { FormattedMessageProps } from 'src/types/messages';

type WatchPullRequestProps = {
  isLoading: boolean;
  isWatching: boolean;
  message: FormattedMessageProps;
  startWatch: () => void;
  stopWatch: () => void;
};

export default class WatchPullRequest extends PureComponent<
  WatchPullRequestProps
> {
  render() {
    const loadingIcon = <Spinner size="small" delay={250} />;
    const child = <FormattedMessage {...this.props.message} />;

    /* eslint-disable react/no-children-prop */
    return (
      <DropdownItem
        href="#"
        elemAfter={this.props.isLoading ? loadingIcon : null}
        isDisabled={this.props.isLoading}
        children={child}
        // @ts-ignore TODO: fix noImplicitAny error here
        onClick={event => {
          event.preventDefault();
          // eslint-disable-next-line no-unused-expressions
          this.props.isWatching
            ? this.props.stopWatch()
            : this.props.startWatch();
        }}
      />
    );
    /* eslint-enable react/no-children-prop */
  }
}
