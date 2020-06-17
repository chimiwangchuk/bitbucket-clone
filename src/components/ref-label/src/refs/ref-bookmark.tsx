import Tag from '@atlaskit/tag';
import React, { PureComponent } from 'react';

import BookmarkIcon from './bookmark-icon';

type Props = {
  /** The name of the bookmark. */
  name: string;
};

export default class RefBookmark extends PureComponent<Props> {
  render() {
    return (
      <Tag
        text={this.props.name}
        elemBefore={<BookmarkIcon label={this.props.name} />}
      />
    );
  }
}
