import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { BuildStatus } from 'src/components/types';
import { ExpanderOnChangeEvent } from 'src/components/sidebar';

import { getCurrentRepositoryFullSlug } from 'src/selectors/repository-selectors';

import { clearFavicon, updateFavicon } from 'src/redux/favicon';
import defaultIcon from 'src/components/favicon/build-favicon-default.ico';
import failedBuildIcon from 'src/components/favicon/build-favicon-failed.ico';
import runningBuildIcon from 'src/components/favicon/build-favicon-running.ico';
import stoppedBuildIcon from 'src/components/favicon/build-favicon-stopped.ico';
import successBuildIcon from 'src/components/favicon/build-favicon-succeeded.ico';
import store from 'src/utils/store';
import authRequest from 'src/utils/fetch';

import BaseBuildStatusCard from 'src/components/build-status-card';
import { getBuildStatuses } from 'src/components/build-status-card/utils';
import { BucketState } from 'src/types/state';

type BuildStatusProps = {
  builds?: BuildStatus[];
  repositoryFullSlug?: string;
  buildStatusURL: string;
  repositoryMetadataURL: string;
  isCollapsed: boolean;
  updateFavicon: (icon: string) => void;
  clearFavicon: () => void;
  updatesFavicon?: boolean;
  onBuildsLoaded?: (builds: BuildStatus[]) => void;
};

type BuildStatusState = {
  builds: BuildStatus[];
  hasStatuses: boolean;
  isLoading: boolean;
  hasError: boolean;
};

const BUILD_CARD_COLLAPSED_LOCALSTORAGE_KEY = 'build.card.collapsed';

class BuildStatusCard extends PureComponent<
  BuildStatusProps,
  BuildStatusState
> {
  static defaultProps = {
    isCollapsed: false,
    updatesFavicon: false,
  };

  state = {
    builds: [],
    hasStatuses: false,
    isLoading: true,
    hasError: false,
  };

  componentDidMount() {
    const { buildStatusURL, repositoryMetadataURL } = this.props;
    this.fetchStatuses(repositoryMetadataURL, buildStatusURL);
  }

  UNSAFE_componentWillReceiveProps(nextProps: BuildStatusProps) {
    const { buildStatusURL, repositoryMetadataURL } = nextProps;
    if (
      buildStatusURL !== this.props.buildStatusURL ||
      repositoryMetadataURL !== this.props.repositoryMetadataURL
    ) {
      this.fetchStatuses(repositoryMetadataURL, buildStatusURL);
    }
  }

  componentWillUnmount() {
    this.props.clearFavicon();
  }

  getBuildStatusIcon(): string {
    const { builds } = this.state;

    if (builds.length === 0) {
      return defaultIcon;
    }

    const { FAILED, SUCCESSFUL, STOPPED } = getBuildStatuses(builds);

    if (FAILED) {
      return failedBuildIcon;
    }
    if (STOPPED) {
      return stoppedBuildIcon;
    }
    if (builds.length === SUCCESSFUL) {
      return successBuildIcon;
    }

    return runningBuildIcon;
  }

  onUpdateFavicon() {
    const icon = this.getBuildStatusIcon();
    this.props.updateFavicon(icon);
  }

  fetchStatuses = async (
    repositoryMetadataURL: string,
    buildStatusesUrl: string
  ) => {
    if (
      !repositoryMetadataURL ||
      !buildStatusesUrl ||
      this.props.isCollapsed ||
      this.props.builds
    ) {
      return;
    }

    this.setState({
      isLoading: true,
      hasStatuses: false,
    });

    try {
      const getRepositoryMetadataResponse = await fetch(
        authRequest(repositoryMetadataURL)
      );
      const {
        has_statuses: hasStatuses,
      } = await getRepositoryMetadataResponse.json();

      if (!hasStatuses) {
        this.setState({
          hasStatuses,
          isLoading: false,
        });
        return;
      }

      const getBuildStatusesResponse = await fetch(
        authRequest(buildStatusesUrl)
      );
      if (!getBuildStatusesResponse.ok) {
        this.setState({
          isLoading: false,
          hasError: true,
        });
        return;
      }
      const { values: builds } = await getBuildStatusesResponse.json();

      this.setState({
        builds,
        hasStatuses,
        isLoading: false,
        hasError: false,
      });

      if (this.props.updatesFavicon) {
        this.onUpdateFavicon();
      }

      if (this.props.onBuildsLoaded) {
        this.props.onBuildsLoaded(builds);
      }
    } catch (e) {
      this.setState({
        isLoading: false,
        hasError: true,
      });
    }
  };

  onCardStatusChange = (event: ExpanderOnChangeEvent) => {
    store.set(BUILD_CARD_COLLAPSED_LOCALSTORAGE_KEY, event.isCollapsed);
  };

  initialCardIsCollapsed = () =>
    store.get(BUILD_CARD_COLLAPSED_LOCALSTORAGE_KEY, false);

  render() {
    const {
      isCollapsed,
      repositoryFullSlug,
      builds: buildsFromProps = [],
    } = this.props;
    const { builds, hasStatuses, isLoading, hasError } = this.state;
    const buildsList = builds.length ? builds : buildsFromProps;

    return (
      <BaseBuildStatusCard
        builds={buildsList}
        hasError={hasError}
        isCollapsed={isCollapsed}
        initialCardIsCollapsed={this.initialCardIsCollapsed()}
        onChange={this.onCardStatusChange}
        isLoading={isLoading}
        hasStatuses={hasStatuses}
        repositoryFullSlug={repositoryFullSlug}
        onErrorClick={() =>
          this.fetchStatuses(
            this.props.repositoryMetadataURL,
            this.props.buildStatusURL
          )
        }
      />
    );
  }
}

const mapStateToProps = (state: BucketState) => ({
  repositoryFullSlug: getCurrentRepositoryFullSlug(state),
});
const mapDispatchToProps = { clearFavicon, updateFavicon };

export default connect(mapStateToProps, mapDispatchToProps)(BuildStatusCard);
