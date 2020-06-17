import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import InlineMessage from '@atlaskit/inline-message';
import Spinner from '@atlaskit/spinner';
import React, { Component, Fragment, ReactNode } from 'react';
import AnimateHeight from 'react-animate-height';
import { injectIntl, InjectedIntl } from 'react-intl';

import { ExpanderOnChangeEvent } from '../types';
import messages from './i18n';
import * as styles from './styles';

type ExpanderProps = {
  children?: ReactNode;
  hasError?: boolean;
  icon?: JSX.Element;
  isCollapsed?: boolean;
  defaultIsCollapsed?: boolean;
  intl: InjectedIntl;
  isLoading?: boolean;
  label: ReactNode;
  iconSecondary?: JSX.Element;
  onChange?: (event: ExpanderOnChangeEvent) => void;
  ariaLabel?: string;
  renderSecondaryIcon?: (isCollapsed: boolean) => ReactNode;
  dataTestId?: string;
  isPanelBodyOverflowVisible?: boolean;
};

type ExpanderState = {
  isCollapsed: boolean;
};

type DefaultProps = {
  hasError: boolean;
  defaultIsCollapsed: boolean;
  isLoading: boolean;
  onChange: (event: ExpanderOnChangeEvent) => void;
};

type Props = ExpanderProps & DefaultProps;

class Expander extends Component<Props, ExpanderState> {
  static defaultProps = {
    hasError: false,
    defaultIsCollapsed: false,
    isLoading: false,
    onChange: () => {},
    dataTestId: '',
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isCollapsed:
        props.isCollapsed !== undefined
          ? props.isCollapsed
          : props.defaultIsCollapsed,
    };
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  static getDerivedStateFromProps(prevProps, state) {
    if (prevProps.isCollapsed === undefined) {
      // then the expander is not controlled, leave state unmodified
      return null;
    } else if (prevProps.isCollapsed !== state.isCollapsed) {
      // then the expander is controlled, and syncing is off
      return {
        isCollapsed: !!prevProps.isCollapsed,
      };
    }
    // eslint requires returning
    return null;
  }

  isControlled = () => this.props.isCollapsed !== undefined;

  isCollapsed = (props: Props): boolean => {
    const isCollapsedByProps = this.isControlled() && this.props.isCollapsed;
    return (
      !this.isExpandable(props) || isCollapsedByProps || this.state.isCollapsed
    );
  };
  // Use `.toArray().length` because `.count()` includes children with the
  // value `false` in its calculation
  isExpandable = (props: Props): boolean =>
    React.Children.toArray(props.children).length > 0 &&
    !props.isLoading &&
    !this.props.hasError;

  toggleCollapse = (): void => {
    if (!this.isExpandable(this.props)) {
      return;
    }

    const nextState = !this.state.isCollapsed;
    this.props.onChange({ isCollapsed: nextState });

    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed,
    }));
  };

  renderSecondaryIcon = (isCollapsed: boolean) => {
    const { iconSecondary = null, renderSecondaryIcon } = this.props;

    if (renderSecondaryIcon) {
      return renderSecondaryIcon(isCollapsed);
    }

    return isCollapsed && iconSecondary ? (
      <styles.IconSecondary>{iconSecondary}</styles.IconSecondary>
    ) : null;
  };

  renderHeading() {
    const { children, hasError, icon, intl, isLoading, label } = this.props;

    if (isLoading) {
      return (
        <styles.Spinner>
          <Spinner size="small" />
        </styles.Spinner>
      );
    }

    const errorIcon = () => (
      <styles.WarningWrapper>
        {children ? (
          <InlineMessage placement="bottom-start" type="warning">
            {children}
          </InlineMessage>
        ) : (
          <WarningIcon label="" />
        )}
      </styles.WarningWrapper>
    );

    const collapseLabel = intl.formatMessage(messages.collapseIconLabel);
    const expandLabel = intl.formatMessage(messages.expandIconLabel);
    const isCollapsed = this.isCollapsed(this.props);

    return (
      <Fragment>
        {icon ? <styles.Icon>{icon}</styles.Icon> : null}
        {hasError ? errorIcon() : null}
        {hasError ? null : (
          <Fragment>
            <styles.PanelHeadingLabel>{label}</styles.PanelHeadingLabel>
            {this.renderSecondaryIcon(isCollapsed)}
          </Fragment>
        )}
        {this.isExpandable(this.props) && (
          <styles.Chevron>
            {isCollapsed ? (
              <ChevronRightIcon label={expandLabel} />
            ) : (
              <ChevronDownIcon label={collapseLabel} />
            )}
          </styles.Chevron>
        )}
      </Fragment>
    );
  }

  render() {
    const {
      ariaLabel,
      isCollapsed,
      dataTestId,
      isPanelBodyOverflowVisible,
    } = this.props;
    const thisIsCollapsed = this.isControlled()
      ? !!isCollapsed
      : this.state.isCollapsed;

    return (
      <styles.Panel aria-label={ariaLabel}>
        <styles.PanelHeading
          isCollapsed={thisIsCollapsed}
          isExpandable={this.isExpandable(this.props)}
          onClick={this.toggleCollapse}
          data-testid={
            dataTestId &&
            `${thisIsCollapsed ? 'expand' : 'collapse'}-${dataTestId}`
          }
        >
          {this.renderHeading()}
        </styles.PanelHeading>
        {this.isExpandable(this.props) && (
          <AnimateHeight
            duration={200}
            easing="linear"
            height={thisIsCollapsed ? 0 : 'auto'}
          >
            <styles.PanelBody isOverflowVisible={isPanelBodyOverflowVisible}>
              {this.props.children}
            </styles.PanelBody>
          </AnimateHeight>
        )}
      </styles.Panel>
    );
  }
}
export default injectIntl(Expander as React.ComponentClass<ExpanderProps>);
