import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type ProvidedProps = {
  filepath: string;
  isDeleted?: boolean;
};

export type SourceViewLinkProps = {
  hasNewSourceEnabled?: boolean;
  viewHref: string;
  children: ReactNode;
  target?: string;
  className?: string;
  role?: string;
  onClick?: () => void;
};

export const SourceViewLink = React.forwardRef(
  (
    props: SourceViewLinkProps & ProvidedProps,
    ref: (node: HTMLAnchorElement | null) => void
  ) =>
    props.hasNewSourceEnabled ? (
      <Link
        to={props.viewHref}
        target={props.target}
        className={props.className}
        innerRef={ref}
        role={props.role}
        onClick={props.onClick}
      >
        {props.children}
      </Link>
    ) : (
      <a
        href={props.viewHref}
        target={props.target}
        className={props.className}
        ref={ref}
        role={props.role}
        onClick={props.onClick}
      >
        {props.children}
      </a>
    )
);
