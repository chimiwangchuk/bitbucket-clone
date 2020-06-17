import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import { gridSize } from '@atlaskit/theme';
import styled from '@emotion/styled';
import { CloneUrl, CloneProtocol } from '@atlassian/bitkit-clone-controls';
import { Repository } from 'src/components/types';

import GenericMessage from 'src/components/generic-message';

import requestMirrorCloneResource from '../utils/request-mirror-clone-resource';
import urls from '../urls';
import { Mirror, MirrorCloneResource } from '../types';
import messages from './mirror-clone-url.i18n';

type Props = {
  mirror: Mirror;
  protocol: CloneProtocol;
  repository: Repository;
};

type State = {
  hasError: boolean;
  isLoading: boolean;
  mirrorCloneResource: MirrorCloneResource | undefined;
};

export default class MirrorCloneUrl extends PureComponent<Props, State> {
  state: State = {
    hasError: false,
    isLoading: false,
    mirrorCloneResource: undefined,
  };

  componentDidMount() {
    if (this.props.mirror) {
      this.fetchCloneResource(this.props.mirror);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.mirror.url !== prevProps.mirror.url) {
      this.fetchCloneResource(this.props.mirror);
    }
  }

  fetchCloneResource(mirror: Mirror) {
    if (!mirror || !mirror.url) {
      return;
    }

    this.setState({
      hasError: false,
      isLoading: true,
    });

    try {
      requestMirrorCloneResource(mirror.url)
        .then(cloneResource => {
          if (
            cloneResource &&
            cloneResource.links &&
            cloneResource.links.clone
          ) {
            this.setState({
              hasError: false,
              isLoading: false,
              mirrorCloneResource: cloneResource,
            });
          } else {
            this.setState({ hasError: true, isLoading: false });
          }
        })
        .catch(() => this.setState({ hasError: true, isLoading: false }));
    } catch (e) {
      this.setState({ hasError: true, isLoading: false });
    }
  }

  /**
   * The `protocol` prop is inherited from the Clone Control component which supports `https` and `ssh`
   * If the mirror/server URL is `http`, show the HTTP clone link when HTTPS is selected in the dialog
   */
  getProtocolForComponent = (cloneResource: MirrorCloneResource) => {
    const { protocol } = this.props;
    const protocolsFromMirrors = cloneResource.links
      ? cloneResource.links.clone.map(link => link.name)
      : [];

    if (protocolsFromMirrors.includes(protocol)) {
      return protocol;
    } else if (protocol === 'https' && protocolsFromMirrors.includes('http')) {
      return 'http';
    }
    return protocol;
  };

  /**
   * The CloneURL component is expecting a repository object, so create one
   * with the clone URL pointing at a mirror.
   */
  repositoryWithMirrorLinks = (
    repository: Repository,
    mirrorCloneResource: MirrorCloneResource
  ) => ({
    ...repository,
    links: {
      ...repository.links,
      clone:
        mirrorCloneResource && mirrorCloneResource.links
          ? mirrorCloneResource.links.clone
          : [],
    },
  });

  renderError = (repository: Repository, mirror: Mirror) => (
    <GenericMessage
      key={mirror.id}
      iconType="warning"
      title={<FormattedMessage {...messages.errorHeading} />}
    >
      <p style={{ whiteSpace: 'pre-line' }}>
        <FormattedMessage {...messages.errorDescription} />
      </p>
      {repository.owner && (
        <Button
          appearance="link"
          href={urls.ui.smartMirroring(repository.owner.uuid)}
        >
          <FormattedMessage {...messages.errorLink} />
        </Button>
      )}
    </GenericMessage>
  );

  renderInnerContent() {
    const { mirror, repository } = this.props;
    const { hasError, isLoading, mirrorCloneResource } = this.state;

    if (hasError) {
      return this.renderError(repository, mirror);
    }

    if (isLoading) {
      return <Spinner size="small" />;
    }

    if (mirrorCloneResource) {
      const repositoryWithMirrorLinks = this.repositoryWithMirrorLinks(
        repository,
        mirrorCloneResource
      );
      const cloneUrlProtocol = this.getProtocolForComponent(
        mirrorCloneResource
      );

      return (
        // allow `http` in repository mirror clone URLs
        // @ts-ignore This might pass http into protocol or repository
        <CloneUrl
          isCloneCommandSelected={false}
          protocol={cloneUrlProtocol}
          repository={repositoryWithMirrorLinks}
        />
      );
    }

    return null;
  }

  render() {
    const MirrorLabel = styled.h4`
      margin-bottom: ${gridSize() / 2}px;
    `;

    return (
      <Fragment>
        <MirrorLabel>{this.props.mirror.name}</MirrorLabel>
        {this.renderInnerContent()}
      </Fragment>
    );
  }
}
