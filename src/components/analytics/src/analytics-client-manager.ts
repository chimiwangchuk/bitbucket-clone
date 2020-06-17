import { Component } from 'react';
import { User } from 'src/components/types';

type Props = {
  analyticsClient: any;
  user?: User;
};

/**
 * Component that initializes the analytics client and handles
 * starting/stopping "UI viewed" events used for EMAU.
 */
export default class AnalyticsClientManager extends Component<Props> {
  // @ts-ignore TODO: fix noImplicitAny error here
  constructor(props) {
    super(props);
    // Do this in the constructor so that the user info is set as early as
    // possible for code that uses it via the `analyticsClient` function.
    this.setUserInfo();
  }

  componentDidMount() {
    this.props.analyticsClient.startUIViewedEvent();
  }

  // @ts-ignore TODO: fix noImplicitAny error here
  componentDidUpdate(prevProps) {
    const { user } = this.props;
    const userId = user ? user.account_id : null;
    const prevUserId = prevProps.user ? prevProps.user.account_id : null;
    if (userId !== prevUserId) {
      this.setUserInfo();
    }
  }

  componentWillUnmount() {
    this.props.analyticsClient.stopUIViewedEvent();
  }

  setUserInfo() {
    const { analyticsClient, user } = this.props;
    if (user && user.account_id) {
      analyticsClient.setUserInfo('atlassianAccount', user.account_id);
    } else {
      analyticsClient.clearUserInfo();
    }
  }

  render() {
    return null;
  }
}
