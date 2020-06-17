import React, { ReactNode } from 'react';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import InfoIcon from '@atlaskit/icon/glyph/info';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';
import * as styles from './generic-message.style';

type GenericMessageProps = {
  iconType?: 'connectivity' | 'confirmation' | 'info' | 'warning' | 'error';
  title: ReactNode;
  children?: ReactNode;
  messageType?: string;
  className?: string;
};

// @ts-ignore TODO: fix noImplicitAny error here
const iconMap = key => {
  const icons: object = {
    connectivity: <ErrorIcon primaryColor={colors.B400} label="" />,
    confirmation: <CheckCircleIcon primaryColor={colors.G300} label="" />,
    info: <InfoIcon primaryColor={colors.P300} label="" />,
    warning: <WarningIcon primaryColor={colors.Y300} label="" />,
    error: <ErrorIcon primaryColor={colors.R300} label="" />,
  };
  // @ts-ignore TODO: fix noImplicitAny error here
  return icons[key] || null;
};

export default class GenericMessage extends React.PureComponent<
  GenericMessageProps
> {
  render() {
    const { iconType, title, messageType, className } = this.props;

    return (
      <styles.GenericMessageWrapper
        messageType={messageType}
        className={className}
      >
        <styles.GenericMessageHeader>
          {iconMap(iconType)}
          <styles.GenericMessageTitle>{title}</styles.GenericMessageTitle>
        </styles.GenericMessageHeader>
        {this.props.children}
      </styles.GenericMessageWrapper>
    );
  }
}
