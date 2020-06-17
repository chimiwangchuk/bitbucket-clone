import React, { PureComponent } from 'react';
import { injectIntl, InjectedIntl } from 'react-intl';
import { Grid, GridColumn } from '@atlaskit/page';
import { MobileHeaderState } from 'src/redux/global/actions/index';
import { FabricRenderer } from 'src/components/fabric-html-renderer';
import urls from 'src/redux/pull-request/urls';
import { getPermalink } from 'src/utils/permalink-helpers';
import ConversationsContext, {
  ConversationsContextInterface,
  buildConversationContext,
} from 'src/contexts/conversations-context';
import ConnectPullRequestViewWebPanels from 'src/connect/web-panels/containers/pr-web-panels';
import { FabricConversation } from 'src/components/conversation-provider/types';
import { FeatureToggle } from 'src/containers/feature-toggle';
import CurrentDiff from '../containers/current-diff';
import GlobalConversation from '../containers/global-pullrequest-conversation';
import Header from '../containers/header';
import { PullRequestDialogZone } from '../containers/pull-request-dialog-zone';
import { AATestWithErrorBoundary } from '../containers/a-a-test';
import { AsyncMergeSection } from './async-merge-section';
import * as styles from './pull-request-details.style';
import CommitList from './commit-list';
import AttachmentsPanel from './attachments';
import messages from './pull-request-details.i18n';

type Props = {
  anchorHash?: string;
  areProfileCardsEnabled: boolean;
  destHash?: string;
  isCommentSpecEnabled?: boolean;
  prDescription: string;
  userAvatarUrl: string | undefined;
  userDisplayName: string | undefined;
  userProfileUrl: string | undefined;
  userUuid: string | undefined;
  // intl is used in setProviders(props)
  intl: InjectedIntl;
  owner: string;
  slug: string;
  pullRequestId: number;
  fabricConversations: FabricConversation[];
  onAddComment: (payload: any) => void;
  onDeleteComment: (payload: any) => void;
  onPermalinkHashChange: (permalink: string) => void;
  updateMobileHeaderState: (nextState: MobileHeaderState) => void;
  isFx3Enabled: boolean;
};

type State = ConversationsContextInterface & {
  previousFabricConversations: FabricConversation[];
};

class PullRequestDetails extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      anchorHash,
      areProfileCardsEnabled,
      destHash,
      isCommentSpecEnabled,
      intl,
      slug,
      owner,
      pullRequestId: id,
      onAddComment,
      onDeleteComment,
      fabricConversations,
      userAvatarUrl,
      userDisplayName,
      userProfileUrl,
      userUuid,
    } = this.props;

    const { commentSave, commentUpdate, commentDelete } = urls.api.v20;
    const newUrls = {
      commentSave: () => commentSave(owner, slug, id),
      commentUpdate: (commentId: number | string) =>
        commentUpdate(owner, slug, id, commentId),
      commentDelete: (commentId: number | string) =>
        commentDelete(owner, slug, id, commentId),
    };

    this.state = {
      ...buildConversationContext({
        ...(isCommentSpecEnabled
          ? { anchor: anchorHash, destRev: destHash }
          : {}),
        areProfileCardsEnabled,
        userAvatarUrl,
        userDisplayName,
        userProfileUrl,
        userUuid,
        urls: newUrls,
        onAddComment,
        onDeleteComment,
        owner,
        slug,
        intl,
        fabricConversations,
      }),
      previousFabricConversations: fabricConversations,
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const { fabricConversations } = props;

    if (state.previousFabricConversations !== fabricConversations) {
      state.conversationProvider.getConversations(fabricConversations);
      return {
        ...state,
        previousFabricConversations: fabricConversations,
      };
    }

    return null;
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.handleHashChange);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  handleHashChange = () => {
    const permalink = getPermalink();
    if (permalink) {
      this.props.updateMobileHeaderState('none');
      this.props.onPermalinkHashChange(permalink);
    }
  };

  renderDescriptionSection = () => {
    const { prDescription, areProfileCardsEnabled, intl } = this.props;
    /* TODO: fix this:
      `tabIndex` should only be declared on interactive elements
    */
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    return (
      prDescription && (
        <section
          aria-label={intl.formatMessage(messages.descriptionLabel)}
          data-qa="pull-request-description"
          tabIndex={0}
        >
          <FabricRenderer
            areProfileCardsEnabled={areProfileCardsEnabled}
            src={prDescription}
            format="html"
          />
        </section>
      )
    );
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
  };

  render() {
    const description = this.renderDescriptionSection();
    const repositoryFullSlug = `${this.props.owner}/${this.props.slug}`;
    const { isFx3Enabled } = this.props;

    return (
      <ConversationsContext.Provider value={this.state}>
        <styles.PullRequest>
          {/* TODO: Remove after A/A test is complete */}
          {isFx3Enabled && <AATestWithErrorBoundary />}
          <Header />
          <Grid spacing="comfortable">
            <GridColumn data-qa="pr-description-grid-column">
              <FeatureToggle feature="merge-pull-requests-async">
                <AsyncMergeSection />
              </FeatureToggle>
              {description}
              <FeatureToggle feature="pr-images">
                <AttachmentsPanel
                  repositoryFullSlug={repositoryFullSlug}
                  pullRequestId={this.props.pullRequestId}
                />
              </FeatureToggle>
              <ConnectPullRequestViewWebPanels />
              <GlobalConversation />
              <CommitList />
            </GridColumn>
          </Grid>

          <Grid layout="fluid" spacing="comfortable">
            <GridColumn>
              <CurrentDiff />
            </GridColumn>
          </Grid>
        </styles.PullRequest>
        <PullRequestDialogZone />
      </ConversationsContext.Provider>
    );
  }
}

export default injectIntl(PullRequestDetails);
