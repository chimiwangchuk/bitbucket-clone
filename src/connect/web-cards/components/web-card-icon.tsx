import React, { PureComponent } from 'react';
import styled from '@emotion/styled';

type WebCardIconProps = {
  label?: string;
  className?: string;
  url?: string;
};

const Icon = styled.span`
  height: 24px;
  width: 24px;
  &::before {
    font-size: 20px;
    margin-left: 2px;
    margin-top: -10px;
  }
`;

class WebCardIcon extends PureComponent<WebCardIconProps> {
  render() {
    const { label, className, url } = this.props;

    if (url) {
      return <img src={url} alt={label} width="24" height="24" />;
    }

    const klass = ['aui-icon', 'aui-icon-large', className].join(' ').trim();
    return <Icon className={klass} />;
  }
}

export default WebCardIcon;
