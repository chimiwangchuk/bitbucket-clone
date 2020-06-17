import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RepositoryFilters } from 'src/sections/dashboard/types';
import OwnersFilter from 'src/sections/dashboard/sections/repositories/containers/owners-filters';
import WorkspacesFilter from 'src/sections/dashboard/sections/repositories/containers/workspaces-filter';
import { startApdex } from 'src/utils/analytics/apdex';
import { ApdexTask } from 'src/types/apdex';
import { BucketState } from 'src/types/state';
import ProjectFilter from '../containers/project-filter';
import SearchFilter from './search-filter';
import WatchingFilter from './watching-filter';
import ScmFilter from './scm-filter';
import * as styles from './filters.styles';

export type Props = {
  filters: RepositoryFilters;
  onFilterChange: (filters: RepositoryFilters) => void;
  hasWorkspaceUi: boolean;
};

// exporting class for testing
export class Filters extends PureComponent<Props> {
  onFilterChange = (filter: Partial<RepositoryFilters>): void => {
    const { onFilterChange, filters } = this.props;

    startApdex({
      type: 'transition',
      task: ApdexTask.DashboardRepositories,
    });

    onFilterChange({ ...filters, ...filter });
  };

  render() {
    const {
      hasWorkspaceUi,
      filters: { search, project, isWatching, owner, workspace, scm },
    } = this.props;

    return (
      <styles.Filters>
        <styles.SearchContainer>
          <SearchFilter search={search} onFilterChange={this.onFilterChange} />
        </styles.SearchContainer>
        {hasWorkspaceUi && (
          <styles.FilterContainer>
            <WorkspacesFilter
              selectedWorkspaceUuid={workspace}
              onFilterChange={this.onFilterChange}
            />
          </styles.FilterContainer>
        )}
        <styles.FilterContainer>
          <ProjectFilter
            selectedProjectInfo={project}
            onFilterChange={this.onFilterChange}
          />
        </styles.FilterContainer>
        {!hasWorkspaceUi && (
          <styles.FilterContainer>
            <OwnersFilter
              selectedOwnerUuid={owner}
              onFilterChange={this.onFilterChange}
            />
          </styles.FilterContainer>
        )}
        <styles.FilterContainer>
          <ScmFilter scm={scm} onFilterChange={this.onFilterChange} />
        </styles.FilterContainer>
        <styles.FilterContainer>
          <WatchingFilter
            isWatching={isWatching}
            onFilterChange={this.onFilterChange}
          />
        </styles.FilterContainer>
      </styles.Filters>
    );
  }
}

const mapStateToProps = (state: BucketState) => ({
  hasWorkspaceUi: state.global.features['workspace-ui'],
});

export default connect(mapStateToProps)(Filters);
