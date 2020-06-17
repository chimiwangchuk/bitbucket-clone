import React, { Component } from 'react';

import InfoIcon from '@atlaskit/icon/glyph/info';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';
import { Expander } from 'src/components/sidebar';

import * as styles from './details-card.styled';

type Props = {
  icon?: JSX.Element;
  isCollapsed: boolean;
  label: string;
  isLoading: boolean;
};

export default class DetailsCard extends Component<Props> {
  static defaultProps = {
    icon: <InfoIcon label="info" />,
  };

  render() {
    const { isCollapsed, label, isLoading, icon } = this.props;
    if (isCollapsed) {
      return (
        <Tooltip position="left" content={label}>
          <Button appearance="subtle" iconBefore={icon} />
        </Tooltip>
      );
    }
    return (
      <styles.Card>
        <Expander icon={icon} label={label} isLoading={isLoading}>
          {this.props.children}
        </Expander>
      </styles.Card>
    );
  }
}
