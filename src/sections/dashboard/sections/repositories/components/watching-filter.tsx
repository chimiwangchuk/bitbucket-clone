import React from 'react';
import Button from '@atlaskit/button';
import { FormattedMessage } from 'react-intl';
import { RepositoryFilters } from 'src/sections/dashboard/types';
import i18n from './watching-filter.i18n';
import * as styles from './watching-filter.styles';

export type Props = {
  isWatching: boolean;
  onFilterChange: (filter: Partial<RepositoryFilters>) => void;
};

class WatchingFilter extends React.Component<Props> {
  handleFilterChange = () => {
    this.props.onFilterChange({ isWatching: !this.props.isWatching });
  };

  render() {
    return (
      <styles.WatchingContainer>
        <Button
          appearance="subtle"
          isSelected={this.props.isWatching}
          onClick={this.handleFilterChange}
        >
          <FormattedMessage {...i18n.isWatching} />
        </Button>
      </styles.WatchingContainer>
    );
  }
}

export default WatchingFilter;
