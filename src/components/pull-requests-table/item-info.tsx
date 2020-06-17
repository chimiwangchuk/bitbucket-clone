import React, { PureComponent } from 'react';
import * as styles from './item-info.style';

type ItemInfoProps = {
  avatar: JSX.Element | null | undefined;
  byline: JSX.Element;
  header: JSX.Element;
};

export default class ItemInfo extends PureComponent<ItemInfoProps> {
  render() {
    return (
      <styles.Item>
        {!!this.props.avatar && (
          <styles.Avatar>{this.props.avatar}</styles.Avatar>
        )}
        <styles.Summary>
          {this.props.header}
          {this.props.byline}
        </styles.Summary>
      </styles.Item>
    );
  }
}
