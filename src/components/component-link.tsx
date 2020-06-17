import React, { PureComponent, ReactNode } from 'react';

import Link from './relative-link';

type ComponentLinkProxyProps = {
  // @ts-ignore TODO: fix noImplicitAny error here
  innerRef?: (ReactNode) => void;
  children: ReactNode;
  // Atlaskit requires this prop to be passed so they can pass some style info
  className?: string;
  href: string;
  // Required to be able to attach analytics event-firing handlers (ex: when used as a linkComponent in AK Navigation)
  qaId?: string;
  title?: string;
  onClick?: (event: React.SyntheticEvent<HTMLAnchorElement>) => any;
  // Some Atlaskit components use this prop to change their state (ex: it's required so NavigationItem doesn't stay focused after it's clicked)
  onMouseDown?: (event: React.SyntheticEvent<HTMLAnchorElement>) => any;
  // Other events that AK may try to pass down
  onFocus?: (event: React.SyntheticEvent<HTMLAnchorElement>) => any;
  onKeyDown?: (event: React.SyntheticEvent<HTMLAnchorElement>) => any;
  onMouseEnter?: (event: React.SyntheticEvent<HTMLAnchorElement>) => any;
  onMouseLeave?: (event: React.SyntheticEvent<HTMLAnchorElement>) => any;
};

/**
 * Some Atlaskit components that accept a custom `component` prop (like @atlaskit/button) have
 * a component proxy that catches any unneeded/unwanted props and avoids passing them through
 * to the underlying custom component or DOM node
 *
 * see: https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/core/button/src/components/CustomComponentProxy.js
 *
 * However, some do not (like @atlaskit/avatar or the `linkComponent` used in @atlaskit/navigation).
 * For these cases, we need to filter the props being passed ourselves
 */
export class ComponentLinkProxy extends PureComponent<ComponentLinkProxyProps> {
  render() {
    const {
      href,
      children,
      className,
      onClick,
      onFocus,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      qaId,
      title,
      innerRef,
    } = this.props;

    return (
      <Link
        to={href}
        className={className}
        data-qa={qaId}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        title={title}
        innerRef={innerRef}
      >
        {children}
      </Link>
    );
  }
}

type ComponentLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  onMouseEnter?: (event: React.SyntheticEvent<HTMLAnchorElement>) => any;
  onMouseLeave?: (event: React.SyntheticEvent<HTMLAnchorElement>) => any;
};

export class ComponentLink extends PureComponent<ComponentLinkProps> {
  render() {
    const { href, children, ...otherProps } = this.props;
    return (
      <Link {...otherProps} to={href}>
        {children}
      </Link>
    );
  }
}
