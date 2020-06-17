import React, { ReactNode } from 'react';
import cn from 'classnames';
import './styles.less';

// Only display content to screen readers
//
// See: https://a11yproject.com/posts/how-to-hide-content/
// See: https://hugogiraudel.com/2016/10/13/css-hide-and-seek/

export const ScreenReadersOnly = (props: {
  children: ReactNode;
  className?: string;
}) => (
  <span {...props} className={cn(props.className, 'sr-only')}>
    {props.children}
  </span>
);
