import React from 'react';
import { LinkProps } from 'react-router-dom';
import { Link } from 'src/router/components';

import settings from 'src/settings';

export type RelativeLinkProps = LinkProps & {
  to: string;
  qaId?: string;
  className?: string;
};

export default class RelativeLink extends React.PureComponent<
  RelativeLinkProps
> {
  render() {
    const { to, children, className, qaId, ...rest } = this.props;
    return (
      <Link
        className={className}
        data-qa={qaId}
        to={to.replace(settings.CANON_URL, '')}
        {...rest}
      >
        {children}
      </Link>
    );
  }
}
