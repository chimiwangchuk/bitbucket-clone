import Tag from '@atlaskit/tag';
import React, { PureComponent } from 'react';

import TagIcon from './tag-icon';

type Props = {
  /** The name of the tag. */
  name: string;
};

export default class RefTag extends PureComponent<Props> {
  render() {
    return (
      <Tag
        text={this.props.name}
        elemBefore={<TagIcon label={this.props.name} />}
      />
    );
  }
}
