import React, { ReactNode } from 'react';

import { startApdex } from 'src/utils/analytics/apdex';
import { ApdexTask } from 'src/types/apdex';

import { ComponentLinkProxy as Link } from './component-link';

export type ApdexMeasuredLinkProps = {
  children: ReactNode | null | undefined;
  className?: string;
  onClick?: (event: React.SyntheticEvent<HTMLAnchorElement>) => any;
  title?: string;
  qaId?: string;
  task: ApdexTask;
  to: string;
  // @ts-ignore TODO: fix noImplicitAny error here
  innerRef?: (ReactNode) => void;
};

export default class ApdexMeasuredLink extends React.PureComponent<
  ApdexMeasuredLinkProps
> {
  handleClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    const { task, onClick } = this.props;
    startApdex({
      task,
      type: 'transition',
    });
    if (onClick) {
      onClick(event);
    }
  };

  render() {
    const { children, to } = this.props;

    return (
      <Link {...this.props} href={to} onClick={this.handleClick}>
        {children}
      </Link>
    );
  }
}
