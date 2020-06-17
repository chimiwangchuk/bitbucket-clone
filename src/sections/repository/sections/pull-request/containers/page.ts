import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { get } from 'lodash-es';
import { uncurlyUuid } from '@atlassian/bitkit-analytics';

import { BucketState, Dispatch } from 'src/types/state';
import {
  ENTERED_CODE_REVIEW,
  EXITED_CODE_REVIEW,
  PULL_REQUEST_OPENED,
} from 'src/redux/pull-request/actions';
import {
  getCurrentPullRequest,
  getIsCorrectPullRequest,
} from 'src/redux/pull-request/selectors';
import {
  toPullRequestLocator,
  areLocatorsEqual,
} from 'src/redux/pull-request/selectors/locator-utils';
import urls from 'src/redux/pull-request/urls';
import { PullRequestPage, PullRequestPageProps } from '../components/page';

type RouteParams = {
  repositoryOwner: string;
  repositorySlug: string;
  pullRequestId: string;
};

type PageProps = PullRequestPageProps & RouteComponentProps<RouteParams>;

// @ts-ignore TODO: fix noImplicitAny error here
const mapDispatchToProps = dispatch => ({
  dispatch,
  onExitPage: () => dispatch({ type: EXITED_CODE_REVIEW }),
  onPullRequestOpened: () => dispatch({ type: PULL_REQUEST_OPENED }),
});

export function mapStateToProps(state: BucketState, ownProps: PageProps) {
  const routePRLocator = toPullRequestLocator(ownProps.match.params);

  // State is ready if it holds data for the PR specified by the current route
  const pullRequestStateReady = getIsCorrectPullRequest(
    state,
    ownProps.match.params
  );

  const { owner, slug, id } = routePRLocator;
  const oldPullRequestUrl = id
    ? urls.ui.oldpullrequest(owner, slug, id)
    : urls.ui.pullrequests(owner, slug);

  // For analytics
  const statePR = getCurrentPullRequest(state);
  const destinationUuid = get(statePR, 'destination.repository.uuid', '');
  const destRepoOwnerUuid = get(
    statePR,
    'destination.repository.owner.uuid',
    ''
  );
  const sourceUuid = get(statePR, 'source.repository.uuid', '');

  // Sending as an object because none of these values can change
  // independently of the whole PR changing
  const factProperties = {
    to_repository_uuid: uncurlyUuid(destinationUuid),
    to_repository_owner_uuid: destRepoOwnerUuid
      ? uncurlyUuid(destRepoOwnerUuid)
      : undefined,
    from_repository_uuid: uncurlyUuid(sourceUuid),
    pull_request_id: id,
  };

  return {
    factProperties,
    isBrowserMsie11: state.global.isBrowserMsie11,
    oldPullRequestUrl,
    pullRequestStateReady,
  };
}

export function mergeProps(
  stateProps: PullRequestPageProps,
  dispatchProps: { dispatch: Dispatch },
  ownProps: PageProps
) {
  const { dispatch } = dispatchProps;

  const routePRLocator = toPullRequestLocator(ownProps.match.params);
  // Binding routePRLocator to action, to avoid passing
  // those props to the component (which doesn't need them)
  const dispatchEnteredCodeReview = () =>
    dispatch({
      type: ENTERED_CODE_REVIEW,
      ...routePRLocator,
    });

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    dispatchEnteredCodeReview,
  };
}

// @ts-ignore TODO: fix noImplicitAny error here
function areOwnPropsEqual({ match: prevMatch }, { match: nextMatch }): boolean {
  // The only 'ownProp' we care about is the route params in the match
  // object from Router.  Prevent mapStateToProps running (and triggering a
  // re-render of the component) if the route param values haven't actually changed
  return areLocatorsEqual(
    toPullRequestLocator(prevMatch.params),
    toPullRequestLocator(nextMatch.params)
  );
}

function areStatePropsEqual(
  nextStateProps: PullRequestPageProps,
  prevStateProps: PullRequestPageProps
): boolean {
  // Only update the component if `pullRequestStateReady` has changed.
  // State changes will trigger a `mapStateToProps()` run, which creates
  // new object props.  This will prevent those prop changes causing renders.
  return (
    prevStateProps.pullRequestStateReady ===
    nextStateProps.pullRequestStateReady
  );
}

const ConnectedPullRequestPage = connect(
  mapStateToProps,
  mapDispatchToProps,
  // @ts-ignore Confusing typescript error
  mergeProps,
  {
    areOwnPropsEqual,
    areStatePropsEqual,
  }
)(PullRequestPage);
export default ConnectedPullRequestPage;
