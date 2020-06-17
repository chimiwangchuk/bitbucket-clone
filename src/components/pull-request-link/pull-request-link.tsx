import React, { PureComponent, ReactNode } from 'react';
import { connect } from 'react-redux';
import { BucketState } from 'src/types/state';
import {
  getIsNewCodeReviewEnabled,
  getIsForceOldCodeReview,
  getIsNewCodeReviewEnabledForTeam,
} from 'src/selectors/feature-selectors';
import { ApdexTask } from 'src/types/apdex';
import { startApdex } from 'src/utils/analytics/apdex';
import RelativeLink from 'src/components/relative-link';

export type OwnProps = {
  children?: ReactNode | null | undefined;
  // Allow styled-component style overrides
  className?: string;
  title: string;
  href: string;
  qaId?: string;
  isFocused?: boolean;
  onClick?: () => void;
  disableNativeTooltip?: boolean;
};

type StateProps = {
  isSpa: boolean;
};

type Props = StateProps & OwnProps;

export class BasePullRequestLink extends PureComponent<Props> {
  linkRef: HTMLAnchorElement | null | undefined;

  componentDidUpdate(prevProps: OwnProps) {
    if (!this.linkRef) {
      return;
    }

    if (!prevProps.isFocused && this.props.isFocused) {
      this.linkRef.focus();
      return;
    }

    if (prevProps.isFocused && !this.props.isFocused) {
      this.linkRef.blur();
    }
  }

  render() {
    const {
      children,
      className,
      isSpa,
      href,
      title,
      qaId,
      disableNativeTooltip,
    } = this.props;
    const content = children || title;
    const onClick = () => {
      startApdex({
        task: ApdexTask.PullRequest,
        type: 'transition',
      });
      if (this.props.onClick) {
        this.props.onClick();
      }
    };

    const linkTitle = !disableNativeTooltip ? title : undefined;

    /* eslint-disable no-return-assign */
    return isSpa ? (
      <RelativeLink
        innerRef={node => (this.linkRef = node)}
        to={href}
        data-qa={qaId}
        className={className}
        title={linkTitle}
        onClick={onClick}
      >
        {content}
      </RelativeLink>
    ) : (
      <a
        ref={node => (this.linkRef = node)}
        href={href}
        data-qa={qaId}
        className={className}
        title={linkTitle}
      >
        {content}
      </a>
    );
    /* eslint-enable no-return-assign */
  }
}

const mapStateToProps = (state: BucketState) => ({
  isSpa:
    (getIsNewCodeReviewEnabled(state) ||
      getIsNewCodeReviewEnabledForTeam(state)) &&
    !getIsForceOldCodeReview(state),
});
export default connect(mapStateToProps)(BasePullRequestLink);
