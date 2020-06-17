import React, { Component, ReactNode } from 'react';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
import Button, { ButtonGroup } from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import { Label } from '@atlaskit/field-base';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ModalDialog, { ModalFooter } from '@atlaskit/modal-dialog';
import SectionMessage from '@atlaskit/section-message';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';

import IssueTransitionForm from 'src/sections/repository/sections/pull-request/components/issue-transition-form';
import globalUrls from 'src/urls/global';
import MergeStrategySelect from 'src/sections/repository/components/merge-strategy-select';
import {
  PullRequest,
  PullRequestParticipant,
  Commit as CommitType,
} from 'src/components/types';

import RefBranch from 'src/components/ref-label/src/refs/ref-branch';
import { getName } from 'src/components/user-profile';
import { commonMessages } from 'src/i18n';
import urls from 'src/sections/repository/urls';
import { MergeStrategy, MergeInfo } from 'src/types/pull-request';

import { getMergeStrategyOption } from 'src/sections/repository/utils/merge-strategies';

import {
  IssueTransitionFormRowData,
  PrCommentJiraIssue,
} from 'src/redux/jira/types';
import { publishTrackEvent, publishUiEvent } from 'src/utils/analytics/publish';
import messages from './merge-dialog.i18n';
import * as styles from './merge-dialog.style';

type MergeDialogProps = {
  canCreatePendingMerge: false;
  isMergePending: false;
  approvers: PullRequestParticipant[];
  commits: CommitType[];
  currentPullRequest: PullRequest;
  isErrored: boolean;
  isRequesting: boolean;
  isRequestingPendingMerge: boolean;
  errorMessage: string | null | undefined;
  onClose: () => void;
  mergePullRequest: (info: MergeInfo) => void;
  onCreatePendingMerge: (info: MergeInfo) => void;
  onCancelPendingMerge: () => void;
  transitionIssues: () => void;
  intl: InjectedIntl;
  defaultMergeStrategy?: MergeStrategy | null | undefined;
  mergeInfo: MergeInfo;
  isBannerOpen: boolean;
  stackedPullRequestsCount: number;
  canDeleteSourceBranch: boolean;
  isMergeable: boolean;
  countFailedChecks: number;
  issueTransitionForm: IssueTransitionFormRowData[];
  pullRequestJiraIssues: PrCommentJiraIssue[];
  features: {
    isIssueTransitionOnMergeEnabled: boolean;
  };
};

// State's mergeStrategy is defaulted during constructor, never null
type MergeDialogState = MergeInfo & {
  mergeStrategy: MergeStrategy;
};

class MergeDialog extends Component<MergeDialogProps, MergeDialogState> {
  availableMergeStrategies: MergeStrategy[];

