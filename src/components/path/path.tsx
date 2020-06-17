import React, { Fragment, PureComponent, ReactNode } from 'react';
import * as styles from './path.style';

export type PathProps = {
  children: ReactNode;
  separator: string;
};

export default class Path extends PureComponent<PathProps> {
  static defaultProps = {
    separator: '/',
  };

  render() {
    const { children, separator } = this.props;
    const childrenArray = React.Children.toArray(children);
    const Separator = <styles.Separator>{separator}</styles.Separator>;

    if (!childrenArray.length) {
      return null;
    }

    return (
      <Fragment>
        {childrenArray.reduce((acc, child, i) => {
          const notLastSegment = i < childrenArray.length - 1;
          const newChildren = [
            ...acc,
            <styles.Segment key={`path-segment-${i}`}>
              {child}
              {notLastSegment && Separator}
            </styles.Segment>,
          ];
          return newChildren;
        }, [])}
      </Fragment>
    );
  }
}
