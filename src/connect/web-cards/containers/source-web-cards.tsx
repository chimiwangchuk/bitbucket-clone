import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { get } from 'lodash-es';

import { Repository } from 'src/components/types';
import { getCurrentRepository } from 'src/selectors/repository-selectors';
import { getTargetUserKey } from 'src/selectors/user-selectors';
import AnnotationsCard from 'src/sections/repository/sections/source/containers/annotations-card';
import { SourceObject } from 'src/sections/repository/sections/source/types';
import {
  repositoryTarget,
  commitFileTarget,
  commitDirectoryTarget,
} from 'src/connect/targets';
import { BucketState } from 'src/types/state';
import { WebCards } from '../components/web-cards';

const mapStateToProps = (state: BucketState) => ({
  principalId: getTargetUserKey(state),
  repository: getCurrentRepository(state),
  hash: get(state, 'repository.source.section.hash'),
  sourceObject: state.repository.source.section.sourceObject,
});

type WebCardsProps = {
  principalId?: string;
  repository?: Repository;
  hash?: string;
  isCollapsed?: boolean;
  sourceObject: SourceObject | null | undefined;
};

const SourceWebCards = connect(mapStateToProps)((props: WebCardsProps) => {
  const { principalId, repository, hash, sourceObject, isCollapsed } = props;
  if (!principalId || !repository || !sourceObject || sourceObject.isLoading) {
    return null;
  }
  const [repositoryOwner, repositorySlug] = repository.full_name.split('/');

  const { path, treeEntry } = sourceObject;

  if (path === '') {
    return (
      <WebCards
        principalId={principalId}
        location="org.bitbucket.source"
        isCollapsed={isCollapsed}
        target={repositoryTarget({
          repositoryOwner,
          repositorySlug,
        })}
      />
    );
  }

  if (path && hash && treeEntry) {
    if (treeEntry.type === 'directory') {
      return (
        <WebCards
          principalId={principalId}
          location="org.bitbucket.source.directory"
          isCollapsed={isCollapsed}
          target={commitDirectoryTarget({
            repositoryOwner,
            repositorySlug,
            path: `${path}/`,
            hash,
          })}
        />
      );
    }

    return (
      <Fragment>
        <AnnotationsCard />
        <WebCards
          principalId={principalId}
          location="org.bitbucket.source.file"
          isCollapsed={isCollapsed}
          target={commitFileTarget({
            repositoryOwner,
            repositorySlug,
            path,
            hash,
          })}
        />
      </Fragment>
    );
  }

  return null;
});

type ConnectedSourceWebCardsProps = { isCollapsed?: boolean };

class ConnectSourceWebCards extends PureComponent<
  ConnectedSourceWebCardsProps
> {
  renderWebCard = (props: RouteComponentProps) => (
    <SourceWebCards {...props} isCollapsed={this.props.isCollapsed} />
  );

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/:repositoryOwner/:repositorySlug/src/:ref/:path+"
          render={this.renderWebCard}
        />
        <Route
          path={[
            '/:repositoryOwner/:repositorySlug/diff/:path+',
            '/:repositoryOwner/:repositorySlug/history/:path+',
            '/:repositoryOwner/:repositorySlug/history-node/:ref/:path+',
            '/:repositoryOwner/:repositorySlug/src/:refOrHash',
          ]}
          render={this.renderWebCard}
        />
      </Switch>
    );
  }
}

export default ConnectSourceWebCards;