  constructor(props: MergeDialogProps) {
    super(props);
    const { defaultMergeStrategy, currentPullRequest, mergeInfo } = props;

    const branchMergeStrategiesList =
      currentPullRequest.destination.branch.merge_strategies;

    this.availableMergeStrategies = branchMergeStrategiesList;

    let validDefaultMergeStrategy = branchMergeStrategiesList[0] as MergeStrategy;

    if (
      defaultMergeStrategy &&
      branchMergeStrategiesList.includes(defaultMergeStrategy)
    ) {
      validDefaultMergeStrategy = defaultMergeStrategy as MergeStrategy;
    }

    const {
      closeSourceBranch = currentPullRequest.close_source_branch,
      mergeStrategy = validDefaultMergeStrategy || MergeStrategy.MergeCommit,
      message = this.getDefaultCommitMessage(
        validDefaultMergeStrategy || MergeStrategy.MergeCommit
      ),
    }: MergeInfo = mergeInfo;

    this.state = {
      closeSourceBranch,
      mergeStrategy,
      message,
    };
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  componentDidUpdate(prevProps) {
    const { defaultMergeStrategy } = this.props;

    if (!prevProps.defaultMergeStrategy && defaultMergeStrategy) {
      this.updateMergeStrategy(defaultMergeStrategy);
    }
  }

  getDefaultCommitMessage(mergeStrategy: MergeStrategy) {
    if (mergeStrategy === MergeStrategy.FastForward) {
      return '';
    }

    const { approvers, commits, currentPullRequest, intl } = this.props;
    const { id, source, title } = currentPullRequest;

    const mergedInLabel = intl.formatMessage(messages.mergedInLabel);
    const approvedByLabel = intl.formatMessage(messages.approvedByLabel);
    const pullRequestLabel = intl.formatMessage(messages.pullRequestLabel);

    const branchInfo = `${mergedInLabel} ${source && source.branch.name}`;
    const pullRequestInfo = `(${pullRequestLabel} #${id})`;

    let defaultCommitMessage = `${branchInfo} ${pullRequestInfo}\n\n${title}`;

    if (mergeStrategy === MergeStrategy.Squash) {
      // Minor optimization: if there's exactly 1 commit, and the commit
      // message already matches the pull request title, no need to display the
      // same text twice.
      if (commits.length !== 1 || commits[0].message !== title) {
        const commitMessages = commits
          .reverse()
          .map(commit => `* ${commit.message}`)
          .join('\n');
        defaultCommitMessage += `\n\n${commitMessages}`;
      }
    }

    if (approvers.length > 0) {
      const approverInfo = approvers
        .map(approver => `${approvedByLabel} ${getName(approver.user, intl)}`)
        .join('\n');
      defaultCommitMessage += `\n\n${approverInfo}`;
    }

    return defaultCommitMessage;
  }

  submit = () => {
    const { closeSourceBranch, mergeStrategy, message } = this.state;
    const { features, issueTransitionForm, pullRequestJiraIssues } = this.props;
    const numIssuesToTransition = issueTransitionForm.filter(
      transition => transition.shouldTransition
    ).length;

    publishUiEvent({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'mergeButton',
      source: 'pullRequestScreen',
      attributes: {
        prIssuesCount: pullRequestJiraIssues.length,
        prTransitionsCount: numIssuesToTransition,
      },
    });

    if (features.isIssueTransitionOnMergeEnabled && numIssuesToTransition > 0) {
      this.props.transitionIssues();
    }

    this.props.mergePullRequest({
      closeSourceBranch,
      mergeStrategy,
      message,
    });
  };

  createPendingMerge = () => {
    const { closeSourceBranch, mergeStrategy, message } = this.state;
    this.props.onCreatePendingMerge({
      closeSourceBranch,
      mergeStrategy,
      message,
    });
  };

  cancelPendingMerge = () => this.props.onCancelPendingMerge();

  // @ts-ignore TODO: fix noImplicitAny error here
  updateCommitMessage = event => {
    this.setState({ message: event.target.value });
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  updateCloseSourceBranch = event => {
    this.setState({ closeSourceBranch: event.target.checked });
  };

  updateMergeStrategy = (newMergeStrategy: MergeStrategy) => {
    if (newMergeStrategy === this.state.mergeStrategy) {
      return;
    }

    this.setState({
      mergeStrategy: newMergeStrategy,
      message: this.getDefaultCommitMessage(newMergeStrategy),
    });
  };

  // @ts-ignore TODO: fix noImplicitAny error here
  handleMergeStrategyChange = selectedItem => {
    if (selectedItem) {
      this.updateMergeStrategy(selectedItem.value);
    }
  };

  renderMergeWarning = (): ReactNode => {
    const { intl, countFailedChecks } = this.props;

    if (!countFailedChecks) {
      return undefined;
    }

    const actions = [
      {
        key: 'learn-more-link',
        text: (
          <a
            href={globalUrls.external.suggestOrRequireChecksBeforeMerge}
            target="_blank"
          >
            {intl.formatMessage(messages.mergeWarningLinkText)}
          </a>
        ),
      },
    ];

    return (
      <SectionMessage
        actions={actions}
        appearance="warning"
        title={intl.formatMessage(messages.mergeWarningTitle, {
          countFailedChecks,
        })}
      >
        <styles.MergeWarningText>
          <p>{intl.formatMessage(messages.mergeWarningText)}</p>
        </styles.MergeWarningText>
      </SectionMessage>
    );
  };

  renderMergeButton = () => {
    const {
      isRequesting,
      isRequestingPendingMerge,
      isMergePending,
      intl,
    } = this.props;
    return (
      <Button
        appearance="primary"
        isDisabled={isRequesting || isRequestingPendingMerge || isMergePending}
        isLoading={isRequesting}
        label={intl.formatMessage(messages.mergePullRequestAction)}
        onClick={this.submit}
      >
        <styles.InnerButtonText data-qa="merge-dialog-merge-button">
          <FormattedMessage {...messages.mergePullRequestAction} />
        </styles.InnerButtonText>
      </Button>
    );
  };

  renderDisabledEnforcedMergeButton = () => (
    <Tooltip
      position="top"
      content={
        <styles.TooltipContent>
          {this.props.intl.formatMessage(messages.mergeWarningTooltip)}
        </styles.TooltipContent>
      }
    >
      <Button
        appearance="primary"
        isDisabled
        label={this.props.intl.formatMessage(messages.mergePullRequestAction)}
        onClick={this.submit}
      >
        <styles.InnerButtonText data-qa="merge-dialog-merge-button">
          <FormattedMessage {...messages.mergePullRequestAction} />
        </styles.InnerButtonText>
      </Button>
    </Tooltip>
  );

  render() {
    const {
      canCreatePendingMerge,
      currentPullRequest,
      errorMessage,
      isErrored,
      isMergePending,
      isRequesting,
      intl,
      onClose,
      isBannerOpen,
      stackedPullRequestsCount,
      canDeleteSourceBranch,
      features,
      isMergeable,
      pullRequestJiraIssues,
    } = this.props;

    const { source, destination } = currentPullRequest;

    const MergeWhenReadyMessage = () => (
      <SectionMessage
        appearance="warning"
        title={intl.formatMessage(messages.createPendingMergeHeading)}
        actions={[
          {
            key: 'create',
            onClick: this.createPendingMerge,
            text: intl.formatMessage(messages.createPendingMergeAction),
          },
        ]}
      >
        <FormattedMessage
          tagName="p"
          {...messages.createPendingMergeDescription}
        />
      </SectionMessage>
    );

    const MergePendingMessage = () => (
      <SectionMessage
        appearance="info"
        title={intl.formatMessage(messages.cancelPendingMergeHeading)}
        actions={[
          {
            key: 'cancel',
            onClick: this.cancelPendingMerge,
            text: intl.formatMessage(messages.cancelPendingMergeAction),
          },
        ]}
      >
        <FormattedMessage
          tagName="p"
          {...messages.cancelPendingMergeDescription}
        />
      </SectionMessage>
    );

    const closeBranchMessage = () => {
      if (stackedPullRequestsCount > 0 && source.repository) {
        const [owner, slug] = source.repository.full_name.split('/');
        return (
          <FormattedMessage
            {...messages.closeSourceBranchAndRetargetStackedPullRequests}
            values={{
              stackedPullRequests: (
                <a
                  target="_blank"
                  href={urls.ui.pullRequestsTargetingBranch(
                    owner,
                    slug,
                    source.branch.name
                  )}
                >
                  <FormattedMessage
                    {...messages.stackedPullRequestsLink}
                    values={{
                      count: stackedPullRequestsCount,
                    }}
                  />
                </a>
              ),
            }}
          />
        );
      } else {
        return <FormattedMessage {...messages.closeSourceBranch} />;
      }
    };

    const Footer = () => (
      <ModalFooter>
        <div>
          <Checkbox
            isChecked={canDeleteSourceBranch && this.state.closeSourceBranch}
            isDisabled={
              !canDeleteSourceBranch || isMergePending || isRequesting
            }
            label={closeBranchMessage()}
            onChange={this.updateCloseSourceBranch}
            name="close-source-branch-checkbox"
            value={intl.formatMessage(messages.closeSourceBranch)}
          />
        </div>
        <ButtonGroup>
          {!isMergeable
            ? this.renderDisabledEnforcedMergeButton()
            : this.renderMergeButton()}
          <Button
            appearance="subtle"
            onClick={onClose}
            isDisabled={isRequesting}
            label={intl.formatMessage(commonMessages.cancel)}
          >
            <FormattedMessage {...commonMessages.cancel} />
          </Button>
        </ButtonGroup>
      </ModalFooter>
    );

    return (
      <ModalDialog
        autoFocus={!(isMergePending || canCreatePendingMerge)}
        heading={<FormattedMessage {...messages.mergeDialogTitle} />}
        onClose={onClose}
        onOpenComplete={() => {
          publishTrackEvent({
            action: 'viewed',
            actionSubject: 'mergeDialog',
            actionSubjectId: 'pullRequestMergeDialog',
            source: 'pullRequestScreen',
            attributes: {
              prIssuesCount: pullRequestJiraIssues.length,
            },
          });

          if (
            features.isIssueTransitionOnMergeEnabled &&
            pullRequestJiraIssues.length > 0
          ) {
            publishTrackEvent({
              action: 'viewed',
              actionSubject: 'issueTransitionForm',
              actionSubjectId: 'mergeDialogIssueTransitionForm',
              source: 'pullRequestScreen',
              attributes: {
                prIssuesCount: pullRequestJiraIssues.length,
              },
            });
          }
        }}
        footer={Footer}
        width="medium"
      >
        {this.renderMergeWarning()}
        {isMergePending && <MergePendingMessage />}
        {canCreatePendingMerge && <MergeWhenReadyMessage />}
        <Label label={intl.formatMessage(messages.sourceBranch)} />
        <RefBranch isFluidWidth name={source && source.branch.name} />
        <Label label={intl.formatMessage(messages.destinationBranch)} />
        <RefBranch isFluidWidth name={destination && destination.branch.name} />
        <FieldTextAreaStateless
          id="merge-dialog-commit-message-textfield"
          label={intl.formatMessage(messages.mergeDialogCommitMessageLabel)}
          disabled={
            this.state.mergeStrategy === MergeStrategy.FastForward ||
            isMergePending ||
            isRequesting
          }
          minimumRows={5}
          onChange={this.updateCommitMessage}
          shouldFitContainer
          enableResize
          value={this.state.message}
        />

        {this.availableMergeStrategies.length > 1 && (
          <MergeStrategySelect
            isBannerOpen={isBannerOpen}
            defaultValue={getMergeStrategyOption(
              this.state.mergeStrategy,
              intl
            )}
            isDisabled={isMergePending || isRequesting}
            mergeStrategies={this.availableMergeStrategies}
            onChange={this.handleMergeStrategyChange}
          />
        )}
        {features.isIssueTransitionOnMergeEnabled &&
          pullRequestJiraIssues.length > 0 && (
            <IssueTransitionForm
              pullRequestJiraIssues={pullRequestJiraIssues}
            />
          )}

        {isErrored && (
          <styles.MergeErrorMessage>
            <WarningIcon
              size="medium"
              primaryColor={colors.Y300}
              label={errorMessage || ''}
            />
            {errorMessage}
          </styles.MergeErrorMessage>
        )}
      </ModalDialog>
    );
  }
}

export default injectIntl(MergeDialog);
