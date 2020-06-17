import Button from '@atlaskit/button';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import Spinner from '@atlaskit/spinner';

import {
  initializeJiraIssueCollector,
  issueCollectors,
} from 'src/jira-issue-collectors';
import waitForReactRender from 'src/utils/wait-for-react-render';
import messages from './feedback-button.i18n';

const onLoad = (callback: () => void) => {
  if (document.readyState === 'complete') {
    setTimeout(callback, 0);
  } else {
    window.onload = callback;
  }
};

type FeedbackButtonProps = {
  feedbackKey: string;
};

type FeedbackButtonState = {
  showCollectorDialog?: () => void;
  isLoading: boolean;
};

class FeedbackButton extends PureComponent<
  FeedbackButtonProps,
  FeedbackButtonState
> {
  state = {
    showCollectorDialog: undefined,
    isLoading: false,
  };

  onGiveFeedbackClicked = () => {
    this.setState({ isLoading: true });
    initializeJiraIssueCollector(this.props.feedbackKey);

    onLoad(() => {
      waitForReactRender(() => {
        // this can be undefined if called too early so waiting for react render
        const triggerFunctions = window.__jira_issue_collector_trigger_fns__;

        if (!issueCollectors || !triggerFunctions) {
          this.setState({ isLoading: false });
          return;
        }

        // @ts-ignore TODO: fix noImplicitAny error here
        const collector = issueCollectors[this.props.feedbackKey];

        if (!collector) {
          this.setState({ isLoading: false });
          return;
        }

        this.setState({ showCollectorDialog: triggerFunctions[collector.id] });

        if (this.state.showCollectorDialog) {
          // @ts-ignore
          this.state.showCollectorDialog();
        }
        this.setState({ isLoading: false });
      }, 1500);
    });
  };

  render() {
    const icon = <Spinner size="small" delay={0} />;

    return (
      <Button
        onClick={this.onGiveFeedbackClicked}
        iconBefore={this.state.isLoading ? icon : ''}
      >
        <FormattedMessage {...messages.giveFeedback} />
      </Button>
    );
  }
}

export default FeedbackButton;
